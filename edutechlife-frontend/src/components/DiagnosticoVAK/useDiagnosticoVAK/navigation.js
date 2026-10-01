import { useRef } from "react";
import { calculateDiagnosis } from "./calculations";
import { MOOD_MESSAGES, AGE_MIN, AGE_MAX, CELEBRATION_MS } from "./constants";
import { getQuestionsByAge, getVakMode } from "../../../data/vakQuestions";
import { getInstitutionSlugFromURL } from "../vakHelpers";
import {
  saveVakDiagnostic,
  saveAnonymousVakResult,
} from "../../../services/institutionalAnalytics";
import { savePendingVakResult } from "../../../utils/vakPendingResult";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

export function useNavigationHandlers({
  studentName,
  studentAge,
  studentMood,
  currentQuestion,
  answers,
  ageQuestions,
  startTime,
  parentName,
  supabase,
  userId,
  setPhase,
  setStartTime,
  setAgeQuestions,
  setCurrentQuestion,
  setAnswers,
  setShowConfetti,
  setShowCelebration,
  setDiagnosis,
  setError,
  setShowMoodFeedback,
  setMoodFeedbackText,
  setStudentMood,
  setValeriaEnabled,
  setTimeoutSafe,
  stopSpeaking,
}) {
  // Entre la última respuesta y la pantalla de resultado hay una celebración;
  // un segundo toque en ese rato no debe enviar el resultado otra vez.
  const finishingRef = useRef(false);

  const startTest = () => setPhase("calibration");

  const submitCalibration = () => {
    const age = parseInt(studentAge, 10);
    if (!studentName.trim() || !studentMood) return;
    if (!age || age < AGE_MIN || age > AGE_MAX) return;

    const questions = getQuestionsByAge(age);
    const mode = getVakMode(age);

    finishingRef.current = false;
    setAgeQuestions(questions);
    // Explorador: Valeria lee las preguntas. Pro: la voz es opcional.
    setValeriaEnabled(mode === "explorer");
    setStartTime(Date.now());
    setCurrentQuestion(0);
    setAnswers([]);
    setPhase("test");

    track(EVENTS.VAK_STARTED, {
      student_age: age,
      mode,
      total_questions: questions.length,
    });
  };

  const finishTest = (finalAnswers) => {
    finishingRef.current = true;
    const elapsed = startTime
      ? Math.max(0, Math.floor((Date.now() - startTime) / 1000))
      : 0;

    const res = calculateDiagnosis({
      answers: finalAnswers,
      studentName: studentName.trim(),
      studentAge,
      studentMood,
      parentName,
      date: new Date().toLocaleDateString("es-CO"),
      elapsedTime: elapsed,
      ageQuestions,
    });

    setDiagnosis(res);

    track(EVENTS.VAK_COMPLETED, {
      dominant_style: res.predominantStyle,
      mixed: res.isMixed,
      student_age: studentAge,
      elapsed_time: elapsed,
    });

    // Resumen sin nombre en este dispositivo, para traerlo a IngenIA.
    savePendingVakResult(res);

    if (supabase && userId) {
      saveVakDiagnostic(supabase, {
        userId,
        institutionId: getInstitutionSlugFromURL(),
        diagnosis: res,
      })
        .then((r) => {
          if (r && !r.ok) {
            console.warn("[VAK] Diagnóstico no persistido:", r.error);
          }
        })
        .catch((e) => {
          console.warn("[VAK] Diagnóstico no persistido:", e?.message);
        });
    } else if (supabase) {
      // Sin sesión: solo un resultado anónimo para los reportes del colegio.
      saveAnonymousVakResult(supabase, {
        institutionSlug: getInstitutionSlugFromURL(),
        diagnosis: res,
        mode: getVakMode(studentAge),
      }).catch(() => {});
    }

    setShowConfetti(true);
    setShowCelebration(true);
    setTimeoutSafe(() => {
      setShowConfetti(false);
      setShowCelebration(false);
      setPhase("result");
    }, CELEBRATION_MS);
  };

  const handleAnswer = (option) => {
    if (finishingRef.current) return;
    try {
      stopSpeaking();
      const idx = currentQuestion;
      const entry = { index: idx, text: option.text, type: option.type };
      // Si volvió a una pregunta anterior, la nueva respuesta reemplaza la vieja.
      const nextAnswers = [...answers.slice(0, idx), entry];
      setAnswers(nextAnswers);

      track(EVENTS.VAK_QUESTION_ANSWERED, {
        index: idx + 1,
        total: ageQuestions.length,
      });

      if (idx < ageQuestions.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
        finishTest(nextAnswers);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const goBack = () => {
    stopSpeaking();
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const handleMoodSelect = (moodValue) => {
    setStudentMood(moodValue);
    setMoodFeedbackText(MOOD_MESSAGES[moodValue] || MOOD_MESSAGES.neutral);
    setShowMoodFeedback(true);
  };

  return {
    startTest,
    submitCalibration,
    handleAnswer,
    goBack,
    handleMoodSelect,
  };
}
