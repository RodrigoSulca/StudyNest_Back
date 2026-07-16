const notificacionService = require('../services/notificacion.service');

class NotificacionController {
  async list(req, res, next) {
    try {
      const { page, limit, solo_no_leidas } = req.query;
      const filters = {
        page,
        limit,
        solo_no_leidas: solo_no_leidas === 'true',
      };
      const result = await notificacionService.getByUsuario(req.user.id, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getNoLeidasCount(req, res, next) {
    try {
      const result = await notificacionService.getNoLeidasCount(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const result = await notificacionService.markAsRead(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificacionService.markAllAsRead(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await notificacionService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPreferencias(req, res, next) {
    try {
      const result = await notificacionService.getPreferencias(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async savePreferencias(req, res, next) {
    try {
      const result = await notificacionService.savePreferencias(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificacionController();
