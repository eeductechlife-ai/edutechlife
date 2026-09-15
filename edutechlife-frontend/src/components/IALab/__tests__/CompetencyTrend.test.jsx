import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const trendRef = { current: [] };
vi.mock("../../../hooks/IALab/useCompetencyHistory", () => ({
  default: () => ({ history: trendRef.current, trend: trendRef.current }),
}));
vi.mock("recharts", () => {
  const passthrough = ({ children }) => React.createElement("div", null, children);
  return {
    ResponsiveContainer: passthrough,
    LineChart: passthrough,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
  };
});
vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import CompetencyTrend from "../CompetencyTrend";

const t = (k) => k;

describe("CompetencyTrend (Fase C)", () => {
  it("no renderiza nada con menos de 2 puntos", () => {
    trendRef.current = [];
    const { container } = render(<CompetencyTrend t={t} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza la sección con 2 o más puntos", () => {
    trendRef.current = [
      { date: "2026-01-01", average: 60 },
      { date: "2026-01-02", average: 75 },
    ];
    render(<CompetencyTrend t={t} />);
    expect(screen.getByTestId("competency-trend")).toBeInTheDocument();
    expect(screen.getByText("ialab.competency.trend_title")).toBeInTheDocument();
  });
});
