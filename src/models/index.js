const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Credencial = require('./credencial');
const Sesion = require('./sesion');
const Anuncio = require('./anuncio');
const Resena = require('./resena');
const ReporteResena = require('./reporte_resena');
const HistorialModeracion = require('./historial_moderacion');

Usuario.hasOne(Credencial, { foreignKey: 'usuario_id', as: 'credencial' });
Credencial.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Sesion, { foreignKey: 'usuario_id', as: 'sesiones' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Anuncio, { foreignKey: 'arrendador_id', as: 'anuncios' });
Anuncio.belongsTo(Usuario, { foreignKey: 'arrendador_id', as: 'arrendador' });

Resena.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });
Usuario.hasMany(Resena, { foreignKey: 'usuario_id', as: 'resenas' });

Resena.belongsTo(Anuncio, { foreignKey: 'alojamiento_id', as: 'alojamiento' });
Anuncio.hasMany(Resena, { foreignKey: 'alojamiento_id', as: 'resenas' });

ReporteResena.belongsTo(Resena, { foreignKey: 'resena_id', as: 'resena' });
Resena.hasMany(ReporteResena, { foreignKey: 'resena_id', as: 'reportes' });

HistorialModeracion.belongsTo(Resena, { foreignKey: 'resena_id', as: 'resena' });
Resena.hasMany(HistorialModeracion, { foreignKey: 'resena_id', as: 'historial' });

module.exports = { sequelize, Usuario, Credencial, Sesion, Anuncio, Resena, ReporteResena, HistorialModeracion };
