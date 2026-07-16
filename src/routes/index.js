const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuario.routes');
const anuncioRoutes = require('./anuncio.routes');
const resenaRoutes = require('./resena.routes');
const notificacionRoutes = require('./notificacion.routes');

router.use('/usuarios', usuarioRoutes);
router.use('/anuncios', anuncioRoutes);
router.use('/resenas', resenaRoutes);
router.use('/notificaciones', notificacionRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
