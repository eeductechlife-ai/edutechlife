function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack);

  if (err.message.startsWith('Origen no permitido')) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El cuerpo de la solicitud es demasiado grande' });
  }

  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    requestId: req.headers['x-request-id'] || null,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
