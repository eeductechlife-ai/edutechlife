import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import DaniAvatar from "../../daniTutorChat/components/DaniAvatar";
import { tutorAvatars } from "../../../../data/tutorAvatars";

describe("DaniAvatar", () => {
  test("renders an image with Dani alt text", () => {
    render(<DaniAvatar />);
    expect(screen.getByAltText("Dani")).toBeInTheDocument();
  });

  test("uses the Dani avatar URL from tutorAvatars", () => {
    render(<DaniAvatar />);
    expect(screen.getByAltText("Dani")).toHaveAttribute(
      "src",
      tutorAvatars.Dani,
    );
  });
});
