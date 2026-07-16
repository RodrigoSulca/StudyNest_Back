'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historial_moderacion', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      resena_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'resenas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      accion: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      moderador_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fecha_accion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('historial_moderacion', ['resena_id'], {
      name: 'historial_moderacion_resena_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('historial_moderacion');
  },
};
