import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MOOD_MESSAGES } from "../useDiagnosticoVAK/constants";
import { useNavigationHandlers } from "../useDiagnosticoVAK/navigation";

vi.mock("../../../services/institutionalAnalytics", () => ({
  saveVakDiagnostic: vi.fn(() => Promise.resolve({ ok: true })),
  saveAnonymousVakResult: vi.fn(() => Promise.resolve({ ok: true })),
}));
vi.mock("../../../lib/analytics", () => ({ track: vi.fn() }));

describe("MOOD_MESSAGES (estado triste)", () => {
  it("invita a contarle a un acudiente o adulto de confianza", () => {
    expect(MOOD_MESSAGES.sad).toMatch(/acudiente/i);
    expect(MOOD_MESSAGES.sad).toMatch(/adulto de confianza/i);
  });

  it("mantiene la opción de dejarlo para otro día", () => {
    expect(MOOD_MESSAGES.sad).toMatch(/otro d[ií]a/i);
  });

  it("al elegir 'triste' se muestra el mensaje con el apoyo humano", () => {
    const setMoodFeedbackText = vi.fn();
    const setShowMoodFeedback = vi.fn();
    const { result } = renderHook(() =>
      useNavigationHandlers({
        studentName: "Ana",
        studentAge: "12",
        studentMood: "",
        currentQuestion: 0,
        answers: [],
        ageQuestions: [],
        startTime: Date.now(),
        parentName: "",
        supabase: {},
        userId: null,
        setPhase: vi.fn(),
        setStartTime: vi.fn(),
        setAgeQuestions: vi.fn(),
        setCurrentQuestion: vi.fn(),
        setAnswers: vi.fn(),
        setShowConfetti: vi.fn(),
        setShowCelebration: vi.fn(),
        setDiagnosis: vi.fn(),
        setError: vi.fn(),
        setShowMoodFeedback,
        setMoodFeedbackText,
        setStudentMood: vi.fn(),
        setValeriaEnabled: vi.fn(),
        setTimeoutSafe: vi.fn(),
        stopSpeaking: vi.fn(),
      }),
    );
    act(() => result.current.handleMoodSelect("sad"));
    const shown = setMoodFeedbackText.mock.calls[0][0];
    expect(shown).toMatch(/acudiente/i);
    expect(shown).toMatch(/adulto de confianza/i);
    expect(setShowMoodFeedback).toHaveBeenCalledWith(true);
  });
});
