import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import VakSkeleton from "../VakSkeleton";

describe("VakSkeleton", () => {
  test("renders without crashing", () => {
    const { container } = render(<VakSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test("renders four placeholder option rows", () => {
    const { container } = render(<VakSkeleton />);
    const optionRows = container.querySelectorAll(
      ".space-y-4 > .animate-pulse",
    );
    expect(optionRows).toHaveLength(4);
  });

  test("renders pulsing skeleton blocks for progress and question placeholders", () => {
    const { container } = render(<VakSkeleton />);
    const pulseBlocks = container.querySelectorAll(".animate-pulse");
    // 2 header blocks + 1 progress bar fill + 1 question title + 4 option rows = 8
    expect(pulseBlocks.length).toBe(8);
  });

  test("is a pure presentational component that accepts no props", () => {
    // Passing arbitrary props should not affect the rendered structure.
    const { container: withProps } = render(<VakSkeleton foo="bar" />);
    const { container: withoutProps } = render(<VakSkeleton />);
    expect(withProps.innerHTML).toBe(withoutProps.innerHTML);
  });
});
