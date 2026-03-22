import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Brain, Mic, Headphones, Zap, Sparkles } from 'lucide-react';

const ValeriaHologram = ({ status = 'idle', message = '' }) => {
  const hologramRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const statusConfig = {
    idle: { color: '#66CCCC', label: 'Disponible', icon: Brain, bg: 'bg-[#66CCCC]/20', border: 'border-[#66CCCC]/30' },
    thinking: { color: '#9D4EDD', label: 'Pensando...', icon: Brain, bg: 'bg-[#9D4EDD]/20', border: 'border-[#9D4EDD]/30' },
    speaking: { color: '#4DA8C4', label: 'Hablando', icon: Mic, bg: 'bg-[#4DA8C4]/20', border: 'border-[#4DA8C4]/30' },
    listening: { color: '#66CCCC', label: 'Escuchando', icon: Headphones, bg: 'bg-[#66CCCC]/20', border: 'border-[#66CCCC]/30' },
  };

  const currentStatus = statusConfig[status] || statusConfig.idle;
  const StatusIcon = currentStatus.icon;

  useEffect(() => {
    if (status === 'speaking') {
      setIsSpeaking(true);
      const timer = setTimeout(() => setIsSpeaking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
    "¡Hola! Soy Valeria, tu tutor IA. ¿En qué puedo ayudarte hoy?",
    "Analizando tu progreso... ¡Vas por buen camino!",
    "¿Listo para la siguiente misión? Te tengo algo especial preparado.",
    "Tu racha de 14 días es impresionante. ¡Sigue así!",
    "Detecté que te gustan los desafíos de matemáticas. ¿Probamos uno avanzado?",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border-l border-[#E2E8F0] shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] rounded-full opacity-20 blur-md"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#004B63] font-montserrat tracking-tight">
                Valeria AI
              </h2>
              <p className="text-xs text-[#64748B] font-open-sans">
                Tutor Inteligente Premium
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentStatus.bg} border ${currentStatus.border}`}>
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
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
            className="absolute inset-0 rounded-2xl border-2 border-[#E2E8F0] bg-gradient-to-b from-white to-[#F1F5F9] overflow-hidden shadow-xl"
            style={{
              boxShadow: `
                0 0 60px ${currentStatus.color}30,
                inset 0 0 40px ${currentStatus.color}10
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
                  className="absolute rounded-full bg-[#4DA8C4]"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    opacity: particle.opacity,
                    boxShadow: `0 0 ${particle.size * 2}px ${currentStatus.color}`,
                  }}
                />
              ))}
            </div>

            {/* Central Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#66CCCC] via-[#4DA8C4] to-[#004B63] flex items-center justify-center shadow-xl">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <StatusIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Pulsing Rings */}
                <div 
                  className="absolute inset-0 rounded-full border-2 animate-ping"
                  style={{ borderColor: currentStatus.color }}
                ></div>
                <div 
                  className="absolute -inset-4 rounded-full border animate-pulse"
                  style={{ borderColor: `${currentStatus.color}40` }}
                ></div>
              </div>
            </div>

            {/* Voice Wave Animation */}
            {isSpeaking && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#4DA8C4] to-[#66CCCC] rounded-full animate-wave"
                    style={{
                      height: `${Math.sin(i * 0.5 + Date.now() / 200) * 12 + 16}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4DA8C4]/10 border border-[#4DA8C4]/20">
            <MessageSquare className="w-4 h-4 text-[#4DA8C4]" />
            <p className="text-sm text-[#334155] font-open-sans">
              {message || messages[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-[#E2E8F0] bg-white">
        <h3 className="text-sm font-semibold text-[#334155] mb-4 font-open-sans">
          Acciones Rápidas
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#FFD166]/10 p-3 rounded-xl hover:bg-[#FFD166]/20 transition-colors group border border-[#FFD166]/20">
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
              <Headphones className="w-4 h-4 text-[#4DA8C4] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#334155] font-open-sans">Audio</span>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">Modo escucha</p>
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-open-sans">
          <span>Latencia: <span className="text-[#4DA8C4] font-semibold">28ms</span></span>
          <span>Precisión: <span className="text-[#66CCCC] font-semibold">98.7%</span></span>
          <span>Uptime: <span className="text-[#66CCCC] font-semibold">99.9%</span></span>
        </div>
      </div>
    </div>
  );
};

export default ValeriaHologram;