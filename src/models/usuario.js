const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true, len: [2, 100] },
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  rol: {
    type: DataTypes.ENUM('estudiante', 'arrendador', 'administrador'),
    allowNull: false,
    defaultValue: 'estudiante',
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'fecha_registro',
});

module.exports = Usuario;
