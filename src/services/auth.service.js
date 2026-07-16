const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuario.repository');
const credencialRepository = require('../repositories/credencial.repository');
const sesionRepository = require('../repositories/sesion.repository');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register({ nombre, correo, contrasena, rol }) {
    const existing = await usuarioRepository.findByCorreo(correo);
    if (existing) {
      const error = new Error('El correo ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const usuario = await usuarioRepository.create({ nombre, correo, rol });

    const contrasena_hash = await bcrypt.hash(contrasena, 12);
    await credencialRepository.create({
      usuario_id: usuario.id,
      contrasena_hash,
    });

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        fecha_registro: usuario.fecha_registro,
      },
    };
  }

  async login({ correo, contrasena }) {
    const usuario = await usuarioRepository.findByCorreo(correo);
    if (!usuario) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const credencial = await credencialRepository.findByUsuarioId(usuario.id);
    if (!credencial) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await bcrypt.compare(contrasena, credencial.contrasena_hash);
    if (!isValid) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    await credencialRepository.updateUltimoAcceso(usuario.id);

    const token = generateToken(usuario);

    const expiracion = new Date();
    expiracion.setDate(expiracion.getDate() + 7);
    await sesionRepository.create({
      usuario_id: usuario.id,
      token,
      expiracion,
    });

    return {
      token,
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        fecha_registro: usuario.fecha_registro,
      },
    };
  }

  async logout(token) {
    if (token) {
      await sesionRepository.deleteByToken(token);
    }
  }
}

module.exports = new AuthService();
