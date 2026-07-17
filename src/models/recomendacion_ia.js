const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecomendacionIA = sequelize.define('RecomendacionIA', {
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
  anuncio_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'anuncios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  score_relevancia: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  fecha_generacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tipo_recomendacion: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
}, {
  tableName: 'recomendaciones_ia',
  timestamps: false,
});

module.exports = RecomendacionIA;
