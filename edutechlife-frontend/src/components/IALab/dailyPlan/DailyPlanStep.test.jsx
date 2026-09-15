import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return { motion: new Proxy({}, { get: () => passthrough }) };
});
vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import DailyPlanStep from "./DailyPlanStep";

const t = (k) => k;

describe("DailyPlanStep", () => {
  it("challenge: muestra 'Hecho' y completa con XP", () => {
    const onComplete = vi.fn();
    render(
      <DailyPlanStep
        t={t}
        index={0}
        onComplete={onComplete}
        onAction={() => {}}
        item={{
          id: "dc-1",
          type: "challenge",
          icon: "fa-star",
          titleKey: "ialab.daily_plan.title",
          descriptionKey: "ialab.daily_plan.empty_desc",
          xpReward: 20,
        }}
      />,
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onComplete).toHaveBeenCalledWith("dc-1", 20);
  });

  it("recomendación: usa el label de acción y llama onAction", () => {
    const onAction = vi.fn();
    render(
      <DailyPlanStep
        t={t}
        index={1}
        onComplete={() => {}}
        onAction={onAction}
        item={{
          id: "rec-1",
          type: "recommendation",
          urgency: "high",
          title: "Refuerza prompts",
          description: "Practica el módulo 1",
          action: { label: "Ir", moduleId: 1 },
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Refuerza prompts")).toBeInTheDocument();
  });
});
