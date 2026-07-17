import React, { Suspense } from "react";
import { Bot, User, CheckCircle, Calendar } from "lucide-react";
import { COLORS } from "./nicoColors";
import { LeadCaptureForm, AppointmentScheduler } from "./nicoConfig";
import { getQuestionSuggestions } from "./nicoContext";

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
                      ? "Tutorías"
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
                    ? "¿Cómo funciona el test VAK y cómo puedo hacerlo?"
                    : "¿Cómo puedo conocer a los tutores disponibles?";
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
              {msg.role === "user" ? "Tú" : "Nico"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {msg.isQuickResponse && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {"⚡"}
              </span>
            )}
            {msg.isCached && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {"💾"}
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
          <span style={{ color: COLORS.NAVY }}>Nico está pensando...</span>
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
            Puedo ayudarte con información sobre nuestros servicios
            educativos: VAK, STEM, tutorías y bienestar.
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
                  {"¿Te interesa saber sobre...?"}
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
                <span>{"💡"} Mostrar sugerencias de preguntas</span>
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
                    {"✅"} Información guardada exitosamente
                  </p>
                  <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                    Un asesor se contactará contigo pronto
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
                    {"📅"} Cita agendada exitosamente
                  </p>
                  <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                    Recibirás confirmación y recordatorio
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
