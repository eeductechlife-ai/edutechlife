import { renderHook, act } from '@testing-library/react';
import { useForumPosts } from '../useForumPosts';

let mockAuthUser;
let mockSupabaseClient;

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}));

function buildMockSupabase() {
  return {
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { full_name: 'User', avatar_url: null }, error: null })),
          order: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          })),
        })),
        or: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          })),
        })),
        order: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        })),
        range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: 1, title: 'Test Post', content: 'Content',
              category: 'discussion', tags: [], user_id: 'user-1',
              user_name: 'User', upvotes: 0, comment_count: 0,
              profiles: { full_name: 'User', avatar_url: null, title: null, badges: null },
            },
            error: null,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: { title: 'Updated' }, error: null })),
            })),
          })),
        })),
      })),
    })),
  };
}

beforeEach(() => {
  mockAuthUser = { id: 'user-1', fullName: 'Test User' };
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

describe('useForumPosts', () => {
  test('returns initial state before effects fire', () => {
    const { result } = renderHook(() => useForumPosts());

    expect(result.current.posts).toEqual([]);
    expect(result.current.category).toBe('all');
    expect(result.current.sortBy).toBe('latest');
    expect(result.current.totalCount).toBe(0);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test('has expected functions', () => {
    const { result } = renderHook(() => useForumPosts());

    expect(result.current.createPost).toBeInstanceOf(Function);
    expect(result.current.deletePost).toBeInstanceOf(Function);
    expect(result.current.updatePost).toBeInstanceOf(Function);
    expect(result.current.refreshPosts).toBeInstanceOf(Function);
    expect(result.current.loadMore).toBeInstanceOf(Function);
    expect(result.current.setCategory).toBeInstanceOf(Function);
    expect(result.current.setSearchQuery).toBeInstanceOf(Function);
    expect(result.current.setSortBy).toBeInstanceOf(Function);
  });

  test('loads posts on mount when user is authenticated', async () => {
    const { result } = renderHook(() => useForumPosts());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('forum_posts');
  });

  describe('createPost', () => {
    test('creates a post successfully', async () => {
      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.createPost({ title: 'Test', content: 'Content', category: 'discussion' });
      });

      expect(res.success).toBe(true);
      expect(res.post.title).toBe('Test Post');
    });

    test('returns error for missing title/content', async () => {
      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.createPost({ title: '', content: '' });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Título y contenido requeridos');
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.createPost({ title: 'Test', content: 'Content' });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('No autenticado');
    });
  });

  describe('deletePost', () => {
    test('deletes a post successfully', async () => {
      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.deletePost(1);
      });

      expect(res.success).toBe(true);
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.deletePost(1);
      });

      expect(res.success).toBe(false);
    });
  });

  describe('updatePost', () => {
    test('updates a post successfully', async () => {
      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.updatePost(1, { title: 'Updated' });
      });

      expect(res.success).toBe(true);
      expect(res.post.title).toBe('Updated');
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumPosts());

      let res;
      await act(async () => {
        res = await result.current.updatePost(1, { title: 'Updated' });
      });

      expect(res.success).toBe(false);
    });
  });

  describe('loadMore', () => {
    test('calls loadPosts with next page when hasMore', async () => {
      const { result } = renderHook(() => useForumPosts());

      await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

      act(() => { result.current.loadMore(); });
    });
  });
});

describe('POST_CATEGORIES', () => {
  it('has expected categories', async () => {
    const { POST_CATEGORIES } = await import('../useForumPosts');
    expect(POST_CATEGORIES).toHaveLength(6);
    expect(POST_CATEGORIES[0].id).toBe('all');
  });
});
