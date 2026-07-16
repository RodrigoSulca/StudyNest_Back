const multimediaService = require('../services/multimedia.service');

class MultimediaController {
  async upload(req, res, next) {
    try {
      const result = await multimediaService.upload(req.files, req.params.anuncio_id, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByAnuncioId(req, res, next) {
    try {
      const result = await multimediaService.getByAnuncioId(req.params.anuncio_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await multimediaService.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrden(req, res, next) {
    try {
      const result = await multimediaService.updateOrden(req.params.id, req.body.orden, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateEstado(req, res, next) {
    try {
      const result = await multimediaService.updateEstado(req.params.id, req.body.estado);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await multimediaService.delete(req.params.id, req.user.id, req.user.rol);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MultimediaController();
