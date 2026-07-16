const { Multimedia, RegistroValidacionIA } = require('../models');

class MultimediaRepository {
  async create(data) {
    return Multimedia.create(data);
  }

  async bulkCreate(data) {
    return Multimedia.bulkCreate(data);
  }

  async findById(id) {
    return Multimedia.findByPk(id, {
      include: [{ model: RegistroValidacionIA, as: 'registros_validacion' }],
    });
  }

  async findByAnuncioId(anuncioId) {
    return Multimedia.findAll({
      where: { anuncio_id: anuncioId },
      order: [['orden', 'ASC'], ['fecha_subida', 'ASC']],
    });
  }

  async updateEstado(id, estado) {
    const multimedia = await Multimedia.findByPk(id);
    if (!multimedia) return null;
    return multimedia.update({ estado });
  }

  async updateOrden(id, orden) {
    const multimedia = await Multimedia.findByPk(id);
    if (!multimedia) return null;
    return multimedia.update({ orden });
  }

  async delete(id) {
    const deleted = await Multimedia.destroy({ where: { id } });
    return deleted > 0;
  }

  async createRegistroValidacion(data) {
    return RegistroValidacionIA.create(data);
  }
}

module.exports = new MultimediaRepository();
