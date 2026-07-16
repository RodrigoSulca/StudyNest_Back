'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios LIMIT 3`
    );

    if (users.length === 0) return;

    const userId1 = users[0].id;
    const userId2 = users.length > 1 ? users[1].id : users[0].id;
    const userId3 = users.length > 2 ? users[2].id : users[0].id;

    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    const notificaciones = [
      {
        id: uuidv4(),
        usuario_id: userId1,
        tipo: 'NUEVA_RESENA',
        canal: 'IN_APP',
        titulo: 'Nueva reseña en tu anuncio',
        mensaje: 'Un estudiante ha publicado una reseña de 5 estrellas en tu habitación "Cerca de la U"',
        estado: 'LEIDA',
        fecha_creacion: yesterday,
        fecha_envio: yesterday,
        intentos: 1,
      },
      {
        id: uuidv4(),
        usuario_id: userId1,
        tipo: 'NUEVO_ANUNCIO',
        canal: 'IN_APP',
        titulo: 'Nuevo anuncio publicado',
        mensaje: 'Se ha publicado un nuevo anuncio: "Departamento en Miraflores"',
        estado: 'PENDIENTE',
        fecha_creacion: now,
        fecha_envio: null,
        intentos: 0,
      },
      {
        id: uuidv4(),
        usuario_id: userId2,
        tipo: 'NUEVA_RESENA',
        canal: 'IN_APP',
        titulo: 'Nueva reseña en tu anuncio',
        mensaje: 'Un estudiante ha publicado una reseña de 4 estrellas en tu "Loft moderno en San Isidro"',
        estado: 'PENDIENTE',
        fecha_creacion: now,
        fecha_envio: null,
        intentos: 0,
      },
      {
        id: uuidv4(),
        usuario_id: userId2,
        tipo: 'CAMBIO_PRECIO',
        canal: 'IN_APP',
        titulo: 'Precio actualizado',
        mensaje: 'El precio de tu anuncio "Departamento en Barranco" ha sido actualizado',
        estado: 'PENDIENTE',
        fecha_creacion: now,
        fecha_envio: null,
        intentos: 0,
      },
      {
        id: uuidv4(),
        usuario_id: userId1,
        tipo: 'SISTEMA',
        canal: 'IN_APP',
        titulo: 'Reseña moderada',
        mensaje: 'Tu reseña ha sido aprobada y ya es visible públicamente',
        estado: 'LEIDA',
        fecha_creacion: yesterday,
        fecha_envio: yesterday,
        intentos: 1,
      },
      {
        id: uuidv4(),
        usuario_id: userId3,
        tipo: 'RECOMENDACION',
        canal: 'IN_APP',
        titulo: 'Recomendación personalizada',
        mensaje: 'Encontramos 3 alojamiento que coinciden con tus preferencias cerca de la universidad',
        estado: 'PENDIENTE',
        fecha_creacion: now,
        fecha_envio: null,
        intentos: 0,
      },
      {
        id: uuidv4(),
        usuario_id: userId3,
        tipo: 'NUEVA_RESENA',
        canal: 'IN_APP',
        titulo: 'Nueva reseña en tu anuncio',
        mensaje: 'Un estudiante ha publicado una reseña de 3 estrellas en tu "Habitación compartida Surco"',
        estado: 'PENDIENTE',
        fecha_creacion: now,
        fecha_envio: null,
        intentos: 0,
      },
      {
        id: uuidv4(),
        usuario_id: userId1,
        tipo: 'SISTEMA',
        canal: 'IN_APP',
        titulo: 'Reseña rechazada',
        mensaje: 'Tu reseña no cumple con las políticas de la comunidad. Revisa los lineamientos.',
        estado: 'ENVIADA',
        fecha_creacion: yesterday,
        fecha_envio: yesterday,
        intentos: 1,
      },
      {
        id: uuidv4(),
        usuario_id: userId2,
        tipo: 'NUEVO_ANUNCIO',
        canal: 'IN_APP',
        titulo: 'Nuevo anuncio publicado',
        mensaje: 'Se ha publicado un nuevo anuncio: "Monoambiente en Lince"',
        estado: 'LEIDA',
        fecha_creacion: new Date(now.getTime() - 172800000),
        fecha_envio: new Date(now.getTime() - 172800000),
        intentos: 1,
      },
      {
        id: uuidv4(),
        usuario_id: userId3,
        tipo: 'SISTEMA',
        canal: 'IN_APP',
        titulo: 'Bienvenido a StudyNest',
        mensaje: 'Tu cuenta ha sido creada exitosamente. Explora los anuncios disponibles.',
        estado: 'LEIDA',
        fecha_creacion: new Date(now.getTime() - 259200000),
        fecha_envio: new Date(now.getTime() - 259200000),
        intentos: 1,
      },
    ];

    await queryInterface.bulkInsert('notificaciones', notificaciones);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notificaciones', null, {});
  },
};
