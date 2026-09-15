import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: () => ({ children, ...props }) =>
        React.createElement("div", props, children),
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

vi.mock("../../../../utils/iconMapping.jsx", () => ({
  Icon: () => React.createElement("span", { "data-testid": "icon" }),
}));

import StepFeedback from "./StepFeedback";

const t = (k) => k;

describe("StepFeedback", () => {
  it("muestra los requisitos pasados por prop", () => {
    render(
      <StepFeedback
        completed={1}
        total={2}
        requirements={[
          { id: "a", label: "Requisito A", met: true },
          { id: "b", label: "Requisito B", met: false },
        ]}
        t={t}
      />,
    );
    expect(screen.getByText("Requisito A")).toBeInTheDocument();
    expect(screen.getByText("Requisito B")).toBeInTheDocument();
  });

  it("sin requirements no renderiza la lista (retrocompatible)", () => {
    const { container } = render(<StepFeedback completed={1} total={2} t={t} />);
    expect(container.querySelectorAll("li").length).toBe(0);
  });
});
