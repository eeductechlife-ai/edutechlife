import { describe, it, expect } from "vitest";
import { getMasteryLevel } from "../useSkillPassport";

describe("getMasteryLevel", () => {
  it("returns Explorador for low mastery", () => {
    expect(getMasteryLevel(0.1).label).toBe("Explorador");
    expect(getMasteryLevel(0).label).toBe("Explorador");
  });

  it("returns Aprendiz for mid-low mastery", () => {
    expect(getMasteryLevel(0.35).label).toBe("Aprendiz");
  });

  it("returns Practicante for mid mastery", () => {
    expect(getMasteryLevel(0.6).label).toBe("Practicante");
  });

  it("returns Experto for high mastery", () => {
    expect(getMasteryLevel(0.8).label).toBe("Experto");
    expect(getMasteryLevel(1.0).label).toBe("Experto");
  });

  it("each level has emoji and color", () => {
    const level = getMasteryLevel(0.5);
    expect(level).toHaveProperty("emoji");
    expect(level).toHaveProperty("color");
    expect(level.color).toMatch(/^#/);
  });
});
