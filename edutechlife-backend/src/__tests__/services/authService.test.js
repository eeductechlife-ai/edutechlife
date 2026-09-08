const supabasePath = require.resolve('../../db/supabase');

const mockSupabase = {
  from: vi.fn(),
  auth: {
    admin: {
      createUser: vi.fn(),
    },
  },
};

delete require.cache[supabasePath];
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: mockSupabase,
};

const authService = require('../../services/authService');

// ── Regression: self-heal on signIn must include clerk_id ────────────────────
// La columna users.clerk_id es NOT NULL. El insert de auto-curado que omite
// clerk_id falla con 23502, dejando al usuario huérfano (sin perfil) y al
// dashboard sin poder operar la cuenta.
const sessionClientPath = require.resolve('../../db/sessionClient');
const mockSessionClient = {
  auth: { signInWithPassword: vi.fn() },
};

describe('authService.signIn self-heal (profile missing)', () => {
  let freshAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    delete require.cache[sessionClientPath];
    require.cache[sessionClientPath] = {
      id: sessionClientPath,
      filename: sessionClientPath,
      loaded: true,
      exports: { createSessionClient: () => mockSessionClient },
    };
    const svcPath = require.resolve('../../services/authService');
    delete require.cache[svcPath];
    freshAuthService = require('../../services/authService');
  });

  it('creates the missing profile with clerk_id so the insert does not violate NOT NULL', async () => {
    mockSessionClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: { access_token: 'tok-123', refresh_token: 'rt-123' },
        user: { id: 'orphan-1', email: 'orphan@x.com' },
      },
      error: null,
    });

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn()
        // 1) profile fetch: no rows → triggers self-heal
        .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'No rows' } })
        // 2) healing insert: success
        .mockResolvedValueOnce({ data: { id: 'orphan-1', username: 'orphan', user_type: 'student' }, error: null }),
    };
    mockSupabase.from.mockImplementation(() => chain);

    const result = await freshAuthService.signIn({
      email: 'orphan@x.com',
      password: 'secret12345',
    });

    expect(result.token).toBe('tok-123');
    expect(chain.insert).toHaveBeenCalledTimes(1);
    const payload = chain.insert.mock.calls[0][0][0];
    expect(payload.id).toBe('orphan-1');
    expect(payload.clerk_id).toBe('orphan-1');
    expect(payload.email).toBe('orphan@x.com');
  });

  it('does not call the healing insert when the profile already exists', async () => {
    mockSessionClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: { access_token: 'tok-456', refresh_token: 'rt-456' },
        user: { id: 'user-1', email: 'ok@x.com' },
      },
      error: null,
    });

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'user-1', username: 'okuser', user_type: 'student', email: 'ok@x.com' },
        error: null,
      }),
    };
    mockSupabase.from.mockImplementation(() => chain);

    const result = await freshAuthService.signIn({
      email: 'ok@x.com',
      password: 'secret12345',
    });

    expect(result.token).toBe('tok-456');
    expect(chain.insert).not.toHaveBeenCalled();
  });
});

describe('authService.signUpParent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects registration when no invitation token is provided', async () => {
    await expect(
      authService.signUpParent({
        studentEmail: 'kid@school.co',
        parentPassword: 'secret12345',
        parentName: 'Ana',
      }),
    ).rejects.toThrow('invitación');
  });

  it('rejects registration when the consent is not verified', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn()
        .mockResolvedValueOnce({ data: { id: 'stu-1' }, error: null }) // users lookup
        .mockResolvedValueOnce({ data: { verification_status: 'pending' }, error: null }), // consent
    });

    await expect(
      authService.signUpParent({
        studentEmail: 'kid@school.co',
        parentPassword: 'secret12345',
        parentName: 'Ana',
        invitationToken: 'tok-pending',
      }),
    ).rejects.toThrow('verificado');
  });

  it('creates the parent account and link only when a verified consent matches the token', async () => {
    const chain = (resolve) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue(resolve),
    });
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'parent_student_links') {
        return { upsert: vi.fn().mockResolvedValue({ data: null, error: null }) };
      }
      if (table === 'parent_consents') {
        return chain({ data: { verification_status: 'verified' }, error: null });
      }
      // users: lookup + profile insert share the same chained client
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'stu-1' }, error: null }),
      };
    });
    mockSupabase.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: 'par-1' } },
      error: null,
    });

    const result = await authService.signUpParent({
      studentEmail: 'kid@school.co',
      parentPassword: 'secret12345',
      parentName: 'Ana',
      invitationToken: 'tok-verified',
    });

    expect(result.message).toContain('creada');
    // users insert + parent_student_links upsert
    const linkCalls = mockSupabase.from.mock.calls.filter(
      ([table]) => table === 'parent_student_links',
    );
    expect(linkCalls.length).toBeGreaterThan(0);
  });

  it('rejects registration when the student email has no account', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    await expect(
      authService.signUpParent({
        studentEmail: 'ghost@school.co',
        parentPassword: 'secret12345',
        parentName: 'Ana',
        invitationToken: 'tok-1',
      }),
    ).rejects.toThrow('No existe');
  });
});
