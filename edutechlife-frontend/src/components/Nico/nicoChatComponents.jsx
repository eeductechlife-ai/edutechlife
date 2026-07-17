import React from "react";
import { Bot, Volume2, VolumeX, RotateCcw, X } from "lucide-react";
import { COLORS } from "./nicoColors";

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
          title="Nueva Conversación"
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
