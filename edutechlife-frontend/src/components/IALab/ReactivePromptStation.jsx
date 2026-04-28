import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import useIALabSynthesizer from '../../hooks/IALab/useIALabSynthesizer';
import { cn } from '../forum/forumDesignSystem';

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
        getQuickAnalysis,
        copyToClipboard
    } = useIALabSynthesizer();

    const [quickAnalysis, setQuickAnalysis] = useState(null);
    const [charCount, setCharCount] = useState(input.length);
    const [copied, setCopied] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(true);

    const handleInputChange = useCallback((e) => {
        const text = e.target.value;
        setInput(text);
        if (text.trim().length >= 3) {
            const analysis = getQuickAnalysis(text);
            setQuickAnalysis(analysis);
        } else {
            setQuickAnalysis(null);
        }
    }, [setInput, getQuickAnalysis]);

    useEffect(() => {
        setCharCount(input.length);
    }, [input]);

    useEffect(() => {
        if (input.trim().length >= 3) {
            const analysis = getQuickAnalysis(input);
            setQuickAnalysis(analysis);
        }
    }, [input, getQuickAnalysis]);

    useEffect(() => {
        if (genData?.optimizedPrompt) {
            setIsResultOpen(true);
        }
    }, [genData]);

    const handleOptimize = async () => {
        if (!isValidInput(input)) {
            alert(`El prompt debe tener entre 3 y 500 caracteres (actual: ${input.length})`);
            return;
        }
        await optimizePrompt(input);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleOptimize();
        }
    };

    const handleCopy = () => {
        if (genData?.optimizedPrompt) {
            copyToClipboard(genData.optimizedPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getMetricScore = (metricName) => {
        if (!quickAnalysis || !quickAnalysis.analysis) return 0;
        switch (metricName) {
            case 'Claridad': return Math.round(quickAnalysis.analysis.clarity || 0);
            case 'Contexto': return Math.round(quickAnalysis.analysis.context || 0);
            case 'Precisión': return Math.round(quickAnalysis.analysis.specificity || 0);
            default: return 0;
        }
    };

    const getMetricColor = (score) => {
        if (score >= 70) return 'text-[#004B63]';
        if (score >= 40) return 'text-[#00BCD4]';
        return 'text-slate-400';
    };

    const getMetricBarColor = (score) => {
        if (score >= 70) return 'bg-[#004B63]';
        if (score >= 40) return 'bg-[#00BCD4]';
        return 'bg-slate-300';
    };

    const getMetricIcon = (score) => {
        if (score >= 70) return 'fa-check-circle';
        if (score >= 40) return 'fa-bolt';
        return 'fa-circle';
    };

    const metrics = [
        { name: 'Claridad', key: 'clarity' },
        { name: 'Contexto', key: 'context' },
        { name: 'Precisión', key: 'specificity' }
    ];

    const improvements = genData?.feedback?.improvements || [];

    const isLoading = loading;
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
            transition={{ duration: 0.2 }}
            animate={isLoading ? {
                boxShadow: [
                    "0px 4px 16px rgba(17,17,26,0.05)",
                    "0px 0px 30px rgba(0,75,99,0.15)",
                    "0px 4px 16px rgba(17,17,26,0.05)"
                ]
            } : {}}
            className={cn(
                "relative z-10 bg-white rounded-2xl p-5 md:p-8 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] border border-slate-100 overflow-hidden",
                "space-y-6",
                className
            )}
            {...rest}
        >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

            <div>
                <h2 className="text-lg md:text-xl font-bold text-[#004B63]">
                    Sintetizador de Prompts
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-1">
                    Escribe una idea básica y la IA la transformará en una instrucción maestra
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute top-3 left-3 text-[#004B63]/30 pointer-events-none z-10">
                                <Icon name="fa-pen" className="w-4 h-4" />
                            </div>
                            <textarea
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe brevemente tu idea para un prompt..."
                                className={cn(
                                    "w-full h-32 md:h-40",
                                    "bg-slate-50/50 border border-slate-200 rounded-xl",
                                    "pl-10 pr-4 py-3",
                                    "text-slate-700 placeholder:text-slate-400/50 text-sm",
                                    "resize-none",
                                    "focus:outline-none focus:ring-2 focus:ring-[#004B63]/20 focus:border-[#004B63]/30 focus:bg-white",
                                    "transition-all duration-300",
                                    "shadow-sm"
                                )}
                                maxLength={500}
                            />
                        </div>
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

                    <div className="mt-6">
                        <motion.button
                            onClick={handleOptimize}
                            disabled={loading || !isValidInput(input)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className={cn(
                                "w-full px-6 py-3 rounded-xl",
                                "bg-gradient-to-r from-[#004B63] via-[#003A4D] to-[#06B6D4]",
                                "text-white font-semibold",
                                "hover:bg-white hover:text-[#004B63]",
                                "shadow-md shadow-[#004B63]/20 hover:shadow-lg hover:shadow-[#004B63]/30",
                                "transition-all duration-300",
                                "flex items-center justify-center gap-2",
                                "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/30 focus:ring-offset-2",
                                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white"
                            )}
                            aria-label={loading ? "Analizando y mejorando..." : "Generar prompt profesional"}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Analizando y Mejorando...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="fa-wand-magic-sparkles" className="text-sm text-white hover:text-[#004B63]" />
                                    <span className="text-sm text-white hover:text-[#004B63]">Generar Prompt Profesional</span>
                                </>
                            )}
                        </motion.button>

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

                <div className="flex-1">
                    <div className="h-full flex flex-col justify-center">
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Análisis en Vivo
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {metrics.map((metric) => {
                                const score = getMetricScore(metric.name);
                                const colorClass = getMetricColor(score);
                                const iconName = getMetricIcon(score);
                                const barColor = getMetricBarColor(score);

                                return (
                                    <div 
                                        key={metric.name}
                                        className="flex items-center justify-between p-3 rounded-lg bg-[#004B63]/5 border border-[#004B63]/10 hover:bg-[#004B63]/8 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon 
                                                name={iconName} 
                                                className={cn("text-sm", colorClass)}
                                            />
                                            <span className="text-xs font-medium text-slate-700">
                                                {metric.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-20 md:w-24 h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-xs font-semibold w-8 text-right", colorClass)}>
                                                {score}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#004B63]/10">
                            {!input.trim() ? (
                                <p className="text-xs text-slate-400 text-center">
                                    Escribe para analizar
                                </p>
                            ) : input.trim().length < 3 ? (
                                <p className="text-xs text-amber-500 text-center">
                                    Mínimo 3 caracteres
                                </p>
                            ) : quickAnalysis ? (
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1">
                                        <span className={cn(
                                            "text-xs font-semibold px-2.5 py-1 rounded-md",
                                            quickAnalysis.level === 'Excelente' ? "bg-emerald-50 text-emerald-700" :
                                            quickAnalysis.level === 'Bueno' ? "bg-[#004B63]/10 text-[#004B63]" :
                                            quickAnalysis.level === 'Aceptable' ? "bg-[#00BCD4]/10 text-[#00BCD4]" :
                                            "bg-slate-100 text-slate-500"
                                        )}>
                                            {quickAnalysis.level}
                                        </span>
                                        {quickAnalysis.emoji && (
                                            <span className="text-xs ml-1">{quickAnalysis.emoji}</span>
                                        )}
                                    </div>
                                    {quickAnalysis.score > 0 && (
                                        <span className="text-xs text-slate-500 mt-1">
                                            Puntuación: {quickAnalysis.score}%
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center">
                                    Analizando calidad...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {genData && genData.optimizedPrompt && (
                <div className="space-y-4 pt-4 border-t border-[#004B63]/10">
                    <div
                        onClick={() => setIsResultOpen(!isResultOpen)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#004B63]/5 hover:bg-[#004B63]/10 border border-[#00BCD4]/20 cursor-pointer transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <Icon name="fa-terminal" className="text-[#004B63] w-4 h-4" />
                            <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                                Resultado
                            </span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isResultOpen ? 'bg-[#004B63]/10' : 'bg-[#06B6D4]/15'
                            }`}>
                                <Icon
                                    name={isResultOpen ? "fa-chevron-up" : "fa-chevron-down"}
                                    className={`w-3 h-3 ${isResultOpen ? 'text-[#004B63]' : 'text-[#06B6D4]'}`}
                                />
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#004B63] text-xs font-semibold rounded-lg transition-all duration-200"
                        >
                            <Icon name={copied ? "fa-check" : "fa-copy"} className="w-3 h-3" />
                            <span>{copied ? "Copiado" : "Copiar"}</span>
                        </button>
                    </div>

                    {isResultOpen && (
                        <>
                            <div className="relative bg-gradient-to-br from-[#004B63]/5 to-[#00BCD4]/8 rounded-xl p-5 md:p-6 border border-[#00BCD4]/20 shadow-xl shadow-[#00BCD4]/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                                        <Icon name="fa-terminal" className="text-white w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#004B63]">
                                        Prompt Generado
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                  <p className="text-slate-700 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                                      {genData.optimizedPrompt}
                                  </p>
                                </div>
                            </div>

                            <div className="bg-[#004B63]/5 border-l-4 border-[#004B63] rounded-r-xl p-4 md:p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-md bg-[#004B63]/10 flex items-center justify-center flex-shrink-0">
                                        <Icon name="fa-lightbulb" className="text-[#004B63] w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-semibold text-[#004B63] text-sm">Feedback Educativo</span>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                    {genData.feedback?.educationalInsights || genData.feedback?.summary || ''}
                                </p>
                                {improvements.length > 0 && (
                                    <>
                                        <div className="my-3 border-t border-[#004B63]/10" />
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-5 h-5 rounded-md bg-[#004B63]/10 flex items-center justify-center flex-shrink-0">
                                                <Icon name="fa-list-check" className="text-[#004B63] w-2.5 h-2.5" />
                                            </div>
                                            <span className="text-xs font-semibold text-[#004B63] uppercase tracking-wider">Mejoras aplicadas</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {improvements.map((imp, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                                                    <div className="w-5 h-5 rounded-full bg-[#004B63]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Icon name="fa-check" className="text-[#004B63] w-2.5 h-2.5" />
                                                    </div>
                                                    <span className="leading-snug">{imp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default ReactivePromptStation;
