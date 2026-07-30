import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders with default props", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild;
    expect(el).toBeTruthy();
    // Default is shimmer=true → skeleton-shimmer class; without shimmer it
    // falls back to animate-pulse (tested below).
    expect(el.className).toContain("skeleton-shimmer");
    expect(el.className).toContain("rounded-lg");
  });

  it("falls back to animate-pulse when shimmer is disabled", () => {
    const { container } = render(<Skeleton shimmer={false} />);
    expect(container.firstChild.className).toContain("animate-pulse");
  });

  it("applies custom width and height", () => {
    const { container } = render(<Skeleton width="200px" height="100px" />);
    const el = container.firstChild;
    expect(el.style.width).toBe("200px");
    expect(el.style.height).toBe("100px");
  });

  it("applies rounded variant", () => {
    const { container } = render(<Skeleton rounded="full" />);
    expect(container.firstChild.className).toContain("rounded-full");
  });
});
