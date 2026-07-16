const anuncioRepository = require('../repositories/anuncio.repository');

const TRANSICIONES_VALIDAS = {
  BORRADOR: ['ACTIVO'],
  ACTIVO: ['INACTIVO', 'SUSPENDIDO'],
  INACTIVO: ['ACTIVO'],
  SUSPENDIDO: ['ACTIVO'],
};

class AnuncioService {
  async create(arrendadorId, data) {
    const anuncio = await anuncioRepository.create({
      ...data,
      arrendador_id: arrendadorId,
      estado: 'BORRADOR',
      fecha_creacion: new Date(),
      ultima_actualizacion: new Date(),
    });

    return {
      mensaje: 'Anuncio creado exitosamente',
      anuncio: this._formatAnuncio(anuncio),
    };
  }

  async getById(id) {
    const anuncio = await anuncioRepository.findById(id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return { anuncio: this._formatAnuncio(anuncio) };
  }

  async search(filters) {
    return anuncioRepository.search(filters);
  }

  async update(id, arrendadorId, data) {
    const anuncio = await anuncioRepository.findById(id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (anuncio.arrendador_id !== arrendadorId) {
      const error = new Error('No tienes permiso para modificar este anuncio');
      error.statusCode = 403;
      throw error;
    }

    const allowedFields = [
      'titulo', 'descripcion', 'precio', 'latitud', 'longitud',
      'direccion', 'tipo_contrato', 'tipo_amoblado',
      'servicios_incluidos', 'atributos_dinamicos',
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const updated = await anuncioRepository.update(id, updateData);

    return {
      mensaje: 'Anuncio actualizado exitosamente',
      anuncio: this._formatAnuncio(updated),
    };
  }

  async changeEstado(id, arrendadorId, rol, nuevoEstado) {
    const anuncio = await anuncioRepository.findById(id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const esAdmin = rol === 'administrador';
    const esPropietario = anuncio.arrendador_id === arrendadorId;

    if (!esAdmin && !esPropietario) {
      const error = new Error('No tienes permiso para modificar este anuncio');
      error.statusCode = 403;
      throw error;
    }

    const transicionesPermitidas = TRANSICIONES_VALIDAS[anuncio.estado] || [];

    if (esAdmin) {
      if (nuevoEstado !== 'ACTIVO' && nuevoEstado !== 'SUSPENDIDO') {
        const error = new Error('Transición de estado no válida');
        error.statusCode = 400;
        throw error;
      }
    } else {
      if (!transicionesPermitidas.includes(nuevoEstado)) {
        const error = new Error('Transición de estado no válida');
        error.statusCode = 400;
        throw error;
      }
    }

    const updated = await anuncioRepository.update(id, { estado: nuevoEstado });

    return {
      mensaje: 'Estado del anuncio actualizado exitosamente',
      anuncio: this._formatAnuncio(updated),
    };
  }

  async delete(id, arrendadorId, rol) {
    const anuncio = await anuncioRepository.findById(id);
    if (!anuncio) {
      const error = new Error('Anuncio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const esAdmin = rol === 'administrador';
    const esPropietario = anuncio.arrendador_id === arrendadorId;

    if (!esAdmin && !esPropietario) {
      const error = new Error('No tienes permiso para modificar este anuncio');
      error.statusCode = 403;
      throw error;
    }

    if (!esAdmin && !['BORRADOR', 'INACTIVO'].includes(anuncio.estado)) {
      const error = new Error('Solo se pueden eliminar anuncios en borrador o inactivos');
      error.statusCode = 400;
      throw error;
    }

    await anuncioRepository.delete(id);

    return { mensaje: 'Anuncio eliminado exitosamente' };
  }

  _formatAnuncio(anuncio) {
    return {
      id: anuncio.id,
      arrendador_id: anuncio.arrendador_id,
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      precio: anuncio.precio,
      latitud: anuncio.latitud,
      longitud: anuncio.longitud,
      direccion: anuncio.direccion,
      tipo_contrato: anuncio.tipo_contrato,
      tipo_amoblado: anuncio.tipo_amoblado,
      servicios_incluidos: anuncio.servicios_incluidos,
      atributos_dinamicos: anuncio.atributos_dinamicos,
      estado: anuncio.estado,
      fecha_creacion: anuncio.fecha_creacion,
      ultima_actualizacion: anuncio.ultima_actualizacion,
      ...(anuncio.arrendador ? {
        arrendador: {
          id: anuncio.arrendador.id,
          nombre: anuncio.arrendador.nombre,
          correo: anuncio.arrendador.correo,
        },
      } : {}),
    };
  }
}

module.exports = new AnuncioService();
