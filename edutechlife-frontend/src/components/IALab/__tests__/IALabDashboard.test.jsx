import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import IALabDashboard from '../IALabDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: vi.fn(),
}));

vi.mock('../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}));

vi.mock('../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../data/ialab', () => ({
  getModules: () => [
    { id: 1, title: 'Ingeniería de Prompts' },
    { id: 2, title: 'Potencia ChatGPT' },
    { id: 3, title: 'Rastreo Profundo' },
    { id: 4, title: 'Inmersión NotebookLM' },
    { id: 5, title: 'Proyecto Disruptivo' },
  ],
}));

vi.mock('../../../hooks/IALab/usePersonalizedRecommendations', () => ({
  default: () => ({
    high: [],
    medium: [],
    low: [],
    completionForecast: {
      estimatedDate: new Date('2026-08-15'),
      daysRemaining: 70,
      pace: 'moderate',
      conservative: 98,
      optimistic: 42,
    },
  }),
}));

vi.mock('framer-motion', () => {
  const motion = new Proxy({}, {
    get: () => {
      const comp = ({ children, ...props }) => {
        const filtered = {};
        for (const [key, val] of Object.entries(props)) {
          if (['children', 'className', 'style', 'onClick', 'disabled', 'href', 'target', 'rel', 'aria-label'].includes(key)) {
            filtered[key] = val;
          }
        }
        return React.createElement('div', filtered, children);
      };
      return comp;
    },
  });
  return { motion, AnimatePresence: ({ children }) => children };
});

import { useIALabStore } from '../../../store/ialabStore';

const defaultStore = {
  moduleProgress: {},
  completedModules: [],
  courseProgress: 0,
  xp: 0,
  streak: 0,
  completedExams: {},
  challengeScores: {},
  courseCompleted: false,
};

function setupStore(overrides = {}) {
  const state = { ...defaultStore, ...overrides };
  useIALabStore.mockImplementation((selector) => selector(state));
}

beforeEach(() => {
  setupStore();
});

describe('IALabDashboard', () => {
  test('renders progress bar with course progress', () => {
    setupStore({ courseProgress: 45 });
    render(<IALabDashboard />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  test('renders stats cards with XP, streak, avg score, modules', () => {
    setupStore({ xp: 1200, streak: 7, completedExams: { 1: 85, 2: 90 } });
    render(<IALabDashboard />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('0/5')).toBeInTheDocument();
  });

  test('renders welcome section when no progress', () => {
    render(<IALabDashboard />);
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
  });

  test('renders completion forecast card', () => {
    setupStore({
      courseProgress: 45,
      streak: 5,
      moduleProgress: {
        1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 30, isUnlocked: true },
      },
    });
    render(<IALabDashboard />);
    expect(screen.getByText(/Pronóstico/i)).toBeInTheDocument();
  });

  test('renders module timeline items by score', () => {
    setupStore({
      moduleProgress: {
        1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 30, isUnlocked: true },
        2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
      },
    });
    render(<IALabDashboard />);
    expect(screen.getByText(/30%/)).toBeInTheDocument();
  });

  test('shows pending tasks for active module', () => {
    setupStore({
      moduleProgress: {
        1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
      },
    });
    render(<IALabDashboard />);
    expect(screen.getByText(/route\.pending/)).toBeInTheDocument();
  });

  test('hides forecast when course is completed', () => {
    setupStore({
      courseCompleted: true,
      moduleProgress: {
        1: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
      },
      completedModules: [1],
    });
    render(<IALabDashboard />);
    expect(screen.queryByText(/pronóstico/i)).not.toBeInTheDocument();
  });

  test('shows course completion message when all modules done', () => {
    setupStore({
      courseProgress: 100,
      moduleProgress: {
        1: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
        2: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
        3: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
        4: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
        5: { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true },
      },
      completedModules: [1, 2, 3, 4, 5],
      completedExams: { 1: 90, 2: 85, 3: 90, 4: 88, 5: 92 },
      challengeScores: { 1: 100, 2: 95, 3: 90, 4: 85, 5: 88 },
    });
    render(<IALabDashboard />);
    expect(screen.getByText(/progress\.module_completed_all/)).toBeInTheDocument();
  });

  test('renders continue button for active module', () => {
    setupStore({
      moduleProgress: {
        1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
      },
    });
    render(<IALabDashboard />);
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });
});
