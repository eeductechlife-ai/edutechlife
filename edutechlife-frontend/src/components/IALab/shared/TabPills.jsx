import { memo } from 'react';

export function TabPills({ TABS, viewSection, setViewSection }) {
  return (
    <>
      {TABS.map((tab) => (
        <button
          key={tab.id ?? 'all'}
          role="tab"
          aria-selected={viewSection === tab.id}
          aria-controls={`panel-${tab.id || 'all'}`}
          onClick={() => setViewSection(tab.id)}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] md:px-3.5 md:py-2 md:text-xs font-semibold transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 border rounded-lg md:rounded-xl ${
            viewSection === tab.id
              ? 'bg-gradient-to-r from-petroleum to-corporate text-white border-petroleum/30 shadow-md shadow-petroleum/10 ring-1 ring-white/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/30 hover:text-petroleum dark:hover:text-petroleum hover:shadow-sm'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </>
  );
}

export default memo(TabPills);
