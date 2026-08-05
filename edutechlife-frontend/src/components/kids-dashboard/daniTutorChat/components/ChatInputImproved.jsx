import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic, X } from "lucide-react";
import "../styles/dani-colors.css";
import "../styles/chat-input-improved.css";

const ChatInputImproved = memo(
  ({
    inputText = "",
    onInputChange,
    onSendMessage,
    onMicClick,
    isListening = false,
    isTyping = false,
    darkMode = false,
    studentAge = 10,
    placeholder = "Pregúntale a Dani...",
    maxChars = 500,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClearInput = useCallback(() => {
      onInputChange({ target: { value: "" } });
    }, [onInputChange]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSendMessage(inputText);
        }
      },
      [inputText, onSendMessage],
    );

    const charPercentage = (inputText.length / maxChars) * 100;
    const isNearLimit = charPercentage > 75;

    return (
      <motion.div
        className={`chat-input-improved ${darkMode ? "dark-mode" : "light-mode"} dani-age-${studentAge <= 9 ? "6-9" : studentAge <= 13 ? "10-13" : "14-16"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className={`chat-input-container ${isFocused ? "focused" : ""}`}>
          {/* Input Wrapper */}
          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              maxLength={maxChars}
              disabled={isTyping}
              className="chat-input-field"
              aria-label="Input para preguntar a Dani"
            />

            {/* Clear Button */}
            {inputText.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={handleClearInput}
                className="input-clear-button"
                aria-label="Limpiar entrada"
                type="button"
              >
                <X size={16} />
              </motion.button>
            )}

            {/* Char Counter - animated warning */}
            {inputText.length > 0 && (
              <motion.div
                className={`char-counter ${isNearLimit ? "warning" : ""}`}
                animate={{ scale: isNearLimit ? [1, 1.1, 1] : 1 }}
                transition={{
                  duration: isNearLimit ? 0.6 : 0,
                  repeat: isNearLimit ? Infinity : 0,
                }}
              >
                <span className="char-count">
                  {inputText.length}/{maxChars}
                </span>
                {inputText.length > 0 && (
                  <motion.div
                    className="char-progress"
                    style={{
                      width: `${charPercentage}%`,
                    }}
                    animate={{
                      backgroundColor: isNearLimit ? "#ef4444" : "#06b6d4",
                    }}
                  />
                )}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="input-actions">
            {/* Microphone Button */}
            <motion.button
              onClick={onMicClick}
              disabled={isTyping}
              className={`action-button mic-button ${isListening ? "listening" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isListening ? "Detener escucha" : "Activar micrófono"}
              type="button"
            >
              <Mic size={20} strokeWidth={2} />
              {isListening && (
                <motion.span
                  className="listening-pulse"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.button>

            {/* Send Button */}
            <motion.button
              onClick={() => onSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="action-button send-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Enviar mensaje"
              type="button"
            >
              <Send size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Helper Text */}
        {!inputText && (
          <motion.p
            className="helper-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
          >
            💡 Escribe o usa el micrófono para hablar con Dani
          </motion.p>
        )}

        {/* Status Indicator */}
        {isTyping && (
          <motion.div
            className="status-indicator"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="dot" />
            <span className="dot" style={{ animationDelay: "0.2s" }} />
            <span className="dot" style={{ animationDelay: "0.4s" }} />
            <span className="status-text">Dani está escribiendo...</span>
          </motion.div>
        )}
      </motion.div>
    );
  },
);

ChatInputImproved.displayName = "ChatInputImproved";

export default ChatInputImproved;
