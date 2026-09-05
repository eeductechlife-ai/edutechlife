import { memo, useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dc } from "./oralExamUtils";
import { stopSpeech } from "../../utils/speech";
import { useTranslation } from "../../i18n/I18nProvider";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_GLOW = "#EF476F";

// Detecta soporte de Speech Recognition
const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const OralExamConversation = memo(
  ({
    dm,
    chatMessages,
    chatLoading,
    chatInput,
    isSpeaking,
    setChatInput,
    sendChatMessage,
    setPhase,
    setChatMessages,
    setSubject,
    setDifficulty,
    onTabChange,
  }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState(null);
    const hasSpeech = !!SpeechRecognition;

    // Auto-scroll al último mensaje
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, chatLoading]);

    // Auto-grow textarea
    const handleInput = (e) => {
      setChatInput(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    // Limpiar recognition al desmontar
    useEffect(() => {
      return () => {
        recognitionRef.current?.abort();
      };
    }, []);

    const startListening = useCallback(() => {
      if (!SpeechRecognition || isListening || chatLoading) return;
      setMicError(null);

      const rec = new SpeechRecognition();
      rec.lang = "es-CO";
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      recognitionRef.current = rec;

      rec.onstart = () => setIsListening(true);

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim();
        setChatInput(transcript);
        setIsListening(false);
        // Ajustar altura del textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height =
            Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
      };

      rec.onerror = (e) => {
        setIsListening(false);
        if (e.error === "not-allowed") {
          setMicError(
            "Permite el micrófono en tu navegador para hablarle a Dani.",
          );
        } else if (e.error !== "no-speech") {
          setMicError("No te escuché bien. ¡Intenta de nuevo!");
        }
      };

      rec.onend = () => setIsListening(false);

      rec.start();
    }, [isListening, chatLoading, setChatInput]);

    const stopListening = useCallback(() => {
      recognitionRef.current?.stop();
      setIsListening(false);
    }, []);

    const cardBg = dc(dm, "#ffffff", "#1A2744");
    const cardBorder = dc(dm, "#F1F5F9", "#243152");
    const bubbleDaniText = dc(dm, "#1E293B", "#E2F0FF");
    const bubbleDaniBg = dc(dm, "#FAFBFF", "#1E2E4A");
    const inputBg = dc(dm, "#F8FAFC", "#141E35");
    const inputText = dc(dm, "#334155", "#E2F0FF");

    return (
      <motion.div
        key="conversar"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col gap-4"
      >
        {/* Chat messages */}
        <div
          className="flex flex-col gap-3 overflow-y-auto pr-1"
          style={{ maxHeight: "46vh", scrollbarWidth: "thin" }}
        >
          {chatMessages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {/* Avatar Dani */}
              {m.role === "dani" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 self-end shadow-md"
                  style={{
                    background: PRACTICE_GRADIENT,
                    boxShadow: `0 2px 8px ${PRACTICE_GLOW}40`,
                  }}
                >
                  🗣️
                </div>
              )}

              {/* Burbuja */}
              <div
                className="max-w-[80%] rounded-2xl text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        background: PRACTICE_GRADIENT,
                        color: "#ffffff",
                        padding: "10px 16px",
                        borderBottomRightRadius: "6px",
                        boxShadow: `0 4px 14px ${PRACTICE_GLOW}30`,
                        fontWeight: 500,
                      }
                    : {
                        background: bubbleDaniBg,
                        border: `1px solid ${cardBorder}`,
                        color: bubbleDaniText,
                        borderBottomLeftRadius: "6px",
                        overflow: "hidden",
                      }
                }
              >
                {/* Header Dani dentro de la burbuja */}
                {m.role === "dani" && (
                  <div
                    className="px-4 py-2 flex items-center gap-1.5"
                    style={{
                      borderBottom: `1px solid ${cardBorder}`,
                      background: dc(
                        dm,
                        "rgba(239,71,111,0.04)",
                        "rgba(239,71,111,0.08)",
                      ),
                    }}
                  >
                    <span
                      className="text-xs font-black tracking-wide"
                      style={{ color: "#EF476F" }}
                    >
                      Dani
                    </span>
                    {isSpeaking &&
                      chatMessages[chatMessages.length - 1] === m && (
                        <motion.span
                          className="text-[10px]"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ color: "#FF6B9D" }}
                        >
                          🔊
                        </motion.span>
                      )}
                  </div>
                )}

                {/* Texto del mensaje */}
                <p
                  className="whitespace-pre-wrap"
                  style={{
                    padding: m.role === "dani" ? "10px 16px 12px" : undefined,
                    lineHeight: 1.65,
                  }}
                >
                  {m.text}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {chatLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-md"
                style={{
                  background: PRACTICE_GRADIENT,
                  boxShadow: `0 2px 8px ${PRACTICE_GLOW}40`,
                }}
              >
                🗣️
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl flex gap-1.5 items-center"
                style={{
                  background: bubbleDaniBg,
                  border: `1px solid ${cardBorder}`,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "#FF6B9D" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Banner escuchando */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl"
              style={{
                background: "rgba(239,71,111,0.08)",
                border: "1.5px solid rgba(239,71,111,0.30)",
              }}
            >
              {/* Ondas animadas */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      background: PRACTICE_GRADIENT,
                      height: `${h * 4 + 4}px`,
                    }}
                    animate={{ scaleY: [1, 1.8, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                  />
                ))}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#EF476F" }}
              >
                Escuchando... habla ahora
              </span>
              <button
                onClick={stopListening}
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{
                  color: "#EF476F",
                  background: "rgba(239,71,111,0.12)",
                }}
              >
                Detener
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error de micrófono */}
        <AnimatePresence>
          {micError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-center px-3"
              style={{ color: "#EF476F" }}
            >
              {micError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div
          className="flex items-end gap-2 p-3 rounded-2xl"
          style={{
            background: inputBg,
            border: `1.5px solid ${dc(dm, "#E2E8F0", "#243152")}`,
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "#FF6B9D";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(239,71,111,0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = dc(dm, "#E2E8F0", "#243152");
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <textarea
            ref={textareaRef}
            value={chatInput}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
                if (textareaRef.current)
                  textareaRef.current.style.height = "auto";
              }
            }}
            rows={1}
            placeholder={
              isListening
                ? "Escuchando..."
                : hasSpeech
                  ? t("oral.chat_placeholder")
                  : t("oral.chat_placeholder")
            }
            disabled={chatLoading || isListening}
            className="flex-1 resize-none text-sm outline-none bg-transparent"
            style={{
              color: inputText,
              lineHeight: 1.5,
              minHeight: "24px",
              maxHeight: "120px",
            }}
          />

          {/* Botón micrófono (solo si el navegador lo soporta) */}
          {hasSpeech && (
            <motion.button
              onClick={isListening ? stopListening : startListening}
              disabled={chatLoading}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.1 }}
              title={isListening ? "Detener" : "Hablar con Dani"}
              className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center disabled:opacity-35 transition-all"
              style={{
                background: isListening
                  ? "rgba(239,71,111,0.12)"
                  : dc(dm, "#F1F5F9", "#1E2E4A"),
                border: isListening
                  ? "1.5px solid rgba(239,71,111,0.40)"
                  : "none",
              }}
            >
              {isListening ? (
                // Stop icon
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <rect
                    x="5"
                    y="5"
                    width="14"
                    height="14"
                    rx="2"
                    fill="#EF476F"
                  />
                </motion.svg>
              ) : (
                // Mic icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="9"
                    y="2"
                    width="6"
                    height="12"
                    rx="3"
                    fill={dc(dm, "#64748B", "#94A3B8")}
                  />
                  <path
                    d="M5 10a7 7 0 0 0 14 0"
                    stroke={dc(dm, "#64748B", "#94A3B8")}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12"
                    y2="21"
                    stroke={dc(dm, "#64748B", "#94A3B8")}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="9"
                    y1="21"
                    x2="15"
                    y2="21"
                    stroke={dc(dm, "#64748B", "#94A3B8")}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </motion.button>
          )}

          {/* Botón enviar */}
          <motion.button
            onClick={() => {
              sendChatMessage();
              if (textareaRef.current)
                textareaRef.current.style.height = "auto";
            }}
            disabled={chatLoading || !chatInput.trim()}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 shrink-0 rounded-xl text-white text-base flex items-center justify-center shadow-md disabled:opacity-35 transition-all"
            style={{
              background: chatInput.trim()
                ? PRACTICE_GRADIENT
                : dc(dm, "#E2E8F0", "#243152"),
              boxShadow: chatInput.trim()
                ? `0 4px 12px ${PRACTICE_GLOW}35`
                : "none",
            }}
          >
            ➤
          </motion.button>
        </div>

        {/* Hints */}
        <p
          className="text-[11px] text-center"
          style={{ color: dc(dm, "#CBD5E1", "#3A5070"), marginTop: -8 }}
        >
          {hasSpeech
            ? "🎙️ Toca el micrófono para hablar · Enter para enviar texto"
            : "Enter para enviar · Shift+Enter para nueva línea"}
        </p>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              stopSpeech();
              setPhase("setup");
              setChatMessages([]);
              setSubject(null);
              setDifficulty(null);
            }}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            style={{
              border: `1.5px solid ${dc(dm, "#E2E8F0", "#2A3A54")}`,
              color: dc(dm, "#64748B", "#94A3B8"),
              background: dc(dm, "#F8FAFC", "rgba(42,58,84,0.3)"),
            }}
          >
            ← {t("oral.change_topic")}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange?.("examenes")}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-md"
            style={{
              background: PRACTICE_GRADIENT,
              boxShadow: `0 4px 14px ${PRACTICE_GLOW}30`,
            }}
          >
            {t("oral.im_ready_exam")} →
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

OralExamConversation.displayName = "OralExamConversation";
export default OralExamConversation;
