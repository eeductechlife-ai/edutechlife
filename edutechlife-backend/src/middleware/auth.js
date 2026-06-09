const { verifyToken } = require('@clerk/backend');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado — token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.userId = payload.sub;
    req.sessionId = payload.sid;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { requireAuth };
