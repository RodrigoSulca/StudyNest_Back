const { Anuncio, Multimedia, Resena } = require('../models');

function analyzeListing(anuncio, multimedia, resenas) {
  const suggestions = [];

  if (!anuncio.descripcion || anuncio.descripcion.length < 50) {
    suggestions.push({
      tipo: 'DESCRIPCION',
      mensaje: 'Tu descripción es muy corta. Describe la habitación, servicios y zona en detalle.',
      prioridad: 'ALTA',
    });
  }

  if (!multimedia || multimedia.length === 0) {
    suggestions.push({
      tipo: 'FOTOS',
      mensaje: 'Sin fotos es difícil atraer inquilinos. Sube al menos 3 fotos de buena calidad.',
      prioridad: 'ALTA',
    });
  } else if (multimedia.length < 3) {
    suggestions.push({
      tipo: 'FOTOS',
      mensaje: 'Tienes pocas fotos. Se recomienda al menos 5 para mejor conversión.',
      prioridad: 'MEDIA',
    });
  }

  if (!anuncio.latitud || !anuncio.longitud) {
    suggestions.push({
      tipo: 'UBICACION',
      mensaje: 'Agrega coordenadas exactas para que los estudiantes te encuentren fácilmente.',
      prioridad: 'MEDIA',
    });
  }

  if (!anuncio.servicios_incluidos) {
    suggestions.push({
      tipo: 'SERVICIOS',
      mensaje: 'Especifica los servicios incluidos (wifi, agua caliente, etc.).',
      prioridad: 'MEDIA',
    });
  }

  if (!anuncio.tipo_contrato) {
    suggestions.push({
      tipo: 'CONTRATO',
      mensaje: 'Define el tipo de contrato para atraer al público correcto.',
      prioridad: 'BAJA',
    });
  }

  const score = Math.max(0, 100 - suggestions.length * 15);
  return { suggestions, score };
}

class SugerenciasService {
  async getSugerencias(usuarioId, anuncioId) {
    const anuncio = await Anuncio.findByPk(anuncioId, {
      include: [
        { model: Multimedia, as: 'multimedia' },
      ],
    });

    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (anuncio.arrendador_id !== usuarioId) {
      const error = new Error('No tienes permiso para ver sugerencias de este anuncio');
      error.statusCode = 403;
      throw error;
    }

    let resenas = [];
    try {
      resenas = await Resena.findAll({
        where: { alojamiento_id: anuncioId, estado: 'ACTIVA' },
      });
    } catch (e) {
      resenas = [];
    }

    const multimedia = anuncio.multimedia || [];

    const { suggestions, score } = analyzeListing(anuncio, multimedia, resenas);

    return {
      sugerencias: suggestions,
      score,
    };
  }
}

module.exports = new SugerenciasService();
