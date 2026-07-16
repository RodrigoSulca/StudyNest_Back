const router = require('express').Router();
const controller = require('../controllers/anuncio.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/rbac.middleware');

router.get('/', (req, res, next) => controller.search(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

router.post('/', authenticate, requireRole('arrendador'), (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.patch('/:id/estado', authenticate, (req, res, next) => controller.changeEstado(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
