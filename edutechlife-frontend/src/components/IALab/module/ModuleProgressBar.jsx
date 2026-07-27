import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const ModuleProgressBar = ({ viewedCount, totalCount, t }) => {
  if (totalCount === 0) return null;
  const pct = Math.round((viewedCount / totalCount) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="fa-chart-line" className="text-[10px] text-petroleum" />
          {t("ialab.module.progress_title")}
        </span>
        <span className="text-[10px] font-bold text-petroleum">
          {viewedCount}/{totalCount} &middot; {pct}%
        </span>
      </div>
      <div
        className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500 ease-out"
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
