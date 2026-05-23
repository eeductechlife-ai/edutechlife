import { renderHook, act } from '@testing-library/react';
import { useForumNotifications } from '../useForumNotifications';

let mockAuthUser;
let mockSupabaseClient;
let localStorageStore = {};

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}));

function buildMockSupabase(data = null, error = null) {
  const subscribeMock = vi.fn((cb) => {
    if (cb) cb('SUBSCRIBED');
    return { unsubscribe: vi.fn() };
  });

  return {
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data, error })),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: subscribeMock,
      })),
    })),
  };
}

beforeEach(() => {
  mockAuthUser = { id: 'user-1' };
  mockSupabaseClient = buildMockSupabase([]);
  localStorageStore = {};
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => localStorageStore[key] || null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => { localStorageStore[key] = val; });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

vi.mock('../../../../lib/supabase', () => ({
  supabase: new Proxy({}, {
    get: (_, prop) => (...args) => mockSupabaseClient[prop](...args),
  }),
}));

describe('useForumNotifications', () => {
  test('returns initial state before effects fire', () => {
    const { result } = renderHook(() => useForumNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  test('has expected functions', () => {
    const { result } = renderHook(() => useForumNotifications());

    expect(result.current.loadNotifications).toBeInstanceOf(Function);
    expect(result.current.markAsRead).toBeInstanceOf(Function);
    expect(result.current.markAllAsRead).toBeInstanceOf(Function);
  });

  test('loads notifications on mount', async () => {
    renderHook(() => useForumNotifications());

    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('forum_notifications');
  });

  describe('markAsRead', () => {
    test('updates local notification read status', async () => {
      localStorageStore['ialab_forum_notifications'] = JSON.stringify([
        { id: 1, is_read: false, content: 'test' },
      ]);

      mockSupabaseClient = buildMockSupabase([
        { id: 1, is_read: false, content: 'test' },
      ]);

      const { result } = renderHook(() => useForumNotifications());

      await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

      await act(async () => {
        await result.current.markAsRead(1);
      });

      const stored = JSON.parse(localStorageStore['ialab_forum_notifications'] || '[]');
      expect(stored[0].is_read).toBe(true);
    });

    test('handles table missing error gracefully', async () => {
      mockSupabaseClient = buildMockSupabase(
        null,
        { code: '42P01', message: 'relation does not exist' }
      );

      const { result } = renderHook(() => useForumNotifications());

      await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    test('marks all notifications as read', async () => {
      localStorageStore['ialab_forum_notifications'] = JSON.stringify([
        { id: 1, is_read: false },
        { id: 2, is_read: false },
      ]);

      mockSupabaseClient = buildMockSupabase([
        { id: 1, is_read: false },
        { id: 2, is_read: false },
      ]);

      const { result } = renderHook(() => useForumNotifications());

      await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

      await act(async () => {
        await result.current.markAllAsRead();
      });

      expect(result.current.unreadCount).toBe(0);
    });
  });
});
