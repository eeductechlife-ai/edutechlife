import { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Settings, 
  MessageSquare,
  User,
  Bot,
  Type,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValentinaControls = ({
  isSpeaking = false,
  isMuted = false,
  valentinaMode = true,
  speechRate = 1.0,
  onToggleVoice,
  onRepeat,
  onToggleValentina,
  onChangeSpeechRate,
  onToggleTheme,
  theme = 'light',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSpeechRate, setLocalSpeechRate] = useState(speechRate);

  // Opciones de velocidad de habla
  const speechRateOptions = [
    { value: 0.8, label: 'Lento', color: 'var(--color-vak-auditivo-500)' },
    { value: 1.0, label: 'Normal', color: 'var(--color-primary-corporate)' },
    { value: 1.2, label: 'Rápido', color: 'var(--color-vak-kinestesico-500)' }
  ];

  // Efecto para sincronizar velocidad local
  useEffect(() => {
    setLocalSpeechRate(speechRate);
  }, [speechRate]);

  // Manejar cambio de velocidad
  const handleSpeechRateChange = (rate) => {
    setLocalSpeechRate(rate);
    if (onChangeSpeechRate) {
      onChangeSpeechRate(rate);
    }
  };

  // Alternar panel expandido
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Animaciones
  const containerVariants = {
    collapsed: {
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    expanded: {
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      className={`bg-glass-light backdrop-blur-md rounded-2xl border border-[var(--color-gray-200)] overflow-hidden ${className}`}
    >
      {/* Barra de controles principales */}
      <div className="p-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-corporate)] to-[var(--color-primary-mint)] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--color-petroleum)] text-sm">
                Valentina - Psicóloga VAK
              </h3>
              <p className="text-xs text-[var(--color-gray-500)]">
                {valentinaMode ? 'Modo activo' : 'Modo inactivo'}
              </p>
            </div>
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleExpanded}
            className="p-2 rounded-lg bg-white border border-[var(--color-gray-200)] hover:border-[var(--color-primary-corporate)] transition-colors"
            aria-label={isExpanded ? "Contraer controles" : "Expandir controles"}
          >
            <Settings className={`w-4 h-4 text-[var(--color-gray-600)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* Controles principales */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {/* Botón de voz */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onToggleVoice}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              isMuted 
                ? 'bg-[var(--color-semantic-error-50)] border-[var(--color-semantic-error-200)] text-[var(--color-semantic-error-600)]' 
                : 'bg-[var(--color-vak-auditivo-50)] border-[var(--color-vak-auditivo-200)] text-[var(--color-vak-auditivo-600)] hover:border-[var(--color-vak-auditivo-300)]'
            }`}
            aria-label={isMuted ? "Activar voz" : "Silenciar voz"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 mb-1" />
            ) : (
              <Volume2 className="w-5 h-5 mb-1" />
            )}
            <span className="text-xs font-medium">{isMuted ? 'Activar' : 'Silenciar'}</span>
          </motion.button>

          {/* Botón de repetir */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onRepeat}
            disabled={isSpeaking}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              isSpeaking
                ? 'bg-[var(--color-gray-100)] border-[var(--color-gray-200)] text-[var(--color-gray-400)] cursor-not-allowed'
                : 'bg-[var(--color-vak-visual-50)] border-[var(--color-vak-visual-200)] text-[var(--color-vak-visual-600)] hover:border-[var(--color-vak-visual-300)]'
            }`}
            aria-label="Repetir último mensaje"
          >
            <RotateCcw className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Repetir</span>
          </motion.button>

          {/* Botón de modo Valentina */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onToggleValentina}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              valentinaMode
                ? 'bg-[var(--color-primary-corporate)] border-[var(--color-primary-corporate)] text-white'
                : 'bg-[var(--color-gray-100)] border-[var(--color-gray-200)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]'
            }`}
            aria-label={valentinaMode ? "Desactivar Valentina" : "Activar Valentina"}
          >
            {valentinaMode ? (
              <Bot className="w-5 h-5 mb-1" />
            ) : (
              <User className="w-5 h-5 mb-1" />
            )}
            <span className="text-xs font-medium">{valentinaMode ? 'Activa' : 'Inactiva'}</span>
          </motion.button>

          {/* Botón de tema */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onToggleTheme}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)] transition-colors"
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 mb-1" />
            ) : (
              <Sun className="w-5 h-5 mb-1" />
            )}
            <span className="text-xs font-medium">Tema</span>
          </motion.button>
        </div>

        {/* Panel expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-[var(--color-gray-200)]"
            >
              {/* Velocidad de habla */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--color-gray-500)]" />
                    <span className="text-sm font-medium text-[var(--color-gray-700)]">
                      Velocidad de habla
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-primary-corporate)]">
                    {localSpeechRate.toFixed(1)}x
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {speechRateOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleSpeechRateChange(option.value)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                        localSpeechRate === option.value
                          ? 'border-current text-white'
                          : 'border-[var(--color-gray-200)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]'
                      }`}
                      style={
                        localSpeechRate === option.value
                          ? { 
                              backgroundColor: option.color,
                              borderColor: option.color 
                            }
                          : {}
                      }
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tamaño de texto */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-[var(--color-gray-500)]" />
                  <span className="text-sm font-medium text-[var(--color-gray-700)]">
                    Tamaño de texto
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {['Pequeño', 'Mediano', 'Grande'].map((size, index) => (
                    <motion.button
                      key={size}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        index === 1
                          ? 'border-[var(--color-primary-corporate)] bg-[var(--color-primary-corporate)] text-white'
                          : 'border-[var(--color-gray-200)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Información de accesibilidad */}
              <div className="p-3 rounded-lg bg-[var(--color-primary-corporate)]/5 border border-[var(--color-primary-corporate)]/20">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-[var(--color-primary-corporate)] mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--color-gray-700)]">
                      <strong className="text-[var(--color-primary-corporate)]">Accesibilidad:</strong> 
                      Todos los mensajes tienen transcripción y controles de voz.
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)] mt-1">
                      Usa Tab para navegar entre controles.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de estado */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-gray-200)]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              valentinaMode 
                ? isSpeaking 
                  ? 'bg-[var(--color-primary-mint)] animate-pulse' 
                  : 'bg-[var(--color-semantic-success-500)]'
                : 'bg-[var(--color-gray-400)]'
            }`} />
            <span className="text-xs text-[var(--color-gray-600)]">
              {valentinaMode 
                ? isSpeaking 
                  ? 'Valentina está hablando...' 
                  : 'Valentina lista'
                : 'Modo texto'
              }
            </span>
          </div>
          
          {valentinaMode && (
            <div className="text-xs text-[var(--color-gray-500)] font-mono">
              VAK v2.0
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ValentinaControls;