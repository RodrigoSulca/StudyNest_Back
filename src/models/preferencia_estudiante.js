const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PreferenciaEstudiante = sequelize.define('PreferenciaEstudiante', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    unique: true,
  },
  precio_minimo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precio_maximo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  ubicacion_preferida: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  universidad_cercana: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  servicios_deseados: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo_amoblado_preferido: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'preferencias_estudiante',
  timestamps: false,
});

module.exports = PreferenciaEstudiante;
