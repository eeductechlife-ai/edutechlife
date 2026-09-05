import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import QuickActionsImproved from "../../daniTutorChat/components/QuickActionsImproved";

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
});
