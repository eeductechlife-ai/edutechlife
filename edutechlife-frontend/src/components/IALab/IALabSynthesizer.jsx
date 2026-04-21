import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import useIALabSynthesizer from '../../hooks/IALab/useIALabSynthesizer';
import PromptFeedback from './PromptFeedback';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, GRADIENTS, cn } from '../forum/forumDesignSystem';

/**
 * Componente premium para sintetizador de prompts educativo
 * Enseña prompt engineering con análisis real y feedback educativo
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const IALabSynthesizer = ({ className = '', ...rest }) => {
    const { activeMod, modules } = useIALabContext();
    const {
        input,
        setInput,
        loading,
        loadMsg,
        genData,
        error,
        history,
        optimizePrompt,
        copyToClipboard,
        clearHistory,
        loadFromHistory,
        getUsageStats,
        getDynamicContext,
        getSuggestions,
        getQuickAnalysis,
        isValidInput,
        getTechniquesForDisplay,
        apiError,
        isGenerating
    } = useIALabSynthesizer();

    // Obtener módulo actual para contexto
    const currentModule = modules.find(m => m.id === activeMod);
    const context = getDynamicContext();
    const suggestions = getSuggestions();
    const usageStats = getUsageStats();
    const techniques = getTechniquesForDisplay();
    
    // Estado para análisis en tiempo real
    const [quickAnalysis, setQuickAnalysis] = useState(null);

    // Handler para optimizar prompt
    const handleOptimize = async () => {
        if (!isValidInput(input)) {
            alert('El prompt debe tener entre 10 y 1000 caracteres');
            return;
        }
        
        await optimizePrompt(input);
    };

    // Handler para teclado (Enter para optimizar)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleOptimize();
        }
    };

    // Handler para sugerencia rápida
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    // Efecto para análisis en tiempo real
    useEffect(() => {
        if (input.trim().length >= 5) {
            const analysis = getQuickAnalysis(input);
            setQuickAnalysis(analysis);
        } else {
            setQuickAnalysis(null);
        }
    }, [input, getQuickAnalysis]);

    // Render skeleton loading
    const renderSkeleton = () => (
        <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
                </div>
            </div>
            
            {/* Textarea skeleton */}
            <div className="space-y-4">
                <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
            </div>
            
            {/* Suggestions skeleton */}
            <div className="space-y-3">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-40"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Render header premium
    const renderHeader = () => (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    GRADIENTS.PRIMARY,
                    FORUM_EFFECTS.SHADOW_SM
                )}>
                    <Icon name="fa-atom" className="text-white text-xl" />
                </div>
                <div>
                    <h3 className={cn(
                        FORUM_TYPOGRAPHY.DISPLAY.LG,
                        FORUM_TYPOGRAPHY.TEXT_PRIMARY
                    )}>
                        Sintetizador de Prompts Élite
                    </h3>
                    <p className={cn(
                        FORUM_TYPOGRAPHY.BODY.SM,
                        FORUM_TYPOGRAPHY.TEXT_LIGHT
                    )}>
                        Aprende prompt engineering con análisis real y feedback educativo
                    </p>
                </div>
            </div>
            
            {/* Context badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 bg-[#004B63]/10 text-[#004B63] text-xs font-medium rounded-full">
                    🎯 {context.challenge}
                </div>
                <div className="px-3 py-1 bg-[#00BCD4]/10 text-[#00BCD4] text-xs font-medium rounded-full">
                    📚 {context.userLevel}
                </div>
                {techniques.slice(0, 2).map((tech, index) => (
                    <div key={index} className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium rounded-full">
                        {tech.icon} {tech.name}
                    </div>
                ))}
            </div>
        </div>
    );

    // Render análisis en tiempo real
    const renderQuickAnalysis = () => {
        if (!quickAnalysis) return null;
        
        return (
            <div className={cn(
                "mb-4 p-4 rounded-xl border",
                FORUM_EFFECTS.ANIMATION_FADE_IN
            )} style={{
                borderColor: quickAnalysis.color,
                backgroundColor: `${quickAnalysis.color}10`
            }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-xl">{quickAnalysis.emoji}</div>
                        <div>
                            <p className={cn(
                                FORUM_TYPOGRAPHY.BODY.SM,
                                FORUM_TYPOGRAPHY.MEDIUM
                            )}>
                                {quickAnalysis.level} ({quickAnalysis.score}/100)
                            </p>
                            <p className={cn(
                                FORUM_TYPOGRAPHY.BODY.XS,
                                "text-slate-600"
                            )}>
                                {quickAnalysis.type} • {quickAnalysis.wordCount} palabras
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <div className="text-lg">{quickAnalysis.icon}</div>
                            <span className={cn(
                                FORUM_TYPOGRAPHY.BODY.XS,
                                FORUM_TYPOGRAPHY.MEDIUM
                            )}>
                                {quickAnalysis.technique}
                            </span>
                        </div>
                    </div>
                </div>
                
                {quickAnalysis.suggestions && quickAnalysis.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className={cn(
                            FORUM_TYPOGRAPHY.BODY.XS,
                            FORUM_TYPOGRAPHY.MEDIUM,
                            "text-slate-700 mb-1"
                        )}>
                            Sugerencias rápidas:
                        </p>
                        <ul className="space-y-1">
                            {quickAnalysis.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Icon name="fa-bullet" className="text-slate-400 text-xs mt-0.5" />
                                    <span className={cn(
                                        FORUM_TYPOGRAPHY.BODY.XS,
                                        "text-slate-600"
                                    )}>
                                        {suggestion}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Render input area
    const renderInputArea = () => (
        <div className="space-y-4">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Escribe tu idea básica aquí (ej: "educacion", "marketing", "salud")...\n\nEjemplos de ideas básicas:\n• "educacion" → Generará prompt para crear contenido educativo\n• "marketing digital" → Generará prompt para estrategias de marketing\n• "salud mental" → Generará prompt para consejos de bienestar\n• "tecnologia" → Generará prompt para explicaciones técnicas\n• "finanzas personales" → Generará prompt para gestión financiera`}
                className={cn(
                    FORUM_COMPONENTS.TEXTAREA_BASE,
                    "mb-4",
                    FORUM_TYPOGRAPHY.BODY.MD,
                    "min-h-[140px] resize-none"
                )}
                rows={5}
                disabled={loading}
            />
            
            {renderQuickAnalysis()}
            
            <div className="flex items-center justify-between">
                 <div className="text-sm text-slate-500">
                     {input.length}/500 caracteres • {isValidInput(input) ? '✅ Listo para generar con DeepSeek' : `⚠️ Mínimo ${3 - input.length} caracteres más`}
                 </div>
                
                <button
                    onClick={handleOptimize}
                    disabled={loading || !isValidInput(input)}
                    className={cn(
                        GRADIENTS.PRIMARY,
                        "px-6 py-3 rounded-xl",
                        "text-white",
                        FORUM_TYPOGRAPHY.MEDIUM,
                        FORUM_EFFECTS.TRANSITION_ALL,
                        FORUM_EFFECTS.HOVER_SCALE,
                        "flex items-center justify-center gap-2",
                        "focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2",
                        "disabled:opacity-70 disabled:cursor-not-allowed",
                        loading && "opacity-70 cursor-not-allowed"
                    )}
                     aria-label={loading ? `Procesando: ${loadMsg}` : "Generar prompt maestro con DeepSeek AI"}
                >
                    {loading ? (
                        <>
                            <div className={cn(
                                "w-5 h-5 border-2 border-white border-t-transparent rounded-full",
                                FORUM_EFFECTS.ANIMATION_SPIN
                            )} />
                            <span>{loadMsg}</span>
                        </>
                     ) : (
                         <>
                             <Icon name="fa-brain" />
                             <span>Generar con DeepSeek AI</span>
                         </>
                     )}
                </button>
            </div>
        </div>
    );

    // Render sugerencias rápidas
    const renderSuggestions = () => (
        <div className="mt-6">
            <h4 className={cn(
                FORUM_TYPOGRAPHY.BODY.LG,
                FORUM_TYPOGRAPHY.SEMIBOLD,
                FORUM_TYPOGRAPHY.TEXT_PRIMARY,
                "mb-3"
            )}>
                💡 Sugerencias para practicar
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                            "text-left p-4 rounded-xl border border-[#00BCD4]/20",
                            "bg-gradient-to-r from-white to-[#00BCD4]/5",
                            "hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-[#004B63]/10",
                            "hover:border-[#00BCD4]/40 hover:shadow-[0_4px_20px_rgba(0,188,212,0.1)]",
                            FORUM_EFFECTS.TRANSITION_ALL,
                            "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50"
                        )}
                        disabled={loading}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#00BCD4]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon name="fa-lightbulb" className="text-[#00BCD4] text-xs" />
                            </div>
                            <p className={cn(
                                FORUM_TYPOGRAPHY.BODY.SM,
                                "text-[#00374A] leading-relaxed"
                            )}>
                                {suggestion}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    // Render resultados de DeepSeek - Dashboard Analítico Premium
    const renderDeepSeekResults = () => {
        if (!genData || !genData.deepSeekData) return null;
        
        const deepSeekData = genData.deepSeekData;
        
        return (
            <div className="mt-8 space-y-8 animate-in fade-in duration-500">
                {/* ==================== ENCABEZADO PREMIUM DASHBOARD ==================== */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg">
                                <Icon name="fa-brain" className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 font-sans">Dashboard Analítico de Prompt</h3>
                                <p className="text-slate-600 font-sans">Tu idea transformada en prompt profesional por DeepSeek AI</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 rounded-full border border-[#004B63]/20">
                            <span className="text-sm font-bold text-[#004B63] font-sans">🚀 LIVE</span>
                        </div>
                    </div>
                    
                    {/* Stats bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 font-sans">Modelo</div>
                            <div className="font-bold text-slate-800 font-sans">deepseek-chat</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 font-sans">Temperatura</div>
                            <div className="font-bold text-slate-800 font-sans">0.7</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 font-sans">Tokens</div>
                            <div className="font-bold text-slate-800 font-sans">~{Math.round(deepSeekData.prompt_maestro.length / 4)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                            <div className="text-sm text-slate-500 mb-1 font-sans">Calidad</div>
                            <div className="font-bold text-green-600 font-sans">Premium</div>
                        </div>
                    </div>
                </div>
                
                {/* ==================== GRID DE ESTRUCTURA PREMIUM - ROL, TAREA, FORMATO ==================== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Tarjeta ROL */}
                    <div className="bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="fa-user-tie" className="text-[#004B63]" />
                            <span className="text-xs font-black text-[#004B63] tracking-widest uppercase font-sans">ROL</span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed font-sans">{deepSeekData.rol}</p>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#004B63]/5 rounded-full blur-sm"></div>
                    </div>
                    
                    {/* Tarjeta TAREA */}
                    <div className="bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="fa-target" className="text-[#00BCD4]" />
                            <span className="text-xs font-black text-[#00BCD4] tracking-widest uppercase font-sans">TAREA</span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed font-sans">{deepSeekData.tarea}</p>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#00BCD4]/5 rounded-full blur-sm"></div>
                    </div>
                    
                    {/* Tarjeta FORMATO */}
                    <div className="bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="fa-file-alt" className="text-[#4F46E5]" />
                            <span className="text-xs font-black text-[#4F46E5] tracking-widest uppercase font-sans">FORMATO</span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed font-sans">{deepSeekData.formato}</p>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#4F46E5]/5 rounded-full blur-sm"></div>
                    </div>
                </div>
                
                {/* ==================== BLOQUE DEL PROMPT MAESTRO - TERMINAL PREMIUM ==================== */}
                <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] p-8 relative shadow-2xl overflow-hidden mb-8 animate-in zoom-in duration-400">
                    {/* Header de la terminal */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="fa-terminal" className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-300 font-sans">PROMPT_MAESTRO.js</span>
                            </div>
                        </div>
                        
                        {/* Botón Copiar Premium - FUNCIONALIDAD PRESERVADA */}
                        <button 
                            onClick={() => copyToClipboard(deepSeekData.prompt_maestro)}
                            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 font-sans"
                            aria-label="Copiar prompt maestro al portapapeles"
                        >
                            <Icon name="fa-copy" className="text-sm" /> Copiar
                        </button>
                    </div>
                    
                    {/* Contenido del prompt */}
                    <div className="font-mono font-medium leading-relaxed text-lg text-slate-200 whitespace-pre-wrap bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        {deepSeekData.prompt_maestro}
                    </div>
                    
                    {/* Footer de la terminal */}
                    <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400 font-sans">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Icon name="fa-code" className="text-xs" />
                                <span>Prompt Engineering</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <Icon name="fa-brain" className="text-xs" />
                                <span>DeepSeek AI</span>
                            </span>
                        </div>
                        <div className="text-xs">
                            {deepSeekData.prompt_maestro.split(' ').length} palabras • {deepSeekData.prompt_maestro.length} caracteres
                        </div>
                    </div>
                </div>
                
                {/* ==================== BLOQUE DE ANÁLISIS TÉCNICO - NOTA DEL PROFESOR ==================== */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-[#004B63] rounded-r-3xl rounded-l-md p-8 shadow-sm relative mb-8 overflow-hidden animate-in slide-in-from-right-4 duration-300">
                    {/* Icono de bombillo en el fondo */}
                    <Icon 
                        name="fa-lightbulb" 
                        className="absolute right-4 bottom-4 text-[#004B63]/10 opacity-20 w-32 h-32" 
                    />
                    
                    {/* Header del análisis */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                            <Icon name="fa-lightbulb" className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-[#004B63] font-sans">💡 Análisis Técnico</h4>
                            <p className="text-sm text-[#004B63] font-sans">Feedback educativo sobre tu idea</p>
                        </div>
                    </div>
                    
                    {/* Contenido del análisis */}
                    <div className="relative z-10">
                        <p className="text-slate-700 font-medium leading-relaxed mb-6 font-sans">
                            {deepSeekData.analisis_tecnico}
                        </p>
                        
                        {/* Píldoras de técnicas aplicadas */}
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-white border border-[#004B63]/20 text-[#004B63] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                                Estructura RTF
                            </span>
                            <span className="bg-white border border-[#00BCD4]/20 text-[#00BCD4] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                                Especificidad
                            </span>
                            <span className="bg-white border border-[#4F46E5]/20 text-[#4F46E5] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                                Claridad
                            </span>
                            <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                                Contexto
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* ==================== FOOTER INFORMATIVO ==================== */}
                <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="fa-info-circle" className="text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-700 font-sans">Generado con DeepSeek API</p>
                                <p className="text-xs text-slate-500 font-sans">Modelo: deepseek-chat • Temperatura: 0.7 • Response Format: JSON</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 text-sm font-medium text-[#004B63] bg-[#004B63]/10 hover:bg-[#004B63]/20 rounded-lg transition-colors font-sans"
                        >
                            <Icon name="fa-rotate-right" className="mr-2" /> Generar Nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render resultado optimizado (para resultados locales)
    const renderLocalResult = () => {
        if (!genData) return null;
        
        return (
            <div className="mt-8 space-y-6">
                {/* Resumen ejecutivo */}
                <div className={cn(
                    "p-6 rounded-xl bg-gradient-to-r from-[#004B63] to-[#006B8F]",
                    FORUM_EFFECTS.ANIMATION_FADE_IN,
                    "text-white"
                )} style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <Icon name="fa-chart-line" className="text-white text-xl" />
                        <h4 className={cn(
                            FORUM_TYPOGRAPHY.BODY.LG,
                            FORUM_TYPOGRAPHY.SEMIBOLD
                        )}>
                            Resumen de Optimización
                        </h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>Calidad original:</span>
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                                {genData.analysis.score}/100
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>Técnica aplicada:</span>
                            <span className="flex items-center gap-2">
                                <span>{genData.techniqueApplied.icon}</span>
                                <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                                    {genData.techniqueApplied.name}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>Mejora esperada:</span>
                            <span className={cn(
                                FORUM_TYPOGRAPHY.BODY.SM,
                                FORUM_TYPOGRAPHY.MEDIUM,
                                "text-green-300"
                            )}>
                                +{Math.round((100 - genData.analysis.score) * 0.7)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Comparación side-by-side */}
                <div className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-6",
                    FORUM_EFFECTS.ANIMATION_FADE_IN
                )} style={{ animationDelay: '0.2s' }}>
                    {/* Prompt original */}
                    <div className={cn(
                        FORUM_COMPONENTS.CARD_GLASS,
                        "p-6"
                    )}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <h4 className={cn(
                                FORUM_TYPOGRAPHY.BODY.LG,
                                FORUM_TYPOGRAPHY.SEMIBOLD,
                                "text-red-600"
                            )}>
                                Prompt Original
                            </h4>
                        </div>
                        <div className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap",
                            "text-slate-700 p-4 bg-slate-50 rounded-lg",
                            "border border-slate-200"
                        )}>
                            {genData.originalPrompt}
                        </div>
                        <div className="mt-4 text-xs text-slate-500">
                            {genData.analysis.wordCount} palabras • {genData.analysis.charCount} caracteres
                        </div>
                    </div>

                    {/* Prompt optimizado */}
                    <div className={cn(
                        FORUM_COMPONENTS.CARD_ACCENT,
                        "p-6 relative"
                    )}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h4 className={cn(
                                FORUM_TYPOGRAPHY.BODY.LG,
                                FORUM_TYPOGRAPHY.SEMIBOLD,
                                "text-green-600"
                            )}>
                                Prompt Optimizado
                            </h4>
                        </div>
                        <div className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap",
                            "text-[#004B63] p-4 bg-white/50 rounded-lg",
                            "border border-[#00BCD4]/30"
                        )}>
                            {genData.optimizedPrompt}
                        </div>
                        <button 
                            onClick={() => copyToClipboard(genData.optimizedPrompt)}
                            className={cn(
                                "absolute top-4 right-4 text-xs",
                                "border border-[#00BCD4] text-[#00BCD4]",
                                "hover:bg-[#00BCD4] hover:text-white",
                                "flex items-center gap-1 px-2 py-1 rounded",
                                FORUM_EFFECTS.TRANSITION_ALL,
                                "focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                            )}
                            aria-label="Copiar prompt optimizado al portapapeles"
                        >
                            <Icon name="fa-copy" className="text-xs" /> Copiar
                        </button>
                    </div>
                </div>

                {/* Feedback educativo */}
                <PromptFeedback 
                    feedback={genData.feedback}
                    technique={genData.techniqueApplied}
                    analysis={genData.analysis}
                    onCopy={copyToClipboard}
                />

                {/* Estadísticas de contexto */}
                <div className={cn(
                    "bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5",
                    "p-6 rounded-xl",
                    FORUM_EFFECTS.ANIMATION_FADE_IN
                )} style={{ animationDelay: '0.7s' }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#004B63]">{usageStats.totalOptimizations}</div>
                            <div className="text-xs text-slate-600">Optimizaciones totales</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#00BCD4]">{usageStats.averageScore || 0}</div>
                            <div className="text-xs text-slate-600">Puntuación promedio</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#8B5CF6]">{usageStats.favoriteTechnique || 'N/A'}</div>
                            <div className="text-xs text-slate-600">Técnica favorita</div>
                        </div>
                        <div className="text-center">
                            <div className={cn(
                                "text-2xl font-bold",
                                usageStats.improvementTrend > 0 ? "text-green-600" : 
                                usageStats.improvementTrend < 0 ? "text-red-600" : "text-slate-600"
                            )}>
                                {usageStats.improvementTrend > 0 ? '+' : ''}{usageStats.improvementTrend || 0}
                            </div>
                            <div className="text-xs text-slate-600">Tendencia de mejora</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render historial
    const renderHistory = () => (
        history.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className={cn(
                        FORUM_TYPOGRAPHY.BODY.LG,
                        FORUM_TYPOGRAPHY.SEMIBOLD,
                        FORUM_TYPOGRAPHY.TEXT_PRIMARY
                    )}>
                        📋 Historial reciente
                    </h4>
                    <button
                        onClick={clearHistory}
                        className="text-sm text-slate-500 hover:text-red-500 transition-colors duration-300"
                        aria-label="Limpiar historial"
                    >
                        <Icon name="fa-trash" className="mr-1" /> Limpiar
                    </button>
                </div>
                
                <div className="space-y-3">
                    {history.slice(0, 5).map((item, index) => (
                        <button
                            key={index}
                            onClick={() => loadFromHistory(index)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl",
                                "bg-white border border-slate-100",
                                "hover:bg-[#00BCD4]/5 hover:border-[#00BCD4]/30",
                                FORUM_EFFECTS.TRANSITION_ALL,
                                "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        FORUM_TYPOGRAPHY.BODY.SM,
                                        "text-[#00374A] truncate"
                                    )}>
                                        {item.input}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-slate-500">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-[#004B63]/10 text-[#004B63] rounded-full">
                                            {item.output.techniqueApplied.name}
                                        </span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            item.output.analysis.score >= 70 ? "bg-green-100 text-green-800" :
                                            item.output.analysis.score >= 50 ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        )}>
                                            {item.output.analysis.score}/100
                                        </span>
                                    </div>
                                </div>
                                <Icon name="fa-chevron-right" className="text-slate-400 ml-2 flex-shrink-0" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )
    );

     // Render error
     const renderError = () => (
         error && (
             <div className={cn(
                 "bg-red-50 border border-red-200",
                 "p-6 rounded-xl",
                 FORUM_EFFECTS.ANIMATION_FADE_IN
             )}>
                 <div className="flex items-center gap-3">
                     <Icon name="fa-exclamation-triangle" className="text-red-500 text-xl" />
                     <div>
                         <h4 className={cn(
                             FORUM_TYPOGRAPHY.BODY.LG,
                             FORUM_TYPOGRAPHY.SEMIBOLD,
                             "text-red-700"
                         )}>
                             Error de optimización
                         </h4>
                         <p className={cn(
                             FORUM_TYPOGRAPHY.BODY.SM,
                             "text-red-600 mt-1"
                         )}>
                             {error}
                         </p>
                     </div>
                 </div>
             </div>
         )
     );

     // Render API error (específico para DeepSeek)
     const renderApiError = () => (
         apiError && (
             <div className={cn(
                 "bg-amber-50 border border-amber-200",
                 "p-6 rounded-xl",
                 FORUM_EFFECTS.ANIMATION_FADE_IN,
                 "mt-4"
             )}>
                 <div className="flex items-center gap-3">
                     <Icon name="fa-info-circle" className="text-amber-500 text-xl" />
                     <div>
                         <h4 className={cn(
                             FORUM_TYPOGRAPHY.BODY.LG,
                             FORUM_TYPOGRAPHY.SEMIBOLD,
                             "text-amber-700"
                         )}>
                             Información de API
                         </h4>
                         <p className={cn(
                             FORUM_TYPOGRAPHY.BODY.SM,
                             "text-amber-600 mt-1"
                         )}>
                             {apiError}
                         </p>
                         <div className="mt-3 text-xs text-amber-700">
                             <p className="font-medium">Solución automática:</p>
                             <ul className="list-disc pl-4 mt-1 space-y-1">
                                 <li>El sistema ha cambiado automáticamente al modo local</li>
                                 <li>Puedes continuar usando todas las funciones básicas</li>
                                 <li>Para usar DeepSeek AI, configura VITE_DEEPSEEK_API_KEY en tu archivo .env</li>
                             </ul>
                         </div>
                     </div>
                 </div>
             </div>
         )
     );

    return (
        <div className={cn(
            FORUM_COMPONENTS.CARD_GLASS,
            "p-8 md:p-10",
            FORUM_EFFECTS.TRANSITION_ALL,
            FORUM_EFFECTS.HOVER_SHADOW,
            className
        )} {...rest}>
            {loading ? (
                renderSkeleton()
            ) : (
                <>
                    {renderHeader()}
                    {renderInputArea()}
                    {renderSuggestions()}
                     {genData && genData.deepSeekData && renderDeepSeekResults()}
                     {genData && !genData.deepSeekData && renderLocalResult()}
                    {renderError()}
                    {renderApiError()}
                    {renderHistory()}
                </>
            )}
        </div>
    );
};

export default IALabSynthesizer;