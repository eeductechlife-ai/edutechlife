import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const { isStepResponseComplete } = await import("./EvaluationContent.jsx");

const cls = (rol, contexto, tarea) => JSON.stringify({ rol, contexto, tarea });

describe("isStepResponseComplete", () => {
  it("vacío no permite avanzar", () => {
    expect(isStepResponseComplete("", 1, 1)).toBe(false);
    expect(isStepResponseComplete(undefined, 2, 1)).toBe(false);
  });

  it("clasificación exige las tres categorías", () => {
    expect(isStepResponseComplete(cls("a", "b", ""), 1, 1)).toBe(false);
    expect(isStepResponseComplete(cls("a", "b", "c"), 1, 1)).toBe(true);
  });

  it("redacción del módulo 1 exige al menos 30 caracteres", () => {
    expect(isStepResponseComplete("x", 1, 2)).toBe(false);
    expect(
      isStepResponseComplete(
        "Actúa como experto en ventas y crea un plan de 5 pasos",
        1,
        2,
      ),
    ).toBe(true);
  });

  it("otros módulos conservan el comportamiento anterior", () => {
    expect(isStepResponseComplete("x", 3, 2)).toBe(true);
  });
});
