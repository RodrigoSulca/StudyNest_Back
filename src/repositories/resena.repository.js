const { Op, fn, col } = require('sequelize');
const { Resena, Usuario, Anuncio } = require('../models');

class ResenaRepository {
  async create(data) {
    return Resena.create(data);
  }

  async findById(id) {
    return Resena.findByPk(id, {
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombre', 'correo', 'rol'] },
        { model: Anuncio, as: 'alojamiento', attributes: ['id', 'titulo', 'direccion', 'arrendador_id'] },
      ],
    });
  }

  async findByAlojamientoId(alojamientoId, { page = 1, limit = 10, ordenar = 'fecha' } = {}) {
    const offset = (Number(page) - 1) * Number(limit);

    const order = ordenar === 'calificacion'
      ? [['calificacion', 'DESC']]
      : [['fecha_publicacion', 'DESC']];

    const { rows: resenas, count: total } = await Resena.findAndCountAll({
      where: { alojamiento_id: alojamientoId },
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombre', 'correo'] },
      ],
      order,
      limit: Number(limit),
      offset,
    });

    return {
      resenas,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findByUsuarioId(usuarioId) {
    return Resena.findAll({
      where: { usuario_id: usuarioId },
      include: [
        { model: Anuncio, as: 'alojamiento', attributes: ['id', 'titulo', 'direccion'] },
      ],
      order: [['fecha_publicacion', 'DESC']],
    });
  }

  async countByAlojamientoId(alojamientoId) {
    return Resena.count({ where: { alojamiento_id: alojamientoId } });
  }

  async calculatePromedio(alojamientoId) {
    const result = await Resena.findOne({
      attributes: [[fn('AVG', col('calificacion')), 'promedio'], [fn('COUNT', col('id')), 'total_resenas']],
      where: { alojamiento_id: alojamientoId, estado: 'ACTIVA' },
      raw: true,
    });
    return {
      promedio: result.promedio ? parseFloat(Number(result.promedio).toFixed(1)) : 0,
      total_resenas: parseInt(result.total_resenas, 10),
    };
  }

  async update(id, data) {
    const resena = await Resena.findByPk(id);
    if (!resena) return null;
    return resena.update(data);
  }

  async delete(id) {
    const deleted = await Resena.destroy({ where: { id } });
    return deleted > 0;
  }

  async incrementReportCount(id) {
    const resena = await Resena.findByPk(id);
    if (!resena) return null;
    return resena.increment('reporte_count');
  }
}

module.exports = new ResenaRepository();
