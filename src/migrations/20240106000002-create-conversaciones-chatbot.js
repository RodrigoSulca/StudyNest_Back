'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversaciones_chatbot', {
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
      mensaje_usuario: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      respuesta_chatbot: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fecha_interaccion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('conversaciones_chatbot', ['usuario_id'], {
      name: 'conversaciones_chatbot_usuario_id_idx',
    });

    await queryInterface.addIndex('conversaciones_chatbot', ['fecha_interaccion'], {
      name: 'conversaciones_chatbot_fecha_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('conversaciones_chatbot');
  },
};
