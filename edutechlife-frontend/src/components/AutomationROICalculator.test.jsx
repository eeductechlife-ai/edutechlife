import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { calcularROI } from "../utils/roiCalculator";

vi.mock("../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));
vi.mock("./ingenia/IngenIATilt3D", () => ({
  default: ({ children }) => children,
}));

import AutomationROICalculator from "./AutomationROICalculator";

const DEFAULTS = {
  ingresos: 500000,
  costosOperativos: 40000,
  empleados: 50,
  horasManuales: 25,
  eficiencia: 40,
};

describe("calcularROI", () => {
  it("payback va en meses (años x 12) y las cifras cuadran", () => {
    const r = calcularROI(DEFAULTS);
    expect(r.costoActual).toBe(480000);
    expect(r.costoFuturo).toBe(364800);
    expect(r.ahorroAnual).toBe(r.costoActual - r.costoFuturo);
    expect(r.inversion).toBe(75000);
    expect(r.payback).toBe(7.8);
    expect(r.roi).toBe(0.5);
  });
});

describe("AutomationROICalculator", () => {
  it("no antepone $ a ROI ni payback y formatea importes en COP", () => {
    const { container } = render(<AutomationROICalculator />);
    const text = container.textContent;
    expect(text).toContain("0,5x");
    expect(text).toContain("7,8");
    expect(text).not.toMatch(/\$\s?0[.,]2/);
    expect(text).not.toMatch(/\$\s?4[.,]8/);
    expect(text).toMatch(/115\.200/);
    expect(text).toMatch(/364\.800/);
    expect(screen.getAllByText(/COP|\$/).length).toBeGreaterThan(0);
  });
});
