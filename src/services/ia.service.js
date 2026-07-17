const recomendacionService = require('./recomendacion.service');
const chatbotService = require('./chatbot.service');
const contratoService = require('./contrato.service');
const busquedaNaturalService = require('./busqueda-natural.service');
const sugerenciasService = require('./sugerencias.service');
const preferenciaEstudianteService = require('./preferencia_estudiante.service');

class IAService {
  async getRecomendaciones(usuarioId) {
    return recomendacionService.getRecomendaciones(usuarioId);
  }

  async chatbot(usuarioId, mensaje) {
    return chatbotService.procesarMensaje(usuarioId, mensaje);
  }

  async getChatbotHistorial(usuarioId, page, limit) {
    return chatbotService.getHistorial(usuarioId, page, limit);
  }

  async generarContrato(usuarioId, data) {
    return contratoService.generate(usuarioId, data);
  }

  async getContrato(usuarioId, contratoId, inquilinoId) {
    return contratoService.getById(usuarioId, contratoId, inquilinoId);
  }

  async busquedaNatural(usuarioId, consulta) {
    return busquedaNaturalService.search(usuarioId, consulta);
  }

  async getSugerencias(usuarioId, anuncioId) {
    return sugerenciasService.getSugerencias(usuarioId, anuncioId);
  }

  async getPreferencias(usuarioId) {
    return preferenciaEstudianteService.get(usuarioId);
  }

  async savePreferencias(usuarioId, data) {
    return preferenciaEstudianteService.save(usuarioId, data);
  }
}

module.exports = new IAService();
