const express = require('express');
const request = require('supertest');

const authPath = require.resolve('../../middleware/auth');
const supabasePath = require.resolve('../../db/supabase');

delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      req.userId = req.headers['x-test-user-id'] || 'test-user-id';
      next();
    },
  },
};

const mockSupabase = { from: vi.fn() };
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: mockSupabase,
};

function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  const smartboardRoutes = require('../../routes/smartboard');
  app.use('/api/smartboard', smartboardRoutes);
  return app;
}

let app;
beforeAll(() => { app = createApp(); });
beforeEach(() => { vi.clearAllMocks(); });

describe('Smartboard GET /data/:userId', () => {
  it('returns 404 when data not found (PGRST116)', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });

    const res = await request(app)
      .get('/api/smartboard/data/missing-user')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'missing-user');
    expect(res.status).toBe(404);
  });

  it('returns 403 when userId mismatch', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { data: {} }, error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/data/other-user')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(403);
  });

  it('returns data successfully', async () => {
    const fakeData = { totalPoints: 100, streak: 5 };
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { data: fakeData }, error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/data/test-user-id')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeData);
  });
});

describe('Smartboard GET /progress/:userId', () => {
  it('returns 404 when progress not found', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });

    const res = await request(app)
      .get('/api/smartboard/progress/missing-user')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'missing-user');
    expect(res.status).toBe(404);
  });

  it('returns progress metrics', async () => {
    const kidData = {
      totalPoints: 250, streak: 7, completedMissions: [1, 2],
      subjectProgress: { math: 50 }, totalActiveMinutes: 120,
      vakResult: { predominantStyle: 'visual' },
    };
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { data: kidData }, error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/progress/test-user-id')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');
    expect(res.status).toBe(200);
    expect(res.body.totalPoints).toBe(250);
    expect(res.body.streak).toBe(7);
  });
});

describe('Smartboard POST /chat validation', () => {
  it('returns 400 when messages missing', async () => {
    const res = await request(app)
      .post('/api/smartboard/chat')
      .set('Authorization', 'Bearer test-token')
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 when messages empty', async () => {
    const res = await request(app)
      .post('/api/smartboard/chat')
      .set('Authorization', 'Bearer test-token')
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 when message has no content', async () => {
    const res = await request(app)
      .post('/api/smartboard/chat')
      .set('Authorization', 'Bearer test-token')
      .send({ messages: [{ role: 'user' }] });
    expect(res.status).toBe(400);
  });
});
