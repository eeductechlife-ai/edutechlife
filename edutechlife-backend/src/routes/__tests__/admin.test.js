/**
 * Admin Auth Tests
 * Mockea db/supabase para que requireAdmin sea determinista (sin red real).
 * Verifica además que el rol admin se lee de app_metadata (no user_metadata).
 */

const request = require('supertest');
const express = require('express');

const supabasePath = require.resolve('../../db/supabase');
const mockSupabase = { auth: { getUser: vi.fn() } };
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const { requireAdmin } = require('../../middleware/adminAuth');

describe('Admin Routes', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.get('/api/admin/auth/me', requireAdmin, (req, res) => {
      res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
    });
  });

  test('GET /api/admin/auth/me without token should return 401', async () => {
    const res = await request(app).get('/api/admin/auth/me').expect(401);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/admin/auth/me with invalid token should return 401', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  test('admin token (app_metadata.role) → 200', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u1', email: 'admin@test', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
    expect(res.body.role).toBe('admin');
  });

  test('user_metadata.role NO otorga admin (escalación cerrada)', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u2', email: 'hacker@test', app_metadata: {}, user_metadata: { role: 'admin' } } },
      error: null,
    });
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(403);
  });
});
