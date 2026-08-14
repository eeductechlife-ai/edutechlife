import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ReviewScheduler from "./ReviewScheduler";

const storeState = vi.hoisted(() => ({
  reviewSchedule: [],
}));

vi.mock("../../store/ialabStore", () => ({
  useIALabStore: (selector) => selector({
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
    expect(screen.getByText("2 hoy")).toBeInTheDocument();
    expect(screen.getAllByText(/repasa hoy/).length).toBe(2);
  });
});
