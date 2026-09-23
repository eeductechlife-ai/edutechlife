import { memo, useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dc } from "./oralExamUtils";
import { useTranslation } from "../../i18n/I18nProvider";

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const OralExamQuestion = memo(
  ({
    dm,
    questions,
    currentQ,
    feedback,
    selectedOption,
    openAnswer,
    setSelectedOption,
    setOpenAnswer,
    handleAnswer,
  }) => {
    const { t } = useTranslation();
    const q = questions[currentQ];
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState(null);
    const hasSpeech = !!SpeechRecognition;

    useEffect(() => {
      setIsListening(false);
      recognitionRef.current?.abort();
      setMicError(null);
    }, [currentQ]);

    useEffect(() => () => recognitionRef.current?.abort(), []);

    const startListening = useCallback(() => {
      if (!SpeechRecognition || isListening || feedback) return;
      setMicError(null);
      const rec = new SpeechRecognition();
      rec.lang = "es-CO";
      rec.continuous = false;
      rec.interimResults = false;
      recognitionRef.current = rec;
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim();
        setOpenAnswer((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };
      rec.onerror = (e) => {
        setIsListening(false);
        if (e.error === "not-allowed") setMicError("Permite el micrófono para responder por voz.");
        else if (e.error !== "no-speech") setMicError("No te escuché. ¡Intenta de nuevo!");
      };
      rec.onend = () => setIsListening(false);
      rec.start();
    }, [isListening, feedback, setOpenAnswer]);

    const stopListening = useCallback(() => {
      recognitionRef.current?.stop();
      setIsListening(false);
    }, []);

    if (!q) return null;

    return (
      <motion.div
        key="exam"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQ + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span
            className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
          >
            {currentQ + 1}/{questions.length}
          </span>
        </div>

        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl border ${dc(dm, "bg-[#1E293B] border-[#334155]", "bg-white border-[#E2E8F0] shadow-sm")}`}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">
              {q.type === "multiple" ? "❓" : "✍️"}
            </span>
            <div>
              <p
                className={`text-xs font-semibold mb-1 ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
              >
                {q.type === "multiple"
                  ? t("oral.multiple_choice")
                  : t("oral.open_question")}
              </p>
              <p
                className={`text-base font-semibold ${dc(dm, "text-white", "text-[#1E293B]")}`}
              >
                {q.question}
              </p>
            </div>
          </div>

          {q.type === "multiple" ? (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      !feedback && setSelectedOption(opt.charAt(0))
                    }
                    disabled={!!feedback}
                    className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all flex items-center gap-3 ${
                      feedback
                        ? opt.charAt(0) === q.correct
                          ? "border-green-400 bg-green-50 text-green-700"
                          : selectedOption === opt.charAt(0)
                            ? "border-red-400 bg-red-50 text-red-700"
                            : dc(
                                dm,
                                "border-[#334155] opacity-50",
                                "border-[#E2E8F0] opacity-50",
                              )
                        : selectedOption === opt.charAt(0)
                          ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                          : dc(
                              dm,
                              "border-[#334155] hover:border-[#4DA8C4]/50",
                              "border-[#E2E8F0] hover:border-[#4DA8C4]/50",
                            )
                    } ${dc(dm, "text-[#CBD5E1]", "text-[#475569]")}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        feedback && opt.charAt(0) === q.correct
                          ? "bg-green-400 text-white"
                          : feedback && selectedOption === opt.charAt(0)
                            ? "bg-red-400 text-white"
                            : dc(
                                dm,
                                "bg-[#334155] text-[#94A3B8]",
                                "bg-[#F1F5F9] text-[#64748B]",
                              )
                      }`}
                    >
                      {letter}
                    </span>
                    {opt.substring(3)}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                disabled={!!feedback}
                placeholder={isListening ? "Escuchando tu respuesta..." : t("oral.answer_placeholder")}
                rows={4}
                className={`w-full p-3 rounded-xl border text-sm resize-none ${
                  feedback
                    ? "border-green-400 bg-green-50"
                    : dc(
                        dm,
                        "bg-[#0F172A] border-[#334155] text-white",
                        "bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]",
                      )
                } focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]`}
              />
              {hasSpeech && !feedback && (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    whileTap={{ scale: 0.88 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: isListening ? "rgba(239,71,111,0.12)" : dc(dm, "#F1F5F9", "#1E2E4A"),
                      border: isListening ? "1.5px solid rgba(239,71,111,0.4)" : "1.5px solid transparent",
                      color: isListening ? "#EF476F" : dc(dm, "#64748B", "#94A3B8"),
                    }}
                  >
                    {isListening ? (
                      <>
                        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>⏹</motion.span>
                        Detener
                      </>
                    ) : (
                      <>🎙️ Responder con voz</>
                    )}
                  </motion.button>
                  {micError && <p className="text-xs" style={{ color: "#EF476F" }}>{micError}</p>}
                </div>
              )}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(239,71,111,0.07)", border: "1px solid rgba(239,71,111,0.2)" }}
                >
                  {[1,2,3,4,3,2,1].map((h, i) => (
                    <motion.div key={i} className="w-1 rounded-full" style={{ height: `${h*3+3}px`, background: "#EF476F" }}
                      animate={{ scaleY: [1, 1.8, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }} />
                  ))}
                  <span className="text-xs font-semibold ml-1" style={{ color: "#EF476F" }}>Escuchando...</span>
                </motion.div>
              )}
            </div>
          )}

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl ${feedback.correct ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
              >
                <p className="text-sm font-bold mb-1">
                  {feedback.correct ? t("oral.correct") : t("oral.incorrect")}
                </p>
                <p className="text-xs text-[#64748B]">{feedback.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback && (
            <motion.button
              onClick={handleAnswer}
              disabled={
                q.type === "multiple"
                  ? !selectedOption
                  : openAnswer.trim().length < 3
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {currentQ < questions.length - 1
                ? t("oral.answer_continue")
                : t("oral.finish_exam")}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    );
  },
);

OralExamQuestion.displayName = "OralExamQuestion";
export default OralExamQuestion;
