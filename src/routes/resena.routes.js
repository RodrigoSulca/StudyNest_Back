const router = require('express').Router();
const controller = require('../controllers/resena.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/rbac.middleware');

router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/promedio/:alojamiento_id', (req, res, next) => controller.getPromedio(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

router.post('/', authenticate, requireRole('estudiante'), (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));
router.post('/:id/reporte', authenticate, (req, res, next) => controller.report(req, res, next));

router.patch('/:id/moderar', authenticate, requireRole('administrador'), (req, res, next) => controller.moderate(req, res, next));

module.exports = router;
