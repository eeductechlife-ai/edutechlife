import React, { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, AlertCircle, Loader } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const ParentAIChatWidget = memo(({
  studentName = 'tu hijo/a',
  conversationId = null,
  onSendMessage = async () => {},
  onClose = () => {},
  messages = [],
  loading = false,
  className = '',
}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || isSending) return;

    const messageText = input.trim();
    setInput('');
    setIsSending(true);
    setError(null);

    try {
      await onSendMessage(messageText);
    } catch (err) {
      setError(err.message || 'Error al enviar mensaje');
      setInput(messageText); // Restore input on error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`${className}`}
    >
      <GlassCard className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Dani</h3>
              <p className="text-xs text-gray-500">Asesor de aprendizaje</p>
            </div>
          </div>

          <motion.button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Inicia una conversación sobre el progreso de {studentName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Puedo ayudarte a comprender mejor su aprendizaje
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] px-3 py-2 rounded-lg text-sm
                      ${message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                      }
                    `}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg rounded-bl-none border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-xs">Dani está escribiendo...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <form onSubmit={handleSend} className="pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isSending || loading}
              className="
                flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:bg-gray-100 disabled:text-gray-500
              "
            />

            <motion.button
              type="submit"
              disabled={!input.trim() || isSending || loading}
              className={`
                p-2 rounded-lg transition-all
                ${input.trim() && !isSending && !loading
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400'
                }
              `}
              whileHover={input.trim() && !isSending && !loading ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isSending && !loading ? { scale: 0.95 } : {}}
            >
              {isSending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Character Count */}
          <p className="text-xs text-gray-400 mt-2 text-right">
            {input.length}/5000
          </p>
        </form>

        {/* Footer Tips */}
        <motion.div
          className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-medium">Preguntas útiles:</p>
          <p className="mt-1">
            "¿Cómo está {studentName}?" • "¿Dónde tiene dificultad?" • "¿Qué puedo hacer?"
          </p>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
});

ParentAIChatWidget.displayName = 'ParentAIChatWidget';

export default ParentAIChatWidget;
