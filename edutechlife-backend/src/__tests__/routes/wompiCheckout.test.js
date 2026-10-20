/**
 * POST /api/payments/wompi/checkout: ¿a quién se le aplica el plan IngenIA?
 * Si paga el padre o acudiente, el plan es del hijo vinculado
 * (parent_student_links), no de la cuenta del adulto. La referencia firmada
 * lleva el id del beneficiario y el evento de Wompi activa esa cuenta.
 */

const express = require('express');
const request = require('supertest');
const { parseReference } = require('../../services/wompi');

const PADRE = '11111111-1111-4111-8111-111111111111';
const HIJO = '22222222-2222-4222-8222-222222222222';
const HIJA = '33333333-3333-4333-8333-333333333333';
const NINO = '44444444-4444-4444-8444-444444444444';
const OTRO = '55555555-5555-4555-8555-555555555555';

const TOKENS = { 'tok-padre': PADRE, 'tok-nino': NINO, 'tok-otro': OTRO };

// Tablas simuladas. Cada prueba arma sus filas.
const db = { parent_student_links: [], students: [] };

function fromMock(table) {
  const filtros = [];
  const filas = () =>
    (db[table] || []).filter((f) => filtros.every(([c, v]) => (Array.isArray(v) ? v.includes(f[c]) : f[c] === v)));
  const chain = {
    select: () => chain,
    eq: (col, val) => {
      filtros.push([col, val]);
      return chain;
    },
    in: (col, vals) => {
      filtros.push([col, vals]);
      return chain;
    },
    limit: () => chain,
    maybeSingle: async () => ({ data: filas()[0] ?? null, error: null }),
    then: (resolve, reject) => Promise.resolve({ data: filas(), error: null }).then(resolve, reject),
  };
  return chain;
}

const supabasePath = require.resolve('../../db/supabase');
const mockSupabase = {
  auth: {
    getUser: vi.fn(async (token) => {
      const id = TOKENS[token];
      return id
        ? { data: { user: { id, email: `${id}@ejemplo.co`, app_metadata: {} } }, error: null }
        : { data: { user: null }, error: { message: 'invalid token' } };
    }),
  },
  from: vi.fn(fromMock),
};
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const wompiRoutes = require('../../routes/wompi');

const app = express();
app.use(express.json());
app.use('/api/payments/wompi', wompiRoutes);

const CLAVES = {
  WOMPI_PUBLIC_KEY: 'pub_test_abc',
  WOMPI_INTEGRITY_SECRET: 'test_integrity_x',
  WOMPI_EVENTS_SECRET: 'test_events_y',
};

const pagar = (token, body) =>
  request(app).post('/api/payments/wompi/checkout').set('Authorization', `Bearer ${token}`).send(body);

const beneficiario = (res) => parseReference(new URL(res.body.url).searchParams.get('reference')).userId;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-15T10:00:00-05:00'));
  Object.assign(process.env, CLAVES);
  db.parent_student_links = [];
  db.students = [];
});

afterEach(() => {
  vi.useRealTimers();
  Object.keys(CLAVES).forEach((k) => delete process.env[k]);
});

describe('POST /api/payments/wompi/checkout: beneficiario del plan IngenIA', () => {
  it('si el padre paga, el plan queda en la cuenta de su hijo vinculado', async () => {
    db.parent_student_links = [{ parent_user_id: PADRE, student_user_id: HIJO, is_active: true }];
    db.students = [{ auth_id: HIJO }];

    const res = await pagar('tok-padre', { planId: 'smartboard_premium' });

    expect(res.status).toBe(200);
    expect(beneficiario(res)).toBe(HIJO);
  });

  it('el padre registrado por IngenIA (con su propia fila en students) también paga para el hijo', async () => {
    db.parent_student_links = [{ parent_user_id: PADRE, student_user_id: HIJO, is_active: true }];
    db.students = [{ auth_id: PADRE }, { auth_id: HIJO }];

    const res = await pagar('tok-padre', { planId: 'ingenia_fundador' });

    expect(res.status).toBe(200);
    expect(beneficiario(res)).toBe(HIJO);
  });

  it('con varios hijos pide elegir y aplica al hijo indicado', async () => {
    db.parent_student_links = [
      { parent_user_id: PADRE, student_user_id: HIJO, is_active: true },
      { parent_user_id: PADRE, student_user_id: HIJA, is_active: true },
    ];
    db.students = [{ auth_id: HIJO }, { auth_id: HIJA }];

    const sinElegir = await pagar('tok-padre', { planId: 'smartboard_premium' });
    expect(sinElegir.status).toBe(400);
    expect(sinElegir.body.error).toMatch(/hijo/i);

    const elegido = await pagar('tok-padre', { planId: 'smartboard_premium', studentId: HIJA });
    expect(elegido.status).toBe(200);
    expect(beneficiario(elegido)).toBe(HIJA);
  });

  it('no deja pagar para un niño que no está vinculado al pagador', async () => {
    db.parent_student_links = [
      { parent_user_id: PADRE, student_user_id: HIJO, is_active: true },
      { parent_user_id: OTRO, student_user_id: HIJA, is_active: true },
    ];
    db.students = [{ auth_id: HIJO }, { auth_id: HIJA }];

    const res = await pagar('tok-padre', { planId: 'smartboard_premium', studentId: HIJA });
    expect(res.status).toBe(403);
  });

  it('no cobra si el hijo vinculado no tiene cuenta de IngenIA (el evento no tendría qué activar)', async () => {
    db.parent_student_links = [{ parent_user_id: PADRE, student_user_id: HIJO, is_active: true }];

    const res = await pagar('tok-padre', { planId: 'smartboard_premium' });

    expect(res.status).toBe(400);
    expect(res.body.url).toBeUndefined();
  });

  it('con un hijo en IngenIA y otro solo en IALab, el plan va al de IngenIA sin preguntar', async () => {
    db.parent_student_links = [
      { parent_user_id: PADRE, student_user_id: HIJO, is_active: true },
      { parent_user_id: PADRE, student_user_id: HIJA, is_active: true },
    ];
    db.students = [{ auth_id: HIJA }];

    const res = await pagar('tok-padre', { planId: 'smartboard_premium' });

    expect(res.status).toBe(200);
    expect(beneficiario(res)).toBe(HIJA);
  });

  it('un vínculo inactivo no cuenta', async () => {
    db.parent_student_links = [{ parent_user_id: PADRE, student_user_id: HIJO, is_active: false }];

    const res = await pagar('tok-padre', { planId: 'smartboard_premium' });
    expect(res.status).toBe(400);
  });

  it('si paga el propio niño (sin hijos vinculados), el plan es suyo', async () => {
    db.students = [{ auth_id: NINO }];

    const res = await pagar('tok-nino', { planId: 'smartboard_premium' });

    expect(res.status).toBe(200);
    expect(beneficiario(res)).toBe(NINO);
  });

  it('un adulto sin hijo vinculado ni perfil de estudiante no puede pagar (el plan no tendría a quién aplicarse)', async () => {
    const res = await pagar('tok-otro', { planId: 'smartboard_premium' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/vincula/i);
  });
});
