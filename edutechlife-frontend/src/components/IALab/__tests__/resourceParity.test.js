import { describe, test, expect } from "vitest";
import { RESOURCES_ES } from "../constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../constants/moduleResources/resourcesEn.js";
import { RESOURCES_PT } from "../constants/moduleResources/resourcesPt.js";

// Los tres idiomas deben tener la misma estructura: los mismos temas en el mismo orden,
// y por cada tema la misma secuencia de tipos (video, pdf, ova_interactive, image).
// Así un idioma no puede quedarse con un recurso menos sin que la suite lo note.
const shape = (catalog) =>
  Object.entries(catalog).map(([topic, group]) => ({
    topic,
    types: (group.resources || []).map((r) => r.type),
  }));

describe("paridad de estructura entre idiomas", () => {
  const es = shape(RESOURCES_ES);
  const en = shape(RESOURCES_EN);
  const pt = shape(RESOURCES_PT);

  test("mismo número de temas en es, en y pt", () => {
    expect(en.length).toBe(es.length);
    expect(pt.length).toBe(es.length);
  });

  test("cada tema tiene la misma secuencia de tipos de recurso", () => {
    const diffs = [];
    es.forEach((t, i) => {
      if (JSON.stringify(en[i]?.types) !== JSON.stringify(t.types)) {
        diffs.push(`en tema ${i + 1}: ${JSON.stringify(en[i]?.types)} ≠ es ${JSON.stringify(t.types)}`);
      }
      if (JSON.stringify(pt[i]?.types) !== JSON.stringify(t.types)) {
        diffs.push(`pt tema ${i + 1}: ${JSON.stringify(pt[i]?.types)} ≠ es ${JSON.stringify(t.types)}`);
      }
    });
    expect(diffs).toEqual([]);
  });

  test("cada tema tiene al menos un recurso", () => {
    const vacios = [...es, ...en, ...pt].filter((t) => t.types.length === 0);
    expect(vacios.map((t) => t.topic)).toEqual([]);
  });
});
