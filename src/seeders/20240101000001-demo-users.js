'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const adminId = uuidv4();
    const studentId = uuidv4();
    const landlordId = uuidv4();

    const adminHash = await bcrypt.hash('admin123', 12);
    const studentHash = await bcrypt.hash('student123', 12);
    const landlordHash = await bcrypt.hash('landlord123', 12);

    const now = new Date();

    await queryInterface.bulkInsert('usuarios', [
      {
        id: adminId,
        nombre: 'Admin User',
        correo: 'admin@studynest.com',
        rol: 'administrador',
        fecha_registro: now,
        updated_at: now,
      },
      {
        id: studentId,
        nombre: 'Student User',
        correo: 'student@studynest.com',
        rol: 'estudiante',
        fecha_registro: now,
        updated_at: now,
      },
      {
        id: landlordId,
        nombre: 'Landlord User',
        correo: 'landlord@studynest.com',
        rol: 'arrendador',
        fecha_registro: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('credenciales', [
      {
        id: uuidv4(),
        usuario_id: adminId,
        contrasena_hash: adminHash,
        created_at: now,
      },
      {
        id: uuidv4(),
        usuario_id: studentId,
        contrasena_hash: studentHash,
        created_at: now,
      },
      {
        id: uuidv4(),
        usuario_id: landlordId,
        contrasena_hash: landlordHash,
        created_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('credenciales', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  },
};
