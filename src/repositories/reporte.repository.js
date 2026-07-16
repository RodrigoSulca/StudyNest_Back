const { ReporteResena } = require('../models');

class ReporteResenaRepository {
  async create(data) {
    return ReporteResena.create(data);
  }

  async findByResenaId(resenaId) {
    return ReporteResena.findAll({
      where: { resena_id: resenaId },
      order: [['fecha_reporte', 'DESC']],
    });
  }

  async findByUsuarioAndResena(usuarioId, resenaId) {
    return ReporteResena.findOne({
      where: { usuario_reporta_id: usuarioId, resena_id: resenaId },
    });
  }
}

module.exports = new ReporteResenaRepository();
