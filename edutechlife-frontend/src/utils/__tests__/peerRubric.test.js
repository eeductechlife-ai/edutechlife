import { describe, it, expect } from "vitest";
import {
  DEFAULT_PEER_RUBRIC,
  computePeerScore,
  validatePeerScores,
} from "../peerRubric.js";

const rubric = [
  { id: "clarity", label: "Claridad", weight: 40, max: 4 },
  { id: "depth", label: "Profundidad", weight: 60, max: 4 },
];

describe("peerRubric (Fase B — Peer Review)", () => {
  it("expone una rúbrica por defecto con 4 criterios", () => {
    expect(DEFAULT_PEER_RUBRIC).toHaveLength(4);
    expect(DEFAULT_PEER_RUBRIC.every((c) => c.weight > 0)).toBe(true);
  });

  it("la suma de pesos de la rúbrica por defecto es 100", () => {
    const total = DEFAULT_PEER_RUBRIC.reduce((sum, c) => sum + c.weight, 0);
    expect(total).toBe(100);
  });

  it("calcula 100 cuando todas las notas son máximas", () => {
    expect(computePeerScore({ clarity: 4, depth: 4 }, rubric)).toBe(100);
  });

  it("calcula 50 cuando todas las notas son la mitad", () => {
    expect(computePeerScore({ clarity: 2, depth: 2 }, rubric)).toBe(50);
  });

  it("respeta los pesos por criterio", () => {
    expect(computePeerScore({ clarity: 0, depth: 4 }, rubric)).toBe(60);
  });

  it("clampea valores fuera de rango", () => {
    expect(computePeerScore({ clarity: 99, depth: -5 }, rubric)).toBe(40);
  });

  it("validatePeerScores detecta criterios faltantes", () => {
    expect(validatePeerScores({ clarity: 3 }, rubric)).toEqual({
      valid: false,
      missing: ["depth"],
    });
    expect(validatePeerScores({ clarity: 3, depth: 2 }, rubric)).toEqual({
      valid: true,
      missing: [],
    });
  });
});
