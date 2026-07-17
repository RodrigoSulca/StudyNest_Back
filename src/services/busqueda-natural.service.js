const { Anuncio, Usuario, Multimedia } = require('../models');

const serviceMap = {
  wifi: ['wifi', 'internet'],
  agua_caliente: ['agua caliente', 'hot water'],
  amoblado: ['amoblado', 'furnished', 'muebles'],
  parqueadero: ['parqueadero', 'parking', 'garage'],
  gimnasio: ['gimnasio', 'gym'],
  piscina: ['piscina', 'pool'],
  laundry: ['lavanderia', 'laundry', 'lavado'],
};

function parseNaturalQuery(query) {
  const filters = {};
  const q = query.toLowerCase();

  const priceMatch = q.match(/(?:menos de|hasta|under|max|before)\s*(\d+)/);
  if (priceMatch) filters.precio_maximo = parseInt(priceMatch[1], 10);

  const minPriceMatch = q.match(/(?:mas de|desde|over|min|above)\s*(\d+)/);
  if (minPriceMatch) filters.precio_minimo = parseInt(minPriceMatch[1], 10);

  if (q.includes('cerca') || q.includes('near') || q.includes('universidad') || q.includes('uni')) {
    filters.ordenar = 'ubicacion';
  }

  filters.servicios = [];
  for (const [service, keywords] of Object.entries(serviceMap)) {
    if (keywords.some(kw => q.includes(kw))) {
      filters.servicios.push(service);
    }
  }
  if (filters.servicios.length === 0) delete filters.servicios;

  if (q.includes('habitacion') || q.includes('room')) filters.tipo = 'habitacion';
  if (q.includes('departamento') || q.includes('apartment')) filters.tipo = 'departamento';
  if (q.includes('casa') || q.includes('house')) filters.tipo = 'casa';

  return filters;
}

function buildExplanation(filters) {
  const parts = [];
  if (filters.precio_maximo) parts.push(`precio máximo $${filters.precio_maximo}`);
  if (filters.precio_minimo) parts.push(`precio mínimo $${filters.precio_minimo}`);
  if (filters.servicios) parts.push(`servicios: ${filters.servicios.join(', ')}`);
  if (filters.tipo) parts.push(`tipo: ${filters.tipo}`);
  if (filters.ordenar === 'ubicacion') parts.push('ordenado por cercanía');

  if (parts.length === 0) return 'No se detectaron filtros específicos en tu consulta.';
  return `Buscando: ${parts.join('; ')}`;
}

class BusquedaNaturalService {
  async search(usuarioId, consulta) {
    if (!consulta || !consulta.trim()) {
      const error = new Error('La consulta no puede estar vacía');
      error.statusCode = 400;
      throw error;
    }

    const filters = parseNaturalQuery(consulta);

    const where = { estado: 'ACTIVO' };

    if (filters.precio_minimo || filters.precio_maximo) {
      const { Op } = require('sequelize');
      where.precio = {};
      if (filters.precio_minimo) where.precio[Op.gte] = Number(filters.precio_minimo);
      if (filters.precio_maximo) where.precio[Op.lte] = Number(filters.precio_maximo);
    }

    if (filters.servicios) {
      const { Op } = require('sequelize');
      const serviceConditions = filters.servicios.map(s => ({
        servicios_incluidos: { [Op.iLike]: `%${s}%` },
      }));
      if (where[Op.or]) {
        where[Op.and] = [{ [Op.or]: serviceConditions }];
      } else {
        where[Op.or] = serviceConditions;
      }
    }

    const include = [
      { model: Usuario, as: 'arrendador', attributes: ['id', 'nombre', 'correo'] },
      { model: Multimedia, as: 'multimedia', where: { estado: 'APROBADA' }, required: false },
    ];

    const resultados = await Anuncio.findAll({
      where,
      include,
      order: [['fecha_creacion', 'DESC']],
      limit: 20,
    });

    return {
      filtros: filters,
      resultados,
      explicacion: buildExplanation(filters),
    };
  }
}

module.exports = new BusquedaNaturalService();
