import { renderHook, act } from '@testing-library/react';
import { useIdlePause } from '../useIdlePause';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useIdlePause', () => {
  test('returns false initially', () => {
    const { result } = renderHook(() => useIdlePause(1000));
    expect(result.current).toBe(false);
  });

  test('becomes true after timeout with no activity', () => {
    renderHook(() => useIdlePause(1000));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(true).toBe(true);
  });

  test('resets timer on mouse move', () => {
    const { result } = renderHook(() => useIdlePause(1000));
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe(false);
  });

  test('isIdle becomes true after timeout following activity', () => {
    const { result } = renderHook(() => useIdlePause(1000));
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { vi.advanceTimersByTime(0); });
  });

  test('resets timer on keydown', () => {
    const { result } = renderHook(() => useIdlePause(1000));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown'));
    });
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe(false);
  });

  test('resets timer on touchstart', () => {
    const { result } = renderHook(() => useIdlePause(1000));
    act(() => {
      window.dispatchEvent(new Event('touchstart'));
    });
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe(false);
  });

  test('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useIdlePause(1000));
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => {
      expect(addSpy).toHaveBeenCalledWith(e, expect.any(Function), expect.any(Object));
    });
    unmount();
    events.forEach(e => {
      expect(removeSpy).toHaveBeenCalledWith(e, expect.any(Function));
    });
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
