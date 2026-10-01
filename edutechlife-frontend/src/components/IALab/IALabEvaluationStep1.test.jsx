import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import es from "../../i18n/es.json";
import IALabEvaluationStep1 from "./IALabEvaluationStep1";

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => es[key] ?? key }),
}));
vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: () => React.createElement("span"),
}));

const EXERCISE =
  "Eres un consultor experto en retail con 10 años de experiencia. " +
  "Trabajas para una cadena regional que enfrenta una caída del 15% en ventas. " +
  "Tu tarea es diseñar una estrategia omnicanal para crecer un 20% en 6 meses. " +
  "Identifica en este escenario: Rol, Contexto y Tarea.";

const setup = () => {
  const onResponseChange = vi.fn();
  render(
    <IALabEvaluationStep1
      exercise={EXERCISE}
      response=""
      onResponseChange={onResponseChange}
    />,
  );
  return onResponseChange;
};

describe("IALabEvaluationStep1 — clasificar Rol/Contexto/Tarea", () => {
  it("no agrupa las frases por categoría (no revela la respuesta)", () => {
    setup();
    expect(
      screen.queryByRole("heading", { level: 5, name: /rol|contexto|tarea/i }),
    ).not.toBeInTheDocument();
  });

  it("excluye la consigna del pool y mantiene las frases reales", () => {
    setup();
    expect(
      screen.queryByText(/^Identifica en este escenario/),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByText(/Eres un consultor experto en retail/)[0],
    ).toBeInTheDocument();
  });

  it("muestra cada frase una sola vez", () => {
    setup();
    const tiles = screen.getAllByRole("button", { expanded: false });
    const texts = tiles.map((b) => b.textContent.trim());
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("permite elegir la categoría de una frase y guarda la respuesta", () => {
    const onResponseChange = setup();
    const tile = screen
      .getAllByRole("button", { expanded: false })
      .find((b) => /estrategia omnicanal/.test(b.textContent));
    fireEvent.click(tile);
    const group = screen.getByRole("group", {
      name: es["ialab.evaluation.step1.pick_category"],
    });
    fireEvent.click(
      within(group).getByRole("button", {
        name: es["ialab.evaluation.step1.task"],
      }),
    );
    const saved = JSON.parse(onResponseChange.mock.calls.at(-1)[0]);
    expect(saved.tarea).toMatch(/estrategia omnicanal/);
    expect(saved.rol).toBe("");
    expect(saved.contexto).toBe("");
  });

  it("descarta selecciones de un borrador que no están en el escenario actual", () => {
    const onResponseChange = vi.fn();
    render(
      <IALabEvaluationStep1
        exercise={EXERCISE}
        response={JSON.stringify({ rol: "Frase vieja", contexto: "", tarea: "Otra vieja" })}
        onResponseChange={onResponseChange}
      />,
    );
    const saved = JSON.parse(onResponseChange.mock.calls.at(-1)[0]);
    expect(saved).toEqual({ rol: "", contexto: "", tarea: "" });
  });
});
