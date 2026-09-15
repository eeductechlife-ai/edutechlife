import { describe, it, expect } from "vitest";
import {
  AUTO_TAB_MODULES,
  shouldAutoOpenActivities,
} from "../utils/autoTab";

describe("shouldAutoOpenActivities — tab inteligente", () => {
  it("M2/M3/M4 abren en Inicio (no redirige a Actividades)", () => {
    for (const moduleId of [2, 3, 4]) {
      expect(
        shouldAutoOpenActivities({
          moduleId,
          resourcesCompleted: true,
          exam: false,
        }),
      ).toBe(false);
    }
    expect(AUTO_TAB_MODULES).not.toContain(2);
    expect(AUTO_TAB_MODULES).not.toContain(3);
    expect(AUTO_TAB_MODULES).not.toContain(4);
  });

  it("redirige solo en módulos permitidos con contenido completo y examen pendiente", () => {
    for (const moduleId of AUTO_TAB_MODULES) {
      expect(
        shouldAutoOpenActivities({
          moduleId,
          resourcesCompleted: true,
          exam: false,
        }),
      ).toBe(true);
    }
  });

  it("no redirige si el examen ya está hecho o el contenido no está completo", () => {
    expect(
      shouldAutoOpenActivities({
        moduleId: 1,
        resourcesCompleted: true,
        exam: true,
      }),
    ).toBe(false);
    expect(
      shouldAutoOpenActivities({
        moduleId: 1,
        resourcesCompleted: false,
        exam: false,
      }),
    ).toBe(false);
  });
});
