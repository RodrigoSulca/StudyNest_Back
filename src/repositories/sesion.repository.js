const { Sesion } = require('../models');
const { Op } = require('sequelize');

class SesionRepository {
  async create(data) {
    return Sesion.create(data);
  }

  async deleteByToken(token) {
    return Sesion.destroy({ where: { token } });
  }

  async deleteExpired() {
    return Sesion.destroy({ where: { expiracion: { [Op.lt]: new Date() } } });
  }
}

module.exports = new SesionRepository();
