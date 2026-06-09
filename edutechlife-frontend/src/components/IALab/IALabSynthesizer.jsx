import { useState, useEffect, memo, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import { useIALabProgressContext } from '../../context/IALabContext';
import useIALabSynthesizer from '../../hooks/IALab/useIALabSynthesizer';
import PromptFeedback from './PromptFeedback';
import SynthesizerSkeleton from './SynthesizerSkeleton';
import SynthesizerInput from './SynthesizerInput';
import SynthesizerSuggestions from './SynthesizerSuggestions';
import GenerationHistory from './GenerationHistory';
import DeepSeekDashboard from './DeepSeekDashboard';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, GRADIENTS, cn } from '../forum/forumDesignSystem';

/**
 * Componente premium para sintetizador de prompts educativo
 * Enseña prompt engineering con análisis real y feedback educativo
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const IALabSynthesizer = ({ className = '', ...rest }) => {
    const { t } = useTranslation();
    const { activeMod, modules } = useIALabProgressContext();
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
    const handleOptimize = useCallback(async () => {
        if (!isValidInput(input)) {
            alert(t('ialab.synthesizer.validation_error', { length: input.length }));
            return;
        }
        
        await optimizePrompt(input);
    }, [input, isValidInput, optimizePrompt, t]);

    // Handler para teclado (Enter para optimizar)
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleOptimize();
        }
    }, [handleOptimize]);

    // Handler para nueva generación (reset local)
    const handleNewGeneration = useCallback(() => {
        setInput('');
        if (clearHistory) clearHistory();
    }, [setInput, clearHistory]);

    // Handler para sugerencia rápida
    const handleSuggestionClick = useCallback((suggestion) => {
        setInput(suggestion);
    }, [setInput]);

    // Efecto para análisis en tiempo real
    useEffect(() => {
        if (input.trim().length >= 5) {
            const analysis = getQuickAnalysis(input);
            setQuickAnalysis(analysis);
        } else {
            setQuickAnalysis(null);
        }
    }, [input, getQuickAnalysis]);

    const renderSkeleton = () => <SynthesizerSkeleton />;

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
                        {t('ialab.synthesizer.title')}
                    </h3>
                    <p className={cn(
                        FORUM_TYPOGRAPHY.BODY.SM,
                        FORUM_TYPOGRAPHY.TEXT_LIGHT
                    )}>
                        {t('ialab.synthesizer.subtitle')}
                    </p>
                </div>
            </div>
            
            {/* Context badge */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 bg-petroleum/10 text-petroleum text-xs font-medium rounded-full">
                    <Icon name="fa-bullseye" className="text-xs" /> {context.challenge}
                </div>
                <div className="px-3 py-1 bg-corporate/10 text-corporate text-xs font-medium rounded-full">
                    <Icon name="fa-book-open" className="text-xs" /> {context.userLevel}
                </div>
                {techniques.slice(0, 2).map((tech, index) => (
                    <div key={index} className="px-3 py-1 bg-corporate/10 text-corporate text-xs font-medium rounded-full">
                        {tech.icon} {tech.name}
                    </div>
                ))}
            </div>
        </div>
    );



    const renderInputArea = () => (
      <SynthesizerInput
        input={input}
        setInput={setInput}
        loading={loading}
        loadMsg={loadMsg}
        isValidInput={isValidInput}
        quickAnalysis={quickAnalysis}
        onOptimize={handleOptimize}
        onKeyDown={handleKeyDown}
      />
    );

    // Render resultados de DeepSeek - Dashboard Analítico Premium
    const renderDeepSeekResults = () => {
        if (!genData || !genData.deepSeekData) return null;
        return <DeepSeekDashboard deepSeekData={genData.deepSeekData} t={t} copyToClipboard={copyToClipboard} handleNewGeneration={handleNewGeneration} />;
    };

    // Render resultado optimizado (para resultados locales)
    const renderLocalResult = () => {
        if (!genData) return null;
        
        return (
            <div className="mt-8 space-y-6">
                {/* Resumen ejecutivo */}
                <div className={cn(
                    "p-6 rounded-xl bg-gradient-to-r from-petroleum to-petroleum",
                    FORUM_EFFECTS.ANIMATION_FADE_IN,
                    "text-white"
                )} style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <Icon name="fa-chart-line" className="text-white text-xl" />
                        <h4 className={cn(
                            FORUM_TYPOGRAPHY.BODY.LG,
                            FORUM_TYPOGRAPHY.SEMIBOLD
                        )}>
                            {t('ialab.synthesizer.optimization_summary')}
                        </h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>{t('ialab.synthesizer.original_quality')}</span>
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                                {genData.analysis.score}/100
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>{t('ialab.synthesizer.applied_technique')}</span>
                            <span className="flex items-center gap-2">
                                <span>{genData.techniqueApplied.icon}</span>
                                <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                                    {genData.techniqueApplied.name}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-white/80")}>{t('ialab.synthesizer.expected_improvement')}</span>
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
                                {t('ialab.synthesizer.original_prompt')}
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
                                {t('ialab.synthesizer.optimized_prompt')}
                            </h4>
                        </div>
                        <div className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap",
                            "text-petroleum p-4 bg-white/50 rounded-lg",
                            "border border-corporate/30"
                        )}>
                            {genData.optimizedPrompt}
                        </div>
                        <button 
                            onClick={() => copyToClipboard(genData.optimizedPrompt)}
                            className={cn(
                                "absolute top-4 right-4 text-xs",
                                "border border-corporate text-corporate",
                                "hover:bg-corporate hover:text-white",
                                "flex items-center gap-1 px-2 py-1 rounded",
                                FORUM_EFFECTS.TRANSITION_ALL,
                                "focus:outline-none focus:ring-1 focus:ring-corporate"
                            )}
                            aria-label={t('ialab.synthesizer.copy_optimized_aria')}
                        >
                            <Icon name="fa-copy" className="text-xs" /> {t('ialab.synthesizer.copy')}
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
                    "bg-gradient-to-r from-petroleum/5 to-corporate/5",
                    "p-6 rounded-xl",
                    FORUM_EFFECTS.ANIMATION_FADE_IN
                )} style={{ animationDelay: '0.7s' }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-petroleum">{usageStats.totalOptimizations}</div>
                            <div className="text-xs text-slate-600">{t('ialab.synthesizer.total_optimizations')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-corporate">{usageStats.averageScore || 0}</div>
                            <div className="text-xs text-slate-600">{t('ialab.synthesizer.average_score')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-corporate">{usageStats.favoriteTechnique || 'N/A'}</div>
                            <div className="text-xs text-slate-600">{t('ialab.synthesizer.favorite_technique')}</div>
                        </div>
                        <div className="text-center">
                            <div className={cn(
                                "text-2xl font-bold",
                                usageStats.improvementTrend > 0 ? "text-green-600" : 
                                usageStats.improvementTrend < 0 ? "text-red-600" : "text-slate-600"
                            )}>
                                {usageStats.improvementTrend > 0 ? '+' : ''}{usageStats.improvementTrend || 0}
                            </div>
                            <div className="text-xs text-slate-600">{t('ialab.synthesizer.improvement_trend')}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHistory = () => (
        <GenerationHistory history={history} clearHistory={clearHistory} loadFromHistory={loadFromHistory} t={t} />
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
                              {t('ialab.synthesizer.error_title')}
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
                              {t('ialab.synthesizer.api_info')}
                         </h4>
                         <p className={cn(
                             FORUM_TYPOGRAPHY.BODY.SM,
                             "text-amber-600 mt-1"
                         )}>
                             {apiError}
                         </p>
                         <div className="mt-3 text-xs text-amber-700">
                              <p className="font-medium">{t('ialab.synthesizer.api_solution')}</p>
                              <ul className="list-disc pl-4 mt-1 space-y-1">
                                  <li>{t('ialab.synthesizer.api_local_mode')}</li>
                                  <li>{t('ialab.synthesizer.api_continue')}</li>
                                   <li>{t('ialab.synthesizer.api_verify_backend')}</li>
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
                    <SynthesizerSuggestions suggestions={suggestions} loading={loading} onSuggestionClick={handleSuggestionClick} t={t} />
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

export default memo(IALabSynthesizer);