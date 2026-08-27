import { useState, useCallback, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseekSmartboard } from "../../utils/api";
import { speakTextConversational, stopSpeech } from "../../utils/speech";
import { stripEmoji } from "./daniTutorChat/DaniVoiceController";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useCompetencyTracking } from "../../hooks/useCompetencyTracking";
import { useTranslation } from "../../i18n/I18nProvider";
import { getSubjects, getDifficulties, dc } from "./oralExamUtils";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";
import OralExamSetup from "./OralExamSetup";
import OralExamConversation from "./OralExamConversation";
import OralExamQuestion from "./OralExamQuestion";
import OralExamResults from "./OralExamResults";

const OralExamSimulator = memo(({ onTabChange }) => {
  const {
    darkMode: dm,
    addPoints,
    activeStudyDeck,
    studentAge,
  } = useSmartBoardKids();
  const { trackActivity } = useCompetencyTracking();

  const studentName = (() => {
    try {
      return localStorage.getItem("student_name") || "";
    } catch {
      return "";
    }
  })();
  const studentGrade = (() => {
    try {
      return localStorage.getItem("student_grade") || "";
    } catch {
      return "";
    }
  })();
  const studentAgeVal =
    studentAge ||
    (() => {
      try {
        const v = localStorage.getItem("student_age");
        return v ? Number(v) : null;
      } catch {
        return null;
      }
    })();

  const { t } = useTranslation();
  const SUBJECTS = getSubjects(t);
  const DIFFICULTIES = getDifficulties(t);

  const [phase, setPhase] = useState("setup");
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);
  const [emotionalFeedback, setEmotionalFeedback] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenIdx = useRef(-1);

  const hasDeck = !!activeStudyDeck?.cards?.length;
  const deckContext = hasDeck
    ? activeStudyDeck.cards
        .slice(0, 10)
        .map((c) => `• ${c.front}: ${c.back}`)
        .join("\n")
    : null;

  const generateExam = useCallback(async () => {
    setLoading(true);
    try {
      let prompt;
      if (hasDeck) {
        prompt = `Eres Dani, tutora IA de EdutechLife. El estudiante está repasando el tema "${activeStudyDeck.title}". Aquí están sus tarjetas de estudio:
${deckContext}

Genera una conversación de repaso oral con 4 preguntas basadas en esas tarjetas. Las primeras 3 son de selección múltiple (4 opciones A-D, 1 correcta). La última es abierta. Habla de forma amigable como Dani. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave", "explanation": "..." }
  ]
}`;
      } else {
        prompt = `Genera un repaso oral conversacional de ${subject.label} nivel ${difficulty.label} para un estudiante colombiano de grado 6-7. Dani hace 4 preguntas amigables. Las primeras 3 son opción múltiple con 4 opciones (A, B, C, D) y solo 1 correcta. La última es una pregunta abierta. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave que debe incluir la respuesta", "explanation": "..." }
  ]
}`;
      }
      const res = await callDeepseekSmartboard(
        [{ role: "user", content: prompt }],
        {
          temperature: 0.7,
          maxTokens: 1500,
          isJson: true,
        },
      );
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      setQuestions(parsed.questions || []);
      setPhase("exam");
      setCurrentQ(0);
      setAnswers([]);
      setFeedback(null);
    } catch (e) {
      console.warn("Error generating repaso:", e);
    }
    setLoading(false);
  }, [subject, difficulty, hasDeck, deckContext, activeStudyDeck]);

  // Auto-speak Dani messages; stripEmoji keeps audio clean for kids 6-16
  useEffect(() => {
    const latestMsg = chatMessages[chatMessages.length - 1];
    if (
      latestMsg?.role === "dani" &&
      lastSpokenIdx.current < chatMessages.length - 1
    ) {
      lastSpokenIdx.current = chatMessages.length - 1;
      setIsSpeaking(true);
      speakTextConversational(
        stripEmoji(latestMsg.text),
        "dani",
        () => setIsSpeaking(false),
        () => setIsSpeaking(false),
      );
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const buildChatMessages = useCallback(
    (history) => {
      const topic = hasDeck ? activeStudyDeck.title : subject?.label;
      const level = difficulty?.label || "básico";
      const deckLine = hasDeck
        ? `\nTarjetas de estudio del alumno:\n${deckContext}`
        : "";
      const identityParts = [];
      if (studentName)
        identityParts.push(`Se llama ${studentName.split(" ")[0]}`);
      if (studentAgeVal) identityParts.push(`tiene ${studentAgeVal} años`);
      if (studentGrade) identityParts.push(`está en grado ${studentGrade}`);
      const studentLine = identityParts.length
        ? `\nDATO DEL ESTUDIANTE: ${identityParts.join(", ")}. YA SABES SU NOMBRE — NO lo pidas de nuevo.`
        : "";
      const system = `Eres Dani, tutora de IA amigable y entusiasta de EdutechLife para niños 6-16 años (Colombia).${studentLine}

TU OBJETIVO: Explicar "${topic}" (nivel ${level}) de forma conversacional, sin examinar.

PRINCIPIOS CLAVE:
1. SER CLARA: Usa palabras simples. Si necesitas términos técnicos, explícalos con analogías.
2. SER EMPÁTICA: Reconoce cuando algo es difícil. Anima sin presionar. "Eso que preguntas es muy bueno" > "Estás equivocado".
3. USAR EJEMPLOS VIVOS: Arepas, fútbol, redes sociales, videojuegos, familia, escuela — cosas que el niño ve a diario.
4. HACER PREGUNTAS ABIERTAS: En lugar de "¿Eso es correcto?", pregunta "¿Qué pasaría si...?" o "¿Cómo lo usarías tú?".
5. MOTIVAR LA CURIOSIDAD: "Buena pregunta, déjame contarte más..." > simplemente responder.
6. MENSAJES NATURALES: 2-4 frases, como una conversación real. Evita listas numeradas.
7. SIN PRESIÓN: No califiques, no digas "incorrecto". Di "Mmm, pensemos juntas...".
8. USAR EL NOMBRE: Usa el nombre del estudiante ocasionalmente para hacer la conversación más personal y cercana.

EVITAR:
- Preguntar el nombre (ya lo sabes)
- Emojis en la voz (serán removidos)
- Preguntas de opción múltiple (son examen)
- Tecnicismos sin explicar
- Respuestas largas que cansen
- Comparaciones con otros estudiantes

FOMENTAR:
- Crecimiento sin miedo ("Hoy aprendes esto; mañana entenderás más")
- Pensamiento crítico y creatividad
- Mencionar el nombre del estudiante para personalizar

Escribe solo en español, de forma conversacional.${deckLine}`;
      return [
        { role: "system", content: system },
        ...history.map((m) => ({
          role: m.role === "dani" ? "assistant" : "user",
          content: m.text,
        })),
      ];
    },
    [
      hasDeck,
      activeStudyDeck,
      subject,
      difficulty,
      deckContext,
      studentName,
      studentGrade,
      studentAgeVal,
    ],
  );

  const startConversation = useCallback(async () => {
    setChatLoading(true);
    setPhase("conversar");
    setChatMessages([]);
    track(EVENTS.ACTIVITY_STARTED, {
      type: "oral_review",
      subject: hasDeck ? activeStudyDeck?.title : subject?.label,
    });
    try {
      const greeting = studentName
        ? `Hola Dani, soy ${studentName.split(" ")[0]}. Explícame este tema para empezar.`
        : "Hola Dani, explícame este tema para empezar.";
      const seed = [
        ...buildChatMessages([]),
        { role: "user", content: greeting },
      ];
      const res = await callDeepseekSmartboard(seed, {
        temperature: 0.7,
        maxTokens: 400,
      });
      const text = typeof res === "string" ? res : res?.result || String(res);
      setChatMessages([{ role: "dani", text: text.trim() }]);
    } catch (e) {
      console.warn("Error iniciando conversación:", e);
      setChatMessages([
        {
          role: "dani",
          text: "¡Ups! No pude conectarme ahora mismo. Intenta de nuevo en un momentito. 😊",
        },
      ]);
    }
    setChatLoading(false);
  }, [buildChatMessages, studentName]);

  const sendChatMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const nextHistory = [...chatMessages, { role: "user", text }];
    setChatMessages(nextHistory);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await callDeepseekSmartboard(buildChatMessages(nextHistory), {
        temperature: 0.7,
        maxTokens: 400,
      });
      const reply = typeof res === "string" ? res : res?.result || String(res);
      setChatMessages([...nextHistory, { role: "dani", text: reply.trim() }]);
      addPoints?.(2, t("oral.points_desc", { subject: subject?.label || "" }));
    } catch (e) {
      console.warn("Error en conversación:", e);
      setChatMessages([
        ...nextHistory,
        {
          role: "dani",
          text: "Perdona, no te escuché bien. ¿Puedes repetirlo? 😊",
        },
      ]);
    }
    setChatLoading(false);
  }, [
    chatInput,
    chatLoading,
    chatMessages,
    buildChatMessages,
    addPoints,
    subject,
    t,
  ]);

  const handleAnswer = useCallback(() => {
    const q = questions[currentQ];
    let isCorrect = false;
    let answerText = "";
    if (q.type === "multiple") {
      isCorrect = selectedOption === q.correct;
      answerText = selectedOption;
    } else {
      answerText = openAnswer;
      isCorrect = openAnswer.trim().length > 10;
    }
    const newAnswers = [
      ...answers,
      { questionIdx: currentQ, answer: answerText, correct: isCorrect },
    ];
    setAnswers(newAnswers);
    setFeedback({ correct: isCorrect, explanation: q.explanation });
    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ((prev) => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
        setOpenAnswer("");
      }, 2000);
    } else {
      setTimeout(() => {
        const correctCount = newAnswers.filter((a) => a.correct).length;
        const grade = Math.round((correctCount / questions.length) * 100);
        const earnedPoints = correctCount * 10;
        addPoints(
          earnedPoints,
          t("oral.points_desc", { subject: subject.label }),
        );
        setResults({
          correctCount,
          total: questions.length,
          grade,
          earnedPoints,
        });
        setAnimateScore(true);
        setPhase("results");
        track(EVENTS.ACTIVITY_COMPLETED, {
          type: "oral_exam",
          subject: subject?.label,
          grade,
        });
        if (subject?.id)
          trackActivity({ subject: subject.id, score: grade / 100 });
      }, 2000);
    }
  }, [
    currentQ,
    questions,
    selectedOption,
    openAnswer,
    answers,
    addPoints,
    subject,
    t,
    trackActivity,
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#A855F7] flex items-center justify-center text-lg shadow-md">
          🗣️
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            {t("oral.title")}
          </h3>
          <p
            className={`text-xs ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            {hasDeck
              ? t("oral.reviewing_deck", { title: activeStudyDeck.title })
              : t("oral.subtitle_no_deck")}
          </p>
        </div>
      </motion.div>

      {hasDeck && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">{t("oral.active_deck")}</p>
              <p className="font-bold">{activeStudyDeck.title}</p>
              <p className="text-xs text-white/70">
                {t("oral.cards_count", { count: activeStudyDeck.cards.length })}
              </p>
            </div>
            <motion.button
              onClick={startConversation}
              disabled={chatLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm disabled:opacity-50 whitespace-nowrap"
            >
              {chatLoading ? t("oral.loading") : t("oral.start_review")}
            </motion.button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {phase === "setup" && !hasDeck && (
          <OralExamSetup
            key="setup"
            dm={dm}
            hasDeck={hasDeck}
            subject={subject}
            difficulty={difficulty}
            chatLoading={chatLoading}
            SUBJECTS={SUBJECTS}
            DIFFICULTIES={DIFFICULTIES}
            setSubject={setSubject}
            setDifficulty={setDifficulty}
            startConversation={startConversation}
            onTabChange={onTabChange}
          />
        )}
        {phase === "conversar" && (
          <OralExamConversation
            key="conversar"
            dm={dm}
            chatMessages={chatMessages}
            chatLoading={chatLoading}
            chatInput={chatInput}
            isSpeaking={isSpeaking}
            setChatInput={setChatInput}
            sendChatMessage={sendChatMessage}
            setPhase={setPhase}
            setChatMessages={setChatMessages}
            setSubject={setSubject}
            setDifficulty={setDifficulty}
            onTabChange={onTabChange}
          />
        )}
        {phase === "exam" && questions[currentQ] && (
          <OralExamQuestion
            key="exam"
            dm={dm}
            questions={questions}
            currentQ={currentQ}
            feedback={feedback}
            selectedOption={selectedOption}
            openAnswer={openAnswer}
            setSelectedOption={setSelectedOption}
            setOpenAnswer={setOpenAnswer}
            handleAnswer={handleAnswer}
          />
        )}
        {phase === "results" && results && (
          <OralExamResults
            key="results"
            dm={dm}
            results={results}
            animateScore={animateScore}
            emotionalFeedback={emotionalFeedback}
            hasDeck={hasDeck}
            setEmotionalFeedback={setEmotionalFeedback}
            setPhase={setPhase}
            setResults={setResults}
            setAnswers={setAnswers}
            setSubject={setSubject}
            setDifficulty={setDifficulty}
            onTabChange={onTabChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

OralExamSimulator.displayName = "OralExamSimulator";
export { OralExamSimulator };
export default OralExamSimulator;
