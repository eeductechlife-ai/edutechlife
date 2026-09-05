import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ReviewScheduler from "./ReviewScheduler";

const storeState = vi.hoisted(() => ({
  reviewSchedule: [],
}));

vi.mock("../../store/ialabStore", () => ({
  useIALabStore: (selector) =>
    selector({
      getDueReviews: () => {
        const now = Date.now();
        return storeState.reviewSchedule
          .filter((r) => r.dueAt <= now)
          .sort((a, b) => a.dueAt - b.dueAt);
      },
      getUpcomingReviews: (daysAhead) => {
        const now = Date.now();
        const limit = now + daysAhead * 24 * 60 * 60 * 1000;
        return storeState.reviewSchedule
          .filter((r) => r.dueAt > now && r.dueAt <= limit)
          .sort((a, b) => a.dueAt - b.dueAt);
      },
      reviewSchedule: storeState.reviewSchedule,
    }),
}));

vi.mock("framer-motion", () => {
  const passthrough = ({ children }) => children;
  return {
    motion: new Proxy({}, { get: () => passthrough }),
  };
});

vi.mock("../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      const map = {
        "ialab.review_scheduler.empty": "Tus repasos aparecerán aquí",
        "ialab.review_scheduler.due_today": "hoy",
        "ialab.review_scheduler.review_today": "repasa hoy",
        "ialab.review_scheduler.overdue_review": "repasa hoy",
        "ialab.review_scheduler.upcoming": "próximos",
        "ialab.review_scheduler.box": "caja",
        "ialab.review_scheduler.title": "Repasos",
      };
      let str = map[key] ?? key;
      if (opts)
        Object.entries(opts).forEach(([k, v]) => {
          str = str.replace(`{{${k}}}`, v);
        });
      return str;
    },
  }),
}));

const DAY = 24 * 60 * 60 * 1000;

describe("ReviewScheduler", () => {
  it("muestra el estado vacío cuando no hay repasos programados", () => {
    storeState.reviewSchedule = [];
    render(<ReviewScheduler />);
    expect(screen.getByText(/Tus repasos aparecerán aquí/)).toBeInTheDocument();
  });

  it("muestra items vencidos como 'Hoy' y próximos con su caja", () => {
    const now = Date.now();
    storeState.reviewSchedule = [
      { itemId: "ova-1", box: 1, dueAt: now - DAY },
      { itemId: "ova-2", box: 2, dueAt: now - 2 * DAY },
      { itemId: "ova-3", box: 3, dueAt: now + 2 * DAY },
      { itemId: "ova-4", box: 4, dueAt: now + 20 * DAY },
    ];
    render(<ReviewScheduler maxUpcoming={3} />);
    expect(screen.getByText("ova-1")).toBeInTheDocument();
    expect(screen.getByText("ova-2")).toBeInTheDocument();
    expect(screen.getByText("ova-3")).toBeInTheDocument();
    expect(screen.queryByText("ova-4")).not.toBeInTheDocument();
    // Badge shows "hoy" for due items; overdue items render "repasa hoy" action text
    expect(screen.getAllByText(/hoy/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/repasa hoy/).length).toBeGreaterThanOrEqual(1);
  });
});
