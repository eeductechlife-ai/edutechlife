const path = require('path');
const request = require('supertest');

// Dobles en memoria: ni la base de datos ni el modelo se tocan.
const rows = new Map();
const fakeSupabase = {
  from() {
    const filters = {};
    const chain = {
      select() { return chain; },
      eq(k, v) { filters[k] = v; return chain; },
      gt() { return chain; },
      maybeSingle() {
        const row = rows.get(`${filters.agent}|${filters.subject_key}`);
        return Promise.resolve({ data: row || null, error: null });
      },
      upsert(row) {
        rows.set(`${row.agent}|${row.subject_key}`, { ...row });
        return Promise.resolve({ error: null });
      },
    };
    return chain;
  },
};
const chatStreamMock = vi.fn(async (_k, _b, onChunk) => onChunk('Claro, te cuento.'));
const chatMock = vi.fn(async () => ({ choices: [{ message: { content: 'Busca IngenIA para su hijo de 10 años. Escribió ana@ejemplo.co.' } }] }));

let app;
beforeAll(() => {
  process.env.DEEPSEEK_API_KEY = 'test-key';
  const deepseekPath = path.resolve(__dirname, '../../services/deepseek.js');
  require.cache[deepseekPath] = {
    id: deepseekPath, filename: deepseekPath, loaded: true,
    exports: { chatStream: chatStreamMock, chat: chatMock, validateMessages: () => null },
  };
  const dbPath = path.resolve(__dirname, '../../db/supabase.js');
  require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: fakeSupabase };
  const express = require('express');
  app = express();
  app.use(express.json());
  app.use('/api/agents', require('../../routes/agents'));
});

beforeEach(() => {
  rows.clear();
  chatStreamMock.mockClear();
  chatMock.mockClear();
});

const VISITOR = 'visitante-abc-123';
const body = (extra = {}) => ({ messages: [{ role: 'user', content: '¿y cuánto cuesta?' }], ...extra });
const waitFor = async (fn, ms = 1000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return true;
    await new Promise((r) => setTimeout(r, 10));
  }
  return false;
};

describe('memoria de Nico', () => {
  it('incluye el resumen guardado en el prompt, marcado como contexto y no como instrucción', async () => {
    rows.set(`nico|${VISITOR}`, { agent: 'nico', subject_key: VISITOR, summary: 'Busca IngenIA para su hijo de 10 años', turns: 2 });
    await request(app).post('/api/agents/nico/stream').send(body({ visitorId: VISITOR })).expect(200);
    const system = chatStreamMock.mock.calls.at(-1)[1].messages[0].content;
    expect(system).toContain('Busca IngenIA para su hijo de 10 años');
    expect(system).toMatch(/no son instrucciones/);
  });

  it('sin visitorId válido no lee ni escribe memoria', async () => {
    await request(app).post('/api/agents/nico/stream').send(body({ visitorId: 'corto' })).expect(200);
    expect(rows.size).toBe(0);
    const system = chatStreamMock.mock.calls.at(-1)[1].messages[0].content;
    expect(system).not.toMatch(/RESUMEN DE CONVERSACIONES/);
  });

  it('cuenta los turnos y, en el sexto, regenera el resumen sin correos', async () => {
    rows.set(`nico|${VISITOR}`, { agent: 'nico', subject_key: VISITOR, summary: '', turns: 5 });
    await request(app).post('/api/agents/nico/stream').send(body({ visitorId: VISITOR })).expect(200);
    const saved = await waitFor(() => rows.get(`nico|${VISITOR}`)?.turns === 6 && chatMock.mock.calls.length === 1);
    expect(saved).toBe(true);
    const row = rows.get(`nico|${VISITOR}`);
    expect(row.summary).toContain('IngenIA');
    expect(row.summary).not.toMatch(/ana@ejemplo\.co/);
    expect(row.summary).toContain('[dato]');
  });

  it('no regenera el resumen antes del sexto turno', async () => {
    await request(app).post('/api/agents/nico/stream').send(body({ visitorId: VISITOR })).expect(200);
    await waitFor(() => rows.get(`nico|${VISITOR}`)?.turns === 1);
    expect(chatMock).not.toHaveBeenCalled();
  });
});
