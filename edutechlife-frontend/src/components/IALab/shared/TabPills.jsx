import { memo, useCallback } from "react";

/**
 * @param {Object} props
 * @param {Array<{id: string, label: string}>} props.TABS
 * @param {string} props.viewSection
 * @param {(id: string) => void} props.setViewSection
 */
export function TabPills({ TABS, viewSection, setViewSection, badges = {} }) {
  const handleKeyDown = useCallback(
    (e, tabIndex) => {
      const tabs = TABS.filter((t) => t.id !== undefined);
      const currentIdx = tabs.findIndex((t) => t.id === viewSection);
      let nextIdx;

      if (e.key === "ArrowLeft") {
        nextIdx = currentIdx <= 0 ? tabs.length - 1 : currentIdx - 1;
      } else if (e.key === "ArrowRight") {
        nextIdx = currentIdx >= tabs.length - 1 ? 0 : currentIdx + 1;
      } else {
        return;
      }

      e.preventDefault();
      setViewSection(tabs[nextIdx].id);
      document
        .querySelector(`[data-tab-id="${tabs[nextIdx].id || "all"}"]`)
        ?.focus();
    },
    [TABS, viewSection, setViewSection],
  );

  return (
    <>
      {TABS.map((tab) => (
        <button
          key={tab.id ?? "all"}
          id={tab.id != null ? `tab-${tab.id}` : undefined}
          data-tab-id={tab.id ?? "all"}
          role="tab"
          aria-selected={viewSection === tab.id}
          aria-controls={tab.id != null ? `panel-${tab.id}` : undefined}
          tabIndex={viewSection === tab.id ? 0 : -1}
          onClick={() => setViewSection(tab.id)}
          onKeyDown={(e) => handleKeyDown(e)}
          className={`min-h-[44px] flex items-center gap-1 px-2.5 py-1.5 text-xs md:px-3.5 md:py-2 md:text-xs font-semibold transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 border rounded-lg md:rounded-xl ${
            viewSection === tab.id
              ? "bg-gradient-to-r from-petroleum to-corporate text-white border-petroleum/30 shadow-md shadow-petroleum/10 ring-1 ring-white/20"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/30 hover:text-petroleum dark:hover:text-petroleum hover:shadow-sm"
          }`}
        >
          {tab.label}
          {badges[tab.id] > 0 && (
            <span className={`ml-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center ${
              viewSection === tab.id
                ? 'bg-white/25 text-white'
                : 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
            }`}>
              {badges[tab.id]}
            </span>
          )}
        </button>
      ))}
    </>
  );
}

export default memo(TabPills);
