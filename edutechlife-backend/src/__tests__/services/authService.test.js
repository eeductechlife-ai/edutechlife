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

describe('authService.signUpParent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects registration when no invitation token is provided', async () => {
    await expect(
      authService.signUpParent({
        studentEmail: 'kid@school.co',
        parentPassword: 'secret123',
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
        parentPassword: 'secret123',
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
      parentPassword: 'secret123',
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
        parentPassword: 'secret123',
        parentName: 'Ana',
        invitationToken: 'tok-1',
      }),
    ).rejects.toThrow('No existe');
  });
});
