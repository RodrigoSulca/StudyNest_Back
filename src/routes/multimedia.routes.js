const router = require('express').Router();
const multer = require('multer');
const controller = require('../controllers/multimedia.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/rbac.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/upload/:anuncio_id', authenticate, requireRole('arrendador'), (req, res, next) => {
  upload.array('archivos', 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ mensaje: 'El archivo excede el tamaño máximo de 5MB' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ mensaje: 'Demasiados archivos. Máximo 10 por subida' });
        }
        return res.status(400).json({ mensaje: err.message });
      }
      return res.status(400).json({ mensaje: err.message });
    }
    controller.upload(req, res, next);
  });
});

router.get('/anuncio/:anuncio_id', (req, res, next) => controller.getByAnuncioId(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

router.patch('/:id/orden', authenticate, (req, res, next) => controller.updateOrden(req, res, next));
router.patch('/:id/estado', authenticate, requireRole('administrador'), (req, res, next) => controller.updateEstado(req, res, next));

router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
