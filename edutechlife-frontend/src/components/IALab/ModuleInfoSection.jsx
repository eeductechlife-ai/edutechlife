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
      className={cn("relative z-10 space-y-4", className)}
      {...rest}
    >
      {/* ── Objetivo del Módulo ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[15px] font-bold theme-text">
            {t("ialab.module_info.objective_title")}
          </h4>
          {moduleScore > 0 && (
            <span
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
            </span>
          )}
        </div>
        <p className="text-[15px] theme-text leading-[1.65]">
          {renderObjective()}
        </p>
      </div>

      {/* ── Lo que aprenderás ── */}
      <div className="space-y-2">
        <h4 className="text-[15px] font-bold theme-text">
          {t("ialab.module_info.learning_title")}
        </h4>
        <ul className="space-y-1.5">
          {moduleData.learningPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <span
                className={`mt-[3px] flex-shrink-0 text-[13px] ${
                  isModuleCompleted
                    ? "text-emerald-500"
                    : "text-[var(--theme-emphasis)]"
                }`}
              >
                {isModuleCompleted ? "✓" : "•"}
              </span>
              <p
                className={`text-[15px] leading-[1.65] ${
                  isModuleCompleted
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "theme-text"
                }`}
              >
                {point.text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Composición de nota ── */}
      <div className="space-y-1.5">
        <h4 className="text-[15px] font-bold theme-text">
          {t("ialab.module_info.grade_composition_title")}
        </h4>
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
