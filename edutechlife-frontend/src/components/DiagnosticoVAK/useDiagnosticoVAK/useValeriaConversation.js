import { useEffect, useRef, useState } from "react";
import { getQuestionsByAge, getVakMode } from "../../../data/vakQuestions";
import { prefetchValentina } from "../../../utils/speech";
import {
  VALENTINA_MESSAGES,
  idleNudge,
  questionOpener,
} from "../../../utils/valentinaMessages";
import { MOOD_MESSAGES, VALENTINA_RESULT_DELAY_MS } from "./constants";

// Si responde antes de esto varias veces seguidas, Valeria le pide calma.
const FAST_ANSWER_MS = 3000;
const FAST_STREAK = 3;
// Tiempo sin responder (con Valeria ya callada) antes de ofrecer ayuda.
const IDLE_NUDGE_MS = 20000;
const MAX_IDLE_NUDGES = 3;
// Espera a que termine de escribir el nombre antes de preparar el saludo.
const GREETING_PREFETCH_DELAY_MS = 800;

const questionText = (q) => `${q.context} ${q.text}`;

/**
 * La conversación de Valeria con el estudiante durante el ADN de Aprendizaje:
 * qué dice en cada pregunta (y en pantalla), cómo reacciona al ánimo, a volver
 * atrás, a retomar, a quedarse quieto o a responder muy rápido, y el cierre.
 * Nunca bloquea las respuestas.
 */
