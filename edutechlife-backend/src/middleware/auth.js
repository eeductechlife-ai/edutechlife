const supabase = require('../db/supabase');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado — token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify Supabase JWT — auth migrated from Clerk to Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Verifica el Bearer token cuando está presente, pero nunca rechaza la
 * petición si no lo está. Deja req.userId/req.userEmail definidos solo
 * cuando la identidad pudo validarse.
 *
 * Uso: rutas públicas que quieren atribuir la llamada a un usuario
 * autenticado (p. ej. /api/chat) sin romper a los clientes anónimos.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return next();
    }
    req.userId = user.id;
    req.userEmail = user.email;
  } catch {
    // Identidad no verificable — continuar como anónimo.
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
