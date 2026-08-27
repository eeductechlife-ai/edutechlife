import { memo } from "react";
import { motion } from "framer-motion";
import { dc } from "./oralExamUtils";
import { stopSpeech } from "../../utils/speech";
import { useTranslation } from "../../i18n/I18nProvider";

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
    return (
      <motion.div
        key="conversar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
          {chatMessages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-br-sm"
                    : dc(
                        dm,
                        "bg-[#1E293B] text-[#E2E8F0] rounded-bl-sm",
                        "bg-white border border-[#E2E8F0] text-[#334155] rounded-bl-sm",
                      )
                }`}
              >
                {m.role === "dani" && (
                  <span className="mr-1 font-bold text-[#FF6B9D] flex items-center gap-1">
                    🗣️ Dani
                    {isSpeaking &&
                      chatMessages[chatMessages.length - 1] === m && (
                        <motion.span
                          className="text-xs"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          🔊
                        </motion.span>
                      )}
                  </span>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#FF6B9D]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
              }
            }}
            rows={1}
            placeholder={t("oral.chat_placeholder")}
            disabled={chatLoading}
            className={`flex-1 resize-none px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#4DA8C4] ${dc(
              dm,
              "bg-[#1E293B] border-[#334155] text-white",
              "bg-white border-[#E2E8F0] text-[#334155]",
            )}`}
          />
          <motion.button
            onClick={sendChatMessage}
            disabled={chatLoading || !chatInput.trim()}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-xl flex items-center justify-center shadow-md disabled:opacity-40"
          >
            ➤
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={() => {
              stopSpeech();
              setPhase("setup");
              setChatMessages([]);
              setSubject(null);
              setDifficulty(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border ${dc(
              dm,
              "border-[#334155] text-[#94A3B8]",
              "border-[#E2E8F0] text-[#64748B]",
            )}`}
          >
            ← {t("oral.change_topic")}
          </button>
          <button
            onClick={() => onTabChange?.("examenes")}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#004B63] to-[#0077B6]"
          >
            {t("oral.im_ready_exam")} →
          </button>
        </div>
      </motion.div>
    );
  },
);

OralExamConversation.displayName = "OralExamConversation";
export default OralExamConversation;
