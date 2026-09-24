import { describe, it, expect } from "vitest";
import {
  parseMaterial,
  gradeTopics,
  buildMaterialRequest,
} from "../materialPrompts";

describe("parseMaterial", () => {
  it("keeps markdown summaries and rejects empty ones", () => {
    expect(parseMaterial("resumen", "## Hola\n**x**")).toEqual({
      text: "## Hola\n**x**",
    });
    expect(parseMaterial("resumen", "   ")).toBeNull();
  });

  it("accepts JSON wrapped in extra text", () => {
    const raw =
      'Aquí va: {"ramas":[{"idea":"Numerador","detalles":["Arriba"]}],"centro":"Fracciones"} ¡listo!';
    expect(parseMaterial("mapa", raw)).toEqual({
      centro: "Fracciones",
      ramas: [{ idea: "Numerador", emoji: "💡", detalles: ["Arriba"] }],
    });
  });

  it("drops exercises without a question or answer", () => {
    const out = parseMaterial("ejercicios", {
      ejercicios: [
        { pregunta: "2+2", respuesta: 4 },
        { pregunta: "", respuesta: "x" },
        { pregunta: "sin respuesta" },
      ],
    });
    expect(out.ejercicios).toEqual([
      { pregunta: "2+2", pista: "", respuesta: "4", explicacion: "" },
    ]);
  });

  it("builds infographics and skips empty blocks", () => {
    const out = parseMaterial("infografia", {
      titulo: "Fracciones",
      bloques: [
        { emoji: "🍕", titulo: "¿Qué son?", texto: "Partes de un todo" },
        { titulo: "Sin texto" },
      ],
      dato: "Los egipcios ya las usaban",
    });
    expect(out.bloques).toHaveLength(1);
    expect(out.dato).toBe("Los egipcios ya las usaban");
    expect(parseMaterial("infografia", { bloques: [] })).toBeNull();
  });

  it("returns null for unusable output", () => {
    expect(parseMaterial("video", "no es json")).toBeNull();
    expect(parseMaterial("video", { busquedas: [] })).toBeNull();
    expect(parseMaterial("mapa", { ramas: [{ idea: "" }] })).toBeNull();
  });
});

describe("gradeTopics", () => {
  it("returns MEN DBA topics for the student's grade", () => {
    expect(gradeTopics("matematicas", 1)[0]).toMatch(/números/i);
  });

  it("maps historia to the sociales curriculum", () => {
    expect(gradeTopics("historia", 5).length).toBeGreaterThan(0);
  });

  it("returns nothing when the grade is unknown", () => {
    expect(gradeTopics("matematicas", null)).toEqual([]);
  });
});

describe("buildMaterialRequest", () => {
  it("asks for JSON only for structured types", () => {
    const base = {
      subjectLabel: "Matemáticas",
      topic: "Fracciones",
      gradeLabel: "grado 5°",
      age: 10,
    };
    expect(buildMaterialRequest("resumen", base).isJson).toBe(false);
    expect(buildMaterialRequest("ejercicios", base).isJson).toBe(true);
    expect(buildMaterialRequest("mapa", base).messages[1].content).toContain(
      "Fracciones",
    );
  });
});
