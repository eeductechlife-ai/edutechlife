import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const addPoints = vi.fn();
const ctx = {
  gradeLevel: 7,
  studentAge: 12,
  ageGroup: "middle",
  addPoints,
  supabaseQueries: { studentData: { data: { id: "s1", grade_level: 7 } } },
};

vi.mock("../../../../utils/api", () => ({ callDeepseekIngenia: vi.fn() }));
vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ctx,
}));
vi.mock("../../../../hooks/useCompetencyTracking", () => ({
  useCompetencyTracking: () => ({ trackActivity: vi.fn() }),
}));
vi.mock("../../../../hooks/useFeedbackLog", () => ({
  useFeedbackLog: () => ({ logFeedback: vi.fn() }),
}));
vi.mock("../../../../lib/analytics", () => ({ track: vi.fn() }));

import { callDeepseekIngenia } from "../../../../utils/api";
import { useChallengeEngine } from "../useChallengeEngine";
import { CATEGORY } from "../../../../context/pointsEconomy";

const q = (n) => ({
  question: `¿Cuánto es ${n}+1?`,
  options: ["a", "b", "c", "d"],
  correct: 0,
  explanation: "e",
});

async function playPerfectEasy() {
  callDeepseekIngenia.mockResolvedValue({ questions: [q(1), q(2), q(3)] });
  const { result } = renderHook(() => useChallengeEngine());
  act(() => {
    result.current.setSubject(
      result.current.CHALLENGE_SUBJECTS.find((s) => s.id === "math"),
    );
    result.current.setDifficulty(
      result.current.DIFFICULTIES.find((d) => d.id === "easy"),
    );
  });
  await act(async () => {
    await result.current.startChallenge();
  });
  for (let i = 0; i < 3; i++) {
    act(() => result.current.submitAnswer(0));
  }
  return result;
}

describe("retos: puntos con tope diario", () => {
  beforeEach(() => vi.clearAllMocks());

  it("pide los puntos en la categoría de retos del servidor", async () => {
    addPoints.mockReturnValue(50);
    await playPerfectEasy();
    expect(addPoints).toHaveBeenCalledWith(
      50,
      expect.stringContaining("Reto Matemáticas"),
      CATEGORY.challenge,
    );
  });

  it("expone los puntos que de verdad se dieron", async () => {
    addPoints.mockReturnValue(50);
    const result = await playPerfectEasy();
    expect(result.current.phase).toBe("results");
    expect(result.current.xpGranted).toBe(50);
  });

  it("con el tope alcanzado se dan menos (o ninguno) y la pantalla lo sabrá", async () => {
    addPoints.mockReturnValue(20);
    const partial = await playPerfectEasy();
    expect(partial.current.xpGranted).toBe(20);

    addPoints.mockReturnValue(0);
    const none = await playPerfectEasy();
    expect(none.current.xpGranted).toBe(0);
  });

  it("si el contexto no devuelve un número se asume que se dio todo", async () => {
    addPoints.mockReturnValue(undefined);
    const result = await playPerfectEasy();
    expect(result.current.xpGranted).toBe(50);
  });

  it("volver a empezar limpia el valor", async () => {
    addPoints.mockReturnValue(20);
    const result = await playPerfectEasy();
    act(() => result.current.resetChallenge());
    expect(result.current.xpGranted).toBeNull();
  });
});
