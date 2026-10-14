const supabase = require('../../db/supabase');
const {
  addInterval,
  nextPaidUntil,
  activatePaidPeriod,
  expirePaidPlans,
} = require('../../services/paidPlans');

const USER = '6f1c2a3b-1111-4222-8333-944455556666';
const NOW = new Date('2026-10-14T12:00:00.000Z');

// Simula supabase.from(): guarda cada llamada y devuelve `rows[table]`.
function fakeSupabase(rows = {}) {
  const calls = [];
  supabase.from = (table) => {
    const call = { table, filters: [], update: null };
    calls.push(call);
    const chain = {
      select: () => chain,
      update: (values) => {
        call.update = values;
        return chain;
      },
      eq: (col, val) => {
        call.filters.push(['eq', col, val]);
        return chain;
      },
      neq: (col, val) => {
        call.filters.push(['neq', col, val]);
        return chain;
      },
      lt: (col, val) => {
        call.filters.push(['lt', col, val]);
        return chain;
      },
      maybeSingle: async () => ({ data: rows[table] ?? null, error: null }),
      then: (resolve) => resolve({ data: call.update ? [{ id: 1 }] : rows[table], error: null }),
    };
    return chain;
  };
  return calls;
}

const originalFrom = supabase.from;
afterEach(() => {
  supabase.from = originalFrom;
});

describe('Periodo pagado', () => {
  it('suma un mes sin desbordar al mes siguiente', () => {
    expect(addInterval(new Date('2026-01-31T10:00:00Z'), 'month').toISOString()).toBe('2026-02-28T10:00:00.000Z');
    expect(addInterval(new Date('2026-10-14T10:00:00Z'), 'month').toISOString()).toBe('2026-11-14T10:00:00.000Z');
    expect(addInterval(new Date('2028-02-29T10:00:00Z'), 'year').toISOString()).toBe('2029-02-28T10:00:00.000Z');
  });

  it('si aún quedan días, el nuevo periodo empieza al final de ellos', () => {
    expect(nextPaidUntil('2026-10-20T12:00:00.000Z', 'month', NOW)).toBe('2026-11-20T12:00:00.000Z');
  });

  it('si ya venció o no había fecha, empieza hoy', () => {
    expect(nextPaidUntil('2026-09-01T00:00:00.000Z', 'month', NOW)).toBe('2026-11-14T12:00:00.000Z');
    expect(nextPaidUntil(null, 'year', NOW)).toBe('2027-10-14T12:00:00.000Z');
  });
});

describe('activatePaidPeriod', () => {
  it('IngenIA: activa Premium por un mes y guarda el pago', async () => {
    const calls = fakeSupabase({ students: { premium_until: null, premium_payment_id: null } });
    const res = await activatePaidPeriod({ userId: USER, planId: 'smartboard_premium', paymentId: 'wompi_1', now: NOW });
    expect(res).toEqual({ paidUntil: '2026-11-14T12:00:00.000Z' });
    const update = calls.find((c) => c.update);
    expect(update.table).toBe('students');
    expect(update.update).toEqual({
      subscription_tier: 'premium',
      premium_until: '2026-11-14T12:00:00.000Z',
      premium_payment_id: 'wompi_1',
    });
  });

  it('el plan anual dura un año', async () => {
    fakeSupabase({ students: { premium_until: null, premium_payment_id: null } });
    const res = await activatePaidPeriod({ userId: USER, planId: 'ingenia_base_anual', paymentId: 'wompi_2', now: NOW });
    expect(res.paidUntil).toBe('2027-10-14T12:00:00.000Z');
  });

  it('el mismo pago reenviado no extiende dos veces', async () => {
    const calls = fakeSupabase({ students: { premium_until: '2026-11-14T12:00:00.000Z', premium_payment_id: 'wompi_1' } });
    const res = await activatePaidPeriod({ userId: USER, planId: 'smartboard_premium', paymentId: 'wompi_1', now: NOW });
    expect(res).toEqual({ duplicate: true });
    expect(calls.some((c) => c.update)).toBe(false);
  });

  it('sin estudiante devuelve error (Wompi reintenta)', async () => {
    fakeSupabase({});
    const res = await activatePaidPeriod({ userId: USER, planId: 'smartboard_premium', paymentId: 'wompi_3', now: NOW });
    expect(res.error).toBeDefined();
  });
});

describe('expirePaidPlans', () => {
  it('apaga solo planes con fecha vencida', async () => {
    const calls = fakeSupabase();
    const res = await expirePaidPlans(NOW);
    expect(res).toEqual({ students: 1, users: 1 });

    const students = calls.find((c) => c.table === 'students');
    expect(students.update).toEqual({ subscription_tier: 'free' });
    expect(students.filters).toContainEqual(['lt', 'premium_until', NOW.toISOString()]);
    expect(students.filters).toContainEqual(['eq', 'subscription_tier', 'premium']);

    const users = calls.find((c) => c.table === 'users');
    expect(users.update).toEqual({ plan: 'free', subscription_status: 'expired' });
    expect(users.filters).toContainEqual(['lt', 'plan_paid_until', NOW.toISOString()]);
  });
});
