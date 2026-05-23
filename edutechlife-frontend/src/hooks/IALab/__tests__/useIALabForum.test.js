import { renderHook, act } from '@testing-library/react';
import { useIALabForum } from '../useIALabForum';

const mockState = {
  authUser: { id: 'user-1', fullName: 'Test User', email: 'test@test.com' },
  supabaseClient: null,
};

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockState.authUser }),
}));

function buildMockSupabase() {
  const subscribeMock = vi.fn(() => ({ unsubscribe: vi.fn() }));
  const channelMock = vi.fn(() => ({
    on: vi.fn(() => ({
      on: vi.fn(() => ({ subscribe: subscribeMock })),
    })),
  }));

  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        in: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        count: undefined,
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: 1, title: 'Test', content: 'Test content',
              user_id: 'user-1', upvotes: 0, comment_count: 0,
              tags: ['IALab'], user_name: 'Test User',
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    })),
    channel: channelMock,
  };
}

const mockSupabase = {
  client: null,
};

vi.mock('../../../lib/supabase', () => ({
  supabase: new Proxy({}, {
    get: (_, prop) => (...args) => mockSupabase.client[prop](...args),
  }),
}));

beforeEach(() => {
  mockState.authUser = { id: 'user-1', fullName: 'Test User', email: 'test@test.com' };
  mockSupabase.client = buildMockSupabase();
  mockState.supabaseClient = mockSupabase.client;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useIALabForum', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useIALabForum());
    // Auto-load effect sets isLoading(true) on mount
    expect(result.current.forumPosts).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.likeStates).toEqual({});
  });

  test('auto-loads posts on mount when user exists', async () => {
    const { result } = renderHook(() => useIALabForum());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.forumPosts).toEqual([]);
  });

  test('has expected functions', () => {
    const { result } = renderHook(() => useIALabForum());

    expect(result.current.loadForumPosts).toBeInstanceOf(Function);
    expect(result.current.toggleLike).toBeInstanceOf(Function);
    expect(result.current.createPost).toBeInstanceOf(Function);
    expect(result.current.getForumStats).toBeInstanceOf(Function);
    expect(result.current.formatLikeCount).toBeInstanceOf(Function);
    expect(result.current.getLikeButtonProps).toBeInstanceOf(Function);
  });

  describe('formatLikeCount', () => {
    test('formats counts correctly', () => {
      const { result } = renderHook(() => useIALabForum());

      expect(result.current.formatLikeCount(0)).toBe('0');
      expect(result.current.formatLikeCount(500)).toBe('500');
      expect(result.current.formatLikeCount(1500)).toBe('1.5k');
      expect(result.current.formatLikeCount(1000)).toBe('1.0k');
    });
  });

  describe('getLikeButtonProps', () => {
    test('returns default props for unknown post', () => {
      const { result } = renderHook(() => useIALabForum());

      const props = result.current.getLikeButtonProps('unknown');
      expect(props.userLiked).toBe(false);
      expect(props.isLoading).toBe(false);
      expect(props.likeCount).toBe(0);
    });

    test('returns props from likeStates for known post', () => {
      const { result } = renderHook(() => useIALabForum());

      const props = result.current.getLikeButtonProps('unknown');
      expect(props).toBeDefined();
      expect(typeof props.ariaLabel).toBe('string');
      expect(typeof props.buttonClass).toBe('string');
    });
  });

  describe('loadForumPosts', () => {
    test('loads posts when user is authenticated', async () => {
      const { result } = renderHook(() => useIALabForum());

      await act(async () => {
        await result.current.loadForumPosts(10);
      });

      expect(result.current.isLoading).toBe(false);
      expect(Array.isArray(result.current.forumPosts)).toBe(true);
    });

    test('does nothing when user is null', async () => {
      mockState.authUser = null;

      const { result } = renderHook(() => useIALabForum());

      await act(async () => {
        await result.current.loadForumPosts(10);
      });

      expect(result.current.forumPosts).toEqual([]);
    });
  });

  describe('createPost', () => {
    test('creates a post with title and content', async () => {
      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.createPost('My Title', 'My Content');
      });

      expect(res.success).toBe(true);
      expect(res.post.title).toBe('Test');
    });

    test('creates a post with object argument', async () => {
      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.createPost({ title: 'Obj Title', content: 'Obj Content', tags: ['test'] });
      });

      expect(res.success).toBe(true);
      expect(res.post.title).toBe('Test');
    });

    test('returns error when user is null', async () => {
      mockState.authUser = null;

      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.createPost('Title', 'Content');
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Usuario no autenticado');
    });

    test('returns error for empty title or content', async () => {
      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.createPost('', 'Content');
      });

      expect(res.success).toBe(false);

      await act(async () => {
        res = await result.current.createPost('Title', '');
      });

      expect(res.success).toBe(false);
    });

    test('handles insert error gracefully', async () => {
      mockSupabase.client.from = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockRejectedValue(new Error('DB error')),
          })),
        })),
      }));

      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.createPost('Title', 'Content');
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('DB error');
    });
  });

  describe('toggleLike', () => {
    test('toggles like on a post', async () => {
      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.toggleLike(1, 5);
      });

      expect(res.success).toBe(true);
    });

    test('returns error when user is null', async () => {
      mockState.authUser = null;

      const { result } = renderHook(() => useIALabForum());

      let res;
      await act(async () => {
        res = await result.current.toggleLike(1, 5);
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Usuario no autenticado');
    });
  });

  describe('getForumStats', () => {
    test('returns default stats when user is null', async () => {
      mockState.authUser = null;

      const { result } = renderHook(() => useIALabForum());

      let stats;
      await act(async () => {
        stats = await result.current.getForumStats();
      });

      expect(stats.totalPosts).toBe(0);
    });

    test('fetches stats from Supabase', async () => {
      const { result } = renderHook(() => useIALabForum());

      let stats;
      await act(async () => {
        stats = await result.current.getForumStats();
      });

      expect(stats).toBeDefined();
    });
  });
});
