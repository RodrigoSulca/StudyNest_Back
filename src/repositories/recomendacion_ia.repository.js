const { Op } = require('sequelize');
const { RecomendacionIA } = require('../models');

class RecomendacionIARepository {
  async create(data) {
    return RecomendacionIA.create(data);
  }

  async createBulk(data) {
    return RecomendacionIA.bulkCreate(data);
  }

  async findByUsuarioId(usuarioId) {
    return RecomendacionIA.findAll({
      where: { usuario_id: usuarioId },
      order: [['score_relevancia', 'DESC']],
    });
  }

  async findLatestByUsuarioId(usuarioId) {
    const records = await RecomendacionIA.findAll({
      where: { usuario_id: usuarioId },
      order: [['fecha_generacion', 'DESC']],
      limit: 1,
    });
    return records.length > 0 ? records[0] : null;
  }

  async deleteByUsuarioId(usuarioId) {
    return RecomendacionIA.destroy({
      where: { usuario_id: usuarioId },
    });
  }
}

module.exports = new RecomendacionIARepository();
