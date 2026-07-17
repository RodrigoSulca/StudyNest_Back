const iaService = require('../services/ia.service');

class IAController {
  async getRecomendaciones(req, res, next) {
    try {
      const result = await iaService.getRecomendaciones(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async chatbot(req, res, next) {
    try {
      const { mensaje } = req.body;
      const result = await iaService.chatbot(req.user.id, mensaje);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async busquedaNatural(req, res, next) {
    try {
      const { consulta } = req.body;
      const result = await iaService.busquedaNatural(req.user.id, consulta);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async generarContrato(req, res, next) {
    try {
      const result = await iaService.generarContrato(req.user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getContrato(req, res, next) {
    try {
      const { id } = req.params;
      const { inquilino_id } = req.query;
      const result = await iaService.getContrato(req.user.id, id, inquilino_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSugerencias(req, res, next) {
    try {
      const result = await iaService.getSugerencias(req.user.id, req.params.anuncio_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPreferencias(req, res, next) {
    try {
      const result = await iaService.getPreferencias(req.user.id);
      res.json({ preferencias: result });
    } catch (error) {
      next(error);
    }
  }

  async savePreferencias(req, res, next) {
    try {
      const result = await iaService.savePreferencias(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IAController();
