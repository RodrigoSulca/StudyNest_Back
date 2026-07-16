const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegistroValidacionIA = sequelize.define('RegistroValidacionIA', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  multimedia_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'multimedia', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  etiqueta_detectada: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  score_confianza: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  decision_automatica: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['ACEPTADA', 'RECHAZADA']] },
  },
  fecha_analisis: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'registros_validacion_ia',
  timestamps: false,
});

module.exports = RegistroValidacionIA;
