'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preferencias_notificacion', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nuevo_anuncio: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      cambio_precio: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      nueva_resena: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      recomendacion: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      canal_preferido: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'IN_APP',
      },
      frecuencia: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'INMEDIATA',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('preferencias_notificacion');
  },
};
