const router = require('express').Router();
const controller = require('../controllers/notificacion.controller');
const authenticate = require('../middleware/auth.middleware');

router.get('/no-leidas/count', authenticate, (req, res, next) => controller.getNoLeidasCount(req, res, next));
router.get('/preferencias', authenticate, (req, res, next) => controller.getPreferencias(req, res, next));
router.post('/preferencias', authenticate, (req, res, next) => controller.savePreferencias(req, res, next));
router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.patch('/leer-todas', authenticate, (req, res, next) => controller.markAllAsRead(req, res, next));
router.patch('/:id/leer', authenticate, (req, res, next) => controller.markAsRead(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
