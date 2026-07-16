const resenaRepository = require('../repositories/resena.repository');
const reporteRepository = require('../repositories/reporte.repository');
const historialRepository = require('../repositories/historial.repository');
const notificacionService = require('./notificacion.service');

const ACCIONES_VALIDAS = ['APROBADA', 'RECHAZADA', 'ELIMINADA'];

class ResenaService {
  async create(usuarioId, data) {
    const existing = await resenaRepository.findByAlojamientoId(data.alojamiento_id, { limit: 1000 });
    const yaExiste = existing.resenas.some(r => r.usuario_id === usuarioId);
    if (yaExiste) {
      const error = new Error('Ya has publicado una reseña para este alojamiento');
      error.statusCode = 400;
      throw error;
    }

    const resena = await resenaRepository.create({
      usuario_id: usuarioId,
      alojamiento_id: data.alojamiento_id,
      calificacion: data.calificacion,
      comentario: data.comentario,
      estado: 'PENDIENTE',
    });

    const alojamiento = await resenaRepository.findById(resena.id);
    if (alojamiento && alojamiento.alojamiento) {
      await notificacionService.notifyNewReview(resena, alojamiento.alojamiento);
    }

    return {
      mensaje: 'Reseña creada exitosamente',
      resena: this._formatResena(resena),
    };
  }

  async getByAlojamiento(alojamientoId, filters) {
    const result = await resenaRepository.findByAlojamientoId(alojamientoId, filters);
    const promedio = await resenaRepository.calculatePromedio(alojamientoId);

    return {
      resenas: result.resenas.map(r => this._formatResena(r)),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      promedio: promedio.promedio,
    };
  }

  async getById(id) {
    const resena = await resenaRepository.findById(id);
    if (!resena) {
      const error = new Error('Reseña no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return { resena: this._formatResena(resena) };
  }

  async update(id, usuarioId, data) {
    const resena = await resenaRepository.findById(id);
    if (!resena) {
      const error = new Error('Reseña no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (resena.usuario_id !== usuarioId) {
      const error = new Error('No tienes permiso para modificar esta reseña');
      error.statusCode = 403;
      throw error;
    }

    const updateData = {};
    if (data.calificacion !== undefined) updateData.calificacion = data.calificacion;
    if (data.comentario !== undefined) updateData.comentario = data.comentario;
    updateData.fecha_edicion = new Date();

    const updated = await resenaRepository.update(id, updateData);

    return {
      mensaje: 'Reseña actualizada exitosamente',
      resena: this._formatResena(updated),
    };
  }

  async delete(id, usuarioId, rol) {
    const resena = await resenaRepository.findById(id);
    if (!resena) {
      const error = new Error('Reseña no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const esAdmin = rol === 'administrador';
    const esPropietario = resena.usuario_id === usuarioId;

    if (!esAdmin && !esPropietario) {
      const error = new Error('No tienes permiso para modificar esta reseña');
      error.statusCode = 403;
      throw error;
    }

    if (resena.estado === 'REPORTADA') {
      const error = new Error('No se puede eliminar una reseña que está bajo revisión');
      error.statusCode = 400;
      throw error;
    }

    await resenaRepository.delete(id);

    return { mensaje: 'Reseña eliminada exitosamente' };
  }

  async report(id, usuarioId, data) {
    const resena = await resenaRepository.findById(id);
    if (!resena) {
      const error = new Error('Reseña no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const existingReport = await reporteRepository.findByUsuarioAndResena(usuarioId, id);
    if (existingReport) {
      const error = new Error('Ya has reportado esta reseña');
      error.statusCode = 400;
      throw error;
    }

    await reporteRepository.create({
      resena_id: id,
      usuario_reporta_id: usuarioId,
      motivo: data.motivo,
    });

    const updated = await resenaRepository.incrementReportCount(id);

    if (updated.reporte_count >= 3 && resena.estado !== 'REPORTADA') {
      await resenaRepository.update(id, { estado: 'REPORTADA' });
    }

    return { mensaje: 'Reseña reportada exitosamente' };
  }

  async moderate(id, moderatorId, accion) {
    if (!ACCIONES_VALIDAS.includes(accion)) {
      const error = new Error('Acción de moderación no válida');
      error.statusCode = 400;
      throw error;
    }

    const resena = await resenaRepository.findById(id);
    if (!resena) {
      const error = new Error('Reseña no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const estadoMap = {
      APROBADA: 'ACTIVA',
      RECHAZADA: 'ELIMINADA',
      ELIMINADA: 'ELIMINADA',
    };

    await resenaRepository.update(id, { estado: estadoMap[accion] });

    await historialRepository.create({
      resena_id: id,
      accion,
      moderador_id: moderatorId,
    });

    const updated = await resenaRepository.findById(id);

    await notificacionService.notifyReviewModerated(updated, accion);

    return {
      mensaje: `Reseña ${accion.toLowerCase()} exitosamente`,
      resena: this._formatResena(updated),
    };
  }

  async getPromedio(alojamientoId) {
    return resenaRepository.calculatePromedio(alojamientoId);
  }

  _formatResena(resena) {
    return {
      id: resena.id,
      usuario_id: resena.usuario_id,
      alojamiento_id: resena.alojamiento_id,
      calificacion: resena.calificacion,
      comentario: resena.comentario,
      estado: resena.estado,
      fecha_publicacion: resena.fecha_publicacion,
      fecha_edicion: resena.fecha_edicion,
      reporte_count: resena.reporte_count,
      ...(resena.autor ? {
        autor: {
          id: resena.autor.id,
          nombre: resena.autor.nombre,
          correo: resena.autor.correo,
        },
      } : {}),
      ...(resena.alojamiento ? {
        alojamiento: {
          id: resena.alojamiento.id,
          titulo: resena.alojamiento.titulo,
          direccion: resena.alojamiento.direccion,
        },
      } : {}),
    };
  }
}

module.exports = new ResenaService();
