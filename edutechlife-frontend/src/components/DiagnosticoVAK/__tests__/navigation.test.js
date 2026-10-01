import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNavigationHandlers } from "../useDiagnosticoVAK/navigation";
import { getQuestionsByAge } from "../../../data/vakQuestions";

const saveVakDiagnostic = vi.fn(() => Promise.resolve({ ok: true }));
const saveAnonymousVakResult = vi.fn(() => Promise.resolve({ ok: true }));

vi.mock("../../../services/institutionalAnalytics", () => ({
  saveVakDiagnostic: (...a) => saveVakDiagnostic(...a),
  saveAnonymousVakResult: (...a) => saveAnonymousVakResult(...a),
}));
vi.mock("../../../lib/analytics", () => ({ track: vi.fn() }));

const questions = getQuestionsByAge(12);
const lastIndex = questions.length - 1;

const setup = ({ userId = null, supabase = {} } = {}) => {
  const setters = {
    setPhase: vi.fn(),
    setStartTime: vi.fn(),
    setAgeQuestions: vi.fn(),
    setCurrentQuestion: vi.fn(),
    setAnswers: vi.fn(),
    setShowConfetti: vi.fn(),
    setShowCelebration: vi.fn(),
    setDiagnosis: vi.fn(),
    setError: vi.fn(),
    setShowMoodFeedback: vi.fn(),
    setMoodFeedbackText: vi.fn(),
    setStudentMood: vi.fn(),
    setValeriaEnabled: vi.fn(),
    setTimeoutSafe: vi.fn(),
    stopSpeaking: vi.fn(),
  };
  const answers = questions
    .slice(0, lastIndex)
    .map((q, i) => ({
      index: i,
      text: q.options[0].text,
      type: q.options[0].type,
    }));
  const { result } = renderHook(() =>
    useNavigationHandlers({
      studentName: "Ana",
      studentAge: "12",
      studentMood: "happy",
      currentQuestion: lastIndex,
      answers,
      ageQuestions: questions,
      startTime: Date.now() - 60000,
      parentName: "",
      supabase,
      userId,
      ...setters,
    }),
  );
  return { result, setters };
};

describe("finishing the activity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("submits the result once even if the last answer is tapped twice", () => {
    const { result, setters } = setup();
    const last = questions[lastIndex].options[0];

    result.current.handleAnswer(last);
    result.current.handleAnswer(last);

    expect(setters.setDiagnosis).toHaveBeenCalledTimes(1);
    expect(saveAnonymousVakResult).toHaveBeenCalledTimes(1);
  });

  it("stores an anonymous result when nobody is signed in", () => {
    const { result } = setup({ userId: null });
    result.current.handleAnswer(questions[lastIndex].options[0]);

    expect(saveAnonymousVakResult).toHaveBeenCalledTimes(1);
    expect(saveVakDiagnostic).not.toHaveBeenCalled();
    const arg = saveAnonymousVakResult.mock.calls[0][1];
    expect(arg.mode).toBe("pro");
    expect(arg.diagnosis.studentAge).toBe("12");
  });

  it("stores the named result, not the anonymous one, when signed in", () => {
    const { result } = setup({ userId: "user-1" });
    result.current.handleAnswer(questions[lastIndex].options[0]);

    expect(saveVakDiagnostic).toHaveBeenCalledTimes(1);
    expect(saveAnonymousVakResult).not.toHaveBeenCalled();
  });

  it("keeps a name-free summary on the device so IngenIA can import it", () => {
    const { result } = setup();
    result.current.handleAnswer(questions[lastIndex].options[0]);

    const raw = localStorage.getItem("edutechlife_vak_pending");
    expect(raw).toBeTruthy();
    expect(raw).not.toMatch(/Ana|answers/);
  });
});
