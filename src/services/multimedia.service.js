const fs = require('fs');
const path = require('path');
const multimediaRepository = require('../repositories/multimedia.repository');
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
    let nextOrden = existingMultimedia.length > 0
      ? Math.max(...existingMultimedia.map(m => m.orden)) + 1
      : 0;

    const records = files.map((file) => {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      return {
        anuncio_id: anuncioId,
        url_almacenamiento: `/uploads/${file.filename}`,
        tipo_archivo: ext,
        estado: 'PENDIENTE',
        fecha_subida: new Date(),
        orden: nextOrden++,
      };
    });

    const multimedia = await multimediaRepository.bulkCreate(records);
    return { multimedia };
  }

  async getByAnuncioId(anuncioId) {
    const multimedia = await multimediaRepository.findByAnuncioId(anuncioId);
    return { multimedia };
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
