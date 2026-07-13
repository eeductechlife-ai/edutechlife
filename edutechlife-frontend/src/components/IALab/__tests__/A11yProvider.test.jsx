import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import A11yProvider, { useA11y } from '../A11yProvider';

const originalRaf = global.requestAnimationFrame;

function TestConsumer() {
  const { announce, focusMain } = useA11y();
  return (
    <div>
      <button onClick={() => announce('Test announcement')}>Announce</button>
      <button onClick={focusMain}>Focus Main</button>
    </div>
  );
}

describe('A11yProvider', () => {
  afterEach(() => {
    global.requestAnimationFrame = originalRaf;
  });

  test('renders children', () => {
    render(
      <A11yProvider>
        <div data-testid="child">Child Content</div>
      </A11yProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('context provides correct default values', () => {
    render(
      <A11yProvider>
        <TestConsumer />
      </A11yProvider>
    );
    expect(screen.getByText('Announce')).toBeInTheDocument();
    expect(screen.getByText('Focus Main')).toBeInTheDocument();
  });

  test('renders skip link', () => {
    render(
      <A11yProvider>
        <div>Content</div>
      </A11yProvider>
    );
    const skipLink = screen.getByText('Saltar al contenido principal / Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.closest('a')).toHaveAttribute('href', '#main-content');
  });

  test('renders live region for announcements', () => {
    render(
      <A11yProvider>
        <TestConsumer />
      </A11yProvider>
    );
    const liveRegion = document.querySelector('[role="status"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  test('announce function triggers aria live region update', () => {
    global.requestAnimationFrame = (cb) => cb();
    render(
      <A11yProvider>
        <TestConsumer />
      </A11yProvider>
    );
    const btn = screen.getByText('Announce');
    act(() => { btn.click(); });
    const liveRegion = document.querySelector('[role="status"]');
    expect(liveRegion).toHaveTextContent('Test announcement');
  });

  test('useA11y returns null when used outside a provider', () => {
    // A11yContext is created with a default value of `null`
    // (createContext(null)), so consuming it outside <A11yProvider> does not
    // throw a custom "must be used within provider" error — it simply
    // yields null. Verifying the raw hook result (instead of rendering a
    // component that destructures it) avoids an uncaught render error
    // escaping through jsdom's event dispatch, which is noisy even with
    // console.error mocked.
    const { result } = renderHook(() => useA11y());
    expect(result.current).toBeNull();
  });
});
