const { Credencial } = require('../models');

class CredencialRepository {
  async create(data) {
    return Credencial.create(data);
  }

  async findByUsuarioId(usuarioId) {
    return Credencial.findOne({ where: { usuario_id: usuarioId } });
  }

  async updateUltimoAcceso(usuarioId) {
    return Credencial.update(
      { ultimo_acceso: new Date() },
      { where: { usuario_id: usuarioId } }
    );
  }
}

module.exports = new CredencialRepository();
