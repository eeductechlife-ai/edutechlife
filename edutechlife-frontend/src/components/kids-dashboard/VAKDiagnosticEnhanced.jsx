import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";
import { ListenButton } from "./practicarHub/MaterialViews";
import { speakAsDani, stopDani } from "./practicarHub/daniSpeak";
import {
  questionsFor,
  answerOrder,
  CHANNEL_STYLE,
  scoreVak,
} from "./vak/vakQuestions";

// ==========================================
// ADN de Aprendizaje (VAK) — situational questions, age-adapted
// ==========================================

const LETTERS = ["A", "B", "C"];

const STYLE_INFO = {
  visual: {
    emoji: "👁️",
    name: "Visual",
    color: "#06D6A0",
    means: "Aprendes mejor viendo: imágenes, colores, mapas y videos.",
    tips: [
      "Crea mapas mentales e infografías en Practicar → Crear material",
      "Subraya con colores y dibuja lo que estudias",
    ],
  },
  auditivo: {
    emoji: "👂",
    name: "Auditivo",
    color: "#A855F7",
    means: "Aprendes mejor escuchando y conversando.",
    tips: [
      "Pídele a Dani que te lea los resúmenes en voz alta",
      "Explica en voz alta lo que estudias, como si fueras el profe",
    ],
  },
  kinestesico: {
    emoji: "🏃",
    name: "Kinestésico",
    color: "#FB8500",
    means: "Aprendes mejor haciendo, moviéndote y practicando.",
    tips: [
      "Practica con Retos y EduCards: aprendes jugando",
      "Estudia en bloques cortos con pausas activas",
    ],
  },
};

function spokenQuestion(item, order) {
  const opts = order
    .map((ch, i) => `Opción ${LETTERS[i]}: ${item.opciones[ch].texto}`)
    .join(". ");
  return `${item.contexto} ${item.pregunta} ${opts}.`;
}

