import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return {
    motion: new Proxy({}, { get: () => passthrough }),
  };
});
vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import DailyPlanHeader from "./DailyPlanHeader";

const t = (k, p) =>
  k === "ialab.daily_plan.steps_count" ? `${p?.count ?? ""} pasos` : k;

describe("DailyPlanHeader", () => {
  it("muestra el título y el resumen de pasos, y toggla al clic", () => {
    const onToggle = vi.fn();
    render(
      <DailyPlanHeader
        t={t}
        isOpen={false}
        onToggle={onToggle}
        atRisk={false}
        pendingCount={3}
        firstItemTitle="Revisar prompt"
      />,
    );
    expect(screen.getByText("ialab.daily_plan.title")).toBeInTheDocument();
    expect(screen.getByText(/3 pasos/)).toBeInTheDocument();
    expect(screen.getByTestId("daily-plan-header")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    fireEvent.click(screen.getByTestId("daily-plan-header"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("en riesgo muestra aviso y ping (reduced-motion)", () => {
    const { container } = render(
      <DailyPlanHeader
        t={t}
        isOpen
        onToggle={() => {}}
        atRisk
        pendingCount={2}
      />,
    );
    expect(screen.getByText("ialab.streak_risk_title")).toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).toBeInTheDocument();
    expect(
      container.querySelector(".motion-reduce\\:animate-none"),
    ).toBeInTheDocument();
  });
});
