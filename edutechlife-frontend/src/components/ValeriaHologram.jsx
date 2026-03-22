import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Brain, Mic, Headphones, Zap, Sparkles, Volume2, MicOff, User, BookOpen, Target } from 'lucide-react';
import voiceEngine from '../utils/voiceEngine';

const ValeriaHologram = ({ status: externalStatus, message = '', onOpenChat }) => {
  const hologramRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [internalStatus, setInternalStatus] = useState('idle');
  const [memory, setMemory] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [greeting, setGreeting] = useState('');
  
  const status = externalStatus || internalStatus;

  useEffect(() => {
    const loadMemory = () => {
      try {
        const saved = localStorage.getItem('edutechlife_valeria_memory');
        if (saved) {
          const parsed = JSON.parse(saved);
          setMemory(parsed);
          
          if (parsed.userName && parsed.conversationCount > 0) {
            setGreeting(`¡Hola ${parsed.userName}! ¿Cómo estás hoy?`);
          } else {
            setGreeting('¡Hola! Soy Valeria. ¿En qué te puedo ayudar?');
          }
        } else {
          setGreeting('¡Hola! Soy Valeria, tu tutora virtual. ¿En qué te puedo ayudar?');
        }
      } catch (e) {
        console.error('Error loading memory:', e);
        setGreeting('¡Hola! Soy Valeria, tu tutora virtual.');
      }
    };

    loadMemory();

    const interval = setInterval(loadMemory, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    idle: { 
      color: '#66CCCC', 
      label: 'Disponible', 
      icon: Brain, 
      bg: 'bg-[#66CCCC]/20', 
      border: 'border-[#66CCCC]/30',
      glow: '#66CCCC'
    },
    thinking: { 
      color: '#9D4EDD', 
      label: 'Pensando...', 
      icon: Brain, 
      bg: 'bg-[#9D4EDD]/20', 
      border: 'border-[#9D4EDD]/30',
      glow: '#9D4EDD'
    },
    speaking: { 
      color: '#4DA8C4', 
      label: 'Hablando', 
      icon: Volume2, 
      bg: 'bg-[#4DA8C4]/20', 
      border: 'border-[#4DA8C4]/30',
      glow: '#4DA8C4'
    },
    listening: { 
      color: '#FF6B9D', 
      label: 'Escuchando', 
      icon: Mic, 
      bg: 'bg-[#FF6B9D]/20', 
      border: 'border-[#FF6B9D]/30',
      glow: '#FF6B9D'
    },
  };

  useEffect(() => {
    voiceEngine.onSpeakStart = () => {
      setInternalStatus('speaking');
    };

    voiceEngine.onSpeakEnd = () => {
      setInternalStatus('idle');
    };

    voiceEngine.onListeningStart = () => {
      setInternalStatus('listening');
    };

    voiceEngine.onListeningEnd = () => {
      if (voiceEngine.isSpeaking) {
        setInternalStatus('speaking');
      } else {
        setInternalStatus('idle');
      }
    };

    return () => {
      voiceEngine.onSpeakStart = null;
      voiceEngine.onSpeakEnd = null;
      voiceEngine.onListeningStart = null;
      voiceEngine.onListeningEnd = null;
    };
  }, []);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: (p.y + p.speed) % 100,
          opacity: Math.sin(Date.now() / 1000 + p.id) * 0.2 + 0.3,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const messages = [
    greeting || '¡Hola! Soy Valeria, tu tutor IA. ¿En qué puedo ayudarte hoy?',
    message || 'Analizando tu progreso... ¡Vas por buen camino!',
    memory?.userName 
      ? `${memory.userName}, ¿listo para aprender algo nuevo hoy?` 
      : '¿Listo para la siguiente misión?',
    memory?.goals?.length > 0 
      ? `Tu meta: ${memory.goals[0]}. ¡Vamos a lograrlo!` 
      : 'Tu racha es impresionante. ¡Sigue así!',
    memory?.userProfile?.learningStyle 
      ? `Veo que aprendes mejor de forma ${memory.userProfile.learningStyle}. ¡Usemos eso!`
      : 'Detecté que te gustan los desafíos. ¿Probamos uno avanzado?',
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [message, messages.length]);

  const currentStatus = statusConfig[status] || statusConfig.idle;
  const StatusIcon = currentStatus.icon;

  const isActive = status === 'speaking' || status === 'listening';

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border-l border-[#E2E8F0] shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-lg transition-all ${
                isActive ? 'scale-110' : ''
              }`}>
                <StatusIcon className={`w-6 h-6 text-white transition-all ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-full opacity-20 blur-md animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#004B63] font-montserrat tracking-tight">
                Valeria AI
                {memory?.userName && memory.userName !== 'amigo' && (
                  <span className="ml-2 text-sm font-normal text-[#64748B]">
                    • {memory.userName}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#64748B] font-open-sans">
                Tutor Inteligente con Memoria
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentStatus.bg} border ${currentStatus.border}`}>
            <div 
              className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: currentStatus.color }}
            ></div>
            <span className="text-xs font-medium text-[#004B63] font-open-sans">
              {currentStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Hologram Display */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#F8FAFC] to-transparent">
        <div className="relative w-64 h-64">
          {/* Hologram Container */}
          <div 
            ref={hologramRef}
            className="absolute inset-0 rounded-2xl border-2 border-[#E2E8F0] bg-gradient-to-b from-white to-[#F1F5F9] overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform"
            onClick={onOpenChat}
            style={{
              boxShadow: `
                0 0 60px ${currentStatus.glow}30,
                inset 0 0 40px ${currentStatus.glow}10
              `,
            }}
          >
            {/* Holographic Grid */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <React.Fragment key={i}>
                  <div 
                    className="absolute h-px bg-gradient-to-r from-transparent via-[#4DA8C4] to-transparent"
                    style={{ top: `${i * 10}%`, width: '100%' }}
                  />
                  <div 
                    className="absolute w-px bg-gradient-to-b from-transparent via-[#4DA8C4] to-transparent"
                    style={{ left: `${i * 10}%`, height: '100%' }}
                  />
                </React.Fragment>
              ))}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    opacity: particle.opacity,
                    backgroundColor: currentStatus.color,
                    boxShadow: `0 0 ${particle.size * 2}px ${currentStatus.glow}`,
                  }}
                />
              ))}
            </div>

            {/* Central Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-xl transition-all ${
                  status === 'speaking' ? 'scale-110' : ''
                }`}>
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <StatusIcon className={`w-12 h-12 text-white transition-all ${status === 'speaking' ? 'animate-bounce' : ''}`} />
                  </div>
                </div>
                
                {/* Pulsing Rings */}
                <div 
                  className={`absolute inset-0 rounded-full border-2 ${isActive ? 'animate-ping' : ''}`}
                  style={{ borderColor: currentStatus.color }}
                ></div>
                <div 
                  className={`absolute -inset-4 rounded-full border animate-pulse`}
                  style={{ borderColor: `${currentStatus.color}40` }}
                ></div>
              </div>
            </div>

            {/* Voice Wave Animation */}
            {status === 'speaking' && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full animate-wave"
                    style={{
                      height: `${Math.sin(i * 0.5 + Date.now() / 200) * 12 + 16}px`,
                      animationDelay: `${i * 0.1}s`,
                      background: `linear-gradient(to top, ${currentStatus.color}, #66CCCC)`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Listening Animation */}
            {status === 'listening' && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#FF6B9D]/20">
                  <div className="w-2 h-2 bg-[#FF6B9D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#FF6B9D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#FF6B9D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4DA8C4]/10 border border-[#4DA8C4]/20">
            <MessageSquare className="w-4 h-4 text-[#4DA8C4]" />
            <p className="text-sm text-[#334155] font-open-sans">
              {currentMessage || messages[currentMessageIndex]}
            </p>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2">Clic para chatear</p>
        </div>

        {/* User Memory Card */}
        {memory && (
          <div className="mt-4 w-full max-w-xs">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
              <h4 className="text-xs font-semibold text-[#64748B] mb-3 flex items-center gap-2">
                <User className="w-3 h-3" /> Perfil
              </h4>
              <div className="space-y-2 text-xs">
                {memory.userName && memory.userName !== 'amigo' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">Nombre:</span>
                    <span className="font-semibold text-[#334155]">{memory.userName}</span>
                  </div>
                )}
                {memory.userProfile?.learningStyle && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-[#66CCCC]" />
                    <span className="text-[#94A3B8]">Estilo:</span>
                    <span className="font-semibold text-[#334155]">{memory.userProfile.learningStyle}</span>
                  </div>
                )}
                {memory.goals?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-[#FFD166]" />
                    <span className="text-[#94A3B8]">Meta:</span>
                    <span className="font-semibold text-[#334155] truncate">{memory.goals[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-[#4DA8C4]" />
                  <span className="text-[#94A3B8]">Conversaciones:</span>
                  <span className="font-semibold text-[#334155]">{memory.conversationCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-[#E2E8F0] bg-white">
        <h3 className="text-sm font-semibold text-[#334155] mb-4 font-open-sans">
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onOpenChat}
            className="bg-[#FFD166]/10 p-3 rounded-xl hover:bg-[#FFD166]/20 transition-colors group border border-[#FFD166]/20"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFD166] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#334155] font-open-sans">Desafío Diario</span>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">+50 XP</p>
          </button>
          
          <button className="bg-[#FF6B9D]/10 p-3 rounded-xl hover:bg-[#FF6B9D]/20 transition-colors group border border-[#FF6B9D]/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B9D] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#334155] font-open-sans">Lab IA</span>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">Nuevo módulo</p>
          </button>
          
          <button className="bg-[#66CCCC]/10 p-3 rounded-xl hover:bg-[#66CCCC]/20 transition-colors group border border-[#66CCCC]/20">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#66CCCC] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#334155] font-open-sans">Análisis</span>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">Tu progreso</p>
          </button>
          
          <button className="bg-[#4DA8C4]/10 p-3 rounded-xl hover:bg-[#4DA8C4]/20 transition-colors group border border-[#4DA8C4]/20">
            <div className="flex items-center gap-2">
              {status === 'listening' ? (
                <MicOff className="w-4 h-4 text-[#4DA8C4] group-hover:scale-110 transition-transform" />
              ) : (
                <Headphones className="w-4 h-4 text-[#4DA8C4] group-hover:scale-110 transition-transform" />
              )}
              <span className="text-xs font-medium text-[#334155] font-open-sans">Audio</span>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">Modo voz</p>
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-open-sans">
          <span>Latencia: <span className="text-[#4DA8C4] font-semibold">28ms</span></span>
          <span>Memoria: <span className="text-[#66CCCC] font-semibold">{memory?.conversationCount || 0} chats</span></span>
          <span>Uptime: <span className="text-[#66CCCC] font-semibold">99.9%</span></span>
        </div>
      </div>
    </div>
  );
};

export default ValeriaHologram;
