import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { motion } from 'framer-motion';
import { useIALabContext } from '../../context/IALabContext';

/**
 * Sección Informativa del Módulo - Dinámica por módulo activo
 * Contiene: Objetivo General, Lo que aprenderás, Desafío del Módulo
 * - Módulo 1: Datos hardcodeados originales (intactos)
 * - Módulos 2-5: Datos dinámicos desde moduleContent
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const ModuleInfoSection = ({ className = '', ...rest }) => {
    const { activeMod, moduleContent, completedExams, moduleProgress, calculateModuleScore } = useIALabContext();
    const moduleScore = calculateModuleScore(activeMod);
    const isModuleCompleted = moduleScore >= 80;
    
    // Módulo 1: Datos originales (INTACTOS)
    const module1Data = {
        objective: "Desarrolla habilidades de ",
        objectiveHighlight: "prompt engineering",
        objectiveSuffix: " para obtener resultados precisos de la IA en contextos reales.",
        learningPoints: [
            { text: "Instrucciones claras a la IA", icon: "fa-bullseye" },
            { text: "Mejorar preguntas y respuestas", icon: "fa-wand-magic-sparkles" },
            { text: "Detectar y corregir errores", icon: "fa-exclamation-triangle" },
            { text: "Aplicar IA en estudio y trabajo", icon: "fa-rocket" }
        ]
    };
    
    // Datos dinámicos según módulo activo
    const isModule1 = activeMod === 1;
    const dynamicContent = moduleContent[activeMod];
    
    const moduleData = isModule1 ? module1Data : {
        objective: dynamicContent?.objective || "",
        objectiveHighlight: null,
        objectiveSuffix: "",
        learningPoints: dynamicContent?.learningPoints || []
    };
    
    // Render objetivo con o sin highlight
    const renderObjective = () => {
        if (moduleData.objectiveHighlight) {
            return (
                <>
                    {moduleData.objective}<span className="font-semibold text-petroleum">{moduleData.objectiveHighlight}</span>{moduleData.objectiveSuffix}
                </>
            );
        }
        return moduleData.objective;
    };

    return (
        <motion.div 
            aria-live="polite" aria-label={`Información del módulo ${activeMod}`}
            whileHover={{ boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 hover:border-petroleum/20 dark:hover:border-petroleum/30",
                className
            )}
            {...rest}
        >
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-petroleum/6 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-petroleum/4 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>

            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

            {/* Contenido principal */}
            <div className="p-4 md:p-6">
                {/* Header con objetivo */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum to-petroleum-dark shadow-md shadow-petroleum/15 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-bullseye" className="text-base text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
<h3 className="text-sm font-bold text-petroleum uppercase tracking-wider dark:text-[#4DA8C4]">
                             Objetivo del Módulo
                         </h3>
                         <p className="text-sm text-slate-600 leading-snug mt-1 dark:text-slate-300">
                            {renderObjective()}
                        </p>
                    </div>
                </div>

                {/* Divider sutil */}
                <div className="h-px bg-gradient-to-r from-transparent via-petroleum/10 to-transparent mb-4"></div>

                {/* Lo que aprenderás */}
                <div>
<h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400">
                         Lo que aprenderás
                     </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {moduleData.learningPoints.map((point, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg w-full transition-all duration-200 ${
                                  isModuleCompleted ? 'bg-emerald-50/60 dark:bg-emerald-900/10' : ''
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                                  isModuleCompleted
                                    ? 'bg-emerald-500'
                                    : 'bg-gradient-to-br from-petroleum to-corporate'
                                }`}>
                                    <Icon
                                        name={isModuleCompleted ? 'fa-check' : point.icon}
                                        className="text-white text-xs"
                                    />
                                </div>
                                <p className={`text-sm font-medium leading-tight transition-colors duration-200 ${
                                  isModuleCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                                }`}>
                                     {point.text}
                                 </p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-5 font-montserrat">
                    Composición de la nota: Comunidad <span className="font-semibold text-slate-600 dark:text-slate-300">(5%)</span>
                    {' · '}Desafío <span className="font-semibold text-slate-600 dark:text-slate-300">(30%)</span>
                    {' · '}Examen <span className="font-semibold text-slate-600 dark:text-slate-300">(35%)</span>
                    {' · '}Recursos <span className="font-semibold text-slate-600 dark:text-slate-300">(30%)</span>
                </p>

            </div>
        </motion.div>
    );
};

export default ModuleInfoSection;
