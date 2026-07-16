const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PreferenciaNotificacion = sequelize.define('PreferenciaNotificacion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  nuevo_anuncio: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  cambio_precio: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  nueva_resena: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  recomendacion: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  canal_preferido: {
    type: DataTypes.STRING(10),
    defaultValue: 'IN_APP',
    validate: { isIn: [['EMAIL', 'PUSH', 'IN_APP']] },
  },
  frecuencia: {
    type: DataTypes.STRING(10),
    defaultValue: 'INMEDIATA',
    validate: { isIn: [['INMEDIATA', 'DIARIA', 'SEMANAL']] },
  },
}, {
  tableName: 'preferencias_notificacion',
  timestamps: false,
});

module.exports = PreferenciaNotificacion;
