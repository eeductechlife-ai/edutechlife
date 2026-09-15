import { describe, it, expect } from "vitest";
import { LEADERBOARD_PERIODS, rankEntries } from "../leaderboardPeriod.js";

const entries = [
  { userId: "a", xp: 100, weeklyXp: 10 },
  { userId: "b", xp: 50, weeklyXp: 80 },
  { userId: "c", xp: 200 },
];

describe("rankEntries (Fase 4 — leaderboard semanal)", () => {
  it("expone los períodos soportados", () => {
    expect(LEADERBOARD_PERIODS).toEqual(["global", "weekly"]);
  });

  it("ordena por XP global por defecto", () => {
    const ranked = rankEntries(entries);
    expect(ranked.map((e) => e.userId)).toEqual(["c", "a", "b"]);
    expect(ranked[0].rank).toBe(1);
  });

  it("ordena por XP semanal y trata ausente como 0", () => {
    const ranked = rankEntries(entries, "weekly");
    expect(ranked.map((e) => e.userId)).toEqual(["b", "a", "c"]);
    expect(ranked.find((e) => e.userId === "c").rankedXp).toBe(0);
  });

  it("no muta el arreglo original", () => {
    const copy = [...entries];
    rankEntries(entries, "weekly");
    expect(entries).toEqual(copy);
  });

  it("es tolerante a entradas vacías o inválidas", () => {
    expect(rankEntries(null)).toEqual([]);
    expect(rankEntries([])).toEqual([]);
  });
});
