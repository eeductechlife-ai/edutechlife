import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders with default props", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild;
    expect(el).toBeTruthy();
    expect(el.className).toContain("animate-pulse");
    expect(el.className).toContain("rounded-lg");
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
