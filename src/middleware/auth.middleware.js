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

module.exports = authenticate;
