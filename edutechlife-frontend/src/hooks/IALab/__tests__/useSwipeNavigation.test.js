import { renderHook, act } from '@testing-library/react';
import { useSwipeNavigation } from '../useSwipeNavigation';

describe('useSwipeNavigation', () => {
  test('returns handlers', () => {
    const { result } = renderHook(() => useSwipeNavigation({}));
    expect(typeof result.current.handleTouchStart).toBe('function');
    expect(typeof result.current.handleTouchEnd).toBe('function');
  });

  test('calls onSwipeLeft when swiping left beyond threshold', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200, clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 100, clientY: 105 }] });
    });

    expect(onSwipeLeft).toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  test('calls onSwipeRight when swiping right beyond threshold', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100, clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 200, clientY: 105 }] });
    });

    expect(onSwipeRight).toHaveBeenCalled();
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  test('does not call swipe when vertical distance exceeds horizontal', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200, clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 190, clientY: 500 }] });
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  test('does not call swipe when distance is below threshold', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation({ onSwipeLeft, threshold: 100 }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200, clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 150, clientY: 105 }] });
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  test('handles missing callbacks gracefully', () => {
    const { result } = renderHook(() => useSwipeNavigation({ threshold: 50 }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200, clientY: 100 }] });
    });
    expect(() => {
      act(() => {
        result.current.handleTouchEnd({ changedTouches: [{ clientX: 50, clientY: 105 }] });
      });
    }).not.toThrow();
  });

  test('uses default threshold of 80', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation({ onSwipeLeft }));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 200, clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 100, clientY: 105 }] });
    });

    expect(onSwipeLeft).toHaveBeenCalled();
  });
});
