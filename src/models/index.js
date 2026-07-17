const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Credencial = require('./credencial');
const Sesion = require('./sesion');
const Anuncio = require('./anuncio');
const Resena = require('./resena');
const ReporteResena = require('./reporte_resena');
const HistorialModeracion = require('./historial_moderacion');
const Notificacion = require('./notificacion');
const PreferenciaNotificacion = require('./preferencia_notificacion');
const Multimedia = require('./multimedia');
const RegistroValidacionIA = require('./registro_validacion_ia');
const PreferenciaEstudiante = require('./preferencia_estudiante');
const ConversacionChatbot = require('./conversacion_chatbot');
const RecomendacionIA = require('./recomendacion_ia');

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

Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

PreferenciaNotificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasOne(PreferenciaNotificacion, { foreignKey: 'usuario_id', as: 'preferencia_notificacion' });

Anuncio.hasMany(Multimedia, { foreignKey: 'anuncio_id', as: 'multimedia' });
Multimedia.belongsTo(Anuncio, { foreignKey: 'anuncio_id', as: 'anuncio' });

Multimedia.hasMany(RegistroValidacionIA, { foreignKey: 'multimedia_id', as: 'registros_validacion' });
RegistroValidacionIA.belongsTo(Multimedia, { foreignKey: 'multimedia_id', as: 'multimedia' });

PreferenciaEstudiante.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasOne(PreferenciaEstudiante, { foreignKey: 'usuario_id', as: 'preferencia_estudiante' });

ConversacionChatbot.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(ConversacionChatbot, { foreignKey: 'usuario_id', as: 'conversaciones_chatbot' });

RecomendacionIA.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(RecomendacionIA, { foreignKey: 'usuario_id', as: 'recomendaciones' });

RecomendacionIA.belongsTo(Anuncio, { foreignKey: 'anuncio_id', as: 'anuncio' });
Anuncio.hasMany(RecomendacionIA, { foreignKey: 'anuncio_id', as: 'recomendaciones' });

module.exports = { sequelize, Usuario, Credencial, Sesion, Anuncio, Resena, ReporteResena, HistorialModeracion, Notificacion, PreferenciaNotificacion, Multimedia, RegistroValidacionIA, PreferenciaEstudiante, ConversacionChatbot, RecomendacionIA };
