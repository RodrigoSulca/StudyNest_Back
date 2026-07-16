const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Credencial = sequelize.define('Credencial', {
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
  contrasena_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'credenciales',
  timestamps: true,
  updatedAt: false,
});

module.exports = Credencial;
