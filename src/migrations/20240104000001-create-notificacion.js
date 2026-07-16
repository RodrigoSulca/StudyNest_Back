'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificaciones', {
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
      },
      tipo: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      canal: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'PENDIENTE',
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      fecha_envio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      intentos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('notificaciones', ['usuario_id', 'estado'], {
      name: 'notificaciones_usuario_estado_idx',
    });

    await queryInterface.addIndex('notificaciones', ['usuario_id'], {
      name: 'notificaciones_usuario_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notificaciones');
  },
};
