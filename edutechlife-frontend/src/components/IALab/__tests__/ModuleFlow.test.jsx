import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

const { mockSetActiveMod } = vi.hoisted(() => ({
  mockSetActiveMod: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: () => null,
  useParams: () => ({ moduleId: '1' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('@clerk/react', () => ({
  useClerk: () => ({ openUserProfile: vi.fn() }),
  useUser: () => ({ user: { id: 'test-user', username: 'test' }, isLoaded: true }),
}));

vi.mock('framer-motion', () => {
  const comp = ({ children, ...props }) => {
    const filtered = {};
    for (const [key, val] of Object.entries(props)) {
      if (['children', 'className', 'style', 'onClick', 'disabled', 'href', 'target', 'rel', 'aria-label', 'role', 'aria-current', 'aria-expanded', 'aria-controls', 'tabIndex', 'onKeyDown', 'id', 'key', 'layout', 'layoutId', 'title', 'data-testid', 'data-icon', 'data-tour'].includes(key)) {
        filtered[key] = val;
      }
    }
    return React.createElement('div', filtered, children);
  };
  return {
    motion: new Proxy({}, { get: () => comp }),
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
    useMotionValue: (v) => ({ get: () => v, set: vi.fn(), onChange: vi.fn() }),
  };
});

vi.mock('../../../store/ialabStore', () => {
  const storeState = {
    activeMod: 1,
    setActiveMod: vi.fn(),
    isLoadingProgress: false,
    hasStartedCourse: () => false,
    lastVisitedLesson: null,
    lessonProgress: {},
    toggleBookmark: vi.fn(),
    immersiveModalOpen: false,
    userRole: 'student',
    moduleProgress: {},
    completedExams: {},
    challengeScores: {},
    xp: 0,
    streak: 0,
    getLevel: () => 1,
    getLevelProgress: () => 0,
    getTotalPoints: () => 0,
    isStreakAtRisk: () => false,
    calculateModuleScore: () => 0,
    isModuleLocked: () => false,
    isEvaluationLocked: () => false,
    getCurrentModule: () => ({ id: 1, title: 'Test' }),
    getMemoizedModuleScore: () => 0,
    getMemoizedGlobalProgress: () => 0,
    calculateGlobalProgress: () => 0,
    completedModules: [],
    courseProgress: 0,
    visitedModules: [],
    setVisitedModules: vi.fn(),
    completedVideos: {},
    completedInfographics: {},
    completedActivities: {},
    showExamModal: false,
    showQuizModal: false,
    showPremiumEvaluationModal: false,
    showCertificateModal: false,
    showBadgeGallery: false,
    showLeaderboard: false,
    showExamResult: false,
    showChallengeResult: false,
    showHistoryModal: false,
    showHelpModal: false,
    setShowCertificateModal: vi.fn(),
    openModal: vi.fn(),
    closeModal: vi.fn(),
    markResourceAsViewed: vi.fn(),
    trackResourceViewed: vi.fn(),
  };
  const fn = (selector) => selector ? selector(storeState) : storeState;
  fn.getState = () => storeState;
  return { useIALabStore: fn };
});

vi.mock('../../../context/IALabContext', () => ({
  IALabProvider: ({ children }) => <>{children}</>,
  useIALabProgressContext: () => ({
    activeMod: 1,
    setActiveMod: vi.fn(),
    modules: [
      { id: 1, title: 'Ingeniería de Prompts' },
      { id: 2, title: 'Potencia ChatGPT' },
      { id: 3, title: 'Rastreo Profundo' },
    ],
    completedModules: [],
    courseProgress: 0,
    visitedModules: [],
    setVisitedModules: vi.fn(),
    moduleProgress: {},
    isLoadingProgress: false,
    completedExams: {},
    challengeScores: {},
    calculateModuleScore: () => 0,
    isModuleLocked: () => false,
    isEvaluationLocked: () => false,
    getCurrentModule: () => ({ id: 1, title: 'Ingeniería de Prompts' }),
  }),
  useIALabUIContext: () => ({
    user: { id: 'test-user' },
    isDarkMode: false,
    toggleDarkMode: vi.fn(),
    completedModules: [],
    courseCompleted: false,
    setShowCertificateModal: vi.fn(),
    openModal: vi.fn(),
    closeModal: vi.fn(),
    showQuizModal: false,
    showExamModal: false,
    showPremiumEvaluationModal: false,
    showCertificateModal: false,
    showBadgeGallery: false,
    showLeaderboard: false,
    showExamResult: false,
    showChallengeResult: false,
    showHistoryModal: false,
    showHelpModal: false,
    handleGlobalAction: vi.fn(),
  }),
}));

vi.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleDarkMode: vi.fn() }),
}));

