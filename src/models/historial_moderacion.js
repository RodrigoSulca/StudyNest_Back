const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialModeracion = sequelize.define('HistorialModeracion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  resena_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'resenas', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  accion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['APROBADA', 'RECHAZADA', 'ELIMINADA']] },
  },
  moderador_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  fecha_accion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'historial_moderacion',
  timestamps: false,
});

module.exports = HistorialModeracion;
