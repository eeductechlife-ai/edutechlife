import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ActivityHistory from "./ActivityHistory";
import es from "../i18n/es.json";

const interpolate = (str, params = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);

const t = (key, params) => {
  const value = es[key];
  return value === undefined ? key : interpolate(value, params);
};

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return {
    motion: new Proxy({}, { get: (_, tag) => passthrough }),
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  };
});

vi.mock("./IALab/StudyCalendarSection", () => ({
  default: () => <div data-testid="study-calendar">Calendario</div>,
}));

vi.mock("../hooks/useActivityTracker", () => ({
  useActivityTracker: () => ({ activities: [] }),
}));
vi.mock("../hooks/useBodyScrollLock", () => ({ default: () => {} }));
vi.mock("../hooks/useFocusTrap", () => ({ default: () => ({ current: null }) }));
vi.mock("../hooks/IALab/usePersonalizedRecommendations", () => ({
  default: () => [],
}));
vi.mock("../hooks/useSessionTracker", () => ({
  getUnifiedSessionStats: async () => null,
}));
vi.mock("../lib/supabase", () => ({ supabase: {} }));
vi.mock("./activityHistory/activityPDFGenerator", () => ({
  exportProgressPDF: vi.fn(),
}));
vi.mock("../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t, locale: "es" }),
}));
vi.mock("../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../store/ialabStore", () => {
  const storeState = {
    lessonProgress: {},
    xp: 0,
    streak: 0,
    lastActivityDate: null,
    badges: [],
    getLevel: () => ({ id: 1, name: "Nivel 1" }),
    getXpForNextLevel: () => 100,
    getLevelProgress: () => 0,
    getTotalPoints: () => 0,
    moduleProgress: {},
    getDaysSinceStart: () => 0,
    completedModules: [],
    completedVideos: [],
    completedInfographics: [],
    completedExams: {},
    challengeScores: {},
    courseProgress: 0,
    syncStatus: "synced",
    userId: null,
    getWeeklyXP: () => 0,
    forumPostCount: 0,
    forumCommentCount: 0,
    getModuleDominanceLevel: () => null,
    reviewSchedule: [],
    getDueReviews: () => [],
    getUpcomingReviews: () => [],
  };
  const fn = (selector) => (selector ? selector(storeState) : storeState);
  fn.getState = () => storeState;
  return { useIALabStore: fn };
});

describe("ActivityHistory - tab Repaso", () => {
  it("muestra el tab 'Repaso' y renderiza ReviewScheduler + StudyCalendarSection al hacer clic", async () => {
    render(<ActivityHistory isOpen onClose={() => {}} />);

    fireEvent.click(screen.getByText("Repaso"));

    expect(
      await screen.findByText("Tus repasos aparecerán aquí conforme avances"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("study-calendar")).toBeInTheDocument();
  });

  it("no renderiza el modal cuando isOpen es false", () => {
    render(<ActivityHistory isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText("Repaso")).not.toBeInTheDocument();
  });
});
