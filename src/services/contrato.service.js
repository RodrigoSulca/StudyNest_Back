const { Anuncio, Usuario } = require('../models');

function generateContract({ inquilino, arrendador, anuncio, duracion, precio, condiciones }) {
  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 20px; }
        .field { margin: 8px 0; }
        .label { font-weight: bold; }
        .signature-section { margin-top: 60px; display: flex; justify-content: space-around; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; }
      </style>
    </head>
    <body>
      <h1>CONTRATO DE ARRENDAMIENTO</h1>
      
      <h2>Partes</h2>
      <div class="field">
        <span class="label">Arrendador:</span> ${arrendador.nombre} (${arrendador.correo || ''})
      </div>
      <div class="field">
        <span class="label">Inquilino:</span> ${inquilino.nombre} (${inquilino.correo || ''})
      </div>

      <h2>Objeto del Contrato</h2>
      <div class="field">
        <span class="label">Inmueble:</span> ${anuncio.titulo}
      </div>
      <div class="field">
        <span class="label">Dirección:</span> ${anuncio.direccion || 'No especificada'}
      </div>

      <h2>Condiciones</h2>
      <div class="field">
        <span class="label">Mensualidad:</span> $${Number(precio).toLocaleString('es-CO')}
      </div>
      <div class="field">
        <span class="label">Duración:</span> ${duracion} mes(es)
      </div>
      <div class="field">
        <span class="label">Condiciones adicionales:</span>
        <p>${condiciones || 'Sin condiciones adicionales.'}</p>
      </div>

      <h2>Firmas</h2>
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">Arrendador</div>
          <p>${arrendador.nombre}</p>
        </div>
        <div class="signature-box">
          <div class="signature-line">Inquilino</div>
          <p>${inquilino.nombre}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

class ContratoService {
  async generate(usuarioId, { anuncio_id, inquilino_id, duracion_meses, precio_mensual, condiciones }) {
    if (!anuncio_id || !inquilino_id || !duracion_meses || !precio_mensual) {
      const error = new Error('Faltan campos requeridos: anuncio_id, inquilino_id, duracion_meses, precio_mensual');
      error.statusCode = 400;
      throw error;
    }

    const anuncio = await Anuncio.findByPk(anuncio_id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (anuncio.arrendador_id !== usuarioId) {
      const error = new Error('No tienes permiso para generar contratos de este anuncio');
      error.statusCode = 403;
      throw error;
    }

    const arrendador = await Usuario.findByPk(usuarioId);
    const inquilino = await Usuario.findByPk(inquilino_id);
    if (!inquilino) {
      const error = new Error('Inquilino no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const html = generateContract({
      inquilino: inquilino.toJSON(),
      arrendador: arrendador.toJSON(),
      anuncio: anuncio.toJSON(),
      duracion: Number(duracion_meses),
      precio: Number(precio_mensual),
      condiciones,
    });

    return {
      contrato: {
        html,
        metadata: {
          anuncio_id,
          arrendador_id: usuarioId,
          inquilino_id,
          duracion_meses: Number(duracion_meses),
          precio_mensual: Number(precio_mensual),
          fecha_generacion: new Date(),
        },
      },
    };
  }

  async getById(usuarioId, anuncioId, inquilinoId) {
    const anuncio = await Anuncio.findByPk(anuncioId);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const arrendador = await Usuario.findByPk(usuarioId);
    const inquilino = await Usuario.findByPk(inquilinoId);
    if (!inquilino) {
      const error = new Error('Inquilino no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const html = generateContract({
      inquilino: inquilino.toJSON(),
      arrendador: arrendador.toJSON(),
      anuncio: anuncio.toJSON(),
      duracion: 1,
      precio: Number(anuncio.precio),
      condiciones: null,
    });

    return {
      contrato: {
        html,
        metadata: {
          anuncio_id: anuncioId,
          arrendador_id: usuarioId,
          inquilino_id: inquilinoId,
          fecha_generacion: new Date(),
        },
      },
    };
  }
}

module.exports = new ContratoService();
