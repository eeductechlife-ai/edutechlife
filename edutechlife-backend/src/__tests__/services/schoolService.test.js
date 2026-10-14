const request = require('supertest');
const supabase = require('../../db/supabase');
const {
  normalizeCode,
  isValidCode,
  generateCode,
  joinSchoolWithCode,
  summarizeStudents,
  getSchoolOverview,
} = require('../../services/schoolService');

const STUDENT = '11111111-2222-4333-8444-555555555555';
const SCHOOL = '99999999-8888-4777-8666-555555555555';

// supabase.from() / rpc() falsos: `tables[t]` es lo que devuelve cada tabla.
function fakeSupabase({ tables = {}, rpc = { data: [], error: null } } = {}) {
  const calls = [];
  supabase.from = (table) => {
    const call = { table, update: null };
    calls.push(call);
    const chain = {
      select: () => chain,
      eq: () => chain,
      limit: () => chain,
      update: (values) => {
        call.update = values;
        return chain;
      },
      maybeSingle: async () => ({ data: tables[table] ?? null, error: null }),
      then: (resolve) => resolve({ data: tables[table] ?? null, error: null }),
    };
    return chain;
  };
  supabase.rpc = async (name, args) => {
    calls.push({ rpc: name, args });
    return rpc;
  };
  return calls;
}

const originalFrom = supabase.from;
const originalRpc = supabase.rpc;
afterEach(() => {
  supabase.from = originalFrom;
  supabase.rpc = originalRpc;
});

describe('Códigos de colegio', () => {
  it('acepta el código como lo dictan (espacios, guiones, minúsculas)', () => {
    expect(normalizeCode(' abcd-2345 ')).toBe('ABCD2345');
    expect(isValidCode('ABCD2345')).toBe(true);
    expect(isValidCode('AB')).toBe(false);
    expect(isValidCode("AB'; DROP")).toBe(false);
  });

  it('genera códigos válidos sin letras confusas', () => {
    for (let i = 0; i < 50; i += 1) {
      const code = generateCode();
      expect(isValidCode(code)).toBe(true);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });
});

describe('joinSchoolWithCode', () => {
  it('liga al estudiante, gasta el código y lo deja en Premium sin vencimiento', async () => {
    const calls = fakeSupabase({
      tables: {
        students: { id: STUDENT, institution_id: null },
        institutions: { id: SCHOOL, name: 'Colegio Piloto' },
      },
      rpc: { data: [{ institution_id: SCHOOL, grupo: '7A' }], error: null },
    });
    const res = await joinSchoolWithCode({ studentId: STUDENT, code: 'abcd-2345' });
    expect(res).toEqual({ institution: { id: SCHOOL, name: 'Colegio Piloto' }, grupo: '7A' });
    expect(calls.find((c) => c.rpc).args).toEqual({ p_code: 'ABCD2345' });
    expect(calls.find((c) => c.update).update).toEqual({
      institution_id: SCHOOL,
      grupo: '7A',
      subscription_tier: 'premium',
      premium_until: null,
    });
  });

  it('rechaza un código agotado o vencido sin tocar al estudiante', async () => {
    const calls = fakeSupabase({
      tables: { students: { id: STUDENT, institution_id: null } },
      rpc: { data: [], error: null },
    });
    const res = await joinSchoolWithCode({ studentId: STUDENT, code: 'ABCD2345' });
    expect(res.status).toBe(400);
    expect(calls.some((c) => c.update)).toBe(false);
  });

  it('no gasta el código si el estudiante ya tiene colegio', async () => {
    const calls = fakeSupabase({ tables: { students: { id: STUDENT, institution_id: SCHOOL } } });
    const res = await joinSchoolWithCode({ studentId: STUDENT, code: 'ABCD2345' });
    expect(res.status).toBe(409);
    expect(calls.some((c) => c.rpc)).toBe(false);
  });

  it('rechaza códigos mal formados antes de ir a la base', async () => {
    const calls = fakeSupabase();
    const res = await joinSchoolWithCode({ studentId: STUDENT, code: '%%' });
    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });
});

describe('Resumen del rector', () => {
  const now = new Date('2026-10-14T12:00:00Z');

  it('agrupa por grupo, cuenta activos de la semana y estilos VAK', () => {
    const res = summarizeStudents(
      [
        { grupo: '7A', vak_style: 'visual', last_activity: '2026-10-13T10:00:00Z' },
        { grupo: '7A', vak_style: 'auditory', last_activity: '2026-09-01T10:00:00Z' },
        { grupo: '6B', vak_style: null, last_activity: null },
        { grupo: null, vak_style: 'visual', last_activity: '2026-10-14T08:00:00Z' },
      ],
      now,
    );
    expect(res.total).toBe(4);
    expect(res.activos7d).toBe(2);
    expect(res.grupos).toEqual([
      { grupo: '6B', estudiantes: 1, activos7d: 0 },
      { grupo: '7A', estudiantes: 2, activos7d: 1 },
      { grupo: 'Sin grupo', estudiantes: 1, activos7d: 1 },
    ]);
    expect(res.vak).toEqual({ visual: 2, auditivo: 1, sin_diagnostico: 1 });
  });

  it('no devuelve nombres ni ids de estudiantes', () => {
    const res = summarizeStudents([{ id: STUDENT, name: 'Niño', grupo: '7A' }], now);
    expect(JSON.stringify(res)).not.toContain('Niño');
    expect(JSON.stringify(res)).not.toContain(STUDENT);
  });

  it('niega el panel a quien no es rector ni docente', async () => {
    fakeSupabase({ tables: { institution_members: [] } });
    const res = await getSchoolOverview('user-x');
    expect(res.status).toBe(403);
  });
});

describe('Rutas de colegios', () => {
  const app = require('../../app');

  it('unirse con código pide sesión', async () => {
    const res = await request(app).post('/api/institutions/join').send({ studentId: STUDENT, code: 'ABCD2345' });
    expect(res.status).toBe(401);
  });

  it('el panel del rector pide sesión', async () => {
    const res = await request(app).get('/api/institutions/my/overview');
    expect(res.status).toBe(401);
  });

  it('crear códigos pide sesión de admin', async () => {
    const res = await request(app).post(`/api/institutions/${SCHOOL}/codes`).send({ max_uses: 30 });
    expect(res.status).toBe(401);
  });
});
