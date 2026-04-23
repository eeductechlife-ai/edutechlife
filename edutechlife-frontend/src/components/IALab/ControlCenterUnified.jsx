import React, { useState, useEffect } from 'react';
import { cn } from '../forum/forumDesignSystem';
import { 
  GlassPanel, 
  EvolvedButtons, 
  EvolvedInputs, 
  CompactTypography,
  MicroSpacing,
  ShadowSystem,
  cyanGradientBg,
  evolveWithGlassmorphism
} from './GlassDesignSystem';
import LEDIndicator from './LEDIndicator';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Cpu, 
  Sparkles,
  ChevronRight,
  Clock,
  Activity,
  Target,
  Layers,
  RefreshCw
} from 'lucide-react';

/**
 * ControlCenterUnified - Fusión evolutiva del sintetizador y dashboard analítico
 * Componente compacto premium que unifica control y análisis en un solo panel
 * 
 * Diseño: Glassmorphism con gradientes cyan, micro-UI optimizada, LED indicators
 * Objetivo: Reducir espacio 60% vs componentes separados, mantener 100% funcionalidad
 */
const ControlCenterUnified = () => {
  // Estados para el control unificado
  const [activeTab, setActiveTab] = useState('synthesizer'); // 'synthesizer' | 'analytics' | 'settings'
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [synthesisMode, setSynthesisMode] = useState('standard'); // 'standard' | 'advanced' | 'creative'
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('7d'); // '24h' | '7d' | '30d'
  
  // Datos de ejemplo para analytics
  const [analyticsData, setAnalyticsData] = useState({
    engagement: { current: 87, previous: 72, trend: 'up' },
    completion: { current: 65, previous: 58, trend: 'up' },
    retention: { current: 42, previous: 38, trend: 'up' },
    aiUsage: { current: 156, previous: 124, trend: 'up' },
  });
  
  // Historial de prompts recientes
  const [recentPrompts, setRecentPrompts] = useState([
    { id: 1, text: 'Explícame el concepto de backpropagation en redes neuronales', timestamp: '10:30', mode: 'standard' },
    { id: 2, text: 'Genera un ejercicio práctico sobre gradient descent', timestamp: '09:15', mode: 'advanced' },
    { id: 3, text: 'Crea una analogía entre ML y el cerebro humano', timestamp: 'Ayer', mode: 'creative' },
  ]);
  
  // Manejar envío de prompt
  const handleSubmitPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simular procesamiento
    setTimeout(() => {
      // Agregar al historial
      const newPrompt = {
        id: recentPrompts.length + 1,
        text: promptInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: synthesisMode
      };
      
      setRecentPrompts([newPrompt, ...recentPrompts.slice(0, 2)]);
      setPromptInput('');
      setIsProcessing(false);
      
      // Simular actualización de analytics
      setAnalyticsData(prev => ({
        ...prev,
        aiUsage: {
          current: prev.aiUsage.current + 1,
          previous: prev.aiUsage.current,
          trend: 'up'
        }
      }));
    }, 1500);
  };
  
  // Renderizar métrica compacta
  const renderMetric = (title, value, icon, trend, change) => {
    const trendColor = trend === 'up' ? 'text-emerald-500' : 'text-rose-500';
    const trendIcon = trend === 'up' ? '↗' : '↘';
    
    return (
      <div className={cn(
        "flex items-center justify-between",
        "p-2.5 rounded-lg",
        "bg-white/40 backdrop-blur-sm",
        "border border-white/20",
        "hover:bg-white/50",
        "transition-all duration-150"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-md",
            "bg-cyan-500/10",
            "text-cyan-600"
          )}>
            {icon}
          </div>
            <div>
              <h3 className={cn("text-lg font-bold text-[#004B63] font-montserrat mb-1")}>
                Control Center
              </h3>
              <div className="flex items-center gap-2">
                <LEDIndicator type="processing" size="sm" />
                <span className={cn("text-sm text-slate-500")}>
                  Unificado • IA Activa
                </span>
              </div>
            </div>
             <div className={cn(CompactTypography.HEADING, "text-slate-800")}>
               {value}%
             </div>
        </div>
        <div className={cn("text-xs font-medium", trendColor)}>
          {trendIcon} {change}%
        </div>
      </div>
    );
  };
  
  // Renderizar prompt reciente
  const renderRecentPrompt = (prompt) => {
    const modeColors = {
      standard: 'bg-cyan-500/10 text-cyan-600',
      advanced: 'bg-purple-500/10 text-purple-600',
      creative: 'bg-amber-500/10 text-amber-600'
    };
    
    const modeIcons = {
      standard: <Zap className="w-3 h-3" />,
      advanced: <Cpu className="w-3 h-3" />,
      creative: <Sparkles className="w-3 h-3" />
    };
    
    return (
      <div className={cn(
        "flex items-start gap-2.5 p-2.5",
        "rounded-lg",
        "bg-white/30 backdrop-blur-sm",
        "border border-white/15",
        "hover:bg-white/40",
        "transition-all duration-150",
        "cursor-pointer"
      )}>
        <div className={cn(
          "p-1.5 rounded-md",
          modeColors[prompt.mode]
        )}>
          {modeIcons[prompt.mode]}
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn(
            CompactTypography.BODY,
            "text-slate-700 line-clamp-2"
          )}>
            {prompt.text}
          </div>
          <div className={cn(
            CompactTypography.MICRO,
            "text-slate-400 mt-1",
            "flex items-center gap-1.5"
          )}>
            <Clock className="w-3 h-3" />
            {prompt.timestamp}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    );
  };
  
    return (
    <div className={cn(
      "bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,75,99,0.06)] border border-slate-100/50",
      "overflow-hidden",
      "hover:shadow-[0_12px_40px_rgba(0,75,99,0.1)] hover:border-slate-200/60",
      "transition-all duration-200"
    )}>
        {/* Header compacto del Control Center */}
      <div className={cn(
        "flex items-center justify-between",
        "px-6 py-4",
        "border-b border-slate-100/50",
        "bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5"
      )}>
        <div className="flex items-center gap-2.5">
           <div className={cn(
             "p-2.5 rounded-2xl",
             "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
             "text-white",
             "shadow-lg"
           )}>
             <Brain className="w-6 h-6" />
           </div>
           <div>
             <h3 className={cn("text-lg font-bold text-[#004B63] font-montserrat mb-1")}>
               Control Center AI
             </h3>
             <div className={cn(
               "text-sm text-slate-500",
               "flex items-center gap-1.5"
             )}>
               <LEDIndicator type={isProcessing ? 'processing' : 'live'} size="sm" />
               <span>Sistema {isProcessing ? 'procesando' : 'en vivo'}</span>
             </div>
           </div>
        </div>
        
        {/* Tabs de navegación compactos */}
        <div className="flex items-center gap-1">
          {[
            { id: 'synthesizer', label: 'Sintetizador', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'analytics', label: 'Analítica', icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'Config', icon: <Layers className="w-3.5 h-3.5" /> }
          ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "flex items-center gap-2",
                 "px-4 py-2 rounded-xl",
                 "text-sm font-medium",
                 "transition-all duration-150",
                 activeTab === tab.id
                   ? "bg-white text-[#00BCD4] border border-[#00BCD4]/20 shadow-sm"
                   : "text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
               )}
             >
               {tab.icon}
               <span className="hidden sm:inline">{tab.label}</span>
             </button>
          ))}
        </div>
      </div>
      
        {/* Contenido principal simplificado */}
       <div className="p-6">
         <div className="mb-6">
           <h4 className={cn("text-base font-semibold text-[#004B63] mb-4")}>
             Sintetizador Reactivo
           </h4>
           
           <form onSubmit={handleSubmitPrompt} className="mb-4">
             <div className="relative">
                <textarea
                 value={promptInput}
                 onChange={(e) => setPromptInput(e.target.value)}
                 placeholder="¿Qué concepto educativo quieres sintetizar hoy?"
                 className={cn(
                   "bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400",
                   "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                   "w-full min-h-[120px] pr-12",
                   "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/30 focus:border-[#00BCD4]",
                   "transition-all duration-150",
                   "resize-none"
                 )}
                 disabled={isProcessing}
               />
               
                <button
                 type="submit"
                 disabled={!promptInput.trim() || isProcessing}
                 className={cn(
                   "absolute bottom-4 right-4",
                   "p-2.5 rounded-2xl",
                   "transition-all duration-200",
                   isProcessing
                     ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                     : promptInput.trim()
                     ? "bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-lg hover:shadow-xl"
                     : "bg-slate-100 text-slate-400"
                 )}
               >
                 {isProcessing ? (
                   <RefreshCw className="w-5 h-5 animate-spin" />
                 ) : (
                   <Zap className="w-5 h-5" />
                 )}
               </button>
             </div>
           </form>
         </div>
         
         <div className={cn(
           "flex items-center justify-between",
           "px-4 py-2.5",
           "border-t border-white/20",
           "bg-white/30 backdrop-blur-sm"
         )}>
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5">
               <LEDIndicator type="live" size="sm" />
               <span className={cn(CompactTypography.MICRO, "text-slate-600")}>
                 Sistema activo
               </span>
             </div>
           </div>
           
           <div className={cn(CompactTypography.MICRO, "text-slate-500")}>
             Última actualización: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
         </div>
       </div>
     </div>
  );
};

export default ControlCenterUnified;