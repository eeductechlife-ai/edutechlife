/**
 * Admin Auth Tests
 */

const request = require('supertest');
const express = require('express');
const { requireAdmin } = require('../../middleware/adminAuth');

describe('Admin Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Test route
    app.get('/api/admin/auth/me', requireAdmin, (req, res) => {
      res.json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      });
    });
  });

  test('GET /api/admin/auth/me without token should return 401', async () => {
    const res = await request(app)
      .get('/api/admin/auth/me')
      .expect(401);

    expect(res.body.error).toBeDefined();
  });

  test('GET /api/admin/auth/me with invalid token should return 401', async () => {
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(res.body.error).toBeDefined();
  });
});
