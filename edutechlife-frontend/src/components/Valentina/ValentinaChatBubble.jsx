import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, User, Bot, Clock, Copy, Volume } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValentinaChatBubble = ({ 
  message = '', 
  sender = 'valentina',
  timestamp,
  isSpeaking = false,
  onSpeak,
  onCopy,
  showTimestamp = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const bubbleRef = useRef(null);

  // Formatear timestamp
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Copiar mensaje al portapapeles
  const handleCopy = () => {
    if (!message || !onCopy) return;
    
    navigator.clipboard.writeText(message).then(() => {
      setIsCopied(true);
      if (onCopy) onCopy(message);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar mensaje:', err);
    });
  };

  // Determinar estilos según el remitente
  const getBubbleStyles = () => {
    if (sender === 'valentina') {
      return {
        container: 'justify-start',
        bubble: 'bg-[var(--color-primary-corporate)] text-white',
        text: 'text-white',
        icon: <Bot className="w-4 h-4" />,
        iconBg: 'bg-[var(--color-primary-petroleum)]',
        border: 'border-[var(--color-primary-corporate)]',
        shadow: 'shadow-[0_4px_12px_rgba(77,168,196,0.2)]'
      };
    } else {
      return {
        container: 'justify-end',
        bubble: 'bg-[var(--color-gray-100)] text-[var(--color-gray-800)]',
        text: 'text-[var(--color-gray-800)]',
        icon: <User className="w-4 h-4" />,
        iconBg: 'bg-[var(--color-gray-300)]',
        border: 'border-[var(--color-gray-200)]',
        shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
      };
    }
  };

  const styles = getBubbleStyles();

  // Efecto para scroll automático
  useEffect(() => {
    if (bubbleRef.current && sender === 'valentina') {
      bubbleRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }, [message, sender]);

  // Animación de entrada
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  // Animación de "escribiendo" para Valentina
  const typingVariants = {
    animate: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={bubbleRef}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={bubbleVariants}
        className={`flex ${styles.container} mb-3`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Contenedor principal del mensaje */}
        <div className="flex flex-col max-w-[85%]">
          {/* Burbuja de mensaje */}
          <div
            className={`valentina-chat-bubble ${sender} relative rounded-2xl px-4 py-3 transition-all duration-200 ${
              isHovered ? 'transform -translate-y-1' : ''
            }`}
          >
            {/* Indicador de que Valentina está hablando */}
            {sender === 'valentina' && isSpeaking && (
              <motion.div
                variants={typingVariants}
                animate="animate"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-primary-mint)] flex items-center justify-center"
              >
                <Volume className="w-3 h-3 text-white" />
              </motion.div>
            )}

            {/* Texto del mensaje */}
            <div className={`${styles.text} whitespace-pre-wrap break-words font-body text-sm leading-relaxed`}>
              {message || (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>

            {/* Acciones al hacer hover */}
            <AnimatePresence>
              {isHovered && message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-3 right-4 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-[var(--color-gray-200)] px-2 py-1"
                >
                  {/* Botón para escuchar (solo Valentina) */}
                  {sender === 'valentina' && onSpeak && (
                    <button
                      onClick={() => onSpeak(message)}
                      className="p-1 rounded hover:bg-[var(--color-gray-100)] transition-colors"
                      title={isSpeaking ? "Detener" : "Escuchar mensaje"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-3 h-3 text-[var(--color-primary-corporate)]" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-[var(--color-primary-corporate)]" />
                      )}
                    </button>
                  )}

                  {/* Botón para copiar */}
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-[var(--color-gray-100)] transition-colors"
                    title={isCopied ? "Copiado" : "Copiar mensaje"}
                  >
                    <Copy className={`w-3 h-3 ${isCopied ? 'text-[var(--color-semantic-success-500)]' : 'text-[var(--color-gray-500)]'}`} />
                  </button>

                  {/* Timestamp */}
                  {showTimestamp && timestamp && (
                    <span className="text-xs text-[var(--color-gray-400)] px-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(timestamp)}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timestamp debajo (si no está en hover) */}
          {showTimestamp && timestamp && !isHovered && (
            <div className="valentina-chat-timestamp mt-1 px-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timestamp)}
              {sender === 'valentina' && isSpeaking && (
                <span className="flex items-center gap-1 ml-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-mint)] animate-pulse" />
                  <span className="text-[var(--color-primary-mint)] text-xs">Hablando...</span>
                </span>
              )}
            </div>
          )}

          {/* Indicador de copiado */}
          <AnimatePresence>
            {isCopied && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-[var(--color-semantic-success-600)] mt-1 px-1 flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--color-semantic-success-500)]" />
                Mensaje copiado
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ValentinaChatBubble;