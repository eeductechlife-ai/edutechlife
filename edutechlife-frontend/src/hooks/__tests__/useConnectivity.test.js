import { renderHook, act } from '@testing-library/react';
import useConnectivity from '../useConnectivity';

describe('useConnectivity', () => {
  test('returns initial online status', () => {
    const { result } = renderHook(() => useConnectivity());
    expect(result.current).toBe(true);
  });

  test('goes offline when offline event fires', () => {
    const { result } = renderHook(() => useConnectivity());
    act(() => { window.dispatchEvent(new Event('offline')); });
    expect(result.current).toBe(false);
  });

  test('goes online when online event fires', () => {
    const { result } = renderHook(() => useConnectivity());
    act(() => { window.dispatchEvent(new Event('offline')); });
    expect(result.current).toBe(false);
    act(() => { window.dispatchEvent(new Event('online')); });
    expect(result.current).toBe(true);
  });

  test('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useConnectivity());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
