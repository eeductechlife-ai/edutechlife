import { describe, it, expect } from "vitest";
import {
  VALENTINA_MESSAGES,
  idleNudge,
  joinOptions,
  questionOpener,
} from "../../../utils/valentinaMessages";

const { readQuestion, resultsShort } = VALENTINA_MESSAGES.all;

const options = [
  { text: "Ver un video del volcán" },
  { text: "Escuchar al profe contarlo" },
  { text: "Armar una maqueta." },
];
const kid = { name: "Sofía Pérez", age: 8, mood: "happy", total: 20 };
const teen = { name: "Juan", age: 14, mood: "happy", total: 20 };

describe("Valeria lee las preguntas como en una charla", () => {
  it("nunca dice el número de la pregunta ni cuántas faltan", () => {
    for (const who of [kid, teen]) {
      for (let index = 0; index < 20; index++) {
        const spoken = readQuestion("¿Qué te ayuda más?", options, {
          ...who,
          index,
        });
        expect(spoken).not.toMatch(/\d/);
        expect(spoken).not.toMatch(/pregunta/i);
      }
    }
  });

  it("dice cada opción en su propia frase, unidas con «o»", () => {
    expect(joinOptions(options)).toBe(
      "Ver un video del volcán. O escuchar al profe contarlo. O armar una maqueta.",
    );
  });

  it("no se enreda con opciones que ya traen comas o comillas", () => {
    expect(
      joinOptions([
        { text: "Escribo mucho a mano; eso me ayuda a recordar" },
        { text: "Con colores, flechas y dibujos" },
        { text: "Armar una maqueta y hacerla «erupcionar»" },
      ]),
    ).toBe(
      "Escribo mucho a mano; eso me ayuda a recordar. O con colores, flechas y dibujos. O armar una maqueta y hacerla erupcionar.",
    );
  });

  it("se presenta y saluda por el nombre de pila en la primera", () => {
    const hello = questionOpener({ ...kid, index: 0 });
    expect(hello).toMatch(/^¡Hola, Sofía! Soy Valeria\./);
    expect(hello).not.toContain("Pérez");
    expect(hello).toMatch(/no hay respuestas buenas ni malas/i);
  });

  it("habla distinto a un niño pequeño y a un adolescente", () => {
    expect(questionOpener({ ...kid, index: 0 })).not.toBe(
      questionOpener({ ...teen, index: 0 }).replace("Juan", "Sofía"),
    );
    expect(questionOpener({ ...teen, index: 0 })).toMatch(
      /No hay respuestas correctas/,
    );
  });

  it("usa el nombre de vez en cuando, no en cada pregunta", () => {
    const openers = Array.from({ length: 18 }, (_, i) =>
      questionOpener({ ...kid, index: i + 1 }),
    );
    const withName = openers.filter((o) => o.includes("Sofía")).length;
    expect(withName).toBeGreaterThan(0);
    expect(withName).toBeLessThanOrEqual(5);
  });

  it("anima a la mitad y avisa la última, sin números", () => {
    expect(questionOpener({ ...kid, index: 10 })).toMatch(/por la mitad/);
    expect(questionOpener({ ...kid, index: 19 })).toBe("Y la última, Sofía.");
    expect(questionOpener({ ...teen, index: 19 })).toBe("Y la última.");
  });

  it("si no se siente bien, va más despacio y ofrece una pausa", () => {
    const sad = { ...kid, mood: "sad" };
    expect(questionOpener({ ...sad, index: 0 })).toMatch(/con calma, sin afán/);
    expect(questionOpener({ ...sad, index: 10 })).toMatch(/pausa/);
  });

  it("no repite la misma transición en preguntas seguidas", () => {
    const middle = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) =>
      questionOpener({ ...teen, index }),
    );
    middle.slice(1).forEach((o, i) => expect(o).not.toBe(middle[i]));
  });

  it("a los más pequeños les dice la letra de cada opción, como en los botones", () => {
    const spoken = readQuestion("¿Qué te gusta más?", options, {
      ...kid,
      index: 2,
    });
    expect(spoken).toContain(
      "A: ver un video del volcán. B: escuchar al profe contarlo. C: armar una maqueta.",
    );
    expect(
      readQuestion("¿Qué te gusta más?", options, {
        ...kid,
        age: 10,
        index: 2,
      }),
    ).not.toMatch(/\bA:/);
  });

  it("en la primera avisa que va a leer las opciones", () => {
    expect(
      readQuestion("¿Qué haces?", options, { ...teen, index: 0 }),
    ).toContain("¿Qué haces? Te leo las opciones. Ver un video");
    expect(
      readQuestion("¿Qué haces?", options, { ...teen, index: 3 }),
    ).not.toContain("Te leo las opciones");
  });

  it("si responde muy rápido, le pide un momento sin regañar", () => {
    const o = questionOpener({ ...kid, index: 4, slowDown: true });
    expect(o).toMatch(/^¡Vas rapidísimo! Tómate un momento/);
    expect(questionOpener({ ...teen, index: 10, slowDown: true })).toMatch(
      /^Vas rápido\. .*por la mitad/,
    );
  });

  it("si se queda quieto, ofrece repetir sin presión", () => {
    expect(idleNudge(8, "Sofía López")).toBe(
      "Tómate tu tiempo, Sofía, no hay afán. Si quieres que te la repita, toca Escuchar.",
    );
    expect(idleNudge(14, "Juan")).toMatch(/^Sin afán\./);
  });

  it("reacciona a volver atrás, retomar y pedir que repita", () => {
    expect(questionOpener({ ...kid, index: 4, mode: "back" })).toMatch(
      /puedes cambiar tu respuesta/,
    );
    expect(questionOpener({ ...kid, index: 7, mode: "resume" })).toBe(
      "¡Qué bueno que volviste, Sofía! Seguimos donde íbamos.",
    );
    expect(questionOpener({ ...kid, index: 4, mode: "repeat" })).toBe(
      "Claro, te la repito.",
    );
    expect(
      readQuestion("¿Qué haces?", options, { ...kid, index: 4, mode: "plain" }),
    ).toMatch(/^¿Qué haces\?/);
  });

  it("no felicita respuestas ni dice que finge ser persona", () => {
    for (const who of [kid, teen]) {
      for (let index = 0; index < 20; index++) {
        const o = questionOpener({ ...who, index });
        expect(o).not.toMatch(/correcta!|bien hecho|excelente respuesta/i);
        expect(o).not.toMatch(/a mí también|yo también|cuando yo era/i);
      }
    }
  });
});

describe("cierre de Valeria", () => {
  it("nombra las dos formas cuando el perfil es mixto", () => {
    const text = resultsShort("Sofía", "kinestesico", "visual", { age: 8 });
    expect(text).toContain("aprendes bien haciendo y también viendo");
    expect(text).toMatch(/^¡Lo lograste, Sofía!/);
  });

  it("con un solo estilo dice cuál se le da más hoy", () => {
    expect(resultsShort("Ana", "auditivo", null, { age: 14 })).toContain(
      "hoy se te da más aprender escuchando",
    );
  });

  it("si no se sentía bien, se lo agradece y recuerda a un adulto de confianza", () => {
    expect(
      resultsShort("Ana", "visual", null, { age: 9, mood: "sad" }),
    ).toMatch(/adulto de confianza/);
  });

  it("sin nombre no usa un saludo con género", () => {
    expect(resultsShort("", "visual", null, { age: 8 })).toMatch(
      /^¡Lo lograste! /,
    );
  });

  it("no lo presenta como diagnóstico", () => {
    expect(resultsShort("Ana", "visual")).not.toMatch(
      /diagn[oó]stico|psic[oó]log/i,
    );
  });
});
