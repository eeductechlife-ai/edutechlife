import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const ICON_BY_TYPE = {
  streak: "fa-fire",
  exam: "fa-star",
  challenge: "fa-bolt",
  recommendation: "fa-lightbulb",
  content: "fa-play",
};

const DailyPlanHeader = ({
  t,
  step,
  currentIndex = 0,
  total = 1,
  atRisk,
  onRun,
}) => {
  if (!step) return null;

  const title = step.titleKey ? t(step.titleKey) : step.title;
  const description = step.descriptionKey
    ? t(step.descriptionKey)
    : step.description;
  const actionLabel = step.actionLabelKey
    ? t(step.actionLabelKey)
    : step.actionLabel;
  const icon = step.icon || ICON_BY_TYPE[step.type] || "fa-lightbulb";

  return (
    <div
      data-testid="daily-plan-header"
      className={`relative p-4 flex items-start gap-3 ${
        atRisk ? "bg-amber-50/60 dark:bg-amber-900/10" : "theme-surface"
      }`}
    >
      {atRisk && (
        <span
          aria-hidden="true"
          className="absolute inset-0 ring-1 ring-amber-400/40 pointer-events-none"
        />
      )}

      <span
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          atRisk ? "bg-amber-100 dark:bg-amber-900/30" : "theme-chip"
        }`}
      >
        <Icon
          name={icon}
          className={`w-4 h-4 ${atRisk ? "text-amber-500" : "text-[var(--theme-emphasis)]"}`}
        />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider theme-text-muted">
          {t("ialab.next_step.title") || "Siguiente paso"}
          <span className="ml-1.5 text-[var(--theme-emphasis)] font-bold">
            {t("ialab.next_step.progress", {
              current: currentIndex + 1,
              total,
            }) || `Paso ${currentIndex + 1} de ${total}`}
          </span>
        </p>
        <h3 className="text-[15px] font-semibold theme-text leading-snug mt-0.5">
          {title}
        </h3>
        {description && (
          <p className="text-[12px] theme-text-muted leading-snug mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onRun}
          className="flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-white theme-bg-emphasis px-3 py-2 min-h-[44px] rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
        >
          {actionLabel}
          <Icon name="fa-arrow-right" className="text-[9px]" />
        </button>
      )}
    </div>
  );
};

DailyPlanHeader.propTypes = {
  t: PropTypes.func.isRequired,
  step: PropTypes.object,
  currentIndex: PropTypes.number,
  total: PropTypes.number,
  atRisk: PropTypes.bool,
  onRun: PropTypes.func,
};

export default DailyPlanHeader;
