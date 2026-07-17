const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversacionChatbot = sequelize.define('ConversacionChatbot', {
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
  mensaje_usuario: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  respuesta_chatbot: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_interaccion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversaciones_chatbot',
  timestamps: false,
});

module.exports = ConversacionChatbot;