vi.mock('../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}));

vi.mock('../../../utils/iconMapping', () => ({
  Icon: ({ name, className }) => <span data-testid="icon" data-icon={name} className={className} />,
}));

vi.mock('../../../data/ialab', () => ({
  getModules: () => [
    { id: 1, title: 'Ingeniería de Prompts' },
    { id: 2, title: 'Potencia ChatGPT' },
  ],
  getAllLessons: () => [],
  modules: [
    { id: 1, title: 'Ingeniería de Prompts' },
    { id: 2, title: 'Potencia ChatGPT' },
  ],
}));

vi.mock('../../LocaleSwitcher', () => ({ default: () => null }));

vi.mock('../../../hooks/useActivityTracker', () => ({
  default: () => ({ getTimeTrackingStats: () => ({ today: 0, weekTotal: 0, avgPerDay: 0, weekDaily: [] }) }),
}));

vi.mock('../../../hooks/useSessionTracker', () => ({ useSessionTracker: () => {} }));
vi.mock('../../../hooks/useAchievementNotifications', () => ({
  useAchievementNotifications: () => ({ toasts: [], removeToast: vi.fn() }),
}));
vi.mock('../../../hooks/useCourseReminders', () => ({ useCourseReminders: () => {} }));
vi.mock('../../../hooks/useBrowserNotifications', () => ({ useBrowserNotifications: () => {} }));
vi.mock('../../../hooks/IALab/usePullToRefresh', () => ({
  usePullToRefresh: () => ({
    containerRef: { current: null },
    pullDistance: 0,
    isRefreshing: false,
    handleTouchStart: vi.fn(),
    handleTouchMove: vi.fn(),
    handleTouchEnd: vi.fn(),
  }),
}));
vi.mock('../../../hooks/IALab/useSwipeNavigation', () => ({
  useSwipeNavigation: () => ({ handleTouchStart: vi.fn(), handleTouchEnd: vi.fn() }),
}));
vi.mock('../../../hooks/IALab/useCelebrationEffects', () => ({ useCelebrationEffects: () => {} }));
vi.mock('../../../hooks/IALab/useIALabKeyboardShortcuts', () => ({ default: () => {} }));
vi.mock('../../NotificationPanel', () => ({ default: () => null }));
vi.mock('../GlobalSearchBar', () => ({ default: () => null }));

vi.mock('../IALabHeader', () => ({ default: () => <div>IALabHeader</div> }));

vi.mock('../IALabSidebar', () => ({
  default: () => (
    <div data-testid="sidebar">
      <button onClick={() => mockSetActiveMod(1)} data-testid="mod-btn-1">Módulo 1</button>
      <button onClick={() => mockSetActiveMod(2)} data-testid="mod-btn-2">Módulo 2</button>
      <button onClick={() => mockSetActiveMod(3)} data-testid="mod-btn-3">Módulo 3</button>
    </div>
  ),
}));

vi.mock('../IALabModals', () => ({ default: () => null }));
vi.mock('../IALabModuleHeader', () => ({ default: () => null }));
vi.mock('../ModuleInfoSection', () => ({ default: () => null }));
vi.mock('../Breadcrumbs', () => ({ default: () => null }));
vi.mock('../shared/MobileMenuOverlay', () => ({ default: () => null }));
vi.mock('../shared/TabPills', () => ({ default: () => null }));
vi.mock('../shared/AnimatedSection', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('../shared/SkipLink', () => ({ default: () => null }));
vi.mock('../shared/MobileHeader', () => ({ default: () => null }));
vi.mock('../shared/MobileInfoBar', () => ({ default: () => null }));
vi.mock('../shared/ToastNotification', () => ({ default: () => null }));
vi.mock('../ValerioFloatingButton', () => ({ default: () => null }));
vi.mock('../OfflineBanner', () => ({ default: () => null }));
vi.mock('../SectionErrorBoundary', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('../A11yProvider', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('../IALabSkeleton', () => ({
  RouteSkeleton: () => null,
  ModuleInfoSkeleton: () => null,
  ModuleOverviewSkeleton: () => null,
  ModuleActionsSkeleton: () => null,
  ToolsSkeleton: () => null,
}));

import IALab from '../IALab';

describe('ModuleFlow - Integration', () => {
  beforeEach(() => {
    mockSetActiveMod.mockClear();
  });

  it('renders with header and sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/ialab/1']}>
        <IALab />
      </MemoryRouter>
    );
    expect(screen.getByText('IALabHeader')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders all module buttons in sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/ialab/1']}>
        <IALab />
      </MemoryRouter>
    );
    expect(screen.getByTestId('mod-btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('mod-btn-2')).toBeInTheDocument();
    expect(screen.getByTestId('mod-btn-3')).toBeInTheDocument();
  });

  it('calls setActiveMod on sidebar module click', () => {
    render(
      <MemoryRouter initialEntries={['/ialab/1']}>
        <IALab />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId('mod-btn-2'));
    expect(mockSetActiveMod).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByTestId('mod-btn-3'));
    expect(mockSetActiveMod).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByTestId('mod-btn-1'));
    expect(mockSetActiveMod).toHaveBeenCalledWith(1);
  });

  it('renders within MemoryRouter without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/ialab/2']}>
        <IALab />
      </MemoryRouter>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('IALabHeader')).toBeInTheDocument();
  });
});
