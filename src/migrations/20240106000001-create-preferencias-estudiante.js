'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preferencias_estudiante', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
      },
      precio_minimo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      precio_maximo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      ubicacion_preferida: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      universidad_cercana: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      servicios_deseados: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo_amoblado_preferido: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('preferencias_estudiante', ['usuario_id'], {
      name: 'preferencias_estudiante_usuario_id_idx',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('preferencias_estudiante');
  },
};
