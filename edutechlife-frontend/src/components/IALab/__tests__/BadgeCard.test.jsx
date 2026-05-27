import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BadgeCard from '../BadgeCard';

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
    'onClick',
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
    useReducedMotion: () => false,
    useSpring: (initial) => ({ get: () => initial, set: vi.fn() }),
    useTransform: (val, fn) => fn(val.get?.() ?? val ?? 0),
  };
});

const earnedBadge = {
  id: 'first_lesson',
  label: 'Primeros Pasos',
  desc: 'Completa tu primera lección',
  icon: 'fa-star',
  color: '#FBBF24',
};

describe('BadgeCard', () => {
  const defaultOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders badge name', () => {
    render(
      <BadgeCard badge={earnedBadge} earned dateEarned="2025-01-15" onClick={defaultOnClick} />
    );
    expect(screen.getByText('Primeros Pasos')).toBeInTheDocument();
  });

  test('shows locked state with lock aria label', () => {
    const { container } = render(
      <BadgeCard badge={earnedBadge} earned={false} onClick={defaultOnClick} />
    );
    const badge = container.querySelector('[aria-label="badge.locked_aria"]');
    expect(badge).toBeInTheDocument();
  });

  test('shows unlocked state with earned aria label', () => {
    const { container } = render(
      <BadgeCard badge={earnedBadge} earned dateEarned="2025-01-15" onClick={defaultOnClick} />
    );
    const badge = container.querySelector('[aria-label="badge.earned_aria"]');
    expect(badge).toBeInTheDocument();
  });

  test('renders badge description', () => {
    render(
      <BadgeCard badge={earnedBadge} earned dateEarned="2025-01-15" onClick={defaultOnClick} />
    );
    expect(screen.getByText('Completa tu primera lección')).toBeInTheDocument();
  });
});
