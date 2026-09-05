import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import DaniAvatar from "../../daniTutorChat/components/DaniAvatar";

describe("DaniAvatar", () => {
  test("renders the Dani avatar SVG", () => {
    const { container } = render(<DaniAvatar />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("renders the avatar for every age-based style", () => {
    [8, 10, 16].forEach((studentAge) => {
      const { container } = render(<DaniAvatar studentAge={studentAge} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
