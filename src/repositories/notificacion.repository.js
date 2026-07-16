const { Op } = require('sequelize');
const { Notificacion } = require('../models');

class NotificacionRepository {
  async create(data) {
    return Notificacion.create(data);
  }

  async findById(id) {
    return Notificacion.findByPk(id);
  }

  async findByUsuarioId(usuarioId, { page = 1, limit = 10, solo_no_leidas = false } = {}) {
    const offset = (Number(page) - 1) * Number(limit);

    const where = { usuario_id: usuarioId };
    if (solo_no_leidas) {
      where.estado = { [Op.ne]: 'LEIDA' };
    }

    const { rows: notificaciones, count: total } = await Notificacion.findAndCountAll({
      where,
      order: [['fecha_creacion', 'DESC']],
      limit: Number(limit),
      offset,
    });

    return {
      notificaciones,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async countNoLeidas(usuarioId) {
    return Notificacion.count({
      where: {
        usuario_id: usuarioId,
        estado: { [Op.ne]: 'LEIDA' },
      },
    });
  }

  async markAsRead(id) {
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) return null;
    return notificacion.update({ estado: 'LEIDA' });
  }

  async markAllAsRead(usuarioId) {
    const [updated] = await Notificacion.update(
      { estado: 'LEIDA' },
      {
        where: {
          usuario_id: usuarioId,
          estado: { [Op.ne]: 'LEIDA' },
        },
      }
    );
    return updated;
  }

  async delete(id) {
    const deleted = await Notificacion.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = new NotificacionRepository();
