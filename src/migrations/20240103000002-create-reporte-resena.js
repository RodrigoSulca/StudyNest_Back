'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes_resena', {
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
      usuario_reporta_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      motivo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fecha_reporte: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('reportes_resena', ['resena_id'], {
      name: 'reportes_resena_resena_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reportes_resena');
  },
};
