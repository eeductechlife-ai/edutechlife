import { describe, it, expect } from "vitest";
import trainingData from "../../../data/nico-training-data.json";
import { PROMPT_NICO_SOPORTE, TRAINING } from "../nicoPrompts";

describe("Nico training data y prompt (realismo EdutechLife)", () => {
  it("todos los precios del corpus están en COP (pesos colombianos)", () => {
    expect(trainingData.pricing.currency).toContain("COP");
    expect(trainingData.pricing.no_usd).toBe(true);
    for (const plan of trainingData.pricing.plans) {
      expect(plan.price).toContain("COP");
    }
  });

  it("el prompt prohíbe dólares e inventar cifras, y conoce los productos", () => {
    expect(PROMPT_NICO_SOPORTE).toContain("pesos colombianos");
    expect(PROMPT_NICO_SOPORTE).toContain("dólares");
    expect(PROMPT_NICO_SOPORTE).toContain("IALab");
    expect(PROMPT_NICO_SOPORTE).toContain("SmartBoard");
    expect(PROMPT_NICO_SOPORTE).toContain("VAK");
    expect(PROMPT_NICO_SOPORTE).toContain("inventes precios");
  });

  it("el corpus no contiene placeholders de precio ni nombres inventados", () => {
    const raw = JSON.stringify(trainingData);
    expect(raw).not.toContain("$X");
    expect(raw).not.toContain("Juan Pérez");
    expect(raw).not.toContain("premio");
  });

  it("TRAINING expone planes y contacto del corpus", () => {
    expect(TRAINING.plans).toContain("COP");
    expect(TRAINING.contact).toContain("+57 323 836 5517");
  });
});
