const express = require('express');
const request = require('supertest');
const app = require('../../app');

describe('POST /api/tts', () => {
  it('returns 500 when TTS API key is not configured', async () => {
    const res = await request(app)
      .post('/api/tts')
      .send({ input: { text: 'Hello' }, voice: { languageCode: 'es-ES' } });
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('API key not configured');
  });
});

describe('POST /api/tts with API key set', () => {
  let testApp;

  beforeAll(() => {
    const ttsPath = require.resolve('../../routes/tts');
    delete require.cache[ttsPath];
    process.env.GOOGLE_TTS_API_KEY = 'test-tts-key';
    testApp = express();
    testApp.use(express.json({ limit: '1mb' }));
    const ttsRoutes = require('../../routes/tts');
    testApp.use('/api/tts', ttsRoutes);
  });

  afterAll(() => {
    delete process.env.GOOGLE_TTS_API_KEY;
  });

  it('returns upstream error from Google TTS', async () => {
    const res = await request(testApp)
      .post('/api/tts')
      .send({ input: { text: 'Hello' }, voice: { languageCode: 'es-ES' } });
    expect([400, 500]).toContain(res.status);
  });
});
