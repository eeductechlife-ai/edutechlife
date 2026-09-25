import { describe, it, expect, vi } from "vitest";

vi.mock("../../lib/analytics", () => ({ track: vi.fn() }));

import { rewardKind } from "../useIngenIAActions";

describe("rewardKind", () => {
  it("gives each reward its own prize, whatever its id", () => {
    // Local list ids: Primer Paso 0, Explorador 1, Tema Oscuro 2, Avatar 3…
    expect(rewardKind({ id: 2, name: "Tema Oscuro" })).toBe("dark");
    expect(rewardKind({ id: 3, name: "Avatar Dani Animado" })).toBe("avatar");
    expect(rewardKind({ id: 4, name: "Fondo Galaxia" })).toBe("galaxy");
    expect(rewardKind({ id: 5, name: "Día Libre" })).toBe("dayoff");
    expect(rewardKind({ id: 6, name: "Curso IA Básico" })).toBe("course");
    expect(rewardKind({ id: 7, name: "Certificado VAK" })).toBe("certificate");
  });

  it("gives no special effect to plain badges", () => {
    expect(rewardKind({ id: 1, name: "Explorador Digital" })).toBeNull();
    expect(rewardKind({ id: 0, name: "Primer Paso" })).toBeNull();
    expect(rewardKind(null)).toBeNull();
  });
});
