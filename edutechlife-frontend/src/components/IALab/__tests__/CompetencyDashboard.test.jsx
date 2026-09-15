import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement("div", { className: props.className }, children);
  return { motion: new Proxy({}, { get: () => passthrough }), useReducedMotion: () => true };
});
vi.mock("../../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => React.createElement("span", { "data-icon": name }),
}));

import CompetencyDashboard from "../CompetencyDashboard";

const t = (k, p) => {
  if (k === "ialab.competency.module_label") return `Módulo ${p?.n}`;
  if (k === "ialab.competency.overall_value") return `${p?.avg}%`;
  return k;
};

const modules = [
  { id: 1, score: 40 },
  { id: 2, score: 90 },
  { id: 3, score: 60 },
];

describe("CompetencyDashboard (Fase 6)", () => {
  it("muestra el nivel global y el promedio", () => {
    render(<CompetencyDashboard t={t} modules={modules} />);
    expect(screen.getByTestId("competency-dashboard")).toBeInTheDocument();
    expect(screen.getByText("ialab.competency.title")).toBeInTheDocument();
    expect(
      screen.getAllByText("ialab.competency.level_creator").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("63%")).toBeInTheDocument();
  });

  it("lista un barra por módulo con su nivel", () => {
    render(<CompetencyDashboard t={t} modules={modules} />);
    expect(screen.getAllByText("Módulo 1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Módulo 2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Módulo 3").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ialab.competency.level_/).length).toBeGreaterThanOrEqual(3);
  });

  it("sin módulos muestra el estado vacío", () => {
    render(<CompetencyDashboard t={t} modules={[]} />);
    expect(screen.getByText("ialab.competency.empty")).toBeInTheDocument();
  });
});
