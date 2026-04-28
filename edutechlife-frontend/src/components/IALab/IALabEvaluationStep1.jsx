import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

/**
 * Componente para Paso 1: Identificar elementos en un escenario
 * Interfaz interactiva para clasificar Rol, Contexto, Tarea
 * 
 * @param {Object} props
 * @param {string} props.exercise - Texto del ejercicio generado por DeepSeek
 * @param {string} props.response - Respuesta actual del usuario (JSON string)
 * @param {Function} props.onResponseChange - Handler para actualizar respuesta
 */
const IALabEvaluationStep1 = ({ exercise, response, onResponseChange }) => {
    const [selectedElements, setSelectedElements] = useState({
        rol: '',
        contexto: '',
        tarea: ''
    });

    // Parsear respuesta existente si hay
    React.useEffect(() => {
        if (response) {
            try {
                const parsed = JSON.parse(response);
                setSelectedElements(parsed);
            } catch {
                // Si no es JSON válido, mantener estado actual
            }
        }
    }, [response]);

    // Extraer posibles elementos del texto del ejercicio
    const extractPossibleElements = (text) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        const possibleElements = {
            rol: [],
            contexto: [],
            tarea: []
        };

        sentences.forEach(sentence => {
            const lower = sentence.toLowerCase();
            
            // Detectar roles
            if (lower.includes('eres un') || lower.includes('como') || lower.includes('experto') || 
                lower.includes('consultor') || lower.includes('especialista')) {
                possibleElements.rol.push(sentence.trim());
            }
            
            // Detectar contexto
            if (lower.includes('para') || lower.includes('en') || lower.includes('trabajando') ||
                lower.includes('contexto') || lower.includes('situación')) {
                possibleElements.contexto.push(sentence.trim());
            }
            
            // Detectar tareas
            if (lower.includes('debes') || lower.includes('necesitas') || lower.includes('tarea') ||
                lower.includes('objetivo') || lower.includes('crear') || lower.includes('desarrollar')) {
                possibleElements.tarea.push(sentence.trim());
            }
        });

        // Garantizar mínimo 3 opciones por categoría
        const ensureMinimum = (elements, defaults) => {
            return elements.length >= 3 ? elements : [...elements, ...defaults.slice(0, 3 - elements.length)];
        };
        const rolDefaults = ["Eres un experto en inteligencia artificial", "Actúas como consultor especializado en tecnología", "Tu rol es analista y estratega digital"];
        const contextoDefaults = ["En un entorno educativo innovador", "Para una empresa que busca transformación digital", "En el contexto de un proyecto de mejora continua"];
        const tareaDefaults = ["Debes analizar y resolver el desafío planteado", "Necesitas estructurar una solución paso a paso", "Crea un plan detallado con objetivos medibles"];

        possibleElements.rol = ensureMinimum(possibleElements.rol, rolDefaults);
        possibleElements.contexto = ensureMinimum(possibleElements.contexto, contextoDefaults);
        possibleElements.tarea = ensureMinimum(possibleElements.tarea, tareaDefaults);

        return possibleElements;
    };

    const possibleElements = extractPossibleElements(exercise);

    const handleElementSelect = (type, element) => {
        const newSelection = {
            ...selectedElements,
            [type]: element === selectedElements[type] ? '' : element
        };
        
        setSelectedElements(newSelection);
        onResponseChange(JSON.stringify(newSelection));
    };

    const handleDragStart = (e, type, element) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type, element }));
    };

    const handleDrop = (e, targetType) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type && data.element) {
                const newSelection = {
                    ...selectedElements,
                    [targetType]: data.element
                };
                setSelectedElements(newSelection);
                onResponseChange(JSON.stringify(newSelection));
            }
        } catch (error) {
            console.error('Error en drag & drop:', error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-6">
            {/* Instrucciones */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                        <Icon name="fa-search" className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Identifica los elementos clave</h3>
                        <p className="text-slate-500 text-sm">
                            Analiza el escenario y clasifica cada parte como Rol, Contexto o Tarea
                        </p>
                        <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-[#004B63]">¿Cómo resolver este ejercicio?</strong> Lee atentamente el escenario. Debajo encontrarás fragmentos de texto que debes arrastrar hacia la columna correcta. Si no ves 3 opciones, busca frases como "Eres un...", "Trabajando para..." o "Debes..." en el texto del escenario para identificarlas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Escenario generado por DeepSeek */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Icon name="fa-scroll" className="text-[#00BCD4]" />
                    <h4 className="text-lg font-semibold text-slate-800">Escenario</h4>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {exercise}
                    </p>
                </div>
            </div>

            {/* Áreas de clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rol */}
                <div 
                    className="bg-white rounded-xl p-5 border-2 border-[#00BCD4]/20 min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'rol')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#00BCD4]/10 flex items-center justify-center">
                            <Icon name="fa-user-tie" className="text-[#00BCD4]" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">Rol</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        ¿Quién eres? Arrastra aquí frases que definan el rol del asistente.
                    </p>
                    
                    {selectedElements.rol ? (
                        <div className="bg-[#00BCD4]/5 border border-[#00BCD4]/20 rounded-lg p-3 mb-3">
                            <div className="flex items-start justify-between">
                                <p className="text-[#00BCD4] text-sm">{selectedElements.rol}</p>
                                <button
                                    onClick={() => handleElementSelect('rol', '')}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <Icon name="fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-400 text-xl mb-2" />
                            <p className="text-slate-400 text-sm">Arrastra un elemento aquí</p>
                        </div>
                    )}
                </div>

                {/* Contexto */}
                <div 
                    className="bg-white rounded-xl p-5 border-2 border-[#004B63]/20 min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'contexto')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#004B63]/10 flex items-center justify-center">
                            <Icon name="fa-building" className="text-[#004B63]" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">Contexto</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        ¿Dónde? Arrastra aquí frases sobre la situación o entorno.
                    </p>
                    
                    {selectedElements.contexto ? (
                        <div className="bg-[#004B63]/5 border border-[#004B63]/20 rounded-lg p-3 mb-3">
                            <div className="flex items-start justify-between">
                                <p className="text-[#004B63] text-sm">{selectedElements.contexto}</p>
                                <button
                                    onClick={() => handleElementSelect('contexto', '')}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <Icon name="fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-400 text-xl mb-2" />
                            <p className="text-slate-400 text-sm">Arrastra un elemento aquí</p>
                        </div>
                    )}
                </div>

                {/* Tarea */}
                <div 
                    className="bg-white rounded-xl p-5 border-2 border-emerald-500/20 min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'tarea')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Icon name="fa-tasks" className="text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">Tarea</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        ¿Qué debes hacer? Arrastra aquí frases sobre la tarea u objetivo.
                    </p>
                    
                    {selectedElements.tarea ? (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-3">
                            <div className="flex items-start justify-between">
                                <p className="text-emerald-500 text-sm">{selectedElements.tarea}</p>
                                <button
                                    onClick={() => handleElementSelect('tarea', '')}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <Icon name="fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-400 text-xl mb-2" />
                            <p className="text-slate-400 text-sm">Arrastra un elemento aquí</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Elementos extraíbles */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Icon name="fa-puzzle-piece" className="text-slate-400" />
                    <h4 className="text-lg font-semibold text-slate-800">Elementos para clasificar</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(possibleElements).map(([type, elements]) => (
                        <div key={type} className="space-y-2">
                            <h5 className="text-sm font-medium text-slate-500 capitalize">{type}</h5>
                            {elements.map((element, index) => (
                                <div
                                    key={index}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, type, element)}
                                    className={`p-3 rounded-lg cursor-move transition-all duration-200 ${
                                        selectedElements[type] === element
                                            ? type === 'rol' ? 'bg-[#00BCD4]/10 border border-[#00BCD4]' :
                                              type === 'contexto' ? 'bg-[#004B63]/10 border border-[#004B63]' :
                                              'bg-emerald-500/10 border border-emerald-500'
                                            : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                    onClick={() => handleElementSelect(type, element)}
                                >
                                    <div className="flex items-start gap-2">
                                        <Icon 
                                            name={type === 'rol' ? 'fa-user-tie' : 
                                                  type === 'contexto' ? 'fa-building' : 'fa-tasks'} 
                                            className={`mt-1 ${
                                                type === 'rol' ? 'text-[#00BCD4]' :
                                                type === 'contexto' ? 'text-[#004B63]' :
                                                'text-emerald-500'
                                            }`}
                                        />
                                        <p className="text-sm text-slate-700 flex-1">{element}</p>
                                        {selectedElements[type] === element && (
                                            <Icon name="fa-check" className="text-emerald-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Guía de ayuda */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                    <Icon name="fa-lightbulb" className="text-amber-500" />
                    <h4 className="text-lg font-semibold text-slate-800">Consejos para identificar</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">Rol</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Busca frases como "Eres un...", "Como experto en...", "Tu rol es..."
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#004B63] rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">Contexto</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Identifica la empresa, industria, situación específica o restricciones
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">Tarea</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Encuentra el objetivo claro: "Debes...", "Necesitas...", "Crea un..."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IALabEvaluationStep1;