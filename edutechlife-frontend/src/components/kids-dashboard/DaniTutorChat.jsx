import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../../utils/api';
import { PROMPT_PSICOLOGO_VAK } from '../../constants/prompts';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import DaniAvatar3D from './DaniAvatar3D';

// ==========================================
// Dani Avatar Component - Uses DaniAvatar3D
// ==========================================
const DaniAvatar = memo(({ mood, isTyping }) => (
  <DaniAvatar3D mood={mood} isTyping={isTyping} size="md" />
));

DaniAvatar.displayName = 'DaniAvatar';

// ==========================================
// Message Bubble Component
// ==========================================
const MessageBubble = memo(({ message, isDani }) => {
  const time = new Date(message.timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isDani ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isDani && (
        <div className="mr-3 mt-1">
          <DaniAvatar mood="happy" isTyping={false} />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isDani
            ? 'bg-white border border-[#E2E8F0] text-[#004B63] rounded-tl-md'
            : 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-tr-md'
        } shadow-sm`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1 ${isDani ? 'text-[#64748B]' : 'text-white/70'}`}>
          {time}
        </p>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ==========================================
// Quick Action Buttons
// ==========================================
const QuickActions = memo(({ onAction }) => {
  const actions = [
    { icon: '📚', label: 'Ayuda con tarea', value: 'ayuda_tarea' },
    { icon: '💭', label: 'Cómo me siento', value: 'como_me_siento' },
    { icon: '🎯', label: 'Mi estilo VAK', value: 'mi_estilo_vak' },
    { icon: '🌟', label: 'Motivación', value: 'motivacion' },
    { icon: '📅', label: 'Próxima actividad', value: 'proxima_actividad' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-4 pb-3"
    >
      {actions.map((action) => (
        <motion.button
          key={action.value}
          onClick={() => onAction(action.value)}
          className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-full text-xs font-medium text-[#004B63] hover:bg-[#4DA8C4]/10 hover:border-[#4DA8C4]/30 transition-all flex items-center gap-1.5 shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

// ==========================================
// Main Dani Tutor Chat Component
// ==========================================
const DaniTutorChat = memo(({ isOpen, onClose }) => {
  const {
    daniChatHistory,
    addDaniMessage,
    daniMood,
    setDaniMood,
    vakResult,
    totalPoints,
  } = useSmartBoardKids();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [daniChatHistory]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user', text: text.trim(), timestamp: new Date() };
    addDaniMessage(userMessage);
    setInputText('');
    setIsTyping(true);
    setDaniMood('thinking');

    try {
      // Build context for Dani
      let contextPrompt = PROMPT_PSICOLOGO_VAK + '\n\n';
      
      if (vakResult) {
        contextPrompt += `\nEl estudiante tiene un perfil VAK: ${vakResult.predominantStyle.toUpperCase()}. `;
        contextPrompt += `Visual: ${vakResult.scores.visual}%, Auditivo: ${vakResult.scores.auditivo}%, Kinestésico: ${vakResult.scores.kinestesico}% `;
      }
      
      contextPrompt += `\nEl estudiante tiene ${totalPoints} puntos acumulados. `;
      contextPrompt += `\nResponde de forma empática, corta (2-3 oraciones máximo), usando emojis y lenguaje apropiado para niños de 8-16 años. `;
      contextPrompt += `\nSi es sobre tareas, da estrategias según su estilo VAK. `;
      contextPrompt += `\nSi es sobre emociones, valida primero, luego ayuda. `;

      const response = await callDeepseek(
        text,
        contextPrompt,
        false // useDeepseek
      );

      setDaniMood('explaining');
      addDaniMessage({ role: 'assistant', text: response });
    } catch (error) {
      console.error('Error calling Dani:', error);
      addDaniMessage({
        role: 'assistant',
        text: '¡Ups! Un momento, por favor. ¿Puedes repetir tu pregunta? 😊',
      });
    } finally {
      setIsTyping(false);
      setDaniMood('happy');
    }
  }, [addDaniMessage, vakResult, totalPoints, setDaniMood]);

  const handleQuickAction = useCallback((action) => {
    const actionMessages = {
      'ayuda_tarea': 'Dani, necesito ayuda con mi tarea. ¿Me puedes dar estrategias según mi estilo de aprendizaje?',
      'como_me_siento': 'Me siento un poco frustrado con mis estudios. ¿Qué me recomiendas?',
      'mi_estilo_vak': 'Dani, explícame qué significa mi estilo VAK y cómo lo uso para estudiar mejor',
      'motivacion': 'Dani, necesito motivación para seguir estudiando. ¿Qué me dirías?',
      'proxima_actividad': 'Dani, ¿qué actividad tengo pendiente y cómo la puedo completar?',
    };

    handleSendMessage(actionMessages[action] || action);
  }, [handleSendMessage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md h-[600px] bg-[#F8FAFC] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E2E8F0]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <DaniAvatar mood={daniMood} isTyping={isTyping} />
              <div>
                <h3 className="text-white font-bold text-lg">Dani</h3>
                <p className="text-white/80 text-xs">
                  {isTyping ? 'Escribiendo...' : 'Tu tutor virtual'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {daniChatHistory.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                isDani={msg.role === 'assistant'}
              />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#4DA8C4] rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#E2E8F0]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Escribe tu pregunta a Dani..."
                className="flex-1 px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-sm focus:outline-none focus:border-[#4DA8C4] text-[#004B63] placeholder-[#64748B]"
              />
              <motion.button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DaniTutorChat.displayName = 'DaniTutorChat';

export default DaniTutorChat;
