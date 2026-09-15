// Vitest globals (describe/it/expect/vi/beforeEach) — vitest.config usa globals: true

const supabasePath = require.resolve('../../db/supabase');
const mockSupabase = { from: vi.fn() };
delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: mockSupabase,
};

const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');

function consentChain(result) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
}

function runMiddleware() {
  const req = { userId: 'kid-1' };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next, promise: requireVerifiedParentalConsent(req, res, next) };
}

beforeEach(() => { vi.clearAllMocks(); });

describe('requireVerifiedParentalConsent (no bloqueante desde 2026-09)', () => {
  it('permite el acceso de un menor sin ningún consentimiento registrado', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({ data: null, error: null }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('permite el acceso de un menor con consentimiento pendiente', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'pending', student_age: 12 },
      error: null,
    }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('permite el acceso de un menor con consentimiento verificado', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'verified', student_age: 12 },
      error: null,
    }));

    const { next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
  });

  it('permite el acceso de un adulto sin consentimiento', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'pending', student_age: 19 },
      error: null,
    }));

    const { next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
  });

  it('permite el acceso cuando la tabla de consentimientos no existe (PGRST205)', async () => {
    mockSupabase.from.mockReturnValueOnce(
      consentChain({ data: null, error: { code: 'PGRST205', message: 'table not found' } }),
    );

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('permite el acceso incluso si la consulta de consentimiento falla', async () => {
    mockSupabase.from.mockReturnValueOnce(
      consentChain({ data: null, error: { code: 'ECONNRESET', message: 'network error' } }),
    );

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
