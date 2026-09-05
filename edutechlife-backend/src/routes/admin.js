/**
 * Admin Routes
 * All routes are protected by requireAdmin middleware
 */

const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');
const supabase = require('../db/supabase');

const router = express.Router();

/**
 * GET /api/admin/auth/me
 * Returns current authenticated admin user info
 */
router.get('/auth/me', requireAdmin, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    isAdmin: req.user.role === 'admin',
    isContentCreator: req.user.role === 'content_creator',
  });
});

/**
 * GET /api/admin/users?page=1&perPage=50&search=email@example.com
 *
 * Lists users with server-side pagination. Uses Supabase admin.listUsers
 * which paginates correctly above 1 000 registrations (issue #9).
 * Optional `search` param filters by email substring on the DB side.
 *
 * Response: { users: [...], total: number, page: number, perPage: number, hasMore: boolean }
 */
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage) || 50));
    const search = (req.query.search || '').trim().toLowerCase();

    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
      ...(search ? { filter: search } : {}),
    });

    if (error) {
      console.error('[admin/users] listUsers error:', error.message);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email,
      role: u.app_metadata?.role || null,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      emailConfirmed: !!u.email_confirmed_at,
    }));

    res.json({
      users,
      total: data?.total ?? users.length,
      page,
      perPage,
      hasMore: users.length === perPage,
    });
  } catch (err) {
    console.error('[admin/users] unexpected error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/admin/users/:userId/role
 * Body: { role: 'admin' | 'content_creator' | null }
 * Sets app_metadata.role for a user.
 */
router.patch('/users/:userId/role', requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const VALID_ROLES = ['admin', 'content_creator', null];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Allowed: ${VALID_ROLES.filter(Boolean).join(', ')} or null` });
  }

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: role ?? undefined },
    });

    if (error) {
      console.error('[admin/users/role] updateUserById error:', error.message);
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    res.json({
      id: data.user.id,
      email: data.user.email,
      role: data.user.app_metadata?.role || null,
    });
  } catch (err) {
    console.error('[admin/users/role] unexpected error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
