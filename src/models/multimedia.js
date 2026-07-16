const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Multimedia = sequelize.define('Multimedia', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  anuncio_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'anuncios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  url_almacenamiento: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  tipo_archivo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: { isIn: [['jpg', 'jpeg', 'png', 'gif', 'webp']] },
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDIENTE',
    validate: { isIn: [['PENDIENTE', 'APROBADA', 'RECHAZADA']] },
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'multimedia',
  timestamps: false,
});

module.exports = Multimedia;
