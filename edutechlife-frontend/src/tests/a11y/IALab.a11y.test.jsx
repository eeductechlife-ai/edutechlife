import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { I18nProvider } from "../../i18n/I18nProvider";
import { ThemeProvider } from "../../context/ThemeContext";
import { BrowserRouter } from "react-router-dom";

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
});

expect.extend(toHaveNoViolations);

vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name, className }) => (
    <svg data-testid="mock-icon" data-icon={name} className={className} />
  ),
}));

vi.mock("../../data/ialab", () => ({
  getBadgeInfo: () => ({
    first_lesson: {
      label: "Test Badge",
      desc: "A test badge",
      icon: "fa-star",
      color: "#FBBF24",
    },
  }),
}));

vi.mock("../../context/IALabContext", () => ({
  useIALabUIContext: () => ({
    onBack: vi.fn(),
    courseCompleted: false,
    setShowCertificateModal: vi.fn(),
  }),
  useIALabProgressContext: () => ({
    modules: [],
    activeMod: null,
    setActiveMod: vi.fn(),
    openResourceById: vi.fn(),
  }),
}));

vi.mock("../../context/NotificationContext", () => ({
  useNotification: () => ({ unreadCount: 0, createNotification: vi.fn() }),
}));

vi.mock("../../hooks/useCourseReminders", () => ({
  useCourseReminders: () => {},
}));

vi.mock("../../hooks/useBrowserNotifications", () => ({
  useBrowserNotifications: () => {},
}));

vi.mock("../../hooks/IALab/forum/useForumNotifications", () => ({
  default: () => ({ unreadCount: 0 }),
}));

vi.mock("../../components/IALab/IALabMobileMenu", () => ({
  default: () => null,
}));

vi.mock("../../components/IALab/GlobalSearchBar", () => ({
  default: () => null,
}));

// Prevents loading 2700+ lines of locale module content (3 locale files)
// that GlobalSearchBar imports — would cause the fork to OOM in CI.
vi.mock("../../components/IALab/constants/moduleContent/selectors", () => ({
  getModuleOverviewData: () => ({
    topics: [{ id: "t1", title: "Topic 1", slug: "topic-1" }],
  }),
}));

vi.mock("../../components/IALab/constants/moduleContent", () => ({
  getModuleContent: () => ({}),
  getModuleOverviewData: () => ({
    topics: [{ id: "t1", title: "Topic 1", slug: "topic-1" }],
  }),
}));

vi.mock("../../components/UserDropdownMenuSimplified", () => ({
  default: () => null,
}));

vi.mock("../../components/NotificationPanel", () => ({
  default: () => null,
}));

vi.mock("../../components/LocaleSwitcher", () => ({
  default: () => null,
}));

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const validHtmlAttrs = new Set([
    "children",
    "className",
    "style",
    "id",
    "key",
    "ref",
    "tabIndex",
    "role",
    "aria-label",
    "aria-hidden",
    "data-testid",
    "onClick",
    "onMouseDown",
    "onMouseUp",
    "onKeyDown",
    "onKeyUp",
    "onChange",
    "onBlur",
    "onFocus",
    "disabled",
    "type",
    "href",
    "src",
    "alt",
    "value",
    "name",
  ]);
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        if (typeof tag !== "string") return "div";
        const tagName = [
          "div",
          "button",
          "span",
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
        ].includes(tag)
          ? tag
          : "div";
        return ({ children, ...props }) => {
          const filtered = {};
          for (const [key, val] of Object.entries(props)) {
            if (validHtmlAttrs.has(key)) {
              filtered[key] = val;
            }
          }
          return React.createElement(
            tagName,
            Object.keys(filtered).length > 0 ? filtered : null,
            children,
          );
        };
      },
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
    useSpring: (initial) => ({ get: () => initial, set: vi.fn() }),
    useTransform: (val, fn) => fn(val.get?.() ?? val ?? 0),
  };
});

vi.mock("lucide-react", () => ({
  Trophy: (props) => (
    <svg data-testid="lucide-trophy" className={props.className} />
  ),
  Zap: (props) => <svg data-testid="lucide-zap" className={props.className} />,
  Flame: (props) => (
    <svg data-testid="lucide-flame" className={props.className} />
  ),
  Star: (props) => (
    <svg data-testid="lucide-star" className={props.className} />
  ),
  Target: (props) => (
    <svg data-testid="lucide-target" className={props.className} />
  ),
  Award: (props) => (
    <svg data-testid="lucide-award" className={props.className} />
  ),
}));

