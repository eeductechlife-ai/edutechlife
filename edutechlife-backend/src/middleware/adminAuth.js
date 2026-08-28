/**
 * Admin Authentication Middleware
 * Verifies JWT token and checks for admin/content-creator role
 */

const { createSessionClient } = require('../db/sessionClient');

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
    const client = createSessionClient(token);

    // Verify token is valid
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check admin role (from user_metadata or custom claims)
    const userRole = user.user_metadata?.role || user.role;
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
