import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { motion } from 'framer-motion';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useTranslation } from '../../i18n/I18nProvider';

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
    const { t } = useTranslation();
    const { activeMod, moduleContent, calculateModuleScore } = useIALabProgressContext();
    const moduleScore = calculateModuleScore(activeMod);
    const isModuleCompleted = moduleScore >= 80;
    
    // Módulo 1: Datos originales (INTACTOS)
    const module1Data = {
        objective: t('ialab.module_info.objective'),
        objectiveHighlight: t('ialab.module_info.objective_highlight'),
        objectiveSuffix: t('ialab.module_info.objective_suffix'),
        learningPoints: [
            { text: t('ialab.module_info.learning_1'), icon: "fa-bullseye" },
            { text: t('ialab.module_info.learning_2'), icon: "fa-wand-magic-sparkles" },
            { text: t('ialab.module_info.learning_3'), icon: "fa-exclamation-triangle" },
            { text: t('ialab.module_info.learning_4'), icon: "fa-rocket" }
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
                    {moduleData.objective}<span className="font-semibold theme-text-emphasis">{moduleData.objectiveHighlight}</span>{moduleData.objectiveSuffix}
                </>
            );
        }
        return moduleData.objective;
    };

    return (
        <motion.div
            aria-live="polite" aria-label={`Información del módulo ${activeMod}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative z-10 rounded-2xl border theme-border shadow-sm overflow-hidden hover:theme-border-emphasis-20",
                className
            )}
            style={{ background: 'var(--theme-surface)' }}
            {...rest}
        >
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[var(--theme-primary)]/6 to-[var(--theme-emphasis)]/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-[var(--theme-primary)]/4 to-[var(--theme-emphasis)]/4 rounded-full blur-2xl pointer-events-none"></div>

            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 theme-bg-emphasis rounded-t-2xl" />

            {/* Contenido principal */}
            <div className="p-5 md:p-8">
                {/* Header con objetivo */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-emphasis)] shadow-md shadow-[var(--theme-emphasis)]/15 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-bullseye" className="text-base text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
<h4 className="text-xs font-bold theme-text-emphasis uppercase tracking-wider font-montserrat">
                              {t('ialab.module_info.objective_title')}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1 dark:text-slate-300">
                            {renderObjective()}
                        </p>
                    </div>
                </div>

                {/* Divider sutil */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)]/10 to-transparent mb-4"></div>

                {/* Lo que aprenderás */}
                <div>
<h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400 font-montserrat">
                         {t('ialab.module_info.learning_title')}
                     </h4>
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
                                    : 'theme-bg-emphasis'
                                }`}>
                                    <Icon
                                        name={isModuleCompleted ? 'fa-check' : point.icon}
                                        className="text-white text-xs"
                                    />
                                </div>
                                <p className={`text-sm font-medium leading-relaxed transition-colors duration-200 ${
                                  isModuleCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                                }`}>
                                     {point.text}
                                 </p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-5 font-montserrat">
                    {t('ialab.module_info.composition', { communityPct: '5%', challengePct: '30%', examPct: '35%', resourcesPct: '30%' })}
                </p>

            </div>
        </motion.div>
    );
};

export default ModuleInfoSection;
