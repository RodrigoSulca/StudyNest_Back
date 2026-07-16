'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('multimedia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      anuncio_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'anuncios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      url_almacenamiento: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      tipo_archivo: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'PENDIENTE',
      },
      fecha_subida: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('multimedia', ['anuncio_id'], {
      name: 'multimedia_anuncio_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('multimedia');
  },
};