export default function useValeriaConversation({
  phase,
  currentQuestion,
  ageQuestions,
  valeriaEnabled,
  setValeriaEnabled,
  studentName,
  studentAge,
  studentMood,
  diagnosis,
  isValentinaSpeaking,
  readQuestionWithOptions,
  speakAsValentina,
  stopSpeaking,
  handleAnswer,
  handleMoodSelect,
}) {
  // Lo que Valeria dice al abrir la pregunta, también visible en pantalla.
  const [valeriaLine, setValeriaLine] = useState("");

  const lastRef = useRef({ index: null, ctx: null, voiceOn: false });
  const resumedRef = useRef(false);
  const shownAtRef = useRef(0);
  const fastStreakRef = useRef(0);
  const slowNoticeRef = useRef({ pending: false, given: false });
  const nudgesRef = useRef({ count: 0, asked: new Set() });

  const age = parseInt(studentAge, 10) || 12;

  // ---------- saludo listo antes de empezar ----------
  useEffect(() => {
    if (phase !== "calibration" || !valeriaEnabled) return undefined;
    if (!studentName.trim() || !studentMood || !studentAge) return undefined;
    if (getVakMode(studentAge) !== "explorer") return undefined;
    const timer = setTimeout(() => {
      const questions = getQuestionsByAge(age);
      const first = questions[0];
      if (!first) return;
      prefetchValentina(
        VALENTINA_MESSAGES.all.readQuestion(
          questionText(first),
          first.options,
          {
            index: 0,
            total: questions.length,
            name: studentName,
            age: studentAge,
            mood: studentMood,
            mode: "forward",
          },
        ),
        age,
      );
    }, GREETING_PREFETCH_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, studentName, studentAge, studentMood, valeriaEnabled]);

  // ---------- lectura de cada pregunta ----------
  useEffect(() => {
    if (phase !== "test") {
      lastRef.current = { index: null, ctx: null, voiceOn: false };
      setValeriaLine("");
      return undefined;
    }
    const q = ageQuestions[currentQuestion];
    if (!q) return undefined;

    const prev = lastRef.current;
    const sameQuestion = prev.index === currentQuestion && prev.ctx;
    let ctx = prev.ctx;
    if (!sameQuestion) {
      let mode = "forward";
      if (resumedRef.current) mode = "resume";
      else if (prev.index !== null && currentQuestion < prev.index)
        mode = "back";
      const slowDown =
        mode === "forward" &&
        currentQuestion > 0 &&
        slowNoticeRef.current.pending;
      if (slowDown) slowNoticeRef.current.pending = false;
      resumedRef.current = false;
      ctx = {
        index: currentQuestion,
        total: ageQuestions.length,
        name: studentName,
        age: studentAge,
        mood: studentMood,
        mode,
        slowDown,
      };
      shownAtRef.current = Date.now();
      setValeriaLine(questionOpener(ctx));
    }
    // Activó la voz en una pregunta que ya estaba en pantalla: solo la lee.
    // Si la voz ya estaba activa, es el mismo efecto otra vez (modo estricto
    // de React) y repite lo mismo.
    const speakCtx =
      sameQuestion && !prev.voiceOn ? { ...ctx, mode: "plain" } : ctx;
    lastRef.current = { index: currentQuestion, ctx, voiceOn: valeriaEnabled };
    if (!valeriaEnabled) return undefined;

    readQuestionWithOptions(questionText(q), q.options, speakCtx);

    // La siguiente queda lista mientras responde esta: Valeria contesta sin espera.
    const next = ageQuestions[currentQuestion + 1];
    if (next) {
      prefetchValentina(
        VALENTINA_MESSAGES.all.readQuestion(questionText(next), next.options, {
          ...ctx,
          index: currentQuestion + 1,
          mode: "forward",
          slowDown: false,
        }),
        age,
      );
    }
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, phase, valeriaEnabled, ageQuestions]);

  // ---------- si se queda quieto: sin presión, ofrece repetir ----------
  useEffect(() => {
    const nudges = nudgesRef.current;
    if (
      phase !== "test" ||
      !valeriaEnabled ||
      isValentinaSpeaking ||
      nudges.count >= MAX_IDLE_NUDGES ||
      nudges.asked.has(currentQuestion)
    )
      return undefined;
    const timer = setTimeout(() => {
      nudges.asked.add(currentQuestion);
      nudges.count += 1;
      const text = idleNudge(studentAge, studentName);
      setValeriaLine(text);
      speakAsValentina(text);
    }, IDLE_NUDGE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQuestion, valeriaEnabled, isValentinaSpeaking]);

  // Al empezar, deja listo el audio de la ayuda para que suene al instante.
  useEffect(() => {
    if (phase !== "test" || !valeriaEnabled) return;
    nudgesRef.current = { count: 0, asked: new Set() };
    prefetchValentina(idleNudge(studentAge, studentName), age);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "test"]);

  // ---------- cierre ----------
  useEffect(() => {
    if (phase !== "result" || !valeriaEnabled || !diagnosis) return undefined;
    const timer = setTimeout(() => {
      speakAsValentina(
        VALENTINA_MESSAGES.all.resultsShort(
          diagnosis.studentName || studentName || "",
          diagnosis.predominantStyle || "visual",
          diagnosis.secondaryStyle,
          { age: diagnosis.studentAge || studentAge, mood: studentMood },
        ),
      );
    }, VALENTINA_RESULT_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, valeriaEnabled, diagnosis]);

  // ---------- acciones del estudiante ----------
  const answer = (option) => {
    const quick = Date.now() - shownAtRef.current < FAST_ANSWER_MS;
    fastStreakRef.current = quick ? fastStreakRef.current + 1 : 0;
    const notice = slowNoticeRef.current;
    if (fastStreakRef.current >= FAST_STREAK && !notice.given) {
      notice.pending = true;
      notice.given = true;
    }
    handleAnswer(option);
  };

  // Responde en voz alta a cómo se siente (los más pequeños, con la voz activa).
  const selectMood = (moodValue) => {
    handleMoodSelect(moodValue);
    if (valeriaEnabled && studentAge && getVakMode(studentAge) === "explorer") {
      speakAsValentina(MOOD_MESSAGES[moodValue] || MOOD_MESSAGES.neutral);
    }
  };

  const listenToQuestion = () => {
    const q = ageQuestions[currentQuestion];
    if (!q) return;
    if (!valeriaEnabled) {
      // Al activar la voz, el efecto de lectura dice la pregunta.
      setValeriaEnabled(true);
      return;
    }
    readQuestionWithOptions(questionText(q), q.options, {
      ...(lastRef.current.ctx || {}),
      index: currentQuestion,
      total: ageQuestions.length,
      age: studentAge,
      mode: "repeat",
    });
  };

  const markResumed = () => {
    resumedRef.current = true;
  };

  const resetConversation = () => {
    fastStreakRef.current = 0;
    slowNoticeRef.current = { pending: false, given: false };
  };

  return {
    valeriaLine,
    answer,
    selectMood,
    listenToQuestion,
    markResumed,
    resetConversation,
  };
}
