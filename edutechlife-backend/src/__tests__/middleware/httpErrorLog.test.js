const express = require('express');
const request = require('supertest');
const logger = require('../../utils/logger');
const { httpErrorLog, getHttpErrorCounts, resetHttpErrorCounts } = require('../../middleware/httpErrorLog');

function buildApp() {
  const app = express();
  app.use((req, _res, next) => {
    req.id = 'req-1';
    next();
  });
  app.use(httpErrorLog);
  const api = express.Router();
  api.get('/ok', (_req, res) => res.json({ ok: true }));
  api.get('/data/:userId', (_req, res) => res.status(404).json({ error: 'no' }));
  api.post('/tts', (_req, res) => res.status(429).json({ error: 'limite' }));
  api.get('/boom', (_req, res) => res.status(500).json({ error: 'x' }));
  api.get('/vision', (_req, res) => res.status(501).json({ error: 'no implementado' }));
  app.use('/api/ingenia', api);
  return app;
}

describe('httpErrorLog', () => {
  let warn;
  let error;
  beforeEach(() => {
    resetHttpErrorCounts();
    warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    error = vi.spyOn(logger, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('no registra las respuestas correctas', async () => {
    await request(buildApp()).get('/api/ingenia/ok').expect(200);
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(getHttpErrorCounts()).toEqual([]);
  });

  it('los 4xx se registran como aviso con método, ruta con patrón, estado y duración', async () => {
    await request(buildApp()).get('/api/ingenia/data/usuario-123').expect(404);
    expect(warn).toHaveBeenCalledTimes(1);
    const [message, meta] = warn.mock.calls[0];
    expect(message).toBe('http_error');
    expect(meta).toMatchObject({
      requestId: 'req-1',
      method: 'GET',
      route: '/api/ingenia/data/:userId', // el patrón, no el id real
      status: 404,
    });
    expect(typeof meta.ms).toBe('number');
    expect(JSON.stringify(meta)).not.toContain('usuario-123');
  });

  it('los 429 y 501 de la auditoría también quedan atribuidos a su ruta', async () => {
    const app = buildApp();
    await request(app).post('/api/ingenia/tts').expect(429);
    await request(app).get('/api/ingenia/vision').expect(501);
    const keys = getHttpErrorCounts().map((c) => c.key).sort();
    expect(keys).toEqual(['GET /api/ingenia/vision 501', 'POST /api/ingenia/tts 429']);
  });

  it('los 5xx se registran como error', async () => {
    await request(buildApp()).get('/api/ingenia/boom').expect(500);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][1]).toMatchObject({ status: 500, route: '/api/ingenia/boom' });
    expect(warn).not.toHaveBeenCalled();
  });

  it('cuenta cuántas veces se repite cada ruta y estado, de mayor a menor', async () => {
    const app = buildApp();
    for (let i = 0; i < 3; i++) await request(app).get('/api/ingenia/data/x' + i);
    await request(app).post('/api/ingenia/tts');
    expect(getHttpErrorCounts()).toEqual([
      { key: 'GET /api/ingenia/data/:userId 404', total: 3 },
      { key: 'POST /api/ingenia/tts 429', total: 1 },
    ]);
  });

  it('las URLs que no coinciden con ninguna ruta se agrupan y no hacen crecer el contador sin límite', async () => {
    const app = buildApp();
    for (let i = 0; i < 400; i++) {
      await request(app).get(`/api/ingenia/inventada/${i}/otra/cosa`);
    }
    const counts = getHttpErrorCounts();
    expect(counts.length).toBeLessThanOrEqual(301);
    expect(counts[0].key).toBe('GET /api/ingenia/inventada/* 404');
    expect(counts[0].total).toBe(400);
  });

  it('la raíz se etiqueta "/" y no "//*"', async () => {
    const app = buildApp();
    await request(app).get('/');
    expect(getHttpErrorCounts()[0].key).toBe('GET / 404');
  });
});
