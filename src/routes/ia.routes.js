const router = require('express').Router();
const controller = require('../controllers/ia.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/rbac.middleware');

router.get('/preferencias', authenticate, (req, res, next) => controller.getPreferencias(req, res, next));
router.post('/preferencias', authenticate, (req, res, next) => controller.savePreferencias(req, res, next));
router.get('/recomendaciones', authenticate, (req, res, next) => controller.getRecomendaciones(req, res, next));
router.post('/chatbot', authenticate, (req, res, next) => controller.chatbot(req, res, next));
router.post('/busqueda-natural', authenticate, (req, res, next) => controller.busquedaNatural(req, res, next));
router.post('/contratos', authenticate, requireRole('arrendador'), (req, res, next) => controller.generarContrato(req, res, next));
router.get('/sugerencias/:anuncio_id', authenticate, (req, res, next) => controller.getSugerencias(req, res, next));
router.get('/contratos/:id', authenticate, (req, res, next) => controller.getContrato(req, res, next));

module.exports = router;
