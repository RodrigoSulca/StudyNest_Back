const preferenciaEstudianteRepository = require('../repositories/preferencia_estudiante.repository');

class PreferenciaEstudianteService {
  async get(usuarioId) {
    const preferencia = await preferenciaEstudianteRepository.findByUsuarioId(usuarioId);
    if (!preferencia) {
      return {
        precio_minimo: null,
        precio_maximo: null,
        ubicacion_preferida: null,
        universidad_cercana: null,
        servicios_deseados: null,
        tipo_amoblado_preferido: null,
      };
    }
    return this._format(preferencia);
  }

  async save(usuarioId, data) {
    const allowedFields = [
      'precio_minimo', 'precio_maximo', 'ubicacion_preferida',
      'universidad_cercana', 'servicios_deseados', 'tipo_amoblado_preferido',
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const { preferencia, created } = await preferenciaEstudianteRepository.findOrCreateByUsuarioId(usuarioId, updateData);
    if (!created) {
      const updated = await preferenciaEstudianteRepository.update(usuarioId, updateData);
      return {
        mensaje: 'Preferencias actualizadas exitosamente',
        preferencias: this._format(updated || preferencia),
      };
    }
    return {
      mensaje: 'Preferencias creadas exitosamente',
      preferencias: this._format(preferencia),
    };
  }

  _format(pref) {
    return {
      id: pref.id,
      usuario_id: pref.usuario_id,
      precio_minimo: pref.precio_minimo,
      precio_maximo: pref.precio_maximo,
      ubicacion_preferida: pref.ubicacion_preferida,
      universidad_cercana: pref.universidad_cercana,
      servicios_deseados: pref.servicios_deseados,
      tipo_amoblado_preferido: pref.tipo_amoblado_preferido,
      fecha_actualizacion: pref.fecha_actualizacion,
    };
  }
}

module.exports = new PreferenciaEstudianteService();
