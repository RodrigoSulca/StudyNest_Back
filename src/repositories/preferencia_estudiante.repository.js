const { PreferenciaEstudiante } = require('../models');

class PreferenciaEstudianteRepository {
  async findByUsuarioId(usuarioId) {
    return PreferenciaEstudiante.findOne({
      where: { usuario_id: usuarioId },
    });
  }

  async findOrCreateByUsuarioId(usuarioId, data = {}) {
    const [preferencia, created] = await PreferenciaEstudiante.findOrCreate({
      where: { usuario_id: usuarioId },
      defaults: {
        ...data,
        usuario_id: usuarioId,
        fecha_actualizacion: new Date(),
      },
    });
    return { preferencia, created };
  }

  async update(usuarioId, data) {
    const [updated] = await PreferenciaEstudiante.update(
      { ...data, fecha_actualizacion: new Date() },
      { where: { usuario_id: usuarioId }, returning: true }
    );
    if (updated === 0) return null;
    return this.findByUsuarioId(usuarioId);
  }

  async create(data) {
    return PreferenciaEstudiante.create(data);
  }
}

module.exports = new PreferenciaEstudianteRepository();
