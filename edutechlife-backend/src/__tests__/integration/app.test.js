// El router de IALab ahora cuelga de requireAuth/requireProduct en app.js: estas
// pruebas validan los handlers, no el login, así que se simulan los guards.
const authPath = require.resolve('../../middleware/auth');
delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, _res, next) => { req.userId = 'test-user-id'; next(); },
    optionalAuth: (_req, _res, next) => next(),
    requireProduct: () => (_req, _res, next) => next(),
  },
};

const request = require('supertest');
const app = require('../../app');

describe('App integration', () => {
  it('applies CORS headers', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://edutechlife.co');
    expect(res.headers['access-control-allow-origin']).toBe('https://edutechlife.co');
  });

  it('allows the native app origins (Capacitor Android/iOS)', async () => {
    for (const origin of ['https://localhost', 'capacitor://localhost']) {
      const res = await request(app).get('/api/health').set('Origin', origin);
      expect(res.headers['access-control-allow-origin']).toBe(origin);
    }
  });

  it('rejects origins outside the allowlist', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('applies helmet security headers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('sanitizes script tags from request body', async () => {
    const res = await request(app)
      .post('/api/ialab/evaluate-prompt')
      .set('Content-Type', 'application/json')
      .send({ prompt: '<script>alert("xss")</script>' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Prompt is required');
  });

  it('responds to OPTIONS preflight', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:5174')
      .set('Access-Control-Request-Method', 'GET');
    expect([204, 200]).toContain(res.status);
  });
});
