const authService = require('../services/auth.service');
const { setTokenCookie, clearTokenCookie } = require('../utils/cookie');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      setTokenCookie(res, result.token);
      const { token: _, ...response } = result;
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.cookies.token;
      await authService.logout(token);
      clearTokenCookie(res);
      res.json({ mensaje: 'Sesión cerrada exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
