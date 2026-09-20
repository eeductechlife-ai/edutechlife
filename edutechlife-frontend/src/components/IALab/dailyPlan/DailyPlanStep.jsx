import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const ICON_BY_TYPE = {
  streak: "fa-fire",
  exam: "fa-star",
  challenge: "fa-bolt",
  recommendation: "fa-lightbulb",
  content: "fa-play",
};

/**
 * Fila del plan del día en modo LECTURA (informa, no acciona).
 * La acción ocurre en el botón único del header (opción C).
 */
const DailyPlanStep = ({ t, step, index, isCurrent }) => {
  const title = step.titleKey ? t(step.titleKey) : step.title;
  const icon = step.icon || ICON_BY_TYPE[step.type] || "fa-lightbulb";
  const stateKey = step.completed
    ? "ialab.daily_plan.done_btn"
    : isCurrent
      ? "ialab.next_step.current"
      : "ialab.next_step.pending";

  return (
    <div
      data-testid="daily-plan-step"
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
        isCurrent
          ? "border-[var(--theme-emphasis)]/30 theme-chip"
          : "theme-border border"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
          isCurrent
            ? "theme-bg-emphasis text-white"
            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
        }`}
      >
        {index}
      </span>
      <Icon
        name={icon}
        className="text-[11px] text-[var(--theme-emphasis)] flex-shrink-0"
      />
      <span className="flex-1 min-w-0 text-[12px] theme-text truncate">
        {title}
      </span>
      <span className="flex-shrink-0 text-[10px] font-medium theme-text-muted">
        {t(stateKey) ||
          (step.completed ? "Hecho" : isCurrent ? "Actual" : "Pendiente")}
      </span>
    </div>
  );
};

DailyPlanStep.propTypes = {
  t: PropTypes.func.isRequired,
  step: PropTypes.object.isRequired,
  index: PropTypes.number,
  isCurrent: PropTypes.bool,
};

export default DailyPlanStep;
