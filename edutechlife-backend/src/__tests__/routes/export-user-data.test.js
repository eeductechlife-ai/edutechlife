const express = require('express');
const request = require('supertest');

const authPath = require.resolve('../../middleware/auth');
const consentPath = require.resolve('../../middleware/parentalConsent');
const supabasePath = require.resolve('../../db/supabase');
const userClientPath = require.resolve('../../db/supabaseUser');

delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      req.userId = 'auth-user-123456';
      next();
    },
  },
};
delete require.cache[consentPath];
require.cache[consentPath] = {
  id: consentPath,
  filename: consentPath,
  loaded: true,
  exports: { requireVerifiedParentalConsent: (_req, _res, next) => next() },
};
delete require.cache[userClientPath];
require.cache[userClientPath] = {
  id: userClientPath,
  filename: userClientPath,
  loaded: true,
  exports: { createUserClient: () => mockSupabase },
};

const mockSupabase = { from: vi.fn() };
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: mockSupabase,
};

// Consulta encadenable y "await-able", como las de supabase-js.
function query(rows, error = null) {
  const q = {
    calls: [],
    select: vi.fn(() => q),
    eq: vi.fn((col, val) => {
      q.calls.push(['eq', col, val]);
      return q;
    }),
    in: vi.fn((col, val) => {
      q.calls.push(['in', col, val]);
      return q;
    }),
    order: vi.fn(() => q),
    limit: vi.fn(() => q),
    maybeSingle: vi.fn(() =>
      Promise.resolve({ data: Array.isArray(rows) ? rows[0] ?? null : rows, error })
    ),
    then: (resolve, reject) => Promise.resolve({ data: rows, error }).then(resolve, reject),
  };
  return q;
}

function setupTables(overrides = {}) {
  const tables = {
    students: query({ id: 'stu-1', auth_id: 'auth-user-123456', name: 'Ana' }),
    vak_results: query([{ id: 'v1', student_id: 'stu-1' }]),
    sessions: query([{ id: 's1' }]),
    achievements: query([{ id: 'a1' }]),
    points_history: query([{ id: 'p1', points: 100 }]),
    parent_consents: query([{ consent_type: 'terms', granted: true }]),
    smartboard_kids_data: query([{ data: { totalPoints: 300, daniChatHistory: [] } }]),
    ...overrides,
  };
  mockSupabase.from.mockImplementation((table) => tables[table]);
  return tables;
}

let app;
beforeAll(() => {
  const router = require('../../routes/ingenia/student-profile');
  app = express();
  app.use(express.json());
  app.use('/api/ingenia', router);
});
beforeEach(() => vi.clearAllMocks());

describe('GET /export-user-data', () => {
  it('descarga un JSON adjunto con el perfil y el progreso real', async () => {
    setupTables();
    const res = await request(app).get('/api/ingenia/export-user-data');
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="edutechlife-datos-auth-use\.json"/);
    expect(res.body.data.profile.name).toBe('Ana');
    expect(res.body.data.progress).toEqual({ totalPoints: 300, daniChatHistory: [] });
    expect(res.body.data.points_history).toEqual([{ id: 'p1', points: 100 }]);
    expect(res.body.warnings).toBeUndefined();
  });

  it('consulta las tablas normalizadas por student_id (antes por user_id, que no existe: salía vacío)', async () => {
    const tables = setupTables();
    await request(app).get('/api/ingenia/export-user-data');
    for (const t of ['vak_results', 'sessions', 'achievements', 'points_history']) {
      expect(tables[t].calls, t).toContainEqual(['eq', 'student_id', 'stu-1']);
      expect(tables[t].calls.some((c) => c[1] === 'user_id'), t).toBe(false);
    }
    expect(tables.smartboard_kids_data.calls).toContainEqual(['eq', 'user_id', 'auth-user-123456']);
  });

  it('el consentimiento se busca con el id de autenticación y con el del estudiante', async () => {
    const tables = setupTables();
    await request(app).get('/api/ingenia/export-user-data');
    expect(tables.parent_consents.calls).toContainEqual([
      'in',
      'student_id',
      ['auth-user-123456', 'stu-1'],
    ]);
  });

  it('si una tabla falla no devuelve una exportación vacía en silencio: lo informa', async () => {
    setupTables({ sessions: query(null, { message: 'column does not exist' }) });
    const res = await request(app).get('/api/ingenia/export-user-data');
    expect(res.status).toBe(200);
    expect(res.body.data.sessions).toEqual([]);
    expect(res.body.warnings.not_exported).toEqual(['sessions']);
  });

  it('sin fila de estudiante exporta lo que haya (el progreso guardado) y no consulta por un id inexistente', async () => {
    const tables = setupTables({ students: query(null) });
    const res = await request(app).get('/api/ingenia/export-user-data');
    expect(res.status).toBe(200);
    expect(res.body.data.profile).toBeNull();
    expect(res.body.data.progress).toEqual({ totalPoints: 300, daniChatHistory: [] });
    expect(res.body.data.vak_results).toEqual([]);
    expect(tables.vak_results.select).not.toHaveBeenCalled();
  });

  it('un error inesperado responde 500 con un mensaje genérico', async () => {
    mockSupabase.from.mockImplementation(() => {
      throw new Error('boom interno');
    });
    const res = await request(app).get('/api/ingenia/export-user-data');
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('boom interno');
  });
});
