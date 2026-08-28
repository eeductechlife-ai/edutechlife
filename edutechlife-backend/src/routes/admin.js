/**
 * Admin Routes
 * All routes are protected by requireAdmin middleware
 */

const express = require('express');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

/**
 * GET /api/admin/auth/me
 * Returns current authenticated admin user info
 * Response: { id, email, role, permissions: [...] }
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

module.exports = router;
