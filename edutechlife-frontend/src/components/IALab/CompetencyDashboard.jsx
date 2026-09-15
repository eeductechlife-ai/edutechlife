import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { analyzeCompetence } from "../../utils/competencyAnalytics";

const LEVEL_STYLES = {
  explorer: {
    icon: "fa-compass",
    bar: "bg-slate-400",
    text: "text-slate-500",
  },
  creator: {
    icon: "fa-wand-magic-sparkles",
    bar: "bg-[var(--theme-primary)]",
    text: "text-[var(--theme-primary)]",
  },
  expert: {
    icon: "fa-award",
    bar: "bg-[var(--theme-emphasis)]",
    text: "text-[var(--theme-emphasis)]",
  },
};

/**
 * Dashboard de progreso por competencia (Fase 6).
 * Componente puro y aditivo: recibe los puntajes por módulo y los agrega.
 */
function CompetencyDashboard({ t, modules = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const { modules: scored, overall, distribution, strongest, weakest } =
    analyzeCompetence(modules);

  const levelLabel = (level) => t(`ialab.competency.level_${level}`);

  return (
    <section
      data-testid="competency-dashboard"
      data-nomotion={shouldReduceMotion ? "" : undefined}
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg theme-chip flex items-center justify-center">
          <Icon name="fa-chart-simple" className="text-xs text-[var(--theme-emphasis)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--theme-emphasis)]">
          {t("ialab.competency.title")}
        </h3>
      </div>

      {scored.length === 0 ? (
        <p className="text-[13px] theme-text-muted">{t("ialab.competency.empty")}</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider theme-text-muted">
                {t("ialab.competency.overall_level")}
              </p>
              <p className={`text-sm font-bold ${LEVEL_STYLES[overall.level]?.text || ""}`}>
                {levelLabel(overall.level)}
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--theme-emphasis)]">
              {t("ialab.competency.overall_value", { avg: overall.average })}
            </p>
          </div>

          <div className="space-y-2">
            {scored.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium theme-text">
                    {t("ialab.competency.module_label", { n: mod.id })}
                  </span>
                  <span className={LEVEL_STYLES[mod.level]?.text || ""}>
                    {levelLabel(mod.level)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? false : { width: 0 }}
                    animate={{ width: `${mod.score}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`h-full rounded-full ${LEVEL_STYLES[mod.level]?.bar || "bg-slate-400"}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] theme-text-muted">
            {strongest && (
              <span>
                {t("ialab.competency.strongest")}:{" "}
                <strong className="font-semibold">
                  {t("ialab.competency.module_label", { n: strongest.id })}
                </strong>
              </span>
            )}
            {weakest && weakest.id !== strongest?.id && (
              <span>
                {t("ialab.competency.weakest")}:{" "}
                <strong className="font-semibold">
                  {t("ialab.competency.module_label", { n: weakest.id })}
                </strong>
              </span>
            )}
            <span>
              {t("ialab.competency.distribution", {
                explorer: distribution.explorer,
                creator: distribution.creator,
                expert: distribution.expert,
              })}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

CompetencyDashboard.propTypes = {
  t: PropTypes.func.isRequired,
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      score: PropTypes.number,
    }),
  ),
};

export default CompetencyDashboard;
