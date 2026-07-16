'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credenciales', {
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
      contrasena_hash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ultimo_acceso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('credenciales', ['usuario_id'], {
      name: 'credenciales_usuario_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('credenciales');
  },
};
