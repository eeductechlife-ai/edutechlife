import { useState, useCallback, useRef, useEffect } from "react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useFeedbackLog } from "../../../hooks/useFeedbackLog";
import { useCompetencyTracking } from "../../../hooks/useCompetencyTracking";
import {
  pickDbaSequence,
  getDbaForSubjectGrade,
} from "../../../utils/dbaCatalog";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";
import {
  peekHandoff,
  clearHandoff,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_CHALLENGE_DIFFICULTY,
  HANDOFF_CHALLENGE_AUTOSTART,
} from "../practicarHub/practicarHandoff";
import { logPractice } from "../practicarHub/practicarProgress";
import { CHALLENGE_SUBJECTS } from "../../../config/subjectCatalog";
import { challengeGrade } from "../../../utils/studentLevel";
import { keepSelfContained } from "./questionValidity";

const DIFFICULTIES = [
  {
    id: "easy",
    label: "Explorador",
    hint: "Fácil",
    emoji: "🌱",
    questions: 3,
    xp: 50,
  },
  {
    id: "medium",
    label: "Aventurero",
    hint: "Normal",
    emoji: "⚡",
    questions: 5,
    xp: 100,
  },
  {
    id: "hard",
    label: "Maestro",
    hint: "Difícil",
    emoji: "🔥",
    questions: 7,
    xp: 200,
  },
];

// Seconds per question by age group; null = no timer (6-8 year olds read slowly).
export const TIME_LIMIT_BY_AGE = { early: null, middle: 45, senior: 30 };

// Los retos usan ids de reto (math, language…); el currículo MEN, los suyos.
// Arte no tiene DBA (curriculoId null): se genera por grado, sin secuencia.
const CURRICULO_ID_BY_CHALLENGE = Object.fromEntries(
  CHALLENGE_SUBJECTS.map((s) => [s.id, s.curriculoId]),
);

