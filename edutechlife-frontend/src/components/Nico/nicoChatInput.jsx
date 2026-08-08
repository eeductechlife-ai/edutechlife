import React from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, X } from "lucide-react";
import { COLORS } from "./nicoColors";
import { useTranslation } from "../../i18n/I18nProvider";

export function ChatInput({
  message,
  onChange,
  onKeyDown,
  onSend,
  isLoading,
  isListening,
  isSpeaking,
  interimTranscript,
  audioPermissionError,
  onVoiceInput,
  onSpeakResponse,
  onClearChat,
  onClearCache,
  inputRef,
  messages,
}) {
  const { t } = useTranslation();
  return (
    <div
      className="p-4 border-t"
      style={{
        backgroundColor: COLORS.NAVY,
        borderColor: COLORS.PETROLEUM,
      }}
    >
      {interimTranscript && (
        <div
          className="mb-3 p-3 rounded-xl animate-pulse"
          style={{
            backgroundColor: COLORS.MINT + "40",
            border: `1px solid ${COLORS.MINT}`,
          }}
        >
          <div className="flex items-center">
            <div className="flex space-x-1 mr-3">
              <div
                className="w-2 h-2 rounded-full bg-red-500 animate-ping"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-green-500 animate-ping"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: COLORS.NAVY }}
            >
              {interimTranscript}
            </span>
          </div>
        </div>
      )}

      {audioPermissionError && (
        <div
          className="mb-3 p-3 rounded-xl"
          style={{
            backgroundColor: "#FFEBEE",
            border: "1px solid #EF9A9A",
          }}
        >
          <div className="flex items-center">
            <span className="text-sm font-medium" style={{ color: "#C62828" }}>
              {t("nico.audio_blocked")}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-3">
        <button
          onClick={onVoiceInput}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isListening ? "scale-105 ring-4 ring-opacity-50" : "hover:scale-105"
          }`}
          style={{
            backgroundColor: isListening ? "#FF4757" : COLORS.PETROLEUM,
            boxShadow: isListening ? `0 0 20px ${COLORS.MINT}80` : "none",
          }}
          title={t(isListening ? "nico.stop_recording" : "nico.talk_to_nico")}
        >
          <div className="relative">
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
              </>
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </div>
        </button>

        <button
          onClick={onSpeakResponse}
          disabled={(messages || []).length === 0 || isSpeaking}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isSpeaking ? "scale-105 ring-4 ring-opacity-50" : "hover:scale-105"
          }`}
          style={{
            backgroundColor: isSpeaking ? COLORS.MINT : COLORS.CORPORATE,
            opacity: (messages || []).length === 0 ? 0.5 : 1,
            boxShadow: isSpeaking ? `0 0 20px ${COLORS.MINT}80` : "none",
          }}
          title={t(isSpeaking ? "nico.stop_voice" : "nico.listen_response")}
        >
          <div className="relative">
            {isSpeaking ? (
              <>
                <VolumeX className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
              </>
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </div>
        </button>

        <button
          onClick={onClearChat}
          className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: COLORS.PETROLEUM }}
          title={t("nico.clear_conversation")}
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={onClearCache}
          className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: COLORS.CORPORATE }}
          title={t("nico.clear_cache")}
        >
          <div className="relative">
            <span className="text-white font-bold text-sm">{"⚡"}</span>
          </div>
        </button>
      </div>

      <div className="flex space-x-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={t("nico.input_placeholder")}
          className="flex-1 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 text-sm md:text-base"
          style={{
            backgroundColor: COLORS.SOFT_BLUE,
            color: COLORS.NAVY,
            borderColor: COLORS.CORPORATE,
            minHeight: "50px",
            maxHeight: "120px",
          }}
          rows={2}
        />

        <button
          onClick={onSend}
          disabled={!message.trim() || isLoading}
          className="p-3 rounded-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: message.trim()
              ? COLORS.PETROLEUM
              : COLORS.CORPORATE,
          }}
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs" style={{ color: COLORS.MINT }}>
          {t("nico.input_hint")}
        </p>
      </div>
    </div>
  );
}
