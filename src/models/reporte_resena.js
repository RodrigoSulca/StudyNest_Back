const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReporteResena = sequelize.define('ReporteResena', {
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
  usuario_reporta_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_reporte: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reportes_resena',
  timestamps: false,
});

module.exports = ReporteResena;
