const fs = require('fs');
const path = require('path');
const multimediaRepository = require('../repositories/multimedia.repository');
const validacionIAService = require('./validacionIA.service');
const notificacionService = require('./notificacion.service');
const { Anuncio } = require('../models');

class MultimediaService {
  async upload(files, anuncioId, usuarioId) {
    const anuncio = await Anuncio.findByPk(anuncioId);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (anuncio.arrendador_id !== usuarioId) {
      const error = new Error('No tienes permiso para subir imágenes a este anuncio');
      error.statusCode = 403;
      throw error;
    }

    if (!files || files.length === 0) {
      const error = new Error('No se enviaron archivos');
      error.statusCode = 400;
      throw error;
    }

    const existingMultimedia = await multimediaRepository.findByAnuncioId(anuncioId);
    const baseOrden = existingMultimedia.length > 0
      ? Math.max(...existingMultimedia.map(m => m.orden)) + 1
      : 0;

    // Validación automática con IA (CLIP) por cada imagen, en paralelo.
    // El flujo es síncrono: esperamos el veredicto antes de responder.
    const multimedia = await Promise.all(files.map(async (file, index) => {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      const rutaAbsoluta = path.join(__dirname, '../..', 'uploads', file.filename);

      const validacion = await validacionIAService.validarImagen(rutaAbsoluta);

      const media = await multimediaRepository.create({
        anuncio_id: anuncioId,
        url_almacenamiento: `/uploads/${file.filename}`,
        tipo_archivo: ext,
        estado: validacion.estado,
        fecha_subida: new Date(),
        orden: baseOrden + index,
      });

      // Registro de auditoría solo cuando la IA efectivamente analizó la imagen.
      if (validacion.analizado) {
        await multimediaRepository.createRegistroValidacion({
          multimedia_id: media.id,
          etiqueta_detectada: validacion.etiqueta_detectada,
          score_confianza: validacion.score_confianza,
          decision_automatica: validacion.decision_automatica,
          fecha_analisis: new Date(),
        });
      }

      return media;
    }));

    // Aviso al arrendador si la IA rechazó automáticamente alguna imagen (best-effort).
    const rechazadas = multimedia.filter(m => m.estado === 'RECHAZADA').length;
    if (rechazadas > 0) {
      this._notificarRechazo(usuarioId, anuncio, rechazadas);
    }

    return { multimedia };
  }

  async _notificarRechazo(usuarioId, anuncio, cantidad) {
    try {
      await notificacionService.create(
        usuarioId,
        'SISTEMA',
        'IN_APP',
        'Imágenes rechazadas automáticamente',
        `La validación por IA rechazó ${cantidad} ${cantidad === 1 ? 'imagen' : 'imágenes'} de tu anuncio "${anuncio.titulo}" por no corresponder a un alojamiento.`
      );
    } catch (error) {
      console.error('Error al notificar rechazo de multimedia:', error.message);
    }
  }

  async getByAnuncioId(anuncioId, usuario) {
    const multimedia = await multimediaRepository.findByAnuncioId(anuncioId);

    // El dueño del anuncio y los administradores ven todas las imágenes
    // (incluidas las rechazadas, para poder reemplazarlas o moderarlas).
    // El público general no ve las imágenes rechazadas por la IA.
    const anuncio = await Anuncio.findByPk(anuncioId);
    const esDueno = usuario && anuncio && usuario.id === anuncio.arrendador_id;
    const esAdmin = usuario && usuario.rol === 'administrador';

    const visibles = esDueno || esAdmin
      ? multimedia
      : multimedia.filter(m => m.estado !== 'RECHAZADA');

    return { multimedia: visibles };
  }

  async getById(id) {
    const multimedia = await multimediaRepository.findById(id);
    if (!multimedia) {
      const error = new Error('Multimedia no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return { multimedia };
  }

  async updateOrden(id, orden, usuarioId) {
    const multimedia = await multimediaRepository.findById(id);
    if (!multimedia) {
      const error = new Error('Multimedia no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const anuncio = await Anuncio.findByPk(multimedia.anuncio_id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (anuncio.arrendador_id !== usuarioId) {
      const error = new Error('No tienes permiso para modificar el orden de esta imagen');
      error.statusCode = 403;
      throw error;
    }

    await multimediaRepository.updateOrden(id, orden);
    return { mensaje: 'Orden actualizado exitosamente' };
  }

  async updateEstado(id, estado) {
    const multimedia = await multimediaRepository.findById(id);
    if (!multimedia) {
      const error = new Error('Multimedia no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const estadosValidos = ['APROBADA', 'RECHAZADA'];
    if (!estadosValidos.includes(estado)) {
      const error = new Error('Estado no válido. Use APROBADA o RECHAZADA');
      error.statusCode = 400;
      throw error;
    }

    await multimediaRepository.updateEstado(id, estado);
    return { mensaje: 'Estado actualizado exitosamente' };
  }

  async delete(id, usuarioId, userRol) {
    const multimedia = await multimediaRepository.findById(id);
    if (!multimedia) {
      const error = new Error('Multimedia no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const anuncio = await Anuncio.findByPk(multimedia.anuncio_id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isOwner = anuncio.arrendador_id === usuarioId;
    const isAdmin = userRol === 'administrador';

    if (!isOwner && !isAdmin) {
      const error = new Error('No tienes permiso para eliminar esta imagen');
      error.statusCode = 403;
      throw error;
    }

    const filePath = path.join(__dirname, '../..', multimedia.url_almacenamiento);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await multimediaRepository.delete(id);
    return { mensaje: 'Multimedia eliminada exitosamente' };
  }
}

module.exports = new MultimediaService();
