'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registros_validacion_ia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      multimedia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'multimedia', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      etiqueta_detectada: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      score_confianza: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      decision_automatica: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      fecha_analisis: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('registros_validacion_ia', ['multimedia_id'], {
      name: 'registros_validacion_ia_multimedia_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registros_validacion_ia');
  },
};