const VAKDiagnosticEnhanced = ({
  vakResult: propVakResult,
  onComplete,
  onTabChange,
}) => {
  const { t } = useTranslation();
  const { vakResult: contextVakResult, ageGroup } = useIngenIAKids();
  const vakResult = propVakResult || contextVakResult;
  const questions = useMemo(() => questionsFor(ageGroup), [ageGroup]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(!!vakResult);
  const autoRead = ageGroup === "early";

  // Fire diagnostic_started once per fresh diagnostic (not when re-viewing a result)
  useEffect(() => {
    if (!vakResult) track(EVENTS.DIAGNOSTIC_STARTED, { type: "vak" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = questions[currentQuestion];
  const order = answerOrder(currentQuestion);
  const spoken = item ? spokenQuestion(item, order) : "";

  // Kids who are still learning to read hear every question.
  useEffect(() => {
    if (!autoRead || isCompleted || !spoken) return undefined;
    speakAsDani(spoken);
    return () => stopDani();
  }, [autoRead, isCompleted, spoken]);

  const handleAnswer = useCallback(
    (style) => {
      stopDani();
      const newAnswers = [...answers.slice(0, currentQuestion), style];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        return;
      }
      const result = scoreVak(newAnswers);
      const vakResultData = { ...result, completedAt: new Date() };
      setIsCompleted(true);
      track(EVENTS.DIAGNOSTIC_COMPLETED, {
        type: "vak",
        predominant_style: result.predominantStyle,
      });
      onComplete(vakResultData);
    },
    [currentQuestion, answers, onComplete, questions.length],
  );

  const goBack = () => {
    stopDani();
    setCurrentQuestion((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setIsCompleted(false);
  };

  if (isCompleted && vakResult) {
    const main = STYLE_INFO[vakResult.predominantStyle] || STYLE_INFO.visual;
    const second = vakResult.secondaryStyle
      ? STYLE_INFO[vakResult.secondaryStyle]
      : null;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] bg-white"
      >
        <div
          className="relative p-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
          }}
        >
          <div className="text-5xl mb-2" aria-hidden="true">
            {main.emoji}
          </div>
          <h3 className="!m-0 text-xl font-black !text-white drop-shadow-sm">
            {t("kid.vak.result_title")}
          </h3>
          <p className="!m-0 mt-1 text-sm text-white font-semibold">
            Tu estilo es{" "}
            <span className="font-black">
              {main.name}
              {second ? ` y ${second.name}` : ""}
            </span>
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(vakResult.scores).map(([key, value]) => {
              const info = STYLE_INFO[key] || STYLE_INFO.visual;
              return (
                <div
                  key={key}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: `${info.color}12`,
                    border: `1px solid ${info.color}33`,
                  }}
                >
                  <p
                    className="!m-0 text-xl sm:text-3xl font-black"
                    style={{ color: info.color }}
                  >
                    {value}%
                  </p>
                  <p className="!m-0 mt-0.5 text-[11px] sm:text-xs text-[#64748B]">
                    {info.emoji} {info.name}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-3 space-y-1.5">
            <p className="!m-0 text-sm font-bold text-[#9A3412]">
              {main.means}
              {second
                ? ` También aprendes bien de forma ${second.name.toLowerCase()}.`
                : ""}
            </p>
            <ul className="space-y-1">
              {main.tips.map((tip) => (
                <li key={tip} className="text-xs text-[#7C2D12] flex gap-1.5">
                  <span aria-hidden="true">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {onTabChange && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onTabChange("plan")}
                className="min-h-[48px] rounded-xl text-sm font-black text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
                }}
              >
                📋 Crear mi plan de mejora
              </button>
              <button
                type="button"
                onClick={() => onTabChange("practicar")}
                className="min-h-[48px] rounded-xl text-sm font-bold border-2 border-[#E2E8F0] text-[#1E293B]"
              >
                🎯 Practicar a mi manera
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={restart}
            className="w-full min-h-[40px] text-xs font-semibold text-[#64748B]"
          >
            🔄 Repetir mi ADN de Aprendizaje
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-[#E2E8F0]">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="!m-0 text-base sm:text-lg font-bold text-[#1E293B]">
            {t("kid.vak.diagnostic_title")}
          </h3>
          <span className="text-sm font-bold text-[#64748B] tabular-nums">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background:
                "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
            }}
            animate={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="!m-0 mt-2 text-[11px] text-[#94A3B8]">
          No hay respuestas buenas ni malas: escoge lo que harías tú. 😊
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 mb-4 flex gap-3 items-start">
            <span className="text-3xl leading-none shrink-0" aria-hidden="true">
              {item.emoji}
            </span>
            <div className="min-w-0">
              <p className="!m-0 text-sm text-[#475569] leading-snug">
                {item.contexto}
              </p>
              <p className="!m-0 mt-1 text-lg font-bold text-[#1E293B] leading-snug">
                {item.pregunta}
              </p>
            </div>
          </div>

          <div className="space-y-2.5" role="group" aria-label="Respuestas">
            {order.map((ch, i) => {
              const opt = item.opciones[ch];
              const picked = answers[currentQuestion] === CHANNEL_STYLE[ch];
              return (
                <motion.button
                  key={ch}
                  type="button"
                  onClick={() => handleAnswer(CHANNEL_STYLE[ch])}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full min-h-[56px] p-3 rounded-xl border-2 text-left !flex items-center !justify-start gap-3 transition-colors ${
                    picked
                      ? "border-[#FB8500] bg-[#FFF7ED]"
                      : "border-[#E2E8F0] bg-white hover:border-[#FB8500]/50"
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-[#FB8500]/15 text-[#C2410C] text-xs font-black flex items-center justify-center shrink-0">
                    {LETTERS[i]}
                  </span>
                  <span
                    className="text-2xl leading-none shrink-0"
                    aria-hidden="true"
                  >
                    {opt.emoji}
                  </span>
                  <span className="font-semibold text-[15px] text-[#1E293B] leading-snug">
                    {opt.texto}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goBack}
          disabled={currentQuestion === 0}
          className="min-h-[40px] px-3 rounded-xl text-sm font-bold text-[#64748B] disabled:opacity-0"
        >
          ← Anterior
        </button>
        <ListenButton
          text={spoken}
          label="Escuchar"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F1F5F9] text-[#1E293B]"
        />
      </div>
    </div>
  );
};

export { VAKDiagnosticEnhanced };
export default VAKDiagnosticEnhanced;
