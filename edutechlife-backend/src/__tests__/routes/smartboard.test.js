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

describe('Smartboard POST /weekly-report', () => {
  it('returns a preview summary without sending email', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { data: { totalPoints: 120, streak: 3 } },
        error: null,
      }),
    });

    const res = await request(app)
      .post('/api/smartboard/weekly-report')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1')
      .send({ preview: true });

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalPoints).toBe(120);
  });

  it('returns 404 when the child has no data yet', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });

    const res = await request(app)
      .post('/api/smartboard/weekly-report')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1')
      .send({});

    expect(res.status).toBe(404);
  });

  it('returns 404 when no parent email is registered', async () => {
    // First call: kid data. Second call: parent_consents (no email).
    mockSupabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { data: { totalPoints: 10 } }, error: null }),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

    const res = await request(app)
      .post('/api/smartboard/weekly-report')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1')
      .send({});

    expect(res.status).toBe(404);
    expect(res.body.summary).toBeDefined();
  });
});

describe('Smartboard GET /wellbeing-status', () => {
  it('returns calm status when there are no high alerts', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/wellbeing-status')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1');

    expect(res.status).toBe(200);
    expect(res.body.monitoring).toBe(true);
    expect(res.body.status).toBe('calm');
    expect(res.body.highAlerts).toBe(0);
  });

  it('returns attention status when a high alert exists (no sensitive content)', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockResolvedValue({
        data: [{ crisis_level: 'high', created_at: '2026-08-01T10:00:00Z' }],
        error: null,
      }),
    });

    const res = await request(app)
      .get('/api/smartboard/wellbeing-status')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('attention');
    expect(res.body.highAlerts).toBe(1);
    // Never leaks detected content
    expect(JSON.stringify(res.body)).not.toContain('detected_content');
  });

  it('stays healthy (monitoring true) when the table is missing', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockResolvedValue({ data: null, error: { code: '42P01' } }),
    });

    const res = await request(app)
      .get('/api/smartboard/wellbeing-status')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-1');

    expect(res.status).toBe(200);
    expect(res.body.monitoring).toBe(true);
    expect(res.body.status).toBe('calm');
  });
});

describe('Smartboard DELETE /delete-user-data', () => {
  it('deletes across all tables using the token identity and returns 200', async () => {
    const deleteEq = vi.fn().mockResolvedValue({ error: null });
    mockSupabase.from.mockReturnValue({
      delete: vi.fn().mockReturnValue({ eq: deleteEq }),
    });

    const res = await request(app)
      .delete('/api/smartboard/delete-user-data')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-123');

    expect(res.status).toBe(200);
    // One delete per table (students + 4 auxiliary tables)
    expect(mockSupabase.from).toHaveBeenCalledWith('students');
    expect(mockSupabase.from).toHaveBeenCalledWith('smartboard_kids_data');
    expect(mockSupabase.from).toHaveBeenCalledWith('parent_consents');
    // Erasure completo: perfil users, vínculos padre→hijo y activity_log legacy
    expect(mockSupabase.from).toHaveBeenCalledWith('users');
    expect(mockSupabase.from).toHaveBeenCalledWith('parent_student_links');
    // Always scoped to the authenticated user id from the token
    expect(deleteEq).toHaveBeenCalledWith('auth_id', 'kid-123');
  });

  it('tolerates missing tables (42P01) and still succeeds', async () => {
    mockSupabase.from.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { code: '42P01', message: 'relation does not exist' } }),
      }),
    });

    const res = await request(app)
      .delete('/api/smartboard/delete-user-data')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-123');

    expect(res.status).toBe(200);
  });

  it('returns 500 when a real delete error occurs', async () => {
    mockSupabase.from.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { code: '23503', message: 'fk violation' } }),
      }),
    });

    const res = await request(app)
      .delete('/api/smartboard/delete-user-data')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'kid-123');

    expect(res.status).toBe(500);
  });
});

describe('Smartboard GET /student-profile', () => {
  it('returns student profile with all fields', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { age: 12, vak_style: 'visual', school: 'Colegio Mayor', grade: '6B' },
        error: null,
      }),
    });

    const res = await request(app)
      .get('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123');

    expect(res.status).toBe(200);
    expect(res.body.age).toBe(12);
    expect(res.body.vakStyle).toBe('visual');
    expect(res.body.school).toBe('Colegio Mayor');
    expect(res.body.grade).toBe('6B');
  });

  it('returns 404 when profile not found', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });

    const res = await request(app)
      .get('/api/smartboard/student-profile')
      .set('x-test-user-id', 'missing-user');

    expect(res.status).toBe(404);
  });

  it('handles null fields gracefully', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { age: null, vak_style: null, school: null, grade: null },
        error: null,
      }),
    });

    const res = await request(app)
      .get('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123');

    expect(res.status).toBe(200);
    expect(res.body.age).toBeNull();
    expect(res.body.vakStyle).toBeNull();
  });
});

