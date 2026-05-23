import { renderHook, act } from '@testing-library/react';
import { useForumComments } from '../useForumComments';

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
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: 1, post_id: 1, parent_id: null, user_id: 'user-1',
              content: 'Test comment',
              profiles: { full_name: 'User', avatar_url: null, title: null, badges: null },
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    })),
    rpc: vi.fn(() => Promise.resolve({ error: null })),
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

describe('useForumComments', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useForumComments());

    expect(result.current.comments).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  test('has expected functions', () => {
    const { result } = renderHook(() => useForumComments());

    expect(result.current.loadComments).toBeInstanceOf(Function);
    expect(result.current.addComment).toBeInstanceOf(Function);
    expect(result.current.deleteComment).toBeInstanceOf(Function);
  });

  describe('loadComments', () => {
    test('loads comments for a post', async () => {
      const { result } = renderHook(() => useForumComments());

      let comments;
      await act(async () => {
        comments = await result.current.loadComments(1);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('forum_comments');
      expect(Array.isArray(comments)).toBe(true);
    });

    test('returns empty array for missing postId', async () => {
      const { result } = renderHook(() => useForumComments());

      let comments;
      await act(async () => {
        comments = await result.current.loadComments(null);
      });

      expect(comments).toEqual([]);
    });
  });

  describe('addComment', () => {
    test('adds a comment successfully', async () => {
      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.addComment({ postId: 1, content: 'Great post!' });
      });

      expect(res.success).toBe(true);
      expect(res.comment.content).toBe('Test comment');
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.addComment({ postId: 1, content: 'Comment' });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('No autenticado');
    });

    test('returns error for empty content', async () => {
      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.addComment({ postId: 1, content: '' });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Contenido requerido');
    });

    test('handles insert error gracefully', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockRejectedValue(new Error('DB error')),
          })),
        })),
      }));

      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.addComment({ postId: 1, content: 'Comment' });
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('DB error');
    });
  });

  describe('deleteComment', () => {
    test('soft-deletes a comment', async () => {
      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.deleteComment(1, 1);
      });

      expect(res.success).toBe(true);
    });

    test('returns error when not authenticated', async () => {
      mockAuthUser = null;

      const { result } = renderHook(() => useForumComments());

      let res;
      await act(async () => {
        res = await result.current.deleteComment(1, 1);
      });

      expect(res.success).toBe(false);
    });
  });
});
