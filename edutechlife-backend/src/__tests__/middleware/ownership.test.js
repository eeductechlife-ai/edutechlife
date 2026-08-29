const express = require('express');
const request = require('supertest');

const supabasePath = require.resolve('../../db/supabase');
const authPath = require.resolve('../../middleware/auth');
const consentPath = require.resolve('../../middleware/parentalConsent');

delete require.cache[authPath];
require.cache[authPath] = {
  id: authPath, filename: authPath, loaded: true,
  exports: { requireAuth: (req, _res, next) => { req.userId = req.headers['x-test-user-id'] || 'test-user-id'; next(); }, optionalAuth: (_r,_res,n)=>n() },
};
delete require.cache[consentPath];
require.cache[consentPath] = {
  id: consentPath, filename: consentPath, loaded: true,
  exports: { requireVerifiedParentalConsent: (_req, _res, next) => next() },
};

const mockSupabase = { from: vi.fn() };
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const { requireStudentAccess, assertStudentAccess } = require('../../middleware/ownership');

function makeApp(route) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.userId = req.headers['x-test-user-id'] || 'test-user-id'; next(); });
  app.use('/t', route);
  return app;
}

describe('ownership middleware', () => {
  const studentRow = (authId) => ({ select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: { id: 's1', auth_id: authId }, error: null }) });
  const linkRow = (present) => ({ select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: present ? { parent_user_id: 'parent-1' } : null, error: null }) });
  const notFound = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) };

  beforeEach(() => { vi.clearAllMocks(); });

  it('400 cuando falta studentId', async () => {
    const app = makeApp(requireStudentAccess, (_r, res) => res.json({ ok: true }));
    const res = await request(app).get('/t');
    expect(res.status).toBe(400);
  });

  it('404 cuando el estudiante no existe', async () => {
    mockSupabase.from.mockReturnValue(notFound);
    const app = makeApp((req, res, next) => requireStudentAccess(req, res, next));
    app.get('/t', (req, res) => res.json({ ok: true }));
    const res = await request(app).get('/t?studentId=missing').set('x-test-user-id', 'student-1');
    expect(res.status).toBe(404);
  });

  it('ALLOW: el estudiante accede a su propia fila', async () => {
    mockSupabase.from.mockReturnValue(studentRow('student-1'));
    const app = makeApp((req, res, next) => requireStudentAccess(req, res, next));
    app.get('/t', (req, res) => res.json({ ok: true, studentId: req.studentId, role: req.ownerRole }));
    const res = await request(app).get('/t?studentId=s1').set('x-test-user-id', 'student-1');
    expect(res.status).toBe(200);
    expect(res.body.studentId).toBe('s1');
    expect(res.body.role).toBe('student');
  });

  it('ALLOW: el padre accede al estudiante vinculado', async () => {
    mockSupabase.from
      .mockReturnValueOnce(studentRow('student-1'))   // students query
      .mockReturnValueOnce(linkRow(true));             // parent_student_links query
    const app = makeApp((req, res, next) => requireStudentAccess(req, res, next));
    app.get('/t', (req, res) => res.json({ ok: true, role: req.ownerRole }));
    const res = await request(app).get('/t?studentId=s1').set('x-test-user-id', 'parent-1');
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('parent');
  });

  it('DENY: un estudiante no accede a otro (IDOR)', async () => {
    mockSupabase.from
      .mockReturnValueOnce(studentRow('student-2'))   // la fila pertenece a otro
      .mockReturnValueOnce(linkRow(false));            // sin link de padre
    const app = makeApp((req, res, next) => requireStudentAccess(req, res, next));
    app.get('/t', (req, res) => res.json({ ok: true }));
    const res = await request(app).get('/t?studentId=s2').set('x-test-user-id', 'student-1');
    expect(res.status).toBe(403);
  });

  it('DENY: un padre no accede a un estudiante no vinculado', async () => {
    mockSupabase.from
      .mockReturnValueOnce(studentRow('student-2'))
      .mockReturnValueOnce(linkRow(false));
    const app = makeApp((req, res, next) => requireStudentAccess(req, res, next));
    app.get('/t', (req, res) => res.json({ ok: true }));
    const res = await request(app).get('/t?studentId=s2').set('x-test-user-id', 'parent-1');
    expect(res.status).toBe(403);
  });

  it('assertStudentAccess devuelve ownerRole correcto', async () => {
    mockSupabase.from.mockReturnValue(studentRow('student-1'));
    const req = { userId: 'student-1' };
    const r = await assertStudentAccess(req, 's1');
    expect(r.ok).toBe(true);
    expect(r.ownerRole).toBe('student');
  });
});