// Las materias base (Matemáticas, Lenguaje, Ciencias, Sociales, Inglés, Arte)
// siempre se ofrecen. Las demás (Química, Física…) solo si el grado tiene DBA.
export function isChallengeSubjectAvailable(challengeId, grade) {
  const subject = CHALLENGE_SUBJECTS.find((s) => s.id === challengeId);
  if (!subject) return false;
  if (subject.core) return true;
  return (
    getDbaForSubjectGrade(subject.curriculoId, parseInt(grade, 10) || 5)
      .length > 0
  );
}

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
Nivel de dificultad: ${difficulty.label}.${
        difficulty.id === "easy"
          ? " Es el nivel más sencillo: usa conceptos básicos de uno o dos grados por debajo."
          : ""
      }

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
Las preguntas deben ser apropiadas para la edad, en español, y alineadas con el currículo colombiano MEN.
Cada pregunta debe entenderse solo con su texto: NO uses gráficas, figuras, imágenes, mapas ni tablas que el estudiante no pueda ver. Si necesitas datos, escríbelos dentro de la pregunta.`,
    },
    {
      role: "user",
      content: `Genera ${questionCount} preguntas de ${subject.label} nivel ${difficulty.label}.`,
    },
  ];
}

export function useChallengeEngine() {
  const { supabaseQueries, addPoints, gradeLevel, ageGroup, studentAge } =
    useIngenIAKids();
  const studentGrade =
    gradeLevel ?? supabaseQueries?.studentData?.data?.grade_level;

  // Materias base siempre; las especializadas solo si hay DBA para el grado
  // (ver isChallengeSubjectAvailable).
  const grade = parseInt(studentGrade, 10) || 5;
  const availableSubjects = CHALLENGE_SUBJECTS.filter((s) =>
    isChallengeSubjectAvailable(s.id, grade),
  );
  const { logFeedback } = useFeedbackLog();
  const { trackActivity } = useCompetencyTracking();

  const [phase, setPhase] = useState("setup");
  const [subject, setSubject] = useState(() => {
    const preset = peekHandoff(HANDOFF_CHALLENGE_SUBJECT);
    return availableSubjects.find((s) => s.id === preset) || null;
  });
  useEffect(() => clearHandoff(HANDOFF_CHALLENGE_SUBJECT), []);
  const [difficulty, setDifficulty] = useState(() => {
    const presetDiff = peekHandoff(HANDOFF_CHALLENGE_DIFFICULTY);
    if (presetDiff) {
      const found = DIFFICULTIES.find((d) => d.id === presetDiff);
      if (found) return found;
    }
    return ageGroup === "early" ? DIFFICULTIES[0] : DIFFICULTIES[1];
  });
  // Auto-start: when the hub passes both a subject and the autostart flag,
  // skip the setup screen and begin generating questions immediately.
  useEffect(() => {
    if (peekHandoff(HANDOFF_CHALLENGE_AUTOSTART) !== "1") {
      clearHandoff(HANDOFF_CHALLENGE_DIFFICULTY);
      return undefined;
    }
    // Flags are cleared only when the start fires: StrictMode's mount/unmount/
    // remount cancels the first timer, and the remount must still see them.
    const t = setTimeout(() => {
      clearHandoff(HANDOFF_CHALLENGE_DIFFICULTY);
      clearHandoff(HANDOFF_CHALLENGE_AUTOSTART);
      startChallenge();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      // Si el grado y la edad no cuadran manda la edad, y «Fácil» baja un grado.
      const grade = challengeGrade({
        grade: studentGrade,
        age: studentAge,
        difficulty: difficulty.id,
      });
      const curriculoSubject = CURRICULO_ID_BY_CHALLENGE[subject.id];
      const dbas = curriculoSubject
        ? pickDbaSequence(curriculoSubject, grade, difficulty.questions)
        : [];

      const prompt = buildChallengePrompt(
        subject,
        difficulty,
        grade,
        difficulty.questions,
        dbas,
      );
      const result = await callDeepseekSmartboard(prompt, {
        isJson: true,
        temperature: 0.8,
        maxTokens: 2500,
      });
      if (!result?.questions?.length)
        throw new Error(
          "La IA no alcanzó a preparar tus preguntas. Toca «Empezar» otra vez.",
        );
      // Se descartan las preguntas que citan una gráfica o tabla que no se ve.
      // Si la IA respetó el orden de los DBA se filtran en paralelo para no
      // perder la correspondencia pregunta–tema.
      const aligned = dbas.length === result.questions.length;
      const { questions: usable, indexes } = keepSelfContained(
        result.questions,
      );
      const minUsable = Math.ceil(difficulty.questions / 2);
      if (usable.length < minUsable)
        throw new Error(
          "Algunas preguntas no se entendían sin una imagen. Toca «Empezar» otra vez.",
        );
      setQuestions(usable);
      // Solo se usa la secuencia de DBA si la IA devolvió el mismo número de
      // preguntas que se pidieron por DBA — si no coincide, no podemos confiar
      // en el orden y el reto sigue funcionando sin tracking por tema.
      setDbaSequence(aligned ? indexes.map((i) => dbas[i]) : []);
      setAnswers([]);
      setCurrentIndex(0);
      startTimeRef.current = Date.now();
      setPhase("playing");
      track(EVENTS.MISSION_STARTED, {
        mission_type: "challenge",
        subject: subject.id,
        difficulty: difficulty.id,
      });
    } catch (err) {
      setError(err.message || "Error generando el reto");
    } finally {
      setLoading(false);
    }
  }, [subject, difficulty, studentGrade, studentAge]);

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
        logPractice({
          type: "reto",
          subject: CURRICULO_ID_BY_CHALLENGE[subject.id],
          challengeId: subject.id,
          difficulty: difficulty.id,
          score,
        });

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
    timeLimit: TIME_LIMIT_BY_AGE[ageGroup] ?? 45,
    autoRead: ageGroup === "early",
  };
}
