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
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
  useSpring: (val) => ({ get: () => val }),
  useMotionValue: (val) => ({ get: () => val }),
  useTransform: (val) => ({ get: () => val }),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

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
    t: (key, params) => {
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
  I18nProvider: ({ children }) => children,
}));
