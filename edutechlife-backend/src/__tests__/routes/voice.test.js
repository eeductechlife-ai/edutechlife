const express = require('express');
const request = require('supertest');
const app = require('../../app');

describe('GET /api/voice/token', () => {
  it('returns 500 when Google credentials are not configured', async () => {
    const res = await request(app).get('/api/voice-token/token');
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('Google credentials');
  });
});

describe('GET /api/voice-token/token with mock', () => {
  let testApp;

  beforeAll(() => {
    testApp = express();
    testApp.use(express.json({ limit: '1mb' }));
    const voiceRoutes = require('../../routes/voice');
    testApp.use('/api/voice-token', voiceRoutes);
  });

  it('returns 500 when google-auth-library mock throws', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'test-private-key';
    const res = await request(testApp).get('/api/voice-token/token');
    expect(res.status).toBe(500);
    delete process.env.GOOGLE_CLIENT_EMAIL;
    delete process.env.GOOGLE_PRIVATE_KEY;
  });
});
