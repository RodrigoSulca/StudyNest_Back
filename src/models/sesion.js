const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sesion = sequelize.define('Sesion', {
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
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiracion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'sesiones',
  timestamps: true,
  updatedAt: false,
});

module.exports = Sesion;
