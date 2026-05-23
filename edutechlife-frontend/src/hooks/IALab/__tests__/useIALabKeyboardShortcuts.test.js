import { renderHook } from '@testing-library/react';
import useIALabKeyboardShortcuts from '../useIALabKeyboardShortcuts';

const mockSetActiveMod = vi.fn();
let mockStoreState;

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: Object.assign(
    (selector) => selector ? selector(mockStoreState) : mockStoreState,
    { getState: () => mockStoreState }
  ),
}));

beforeEach(() => {
  mockStoreState = {
    setActiveMod: mockSetActiveMod,
  };
  mockSetActiveMod.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

function fireKey(key, options = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  Object.defineProperty(event, 'target', {
    value: { tagName: options.targetTag || 'DIV' },
    writable: false,
  });
  window.dispatchEvent(event);
  return event;
}

describe('useIALabKeyboardShortcuts', () => {
  test('registers and cleans up keydown listener', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIALabKeyboardShortcuts());
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test('keys 1-5 call setActiveMod with the number', () => {
    renderHook(() => useIALabKeyboardShortcuts());

    for (let i = 1; i <= 5; i++) {
      fireKey(String(i));
      expect(mockSetActiveMod).toHaveBeenCalledWith(i);
    }
    expect(mockSetActiveMod).toHaveBeenCalledTimes(5);
  });

  test('ignores keys 1-5 when meta or ctrl is pressed', () => {
    renderHook(() => useIALabKeyboardShortcuts());

    fireKey('1', { metaKey: true });
    fireKey('2', { ctrlKey: true });
    expect(mockSetActiveMod).not.toHaveBeenCalled();
  });

  test('key "e" calls onAction with OPEN_EVALUATION', () => {
    const onAction = vi.fn();
    renderHook(() => useIALabKeyboardShortcuts(onAction));

    fireKey('e');
    expect(onAction).toHaveBeenCalledWith('OPEN_EVALUATION');
  });

  test('key "E" (uppercase) also calls onAction', () => {
    const onAction = vi.fn();
    renderHook(() => useIALabKeyboardShortcuts(onAction));

    fireKey('E');
    expect(onAction).toHaveBeenCalledWith('OPEN_EVALUATION');
  });

  test('key "e" is ignored when meta/ctrl is pressed', () => {
    const onAction = vi.fn();
    renderHook(() => useIALabKeyboardShortcuts(onAction));

    fireKey('e', { metaKey: true });
    expect(onAction).not.toHaveBeenCalled();

    fireKey('e', { ctrlKey: true });
    expect(onAction).not.toHaveBeenCalled();
  });

  test('key "r" dispatches custom event ialab:openTopic', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    renderHook(() => useIALabKeyboardShortcuts());

    fireKey('r');
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ialab:openTopic' })
    );

    dispatchSpy.mockRestore();
  });

  test('ignores events from input elements', () => {
    const onAction = vi.fn();
    renderHook(() => useIALabKeyboardShortcuts(onAction));

    fireKey('e', { targetTag: 'INPUT' });
    expect(onAction).not.toHaveBeenCalled();
    expect(mockSetActiveMod).not.toHaveBeenCalled();

    fireKey('r', { targetTag: 'TEXTAREA' });
    expect(onAction).not.toHaveBeenCalled();

    fireKey('1', { targetTag: 'SELECT' });
    expect(mockSetActiveMod).not.toHaveBeenCalled();
  });

  test('unrelated keys do nothing', () => {
    const onAction = vi.fn();
    renderHook(() => useIALabKeyboardShortcuts(onAction));

    fireKey('a');
    fireKey('b');
    fireKey('z');
    fireKey('Enter');
    fireKey('Escape');

    expect(onAction).not.toHaveBeenCalled();
    expect(mockSetActiveMod).not.toHaveBeenCalled();
  });
});
