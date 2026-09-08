import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const ModuleProgressBar = ({ viewedCount, totalCount, t }) => {
  if (totalCount === 0) return null;
  const pct = Math.round((viewedCount / totalCount) * 100);
  const isComplete = pct >= 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Icon
            name={isComplete ? "fa-check-circle" : "fa-chart-line"}
            className={`text-xs ${isComplete ? "text-emerald-500" : "text-[var(--theme-emphasis)]"}`}
          />
          {t("ialab.module.progress_title")}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-black ${isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"}`}
          >
            {pct}%
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {viewedCount}/{totalCount}
          </span>
        </div>
      </div>
      <div
        className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isComplete
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

ModuleProgressBar.propTypes = {
  viewedCount: PropTypes.number,
  totalCount: PropTypes.number,
  t: PropTypes.func,
};

export default ModuleProgressBar;
