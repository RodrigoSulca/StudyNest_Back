const { verifyToken } = require('../utils/jwt');
const { COOKIE_NAME } = require('../utils/cookie');

function authenticate(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado' });
    }
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

// Autenticación opcional: si hay un token válido setea req.user, pero no bloquea
// a visitantes anónimos. Útil en endpoints públicos que muestran contenido
// distinto según quién los consulte (p. ej. el dueño ve más que el público).
function optionalAuthenticate(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // Token inválido o expirado: se trata como visitante anónimo.
    }
  }
  next();
}

module.exports = authenticate;
module.exports.optional = optionalAuthenticate;
