function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: permisos insuficientes' });
    }
    next();
  };
}

module.exports = requireRole;
