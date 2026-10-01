import { describe, test, expect } from "vitest";
import {
  STYLE_MAP,
  getCaracteristicasEstilo,
  getTipsPadres,
  STYLE_INSIGHTS,
  getAnalysisText,
  getValentinaCommentary,
} from "../vakStyles";

const STYLES = ["visual", "auditivo", "kinestesico"];

describe("STYLE_MAP", () => {
  test("defines an entry for each of the three VAK styles", () => {
    expect(Object.keys(STYLE_MAP).sort()).toEqual([
      "auditivo",
      "kinestesico",
      "visual",
    ]);
  });

  test.each(STYLES)("%s entry has the expected shape", (style) => {
    const entry = STYLE_MAP[style];
    expect(entry).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        color: expect.any(String),
        bgGradient: expect.stringContaining("linear-gradient"),
        description: expect.any(String),
        strategies: expect.any(Array),
        icon: expect.any(String),
        tip: expect.any(String),
      }),
    );
    expect(entry.strategies.length).toBeGreaterThan(0);
  });
});

describe("getCaracteristicasEstilo", () => {
  test.each(STYLES)("returns 8 characteristics for %s", (style) => {
    const result = getCaracteristicasEstilo(style);
    expect(result).toHaveLength(8);
    result.forEach((item) => expect(typeof item).toBe("string"));
  });

  test("falls back to the visual list for an unknown style", () => {
    expect(getCaracteristicasEstilo("unknown")).toEqual(
      getCaracteristicasEstilo("visual"),
    );
  });

  test("falls back to the visual list when style is null/undefined", () => {
    expect(getCaracteristicasEstilo(null)).toEqual(
      getCaracteristicasEstilo("visual"),
    );
    expect(getCaracteristicasEstilo(undefined)).toEqual(
      getCaracteristicasEstilo("visual"),
    );
  });
});

describe("getTipsPadres", () => {
  test.each(STYLES)("returns 7 tips for %s", (style) => {
    const result = getTipsPadres(style);
    expect(result).toHaveLength(7);
    result.forEach((item) => expect(typeof item).toBe("string"));
  });

  test("falls back to the visual list for an unknown style", () => {
    expect(getTipsPadres("unknown")).toEqual(getTipsPadres("visual"));
  });
});

describe("STYLE_INSIGHTS", () => {
  test.each(STYLES)("%s has what the result screen needs", (style) => {
    const info = STYLE_INSIGHTS[style];
    expect(info.label).toEqual(expect.any(String));
    expect(info.verb).toEqual(expect.any(String));
    expect(info.fill).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(info.ink).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(info.tips.length).toBeGreaterThanOrEqual(2);
    expect(info.superpower).toEqual(expect.any(String));
    expect(info.challenge).toEqual(expect.any(String));
  });
});

describe("clinical and career language", () => {
  const everything = JSON.stringify([
    STYLE_MAP,
    STYLE_INSIGHTS,
    STYLES.map(getCaracteristicasEstilo),
    STYLES.map(getTipsPadres),
  ]);

  test("does not present the activity as a diagnosis or recommend careers", () => {
    expect(everything).not.toMatch(
      /psic[oó]log|dictamen|diagn[oó]stic|carrera/i,
    );
  });
});

describe("getAnalysisText", () => {
  const diagnosis = {
    studentName: "Ana",
    predominantStyle: "visual",
    isMixed: false,
    scores: { visual: 60, auditivo: 25, kinestesico: 15 },
  };

  test("returns empty text for an unmapped style", () => {
    expect(getAnalysisText({ predominantStyle: "x" }, 12)).toEqual({
      main: "",
      footer: "",
    });
  });

  test("speaks to the child directly for ages up to 10", () => {
    const { main } = getAnalysisText(diagnosis, 9);
    expect(main).toContain("¡Hola, Ana!");
    expect(main).toContain("60%");
  });

  test("describes the second style and the mixed profile for older students", () => {
    const { main } = getAnalysisText(
      {
        ...diagnosis,
        isMixed: true,
        scores: { visual: 40, auditivo: 35, kinestesico: 25 },
      },
      13,
    );
    expect(main).toContain("40%");
    expect(main).toContain("35%");
    expect(main).toContain("perfil mixto");
  });
});

