import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import IALabDashboard from "../IALabDashboard";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../store/ialabStore", () => ({
  useIALabStore: vi.fn(),
}));

vi.mock("../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es", setLocale: vi.fn() }),
}));

vi.mock("../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../../../data/ialab", () => ({
  getModules: () => [
    { id: 1, title: "Ingeniería de Prompts" },
    { id: 2, title: "Potencia ChatGPT" },
    { id: 3, title: "Rastreo Profundo" },
    { id: 4, title: "Inmersión NotebookLM" },
    { id: 5, title: "Proyecto Disruptivo" },
  ],
}));

vi.mock("../../../context/ThemeContext", () => ({
  useTheme: () => ({ isDarkMode: false, toggleDarkMode: vi.fn() }),
}));

vi.mock("../../LocaleSwitcher", () => ({
  default: () => null,
}));

// Both DashboardCompleted and DashboardInProgress are lazy-loaded. Mock them
// synchronously so tests don't need to wait for dynamic imports to resolve.
vi.mock("../dashboard/DashboardCompleted", () => ({
  default: () => React.createElement("h2", null, "route.course_complete"),
}));

// DashboardInProgress reads from the store — import is fine here since the
// store module is already mocked by vi.mock above.
vi.mock("../dashboard/DashboardInProgress", async () => {
  const { useIALabStore } = await import("../../../store/ialabStore");
  return {
    default: function MockDashboardInProgress() {
      const xp = useIALabStore((s) => s.xp);
      const streak = useIALabStore((s) => s.streak);
      return React.createElement(
        "div",
        null,
        React.createElement("span", null, "dashboard.continue_learning"),
        React.createElement("span", null, "dashboard.global_progress"),
        React.createElement("span", null, "dashboard.your_progress"),
        React.createElement("span", null, "dashboard.activity_trends"),
        xp ? React.createElement("span", null, xp.toLocaleString()) : null,
        streak ? React.createElement("span", null, String(streak)) : null,
      );
    },
  };
});

vi.mock("../../../hooks/useActivityTracker", () => ({
  default: () => ({
    getTimeTrackingStats: () => ({
      today: 0,
      weekTotal: 0,
      avgPerDay: 0,
      weekDaily: [],
    }),
  }),
}));

vi.mock("@clerk/react", () => ({
  useUser: () => ({ user: null }),
}));

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: () => {
        const comp = ({ children, ...props }) => {
          const filtered = {};
          for (const [key, val] of Object.entries(props)) {
            if (
              [
                "children",
                "className",
                "style",
                "onClick",
                "disabled",
                "href",
                "target",
                "rel",
                "aria-label",
                "data-testid",
              ].includes(key)
            ) {
              filtered[key] = val;
            }
          }
          return React.createElement("div", filtered, children);
        };
        return comp;
      },
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  };
});

import { useIALabStore } from "../../../store/ialabStore";

const defaultStore = {
  moduleProgress: {},
  completedModules: [],
  courseProgress: 0,
  xp: 1,
  streak: 0,
  completedExams: {},
  challengeScores: {},
  courseCompleted: false,
  getNextSuggestedAction: () => null,
};

function setupStore(overrides = {}) {
  const state = { ...defaultStore, ...overrides };
  useIALabStore.mockImplementation((selector) => selector(state));
  useIALabStore.getState = () => state;
}

beforeEach(() => {
  setupStore();
});

describe("IALabDashboard", () => {
  test("renders dashboard when no progress", async () => {
    render(<IALabDashboard />);
    // DashboardInProgress is lazy — findByText waits for the import to resolve.
    expect(
      await screen.findByText("dashboard.continue_learning"),
    ).toBeInTheDocument();
  });

  test("renders DashboardInProgress when user has progress", () => {
    setupStore({
      moduleProgress: {
        1: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: false,
          currentScore: 30,
          isUnlocked: true,
        },
      },
      courseProgress: 45,
      xp: 1200,
      streak: 7,
      completedExams: { 1: 85 },
    });
    render(<IALabDashboard />);
    expect(screen.getByText("dashboard.continue_learning")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  test("renders DashboardCompleted when course is completed", async () => {
    setupStore({
      courseProgress: 100,
      courseCompleted: true,
      moduleProgress: {
        1: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 100,
          isUnlocked: true,
        },
        2: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 100,
          isUnlocked: true,
        },
        3: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 100,
          isUnlocked: true,
        },
        4: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 100,
          isUnlocked: true,
        },
        5: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 100,
          isUnlocked: true,
        },
      },
      completedModules: [1, 2, 3, 4, 5],
      completedExams: { 1: 90, 2: 85, 3: 90, 4: 88, 5: 92 },
      challengeScores: { 1: 100, 2: 95, 3: 90, 4: 85, 5: 88 },
    });
    render(<IALabDashboard />);
    // DashboardCompleted is lazy — findByText waits for the import to resolve.
    expect(
      await screen.findByText("route.course_complete"),
    ).toBeInTheDocument();
  });

  test("renders module tabs in DashboardInProgress", () => {
    setupStore({
      moduleProgress: {
        1: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: false,
          currentScore: 30,
          isUnlocked: true,
        },
      },
      courseProgress: 45,
    });
    render(<IALabDashboard />);
    expect(screen.getByText("dashboard.your_progress")).toBeInTheDocument();
    expect(screen.getByText("dashboard.activity_trends")).toBeInTheDocument();
  });

  test("renders global progress donut for in-progress user", () => {
    setupStore({
      moduleProgress: {
        1: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: false,
          currentScore: 30,
          isUnlocked: true,
        },
      },
      courseProgress: 45,
    });
    render(<IALabDashboard />);
    expect(screen.getByText("dashboard.global_progress")).toBeInTheDocument();
  });

  test("renders DashboardCompleted when all 5 modules completed by score", () => {
    setupStore({
      moduleProgress: {
        1: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 85,
          isUnlocked: true,
        },
        2: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 85,
          isUnlocked: true,
        },
        3: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 85,
          isUnlocked: true,
        },
        4: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 85,
          isUnlocked: true,
        },
        5: {
          exam: true,
          challenge: true,
          resourcesCompleted: true,
          community: true,
          currentScore: 85,
          isUnlocked: true,
        },
      },
      completedExams: { 1: 85, 2: 85, 3: 85, 4: 85, 5: 85 },
    });
    render(<IALabDashboard />);
    expect(screen.getByText("route.course_complete")).toBeInTheDocument();
  });
});
