import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import DaniAvatar from "../../dani/DaniAvatar";
import ChartRenderer from "../../dani/ChartRenderer";
import VideoEmbed from "../../dani/VideoEmbed";
import MessageBubble from "../../dani/MessageBubble";

const DaniChatMessages = memo(
  ({ daniChatHistory, streamingMessage, isTyping, darkMode, messagesEndRef }) => {
    const { t } = useTranslation();
    return (
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-2 ${
          darkMode ? "scrollbar-thin scrollbar-thumb-[#334155]" : ""
        }`}
        role="log"
        aria-live="polite"
        aria-label={t('dani.messages_label')}
      >
        {daniChatHistory.map((msg, index) => {
          if (msg.type === "chart") {
            return (
              <ChartRenderer
                key={msg.id || msg.timestamp || index}
                chartData={msg.data}
                darkMode={darkMode}
              />
            );
          }
          if (msg.type === "video") {
            return (
              <VideoEmbed
                key={msg.id || msg.timestamp || index}
                videoData={msg.data}
                darkMode={darkMode}
              />
            );
          }
          return (
            <MessageBubble
              key={msg.id || msg.timestamp || index}
              message={msg}
              isDani={msg.role === "assistant"}
              darkMode={darkMode}
            />
          );
        })}
        {streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="mr-3 mt-1 flex-shrink-0" aria-hidden="true">
              <DaniAvatar />
            </div>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-md shadow-sm ${
                darkMode
                  ? "bg-[#1E293B] border border-[#334155] text-[#E2E8F0]"
                  : "bg-white border border-[#E2E8F0] text-[#004B63]"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {streamingMessage}
                <motion.span
                  className="inline-block w-1.5 h-4 bg-[#4DA8C4] ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  aria-label={t('dani.status_writing')}
                />
              </p>
            </div>
          </motion.div>
        )}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div
              className={`rounded-2xl rounded-tl-md px-4 py-3 shadow-sm ${
                darkMode
                  ? "bg-[#1E293B] border border-[#334155]"
                  : "bg-white border border-[#E2E8F0]"
              }`}
            >
              <div className="flex gap-1" aria-label={t('dani.status_writing')}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#4DA8C4] rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  },
);

DaniChatMessages.displayName = "DaniChatMessages";

export default DaniChatMessages;
