import { renderHook, act } from '@testing-library/react';
import { useBrowserNotifications } from '../useBrowserNotifications';

const mockNotifs = { current: [] };
let mockPerm = 'default';

vi.mock('../../context/NotificationContext', () => ({
  useNotification: () => ({ notifications: mockNotifs.current }),
}));

beforeEach(() => {
  mockNotifs.current = [];
  mockPerm = 'default';
  localStorage.clear();

  globalThis.Notification = vi.fn(function MockNotification(title, options) {
    this.title = title;
    this.options = options;
    this.close = vi.fn();
    this.onclick = null;
  });
  Object.defineProperty(globalThis.Notification, 'permission', {
    get: () => mockPerm,
    configurable: true,
  });
  globalThis.Notification.requestPermission = vi.fn().mockResolvedValue('granted');
});

afterEach(() => {
  vi.restoreAllMocks();
  delete globalThis.Notification;
});

describe('useBrowserNotifications', () => {
  test('supported is true when Notification exists', () => {
    const { result } = renderHook(() => useBrowserNotifications());
    expect(result.current.supported).toBe(true);
  });

  test('supported is false when Notification absent', () => {
    delete globalThis.Notification;
    const { result } = renderHook(() => useBrowserNotifications());
    expect(result.current.supported).toBe(false);
  });

  test('returns current permission', () => {
    const { result } = renderHook(() => useBrowserNotifications());
    expect(result.current.permission).toBe('default');
  });

  describe('requestPermission', () => {
    test('requests permission when default', async () => {
      const { result } = renderHook(() => useBrowserNotifications());
      let granted;
      await act(async () => { granted = await result.current.requestPermission(); });
      expect(granted).toBe(true);
      expect(Notification.requestPermission).toHaveBeenCalled();
      expect(localStorage.getItem('ialab_browser_notif_permission')).toBe('granted');
    });

    test('returns true immediately when already granted', async () => {
      mockPerm = 'granted';
      const { result } = renderHook(() => useBrowserNotifications());
      let granted;
      await act(async () => { granted = await result.current.requestPermission(); });
      expect(granted).toBe(true);
      expect(Notification.requestPermission).not.toHaveBeenCalled();
      expect(localStorage.getItem('ialab_browser_notif_permission')).toBe('granted');
    });

    test('returns false when denied', async () => {
      mockPerm = 'denied';
      const { result } = renderHook(() => useBrowserNotifications());
      let granted;
      await act(async () => { granted = await result.current.requestPermission(); });
      expect(granted).toBe(false);
      expect(localStorage.getItem('ialab_browser_notif_permission')).toBe('denied');
    });

    test('returns false when requestPermission throws', async () => {
      Notification.requestPermission = vi.fn().mockRejectedValue(new Error('denied'));
      const { result } = renderHook(() => useBrowserNotifications());
      let granted;
      await act(async () => { granted = await result.current.requestPermission(); });
      expect(granted).toBe(false);
    });
  });

  describe('sendBrowserNotification', () => {
    test('creates Notification when permission granted', () => {
      mockPerm = 'granted';
      const { result } = renderHook(() => useBrowserNotifications());
      act(() => { result.current.sendBrowserNotification('Title', 'Body'); });
      expect(Notification).toHaveBeenCalledWith('Title', expect.objectContaining({ body: 'Body' }));
    });

    test('does nothing when permission not granted', () => {
      mockPerm = 'default';
      const { result } = renderHook(() => useBrowserNotifications());
      act(() => { result.current.sendBrowserNotification('Title', 'Body'); });
      expect(Notification).not.toHaveBeenCalled();
    });

    test('does nothing when Notification absent', () => {
      delete globalThis.Notification;
      mockPerm = 'granted';
      const { result } = renderHook(() => useBrowserNotifications());
      act(() => { result.current.sendBrowserNotification('Title', 'Body'); });
    });

    test('applies custom options', () => {
      mockPerm = 'granted';
      const { result } = renderHook(() => useBrowserNotifications());
      act(() => { result.current.sendBrowserNotification('T', 'B', { icon: '/custom.ico', tag: 'test', requireInteraction: true }); });
      expect(Notification).toHaveBeenCalledWith('T', expect.objectContaining({ icon: '/custom.ico', tag: expect.stringContaining('test'), requireInteraction: true }));
    });

    test('sets onclick to focus window and call callback', () => {
      mockPerm = 'granted';
      const onClick = vi.fn();
      const focusSpy = vi.spyOn(window, 'focus');
      const { result } = renderHook(() => useBrowserNotifications());
      act(() => { result.current.sendBrowserNotification('T', 'B', { onClick }); });
      const notif = Notification.mock.results[0].value;
      act(() => { notif.onclick(); });
      expect(focusSpy).toHaveBeenCalled();
      expect(onClick).toHaveBeenCalled();
      focusSpy.mockRestore();
    });
  });

  describe('auto-send on new notification', () => {
    test('requests permission on important notification', async () => {
      mockNotifs.current = [{ id: 1, type: 'module_complete', is_read: false, title: 'Done', message: 'Great' }];
      renderHook(() => useBrowserNotifications());
      await act(async () => {});
      expect(localStorage.getItem('ialab_push_permission_requested')).toBe('true');
    });

    test('sends browser notification for new unread', () => {
      mockPerm = 'granted';
      mockNotifs.current = [{ id: 1, type: 'lesson_reminder', is_read: false, title: 'Alert', message: 'Study' }];
      renderHook(() => useBrowserNotifications());
      expect(Notification).toHaveBeenCalledWith('Alert', expect.any(Object));
    });

    test('does not duplicate same notification id', () => {
      mockPerm = 'granted';
      const { rerender } = renderHook(() => useBrowserNotifications());
      mockNotifs.current = [{ id: 1, type: 'general', is_read: false, title: 'T', message: 'M' }];
      rerender();
      rerender();
      expect(Notification).toHaveBeenCalledTimes(1);
    });
  });
});
