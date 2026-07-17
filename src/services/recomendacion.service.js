const { Anuncio, Resena, Multimedia } = require('../models');
const preferenciaEstudianteRepository = require('../repositories/preferencia_estudiante.repository');
const recomendacionIARepository = require('../repositories/recomendacion_ia.repository');

const RECOMENDACION_CACHE_HOURS = 24;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculatePriceScore(precio, prefMin, prefMax) {
  if (!prefMin && !prefMax) return 15;
  const min = Number(prefMin) || 0;
  const max = Number(prefMax) || Infinity;
  const p = Number(precio);
  if (p >= min && p <= max) return 30;
  const diff = p < min ? min - p : p - max;
  const maxDiff = (max !== Infinity ? max : min * 2) * 0.5;
  if (maxDiff === 0) return 0;
  return Math.max(0, Math.round(30 - (diff / maxDiff) * 30));
}

function calculateLocationScore(anuncioLat, anuncioLng, prefLat, prefLng) {
  if (!anuncioLat || !anuncioLng || !prefLat || !prefLng) return 15;
  const dist = haversineDistance(
    Number(prefLat), Number(prefLng),
    Number(anuncioLat), Number(anuncioLng)
  );
  if (dist <= 0.5) return 30;
  if (dist <= 2) return 25;
  if (dist <= 5) return 20;
  if (dist <= 10) return 15;
  if (dist <= 20) return 10;
  return Math.max(0, Math.round(30 - dist));
}

function calculateServicesScore(serviciosIncluidos, serviciosDeseados) {
  if (!serviciosDeseados || !serviciosIncluidos) return 10;
  const deseados = serviciosDeseados.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (deseados.length === 0) return 10;
  const incluidos = serviciosIncluidos.split(',').map(s => s.trim().toLowerCase());
  let matches = 0;
  for (const d of deseados) {
    if (incluidos.some(i => i.includes(d) || d.includes(i))) matches++;
  }
  return Math.round((matches / deseados.length) * 20);
}

function calculateRatingScore(avgRating) {
  const r = Number(avgRating) || 0;
  return Math.round(r * 4);
}

class RecomendacionService {
  async getRecomendaciones(usuarioId) {
    const preferencia = await preferenciaEstudianteRepository.findByUsuarioId(usuarioId);

    const cached = await this._getValidCache(usuarioId);
    if (cached) {
      return { recomendaciones: cached };
    }

    const anuncios = await Anuncio.findAll({
      where: { estado: 'ACTIVO' },
      include: [
        { model: Multimedia, as: 'multimedia', where: { estado: 'APROBADA' }, required: false },
      ],
    });

    const prefLat = preferencia ? Number(preferencia.ubicacion_preferida) : null;
    const prefLng = preferencia && preferencia.universidad_cercana ? Number(preferencia.universidad_cercana) : null;

    const scored = [];
    for (const anuncio of anuncios) {
      const priceScore = calculatePriceScore(
        anuncio.precio,
        preferencia ? preferencia.precio_minimo : null,
        preferencia ? preferencia.precio_maximo : null
      );

      const locationScore = calculateLocationScore(
        anuncio.latitud, anuncio.longitud,
        anuncio.latitud ? Number(anuncio.latitud) : null,
        anuncio.longitud ? Number(anuncio.longitud) : null
      );

      const servicesScore = calculateServicesScore(
        anuncio.servicios_incluidos,
        preferencia ? preferencia.servicios_deseados : null
      );

      let ratingScore = 0;
      try {
        const ratingResult = await Resena.findOne({
          attributes: [
            [require('sequelize').fn('AVG', require('sequelize').col('calificacion')), 'promedio'],
          ],
          where: { alojamiento_id: anuncio.id, estado: 'ACTIVA' },
          raw: true,
        });
        ratingScore = calculateRatingScore(ratingResult ? ratingResult.promedio : 0);
      } catch (e) {
        ratingScore = 0;
      }

      const totalScore = priceScore + locationScore + servicesScore + ratingScore;

      let tipo = 'PREFERENCIA';
      if (priceScore >= 25) tipo = 'PRECIO';
      else if (locationScore >= 25) tipo = 'UBICACION';

      scored.push({
        anuncio,
        score: totalScore,
        tipo,
      });
    }

    scored.sort((a, b) => b.score - a.score);
    const top10 = scored.slice(0, 10);

    await this._saveRecommendations(usuarioId, top10);

    return {
      recomendaciones: top10.map(r => ({
        anuncio: r.anuncio,
        score: r.score,
        tipo: r.tipo,
      })),
    };
  }

  async _getValidCache(usuarioId) {
    try {
      const latest = await recomendacionIARepository.findLatestByUsuarioId(usuarioId);
      if (!latest) return null;

      const hoursDiff = (Date.now() - new Date(latest.fecha_generacion).getTime()) / (1000 * 60 * 60);
      if (hoursDiff > RECOMENDACION_CACHE_HOURS) return null;

      const cached = await recomendacionIARepository.findByUsuarioId(usuarioId);
      const anuncioIds = cached.map(c => c.anuncio_id);
      const anuncios = await Anuncio.findAll({
        where: { id: anuncioIds, estado: 'ACTIVO' },
      });

      return cached.map(c => ({
        anuncio: anuncios.find(a => a.id === c.anuncio_id) || null,
        score: Number(c.score_relevancia),
        tipo: c.tipo_recomendacion,
      })).filter(r => r.anuncio);
    } catch (e) {
      return null;
    }
  }

  async _saveRecommendations(usuarioId, results) {
    try {
      await recomendacionIARepository.deleteByUsuarioId(usuarioId);
      const records = results.map(r => ({
        usuario_id: usuarioId,
        anuncio_id: r.anuncio.id,
        score_relevancia: r.score,
        fecha_generacion: new Date(),
        tipo_recomendacion: r.tipo,
      }));
      await recomendacionIARepository.createBulk(records);
    } catch (e) {
      console.error('Error al guardar recomendaciones:', e);
    }
  }
}

module.exports = new RecomendacionService();
