// Pre-descarga y carga el modelo de validación IA (CLIP) a la caché local.
// Ejecutar una vez con internet:  npm run ia:warmup
require('dotenv').config({ quiet: true });
const validacionIAService = require('../src/services/validacionIA.service');

(async () => {
  console.log('Descargando/cargando el modelo CLIP (solo la primera vez)...');
  await validacionIAService.precargar();
  process.exit(0);
})();