vi.mock("../../store/ialabStore", () => ({
  useIALabStore: vi.fn(),
}));

vi.mock("../../hooks/IALab/useIdlePause", () => ({
  useIdlePause: () => false,
}));

vi.mock("../../components/IALab/useWeekDays", () => ({
  getWeekDays: () => [
    { filled: true, isToday: false, label: "L" },
    { filled: true, isToday: false, label: "M" },
    { filled: true, isToday: false, label: "M" },
    { filled: true, isToday: false, label: "J" },
    { filled: true, isToday: true, label: "V" },
    { filled: true, isToday: false, label: "S" },
    { filled: true, isToday: false, label: "D" },
  ],
}));

vi.mock("../../components/IALab/data/landingPageData", () => ({
  statusConfig: {
    active: {
      bg: "from-emerald-500 to-teal-600",
      badge: "bg-emerald-500/30 text-emerald-200",
      buttonClass:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    },
    "coming-soon": {
      bg: "from-slate-500 to-slate-600",
      badge: "bg-slate-500/30 text-slate-200",
      buttonClass: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
    },
    new: {
      bg: "from-blue-500 to-indigo-600",
      badge: "bg-blue-500/30 text-blue-200",
      buttonClass: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    },
  },
}));

vi.mock("../../components/IALab/constants/landingAnimations", () => ({
  fadeInUp: {},
}));

vi.mock("../../components/forum/ErrorBoundary", () => ({
  default: ({ children }) => children,
}));

describe("IALab Accessibility", () => {
  it("IALabHeader has no a11y violations", async () => {
    const IALabHeader = (await import("../../components/IALab/IALabHeader"))
      .default;
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <IALabHeader />
        </I18nProvider>
      </ThemeProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it("BadgeCard earned state has no a11y violations", async () => {
    const BadgeCard = (await import("../../components/IALab/BadgeCard"))
      .default;
    const badge = {
      id: "test",
      label: "Test Badge",
      desc: "A test description",
      icon: "fa-star",
      color: "#FBBF24",
    };
    const { container } = render(
      <I18nProvider>
        <BadgeCard
          badge={badge}
          earned
          dateEarned="2025-01-15"
          onClick={vi.fn()}
        />
      </I18nProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it("BadgeCard locked state has no a11y violations", async () => {
    const BadgeCard = (await import("../../components/IALab/BadgeCard"))
      .default;
    const badge = {
      id: "test",
      label: "Test Badge",
      desc: "A test description",
      icon: "fa-star",
      color: "#FBBF24",
    };
    const { container } = render(
      <I18nProvider>
        <BadgeCard badge={badge} earned={false} onClick={vi.fn()} />
      </I18nProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it("CourseCard has no violations", async () => {
    const CourseCard = (await import("../../components/IALab/CourseCard"))
      .default;
    const course = {
      id: "test-1",
      title: "Fundamentos de IA",
      description: "Aprende los fundamentos de la inteligencia artificial.",
      status: "active",
      progress: 60,
      rating: 4.8,
      duration: "10h",
      level: "Principiante",
      modules: 5,
      hasCertificate: true,
      icon: "fa-brain",
      features: ["Proyectos reales", "Certificado IA"],
      students: "2,500+",
      route: "/ialab",
    };
    const { container } = render(
      <BrowserRouter>
        <CourseCard course={course} isSignedIn />
      </BrowserRouter>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it("StreakBadge has no violations", async () => {
    const StreakBadge = (await import("../../components/IALab/StreakBadge"))
      .default;
    const { container } = render(
      <StreakBadge
        streak={5}
        xp={2500}
        isAtRisk={false}
        level={3}
        onClick={vi.fn()}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);

  it("XPProgressBar has no violations", async () => {
    const { useIALabStore } = await import("../../store/ialabStore");
    useIALabStore.mockImplementation((selector) =>
      selector({
        xp: 2500,
        streak: 5,
        getLevel: () => 6,
        getUserBadges: () => [{ id: "first_lesson" }],
        getBadgesSummary: () => ({ earned: 1, total: 8, recent: [] }),
      }),
    );
    const XPProgressBar = (await import("../../components/XPProgressBar"))
      .default;
    const { container } = render(<XPProgressBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000);
});
