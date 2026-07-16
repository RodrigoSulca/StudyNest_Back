const resenaService = require('../services/resena.service');

class ResenaController {
  async create(req, res, next) {
    try {
      const result = await resenaService.create(req.user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { alojamiento_id, page, limit, ordenar } = req.query;
      if (!alojamiento_id) {
        return res.status(400).json({ mensaje: 'El parámetro alojamiento_id es requerido' });
      }
      const result = await resenaService.getByAlojamiento(alojamiento_id, { page, limit, ordenar });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await resenaService.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await resenaService.update(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await resenaService.delete(req.params.id, req.user.id, req.user.rol);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async report(req, res, next) {
    try {
      const result = await resenaService.report(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async moderate(req, res, next) {
    try {
      const result = await resenaService.moderate(req.params.id, req.user.id, req.body.accion);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPromedio(req, res, next) {
    try {
      const result = await resenaService.getPromedio(req.params.alojamiento_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResenaController();
