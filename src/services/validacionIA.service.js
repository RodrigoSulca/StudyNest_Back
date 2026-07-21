const path = require('path');

// Validación de imágenes con CLIP corriendo 100% local (transformers.js + ONNX).
// No requiere token ni servicio externo. El modelo se descarga una sola vez
// al directorio de caché y luego funciona offline.

const MODELO = process.env.IA_MODELO || 'Xenova/clip-vit-base-patch32';
// Umbral mínimo de confianza (fracción 0..1) para aprobar automáticamente.
const UMBRAL = parseFloat(process.env.IA_UMBRAL_CONFIANZA || '0.5');
// Caché persistente fuera de node_modules (sobrevive a reinstalaciones).
const CACHE_DIR = path.join(__dirname, '../..', '.ia-cache');

// Etiquetas candidatas para la clasificación zero-shot con CLIP.
// esInmueble = true significa que la foto corresponde a un alojamiento válido.
const ETIQUETAS = [
  { texto: 'a photo of an indoor room or bedroom', esInmueble: true },
  { texto: 'a photo of a house exterior', esInmueble: true },
  { texto: 'a photo of an apartment building', esInmueble: true },
  { texto: 'a meme, cartoon, person, face or unrelated object', esInmueble: false },
];

// Resultado usado cuando la IA no pudo analizar la imagen (modelo no disponible,
// sin internet en la primera descarga, error de inferencia). La imagen queda
// PENDIENTE para moderación manual.
const PENDIENTE_SIN_ANALISIS = { analizado: false, estado: 'PENDIENTE' };

// Singleton: el modelo se carga una sola vez y se mantiene en memoria
// (táctica de "cacheo del modelo" del ADR).
let clasificadorPromise = null;

function obtenerClasificador() {
  if (!clasificadorPromise) {
    clasificadorPromise = (async () => {
      // @xenova/transformers es ESM; se importa dinámicamente desde CommonJS.
      const { pipeline, env } = await import('@xenova/transformers');
      env.cacheDir = CACHE_DIR;
      return pipeline('zero-shot-image-classification', MODELO);
    })().catch((error) => {
      clasificadorPromise = null; // permite reintentar en la próxima llamada
      throw error;
    });
  }
  return clasificadorPromise;
}

class ValidacionIAService {
  // Precarga el modelo al arrancar el servidor para que la primera subida no espere.
  async precargar() {
    try {
      await obtenerClasificador();
      console.log('[validacionIA] Modelo CLIP cargado y listo.');
    } catch (error) {
      console.warn('[validacionIA] No se pudo precargar el modelo (se reintentará al validar):', error.message);
    }
  }

  /**
   * Valida una imagen contra CLIP (zero-shot) de forma local.
   * @param {string} rutaAbsoluta Ruta en disco del archivo a analizar.
   * @returns {Promise<{analizado: boolean, estado: string, etiqueta_detectada?: string, score_confianza?: number, decision_automatica?: string}>}
   */
  async validarImagen(rutaAbsoluta) {
    try {
      const clasificador = await obtenerClasificador();
      const resultado = await clasificador(rutaAbsoluta, ETIQUETAS.map((e) => e.texto));

      if (!Array.isArray(resultado) || resultado.length === 0) {
        console.warn('[validacionIA] Respuesta inesperada del modelo:', resultado);
        return PENDIENTE_SIN_ANALISIS;
      }

      // El pipeline devuelve las etiquetas ordenadas por score descendente.
      const ganadora = resultado[0];
      const etiqueta = ganadora.label;
      const score = typeof ganadora.score === 'number' ? ganadora.score : 0;
      const esInmueble = ETIQUETAS.find((e) => e.texto === etiqueta)?.esInmueble ?? false;

      let estado;
      let decision;
      if (!esInmueble) {
        // Contenido no relacionado con un alojamiento (meme, persona, spam).
        estado = 'RECHAZADA';
        decision = 'RECHAZADA';
      } else if (score >= UMBRAL) {
        estado = 'APROBADA';
        decision = 'ACEPTADA';
      } else {
        // Parece un inmueble pero con baja confianza: lo mandamos a revisión manual.
        estado = 'PENDIENTE';
        decision = 'ACEPTADA';
      }

      return {
        analizado: true,
        estado,
        etiqueta_detectada: etiqueta,
        score_confianza: Number((score * 100).toFixed(2)),
        decision_automatica: decision,
      };
    } catch (error) {
      console.error('[validacionIA] Error al validar la imagen:', error.message);
      return PENDIENTE_SIN_ANALISIS;
    }
  }
}

module.exports = new ValidacionIAService();
