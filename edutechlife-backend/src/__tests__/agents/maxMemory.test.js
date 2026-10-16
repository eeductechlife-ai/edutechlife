const path = require('path');
const request = require('supertest');

const rows = new Map();
const fakeSupabase = {
  from() {
    const f = {};
    const chain = {
      select() { return chain; },
      eq(k, v) { f[k] = v; return chain; },
      gt() { return chain; },
      maybeSingle() {
        const r = rows.get(`${f.agent}|${f.subject_key}`);
        return Promise.resolve({ data: r || null, error: null });
      },
      upsert(row) { rows.set(`${row.agent}|${row.subject_key}`, { ...row }); return Promise.resolve({ error: null }); },
      delete() {
        return { eq(k, v) { f[k] = v; return { eq(k2, v2) { f[k2] = v2; rows.delete(`${f.agent}|${f.subject_key}`); return Promise.resolve({ error: null }); } }; } };
      },
    };
    return chain;
  },
};
const chatMock = vi.fn(async () => ({ choices: [{ message: { content: 'Aprende con ejemplos. Su correo es ana@ejemplo.co.' } }] }));

let app;
const USER = 'user-uuid-0001';
beforeAll(() => {
  process.env.DEEPSEEK_API_KEY = 'test-key';
  const deepseekPath = path.resolve(__dirname, '../../services/deepseek.js');
  require.cache[deepseekPath] = { id: deepseekPath, filename: deepseekPath, loaded: true, exports: { chat: chatMock, chatStream: vi.fn(), validateMessages: () => null } };
  const dbPath = path.resolve(__dirname, '../../db/supabase.js');
  require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: fakeSupabase };
  // Doble de auth: sin cabecera de prueba no hay sesión (401), como el middleware real.
  const authPath = path.resolve(__dirname, '../../middleware/auth.js');
  require.cache[authPath] = {
    id: authPath, filename: authPath, loaded: true,
    exports: {
      requireAuth: (req, res, next) => {
        const id = req.headers['x-test-user'];
        if (!id) return res.status(401).json({ error: 'no session' });
        req.userId = id;
        next();
      },
      optionalAuth: (req, _res, next) => next(),
      requireProduct: () => (_req, _res, next) => next(),
    },
  };
  const express = require('express');
  app = express();
  app.use(express.json());
  app.use('/api/agents', require('../../routes/agents'));
});

beforeEach(() => { rows.clear(); chatMock.mockClear(); });

const turn = (text = '¿cómo funciona un bucle?') => ({ messages: [{ role: 'user', content: text }, { role: 'assistant', content: 'Repite una acción.' }, { role: 'user', content: text }] });

describe('memoria de Max', () => {
  it('exige sesión', async () => {
    await request(app).get('/api/agents/max/memory').expect(401);
    await request(app).post('/api/agents/max/memory/turns').send(turn()).expect(401);
    await request(app).delete('/api/agents/max/memory').expect(401);
  });

  it('devuelve solo la memoria del propio usuario', async () => {
    rows.set(`max|${USER}`, { agent: 'max', subject_key: USER, summary: 'Le cuesta la recursión', turns: 3 });
    const mine = await request(app).get('/api/agents/max/memory').set('x-test-user', USER).expect(200);
    expect(mine.body.summary).toBe('Le cuesta la recursión');
    const other = await request(app).get('/api/agents/max/memory').set('x-test-user', 'otro-usuario-9').expect(200);
    expect(other.body.summary).toBe('');
  });

  it('registra turnos y, en el sexto, resume sin correos', async () => {
    rows.set(`max|${USER}`, { agent: 'max', subject_key: USER, summary: '', turns: 5 });
    await request(app).post('/api/agents/max/memory/turns').set('x-test-user', USER).send(turn()).expect(200);
    const row = rows.get(`max|${USER}`);
    expect(row.turns).toBe(6);
    expect(row.summary).toMatch(/ejemplos/);
    expect(row.summary).not.toMatch(/ana@ejemplo\.co/);
    expect(chatMock).toHaveBeenCalledTimes(1);
  });

  it('rechaza turnos que no terminan en el usuario', async () => {
    await request(app).post('/api/agents/max/memory/turns').set('x-test-user', USER)
      .send({ messages: [{ role: 'user', content: 'hola' }, { role: 'assistant', content: 'hola' }] }).expect(400);
  });

  it('el usuario puede borrar su memoria', async () => {
    rows.set(`max|${USER}`, { agent: 'max', subject_key: USER, summary: 'algo', turns: 2 });
    await request(app).delete('/api/agents/max/memory').set('x-test-user', USER).expect(200);
    expect(rows.has(`max|${USER}`)).toBe(false);
  });
});
