import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../../../../lib/analytics", () => ({ track: vi.fn() }));

import {
  logPractice,
  readPracticeLog,
  usePracticeLog,
} from "../practicarProgress";
import { buildSubjectList } from "../practicarConfig";

describe("practicarProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("user_email", "kid@test.co");
  });

  it("stores entries per student and marks today as practiced", () => {
    const { result } = renderHook(() => usePracticeLog());
    expect(result.current.daysPracticed).toBe(0);
    act(() => logPractice({ type: "reto", challengeId: "math", score: 67 }));
    expect(readPracticeLog()).toHaveLength(1);
    expect(result.current.daysPracticed).toBe(1);
    expect(result.current.retosThisWeek).toBe(1);
    expect(result.current.avgScore).toBe(67);
    expect(result.current.lastRetoByChallenge.math.score).toBe(67);
  });

  it("keeps each student's log separate", () => {
    logPractice({ type: "educards" });
    localStorage.setItem("user_email", "other@test.co");
    expect(readPracticeLog()).toHaveLength(0);
  });
});

describe("buildSubjectList", () => {
  it("does not flag subjects without grades as needing reinforcement", () => {
    const list = buildSubjectList([{ id: "matematicas", progress: 0 }]);
    expect(list[0].weak).toBe(false);
    expect(list[0].hasData).toBe(false);
  });

  it("puts subjects with low grades first", () => {
    const list = buildSubjectList([
      { id: "lenguaje", gradeScore: 4.5 },
      { id: "matematicas", gradeScore: 2.8 },
    ]);
    expect(list[0].id).toBe("matematicas");
    expect(list[0].weak).toBe(true);
    expect(list[0].challengeId).toBe("math");
  });
});
