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

describe("useChallengeEngine state setters", () => {
  it("setSubject updates subject state", async () => {
    const mod = await import("../useChallengeEngine");
    const { renderHook, act } = await import("@testing-library/react");
    const { result } = renderHook(() => mod.useChallengeEngine());

    const mathSubject = { id: "math", label: "Matemáticas", emoji: "🔢" };
    act(() => result.current.setSubject(mathSubject));
    expect(result.current.subject).toEqual(mathSubject);
  });

  it("setDifficulty updates difficulty state", async () => {
    const mod = await import("../useChallengeEngine");
    const { renderHook, act } = await import("@testing-library/react");
    const { result } = renderHook(() => mod.useChallengeEngine());

    const diff = {
      id: "hard",
      label: "Maestro",
      emoji: "🔥",
      questions: 7,
      xp: 200,
    };
    act(() => result.current.setDifficulty(diff));
    expect(result.current.difficulty).toEqual(diff);
  });
});

describe("useChallengeEngine.submitAnswer", () => {
  it("tracks correct and incorrect answers", async () => {
    const mod = await import("../useChallengeEngine");
    const { renderHook, act } = await import("@testing-library/react");
    const { result } = renderHook(() => mod.useChallengeEngine());

    // Manually set up questions via internal state by starting a challenge
    // We need to simulate having questions loaded. Use setSubject + setDifficulty
    // then directly test submitAnswer by calling startChallenge with mocked API.
    const { callDeepseekSmartboard } = await import("../../../../utils/api");
    callDeepseekSmartboard.mockResolvedValueOnce({
      questions: [
        {
          question: "1+1?",
          options: ["1", "2", "3", "4"],
          correct: 1,
          explanation: "sum",
        },
        {
          question: "2+2?",
          options: ["3", "4", "5", "6"],
          correct: 1,
          explanation: "sum",
        },
      ],
    });

    const sub = { id: "math", label: "Matemáticas", emoji: "🔢" };
    const diff = {
      id: "easy",
      label: "Explorador",
      emoji: "🌱",
      questions: 2,
      xp: 50,
    };
    act(() => {
      result.current.setSubject(sub);
      result.current.setDifficulty(diff);
    });

    await act(async () => {
      await result.current.startChallenge();
    });

    expect(result.current.phase).toBe("playing");
    expect(result.current.questions).toHaveLength(2);

    // Answer first question correctly
    act(() => result.current.submitAnswer(1));
    expect(result.current.answers).toHaveLength(1);
    expect(result.current.answers[0].isCorrect).toBe(true);

    // Answer second question incorrectly -> triggers results
    act(() => result.current.submitAnswer(0));
    expect(result.current.answers).toHaveLength(2);
    expect(result.current.answers[1].isCorrect).toBe(false);
    expect(result.current.phase).toBe("results");
    expect(result.current.score).toBe(50);
  });
});
