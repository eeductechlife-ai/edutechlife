import React, { Suspense } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Bot,
  User,
  CheckCircle,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { COLORS } from "./nicoColors";
import { LeadCaptureForm, AppointmentScheduler } from "./nicoConfig";
import { getQuestionSuggestions } from "./nicoContext";

export function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-gentle-pulse safe-area-bottom flex items-center justify-center"
      style={{
        backgroundColor: COLORS.PETROLEUM,
        background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`,
      }}
    >
      <Bot className="w-8 h-8 text-white" />
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
    </button>
  );
}

export function ChatHeader({
  audioEnabled,
  onToggleAudio,
  onNewConversation,
  onClose,
}) {
  return (
    <div
      className="p-4 flex items-center justify-between"
      style={{ backgroundColor: COLORS.NAVY }}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.CORPORATE }}
          >
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: COLORS.MINT }}
          />
        </div>
        <div>
          <h3 className="font-bold text-white">Nico</h3>
          <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
            EdutechLife AI Support
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-lg transition-all duration-300 ${
            audioEnabled
              ? "scale-105 ring-2 ring-opacity-50"
              : "hover:opacity-80"
          }`}
          style={{
            backgroundColor: audioEnabled ? COLORS.MINT : COLORS.PETROLEUM,
            border: audioEnabled ? `2px solid ${COLORS.CORPORATE}` : "none",
          }}
          title={audioEnabled ? "Desactivar audio" : "Activar audio"}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-white" />
          )}
        </button>

        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg hover:opacity-80 transition"
          style={{ backgroundColor: COLORS.CORPORATE }}
          title="Nueva Conversaci\u00f3n"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:opacity-80 transition"
          style={{ backgroundColor: COLORS.PETROLEUM }}
          title="Cerrar"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function ChatOptionButtons({ options, onScheduleOption, onAskQuestion }) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex flex-col space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              if (
                option.action.startsWith("schedule_") ||
                option.action.startsWith("demo_") ||
                option.action.startsWith("trial_")
              ) {
                const interest = option.action.includes("vak")
                  ? "VAK"
                  : option.action.includes("stem")
                    ? "STEM"
                    : option.action.includes("tutoring")
                      ? "Tutor\u00edas"
                      : "Consulta general";
                onScheduleOption(interest);
              } else if (
                option.action.startsWith("info_") ||
                option.action.startsWith("learn_") ||
                option.action.startsWith("view_")
              ) {
                onAskQuestion(option.text);
              } else if (
                option.action === "test_vak" ||
                option.action === "meet_tutors"
              ) {
                const question =
                  option.action === "test_vak"
                    ? "\u00bfC\u00f3mo funciona el test VAK y c\u00f3mo puedo hacerlo?"
                    : "\u00bfC\u00f3mo puedo conocer a los tutores disponibles?";
                onAskQuestion(question);
              }
            }}
            className="text-left p-3 rounded-lg hover:scale-[1.02] transition active:scale-95 text-sm"
            style={{
              backgroundColor: COLORS.SOFT_BLUE,
              color: COLORS.NAVY,
              border: `1px solid ${COLORS.CORPORATE}`,
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg, onScheduleOption, onAskQuestion }) {
  return (
    <div
      className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
        msg.role === "user"
          ? "rounded-br-none"
          : msg.isSystem
            ? "rounded-2xl"
            : "rounded-bl-none"
      }`}
      style={{
        backgroundColor:
          msg.role === "user"
            ? COLORS.CORPORATE
            : msg.isSystem
              ? COLORS.NAVY + "40"
              : COLORS.SOFT_BLUE,
        color: msg.role === "user" ? "white" : COLORS.NAVY,
        border: msg.isSystem ? "1px solid " + COLORS.MINT + "40" : "none",
        fontStyle: msg.isSystem ? "italic" : "normal",
      }}
    >
      {!msg.isSystem && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {msg.role === "user" ? (
              <User className="w-4 h-4 mr-2" />
            ) : (
              <Bot
                className="w-4 h-4 mr-2"
                style={{ color: COLORS.PETROLEUM }}
              />
            )}
            <span className="text-xs font-semibold">
              {msg.role === "user" ? "T\u00fa" : "Nico"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {msg.isQuickResponse && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {"\u26a1"}
              </span>
            )}
            {msg.isCached && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {"\ud83d\udcbe"}
              </span>
            )}
          </div>
        </div>
      )}
      <p className="whitespace-pre-wrap text-sm mb-3">{msg.content}</p>

      {msg.hasOptions && msg.options && (
        <ChatOptionButtons
          options={msg.options}
          onScheduleOption={onScheduleOption}
          onAskQuestion={onAskQuestion}
        />
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[80%] rounded-2xl rounded-bl-none p-4"
        style={{ backgroundColor: COLORS.SOFT_BLUE }}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: COLORS.PETROLEUM }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: COLORS.CORPORATE,
                animationDelay: "0.1s",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: COLORS.MINT,
                animationDelay: "0.2s",
              }}
            />
          </div>
          <span style={{ color: COLORS.NAVY }}>Nico est\u00e1 pensando...</span>
        </div>
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  isLoading,
  showSuggestions,
  onToggleSuggestions,
  showLeadForm,
  leadCaptureContext,
  onSaveLead,
  onCancelLead,
  showLeadSuccess,
  showScheduler,
  schedulerContext,
  onSchedule,
  onCancelSchedule,
  showAppointmentSuccess,
  userContext,
  onSuggestionClick,
  onScheduleOption,
  onAskQuestion,
  messagesEndRef,
}) {
  return (
    <div
      className="flex-1 overflow-y-auto p-4"
      style={{
        backgroundColor: COLORS.NAVY,
        backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.PETROLEUM}20 0%, transparent 50%)`,
      }}
    >
      {(messages || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: COLORS.CORPORATE }}
          >
            <Bot className="w-10 h-10 text-white -mt-1" />
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: COLORS.SOFT_BLUE }}
          >
            Nico
          </h3>
          <p className="text-sm mb-6" style={{ color: COLORS.MINT }}>
            Asistente de EdutechLife
          </p>
          <p className="text-sm mb-6" style={{ color: COLORS.CORPORATE }}>
            Puedo ayudarte con informaci\u00f3n sobre nuestros servicios
            educativos: VAK, STEM, tutor\u00edas y bienestar.
          </p>
          <p className="text-xs italic mb-4" style={{ color: COLORS.MINT }}>
            Escribe tu pregunta en el campo de abajo
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <MessageBubble
                msg={msg}
                onScheduleOption={onScheduleOption}
                onAskQuestion={onAskQuestion}
              />
            </div>
          ))}

          {showSuggestions &&
            messages.length > 0 &&
            !showLeadForm &&
            !showScheduler && (
              <div className="mt-4 mb-2">
                <p className="text-xs font-medium mb-2 text-gray-500">
                  {"\u00bfTe interesa saber sobre...?"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getQuestionSuggestions(messages, userContext).map(
                    (suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="text-xs px-3 py-2 rounded-full hover:scale-105 transition active:scale-95"
                        style={{
                          backgroundColor: COLORS.SOFT_BLUE,
                          color: COLORS.NAVY,
                          border: `1px solid ${COLORS.CORPORATE}40`,
                        }}
                      >
                        {suggestion}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() => onToggleSuggestions(false)}
                  className="text-xs mt-2 text-gray-400 hover:text-gray-600"
                >
                  Ocultar sugerencias
                </button>
              </div>
            )}

          {!showSuggestions &&
            messages.length > 2 &&
            !showLeadForm &&
            !showScheduler && (
              <button
                onClick={() => onToggleSuggestions(true)}
                className="text-xs mt-2 text-gray-400 hover:text-gray-600 flex items-center"
              >
                <span>{"\ud83d\udca1"} Mostrar sugerencias de preguntas</span>
              </button>
            )}

          {showLeadForm && leadCaptureContext && (
            <div className="mb-4 animate-slideUp">
              <Suspense
                fallback={
                  <div className="p-4 text-center text-gray-500">
                    Cargando formulario...
                  </div>
                }
              >
                <LeadCaptureForm
                  userName={leadCaptureContext.userName}
                  userInterest={leadCaptureContext.userInterest}
                  onSave={onSaveLead}
                  onCancel={onCancelLead}
                  autoFocus={true}
                />
              </Suspense>
            </div>
          )}

          {showLeadSuccess && (
            <div
              className="mb-4 p-4 rounded-xl animate-fadeIn"
              style={{
                backgroundColor: COLORS.MINT + "40",
                border: `2px solid ${COLORS.MINT}`,
              }}
            >
              <div className="flex items-center">
                <CheckCircle
                  className="w-5 h-5 mr-2"
                  style={{ color: COLORS.PETROLEUM }}
                />
                <div>
                  <p className="font-medium" style={{ color: COLORS.NAVY }}>
                    {"\u2705"} Informaci\u00f3n guardada exitosamente
                  </p>
                  <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                    Un asesor se contactar\u00e1 contigo pronto
                  </p>
                </div>
              </div>
            </div>
          )}

          {showScheduler && schedulerContext && (
            <div className="mb-4 animate-slideUp">
              <Suspense
                fallback={
                  <div className="p-4 text-center text-gray-500">
                    Cargando calendario...
                  </div>
                }
              >
                <AppointmentScheduler
                  leadData={schedulerContext.leadData}
                  onSchedule={onSchedule}
                  onCancel={onCancelSchedule}
                  autoFocus={true}
                />
              </Suspense>
            </div>
          )}

          {showAppointmentSuccess && (
            <div
              className="mb-4 p-4 rounded-xl animate-fadeIn"
              style={{
                backgroundColor: COLORS.CORPORATE + "40",
                border: `2px solid ${COLORS.CORPORATE}`,
              }}
            >
              <div className="flex items-center">
                <Calendar
                  className="w-5 h-5 mr-2"
                  style={{ color: COLORS.PETROLEUM }}
                />
                <div>
                  <p className="font-medium" style={{ color: COLORS.NAVY }}>
                    {"\ud83d\udcc5"} Cita agendada exitosamente
                  </p>
                  <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                    Recibir\u00e1s confirmaci\u00f3n y recordatorio
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

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
              Audio bloqueado. Presiona el bot\u00f3n de volumen y concede
              permisos.
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
          title={isListening ? "Detener grabaci\u00f3n" : "Hablar con Nico"}
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
          title={isSpeaking ? "Detener voz" : "Escuchar respuesta de Nico"}
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
          title="Limpiar conversaci\u00f3n"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={onClearCache}
          className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: COLORS.CORPORATE }}
          title="Limpiar cach\u00e9 de respuestas"
        >
          <div className="relative">
            <span className="text-white font-bold text-sm">{"\u26a1"}</span>
          </div>
        </button>
      </div>

      <div className="flex space-x-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Escribe tu mensaje aqu\u00ed..."
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
          Presiona Enter para enviar {"\u2022"} Shift+Enter para nueva
          l\u00ednea
        </p>
      </div>
    </div>
  );
}
