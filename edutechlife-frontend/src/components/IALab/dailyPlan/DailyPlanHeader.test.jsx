import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import DailyPlanHeader from "./DailyPlanHeader";

const t = (k, p) => {
  if (k === "ialab.next_step.progress")
    return `Paso ${p?.current} de ${p?.total}`;
  return k;
};

describe("DailyPlanHeader (CTA único)", () => {
  it("muestra 'Siguiente paso', el contador y ejecuta la acción", () => {
    const onRun = vi.fn();
    render(
      <DailyPlanHeader
        t={t}
        step={{
          id: "start",
          type: "content",
          titleKey: "ialab.start_cta_label",
          descriptionKey: "ialab.start_cta_desc",
          actionLabelKey: "ialab.start_cta_btn",
        }}
        currentIndex={0}
        total={3}
        onRun={onRun}
      />,
    );
    expect(screen.getByText(/Paso 1 de 3/)).toBeInTheDocument();
    expect(screen.getByText("ialab.start_cta_label")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it("en riesgo resalta el paso", () => {
    const { container } = render(
      <DailyPlanHeader
        t={t}
        step={{
          id: "streak",
          type: "streak",
          titleKey: "ialab.streak_risk_title",
          actionLabelKey: "ialab.streak_risk_cta",
        }}
        currentIndex={0}
        total={2}
        atRisk
        onRun={() => {}}
      />,
    );
    expect(screen.getByText("ialab.streak_risk_title")).toBeInTheDocument();
    expect(container.querySelector(".bg-amber-50\\/60")).toBeInTheDocument();
  });
});
