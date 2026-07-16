const anuncioService = require('../services/anuncio.service');

class AnuncioController {
  async create(req, res, next) {
    try {
      const result = await anuncioService.create(req.user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await anuncioService.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const result = await anuncioService.search(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await anuncioService.update(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async changeEstado(req, res, next) {
    try {
      const { estado } = req.body;
      const result = await anuncioService.changeEstado(
        req.params.id,
        req.user.id,
        req.user.rol,
        estado
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await anuncioService.delete(req.params.id, req.user.id, req.user.rol);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnuncioController();
