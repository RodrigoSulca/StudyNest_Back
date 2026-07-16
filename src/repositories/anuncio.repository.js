const { Op, fn, col, literal } = require('sequelize');
const { Anuncio, Usuario, Multimedia } = require('../models');

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

class AnuncioRepository {
  async create(data) {
    return Anuncio.create(data);
  }

  async findById(id) {
    return Anuncio.findByPk(id, {
      include: [
        { model: Usuario, as: 'arrendador', attributes: ['id', 'nombre', 'correo'] },
        { model: Multimedia, as: 'multimedia', attributes: ['id', 'url_almacenamiento', 'tipo_archivo', 'estado', 'orden'], where: { estado: 'APROBADA' }, required: false },
      ],
    });
  }

  async findByArrendadorId(arrendadorId) {
    return Anuncio.findAll({
      where: { arrendador_id: arrendadorId },
      include: [{ model: Usuario, as: 'arrendador', attributes: ['id', 'nombre', 'correo'] }],
      order: [['fecha_creacion', 'DESC']],
    });
  }

  async search({
    precio_min,
    precio_max,
    tipo_amoblado,
    estado = 'ACTIVO',
    latitud,
    longitud,
    radio,
    busqueda,
    page = 1,
    limit = 10,
    ordenar = 'fecha_creacion',
  }) {
    const where = {};

    if (estado) {
      where.estado = estado;
    }

    if (precio_min || precio_max) {
      where.precio = {};
      if (precio_min) where.precio[Op.gte] = Number(precio_min);
      if (precio_max) where.precio[Op.lte] = Number(precio_max);
    }

    if (tipo_amoblado) {
      where.tipo_amoblado = tipo_amoblado;
    }

    if (busqueda) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${busqueda}%` } },
        { descripcion: { [Op.iLike]: `%${busqueda}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const include = [
      { model: Usuario, as: 'arrendador', attributes: ['id', 'nombre', 'correo'] },
    ];

    const order = [];

    if (latitud && longitud && radio) {
      const lat = Number(latitud);
      const lng = Number(longitud);
      const rad = Number(radio);

      order.push([literal(
        `(6371 * acos(cos(radians(${lat})) * cos(radians(latitud)) * cos(radians(longitud) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitud))))`
      ), 'ASC']);

      where[Op.and] = literal(
        `(6371 * acos(cos(radians(${lat})) * cos(radians(latitud)) * cos(radians(longitud) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitud)))) <= ${rad}`
      );
    } else {
      if (ordenar === 'precio') {
        order.push(['precio', 'ASC']);
      } else {
        order.push(['fecha_creacion', 'DESC']);
      }
    }

    const { rows: anuncios, count: total } = await Anuncio.findAndCountAll({
      where,
      include,
      order,
      limit: Number(limit),
      offset,
    });

    return {
      anuncios,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async update(id, data) {
    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) return null;
    return anuncio.update({ ...data, ultima_actualizacion: new Date() });
  }

  async delete(id) {
    const deleted = await Anuncio.destroy({ where: { id } });
    return deleted > 0;
  }

  async count(filters = {}) {
    return Anuncio.count({ where: filters });
  }
}

module.exports = new AnuncioRepository();
