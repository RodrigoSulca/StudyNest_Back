'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      rol: {
        type: Sequelize.ENUM('estudiante', 'arrendador', 'administrador'),
        allowNull: false,
        defaultValue: 'estudiante',
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('usuarios', ['correo'], {
      unique: true,
      name: 'usuarios_correo_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
