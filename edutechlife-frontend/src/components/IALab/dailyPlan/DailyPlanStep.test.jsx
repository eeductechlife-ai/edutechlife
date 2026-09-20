import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import DailyPlanStep from "./DailyPlanStep";

const t = (k) => k;

describe("DailyPlanStep (modo lectura)", () => {
  it("muestra el título y el estado 'Actual' sin botón", () => {
    render(
      <DailyPlanStep
        t={t}
        index={1}
        isCurrent
        step={{
          id: "start",
          type: "content",
          titleKey: "ialab.start_cta_label",
        }}
      />,
    );
    expect(screen.getByText("ialab.start_cta_label")).toBeInTheDocument();
    expect(screen.getByText("ialab.next_step.current")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("marca 'Hecho' cuando el paso está completado", () => {
    render(
      <DailyPlanStep
        t={t}
        index={2}
        isCurrent={false}
        step={{
          id: "dc-1",
          type: "challenge",
          title: "Racha matutina",
          completed: true,
        }}
      />,
    );
    expect(screen.getByText("Racha matutina")).toBeInTheDocument();
    expect(screen.getByText("ialab.daily_plan.done_btn")).toBeInTheDocument();
  });
});
