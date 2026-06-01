import { renderHook, act } from '@testing-library/react';
import useFocusTrap from '../useFocusTrap';

function createContainer() {
  const c = document.createElement('div');
  [1, 2, 3].forEach(i => {
    const btn = document.createElement('button');
    btn.id = `btn${i}`;
    c.appendChild(btn);
  });
  document.body.appendChild(c);
  return c;
}

describe('useFocusTrap', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  test('returns a ref', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    expect(result.current).toHaveProperty('current');
  });

  test('focuses first element when opened with ref set', () => {
    const container = createContainer();
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    rerender({ open: true });
    expect(document.activeElement?.id).toBe('btn1');
  });

  test('does not focus when isOpen is false', () => {
    const container = createContainer();
    const { result } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    expect(document.activeElement?.id).not.toBe('btn1');
  });

  test('traps Tab: wraps from last to first', () => {
    const container = createContainer();
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    rerender({ open: true });
    act(() => {
      container.querySelector('#btn3').focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    });
    expect(document.activeElement?.id).toBe('btn1');
  });

  test('traps Shift+Tab: wraps from first to last', () => {
    const container = createContainer();
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    rerender({ open: true });
    act(() => {
      container.querySelector('#btn1').focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    });
    expect(document.activeElement?.id).toBe('btn3');
  });

  test('does nothing on Tab when only one focusable', () => {
    const c = document.createElement('div');
    const btn = document.createElement('button');
    c.appendChild(btn);
    document.body.appendChild(c);
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = c;
    rerender({ open: true });
    act(() => {
      btn.focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    });
    expect(document.activeElement).toBe(btn);
  });

  test('ignores non-Tab keys', () => {
    const container = createContainer();
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    rerender({ open: true });
    act(() => {
      container.querySelector('#btn3').focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(document.activeElement?.id).toBe('btn3');
  });

  test('restores previous focus on close', () => {
    const outside = document.createElement('button');
    outside.id = 'outside';
    document.body.appendChild(outside);
    outside.focus();

    const container = createContainer();
    const { result, rerender } = renderHook(({ open }) => useFocusTrap(open), {
      initialProps: { open: false },
    });
    result.current.current = container;
    rerender({ open: true });
    rerender({ open: false });
    expect(document.activeElement?.id).toBe('outside');
  });
});
