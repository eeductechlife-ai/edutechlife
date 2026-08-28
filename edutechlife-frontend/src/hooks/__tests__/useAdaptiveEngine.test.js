import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

vi.mock("../../context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => ({
    supabaseQueries: { studentData: { data: null } },
  }),
}));
vi.mock("../../lib/analytics", () => ({ track: vi.fn() }));

describe("useAdaptiveEngine", () => {
  it("exports the right shape", async () => {
    const { useAdaptiveEngine } = await import("../useAdaptiveEngine");
    const { result } = renderHook(() => useAdaptiveEngine());
    const keys = Object.keys(result.current);
    expect(keys).toEqual(
      expect.arrayContaining([
        "nextAction",
        "recommendations",
        "dailyPlan",
        "weeklyPlan",
        "loading",
        "fetchNextAction",
        "fetchRecommendations",
        "fetchDailyPlan",
        "fetchWeeklyPlan",
        "studentDbId",
      ]),
    );
  });

  it("starts with null state", async () => {
    const { useAdaptiveEngine } = await import("../useAdaptiveEngine");
    const { result } = renderHook(() => useAdaptiveEngine());
    expect(result.current.nextAction).toBeNull();
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.dailyPlan).toBeNull();
    expect(result.current.weeklyPlan).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("studentDbId is null when studentData has no id", async () => {
    const { useAdaptiveEngine } = await import("../useAdaptiveEngine");
    const { result } = renderHook(() => useAdaptiveEngine());
    expect(result.current.studentDbId).toBeNull();
  });

  it("fetchNextAction is a no-op when studentDbId is null", async () => {
    const { useAdaptiveEngine } = await import("../useAdaptiveEngine");
    const { result } = renderHook(() => useAdaptiveEngine());
    // Should not throw
    await result.current.fetchNextAction();
    expect(result.current.nextAction).toBeNull();
  });
});
