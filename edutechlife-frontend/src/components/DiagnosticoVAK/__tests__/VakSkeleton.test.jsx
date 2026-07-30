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
    // <Skeleton> emits .skeleton-shimmer by default (see ui/Skeleton).
    const optionRows = container.querySelectorAll(
      ".space-y-4 > div",
    );
    expect(optionRows).toHaveLength(4);
  });

  test("renders shimmer skeleton blocks for progress and question placeholders", () => {
    const { container } = render(<VakSkeleton />);
    const shimmerBlocks = container.querySelectorAll(".skeleton-shimmer");
    // 2 header blocks + 1 progress bar fill + 1 question title
    // + 4 option rows × (icon + line1 + line2) = 2+1+1+12 = 16 shimmers
    expect(shimmerBlocks.length).toBeGreaterThanOrEqual(8);
  });

  test("is a pure presentational component that accepts no props", () => {
    // Passing arbitrary props should not affect the rendered structure.
    const { container: withProps } = render(<VakSkeleton foo="bar" />);
    const { container: withoutProps } = render(<VakSkeleton />);
    expect(withProps.innerHTML).toBe(withoutProps.innerHTML);
  });
});
