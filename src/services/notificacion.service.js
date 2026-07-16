const notificacionRepository = require('../repositories/notificacion.repository');
const preferenciaRepository = require('../repositories/preferencia.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const { notifyUser } = require('../config/socket');

const TIPOS_VALIDOS = ['NUEVO_ANUNCIO', 'CAMBIO_PRECIO', 'NUEVA_RESENA', 'RECOMENDACION', 'SISTEMA'];

class NotificacionService {
  async create(usuarioId, tipo, canal, titulo, mensaje) {
    const notificacion = await notificacionRepository.create({
      usuario_id: usuarioId,
      tipo,
      canal,
      titulo,
      mensaje,
      estado: 'PENDIENTE',
      fecha_creacion: new Date(),
      intentos: 0,
    });

    notifyUser(usuarioId, 'notificacion', {
      id: notificacion.id,
      tipo: notificacion.tipo,
      canal: notificacion.canal,
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      estado: notificacion.estado,
      fecha_creacion: notificacion.fecha_creacion,
    });

    return notificacion;
  }

  async getByUsuario(usuarioId, filters) {
    const result = await notificacionRepository.findByUsuarioId(usuarioId, filters);
    const no_leidas = await notificacionRepository.countNoLeidas(usuarioId);

    return {
      notificaciones: result.notificaciones.map(n => this._formatNotificacion(n)),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      no_leidas,
    };
  }

  async getNoLeidasCount(usuarioId) {
    const no_leidas = await notificacionRepository.countNoLeidas(usuarioId);
    return { no_leidas };
  }

  async markAsRead(id, usuarioId) {
    const notificacion = await notificacionRepository.markAsRead(id);
    if (!notificacion) {
      const error = new Error('Notificación no encontrada');
      error.statusCode = 404;
      throw error;
    }
    if (notificacion.usuario_id !== usuarioId) {
      const error = new Error('No tienes permiso para modificar esta notificación');
      error.statusCode = 403;
      throw error;
    }
    return { mensaje: 'Notificación marcada como leída' };
  }

  async markAllAsRead(usuarioId) {
    const actualizadas = await notificacionRepository.markAllAsRead(usuarioId);
    return { mensaje: 'Todas las notificaciones marcadas como leídas', actualizadas };
  }

  async delete(id, usuarioId) {
    const notificacion = await notificacionRepository.findById(id);
    if (!notificacion) {
      const error = new Error('Notificación no encontrada');
      error.statusCode = 404;
      throw error;
    }
    if (notificacion.usuario_id !== usuarioId) {
      const error = new Error('No tienes permiso para eliminar esta notificación');
      error.statusCode = 403;
      throw error;
    }
    await notificacionRepository.delete(id);
    return { mensaje: 'Notificación eliminada exitosamente' };
  }

  async getPreferencias(usuarioId) {
    const preferencias = await preferenciaRepository.findOrCreateByUsuarioId(usuarioId);
    return { preferencias: this._formatPreferencia(preferencias) };
  }

  async savePreferencias(usuarioId, data) {
    const allowedFields = ['nuevo_anuncio', 'cambio_precio', 'nueva_resena', 'recomendacion', 'canal_preferido', 'frecuencia'];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const preferencias = await preferenciaRepository.findOrCreateByUsuarioId(usuarioId);
    const updated = await preferenciaRepository.update(usuarioId, updateData);

    return {
      mensaje: 'Preferencias actualizadas exitosamente',
      preferencias: this._formatPreferencia(updated || preferencias),
    };
  }

  async notifyNewReview(resena, alojamiento) {
    try {
      await this.create(
        alojamiento.arrendador_id,
        'NUEVA_RESENA',
        'IN_APP',
        'Nueva reseña en tu anuncio',
        `Un estudiante ha publicado una reseña de ${resena.calificacion} estrellas en tu "${alojamiento.titulo}"`
      );
    } catch (error) {
      console.error('Error al crear notificación de nueva reseña:', error);
    }
  }

  async notifyNewListing(anuncio) {
    try {
      const admins = await usuarioRepository.findByRol('administrador');
      for (const admin of admins) {
        await this.create(
          admin.id,
          'NUEVO_ANUNCIO',
          'IN_APP',
          'Nuevo anuncio publicado',
          `Se ha publicado un nuevo anuncio: "${anuncio.titulo}"`
        );
      }
    } catch (error) {
      console.error('Error al crear notificación de nuevo anuncio:', error);
    }
  }

  async notifyReviewModerated(resena, accion) {
    try {
      const titulo = accion === 'APROBADA'
        ? 'Reseña aprobada'
        : accion === 'RECHAZADA'
          ? 'Reseña rechazada'
          : 'Reseña eliminada';

      const mensaje = accion === 'APROBADA'
        ? 'Tu reseña ha sido aprobada y ya es visible públicamente'
        : accion === 'RECHAZADA'
          ? 'Tu reseña no cumple con las políticas de la comunidad. Revisa los lineamientos.'
          : 'Tu reseña ha sido eliminada por un moderador.';

      await this.create(
        resena.usuario_id,
        'SISTEMA',
        'IN_APP',
        titulo,
        mensaje
      );
    } catch (error) {
      console.error('Error al crear notificación de moderación:', error);
    }
  }

  _formatNotificacion(notificacion) {
    return {
      id: notificacion.id,
      usuario_id: notificacion.usuario_id,
      tipo: notificacion.tipo,
      canal: notificacion.canal,
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      estado: notificacion.estado,
      fecha_creacion: notificacion.fecha_creacion,
      fecha_envio: notificacion.fecha_envio,
      intentos: notificacion.intentos,
    };
  }

  _formatPreferencia(pref) {
    return {
      id: pref.id,
      usuario_id: pref.usuario_id,
      nuevo_anuncio: pref.nuevo_anuncio,
      cambio_precio: pref.cambio_precio,
      nueva_resena: pref.nueva_resena,
      recomendacion: pref.recomendacion,
      canal_preferido: pref.canal_preferido,
      frecuencia: pref.frecuencia,
    };
  }
}

module.exports = new NotificacionService();
