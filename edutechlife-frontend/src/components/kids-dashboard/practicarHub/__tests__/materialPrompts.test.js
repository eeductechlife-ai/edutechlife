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
      subtitulo: "",
      conclusion: "",
      ramas: [
        {
          idea: "Numerador",
          emoji: "💡",
          detalles: ["Arriba"],
          curiosidad: "",
        },
      ],
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

  it("keeps the 'datos' format only when every block has a number", () => {
    const bloques = [
      { titulo: "Agua", texto: "Cubre la Tierra", cifra: "71%" },
      { titulo: "Dulce", texto: "Se puede beber", cifra: 3 },
    ];
    const out = parseMaterial("infografia", { formato: "datos", bloques });
    expect(out.formato).toBe("datos");
    expect(out.bloques[1].cifra).toBe("3");

    const half = parseMaterial("infografia", {
      formato: "datos",
      bloques: [bloques[0], { titulo: "Hielo", texto: "En los polos" }],
    });
    expect(half.formato).toBe("pasos");
    expect(half.bloques[0]).not.toHaveProperty("cifra");
  });

  it("builds comparisons and falls back to steps when a side is missing", () => {
    const comparacion = {
      izquierda: { titulo: "Vertebrados", puntos: ["Tienen columna"] },
      derecha: { titulo: "Invertebrados", emoji: "🐛", puntos: ["Sin huesos"] },
      semejanzas: ["Son animales", ""],
    };
    const out = parseMaterial("infografia", {
      formato: "comparacion",
      titulo: "Animales",
      comparacion,
    });
    expect(out.formato).toBe("comparacion");
    expect(out.comparacion.izquierda.emoji).toBe("🔹");
    expect(out.comparacion.semejanzas).toEqual(["Son animales"]);

    const broken = parseMaterial("infografia", {
      formato: "comparacion",
      comparacion: { izquierda: comparacion.izquierda },
      bloques: [{ titulo: "Idea", texto: "Texto" }],
    });
    expect(broken.formato).toBe("pasos");
    expect(
      parseMaterial("infografia", {
        formato: "comparacion",
        comparacion: { izquierda: comparacion.izquierda },
      }),
    ).toBeNull();
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

describe("parseMaterial with accented keys", () => {
  it("reads video searches when the model writes «búsquedas»", () => {
    const raw =
      '{"búsquedas":[{"texto":"fotosíntesis fácil","aprenderás":"qué es"}]}';
    expect(parseMaterial("video", raw)).toEqual({
      busquedas: [{ texto: "fotosíntesis fácil", aprenderas: "qué es" }],
    });
  });

  it("keeps the year of a timeline written as «año»", () => {
    const out = parseMaterial("infografia", {
      título: "Independencia",
      formato: "cronologia",
      eventos: [{ año: "1810", hecho: "Grito de independencia" }],
    });
    expect(out.titulo).toBe("Independencia");
    expect(out.bloques[0]).toMatchObject({ titulo: "1810", cifra: "1810" });
  });
});
