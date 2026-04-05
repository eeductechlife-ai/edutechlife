import { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, MessageSquare, Send, Mic, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ValentinaControlsSimplified = ({
  isSpeaking = false,
  onSpeak,
  onRepeat,
  onSendMessage,
  onToggleMode,
  onReset,
  onGiveFeedback,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage('');
    }
  };

  const handleQuickFeedback = (feedback) => {
    onGiveFeedback?.(feedback);
  };

  const quickFeedbacks = [
    { label: '👍 Entendido', value: 'understood' },
    { label: '❓ Duda', value: 'question' },
    { label: '💡 Idea', value: 'idea' },
    { label: '🎯 Listo', value: 'ready' }
  ];

  return (
    <div className={`valentina-controls ${className}`}>
      {/* Controles principales */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={onSpeak}
          className="valentina-control-button primary"
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Detener</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Escuchar</span>
            </>
          )}
        </button>

        <button
          onClick={onRepeat}
          className="valentina-control-button"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Repetir</span>
        </button>

        <button
          onClick={onToggleMode}
          className="valentina-control-button"
        >
          <X className="w-4 h-4" />
          <span>Ocultar</span>
        </button>
      </div>

      {/* Feedback rápido */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">Feedback rápido:</p>
        <div className="flex flex-wrap gap-2">
          {quickFeedbacks.map((fb) => (
            <button
              key={fb.value}
              onClick={() => handleQuickFeedback(fb.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors"
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${
              isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Indicador de grabación */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-700 font-medium">Grabando... Habla ahora</span>
        </motion.div>
      )}
    </div>
  );
};

export default ValentinaControlsSimplified;