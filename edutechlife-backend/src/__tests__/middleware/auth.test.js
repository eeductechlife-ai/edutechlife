const request = require('supertest');

const express = require('express');
const { requireAuth } = require('../../middleware/auth');

const testApp = express();
testApp.use(express.json());
testApp.get('/api/protected', requireAuth, (req, res) => {
  res.json({ userId: req.userId, sessionId: req.sessionId });
});

describe('requireAuth via HTTP', () => {
  it('returns 401 without auth header', async () => {
    const res = await request(testApp).get('/api/protected');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No autorizado — token requerido');
  });

  it('returns 401 with non-Bearer token', async () => {
    const res = await request(testApp)
      .get('/api/protected')
      .set('Authorization', 'Basic token123');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid Bearer token', async () => {
    const res = await request(testApp)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token inválido o expirado');
  });

  it('returns 401 when auth header is empty', async () => {
    const res = await request(testApp)
      .get('/api/protected')
      .set('Authorization', '');
    expect(res.status).toBe(401);
  });
});

// ── requireProduct: separación IALab ↔ SmartBoard ────────────────────────────
const { requireProduct } = require('../../middleware/auth');
const supabase = require('../../db/supabase');

/** Crea una app de prueba con identidad inyectada y el guard del producto. */
const makeProductApp = ({ userId = 'user-1', role = null } = {}) => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.userId = userId;
    req.userRole = role;
    next();
  });
  // Igual que en app.js: el guard se monta en el prefijo del producto, así
  // req.path queda relativo ('/user-role') y la exención por ruta funciona.
  const router = express.Router();
  router.get('/user-role', (_req, res) => res.json({ ok: true }));
  router.get('/whatever', (_req, res) => res.json({ ok: true }));
  app.use(
    '/api/smartboard',
    requireProduct('smartboard', { allowPaths: ['/user-role'] }),
    router,
  );
  return app;
};

describe('requireProduct', () => {
  const originalFrom = supabase.from;

  afterEach(() => {
    supabase.from = originalFrom;
  });

  // Stub encadenable: soporta .select().eq().eq().limit() y .maybeSingle(),
  // resolviendo según la tabla (parent_student_links vs users).
  const stub = ({ links = [], accountType = null, error = null } = {}) => {
    supabase.from = (table) => {
      const obj = {
        select: () => obj,
        eq: () => obj,
        limit: async () => ({
          data: table === 'parent_student_links' ? links : [],
          error: null,
        }),
        maybeSingle: async () => ({
          data: table === 'users' && accountType ? { account_type: accountType } : null,
          error,
        }),
      };
      return obj;
    };
  };

  it('exime las rutas de allowPaths (user-role) aunque la cuenta sea de otro producto', async () => {
    stub({ accountType: 'ialab' });
    const res = await request(makeProductApp()).get('/api/smartboard/user-role');
    expect(res.status).toBe(200);
  });

  it('403 con mensaje claro cuando la cuenta es del otro producto', async () => {
    stub({ accountType: 'ialab' });
    const res = await request(makeProductApp()).get('/api/smartboard/whatever');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('product_mismatch');
    expect(res.body.product).toBe('ialab');
    expect(res.body.message).toMatch(/IALab/);
  });

  it('deja pasar cuando el producto coincide', async () => {
    stub({ accountType: 'smartboard' });
    const res = await request(makeProductApp()).get('/api/smartboard/whatever');
    expect(res.status).toBe(200);
  });

  it('deja pasar a admin (app_metadata.role)', async () => {
    stub({ accountType: 'ialab' });
    const res = await request(makeProductApp({ role: 'admin' })).get('/api/smartboard/whatever');
    expect(res.status).toBe(200);
  });

  it('deja pasar a un padre con vínculo activo', async () => {
    stub({ links: [{ parent_user_id: 'user-1' }], accountType: 'ialab' });
    const res = await request(makeProductApp()).get('/api/smartboard/whatever');
    expect(res.status).toBe(200);
  });

  it('no bloquea cuentas sin account_type (transición)', async () => {
    stub({ accountType: null });
    const res = await request(makeProductApp()).get('/api/smartboard/whatever');
    expect(res.status).toBe(200);
  });
});
