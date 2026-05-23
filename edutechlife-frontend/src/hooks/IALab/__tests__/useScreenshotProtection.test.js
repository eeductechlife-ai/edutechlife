import { renderHook, act } from '@testing-library/react';
import useScreenshotProtection from '../useScreenshotProtection';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('useScreenshotProtection', () => {
  test('returns default state when not active', () => {
    const { result } = renderHook(() => useScreenshotProtection(false));

    expect(result.current.showOverlay).toBe(false);
    expect(result.current.violationCount).toBe(0);
  });

  test('returns default state when active', () => {
    const { result } = renderHook(() => useScreenshotProtection(true));

    expect(result.current.showOverlay).toBe(false);
    expect(result.current.violationCount).toBe(0);
  });

  test('setShowOverlay works', () => {
    const { result } = renderHook(() => useScreenshotProtection(true));

    act(() => result.current.setShowOverlay(true));
    expect(result.current.showOverlay).toBe(true);

    act(() => result.current.setShowOverlay(false));
    expect(result.current.showOverlay).toBe(false);
  });

  describe('when active', () => {
    test('blocks PrintScreen key', () => {
      const onViolation = vi.fn();
      renderHook(() => useScreenshotProtection(true, { onViolation }));

      const event = new KeyboardEvent('keydown', {
        key: 'PrintScreen',
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
      expect(onViolation).toHaveBeenCalledWith('printscreen', 1);
    });

    test('blocks Cmd+Shift+3/4/5 shortcuts', () => {
      const onViolation = vi.fn();
      renderHook(() => useScreenshotProtection(true, { onViolation }));

      act(() => {
        ['3', '4', '5'].forEach((key) => {
          const event = new KeyboardEvent('keydown', {
            key,
            metaKey: true,
            shiftKey: true,
            cancelable: true,
          });
          const preventSpy = vi.spyOn(event, 'preventDefault');
          document.dispatchEvent(event);
          expect(preventSpy).toHaveBeenCalled();
        });
      });

      expect(onViolation).toHaveBeenCalledTimes(3);
    });

    test('blocks Ctrl+Shift+S shortcut', () => {
      const onViolation = vi.fn();
      renderHook(() => useScreenshotProtection(true, { onViolation }));

      const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
      expect(onViolation).toHaveBeenCalledWith('screenshot_shortcut', 1);
    });

    test('blocks F12 (DevTools)', () => {
      renderHook(() => useScreenshotProtection(true));

      const event = new KeyboardEvent('keydown', { key: 'F12', cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });

    test('blocks Ctrl+Shift+I (DevTools)', () => {
      renderHook(() => useScreenshotProtection(true));

      const event = new KeyboardEvent('keydown', { key: 'I', ctrlKey: true, shiftKey: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });

    test('shows overlay on window blur', () => {
      const { result } = renderHook(() => useScreenshotProtection(true));

      act(() => { window.dispatchEvent(new Event('blur')); });
      expect(result.current.showOverlay).toBe(true);

      act(() => { window.dispatchEvent(new Event('focus')); });
      expect(result.current.showOverlay).toBe(false);
    });

    test('blur triggers violation via onViolation callback', () => {
      const onViolation = vi.fn();
      renderHook(() => useScreenshotProtection(true, { onViolation }));

      const event = new KeyboardEvent('keydown', { key: 'PrintScreen', cancelable: true });
      document.dispatchEvent(event);

      expect(onViolation).toHaveBeenCalledWith('printscreen', 1);
    });

    test('calls onMaxViolations when max reached', () => {
      const onMaxViolations = vi.fn();
      renderHook(() => useScreenshotProtection(true, { onMaxViolations, maxViolations: 2 }));

      const event = new KeyboardEvent('keydown', { key: 'PrintScreen', cancelable: true });
      act(() => {
        document.dispatchEvent(event);
        document.dispatchEvent(event);
      });

      expect(onMaxViolations).toHaveBeenCalledTimes(1);
    });

    test('does not fire violation when not active', () => {
      const onViolation = vi.fn();
      const { rerender } = renderHook(
        (props) => useScreenshotProtection(props.active, { onViolation }),
        { initialProps: { active: false } }
      );

      const event = new KeyboardEvent('keydown', { key: 'PrintScreen', cancelable: true });
      document.dispatchEvent(event);
      expect(onViolation).not.toHaveBeenCalled();

      rerender({ active: true });
      document.dispatchEvent(event);
      expect(onViolation).toHaveBeenCalledTimes(1);
    });

    test('detects DevTools by window size difference', () => {
      const onViolation = vi.fn();
      const originalOuterWidth = window.outerWidth;
      const originalInnerWidth = window.innerWidth;

      renderHook(() => useScreenshotProtection(true, { onViolation }));

      Object.defineProperty(window, 'outerWidth', { value: 1800, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1400, configurable: true });

      act(() => { vi.advanceTimersByTime(2000); });

      expect(onViolation).toHaveBeenCalledWith('devtools_open', 1);

      Object.defineProperty(window, 'outerWidth', { value: originalOuterWidth, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    });

    test('cleans up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => useScreenshotProtection(true));
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    test('tracks violation count accurately', () => {
      const { result } = renderHook(() => useScreenshotProtection(true));

      const event = new KeyboardEvent('keydown', { key: 'PrintScreen', cancelable: true });
      act(() => { document.dispatchEvent(event); });
      expect(result.current.violationCount).toBe(1);

      act(() => { document.dispatchEvent(event); });
      expect(result.current.violationCount).toBe(2);

      act(() => { document.dispatchEvent(event); });
      expect(result.current.violationCount).toBe(3);
    });

    test('cleans up event listeners on unmount', () => {
      const docRemoveSpy = vi.spyOn(document, 'removeEventListener');
      const winRemoveSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useScreenshotProtection(true));
      unmount();

      expect(docRemoveSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(winRemoveSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      expect(winRemoveSpy).toHaveBeenCalledWith('focus', expect.any(Function));

      docRemoveSpy.mockRestore();
      winRemoveSpy.mockRestore();
    });
  });
});
