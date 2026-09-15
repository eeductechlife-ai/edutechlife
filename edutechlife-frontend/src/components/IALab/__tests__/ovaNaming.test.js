import { describe, it, expect } from "vitest";
import {
  OVA_REGISTRY,
  MODULE_PRINCIPLES,
  METHODOLOGY_PRINCIPLES,
} from "../constants/ovaNaming.js";

const CODE_RE = /^ILAB-M[1-5]-OVA\d+$/;

describe("Registro canónico de OVA", () => {
  it("cada OVA tiene código, nombre, descriptor y principio", () => {
    for (const o of OVA_REGISTRY) {
      expect(o.code).toMatch(CODE_RE);
      expect(o.name.es?.length).toBeGreaterThan(0);
      expect(o.name.en?.length).toBeGreaterThan(0);
      expect(o.name.pt?.length).toBeGreaterThan(0);
      expect(o.descriptor.es?.length).toBeGreaterThan(0);
      expect(o.principle?.length).toBeGreaterThan(0);
      expect([1, 2, 3, 4, 5]).toContain(o.module);
    }
  });

  it("no hay códigos ni nombres duplicados", () => {
    const codes = OVA_REGISTRY.map((o) => o.code);
    const names = OVA_REGISTRY.map((o) => o.name.es);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("los OVA activos tienen resourceId; los planificados no", () => {
    for (const o of OVA_REGISTRY) {
      if (o.status === "active") expect(o.resourceId).toBeTruthy();
      if (o.status === "planned") expect(o.resourceId).toBeFalsy();
    }
  });

  it("los resourceId activos son únicos", () => {
    const ids = OVA_REGISTRY.filter((o) => o.resourceId).map((o) => o.resourceId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("los módulos tienen principio", () => {
    for (const m of [1, 2, 3, 4, 5]) {
      expect(MODULE_PRINCIPLES[m]?.principle?.length).toBeGreaterThan(0);
    }
  });

  it("las metodologías tienen nombre y principio", () => {
    expect(METHODOLOGY_PRINCIPLES.length).toBeGreaterThanOrEqual(7);
    for (const m of METHODOLOGY_PRINCIPLES) {
      expect(m.name.es?.length).toBeGreaterThan(0);
      expect(m.principle?.length).toBeGreaterThan(0);
    }
  });
});
