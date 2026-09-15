import { describe, it, expect } from "vitest";
import {
  CERT_REQUIREMENTS,
  evaluateCertificateRequirements,
} from "../certificateRequirements.js";

const allPass = { moduleScores: [90, 85, 80, 95, 88], courseProgress: 92, completedModules: [1, 2, 3, 4, 5] };

describe("certificateRequirements (Fase A1 — enforce de certificación)", () => {
  it("expone los requisitos documentados", () => {
    expect(CERT_REQUIREMENTS).toEqual({
      requiredModules: 5,
      moduleMinScore: 80,
      globalMinScore: 80,
    });
  });

  it("es elegible con 5 módulos, 80+ en cada uno y 80+ global", () => {
    const result = evaluateCertificateRequirements(allPass);
    expect(result.eligible).toBe(true);
    expect(result.checks).toEqual({
      fiveModules: true,
      allModulesPassed: true,
      globalProgress: true,
    });
  });

  it("no es elegible si falta algún módulo", () => {
    const result = evaluateCertificateRequirements({
      ...allPass,
      completedModules: [1, 2, 3],
    });
    expect(result.eligible).toBe(false);
    expect(result.checks.fiveModules).toBe(false);
  });

  it("no es elegible si un módulo queda por debajo de 80", () => {
    const result = evaluateCertificateRequirements({
      ...allPass,
      moduleScores: [90, 85, 79, 95, 88],
    });
    expect(result.eligible).toBe(false);
    expect(result.checks.allModulesPassed).toBe(false);
  });

  it("no es elegible si el progreso global es menor a 80", () => {
    const result = evaluateCertificateRequirements({
      ...allPass,
      courseProgress: 75,
    });
    expect(result.eligible).toBe(false);
    expect(result.checks.globalProgress).toBe(false);
  });

  it("es tolerante a entradas vacías o inválidas", () => {
    const result = evaluateCertificateRequirements();
    expect(result.eligible).toBe(false);
    expect(result.scores).toEqual([0, 0, 0, 0, 0]);
    expect(result.globalProgress).toBe(0);
  });
});
