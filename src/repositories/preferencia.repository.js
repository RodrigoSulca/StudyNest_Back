const { PreferenciaNotificacion } = require('../models');

class PreferenciaRepository {
  async findOrCreateByUsuarioId(usuarioId) {
    const [preferencia] = await PreferenciaNotificacion.findOrCreate({
      where: { usuario_id: usuarioId },
      defaults: {
        usuario_id: usuarioId,
        nuevo_anuncio: true,
        cambio_precio: true,
        nueva_resena: true,
        recomendacion: true,
        canal_preferido: 'IN_APP',
        frecuencia: 'INMEDIATA',
      },
    });
    return preferencia;
  }

  async update(usuarioId, data) {
    const [updated] = await PreferenciaNotificacion.update(data, {
      where: { usuario_id: usuarioId },
    });
    if (updated === 0) return null;
    return PreferenciaNotificacion.findOne({ where: { usuario_id: usuarioId } });
  }
}

module.exports = new PreferenciaRepository();
