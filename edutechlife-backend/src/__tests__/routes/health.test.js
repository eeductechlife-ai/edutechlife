const request = require('supertest');
const app = require('../../app');

describe('GET /api/health', () => {
  it('returns status ok with server info', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    expect(res.body.memoryUsage).toMatch(/^\d+MB$/);
  });
});

describe('404 handling', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Ruta no encontrada');
  });
});

describe('CORS', () => {
  it('allows requests from localhost', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5174');
    expect(res.status).toBe(200);
  });

  it('allows requests from production domain', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://edutechlife.co');
    expect(res.status).toBe(200);
  });
});
