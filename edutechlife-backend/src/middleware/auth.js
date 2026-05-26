const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No autorizado — token requerido' });
  }

  if (!CLERK_SECRET_KEY) {
    return res.status(500).json({ error: 'CLERK_SECRET_KEY no configurada en el servidor' });
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: 'Token expirado' });
    }

    req.userId = payload.sub;
    req.sessionId = payload.sid;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { requireAuth };
