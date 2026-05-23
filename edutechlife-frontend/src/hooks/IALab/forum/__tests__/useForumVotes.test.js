import { renderHook, act } from '@testing-library/react';
import { useForumVotes } from '../useForumVotes';

let mockAuthUser;
let mockSupabaseClient;

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}));

function buildMockSupabase() {
  return {
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  };
}

beforeEach(() => {
  mockAuthUser = { id: 'user-1' };
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

describe('useForumVotes', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useForumVotes());

    expect(result.current.voteStates).toEqual({});
    expect(result.current.formatCount).toBeInstanceOf(Function);
    expect(result.current.loadVotes).toBeInstanceOf(Function);
    expect(result.current.toggleVote).toBeInstanceOf(Function);
  });

  describe('formatCount', () => {
    test('formats vote counts', () => {
      const { result } = renderHook(() => useForumVotes());

      expect(result.current.formatCount(0)).toBe('0');
      expect(result.current.formatCount(999)).toBe('999');
      expect(result.current.formatCount(1000)).toBe('1.0k');
      expect(result.current.formatCount(1500)).toBe('1.5k');
      expect(result.current.formatCount(null)).toBe('0');
      expect(result.current.formatCount(undefined)).toBe('0');
    });
  });

  describe('loadVotes', () => {
    test('loads votes for post IDs', async () => {
      const { result } = renderHook(() => useForumVotes());

      await act(async () => {
        await result.current.loadVotes([1, 2, 3]);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('forum_votes');
    });

    test('does nothing for empty post IDs', async () => {
      const { result } = renderHook(() => useForumVotes());

      await act(async () => {
        await result.current.loadVotes([]);
      });

      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    test('does nothing when user is null', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumVotes());

      await act(async () => {
        await result.current.loadVotes([1]);
      });

      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });
  });

  describe('toggleVote', () => {
    test('adds a vote', async () => {
      const { result } = renderHook(() => useForumVotes());

      let res;
      await act(async () => {
        res = await result.current.toggleVote(1, 5);
      });

      expect(res.success).toBe(true);
      expect(res.newCount).toBe(6);
      expect(res.userVoted).toBe(true);
    });

    test('removes a vote when already voted', async () => {
      const { result } = renderHook(() => useForumVotes());

      await act(async () => {
        await result.current.toggleVote(1, 10);
      });

      let res;
      await act(async () => {
        res = await result.current.toggleVote(1, 11);
      });

      expect(res.success).toBe(true);
      expect(res.newCount).toBe(10);
      expect(res.userVoted).toBe(false);
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumVotes());

      let res;
      await act(async () => {
        res = await result.current.toggleVote(1, 5);
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('No autenticado');
    });

    test('handles DB error gracefully', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        insert: vi.fn(() => Promise.reject(new Error('DB error'))),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
        select: vi.fn(() => ({
          in: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      }));

      const { result } = renderHook(() => useForumVotes());

      let res;
      await act(async () => {
        res = await result.current.toggleVote(1, 5);
      });

      expect(res.success).toBe(false);
    });
  });
});
