const { Usuario } = require('../models');

class UsuarioRepository {
  async create(data) {
    return Usuario.create(data);
  }

  async findByCorreo(correo) {
    return Usuario.findOne({ where: { correo } });
  }

  async findById(id) {
    return Usuario.findByPk(id);
  }

  async update(id, data) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    return usuario.update(data);
  }

  async findByRol(rol) {
    return Usuario.findAll({ where: { rol } });
  }
}

module.exports = new UsuarioRepository();
