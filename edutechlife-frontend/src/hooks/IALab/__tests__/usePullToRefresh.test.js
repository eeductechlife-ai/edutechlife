import { renderHook, act } from '@testing-library/react';
import { usePullToRefresh } from '../usePullToRefresh';

describe('usePullToRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns all required values', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));
    expect(result.current).toHaveProperty('containerRef');
    expect(result.current).toHaveProperty('pullDistance');
    expect(result.current).toHaveProperty('isRefreshing');
    expect(result.current).toHaveProperty('handleTouchStart');
    expect(result.current).toHaveProperty('handleTouchMove');
    expect(result.current).toHaveProperty('handleTouchEnd');
  });

  test('pullDistance initializes at 0', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));
    expect(result.current.pullDistance).toBe(0);
  });

  test('isRefreshing initializes as false', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));
    expect(result.current.isRefreshing).toBe(false);
  });

  test('handleTouchMove updates pullDistance', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 200 }] });
    });

    expect(result.current.pullDistance).toBe(50);
  });

  test('pullDistance caps at 120', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 500 }] });
    });

    expect(result.current.pullDistance).toBe(120);
  });

  test('does not track when scrolled down', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 50 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 200 }] });
    });

    expect(result.current.pullDistance).toBe(0);
  });

  test('calls onRefresh when pull exceeds threshold', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => usePullToRefresh({ onRefresh, threshold: 50 }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 250 }] });
    });
    await act(async () => {
      result.current.handleTouchEnd();
      await vi.runAllTimersAsync();
    });

    expect(onRefresh).toHaveBeenCalled();
  });

  test('sets isRefreshing during refresh', async () => {
    let resolveRefresh;
    const onRefresh = () => new Promise(resolve => { resolveRefresh = resolve; });

    const { result } = renderHook(() => usePullToRefresh({ onRefresh, threshold: 50 }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 250 }] });
    });
    act(() => {
      result.current.handleTouchEnd();
    });

    expect(result.current.isRefreshing).toBe(true);

    await act(async () => {
      resolveRefresh();
    });

    expect(result.current.isRefreshing).toBe(false);
  });

  test('resets pullDistance after touch end', () => {
    const { result } = renderHook(() => usePullToRefresh({ onRefresh: vi.fn() }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 180 }] });
    });
    act(() => {
      result.current.handleTouchEnd();
    });

    expect(result.current.pullDistance).toBe(0);
  });

  test('does not call onRefresh if pull is below threshold', () => {
    const onRefresh = vi.fn();
    const { result } = renderHook(() => usePullToRefresh({ onRefresh, threshold: 100 }));

    Object.defineProperty(result.current.containerRef, 'current', {
      value: { scrollTop: 0 },
      writable: true,
    });

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientY: 100 }] });
    });
    act(() => {
      result.current.handleTouchMove({ touches: [{ clientY: 150 }] });
    });
    act(() => {
      result.current.handleTouchEnd();
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });
});
