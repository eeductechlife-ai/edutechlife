import { describe, it, expect } from "vitest";
import { getCompetenceLevel, computeRadarScores } from "../competenceLevel.js";

describe("getCompetenceLevel", () => {
  it("classifies below 60 as explorer", () => {
    expect(getCompetenceLevel(0).key).toBe("explorer");
    expect(getCompetenceLevel(59.9).key).toBe("explorer");
  });

  it("classifies 60-79 as creator", () => {
    expect(getCompetenceLevel(60).key).toBe("creator");
    expect(getCompetenceLevel(79).key).toBe("creator");
  });

  it("classifies 80+ as expert", () => {
    expect(getCompetenceLevel(80).key).toBe("expert");
    expect(getCompetenceLevel(100).key).toBe("expert");
  });

  it("falls back to 0 for invalid input", () => {
    expect(getCompetenceLevel(undefined).key).toBe("explorer");
    expect(getCompetenceLevel("abc").key).toBe("explorer");
  });
});

describe("computeRadarScores", () => {
  it("collects present exercise scores", () => {
    const { scores, average } = computeRadarScores({
      nota_ej1: 60,
      nota_ej2: 80,
      nota_ej3: 100,
    });
    expect(scores).toEqual([60, 80, 100, null]);
    expect(average).toBe(80);
  });

  it("handles missing exercise scores", () => {
    const { scores, average } = computeRadarScores({});
    expect(scores).toEqual([null, null, null, null]);
    expect(average).toBe(0);
  });

  it("handles null evaluation", () => {
    const { scores, average } = computeRadarScores(null);
    expect(scores).toEqual([null, null, null, null]);
    expect(average).toBe(0);
  });
});
