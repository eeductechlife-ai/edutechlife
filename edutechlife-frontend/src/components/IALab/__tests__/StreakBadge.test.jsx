import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import StreakBadge from '../StreakBadge';

vi.mock('../../../utils/iconMapping', () => ({
  Icon: () => null,
}));

vi.mock('../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const validHtmlAttrs = new Set([
    'children', 'className', 'style', 'id', 'key', 'ref',
    'tabIndex', 'role', 'aria-label', 'aria-hidden',
    'data-testid',
    'onClick', 'type',
    'disabled',
  ]);
  const motion = new Proxy({}, {
    get: (_, tag) => {
      if (typeof tag !== 'string') return 'div';
      const tagName = ['div', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4'].includes(tag) ? tag : 'div';
      return ({ children, ...props }) => {
        const filtered = {};
        for (const [key, val] of Object.entries(props)) {
          if (validHtmlAttrs.has(key)) {
            filtered[key] = val;
          }
        }
        return React.createElement(tagName, Object.keys(filtered).length > 0 ? filtered : null, children);
      };
    },
  });
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => true,
    useSpring: (initial) => ({ get: () => initial, set: vi.fn() }),
    useTransform: (val, fn) => fn(val.get?.() ?? val ?? 0),
  };
});

vi.mock('../useWeekDays', () => ({
  getWeekDays: () => [
    { filled: true, isToday: false, label: 'L' },
    { filled: true, isToday: false, label: 'M' },
    { filled: true, isToday: false, label: 'M' },
    { filled: true, isToday: false, label: 'J' },
    { filled: true, isToday: false, label: 'V' },
    { filled: true, isToday: true, label: 'S' },
    { filled: true, isToday: false, label: 'D' },
  ],
}));

describe('StreakBadge', () => {
  const defaultProps = {
    streak: 5,
    xp: 2500,
    isAtRisk: false,
    level: 3,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders streak count', () => {
    render(<StreakBadge {...defaultProps} />);
    expect(screen.getByText('streak.days')).toBeInTheDocument();
  });

  test('shows day indicators', () => {
    render(<StreakBadge {...defaultProps} />);
    expect(screen.getByText('L')).toBeInTheDocument();
    const ms = screen.getAllByText('M');
    expect(ms.length).toBe(2);
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  test('calls onClick when badge is clicked', () => {
    const onClick = vi.fn();
    render(<StreakBadge {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByText('streak.days'));
    expect(onClick).toHaveBeenCalled();
  });
});
