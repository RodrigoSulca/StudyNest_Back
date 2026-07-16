function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    mensaje: err.message || 'Error interno del servidor',
  });
}

module.exports = errorHandler;
