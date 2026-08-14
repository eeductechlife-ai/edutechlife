import { memo } from "react";
import { motion } from "framer-motion";
import DaniAvatar from "../daniTutorChat/components/DaniAvatar";
import { getRelativeTime } from "./chatUtils";
import { useTranslation } from "../../../i18n/I18nProvider";

const LOCALE_MAP = { en: "en-US", pt: "pt-BR", es: "es-ES" };

// ==========================================
// Message Bubble Component
// ==========================================
const MessageBubble = memo(({ message, isDani, darkMode }) => {
  const { t, locale } = useTranslation();
  const time = new Date(message.timestamp).toLocaleTimeString(
    LOCALE_MAP[locale] || "es-ES",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const relativeTime = getRelativeTime(message.timestamp, locale, t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isDani ? "justify-start" : "justify-end"} mb-4`}
    >
      {isDani && (
        <div className="mr-3 mt-1 flex-shrink-0">
          <DaniAvatar />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isDani
            ? darkMode
              ? "bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-tl-md"
              : "bg-white border border-[#E2E8F0] text-[#004B63] rounded-tl-md"
            : "bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-tr-md"
        } shadow-sm`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        <p
          className={`text-[10px] mt-1 ${isDani ? "text-[#64748B]" : "text-white/70"}`}
        >
          {relativeTime}
        </p>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
