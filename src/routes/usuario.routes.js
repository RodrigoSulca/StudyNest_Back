const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const profileController = require('../controllers/profile.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/registro', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.get('/perfil', authenticate, (req, res, next) => profileController.getProfile(req, res, next));
router.put('/perfil', authenticate, (req, res, next) => profileController.updateProfile(req, res, next));

module.exports = router;
