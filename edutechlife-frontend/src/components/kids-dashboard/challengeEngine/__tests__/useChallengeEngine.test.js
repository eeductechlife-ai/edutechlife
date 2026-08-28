import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../utils/api", () => ({
  callDeepseekSmartboard: vi.fn(),
}));
vi.mock("../../../../context/SmartBoardKidsContext", () => ({
  useSmartBoardKids: () => ({
    supabaseQueries: { studentData: { data: { id: "student-1", grade: "5" } } },
    addPoints: vi.fn(),
    studentAge: 10,
  }),
}));
vi.mock("../../../../hooks/useFeedbackLog", () => ({
  useFeedbackLog: () => ({ logFeedback: vi.fn() }),
}));
vi.mock("../../../../lib/analytics", () => ({
  track: vi.fn(),
}));

describe("useChallengeEngine constants", () => {
  it("exports DIFFICULTIES with correct structure", async () => {
    const mod = await import("../useChallengeEngine");
    const { result } = await import("@testing-library/react").then((m) =>
      m.renderHook(() => mod.useChallengeEngine()),
    );
    const { DIFFICULTIES, CHALLENGE_SUBJECTS } = result.current;

    expect(DIFFICULTIES).toHaveLength(3);
    expect(DIFFICULTIES[0]).toMatchObject({ id: "easy", questions: 3 });
    expect(DIFFICULTIES[1]).toMatchObject({ id: "medium", questions: 5 });
    expect(DIFFICULTIES[2]).toMatchObject({ id: "hard", questions: 7 });

    expect(CHALLENGE_SUBJECTS.length).toBeGreaterThanOrEqual(6);
    CHALLENGE_SUBJECTS.forEach((s) => {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("label");
      expect(s).toHaveProperty("emoji");
    });
  });

  it("starts in setup phase", async () => {
    const mod = await import("../useChallengeEngine");
    const { result } = await import("@testing-library/react").then((m) =>
      m.renderHook(() => mod.useChallengeEngine()),
    );
    expect(result.current.phase).toBe("setup");
    expect(result.current.questions).toEqual([]);
    expect(result.current.answers).toEqual([]);
    expect(result.current.score).toBe(0);
  });

  it("resetChallenge returns to setup phase", async () => {
    const mod = await import("../useChallengeEngine");
    const { renderHook, act } = await import("@testing-library/react");
    const { result } = renderHook(() => mod.useChallengeEngine());

    act(() => result.current.resetChallenge());
    expect(result.current.phase).toBe("setup");
    expect(result.current.questions).toEqual([]);
  });
});
