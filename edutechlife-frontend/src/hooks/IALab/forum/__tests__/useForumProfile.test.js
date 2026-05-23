import { renderHook, act } from '@testing-library/react';
import { useForumProfile } from '../useForumProfile';

let mockAuthUser;
let mockSupabaseClient;

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}));

function buildMockSupabase(data = null, error = null) {
  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data, error })),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { user_id: 'user-1', full_name: 'User', reputation: 10 },
            error: null,
          })),
        })),
      })),
    })),
  };
}

beforeEach(() => {
  mockAuthUser = { id: 'user-1', fullName: 'Test User', imageUrl: null };
  mockSupabaseClient = buildMockSupabase();
});

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('../../../../lib/supabase', () => ({
  supabase: new Proxy({}, {
    get: (_, prop) => (...args) => mockSupabaseClient[prop](...args),
  }),
}));

describe('useForumProfile', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useForumProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.hoverProfile).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  test('has expected functions', () => {
    const { result } = renderHook(() => useForumProfile());

    expect(result.current.loadProfile).toBeInstanceOf(Function);
    expect(result.current.loadMyProfile).toBeInstanceOf(Function);
    expect(result.current.updateProfile).toBeInstanceOf(Function);
    expect(result.current.showHoverProfile).toBeInstanceOf(Function);
    expect(result.current.hideHoverProfile).toBeInstanceOf(Function);
    expect(result.current.getLevel).toBeInstanceOf(Function);
    expect(result.current.getReputationBreakdown).toBeInstanceOf(Function);
  });

  describe('loadProfile', () => {
    test('loads profile for a user', async () => {
      mockSupabaseClient = buildMockSupabase({ user_id: 'user-2', full_name: 'Other User' });

      const { result } = renderHook(() => useForumProfile());

      let profile;
      await act(async () => {
        profile = await result.current.loadProfile('user-2');
      });

      expect(profile).not.toBeNull();
      expect(profile.user_id).toBe('user-2');
    });

    test('returns null when userId is falsy', async () => {
      const { result } = renderHook(() => useForumProfile());

      let profile;
      await act(async () => {
        profile = await result.current.loadProfile(null);
      });

      expect(profile).toBeNull();
    });

    test('handles PGRST116 error gracefully', async () => {
      mockSupabaseClient = buildMockSupabase(null, { code: 'PGRST116' });

      const { result } = renderHook(() => useForumProfile());

      let profile;
      await act(async () => {
        profile = await result.current.loadProfile('user-2');
      });

      expect(profile).toBeNull();
    });
  });

  describe('loadMyProfile', () => {
    test('loads current user profile', async () => {
      mockSupabaseClient = buildMockSupabase({ user_id: 'user-1', full_name: 'Test User' });

      const { result } = renderHook(() => useForumProfile());

      let profile;
      await act(async () => {
        profile = await result.current.loadMyProfile();
      });

      expect(profile).not.toBeNull();
      expect(result.current.profile).not.toBeNull();
    });

    test('returns null when user is null', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumProfile());

      let profile;
      await act(async () => {
        profile = await result.current.loadMyProfile();
      });

      expect(profile).toBeNull();
    });
  });

  describe('updateProfile', () => {
    test('updates profile successfully', async () => {
      const { result } = renderHook(() => useForumProfile());

      let res;
      await act(async () => {
        res = await result.current.updateProfile({ reputation: 10 });
      });

      expect(res.success).toBe(true);
      expect(res.profile.reputation).toBe(10);
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumProfile());

      let res;
      await act(async () => {
        res = await result.current.updateProfile({ reputation: 10 });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('No autenticado');
    });
  });

  describe('showHoverProfile / hideHoverProfile', () => {
    test('shows and hides hover profile', async () => {
      mockSupabaseClient = buildMockSupabase({ user_id: 'user-2', full_name: 'Other' });

      const { result } = renderHook(() => useForumProfile());

      await act(async () => {
        await result.current.showHoverProfile('user-2');
      });

      expect(result.current.hoverProfile).not.toBeNull();

      act(() => {
        result.current.hideHoverProfile();
      });

      expect(result.current.hoverProfile).toBeNull();
    });
  });

  describe('getLevel', () => {
    test('returns correct level based on reputation', () => {
      const { result } = renderHook(() => useForumProfile());

      expect(result.current.getLevel(null).title).toBe('Novato');
      expect(result.current.getLevel(5).title).toBe('Novato');
      expect(result.current.getLevel(25).title).toBe('Aprendiz');
      expect(result.current.getLevel(75).title).toBe('Contribuidor');
      expect(result.current.getLevel(150).title).toBe('Experto');
      expect(result.current.getLevel(300).title).toBe('Líder');
      expect(result.current.getLevel(600).title).toBe('Maestro');
    });
  });

  describe('getReputationBreakdown', () => {
    test('returns breakdown for profile', () => {
      const { result } = renderHook(() => useForumProfile());

      const profile = { post_count: 5, comment_count: 10, likes_received: 20, answers_received: 3 };
      const breakdown = result.current.getReputationBreakdown(profile);

      expect(breakdown).toHaveLength(4);
      expect(breakdown[0].label).toBe('Posts');
      expect(breakdown[0].value).toBe(5);
    });

    test('returns empty array for null profile', () => {
      const { result } = renderHook(() => useForumProfile());

      expect(result.current.getReputationBreakdown(null)).toEqual([]);
    });
  });
});
