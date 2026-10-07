import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AcademicSemaphore from "../AcademicSemaphore";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, initial, animate, transition, whileTap, ...rest }) =>
            React.createElement(tag, rest, children),
      },
    ),
  };
});

describe("AcademicSemaphore", () => {
  it("shows a grade with one decimal, never the raw average", () => {
    render(
      <AcademicSemaphore gradeMap={{ matematicas: 3.0666666666666664 }} />,
    );
    expect(screen.getByText("Nota: 3.1")).toBeInTheDocument();
    expect(screen.queryByText(/3\.0666/)).not.toBeInTheDocument();
  });

  it("shows mastery as a whole percentage when it is available", () => {
    render(<AcademicSemaphore masteryBySubject={{ matematicas: 0.4166 }} />);
    expect(screen.getByText("42%")).toBeInTheDocument();
  });
});
