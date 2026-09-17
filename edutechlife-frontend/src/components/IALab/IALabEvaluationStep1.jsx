import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

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
    const { t } = useTranslation();
    const [selectedElements, setSelectedElements] = useState({
        rol: '',
        contexto: '',
        tarea: ''
    });

    // Parsear respuesta existente si hay
    useEffect(() => {
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
            if (import.meta.env.DEV) console.error('Error en drag & drop:', error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Instrucciones */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-search" className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{t('ialab.evaluation.step1.title')}</h3>
                        <p className="text-slate-500 text-sm">
                            {t('ialab.evaluation.step1.subtitle')}
                        </p>
                    </div>
                </div>
                {/* Colapsado por defecto: es texto de apoyo, no el ejercicio en sí.
                    Mantenerlo siempre expandido era la mayor fuente de scroll
                    innecesario antes de llegar al escenario real. */}
                <details className="group mt-3">
                    <summary className="list-none flex items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer select-none">
                        <span className="text-xs font-semibold text-[var(--theme-emphasis)]">{t('ialab.evaluation.step1.how_to_title')}</span>
                        <Icon name="fa-chevron-down" className="text-[10px] text-[var(--theme-emphasis)] transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <p className="text-xs text-slate-600 leading-relaxed p-3 pt-2 bg-blue-50 border border-t-0 border-blue-100 rounded-b-xl -mt-px">
                        {t('ialab.evaluation.step1.how_to_desc')}
                    </p>
                </details>
            </div>

            {/* Escenario generado por DeepSeek */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Icon name="fa-scroll" className="text-[var(--theme-primary)]" />
                    <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step1.scenario')}</h4>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {exercise}
                    </p>
                </div>
            </div>

            {/*
              En móvil (una sola columna) mostrar antes la lista de frases
              tocables y después las cajas destino: si van primero las cajas
              vacías, hay que bajar mucho para encontrar qué tocar y volver a
              subir para confirmar dónde cayó. flex-col-reverse invierte solo
              el orden visual en mobile; md:contents deshace el flex en
              desktop para no tocar el grid de 3 columnas de cada sección.
            */}
            <div className="flex flex-col-reverse gap-6 md:contents">
            {/* Áreas de clasificación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rol */}
                <div 
                    className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[var(--theme-primary)]/20 min-h-[130px] sm:min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'rol')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center">
                            <Icon name="fa-user-tie" className="text-[var(--theme-primary)]" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step1.role')}</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        {t('ialab.evaluation.step1.role_hint')}
                    </p>
                    
                    {selectedElements.rol ? (
                        <div className="bg-[var(--theme-primary)]/5 border border-[var(--theme-primary)]/20 rounded-lg p-3 mb-3">
                            <div className="flex items-start justify-between">
                                <p className="text-[var(--theme-primary)] text-sm">{selectedElements.rol}</p>
                                <button
                                    onClick={() => handleElementSelect('rol', '')}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <Icon name="fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 sm:py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-600 text-xl mb-2" />
                            <p className="text-slate-600 text-sm">{t('ialab.evaluation.step1.drop_here')}</p>
                        </div>
                    )}
                </div>

                {/* Contexto */}
                <div 
                    className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[var(--theme-emphasis)]/20 min-h-[130px] sm:min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'contexto')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[var(--theme-emphasis)]/10 flex items-center justify-center">
                            <Icon name="fa-building" className="text-[var(--theme-emphasis)]" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step1.context')}</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        {t('ialab.evaluation.step1.context_hint')}
                    </p>
                    
                    {selectedElements.contexto ? (
                        <div className="bg-[var(--theme-emphasis)]/5 border border-[var(--theme-emphasis)]/20 rounded-lg p-3 mb-3">
                            <div className="flex items-start justify-between">
                                <p className="text-[var(--theme-emphasis)] text-sm">{selectedElements.contexto}</p>
                                <button
                                    onClick={() => handleElementSelect('contexto', '')}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <Icon name="fa-times" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 sm:py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-600 text-xl mb-2" />
                            <p className="text-slate-600 text-sm">{t('ialab.evaluation.step1.drop_here')}</p>
                        </div>
                    )}
                </div>

                {/* Tarea */}
                <div 
                    className="bg-white rounded-xl p-4 sm:p-5 border-2 border-emerald-500/20 min-h-[130px] sm:min-h-[200px]"
                    onDrop={(e) => handleDrop(e, 'tarea')}
                    onDragOver={handleDragOver}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Icon name="fa-tasks" className="text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step1.task')}</h4>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        {t('ialab.evaluation.step1.task_hint')}
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
                        <div className="text-center py-4 sm:py-8 border-2 border-dashed border-slate-300 rounded-lg">
                            <Icon name="fa-arrow-down" className="text-slate-600 text-xl mb-2" />
                            <p className="text-slate-600 text-sm">{t('ialab.evaluation.step1.drop_here')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Elementos extraíbles */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Icon name="fa-puzzle-piece" className="text-slate-600" />
                    <h4 className="text-lg font-semibold text-slate-800">{t('ialab.evaluation.step1.elements_to_classify')}</h4>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Icon name="fa-hand-pointer" className="text-slate-400" />
                    {t('ialab.evaluation.step1.tap_hint')}
                </p>

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
                                            ? type === 'rol' ? 'bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]' :
                                              type === 'contexto' ? 'bg-[var(--theme-emphasis)]/10 border border-[var(--theme-emphasis)]' :
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
                                                type === 'rol' ? 'text-[var(--theme-primary)]' :
                                                type === 'contexto' ? 'text-[var(--theme-emphasis)]' :
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
            </div>

            {/* Guía de ayuda — colapsada por defecto: es refuerzo opcional,
                no algo que el estudiante deba leer para poder continuar. */}
            <details className="group bg-slate-50 rounded-xl border border-slate-200">
                <summary className="list-none flex items-center gap-3 p-4 sm:p-5 cursor-pointer select-none">
                    <Icon name="fa-lightbulb" className="text-amber-500" />
                    <h4 className="text-lg font-semibold text-slate-800 flex-1">{t('ialab.evaluation.step1.tips_title')}</h4>
                    <Icon name="fa-chevron-down" className="text-xs text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--theme-primary)] rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">{t('ialab.evaluation.step1.role')}</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {t('ialab.evaluation.step1.role_tip')}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--theme-emphasis)] rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">{t('ialab.evaluation.step1.context')}</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {t('ialab.evaluation.step1.context_tip')}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">{t('ialab.evaluation.step1.task')}</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {t('ialab.evaluation.step1.task_tip')}
                        </p>
                    </div>
                </div>
            </details>
        </div>
    );
};


IALabEvaluationStep1.propTypes = {
  exercise: PropTypes.string,
  response: PropTypes.string,
  onResponseChange: PropTypes.func,
};

export default IALabEvaluationStep1;