'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const [students] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE rol = 'estudiante' LIMIT 3`
    );
    const [anuncios] = await queryInterface.sequelize.query(
      `SELECT id FROM anuncios WHERE estado = 'ACTIVO' LIMIT 6`
    );

    const studentId = students[0].id;
    const studentId2 = students.length > 1 ? students[1].id : students[0].id;

    const now = new Date();

    const resenas = [
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[0].id,
        calificacion: 5,
        comentario: 'Excelente habitación, muy limpia y bien ubicada. El wifi funciona perfecto y el arrendador es muy amable. Totalmente recomendado para estudiantes.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId2,
        alojamiento_id: anuncios[0].id,
        calificacion: 4,
        comentario: 'Muy buena ubicación cerca de la universidad. El único detalle es que a veces se escucha ruido de la calle por la noche.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[1].id,
        calificacion: 5,
        comentario: 'El departamento es increíble, la vista al parque Kennedy es espectacular. Muy moderno y bien amoblado. Vale cada sol.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId2,
        alojamiento_id: anuncios[1].id,
        calificacion: 3,
        comentario: 'El departamento es bonito pero el precio es algo elevado para lo que ofrecen. El agua caliente a veces tarda en llegar.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 2,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[2].id,
        calificacion: 4,
        comentario: 'Buena relación calidad-precio. La zona es tranquila y segura. Solo que la cocina es un poco pequeña para compartir.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[4].id,
        calificacion: 2,
        comentario: 'La habitación está bien pero sin amoblado es difícil para un estudiante que no tiene muebles. El jardín es lindo though.',
        estado: 'PENDIENTE',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId2,
        alojamiento_id: anuncios[4].id,
        calificacion: 4,
        comentario: 'Buena ubicación en La Molina, zona residencial muy tranquila. El precio es justo para lo que ofrecen.',
        estado: 'PENDIENTE',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[5].id,
        calificacion: 5,
        comentario: 'Me encantó la concepto eco-friendly. El huerto es una experiencia única. El desayuno incluido es un plus enorme.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId2,
        alojamiento_id: anuncios[5].id,
        calificacion: 3,
        comentario: 'La idea es buena pero los paneles solares no siempre funcionan bien. A veces no hay luz caliente para ducharse.',
        estado: 'REPORTADA',
        fecha_publicacion: now,
        reporte_count: 4,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[2].id,
        calificacion: 2,
        comentario: 'La habitación compartida no es para todos. El baño siempre está ocupado y los室友 son ruidosos.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 1,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        alojamiento_id: anuncios[1].id,
        calificacion: 4,
        comentario: 'Muy buen departamento, moderno y bien ubicado. El edificio tiene ascensor y seguridad 24 horas.',
        estado: 'PENDIENTE',
        fecha_publicacion: now,
        reporte_count: 0,
      },
      {
        id: uuidv4(),
        usuario_id: studentId2,
        alojamiento_id: anuncios[0].id,
        calificacion: 4,
        comentario: 'La habitación cumple con todo lo necesario para estudiar. El escritorio es amplio y la iluminación es buena.',
        estado: 'ACTIVA',
        fecha_publicacion: now,
        reporte_count: 0,
      },
    ];

    await queryInterface.bulkInsert('resenas', resenas);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('resenas', null, {});
  },
};
