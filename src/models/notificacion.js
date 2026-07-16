const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
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
  tipo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: { isIn: [['NUEVO_ANUNCIO', 'CAMBIO_PRECIO', 'NUEVA_RESENA', 'RECOMENDACION', 'SISTEMA']] },
  },
  canal: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: { isIn: [['EMAIL', 'PUSH', 'IN_APP']] },
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true },
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'PENDIENTE',
    validate: { isIn: [['PENDIENTE', 'ENVIADA', 'FALLIDA', 'LEIDA']] },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  intentos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'notificaciones',
  timestamps: false,
});

module.exports = Notificacion;
