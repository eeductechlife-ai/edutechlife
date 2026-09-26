import { describe, it, expect } from "vitest";
import {
  DEFAULT_MISSIONS,
  getRotatingMissions,
  getWeekKey,
  mergeWeeklyMissions,
  daysUntilWeeklyReset,
} from "../ingenIAData";

const MON = new Date(2026, 8, 21, 10); // Monday
const NEXT_MON = new Date(2026, 8, 28, 10);

describe("weekly missions", () => {
  it("tags each rotating mission with its week", () => {
    const set = getRotatingMissions(MON);
    expect(set).toHaveLength(3);
    for (const m of set) expect(m.week).toBe(getWeekKey(MON));
  });

  it("rotates to a different set the next week", () => {
    const a = getRotatingMissions(MON).map((m) => m.id);
    const b = getRotatingMissions(NEXT_MON).map((m) => m.id);
    expect(a).not.toEqual(b);
  });

  it("replaces a stale weekly set saved in an older week", () => {
    const saved = [
      ...DEFAULT_MISSIONS,
      ...getRotatingMissions(MON).map((m) => ({ ...m, completed: true })),
    ];
    const merged = mergeWeeklyMissions(saved, NEXT_MON);
    const weekly = merged.filter((m) => String(m.id).startsWith("w_"));
    expect(weekly.map((m) => m.id)).toEqual(
      getRotatingMissions(NEXT_MON).map((m) => m.id),
    );
    expect(weekly.every((m) => !m.completed)).toBe(true);
  });

  it("keeps completion for the same week and permanent missions", () => {
    const current = getRotatingMissions(MON);
    const saved = [
      { ...DEFAULT_MISSIONS[0], completed: true },
      ...DEFAULT_MISSIONS.slice(1),
      { ...current[0], completed: true },
      ...current.slice(1),
    ];
    const merged = mergeWeeklyMissions(saved, MON);
    expect(merged.find((m) => m.id === DEFAULT_MISSIONS[0].id).completed).toBe(
      true,
    );
    expect(merged.find((m) => m.id === current[0].id).completed).toBe(true);
    expect(merged.find((m) => m.id === current[1].id).completed).toBe(false);
  });

  it("adds the weekly set to lists saved before weekly missions existed", () => {
    const merged = mergeWeeklyMissions(DEFAULT_MISSIONS, MON);
    expect(merged).toHaveLength(DEFAULT_MISSIONS.length + 3);
  });

  it("counts days until next Monday", () => {
    expect(daysUntilWeeklyReset(MON)).toBe(7);
    expect(daysUntilWeeklyReset(new Date(2026, 8, 27))).toBe(1); // Sunday
  });
});
