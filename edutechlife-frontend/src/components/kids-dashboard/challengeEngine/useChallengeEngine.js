import { useState, useCallback, useRef } from "react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useFeedbackLog } from "../../../hooks/useFeedbackLog";
import { useCompetencyTracking } from "../../../hooks/useCompetencyTracking";
import {
  pickDbaSequence,
  getDbaForSubjectGrade,
} from "../../../utils/dbaCatalog";
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

// CHALLENGE_SUBJECTS usa ids simplificados; el currículo MEN usa sus propios ids.
const SUBJECT_TO_CURRICULO_ID = {
  math: "matematicas",
  science: "ciencias",
  language: "lenguaje",
  social: "sociales",
  english: "ingles",
  // "tech" no tiene DBA propio en el currículo MEN — sin DBA, el reto sigue
  // funcionando genérico (dbaSequence queda vacío, ver startChallenge).
};

function buildChallengePrompt(
  subject,
  difficulty,
  grade,
  questionCount,
  dbaSequence,
) {
  const hasDba = dbaSequence.length === questionCount;

  const dbaInstructions = hasDba
    ? dbaSequence
        .map(
          (d, i) =>
            `Pregunta ${i + 1} debe evaluar EXACTAMENTE este DBA: "${d.text}"`,
        )
        .join("\n")
    : `Genera preguntas variadas y representativas de ${subject.label} para ese grado.`;

  return [
    {
      role: "system",
      content: `Eres un generador de retos educativos para niños de grado ${grade || "5to"} en Colombia.
Genera exactamente ${questionCount} preguntas de opción múltiple sobre ${subject.label}.
Nivel de dificultad: ${difficulty.label}.

${dbaInstructions}

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
El orden de "questions" en la respuesta debe coincidir exactamente con el orden de las instrucciones de DBA de arriba.
Las preguntas deben ser apropiadas para la edad, en español, y alineadas con el currículo colombiano MEN.`,
    },
    {
      role: "user",
      content: `Genera ${questionCount} preguntas de ${subject.label} nivel ${difficulty.label}.`,
    },
  ];
}

export function useChallengeEngine() {
  const { supabaseQueries, addPoints, studentAge } = useIngenIAKids();
  const studentGrade = supabaseQueries?.studentData?.data?.grade;

  // Only show subjects that have DBA data for the student's actual grade.
  // Falls back to all mapped subjects if grade is unknown.
  const grade = parseInt(studentGrade, 10) || 5;
  const availableSubjects = CHALLENGE_SUBJECTS.filter((s) => {
    const curriculoId = SUBJECT_TO_CURRICULO_ID[s.id];
    if (!curriculoId) return false; // "tech" has no MEN DBA
    return getDbaForSubjectGrade(curriculoId, grade).length > 0;
  });
  const { logFeedback } = useFeedbackLog();
  const { trackActivity } = useCompetencyTracking();

  const [phase, setPhase] = useState("setup");
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [dbaSequence, setDbaSequence] = useState([]);
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
      const grade = parseInt(studentGrade, 10) || 5;
      const curriculoSubject = SUBJECT_TO_CURRICULO_ID[subject.id];
      const dbas = curriculoSubject
        ? pickDbaSequence(curriculoSubject, grade, difficulty.questions)
        : [];

      const prompt = buildChallengePrompt(
        subject,
        difficulty,
        studentGrade,
        difficulty.questions,
        dbas,
      );
      const result = await callDeepseekSmartboard(prompt, {
        isJson: true,
        temperature: 0.8,
        maxTokens: 2500,
      });
      if (!result?.questions?.length) throw new Error("No questions received");
      setQuestions(result.questions);
      // Solo se usa la secuencia de DBA si la IA devolvió el mismo número de
      // preguntas que se pidieron por DBA — si no coincide, no podemos confiar
      // en el orden y el reto sigue funcionando sin tracking por tema.
      setDbaSequence(dbas.length === result.questions.length ? dbas : []);
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

      // Reporta el dominio de ESTE DBA específico, no un promedio de la materia —
      // así "Refuerza Matemáticas" puede convertirse en "Refuerza fracciones".
      const dba = dbaSequence[currentIndex];
      if (dba) {
        trackActivity({
          subject: dba.subject,
          score: isCorrect ? 1 : 0,
          competencyIds: [dba.id],
        });
      }

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
      dbaSequence,
      addPoints,
      logFeedback,
      trackActivity,
    ],
  );

  const resetChallenge = useCallback(() => {
    setPhase("setup");
    setQuestions([]);
    setDbaSequence([]);
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
    CHALLENGE_SUBJECTS: availableSubjects,
  };
}
