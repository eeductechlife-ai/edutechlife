const express = require('express');
const request = require('supertest');

const authPath = require.resolve('../../middleware/auth');
const supabasePath = require.resolve('../../db/supabase');
const consentPath = require.resolve('../../middleware/parentalConsent');
const deepseekPath = require.resolve('../../services/deepseek');

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

delete require.cache[consentPath];
require.cache[consentPath] = {
  id: consentPath,
  filename: consentPath,
  loaded: true,
  exports: {
    requireVerifiedParentalConsent: (_req, _res, next) => next(),
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

delete require.cache[deepseekPath];
require.cache[deepseekPath] = {
  id: deepseekPath,
  filename: deepseekPath,
  loaded: true,
  exports: {
    chat: vi.fn(),
    chatStream: vi.fn(),
    validateMessages: vi.fn().mockReturnValue(true),
  },
};

function createApp() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));
  const smartboardRoutes = require('../../routes/smartboard');
  app.use('/api/smartboard', smartboardRoutes);
  return app;
}

let app;
beforeAll(() => { app = createApp(); });
beforeEach(() => { vi.clearAllMocks(); });

// ── GET /dani/history ──────────────────────────────────────────────────────────

describe('GET /dani/history', () => {
  it('returns empty messages when no student found', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/dani/history')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.messages).toEqual([]);
  });

  it('returns chat messages in chronological order', async () => {
    let callCount = 0;
    mockSupabase.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'student-1' }, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [
            { user_message: 'Hola Dani', ai_response: '¡Hola! ¿En qué puedo ayudarte?', timestamp: '2026-09-01T10:00:00Z' },
            { user_message: '¿Qué es la fotosíntesis?', ai_response: 'La fotosíntesis es...', timestamp: '2026-09-01T10:01:00Z' },
          ],
          error: null,
        }),
      };
    });

    const res = await request(app)
      .get('/api/smartboard/dani/history')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.messages).toHaveLength(4);
    expect(res.body.messages[0]).toEqual({
      role: 'user',
      text: 'Hola Dani',
      timestamp: '2026-09-01T10:00:00Z',
    });
    expect(res.body.messages[1]).toEqual({
      role: 'assistant',
      text: '¡Hola! ¿En qué puedo ayudarte?',
      timestamp: '2026-09-01T10:00:00Z',
    });
  });

  it('handles missing conversations table gracefully', async () => {
    let callCount = 0;
    mockSupabase.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'student-1' }, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { code: '42P01', message: 'table not found' },
        }),
      };
    });

    const res = await request(app)
      .get('/api/smartboard/dani/history')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.messages).toEqual([]);
  });
});

// ── POST /dani/chat validation ─────────────────────────────────────────────────

describe('POST /dani/chat — validation', () => {
  it('returns 400 when message is empty', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'student-1', auth_id: 'test-user-id' }, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    });

    const res = await request(app)
      .post('/api/smartboard/dani/chat')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id')
      .send({ message: '', studentId: 'student-1' });

    expect(res.status).toBe(400);
  });

  it('returns 404 when studentId is missing and no student found by auth_id', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    });

    const res = await request(app)
      .post('/api/smartboard/dani/chat')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id')
      .send({ message: 'Hola' });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('estudiante');
  });

  it('returns 403 when accessing another students data', async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'student-other', auth_id: 'other-user-id' },
            error: null,
          }),
        };
      }
      if (table === 'parent_student_links') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    });

    const res = await request(app)
      .post('/api/smartboard/dani/chat')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id')
      .send({ message: 'Hola', studentId: 'student-other' });

    expect(res.status).toBe(403);
  });
});

// ── GET /user-role ─────────────────────────────────────────────────────────────

describe('GET /user-role', () => {
  it('returns student when no parent link exists', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const res = await request(app)
      .get('/api/smartboard/user-role')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('student');
  });

  it('returns parent when active link exists', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { parent_user_id: 'test-user-id' },
        error: null,
      }),
    });

    const res = await request(app)
      .get('/api/smartboard/user-role')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('parent');
  });

  it('returns 500 on database error', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockRejectedValue(new Error('DB down')),
    });

    const res = await request(app)
      .get('/api/smartboard/user-role')
      .set('Authorization', 'Bearer test-token')
      .set('x-test-user-id', 'test-user-id');

    expect(res.status).toBe(500);
  });
});
