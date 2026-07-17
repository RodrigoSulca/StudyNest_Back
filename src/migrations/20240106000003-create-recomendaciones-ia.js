'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recomendaciones_ia', {
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
      anuncio_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'anuncios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score_relevancia: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      fecha_generacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      tipo_recomendacion: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('recomendaciones_ia', ['usuario_id'], {
      name: 'recomendaciones_ia_usuario_id_idx',
    });

    await queryInterface.addIndex('recomendaciones_ia', ['usuario_id', 'fecha_generacion'], {
      name: 'recomendaciones_ia_usuario_fecha_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('recomendaciones_ia');
  },
};
