'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resenas', {
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
      alojamiento_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'anuncios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      calificacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comentario: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'PENDIENTE',
      },
      fecha_publicacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      fecha_edicion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reporte_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('resenas', ['alojamiento_id'], {
      name: 'resenas_alojamiento_id_idx',
    });

    await queryInterface.addIndex('resenas', ['usuario_id'], {
      name: 'resenas_usuario_id_idx',
    });

    await queryInterface.addIndex('resenas', ['estado'], {
      name: 'resenas_estado_idx',
    });

    await queryInterface.addIndex('resenas', ['calificacion'], {
      name: 'resenas_calificacion_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('resenas');
  },
};
