const express = require('express');
const request = require('supertest');

// Stub adminAuth before requiring the router
const adminAuthPath = require.resolve('../../middleware/adminAuth');
delete require.cache[adminAuthPath];
require.cache[adminAuthPath] = {
  id: adminAuthPath, filename: adminAuthPath, loaded: true,
  exports: {
    requireAdmin: (req, _res, next) => {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      if (!token) return _res.status(401).json({ error: 'Missing or invalid authorization header' });
      if (token === 'non-admin-token') return _res.status(403).json({ error: 'User is not an admin or content creator' });
      req.user = { id: 'admin-id', email: 'admin@test.com', role: 'admin', token };
      next();
    },
  },
};

// Stub supabase
const supabasePath = require.resolve('../../db/supabase');
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath, filename: supabasePath, loaded: true,
  exports: {
    auth: {
      admin: {
        listUsers: async () => ({
          data: { users: [{ id: 'u1', email: 'a@b.com', app_metadata: { role: null }, created_at: '2025-01-01', last_sign_in_at: null, email_confirmed_at: '2025-01-01' }], total: 1 },
          error: null,
        }),
        updateUserById: async (_id, upd) => ({ data: { user: { id: _id, email: 'a@b.com', app_metadata: upd.app_metadata || {} } }, error: null }),
      },
    },
    from: () => ({
      select: () => ({ count: 'exact' }),
      limit: () => Promise.resolve({ data: [{ id: 'r1' }], error: null }),
    }),
  },
};

const adminRouter = require('../../routes/admin');
const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin Routes — authentication', () => {
  it('returns 401 when no token provided', async () => {
    const res = await request(app).get('/api/admin/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-admin token', async () => {
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer non-admin-token');
    expect(res.status).toBe(403);
  });

  it('returns admin info for valid admin token', async () => {
    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(200);
    expect(res.body.isAdmin).toBe(true);
    expect(res.body.role).toBe('admin');
  });
});

describe('GET /api/admin/users', () => {
  it('returns paginated user list', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('perPage');
    expect(res.body).toHaveProperty('hasMore');
  });
});

describe('PATCH /api/admin/users/:userId/role', () => {
  it('rejects invalid roles', async () => {
    const res = await request(app)
      .patch('/api/admin/users/u1/role')
      .set('Authorization', 'Bearer admin-token')
      .send({ role: 'superuser' });
    expect(res.status).toBe(400);
  });

  it('accepts valid role assignment', async () => {
    const res = await request(app)
      .patch('/api/admin/users/u1/role')
      .set('Authorization', 'Bearer admin-token')
      .send({ role: 'content_creator' });
    expect(res.status).toBe(200);
  });

  it('accepts null role (removes role)', async () => {
    const res = await request(app)
      .patch('/api/admin/users/u1/role')
      .set('Authorization', 'Bearer admin-token')
      .send({ role: null });
    expect(res.status).toBe(200);
  });
});

describe('GET /api/admin/health', () => {
  it('returns health metrics', async () => {
    const res = await request(app)
      .get('/api/admin/health')
      .set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('uptimeSeconds');
    expect(res.body).toHaveProperty('responseMs');
    expect(res.body).toHaveProperty('memory');
  });
});
