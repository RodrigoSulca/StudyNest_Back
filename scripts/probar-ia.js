// Prueba la validación de imágenes con IA SIN necesidad de base de datos.
//
// Uso:
//   npm run ia:probar                      -> analiza todas las imágenes de uploads/
//   npm run ia:probar ruta/foto1.jpg ...   -> analiza las imágenes que le pases
//
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const validacionIAService = require('../src/services/validacionIA.service');

const EXTENSIONES = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function obtenerImagenes() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args.map((p) => path.resolve(p));
  }
  const dir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXTENSIONES.includes(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f));
}

const ICONO = { APROBADA: 'APROBADA  ✅', RECHAZADA: 'RECHAZADA ❌', PENDIENTE: 'PENDIENTE ⏳' };

(async () => {
  const imagenes = obtenerImagenes();
  if (imagenes.length === 0) {
    console.log('No se encontraron imágenes. Pon algunas en uploads/ o pásalas como argumento.');
    process.exit(0);
  }

  console.log(`\nAnalizando ${imagenes.length} imagen(es) con CLIP local (sin base de datos)...\n`);

  for (const img of imagenes) {
    const nombre = path.basename(img);
    if (!fs.existsSync(img)) {
      console.log(`- ${nombre}: (archivo no encontrado)\n`);
      continue;
    }
    const r = await validacionIAService.validarImagen(img);
    console.log(`- ${nombre}`);
    if (r.analizado) {
      console.log(`    Estado:    ${ICONO[r.estado] || r.estado}`);
      console.log(`    Etiqueta:  ${r.etiqueta_detectada}`);
      console.log(`    Confianza: ${r.score_confianza}%\n`);
    } else {
      console.log(`    Estado:    ${ICONO[r.estado] || r.estado} (la IA no pudo analizarla)\n`);
    }
  }

  process.exit(0);
})();