describe('Smartboard PUT /student-profile', () => {
  it('updates all fields successfully', async () => {
    mockSupabase.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { age: 13, vak_style: 'auditivo', school: 'Liceo', grade: '7A' },
        error: null,
      }),
    });

    const res = await request(app)
      .put('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123')
      .send({ age: 13, vakStyle: 'auditivo', school: 'Liceo', grade: '7A' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('actualizado');
    expect(res.body.profile.age).toBe(13);
    expect(res.body.profile.vakStyle).toBe('auditivo');
  });

  it('updates single field only', async () => {
    mockSupabase.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { age: 14, vak_style: null, school: null, grade: null },
        error: null,
      }),
    });

    const res = await request(app)
      .put('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123')
      .send({ age: 14 });

    expect(res.status).toBe(200);
    expect(res.body.profile.age).toBe(14);
  });

  it('returns 400 when age invalid', async () => {
    const res = await request(app)
      .put('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123')
      .send({ age: 99 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('age');
  });

  it('returns 400 when no fields to update', async () => {
    const res = await request(app)
      .put('/api/smartboard/student-profile')
      .set('x-test-user-id', 'kid-123')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('No hay campos');
  });

  it('returns 404 when student not found', async () => {
    mockSupabase.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });

    const res = await request(app)
      .put('/api/smartboard/student-profile')
      .set('x-test-user-id', 'missing-user')
      .send({ age: 12 });

    expect(res.status).toBe(404);
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

describe('Smartboard POST /parental-consent', () => {
  it('rejects invalid studentAge type', async () => {
    const res = await request(app)
      .post('/api/smartboard/parental-consent')
      .set('x-test-user-id', 'kid-1')
      .send({ parentEmail: 'papa@x.co', studentAge: 'once' });
    expect(res.status).toBe(400);
  });

  it('rejects out-of-range studentAge', async () => {
    const res = await request(app)
      .post('/api/smartboard/parental-consent')
      .set('x-test-user-id', 'kid-1')
      .send({ parentEmail: 'papa@x.co', studentAge: 99 });
    expect(res.status).toBe(400);
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/smartboard/parental-consent')
      .set('x-test-user-id', 'kid-1')
      .send({ parentEmail: 'not-an-email', studentAge: 12 });
    expect(res.status).toBe(400);
  });

  it('registers a pending consent and returns it without exposing the token', async () => {
    const inserted = {
      id: 'c1',
      parent_email: 'papa@x.co',
      student_age: 12,
      verification_status: 'pending',
      verification_token: 'super-secret-token-1234567890',
    };
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    chain.insert.mockReturnValue(chain);
    chain.select.mockResolvedValue({ data: [inserted], error: null });
    mockSupabase.from.mockReturnValue(chain);

    const res = await request(app)
      .post('/api/smartboard/parental-consent')
      .set('x-test-user-id', 'kid-1')
      .send({ parentEmail: 'papa@x.co', studentAge: 12 });

    expect(res.status).toBe(201);
    expect(res.body.data.verification_status).toBe('pending');
    expect(JSON.stringify(res.body)).not.toContain('super-secret-token');
  });
});

describe('Smartboard POST /parental-consent/verify', () => {
  it('marks consent as verified when token matches', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { verification_status: 'verified' },
        error: null,
      }),
    };
    mockSupabase.from.mockReturnValue(chain);

    const res = await request(app)
      .post('/api/smartboard/parental-consent/verify')
      .send({ token: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6' });

    expect(res.status).toBe(200);
    expect(res.body.verification_status).toBe('verified');
  });

  it('returns 404 when token is not found', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    mockSupabase.from.mockReturnValue(chain);

    const res = await request(app)
      .post('/api/smartboard/parental-consent/verify')
      .send({ token: 'a1b2c3d4e5f6a1b2c3d4e5f6-no-such-token' });

    expect(res.status).toBe(404);
  });

  it('returns 400 when token is missing or too short', async () => {
    const res = await request(app)
      .post('/api/smartboard/parental-consent/verify')
      .send({ token: 'short' });
    expect(res.status).toBe(400);
  });
});
