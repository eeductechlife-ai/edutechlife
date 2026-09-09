import { Icon } from "../../utils/iconMapping.jsx";
import { cn } from "../forum/forumDesignSystem";
import { motion } from "framer-motion";
import { useIALabProgressContext } from "../../context/IALabContext";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Sección Informativa del Módulo - Dinámica por módulo activo
 * Contiene: Objetivo General, Lo que aprenderás, Desafío del Módulo
 * - Módulo 1: Datos hardcodeados originales (intactos)
 * - Módulos 2-5: Datos dinámicos desde moduleContent
 *
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const ModuleInfoSection = ({ className = "", ...rest }) => {
  const { t } = useTranslation();
  const {
    activeMod = 1,
    moduleContent = {},
    calculateModuleScore = () => 0,
  } = useIALabProgressContext() ?? {};
  const moduleScore = calculateModuleScore(activeMod);
  const isModuleCompleted = moduleScore >= 80;

  // Módulo 1: Datos originales (INTACTOS)
  const module1Data = {
    objective: t("ialab.module_info.objective"),
    objectiveHighlight: t("ialab.module_info.objective_highlight"),
    objectiveSuffix: t("ialab.module_info.objective_suffix"),
    learningPoints: [
      { text: t("ialab.module_info.learning_1"), icon: "fa-bullseye" },
      {
        text: t("ialab.module_info.learning_2"),
        icon: "fa-wand-magic-sparkles",
      },
      {
        text: t("ialab.module_info.learning_3"),
        icon: "fa-exclamation-triangle",
      },
      { text: t("ialab.module_info.learning_4"), icon: "fa-rocket" },
    ],
  };

  // Datos dinámicos según módulo activo
  const isModule1 = activeMod === 1;
  const dynamicContent = moduleContent[activeMod];

  const moduleData = isModule1
    ? module1Data
    : {
        objective: dynamicContent?.objective || "",
        objectiveHighlight: null,
        objectiveSuffix: "",
        learningPoints: dynamicContent?.learningPoints || [],
      };

  // Render objetivo con o sin highlight
  const renderObjective = () => {
    if (moduleData.objectiveHighlight) {
      return (
        <>
          {moduleData.objective}
          <span className="font-semibold theme-text-emphasis">
            {moduleData.objectiveHighlight}
          </span>
          {moduleData.objectiveSuffix}
        </>
      );
    }
    return moduleData.objective;
  };

  const gradeItems = [
    {
      label: "Comunidad",
      pct: "5%",
      cls: "bg-violet-100 dark:bg-violet-900/25 text-violet-700 dark:text-violet-400",
    },
    {
      label: "Desafío",
      pct: "30%",
      cls: "bg-blue-100 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400",
    },
    {
      label: "Reto",
      pct: "35%",
      cls: "bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 text-[var(--theme-emphasis)] dark:text-[#4DA8C4]",
    },
    {
      label: "Recursos",
      pct: "30%",
      cls: "bg-amber-100 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400",
    },
  ];

  return (
    <motion.div
      aria-live="polite"
      aria-label={`Información del módulo ${activeMod}`}
      className={cn(
        "relative z-10 rounded-2xl border theme-border shadow-sm overflow-hidden",
        className,
      )}
      style={{ background: "var(--theme-surface)" }}
      {...rest}
    >
      {/* Orbes decorativos */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-gradient-to-br from-[var(--theme-primary)]/8 to-[var(--theme-emphasis)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-tr from-[var(--theme-primary)]/5 to-[var(--theme-emphasis)]/4 rounded-full blur-2xl pointer-events-none" />

      {/* ── HERO: Objetivo del Módulo ── */}
      <div className="relative px-4 md:px-6 pt-4 pb-4 bg-gradient-to-br from-[var(--theme-emphasis)]/[0.05] to-[var(--theme-primary)]/[0.02] dark:from-[var(--theme-emphasis)]/[0.10] dark:to-[var(--theme-primary)]/[0.05] border-b border-[var(--theme-emphasis)]/10 dark:border-[var(--theme-emphasis)]/15">
        {/* Barra top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--theme-emphasis)] via-[var(--theme-primary)] to-[var(--theme-emphasis)]/40 rounded-t-2xl" />

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-md shadow-[var(--theme-emphasis)]/20 flex items-center justify-center flex-shrink-0">
            <Icon name="fa-bullseye" className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-extrabold theme-text-emphasis uppercase tracking-wider mb-1 font-montserrat">
              {t("ialab.module_info.objective_title")}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {renderObjective()}
            </p>
          </div>
          {moduleScore > 0 && (
            <div
              className={`flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                isModuleCompleted
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-[var(--theme-emphasis)]/10 dark:bg-[var(--theme-emphasis)]/20 text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"
              }`}
            >
              <Icon
                name={isModuleCompleted ? "fa-check-circle" : "fa-star"}
                className="text-[9px]"
              />
              <span className="font-semibold opacity-70">
                {t("ialab.module_info.score_label")}
              </span>
              {moduleScore}%
            </div>
          )}
        </div>
      </div>

      {/* ── LO QUE APRENDERÁS ── */}
      <div className="px-4 md:px-6 pt-4 pb-3">
        <div className="flex items-center mb-2.5">
          <h4 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-montserrat">
            {t("ialab.module_info.learning_title")}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {moduleData.learningPoints.map((point, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-200 ${
                isModuleCompleted
                  ? "bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200/60 dark:border-emerald-700/30"
                  : "bg-[var(--theme-emphasis)]/[0.03] dark:bg-[var(--theme-emphasis)]/[0.07] border-[var(--theme-emphasis)]/8 dark:border-[var(--theme-emphasis)]/15"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                  isModuleCompleted
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : "bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-[var(--theme-emphasis)]/20"
                }`}
              >
                <Icon
                  name={isModuleCompleted ? "fa-check" : point.icon}
                  className="text-white text-[11px]"
                />
              </div>
              <p
                className={`text-sm font-medium leading-snug transition-colors duration-200 ${
                  isModuleCompleted
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMPOSICIÓN DE NOTA ── */}
      <div className="px-4 md:px-6 pb-4">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          {t("ialab.module_info.grade_composition_title")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {gradeItems.map(({ label, pct, cls }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cls}`}
            >
              {label} <span className="font-black">{pct}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleInfoSection;
