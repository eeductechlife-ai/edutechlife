import { describe, it, expect } from "vitest";
import { OVA_CATALOG, MODULE_NAMES } from "../ova/ovaData.js";
import { getActiveOvas, MODULE_PRINCIPLES } from "../constants/ovaNaming.js";

describe("Catálogo de OVA y módulos", () => {
  it("todo OVA activo está en el catálogo con nombre y módulo correctos", () => {
    for (const ova of getActiveOvas()) {
      const entry = OVA_CATALOG.find((o) => o.id === ova.resourceId);
      expect(entry, `falta en catálogo: ${ova.resourceId}`).toBeTruthy();
      expect(entry.title).toBe(ova.name.es);
      expect(entry.module).toBe(ova.module);
      expect(entry.component).toBe(ova.component);
    }
  });

  it("M3 y M5 declaran su rol narrativo", () => {
    expect(MODULE_NAMES[3].es).toContain("Detective");
    expect(MODULE_NAMES[5].es).toContain("Guardián");
  });

  it("cada módulo del catálogo usa su nombre de rol", () => {
    for (const m of [1, 2, 3, 4, 5]) {
      expect(MODULE_NAMES[m].es).toContain(MODULE_PRINCIPLES[m].role.es);
    }
  });
});
