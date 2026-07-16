const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anuncio = sequelize.define('Anuncio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  arrendador_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true, len: [3, 150] },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  longitud: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tipo_contrato: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tipo_amoblado: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  servicios_incluidos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  atributos_dinamicos: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'BORRADOR',
    validate: { isIn: [['BORRADOR', 'ACTIVO', 'INACTIVO', 'SUSPENDIDO']] },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'anuncios',
  timestamps: false,
});

module.exports = Anuncio;
