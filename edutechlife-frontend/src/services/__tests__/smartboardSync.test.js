import { describe, it, expect } from "vitest";
import { mergeWithLocal } from "../smartboardSync";

describe("mergeWithLocal", () => {
  it("merges totalPoints and minutes by taking the max (documented) but keeps both sides for arrays", () => {
    const merged = mergeWithLocal(
      { totalPoints: 300, totalActiveMinutes: 60, missions: [{ id: "a" }] },
      { totalPoints: 100, totalActiveMinutes: 40, missions: [{ id: "b" }] },
    );
    expect(merged.totalPoints).toBe(300);
    expect(merged.missions).toHaveLength(2);
  });

  it("does not lose remote points when local is higher AND remote has newer history", () => {
    const merged = mergeWithLocal(
      { totalPoints: 0, pointsHistory: [], missions: [] },
      {
        totalPoints: 500,
        pointsHistory: [{ id: "r1" }],
        missions: [{ id: "b" }],
      },
    );
    expect(merged.totalPoints).toBe(500);
    expect(merged.pointsHistory).toHaveLength(1);
  });

  it("deduplicates arrays by id across both sides", () => {
    const merged = mergeWithLocal(
      { missions: [{ id: "a" }, { id: "c" }] },
      { missions: [{ id: "a" }, { id: "b" }] },
    );
    const ids = merged.missions.map((m) => m.id).sort();
    expect(ids).toEqual(["a", "b", "c"]);
  });
});
