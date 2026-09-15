import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

const DailyPlanHeader = ({
  t,
  isOpen,
  onToggle,
  atRisk,
  pendingCount = 0,
  firstItemTitle,
}) => {
  const summary = atRisk
    ? t("ialab.streak_risk_title") || "¡Tu racha está en riesgo! Actúa ahora"
    : pendingCount > 0
      ? t("ialab.daily_plan.steps_count", { count: pendingCount })
      : t("ialab.daily_plan.empty_title");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      data-testid="daily-plan-header"
      className={`relative w-full overflow-hidden rounded-xl border py-3 px-4 flex items-center gap-3 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/30 ${
        atRisk
          ? "border-amber-300/60 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-900/10"
          : "theme-surface theme-border theme-rail-hover"
      }`}
    >
      {atRisk && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl ring-1 ring-amber-400/50 pointer-events-none"
        />
      )}

      <span
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          atRisk ? "bg-amber-100 dark:bg-amber-900/30" : "theme-chip"
        }`}
      >
        <Icon
          name={atRisk ? "fa-fire" : "fa-lightbulb"}
          className={`w-4 h-4 ${atRisk ? "text-amber-500" : "text-[var(--theme-emphasis)]"}`}
        />
        {atRisk && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-800 animate-ping motion-reduce:animate-none"
          />
        )}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block leading-tight text-[15px] font-semibold theme-text">
          {t("ialab.daily_plan.title")}
        </span>
        <span
          className={`block leading-tight text-[11px] truncate ${
            atRisk
              ? "font-semibold text-amber-600 dark:text-amber-400"
              : "theme-text-muted"
          }`}
        >
          {summary}
          {!atRisk && !isOpen && firstItemTitle ? ` · ${firstItemTitle}` : ""}
        </span>
      </span>

      <span className="flex items-center gap-2 flex-shrink-0">
        {pendingCount > 0 && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold min-w-[20px] text-center ${
              atRisk
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                : "theme-chip text-[var(--theme-emphasis)]"
            }`}
          >
            {pendingCount}
          </span>
        )}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="fa-chevron-down" className="w-3 h-3 theme-text-muted" />
        </motion.span>
      </span>
    </button>
  );
};

DailyPlanHeader.propTypes = {
  t: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  atRisk: PropTypes.bool,
  pendingCount: PropTypes.number,
  firstItemTitle: PropTypes.string,
};

export default DailyPlanHeader;
