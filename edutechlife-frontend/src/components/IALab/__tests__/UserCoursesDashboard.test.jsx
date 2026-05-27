import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import UserCoursesDashboard from '../UserCoursesDashboard';

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: vi.fn(),
}));

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

vi.mock('../CourseCard', () => ({
  default: ({ course }) => <div data-testid="course-card">{course.title}</div>,
}));

import { useIALabStore } from '../../../store/ialabStore';

function setupStore(overrides = {}) {
  const state = {
    xp: 2500,
    streak: 5,
    getLevel: () => 3,
    courseProgress: 0,
    isLoadingProgress: false,
    completedModules: [],
    setShowCertificateModal: vi.fn(),
    getUserBadges: () => [],
    getBadgesSummary: () => ({ earned: 0, total: 8, recent: [] }),
    ...overrides,
  };
  useIALabStore.mockImplementation((selector) => selector(state));
}

describe('UserCoursesDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders stats row with XP, level, streak', () => {
    setupStore({ xp: 2500, streak: 5, getLevel: () => 3 });
    render(<UserCoursesDashboard />);
    expect(screen.getByText('streak.xp')).toBeInTheDocument();
    expect(screen.getByText('streak.level')).toBeInTheDocument();
    expect(screen.getByText('streak.days')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders filter tabs', () => {
    setupStore();
    render(<UserCoursesDashboard />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Completados')).toBeInTheDocument();
  });

  test('shows all courses by default', () => {
    setupStore();
    render(<UserCoursesDashboard />);
    const cards = screen.getAllByTestId('course-card');
    expect(cards.length).toBe(8);
  });

  test('filter "in-progress" shows only active courses with progress between 0 and 100', () => {
    setupStore({ courseProgress: 60, completedModules: [] });
    render(<UserCoursesDashboard />);
    fireEvent.click(screen.getByText('En Progreso'));
    const cards = screen.getAllByTestId('course-card');
    expect(cards.length).toBe(1);
    expect(cards[0]).toHaveTextContent('Introducción a la I.A Generativa');
  });

  test('shows empty state when no courses match filter', () => {
    setupStore({ courseProgress: 0, completedModules: [] });
    render(<UserCoursesDashboard />);
    fireEvent.click(screen.getByText('Completados'));
    expect(screen.queryByTestId('course-card')).not.toBeInTheDocument();
    expect(screen.getByText('leaderboard.empty')).toBeInTheDocument();
  });

  test('shows certificate section when progress >= 80', () => {
    setupStore({ courseProgress: 90, completedModules: [] });
    render(<UserCoursesDashboard />);
    expect(screen.getByText('Certificados Obtenidos')).toBeInTheDocument();
  });

  test('hides certificate section when progress < 80', () => {
    setupStore({ courseProgress: 40, completedModules: [] });
    render(<UserCoursesDashboard />);
    expect(screen.queryByText('Certificados Obtenidos')).not.toBeInTheDocument();
  });
});
