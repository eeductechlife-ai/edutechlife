import { useState, useCallback, useRef } from "react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useFeedbackLog } from "../../../hooks/useFeedbackLog";
import { track } from "../../../lib/analytics";

const DIFFICULTIES = [
  { id: "easy", label: "Explorador", emoji: "🌱", questions: 3, xp: 50 },
  { id: "medium", label: "Aventurero", emoji: "⚡", questions: 5, xp: 100 },
  { id: "hard", label: "Maestro", emoji: "🔥", questions: 7, xp: 200 },
];

const CHALLENGE_SUBJECTS = [
  { id: "math", label: "Matemáticas", emoji: "🔢" },
  { id: "science", label: "Ciencias", emoji: "🔬" },
  { id: "language", label: "Lenguaje", emoji: "📖" },
  { id: "social", label: "Sociales", emoji: "🌍" },
  { id: "tech", label: "Tecnología", emoji: "💻" },
  { id: "english", label: "Inglés", emoji: "🇬🇧" },
];

function buildChallengePrompt(subject, difficulty, grade, questionCount) {
  return [
    {
      role: "system",
      content: `Eres un generador de retos educativos para niños de grado ${grade || "5to"} en Colombia.
Genera exactamente ${questionCount} preguntas de opción múltiple sobre ${subject.label}.
Nivel de dificultad: ${difficulty.label}.
Responde SOLO en JSON válido con este formato:
{
  "questions": [
    {
      "question": "texto de la pregunta",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "explicación breve de la respuesta correcta"
    }
  ]
}
Las preguntas deben ser apropiadas para la edad, en español, y alineadas con el currículo colombiano MEN.`,
    },
    {
      role: "user",
      content: `Genera ${questionCount} preguntas de ${subject.label} nivel ${difficulty.label}.`,
    },
  ];
}

export function useChallengeEngine() {
  const { supabaseQueries, addPoints, studentAge } = useSmartBoardKids();
  const studentGrade = supabaseQueries?.studentData?.data?.grade;
  const { logFeedback } = useFeedbackLog();

  const [phase, setPhase] = useState("setup");
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  const startChallenge = useCallback(async () => {
    if (!subject || !difficulty) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = buildChallengePrompt(
        subject,
        difficulty,
        studentGrade,
        difficulty.questions,
      );
      const result = await callDeepseekSmartboard(prompt, {
        isJson: true,
        temperature: 0.8,
        maxTokens: 2500,
      });
      if (!result?.questions?.length) throw new Error("No questions received");
      setQuestions(result.questions);
      setAnswers([]);
      setCurrentIndex(0);
      startTimeRef.current = Date.now();
      setPhase("playing");
      track("challenge_started", {
        subject: subject.id,
        difficulty: difficulty.id,
      });
    } catch (err) {
      setError(err.message || "Error generando el reto");
    } finally {
      setLoading(false);
    }
  }, [subject, difficulty, studentGrade]);

  const submitAnswer = useCallback(
    (selectedIndex) => {
      const q = questions[currentIndex];
      if (!q) return;
      const isCorrect = selectedIndex === q.correct;
      const newAnswers = [...answers, { selectedIndex, isCorrect }];
      setAnswers(newAnswers);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const correctCount = newAnswers.filter((a) => a.isCorrect).length;
        const score = Math.round((correctCount / questions.length) * 100);
        const elapsed = Date.now() - (startTimeRef.current || Date.now());
        const xpEarned =
          score >= 70 ? difficulty.xp : Math.round(difficulty.xp * 0.3);
        addPoints(xpEarned, `Reto ${subject.label} (${score}%)`);

        const emotion =
          score >= 80 ? "proud" : score >= 50 ? "neutral" : "frustrated";
        logFeedback({
          activity: "challenge",
          emotion,
          score,
          context: {
            subject: subject.id,
            difficulty: difficulty.id,
            timeMs: elapsed,
          },
        });
        track("challenge_completed", {
          subject: subject.id,
          difficulty: difficulty.id,
          score,
          correct: correctCount,
          total: questions.length,
          timeMs: elapsed,
          xp: xpEarned,
        });
        setPhase("results");
      }
    },
    [
      questions,
      currentIndex,
      answers,
      difficulty,
      subject,
      addPoints,
      logFeedback,
    ],
  );

  const resetChallenge = useCallback(() => {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setError(null);
  }, []);

  const score =
    answers.length > 0
      ? Math.round(
          (answers.filter((a) => a.isCorrect).length / answers.length) * 100,
        )
      : 0;

  return {
    phase,
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    questions,
    currentIndex,
    answers,
    loading,
    error,
    score,
    startChallenge,
    submitAnswer,
    resetChallenge,
    DIFFICULTIES,
    CHALLENGE_SUBJECTS,
  };
}
