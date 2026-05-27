import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import XPProgressBar from '../../XPProgressBar';

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: vi.fn(),
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

import { useIALabStore } from '../../../store/ialabStore';

function setupStore(overrides = {}) {
  const state = {
    xp: 2500,
    streak: 5,
    getLevel: () => 6,
    getUserBadges: () => [],
    getBadgesSummary: () => ({ earned: 0, total: 8, recent: [] }),
    ...overrides,
  };
  useIALabStore.mockImplementation((selector) => selector(state));
}

describe('XPProgressBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders level and XP', () => {
    setupStore({ xp: 2500, getLevel: () => 6 });
    render(<XPProgressBar />);
    expect(screen.getByText('Puntos XP')).toBeInTheDocument();
  });

  test('shows progress bar with level info', () => {
    setupStore({ xp: 2500, getLevel: () => 6 });
    render(<XPProgressBar />);
    expect(screen.getByText('Progreso de Aprendizaje')).toBeInTheDocument();
  });

  test('handles zero XP gracefully', () => {
    setupStore({ xp: 0, streak: 0, getLevel: () => 1 });
    render(<XPProgressBar />);
    expect(screen.getByText('Progreso de Aprendizaje')).toBeInTheDocument();
  });
});
