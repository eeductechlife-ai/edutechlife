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
        getTechniquesForDisplay
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
                placeholder={`Escribe tu prompt aquí (mínimo 10 caracteres)...\n\nEjemplos:\n• "Explica la fotosíntesis para estudiantes de 12 años"\n• "Crea un plan de marketing para una startup tech"\n• "Analiza las ventajas y desventajas del trabajo remoto"`}
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
                    {input.length}/1000 caracteres • {isValidInput(input) ? '✅ Listo para optimizar' : `⚠️ Mínimo ${10 - input.length} caracteres más`}
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
                    aria-label={loading ? `Procesando: ${loadMsg}` : "Optimizar prompt con análisis educativo"}
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
                            <Icon name="fa-microchip" />
                            <span>Optimizar Prompt</span>
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

    // Render resultado optimizado
    const renderResult = () => {
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
                    {genData && renderResult()}
                    {renderError()}
                    {renderHistory()}
                </>
            )}
        </div>
    );
};

export default IALabSynthesizer;