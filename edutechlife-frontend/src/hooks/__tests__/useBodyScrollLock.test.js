import { renderHook } from '@testing-library/react';
import useBodyScrollLock from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  });

  test('locks body scroll when isLocked is true', () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.width).toBe('100%');
    expect(document.body.style.touchAction).toBe('none');
  });

  test('does not lock when isLocked is false', () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  test('restores original styles on unlock', () => {
    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: true },
    });
    rerender({ locked: false });
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.width).toBe('');
    expect(document.body.style.touchAction).toBe('');
  });

  test('restores original styles on unmount', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
  });
});
