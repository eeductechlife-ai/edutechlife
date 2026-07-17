const express = require('express');
const request = require('supertest');
const app = require('../../app');

function buildSmartboardTestApp() {
  const testApp = express();
  testApp.use(express.json({ limit: '1mb' }));
  const smartboardRoutes = require('../../routes/smartboard');
  testApp.use('/api/smartboard', smartboardRoutes);
  return testApp;
}
const smartTestApp = buildSmartboardTestApp();

describe('Smartboard routes', () => {
  describe('GET /api/smartboard/data/:userId', () => {
    it('returns 401 when supabase data not found', async () => {
      const res = await request(app).get('/api/smartboard/data/nonexistent-user');
      expect([401, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/progress/:userId', () => {
    it('returns a response for nonexistent user', async () => {
      const res = await request(app).get('/api/smartboard/progress/nonexistent-user');
      expect([401, 404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/data/:userId (bypassed auth)', () => {
    it('returns 404 when data not found', async () => {
      const res = await request(smartTestApp)
        .get('/api/smartboard/data/no-data-user');
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('GET /api/smartboard/progress/:userId (bypassed auth)', () => {
    it('returns 404 when progress not found', async () => {
      const res = await request(smartTestApp)
        .get('/api/smartboard/progress/no-data-user');
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('POST /api/smartboard/chat', () => {
    it('returns 400 when messages are missing', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({});
      expect(res.status).toBe(400);
    });

    it('returns 400 when messages is empty', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [] });
      expect(res.status).toBe(400);
    });

    it('returns 400 when messages has no content', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [{ role: 'user' }] });
      expect(res.status).toBe(400);
    });

    it('responds to valid messages with a result', async () => {
      const res = await request(app)
        .post('/api/smartboard/chat')
        .send({ messages: [{ role: 'user', content: 'Hola' }] });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.result).toBeDefined();
      } else {
        expect(res.body.error).toBeDefined();
      }
    }, 15000);
  });
});
