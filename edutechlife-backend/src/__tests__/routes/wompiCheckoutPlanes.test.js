/**
 * POST /api/payments/wompi/checkout: qué planes se pueden comprar directo.
 * Los planes Personalizado (Acompañamiento, Intensivo) llevan valoración gratis
 * antes de cualquier cobro: solo se cobran con el enlace del asesor
 * (/link-cobro), nunca desde el checkout del usuario.
 */

const express = require('express');
const request = require('supertest');

const USUARIO = '6f1c2a3b-1111-4222-8333-944455556666';

const supabasePath = require.resolve('../../db/supabase');
const mockSupabase = {
  auth: {
    getUser: vi.fn(async (token) =>
      token === 'tok-nino'
        ? { data: { user: { id: USUARIO, email: 'nino@ejemplo.co', app_metadata: {} } }, error: null }
        : { data: { user: null }, error: { message: 'invalid token' } },
    ),
  },
  // Cualquier lectura devuelve la fila del estudiante que paga.
  from: vi.fn(() => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      in: () => chain,
      limit: () => chain,
      maybeSingle: async () => ({ data: { auth_id: USUARIO }, error: null }),
      then: (resolve, reject) => Promise.resolve({ data: [], error: null }).then(resolve, reject),
    };
    return chain;
  }),
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

const pagar = (body) =>
  request(app).post('/api/payments/wompi/checkout').set('Authorization', 'Bearer tok-nino').send(body);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-15T10:00:00-05:00'));
  Object.assign(process.env, CLAVES);
});

afterEach(() => {
  vi.useRealTimers();
  Object.keys(CLAVES).forEach((k) => delete process.env[k]);
});

describe('POST /api/payments/wompi/checkout: planes de valoración', () => {
  it.each(['ingenia_acompanamiento', 'ingenia_intensivo'])('rechaza %s (requiere valoración gratis)', async (planId) => {
    const res = await pagar({ planId });

    expect(res.status).toBe(400);
    expect(res.body.url).toBeUndefined();
    expect(res.body.error).toMatch(/valoración/i);
  });

  it('rechaza planes a la medida (enterprise)', async () => {
    const res = await pagar({ planId: 'enterprise' });

    expect(res.status).toBe(400);
    expect(res.body.url).toBeUndefined();
  });

  it('sigue cobrando el plan Base directo', async () => {
    const res = await pagar({ planId: 'smartboard_premium' });

    expect(res.status).toBe(200);
    expect(res.body.url).toContain('checkout.wompi.co');
  });
});
