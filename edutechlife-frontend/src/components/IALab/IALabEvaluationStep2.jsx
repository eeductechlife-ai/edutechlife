import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

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
    const [optimizedPrompt, setOptimizedPrompt] = useState(response || '');
    const [characterCount, setCharacterCount] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(true);

    // Actualizar contador de caracteres
    useEffect(() => {
        setCharacterCount(optimizedPrompt.length);
        onResponseChange(optimizedPrompt);
    }, [optimizedPrompt, onResponseChange]);

    // Sugerencias de mejora predefinidas
    const improvementSuggestions = [
        {
            title: "Especificidad",
            description: "Añade detalles concretos en lugar de términos vagos",
            example: "En lugar de 'mejorar ventas', especifica 'aumentar conversiones en un 15%'"
        },
        {
            title: "Audiencia",
            description: "Define claramente a quién va dirigido el prompt",
            example: "Especifica 'para emprendedores de e-commerce' en lugar de 'para negocios'"
        },
        {
            title: "Estructura",
            description: "Organiza el prompt en secciones lógicas",
            example: "Usa encabezados como ## Objetivo, ## Audiencia, ## Requisitos"
        },
        {
            title: "Llamada a la acción",
            description: "Incluye instrucciones claras sobre qué hacer",
            example: "Añade 'Genera 3 opciones diferentes' o 'Proporciona ejemplos concretos'"
        },
        {
            title: "Tono y estilo",
            description: "Define el tono deseado (profesional, creativo, técnico)",
            example: "Especifica 'Usa un tono profesional pero accesible para no expertos'"
        },
        {
            title: "Formato de salida",
            description: "Indica cómo quieres que se presente la respuesta",
            example: "Pide 'en formato de lista con viñetas' o 'en una tabla comparativa'"
        }
    ];

    // Plantillas de prompts optimizados
    const promptTemplates = [
        {
            name: "Prompt Estratégico",
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
            name: "Prompt Creativo",
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
            name: "Prompt Técnico",
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
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                        <Icon name="fa-magic" className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Optimiza este prompt</h3>
                        <p className="text-slate-400 text-sm">
                            Mejora el prompt mal redactado haciéndolo más específico, claro y efectivo
                        </p>
                    </div>
                </div>
            </div>

            {/* Prompt original (mal redactado) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name="fa-exclamation-triangle" className="text-amber-500" />
                        <h4 className="text-lg font-semibold text-white">Prompt a optimizar</h4>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full">
                        Necesita mejora
                    </span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <Icon name="fa-comment-dots" className="text-amber-500 mt-1" />
                        <p className="text-amber-300 italic leading-relaxed">
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
                        <h4 className="text-lg font-semibold text-white">Tu versión optimizada</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm ${characterCount < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {characterCount} caracteres
                        </span>
                        <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="text-sm text-slate-400 hover:text-white"
                        >
                            {showSuggestions ? 'Ocultar sugerencias' : 'Mostrar sugerencias'}
                        </button>
                    </div>
                </div>
                
                <div className="relative">
                    <textarea
                        value={optimizedPrompt}
                        onChange={(e) => setOptimizedPrompt(e.target.value)}
                        placeholder="Escribe aquí tu prompt optimizado. Sé específico, claro y estructurado..."
                        className="w-full h-64 bg-slate-900/50 border-2 border-slate-700 rounded-xl p-5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 resize-none font-mono text-sm leading-relaxed"
                        spellCheck="false"
                        autoFocus
                    />
                    
                    {/* Contador de caracteres en esquina inferior derecha */}
                    <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                        characterCount < 50 ? 'bg-red-500/20 text-red-400' :
                        characterCount < 100 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                    }`}>
                        {characterCount}/500
                    </div>
                </div>
            </div>

            {/* Sugerencias de mejora */}
            {showSuggestions && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Icon name="fa-lightbulb" className="text-[#00BCD4]" />
                        <h4 className="text-lg font-semibold text-white">Sugerencias para mejorar</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {improvementSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleImprovementClick(suggestion)}
                                className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl p-4 text-left transition-all duration-200 hover:border-[#00BCD4]/30 group"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00BCD4]/20">
                                        <span className="text-[#00BCD4] font-bold">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-white mb-1">{suggestion.title}</h5>
                                        <p className="text-slate-400 text-sm">{suggestion.description}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <p className="text-sm text-slate-300 italic">{suggestion.example}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Plantillas de prompts */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Icon name="fa-copy" className="text-[#004B63]" />
                            <h4 className="text-lg font-semibold text-white">Plantillas de estructura</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {promptTemplates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => applyTemplate(template.template)}
                                    className="bg-slate-800/30 hover:bg-slate-700/30 border border-slate-700 rounded-xl p-4 text-left transition-all duration-200 hover:border-[#004B63]/30 group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#004B63]/10 flex items-center justify-center group-hover:bg-[#004B63]/20">
                                            <Icon name="fa-file-alt" className="text-[#004B63]" />
                                        </div>
                                        <h5 className="font-semibold text-white">{template.name}</h5>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Haz clic para usar esta estructura como base para tu prompt optimizado.
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist de calidad */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name="fa-clipboard-check" className="text-emerald-500" />
                    <h4 className="text-lg font-semibold text-white">Checklist de calidad</h4>
                </div>
                
                <div className="space-y-3">
                    {[
                        { text: "El prompt es específico y evita términos vagos", met: characterCount > 50 },
                        { text: "Define claramente el rol y contexto", met: optimizedPrompt.includes('##') || optimizedPrompt.toLowerCase().includes('rol') },
                        { text: "Incluye objetivos medibles", met: optimizedPrompt.toLowerCase().includes('objetivo') || optimizedPrompt.includes('%') || optimizedPrompt.includes('aumentar') },
                        { text: "Especifica la audiencia objetivo", met: optimizedPrompt.toLowerCase().includes('audiencia') || optimizedPrompt.toLowerCase().includes('público') },
                        { text: "Tiene una estructura organizada", met: optimizedPrompt.split('\n').length > 5 },
                        { text: "Incluye formato de respuesta deseado", met: optimizedPrompt.toLowerCase().includes('formato') || optimizedPrompt.toLowerCase().includes('estructura') }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                item.met ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800/50 border border-slate-700'
                            }`}>
                                {item.met ? (
                                    <Icon name="fa-check" className="text-emerald-500 text-xs" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                                )}
                            </div>
                            <span className={`text-sm ${item.met ? 'text-emerald-400' : 'text-slate-400'}`}>
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