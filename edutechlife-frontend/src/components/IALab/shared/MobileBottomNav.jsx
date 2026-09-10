import { memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../i18n/I18nProvider";

const NAV_ITEMS = [
  {
    id: null,
    labelKey: "ialab.tab_all",
    fallback: "Todo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    id: "actividades",
    labelKey: "ialab.tab_activities",
    fallback: "Actividades",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: "practica",
    labelKey: "ialab.tab_practice",
    fallback: "Práctica",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: "__menu__",
    labelKey: "ialab.menu_aria",
    fallback: "Menú",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

function MobileBottomNav({ viewSection, onSelectSection, onOpenMenu, badgeCount = 0 }) {
  const { t } = useTranslation();

  return (
    <nav
      role="navigation"
      aria-label={t("ialab.bottom_nav_aria") || "Navegación principal"}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-16 pb-[env(safe-area-inset-bottom,0px)] bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]"
    >
      {NAV_ITEMS.map((item) => {
        const isMenu = item.id === "__menu__";
        const isActive = !isMenu && viewSection === item.id;

        return (
          <button
            key={String(item.id)}
            type="button"
            onClick={() => {
              if (isMenu) { onOpenMenu(); return; }
              onSelectSection(item.id);
            }}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--theme-emphasis)]/50
              ${isActive
                ? "text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
          >
            <span className={`relative w-6 h-6 ${isActive ? "[&_svg]:stroke-[2.5px]" : ""}`}>
              {item.icon}
              {isMenu && badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 text-[9px] font-bold text-white bg-[var(--theme-emphasis)] rounded-full flex items-center justify-center px-0.5">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </span>
            <span className={`text-[10px] font-semibold truncate max-w-full px-1 leading-none ${isActive ? "font-bold" : ""}`}>
              {t(item.labelKey) || item.fallback}
            </span>
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-[var(--theme-emphasis)]"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

MobileBottomNav.propTypes = {
  viewSection: PropTypes.string,
  onSelectSection: PropTypes.func.isRequired,
  onOpenMenu: PropTypes.func.isRequired,
  badgeCount: PropTypes.number,
};

export default memo(MobileBottomNav);
