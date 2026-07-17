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
});
