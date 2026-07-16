'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('anuncios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      arrendador_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      titulo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      latitud: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      longitud: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tipo_contrato: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      tipo_amoblado: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      servicios_incluidos: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      atributos_dinamicos: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: '{}',
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'BORRADOR',
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      ultima_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('anuncios', ['estado', 'precio'], {
      name: 'anuncios_estado_precio_idx',
    });

    await queryInterface.addIndex('anuncios', ['atributos_dinamicos'], {
      using: 'GIN',
      name: 'anuncios_atributos_dinamicos_gin_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('anuncios');
  },
};
