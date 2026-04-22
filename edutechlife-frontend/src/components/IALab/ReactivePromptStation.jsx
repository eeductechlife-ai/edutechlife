import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import useIALabSynthesizer from '../../hooks/IALab/useIALabSynthesizer';
import { FORUM_TYPOGRAPHY, FORUM_EFFECTS, GRADIENTS, cn } from '../forum/forumDesignSystem';

/**
 * Estación Reactiva de Prompts - Fusión Sintetizador + Dashboard Analítico
 * Componente compacto y reactivo que actualiza análisis en tiempo real mientras el usuario escribe
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const ReactivePromptStation = ({ className = '', ...rest }) => {
    const {
        input,
        setInput,
        loading,
        loadMsg,
        genData,
        error,
        optimizePrompt,
        isValidInput,
        apiError,
        isGenerating,
        getQuickAnalysis
    } = useIALabSynthesizer();

    // Estado para análisis en tiempo real
    const [quickAnalysis, setQuickAnalysis] = useState(null);
    const [charCount, setCharCount] = useState(input.length);

    // Handler para cambio de texto - análisis reactivo con debounce
    const handleInputChange = useCallback((e) => {
        const text = e.target.value;
        setInput(text);
        
        // Análisis en tiempo real (sin debounce para respuesta inmediata)
        if (text.trim().length >= 3) {
            const analysis = getQuickAnalysis(text);
            setQuickAnalysis(analysis);
        } else {
            setQuickAnalysis(null);
        }
    }, [setInput, getQuickAnalysis]);

    // Efecto para sincronizar charCount con input
    useEffect(() => {
        setCharCount(input.length);
    }, [input]);

    // Efecto para análisis inicial
    useEffect(() => {
        if (input.trim().length >= 3) {
            const analysis = getQuickAnalysis(input);
            setQuickAnalysis(analysis);
        }
    }, [input, getQuickAnalysis]);

    // Handler para optimizar prompt
    const handleOptimize = async () => {
        if (!isValidInput(input)) {
            alert(`El prompt debe tener entre 3 y 500 caracteres (actual: ${input.length})`);
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

    // Calcular métricas individuales para visualización micro
    const getMetricScore = (metricName) => {
        if (!quickAnalysis || !quickAnalysis.analysis) return 0;
        
        switch (metricName) {
            case 'Claridad':
                return Math.round(quickAnalysis.analysis.clarity || 0);
            case 'Contexto':
                return Math.round(quickAnalysis.analysis.context || 0);
            case 'Precisión':
                return Math.round(quickAnalysis.analysis.specificity || 0);
            default:
                return 0;
        }
    };

    // Determinar color de métrica basado en puntuación
    const getMetricColor = (score) => {
        if (score >= 70) return 'text-cyan-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-slate-400';
    };

    // Determinar icono de métrica
    const getMetricIcon = (score) => {
        if (score >= 70) return 'fa-check-circle';
        if (score >= 40) return 'fa-bolt';
        return 'fa-circle';
    };

    // Métricas para mostrar
    const metrics = [
        { name: 'Claridad', key: 'clarity' },
        { name: 'Contexto', key: 'context' },
        { name: 'Precisión', key: 'specificity' }
    ];

    return (
        <div 
            className={cn(
                "bg-white/80 border border-cyan-100 rounded-3xl p-5 md:p-8 backdrop-blur-sm shadow-lg",
                "flex flex-col md:flex-row gap-5 md:gap-8",
                className
            )}
            {...rest}
        >
            {/* Lado Izquierdo: Entrada de Usuario */}
            <div className="flex-1 flex flex-col">
                {/* Textarea Principal */}
                <div className="flex-1">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe tu idea aquí..."
                        className={cn(
                            "w-full h-48 md:h-56",
                            "bg-white/95 border border-cyan-100 rounded-2xl",
                            "px-4 py-3",
                            "text-slate-800 placeholder:text-slate-400/70",
                            FORUM_TYPOGRAPHY.BODY,
                            "resize-none",
                            "focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:border-cyan-300",
                            FORUM_EFFECTS.TRANSITION_ALL,
                            "shadow-sm"
                        )}
                        maxLength={500}
                    />
                    
                    {/* Contador de caracteres */}
                    <div className="mt-2 flex justify-between items-center">
                        <span className={cn(
                            "text-xs",
                            charCount > 450 ? "text-amber-500" : "text-slate-500"
                        )}>
                            {charCount} / 500 caracteres
                        </span>
                        
                        {charCount > 0 && charCount < 3 && (
                            <span className="text-xs text-amber-500">
                                Mínimo 3 caracteres
                            </span>
                        )}
                    </div>
                </div>

                {/* Botonera */}
                <div className="mt-6">
                    <button
                        onClick={handleOptimize}
                        disabled={loading || !isValidInput(input)}
                        className={cn(
                            GRADIENTS.PRIMARY,
                            "w-full px-6 py-3 rounded-xl",
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

                    {/* Mensajes de error */}
                    {error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                    
                    {apiError && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-600">{apiError}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lado Derecho: Dashboard Analítico Reactivo (Micro-Visual) */}
            <div className="flex-1">
                <div className="h-full flex flex-col justify-center">
                    {/* Título ultra minimalista */}
                    <div className="mb-3">
                        <h3 className={cn(
                            "text-xs font-semibold text-slate-600 uppercase tracking-wider",
                            FORUM_TYPOGRAPHY.SUBHEADING
                        )}>
                            Análisis en Vivo
                        </h3>
                    </div>

                    {/* Métricas Micro-Visual - Versión compacta */}
                    <div className="space-y-2">
                        {metrics.map((metric) => {
                            const score = getMetricScore(metric.name);
                            const colorClass = getMetricColor(score);
                            const iconName = getMetricIcon(score);
                            
                            return (
                                <div 
                                    key={metric.name}
                                    className={cn(
                                        "flex items-center justify-between",
                                        "p-2 rounded-lg",
                                        "bg-white/50 border border-slate-100",
                                        FORUM_EFFECTS.TRANSITION_ALL,
                                        "hover:bg-white/70"
                                    )}
                                >
                                    {/* Icono y Nombre */}
                                    <div className="flex items-center gap-2">
                                        <Icon 
                                            name={iconName} 
                                            className={cn(
                                                "text-xs",
                                                score >= 70 ? "text-cyan-500" : 
                                                score >= 40 ? "text-amber-500" : "text-slate-400"
                                            )}
                                        />
                                        <span className={cn(
                                            "text-xs font-semibold text-slate-700",
                                            FORUM_TYPOGRAPHY.MEDIUM
                                        )}>
                                            {metric.name}
                                        </span>
                                    </div>

                                    {/* Indicador de puntuación compacto */}
                                    <div className="flex items-center gap-1.5">
                                        {/* Barra de progreso ultra delgada */}
                                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full",
                                                    score >= 70 ? "bg-cyan-500" : 
                                                    score >= 40 ? "bg-amber-500" : "bg-slate-300"
                                                )}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                        
                                        {/* Porcentaje compacto */}
                                        <span className={cn(
                                            "text-xs font-semibold w-8 text-right",
                                            colorClass
                                        )}>
                                            {score}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Estado de análisis minimalista */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        {!input.trim() ? (
                            <p className="text-xs text-slate-400 text-center">
                                ✍️ Escribe para analizar
                            </p>
                        ) : input.trim().length < 3 ? (
                            <p className="text-xs text-amber-500 text-center">
                                ⚠️ Mínimo 3 caracteres
                            </p>
                        ) : quickAnalysis ? (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "text-xs font-semibold",
                                        quickAnalysis.level === 'Excelente' ? "text-cyan-600" :
                                        quickAnalysis.level === 'Bueno' ? "text-cyan-500" :
                                        quickAnalysis.level === 'Aceptable' ? "text-amber-500" :
                                        "text-slate-400"
                                    )}>
                                        {quickAnalysis.level}
                                    </span>
                                    {quickAnalysis.emoji && (
                                        <span className="text-xs">{quickAnalysis.emoji}</span>
                                    )}
                                </div>
                                {quickAnalysis.score > 0 && (
                                    <span className="text-xs text-slate-500 mt-0.5">
                                        Puntuación: {quickAnalysis.score}%
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 text-center">
                                🔍 Analizando calidad...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReactivePromptStation;