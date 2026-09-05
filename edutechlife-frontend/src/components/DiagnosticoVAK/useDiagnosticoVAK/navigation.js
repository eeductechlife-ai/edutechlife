import { calculateDiagnosis } from "./calculations";
import { MOOD_MESSAGES } from "./constants";
import { getQuestionsByAge } from "../../../data/vakQuestions";
import { getInstitutionSlugFromURL } from "../vakHelpers";
import { saveVakDiagnostic } from "../../../services/institutionalAnalytics";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

export function useNavigationHandlers({
  t,
  studentName,
  studentAge,
  studentMood,
  studentEmail,
  studentPhone,
  currentQuestion,
  answers,
  ageQuestions,
  date,
  elapsedTime,
  parentName,
  parentPhone,
  parentEmail,
  valeriaEnabled,
  valentinaIntroComplete,
  studentInfo,
  supabase,
  userId,
  setPhase,
  setStudentName,
  setStudentAge,
  setStartTime,
  setElapsedTime,
  setIsTransitioning,
  setAgeQuestions,
  updateStudentInfo,
  setCurrentQuestion,
  setAnswers,
  setShowConfetti,
  setShowCelebration,
  setDiagnosis,
  setError,
  setShowFeedbackButton,
  setFeedbackPending,
  setShowMoodFeedback,
  setMoodFeedbackText,
  setStudentMood,
  transitionToTest,
  giveEncouragementNoName,
  announceTestEnd,
  giveProgressUpdate,
  setTimeoutSafe,
  clearProgress,
}) {
  const startTest = () => {
    if (valeriaEnabled && !valentinaIntroComplete) return;
    setPhase("calibration");
  };

  const handleStart = () => {
    setPhase("calibration");
  };

  const submitCalibration = async () => {
    if (!studentName.trim() || !studentAge || !studentMood) return;

    const age = parseInt(studentAge);
    if (age < 6 || age > 17) {
      setError(t("vak.ui.error_age_range"));
      return;
    }

    setStudentName(studentName.trim());
    setStudentAge(studentAge);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsTransitioning(true);

    setAgeQuestions(getQuestionsByAge(age));

    updateStudentInfo({
      name: studentName.trim(),
      age: studentAge,
      mood: studentMood || "neutral",
    });

    if (valeriaEnabled) {
      await Promise.race([
        transitionToTest(studentName.trim()),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
      setPhase("test");
      setCurrentQuestion(0);
    } else {
      setPhase("test");
      setCurrentQuestion(0);
    }
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handleFeedbackClick = async () => {
    setShowFeedbackButton(false);
    if (valeriaEnabled) {
      await giveProgressUpdate();
    }
    setFeedbackPending(false);
  };

  const handleAnswer = async (option) => {
    try {
      const idx = currentQuestion;
      const entry = { index: idx, text: option.text, type: option.type };
      const nextAnswers = [...answers, entry];
      setAnswers(nextAnswers);

      if (valeriaEnabled) {
        await giveEncouragementNoName();
      }

      if (idx < ageQuestions.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
        if (valeriaEnabled) {
          await announceTestEnd();
        }

        const res = calculateDiagnosis({
          answers: nextAnswers,
          studentName,
          studentAge,
          studentEmail,
          studentPhone,
          studentMood,
          parentName,
          parentPhone,
          parentEmail,
          date,
          elapsedTime,
          ageQuestions,
        });

        setDiagnosis(res);

        track(EVENTS.VAK_COMPLETED, {
          dominant_style: res.dominant,
          student_age: studentAge,
          elapsed_time: elapsedTime,
        });

        updateStudentInfo({
          diagnosis: res,
        });

        if (supabase && userId) {
          saveVakDiagnostic(supabase, {
            userId,
            institutionId:
              studentInfo.institutionId || getInstitutionSlugFromURL(),
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
        }

        setShowConfetti(true);
        setShowCelebration(true);

        clearProgress();

        setTimeoutSafe(() => {
          setShowConfetti(false);
          setShowCelebration(false);
          setPhase("parentdata");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoodSelect = (moodValue) => {
    setStudentMood(moodValue);
    setMoodFeedbackText(MOOD_MESSAGES[moodValue] || MOOD_MESSAGES.neutral);
    setShowMoodFeedback(true);
    setTimeoutSafe(() => setShowMoodFeedback(false), 4000);
  };

  const handleParentSubmit = () => {
    updateStudentInfo({
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
    });
    setDiagnosis((prev) =>
      prev
        ? {
            ...prev,
            parentName: parentName.trim(),
            parentPhone: parentPhone.trim(),
            parentEmail: parentEmail.trim(),
          }
        : prev,
    );
    setPhase("result");
  };

  return {
    startTest,
    handleStart,
    submitCalibration,
    handleFeedbackClick,
    handleAnswer,
    handleMoodSelect,
    handleParentSubmit,
  };
}
