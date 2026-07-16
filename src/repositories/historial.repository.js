const { HistorialModeracion } = require('../models');

class HistorialModeracionRepository {
  async create(data) {
    return HistorialModeracion.create(data);
  }

  async findByResenaId(resenaId) {
    return HistorialModeracion.findAll({
      where: { resena_id: resenaId },
      order: [['fecha_accion', 'DESC']],
    });
  }
}

module.exports = new HistorialModeracionRepository();
