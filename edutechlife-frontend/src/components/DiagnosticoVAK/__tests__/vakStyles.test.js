import { describe, test, expect } from "vitest";
import {
  STYLE_MAP,
  getCaracteristicasEstilo,
  getTipsPadres,
  getCarrerasRecomendadas,
  getValentinaCommentary,
} from "../vakStyles";

const STYLES = ["visual", "auditivo", "kinestesico"];

describe("STYLE_MAP", () => {
  test("defines an entry for each of the three VAK styles", () => {
    expect(Object.keys(STYLE_MAP).sort()).toEqual(
      ["auditivo", "kinestesico", "visual"],
    );
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

describe("getCarrerasRecomendadas", () => {
  test.each(STYLES)("returns 8 recommended careers for %s", (style) => {
    const result = getCarrerasRecomendadas(style);
    expect(result).toHaveLength(8);
    result.forEach((item) => expect(typeof item).toBe("string"));
  });

  test("falls back to the visual list for an unknown style", () => {
    expect(getCarrerasRecomendadas("unknown")).toEqual(
      getCarrerasRecomendadas("visual"),
    );
  });
});

describe("getValentinaCommentary", () => {
  const baseCounts = { visual: 7, auditivo: 2, kinestesico: 1 };

  test("returns an empty string when diagnosis is null", () => {
    expect(getValentinaCommentary(null, "Ana", 10)).toBe("");
  });

  test("returns an empty string when diagnosis is undefined", () => {
    expect(getValentinaCommentary(undefined, "Ana", 10)).toBe("");
  });

  test("returns an empty string when no valid age can be derived from diagnosis or fallback", () => {
    const diagnosis = {
      predominantStyle: "visual",
      percentage: 80,
      counts: baseCounts,
    };
    expect(getValentinaCommentary(diagnosis, "Ana", undefined)).toBe("");
  });

  test("returns an empty string when studentAge is not numeric anywhere", () => {
    const diagnosis = {
      studentAge: "not-a-number",
      predominantStyle: "visual",
      percentage: 80,
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
      percentage: 80,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Otro Nombre", 16);
    // age 8 -> visual child report copy
    expect(result).toContain(
      "Después de aplicar y analizar el Diagnóstico VAK",
    );
    expect(result).toContain("Ana");
  });

  test("falls back to the studentAge param when diagnosis.studentAge is missing", () => {
    const diagnosis = {
      predominantStyle: "auditivo",
      percentage: 65,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Luis", 12);
    expect(result).toContain("AUDITIVO");
    expect(result).toContain("Luis");
  });

  test("uses the preteen report for ages 11-14", () => {
    const diagnosis = {
      studentAge: "12",
      studentName: "Sofia",
      predominantStyle: "kinestesico",
      percentage: 70,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Sofia", 12);
    expect(result).toContain("KINESTÉSICO");
    expect(result).toContain("70");
  });

  test("uses the teen report for ages 15 and up", () => {
    const diagnosis = {
      studentAge: "16",
      studentName: "Carlos",
      predominantStyle: "visual",
      percentage: 90,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Carlos", 16);
    expect(result).toContain("Informe Psicopedagógico VAK");
    expect(result).toContain("90");
  });

  test("falls back to the studentName param and then 'Estudiante' when no name is available", () => {
    const diagnosisWithParamName = {
      studentAge: "9",
      predominantStyle: "visual",
      percentage: 55,
      counts: baseCounts,
    };
    expect(
      getValentinaCommentary(diagnosisWithParamName, "Nombre Fallback", 9),
    ).toContain("Nombre Fallback");

    const diagnosisNoName = {
      studentAge: "9",
      predominantStyle: "visual",
      percentage: 55,
      counts: baseCounts,
    };
    expect(getValentinaCommentary(diagnosisNoName, undefined, 9)).toContain(
      "Estudiante",
    );
  });

  test("defaults counts to zeros when diagnosis.counts is missing", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "visual",
      percentage: 55,
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("Visual 0/10");
    expect(result).toContain("Auditivo 0/10");
    expect(result).toContain("Kinestésico 0/10");
  });

  test("reports the highest-scoring secondary channel", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "visual",
      percentage: 80,
      counts: { visual: 8, auditivo: 5, kinestesico: 1 },
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("AUDITIVO con 5/10");
  });

  test("uses the generic fallback report for an unmapped predominant style", () => {
    const diagnosis = {
      studentAge: "9",
      studentName: "Ana",
      predominantStyle: "unmapped_style",
      percentage: 42,
      counts: baseCounts,
    };
    const result = getValentinaCommentary(diagnosis, "Ana", 9);
    expect(result).toContain("Hola Ana, soy Valeria");
    expect(result).toContain("42% de correspondencia");
  });
});
