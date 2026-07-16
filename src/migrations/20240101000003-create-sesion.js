'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sesiones', {
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
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expiracion: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('sesiones', ['usuario_id'], {
      name: 'sesiones_usuario_id_index',
    });

    await queryInterface.addIndex('sesiones', ['token'], {
      name: 'sesiones_token_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sesiones');
  },
};