describe("getValentinaCommentary", () => {
  const baseCounts = { visual: 7, auditivo: 2, kinestesico: 1 };
  const baseScores = { visual: 70, auditivo: 20, kinestesico: 10 };

  test("returns an empty string when diagnosis is null", () => {
    expect(getValentinaCommentary(null, "Ana", 10)).toBe("");
  });

  test("returns an empty string when diagnosis is undefined", () => {
    expect(getValentinaCommentary(undefined, "Ana", 10)).toBe("");
  });

  test("returns an empty string when no valid age can be derived from diagnosis or fallback", () => {
    const diagnosis = { predominantStyle: "visual", counts: baseCounts };
    expect(getValentinaCommentary(diagnosis, "Ana", undefined)).toBe("");
  });

  test("returns an empty string when studentAge is not numeric anywhere", () => {
    const diagnosis = {
      studentAge: "not-a-number",
      predominantStyle: "visual",
    };
    expect(getValentinaCommentary(diagnosis, "Ana", "also-not-a-number")).toBe(
      "",
    );
  });

  test("uses diagnosis.studentAge over the studentAge fallback when both are present", () => {
    const diagnosis = {
      studentAge: "8",
      studentName: "Ana",
      predominantStyle: "visual",
      scores: baseScores,
    };
    const result = getValentinaCommentary(diagnosis, "Otro Nombre", 16);
    // age 8 -> child tone
    expect(result).toContain("¡Hola, Ana! Soy Valeria.");
    expect(result).not.toContain("Otro Nombre");
  });

  test("falls back to the studentAge param when diagnosis.studentAge is missing", () => {
    const diagnosis = { predominantStyle: "auditivo", scores: baseScores };
    const result = getValentinaCommentary(diagnosis, "Luis", 12);
    expect(result).toContain(
      "Hola, Luis. Soy Valeria, tu guía de aprendizaje.",
    );
  });

  test("uses the teen tone for ages 15 and up", () => {
    const diagnosis = {
      studentAge: "16",
      studentName: "Carlos",
      predominantStyle: "visual",
      scores: baseScores,
    };
    const result = getValentinaCommentary(diagnosis, "Carlos", 16);
    expect(result).toContain("la guía de aprendizaje con IA de Edutechlife");
    expect(result).toContain("No es un diagnóstico ni una etiqueta");
  });

  test("shows the mix in percentages, never as a score out of 10", () => {
    const diagnosis = {
      studentAge: "12",
      studentName: "Sofia",
      predominantStyle: "kinestesico",
      scores: { visual: 20, auditivo: 15, kinestesico: 65 },
    };
    const result = getValentinaCommentary(diagnosis, "Sofia", 12);
    expect(result).toContain("kinestésico 65%");
    expect(result).not.toMatch(/\/10/);
  });

  test("falls back to the studentName param and then 'Estudiante' when no name is available", () => {
    const diagnosis = {
      studentAge: "9",
      predominantStyle: "visual",
      scores: baseScores,
    };
    expect(getValentinaCommentary(diagnosis, "Nombre Fallback", 9)).toContain(
      "Nombre Fallback",
    );
    expect(getValentinaCommentary(diagnosis, undefined, 9)).toContain(
      "Estudiante",
    );
  });

  test("derives percentages from counts when scores are missing", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "visual",
      total: 10,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("70% viendo, 20% escuchando y 10% haciendo");
  });

  test("defaults to zeros when neither scores nor counts exist", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "visual",
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("0% viendo, 0% escuchando y 0% haciendo");
  });

  test("names the mixed profile when two styles are close", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "visual",
      secondaryStyle: "auditivo",
      scores: { visual: 40, auditivo: 35, kinestesico: 25 },
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("Aprendes bien de dos formas, visual y auditivo");
  });

  test("uses the generic fallback for an unmapped predominant style", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "unmapped_style",
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("Hola Ana, soy Valeria");
    expect(result).not.toMatch(/psic[oó]log/i);
  });
});
