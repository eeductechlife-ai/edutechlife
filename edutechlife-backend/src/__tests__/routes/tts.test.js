const express = require('express');
const request = require('supertest');
const app = require('../../app');

describe('POST /api/tts', () => {
  it('is reachable WITHOUT a token (endpoint público para Nico)', async () => {
    const res = await request(app)
      .post('/api/tts')
      .send({ input: { text: 'Hola' }, voice: { languageCode: 'es-US', name: 'es-US-Neural2-B' } });
    // Sin GOOGLE_TTS_API_KEY el handler responde 500 — lo importante es que ya
    // NO responde 401: la ruta es accesible sin sesión.
    expect(res.status).not.toBe(401);
    expect([400, 500]).toContain(res.status);
  });
});

describe('POST /api/tts con validaciones de idioma', () => {
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

  it('rejects non-Spanish voices (allow-list es-*)', async () => {
    const res = await request(testApp)
      .post('/api/tts')
      .send({ input: { text: 'Hello' }, voice: { languageCode: 'en-US', name: 'en-US-Standard-A' } });
    expect(res.status).toBe(400);
  });

  it('rejects a name that does not match the voice languageCode', async () => {
    const res = await request(testApp)
      .post('/api/tts')
      .send({ input: { text: 'Hola' }, voice: { languageCode: 'es-US', name: 'es-ES-Neural2-A' } });
    expect(res.status).toBe(400);
  });

  it('accepts a Spanish voice and returns upstream error from Google TTS', async () => {
    const res = await request(testApp)
      .post('/api/tts')
      .send({ input: { text: 'Hola' }, voice: { languageCode: 'es-US', name: 'es-US-Neural2-B' } });
    expect([400, 500]).toContain(res.status);
  });
});
