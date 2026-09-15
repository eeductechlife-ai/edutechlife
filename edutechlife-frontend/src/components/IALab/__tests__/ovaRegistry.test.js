import { describe, it, expect } from "vitest";
import { OVA_COMPONENTS } from "../ResourceViewerModal/ovaComponents.jsx";
import { getActiveOvas } from "../constants/ovaNaming.js";

describe("Registro de render de OVA", () => {
  it("todo OVA activo tiene componente registrado", () => {
    for (const ova of getActiveOvas()) {
      expect(OVA_COMPONENTS[ova.resourceId], `sin render: ${ova.resourceId}`).toBeTruthy();
    }
  });

  it("no hay mapeos muertos (ids sin OVA activo)", () => {
    const valid = new Set(getActiveOvas().map((o) => o.resourceId));
    const dead = Object.keys(OVA_COMPONENTS).filter((k) => !valid.has(k));
    expect(dead).toEqual([]);
  });
});
