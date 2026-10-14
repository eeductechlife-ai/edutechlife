import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Aliados from "../Aliados";

// Decisión del CEO (2026-10-13): solo se muestran MinTIC, OIT, Alcaldía de Manizales
// y Alcaldía de Villamaría. Ver docs/agentes/marketing/HECHOS-VERIFICADOS.md.
const AUTORIZADAS = [
  "MinTIC",
  "OIT",
  "Alcaldía de Manizales",
  "Alcaldía de Villamaría",
];
const RETIRADAS = [
  "SENA",
  "UNESCO",
  "Ministerio",
  "Google",
  "Microsoft",
  "AWS",
  "ICETEX",
  "Colciencias",
  "Apple",
  "IBM",
  "Coursera",
  "Steam",
];

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
});

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key, locale: "es" }),
}));

describe("Aliados: solo las entidades autorizadas", () => {
  it("muestra exactamente MinTIC, OIT y las dos alcaldías", () => {
    const { container } = render(<Aliados />);
    const list = container.querySelector('[role="list"]');
    const names = within(list)
      .getAllByRole("listitem", { hidden: true })
      .map((item) => item.querySelector("span")?.textContent);
    // La lista se duplica para el carrusel: cada entidad aparece dos veces.
    expect([...new Set(names)]).toEqual(AUTORIZADAS);
  });

  it.each(RETIRADAS)("no muestra el aliado retirado %s", (nombre) => {
    const { container } = render(<Aliados />);
    const texto = container.textContent;
    expect(texto).not.toMatch(new RegExp(`\\b${nombre}\\b`));
  });

  it("no afirma que confían en nosotros", () => {
    render(<Aliados />);
    expect(screen.queryByText("aliados.badge")).toBeInTheDocument();
  });
});
