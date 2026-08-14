import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const SidebarProgressCircle = ({
  courseProgress,
  t,
  levelName,
  streak,
  xp,
  atRisk,
  onCircleClick,
  onStreakClick,
}) => {
  const pct = Math.min(Math.round(courseProgress || 0), 100);
  return (
    <div className="flex flex-col items-center px-1">
      <button
        type="button"
        onClick={onCircleClick}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${pct}% ${t("sidebar.completed")} — ${t("sidebar.toggle_collapse_tip")}`}
        className="relative w-28 h-28 rounded-full bg-white dark:bg-slate-800 shadow-md shadow-petroleum/10 border border-petroleum/15 dark:border-petroleum/40 flex items-center justify-center transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-petroleum/30 cursor-pointer"
      >
        <svg className="w-full h-full -rotate-90 p-0.5" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            className="stroke-slate-100 dark:stroke-slate-700"
            strokeWidth="7"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#sidebar-progress-grad)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="314.159"
            strokeDashoffset={314.159 - (314.159 * pct) / 100}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient
              id="sidebar-progress-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--color-petroleum)" />
              <stop offset="100%" stopColor="var(--color-corporate)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-center">
            <span className="font-display text-2xl font-extrabold text-petroleum dark:text-[#4DA8C4] leading-none">
              {pct}%
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              {t("sidebar.completed")}
            </span>
          </span>
        </span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
        {levelName && (
          <span className="inline-flex items-center gap-1 rounded-full bg-petroleum/8 dark:bg-petroleum/20 px-2.5 py-1 text-[11px] font-bold text-petroleum dark:text-[#4DA8C4]">
            <Icon
              name="fa-graduation-cap"
              className="text-corporate text-[10px]"
              aria-hidden="true"
            />
            <span className="max-w-[110px] truncate">{levelName}</span>
          </span>
        )}
        {streak > 0 && (
          <button
            type="button"
            onClick={onStreakClick}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-petroleum/30 ${atRisk ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-petroleum/8 dark:bg-petroleum/20 text-petroleum dark:text-[#4DA8C4]"}`}
            aria-label={`${streak} ${t("sidebar.streak_days", { streak })} — ${t("sidebar.streak_details")}`}
          >
            <Icon
              name="fa-fire"
              className={
                atRisk
                  ? "text-amber-500 text-[10px]"
                  : "text-orange-500 text-[10px]"
              }
              aria-hidden="true"
            />
            {streak}d
          </button>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-petroleum/8 dark:bg-petroleum/20 px-2.5 py-1 text-[11px] font-bold text-petroleum dark:text-[#4DA8C4]">
          <Icon
            name="fa-star"
            className="text-corporate text-[10px]"
            aria-hidden="true"
          />
          {xp} XP
        </span>
      </div>
    </div>
  );
};

SidebarProgressCircle.propTypes = {
  courseProgress: PropTypes.number,
  t: PropTypes.func,
  levelName: PropTypes.string,
  streak: PropTypes.number,
  xp: PropTypes.number,
  atRisk: PropTypes.bool,
  onCircleClick: PropTypes.func,
  onStreakClick: PropTypes.func,
};

export default React.memo(SidebarProgressCircle);
