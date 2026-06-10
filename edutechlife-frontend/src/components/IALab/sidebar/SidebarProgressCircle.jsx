import React from 'react'
import PropTypes from 'prop-types';;

const SidebarProgressCircle = ({ courseProgress, t }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center" role="progressbar" aria-valuenow={Math.round(courseProgress)} aria-valuemin="0" aria-valuemax="100" aria-label={t('sidebar.progress_circle_aria')}>
      <svg className="w-full h-full transform -rotate-90 p-1" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="7" fill="none" />
        <circle cx="60" cy="60" r="50" stroke="url(#sidebar-progress-grad)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="314.159" strokeDashoffset={314.159 - (314.159 * Math.min(courseProgress, 100)) / 100} className="transition-all duration-700 ease-out" />
        <defs>
          <linearGradient id="sidebar-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-petroleum)" />
            <stop offset="100%" stopColor="var(--color-corporate)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-petroleum dark:text-[#4DA8C4]">{Math.round(courseProgress)}%</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t('sidebar.completed')}</div>
        </div>
      </div>
    </div>
    <h3 className="text-lg font-bold text-petroleum dark:text-[#4DA8C4] mt-3">{t('sidebar.progress')}</h3>
  </div>
);


SidebarProgressCircle.propTypes = {
  courseProgress: PropTypes.number,
  t: PropTypes.func,
};

export default React.memo(SidebarProgressCircle);
