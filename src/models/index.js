const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Credencial = require('./credencial');
const Sesion = require('./sesion');

Usuario.hasOne(Credencial, { foreignKey: 'usuario_id', as: 'credencial' });
Credencial.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Sesion, { foreignKey: 'usuario_id', as: 'sesiones' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = { sequelize, Usuario, Credencial, Sesion };
