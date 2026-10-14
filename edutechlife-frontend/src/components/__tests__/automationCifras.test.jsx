import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es" }),
}));
vi.mock("../ingenia/IngenIATilt3D", () => ({
  default: ({ children }) => children,
}));

import AutomationHero from "../AutomationHero";
import * as automationData from "../automationData/index.js";

// Cifras de resultado o de clientes que no tienen fuente verificable
// (docs/agentes/marketing/HECHOS-VERIFICADOS.md). No deben renderizarse.
const CIFRAS_SIN_FUENTE = [
  "+340%",
  "-60%",
  "12+",
  "4.2x",
  "+70%",
  "+180%",
  "+250%",
  "$180K",
  "TechCorp",
  "Clínica Santa María",
];

describe("cifras de Automatización sin respaldo", () => {
  it("la portada no muestra cifras de resultado inventadas", () => {
    const { container } = render(
      <MemoryRouter>
        <AutomationHero onStartDiagnosis={() => {}} onViewCases={() => {}} />
      </MemoryRouter>,
    );
    const text = container.textContent;
    for (const cifra of CIFRAS_SIN_FUENTE) {
      expect(text, `no debe mostrar "${cifra}"`).not.toContain(cifra);
    }
  });

  it("la portada muestra solo el dato de mercado con su fuente", () => {
    const { container } = render(
      <MemoryRouter>
        <AutomationHero onStartDiagnosis={() => {}} onViewCases={() => {}} />
      </MemoryRouter>,
    );
    const text = container.textContent;
    expect(text).toContain("79%");
    expect(text).toContain("McKinsey");
    expect(text).toContain("2025");
  });

  it("no quedan casos de clientes inventados", () => {
    expect(automationData).not.toHaveProperty("getCases");
  });
});
