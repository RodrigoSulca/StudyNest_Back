const usuarioRepository = require('../repositories/usuario.repository');

class ProfileService {
  async getProfile(usuarioId) {
    const usuario = await usuarioRepository.findById(usuarioId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      fecha_registro: usuario.fecha_registro,
    };
  }

  async updateProfile(usuarioId, { nombre, correo }) {
    const usuario = await usuarioRepository.findById(usuarioId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (correo && correo !== usuario.correo) {
      const existing = await usuarioRepository.findByCorreo(correo);
      if (existing) {
        const error = new Error('El correo ya está en uso');
        error.statusCode = 409;
        throw error;
      }
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (correo) updateData.correo = correo;

    const updated = await usuarioRepository.update(usuarioId, updateData);
    return {
      id: updated.id,
      nombre: updated.nombre,
      correo: updated.correo,
      rol: updated.rol,
      fecha_registro: updated.fecha_registro,
    };
  }
}

module.exports = new ProfileService();
