import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    aside: 'aside',
    main: 'main',
    header: 'header',
    nav: 'nav',
    section: 'section',
    article: 'article',
    p: 'p',
    ul: 'ul',
    li: 'li',
    h3: 'h3',
    img: 'img',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useReducedMotion: () => false,
  useSpring: (val: unknown) => ({ get: () => val }),
  useMotionValue: (val: unknown) => ({ get: () => val }),
  useTransform: (val: unknown) => ({ get: () => val }),
}));

// Mock IntersectionObserver
// NOTE: must be a real constructable (class/function declaration), not an
// arrow function passed to vi.fn() — arrow functions are not constructable,
// so `new IntersectionObserver()` would throw "is not a constructor".
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
(globalThis as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
// Same constructability requirement as above — recharts' ResponsiveContainer
// calls `new ResizeObserver(...)`, which throws when the mock is an arrow fn.
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
(globalThis as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock I18nProvider to avoid translation context errors in component tests
vi.mock('@/i18n/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params) {
        let result = key;
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v));
        });
        return result;
      }
      return key;
    },
    locale: 'es',
    setLocale: vi.fn(),
  }),
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
}));
