import { describe, it, expect } from "vitest";
import { pickRecommendation } from "../pickRecommendation";

const subject = (over = {}) => ({
  id: "matematicas",
  label: "Matemáticas",
  retoAvailable: true,
  trend: { dir: "down" },
  score: 3.1,
  ...over,
});

describe("pickRecommendation: el tono depende de la nota para aprobar (3.0)", () => {
  it("does not call a passing grade urgent", () => {
    const r = pickRecommendation([subject({ score: 3.1 })]);
    expect(r.urgent).toBe(false);
    expect(r.why).toMatch(/bajó un poco \(3\.1\)/);
    expect(r.why).not.toMatch(/urgente|salvar|ya mismo/i);
  });

  it("is still urgent below the passing grade, in a calm tone", () => {
    const r = pickRecommendation([subject({ score: 2.8 })]);
    expect(r.urgent).toBe(true);
    expect(r.why).toMatch(/2\.8/);
    expect(r.why).not.toMatch(/urgente|salvar/i);
  });

  it("treats exactly 3.0 as passing", () => {
    expect(pickRecommendation([subject({ score: 3.0 })]).urgent).toBe(false);
  });

  it("does not raise any alarm without a downward trend", () => {
    const r = pickRecommendation([
      subject({ trend: { dir: "flat" }, score: 2.5 }),
    ]);
    expect(r.urgent).toBe(false);
  });

  it("returns null when no subject has challenges available", () => {
    expect(pickRecommendation([subject({ retoAvailable: false })])).toBeNull();
  });
});
