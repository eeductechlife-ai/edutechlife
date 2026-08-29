/**
 * Admin Authentication Middleware
 * Verifies JWT token and checks for admin/content-creator role.
 *
 * El rol se lee de `app_metadata` (no de `user_metadata`, que es editable
 * por el propio usuario vía auth.updateUser). El token se valida con
 * supabase.auth.getUser(token), como el resto de middlewares.
 */

const supabase = require('../db/supabase');

/**
 * Verify JWT token from Authorization header
 * Returns user data with role info, or throws 401/403
 */
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify token is valid
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Admin/content_creator role SOLO desde app_metadata (confiable)
    const userRole = user.app_metadata?.role || null;
    const isAdmin = userRole === 'admin' || userRole === 'content_creator';

    if (!isAdmin) {
      return res.status(403).json({ error: 'User is not an admin or content creator' });
    }

    // Attach user info to request for downstream handlers
    req.user = {
      id: user.id,
      email: user.email,
      role: userRole,
      token,
    };

    next();
  } catch (error) {
    console.error('[adminAuth] Error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { requireAdmin };
