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

  const isNotebookLM = activeMod === 4;
  const isArtesano = activeMod === 1 || activeMod === 5;

  /* Estilos Artesano Digital (M1) — usa el tema "default" del sistema */
  if (isArtesano) {
    return (
      <motion.div
        aria-live="polite"
        aria-label="Información del módulo 1"
        className={cn("relative z-10", className)}
        {...rest}
      >
        <div className="rounded-2xl border theme-border overflow-hidden theme-surface">

          {/* Header con color del tema default */}
          <div className="px-6 py-4 border-b theme-border flex items-center justify-between theme-bg-emphasis">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10">
                {activeMod === 5 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                )}
              </div>
              <span className="text-[15px] font-semibold text-white">
                {t("ialab.module_info.objective_title")}
              </span>
            </div>
            {moduleScore > 0 && (
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isModuleCompleted ? "bg-emerald-500/20 text-emerald-200" : "bg-white/15 text-white"
              }`}>
                {isModuleCompleted ? "✓" : "★"} {t("ialab.module_info.score_label")} {moduleScore}%
              </span>
            )}
          </div>

          {/* Objetivo */}
          <div className="px-6 py-5 border-b theme-border">
            <p className="text-[15px] theme-text leading-[1.7]">
              {renderObjective()}
            </p>
          </div>

          {/* Lo que aprenderás */}
          <div className="px-6 py-5 border-b theme-border">
            <p className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider mb-3">
              {t("ialab.module_info.learning_title")}
            </p>
            <ul className="space-y-2.5">
              {moduleData.learningPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isModuleCompleted ? "bg-emerald-500" : "bg-[var(--theme-emphasis)]"
                  }`} />
                  <p className={`text-[14px] leading-[1.65] ${
                    isModuleCompleted ? "text-emerald-700 dark:text-emerald-400" : "theme-text"
                  }`}>
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Composición de nota */}
          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider mb-3">
              {t("ialab.module_info.grade_composition_title")}
            </p>
            <div className="flex flex-wrap gap-2">
              {gradeItems.map(({ label, pct, cls }) => (
                <span key={label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${cls}`}>
                  {label} <span className="font-black">{pct}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    );
  }

  /* Estilos NotebookLM — Google Sans, azul profundo, fichas Google */
  if (isNotebookLM) {
    const nlmFont = { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif" };
    const nlmGradeItems = [
      { label: "Comunidad", pct: "5%",  bg: "#f3e8fd", color: "#9334e9" },
      { label: "Desafío",   pct: "30%", bg: "#e8f0fe", color: "#1a73e8" },
      { label: "Reto",      pct: "35%", bg: "#fce8e6", color: "#d93025" },
      { label: "Recursos",  pct: "30%", bg: "#fff8e1", color: "#f9ab00" },
    ];
    return (
      <motion.div
        aria-live="polite"
        aria-label={`Información del módulo ${activeMod}`}
        className={cn("relative z-10", className)}
        {...rest}
      >
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e0e0e6" }}>

          {/* Header — barra azul NotebookLM */}
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#e0e0e6", background: "#f8f9ff" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#e8f0fe" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                </svg>
              </div>
              <span style={{ ...nlmFont, fontSize: 15, fontWeight: 600, color: "#202124" }}>
                {t("ialab.module_info.objective_title")}
              </span>
            </div>
            {moduleScore > 0 && (
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: isModuleCompleted ? "#e6f4ea" : "#e8f0fe", color: isModuleCompleted ? "#188038" : "#1a73e8" }}>
                {isModuleCompleted ? "✓" : "★"} {t("ialab.module_info.score_label")} {moduleScore}%
              </span>
            )}
          </div>

          {/* Objetivo */}
          <div className="px-6 py-5 border-b" style={{ borderColor: "#f1f3f4" }}>
            <p style={{ ...nlmFont, fontSize: 15, color: "#3c4043", lineHeight: 1.7 }}>
              {renderObjective()}
            </p>
          </div>

          {/* Lo que aprenderás */}
          <div className="px-6 py-5 border-b" style={{ borderColor: "#f1f3f4" }}>
            <p style={{ ...nlmFont, fontSize: 12, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("ialab.module_info.learning_title")}
            </p>
            <ul className="space-y-2.5">
              {moduleData.learningPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isModuleCompleted ? "#188038" : "#1a73e8" }} />
                  <p style={{ ...nlmFont, fontSize: 14, color: isModuleCompleted ? "#188038" : "#3c4043", lineHeight: 1.65 }}>
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Composición de nota */}
          <div className="px-6 py-5">
            <p style={{ ...nlmFont, fontSize: 12, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("ialab.module_info.grade_composition_title")}
            </p>
            <div className="flex flex-wrap gap-2">
              {nlmGradeItems.map(({ label, pct, bg, color }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: bg, fontFamily: nlmFont.fontFamily, fontSize: 12, fontWeight: 600, color }}>
                  {label} <span style={{ fontWeight: 800 }}>{pct}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    );
  }

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
