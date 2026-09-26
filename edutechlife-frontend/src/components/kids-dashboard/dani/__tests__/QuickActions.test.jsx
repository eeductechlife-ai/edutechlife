import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import QuickActionsImproved from "../../daniTutorChat/components/QuickActionsImproved";
import {
  getQuickActionMessage,
  QUICK_ACTION_PREFILL,
} from "../../daniTutorChat/daniQuickActions";

describe("QuickActions (QuickActionsImproved)", () => {
  test("renders six quick action buttons", () => {
    render(<QuickActionsImproved onAction={vi.fn()} darkMode={false} />);
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(6);
  });

  test("calls onAction with an action id when a button is clicked", () => {
    const onAction = vi.fn();
    render(<QuickActionsImproved onAction={onAction} darkMode={false} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(typeof onAction.mock.calls[0][0]).toBe("string");
  });

  test("propagates darkMode without crashing", () => {
    const { unmount } = render(
      <QuickActionsImproved onAction={vi.fn()} darkMode dark />,
    );
    unmount();
  });

  test("every action id resolves to a real message or a prefill", () => {
    const onAction = vi.fn();
    render(<QuickActionsImproved onAction={onAction} studentAge={12} />);
    screen.getAllByRole("button").forEach((b) => fireEvent.click(b));
    expect(onAction.mock.calls.length).toBeGreaterThanOrEqual(6);
    onAction.mock.calls.forEach(([id]) => {
      const resolves =
        QUICK_ACTION_PREFILL[id] || getQuickActionMessage(id) !== id;
      expect(resolves).toBeTruthy();
    });
  });
});
