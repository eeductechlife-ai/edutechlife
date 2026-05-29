import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

/**
 * Componente para Paso 2: Optimizar un prompt mal redactado
 * Interfaz con textarea premium y sugerencias de mejora
 * 
 * @param {Object} props
 * @param {string} props.exercise - Prompt mal redactado generado por DeepSeek
 * @param {string} props.response - Respuesta optimizada del usuario
 * @param {Function} props.onResponseChange - Handler para actualizar respuesta
 */
const IALabEvaluationStep2 = ({ exercise, response, onResponseChange }) => {
    const { t } = useTranslation();
    const [optimizedPrompt, setOptimizedPrompt] = useState(response || '');
    const [characterCount, setCharacterCount] = useState(response?.length || 0);
    const [showSuggestions, setShowSuggestions] = useState(true);

    const handleChange = (value) => {
        setOptimizedPrompt(value);
        setCharacterCount(value.length);
        onResponseChange(value);
    };

    // Sugerencias de mejora predefinidas
    const improvementSuggestions = [
        {
            title: t('ialab.evaluation.step2.suggestion_specificity'),
            description: t('ialab.evaluation.step2.suggestion_specificity_desc'),
            example: t('ialab.evaluation.step2.suggestion_specificity_ex')
        },
        {
            title: t('ialab.evaluation.step2.suggestion_audience'),
            description: t('ialab.evaluation.step2.suggestion_audience_desc'),
            example: t('ialab.evaluation.step2.suggestion_audience_ex')
        },
        {
            title: t('ialab.evaluation.step2.suggestion_structure'),
            description: t('ialab.evaluation.step2.suggestion_structure_desc'),
            example: t('ialab.evaluation.step2.suggestion_structure_ex')
        },
        {
            title: t('ialab.evaluation.step2.suggestion_cta'),
            description: t('ialab.evaluation.step2.suggestion_cta_desc'),
            example: t('ialab.evaluation.step2.suggestion_cta_ex')
        },
        {
            title: t('ialab.evaluation.step2.suggestion_tone'),
            description: t('ialab.evaluation.step2.suggestion_tone_desc'),
            example: t('ialab.evaluation.step2.suggestion_tone_ex')
        },
        {
            title: t('ialab.evaluation.step2.suggestion_format'),
            description: t('ialab.evaluation.step2.suggestion_format_desc'),
            example: t('ialab.evaluation.step2.suggestion_format_ex')
        }
    ];

    // Plantillas de prompts optimizados
    const promptTemplates = [
        {
            name: t('ialab.evaluation.step2.template_strategic'),
            template: `## Rol
Eres un [especificar rol experto]

## Contexto
[Describir situación específica, empresa, industria]

## Objetivo
[Objetivo claro y medible]

## Audiencia
[Descripción detallada del público objetivo]

## Requisitos
- [Requisito 1]
- [Requisito 2]
- [Requisito 3]

## Formato de respuesta
[Especificar formato deseado]`
        },
        {
            name: t('ialab.evaluation.step2.template_creative'),
            template: `## Brief creativo
[Descripción del proyecto o campaña]

## Objetivos clave
- [Objetivo 1]
- [Objetivo 2]

## Público objetivo
[Descripción demográfica y psicográfica]

## Tono y estilo
[Especificar tono deseado]

## Restricciones
[Limitaciones o requisitos específicos]

## Entregables esperados
[Lista de lo que se espera recibir]`
        },
        {
            name: t('ialab.evaluation.step2.template_technical'),
            template: `## Problema a resolver
[Descripción técnica del problema]

## Contexto técnico
[Información relevante sobre el sistema/tecnología]

## Requisitos funcionales
- [RF1]
- [RF2]

## Restricciones técnicas
- [RT1]
- [RT2]

## Criterios de éxito
[Métricas para evaluar la solución]

## Formato de solución
[Especificar estructura de la respuesta técnica]`
        }
    ];

    const applyTemplate = (template) => {
        setOptimizedPrompt(template);
        setShowSuggestions(false);
    };

    const handleImprovementClick = (suggestion) => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = optimizedPrompt;
            
            const newText = text.substring(0, start) + suggestion.example + text.substring(end);
            setOptimizedPrompt(newText);
            
            // Restaurar foco y posición del cursor
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + suggestion.example.length, start + suggestion.example.length);
            }, 0);
        }
    };

    return (
        <div className="space-y-8">
            {/* Instrucciones */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
                        <Icon name="fa-magic" className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{t('ialab.evaluation.step2.title')}</h3>
                        <p className="text-slate-500 text-sm">
                            {t('ialab.evaluation.step2.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Prompt original (mal redactado) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name="fa-exclamation-triangle" className="text-amber-500" />
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step2.prompt_to_optimize')}</h4>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">
                        {t('ialab.evaluation.step2.needs_improvement')}
                    </span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <Icon name="fa-comment-dots" className="text-amber-500 mt-1" />
                        <p className="text-amber-700 italic leading-relaxed">
                            "{exercise}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Editor de prompt optimizado */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name="fa-check-circle" className="text-emerald-500" />
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step2.your_optimized')}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm ${characterCount < 50 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {t('ialab.evaluation.step2.characters', { count: characterCount })}
                        </span>
                        <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="text-sm text-slate-500 hover:text-slate-700"
                        >
                            {showSuggestions ? t('ialab.evaluation.step2.hide_suggestions') : t('ialab.evaluation.step2.show_suggestions')}
                        </button>
                    </div>
                </div>
                
                <div className="relative">
                    <textarea
                        value={optimizedPrompt}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={t('ialab.evaluation.step2.placeholder')}
                        className="w-full h-64 bg-white border-2 border-slate-200 rounded-xl p-5 text-slate-700 placeholder-slate-500 focus:outline-none focus:border-corporate focus:ring-2 focus:ring-corporate/20 resize-none font-mono text-sm leading-relaxed"
                        spellCheck="false"
                        autoFocus
                    />
                    
                    {/* Contador de caracteres en esquina inferior derecha */}
                    <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                        characterCount < 50 ? 'bg-red-50 text-red-600' :
                        characterCount < 100 ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                    }`}>
                        {characterCount}/500
                    </div>
                </div>
            </div>

            {/* Sugerencias de mejora */}
            {showSuggestions && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Icon name="fa-lightbulb" className="text-corporate" />
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step2.suggestions_title')}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {improvementSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleImprovementClick(suggestion)}
                                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 text-left transition-all duration-200 hover:border-corporate/30 group"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-corporate/10 flex items-center justify-center flex-shrink-0 group-hover:bg-corporate/20">
                                        <span className="text-corporate font-bold">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-slate-800 mb-1">{suggestion.title}</h5>
                                        <p className="text-slate-500 text-sm">{suggestion.description}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <p className="text-sm text-slate-600 italic">{suggestion.example}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Plantillas de prompts */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-copy" className="text-petroleum" />
                            <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step2.templates_title')}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {promptTemplates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => applyTemplate(template.template)}
                                    className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 text-left transition-all duration-200 hover:border-petroleum/30 group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-petroleum/10 flex items-center justify-center group-hover:bg-petroleum/20">
                                            <Icon name="fa-file-alt" className="text-petroleum" />
                                        </div>
                                        <h5 className="font-semibold text-slate-800">{template.name}</h5>
                                    </div>
                                    <p className="text-slate-500 text-sm">
                                        {t('ialab.evaluation.step2.template_hint')}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist de calidad */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name="fa-clipboard-check" className="text-emerald-500" />
                    <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step2.checklist_title')}</h4>
                </div>
                
                <div className="space-y-3">
                    {[
                        { text: t('ialab.evaluation.step2.checklist_specific'), met: characterCount > 50 },
                        { text: t('ialab.evaluation.step2.checklist_role_context'), met: optimizedPrompt.includes('##') || optimizedPrompt.toLowerCase().includes('rol') },
                        { text: t('ialab.evaluation.step2.checklist_objectives'), met: optimizedPrompt.toLowerCase().includes('objetivo') || optimizedPrompt.includes('%') || optimizedPrompt.includes('aumentar') },
                        { text: t('ialab.evaluation.step2.checklist_target_audience'), met: optimizedPrompt.toLowerCase().includes('audiencia') || optimizedPrompt.toLowerCase().includes('público') },
                        { text: t('ialab.evaluation.step2.checklist_structure'), met: optimizedPrompt.split('\n').length > 5 },
                        { text: t('ialab.evaluation.step2.checklist_response_format'), met: optimizedPrompt.toLowerCase().includes('formato') || optimizedPrompt.toLowerCase().includes('estructura') }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                item.met ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-slate-200'
                            }`}>
                                {item.met ? (
                                    <Icon name="fa-check" className="text-emerald-500 text-xs" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                )}
                            </div>
                            <span className={`text-sm ${item.met ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationStep2;