const request = require('supertest');

const express = require('express');
const { apiLimiter, deepseekLimiter, authLimiter } = require('../../middleware/rateLimiter');

describe('rate limiters', () => {
  it('apiLimiter exports a middleware function', () => {
    expect(apiLimiter).toBeDefined();
    expect(typeof apiLimiter).toBe('function');
  });

  it('deepseekLimiter exports a middleware function', () => {
    expect(deepseekLimiter).toBeDefined();
    expect(typeof deepseekLimiter).toBe('function');
  });

  it('authLimiter exports a middleware function', () => {
    expect(authLimiter).toBeDefined();
    expect(typeof authLimiter).toBe('function');
  });

  it('apiLimiter allows requests under the limit', async () => {
    const app = express();
    app.use('/api', apiLimiter);
    app.get('/api/test', (req, res) => res.json({ ok: true }));

    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/api/test');
      expect(res.status).toBe(200);
    }
  });

  it('deepseekLimiter sets rate limit headers', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = express();
      app.use('/api', deepseekLimiter);
      app.get('/api/test', (req, res) => res.json({ ok: true }));

      const res = await request(app).get('/api/test');
      expect(res.status).toBe(200);
      expect(res.headers['ratelimit-limit']).toBeDefined();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('deepseekLimiter rejects requests over the limit in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = express();
      app.use('/api', deepseekLimiter);
      app.get('/api/test', (req, res) => res.json({ ok: true }));

      let lastStatus = 200;
      for (let i = 0; i < 25; i++) {
        lastStatus = (await request(app).get('/api/test')).status;
      }
      expect(lastStatus).toBe(429);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
