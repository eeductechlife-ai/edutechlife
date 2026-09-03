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

function studentChain(result) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
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

describe('requireVerifiedParentalConsent', () => {
  it('blocks a minor with no consent (age from profile)', async () => {
    mockSupabase.from
      .mockReturnValueOnce(consentChain({ data: null, error: null }))
      .mockReturnValueOnce(studentChain({ data: { age: 12 }, error: null }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'PARENTAL_CONSENT_REQUIRED' }),
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks a minor with a pending consent', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'pending', student_age: 12 },
      error: null,
    }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows a minor with a verified consent', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'verified', student_age: 12 },
      error: null,
    }));

    const { next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
  });

  it('allows an adult even without consent', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'pending', student_age: 19 },
      error: null,
    }));

    const { next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
  });

  it('does not query the profile when the consent age resolves the case', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({ data: null, error: null }))
      .mockReturnValueOnce(studentChain({ data: { age: 19 }, error: null }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('trusts the consent age over a self-edited profile age', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({
      data: { verification_status: 'pending', student_age: 15 },
      error: null,
    }));

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows when age cannot be determined', async () => {
    mockSupabase.from.mockReturnValueOnce(consentChain({ data: null, error: null }))
      .mockReturnValueOnce(studentChain({ data: { age: null }, error: null }));

    const { next, promise } = runMiddleware();
    await promise;

    expect(next).toHaveBeenCalled();
  });

  it('fails closed when the consent table is missing (PGRST205)', async () => {
    mockSupabase.from.mockReturnValueOnce(
      consentChain({ data: null, error: { code: 'PGRST205', message: 'table not found' } }),
    );

    const { res, next, promise } = runMiddleware();
    await promise;

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(503);
  });
});