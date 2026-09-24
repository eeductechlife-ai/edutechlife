import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useIALabStore } from "../../../store/ialabStore";

const CHIP_CLASS =
  "inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] whitespace-nowrap flex-shrink-0";

const GRID_CLASS =
  "flex items-center gap-2 p-2.5 min-h-[44px] bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]";

const ValerioQuickActions = ({ quickActions, onAction, disabled }) => {
  const { t, locale } = useTranslation();
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const hasLessonContext = lastVisitedLesson?.lessonId != null;
  const [expanded, setExpanded] = useState(false);
  const rowRef = useRef(null);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFade = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth - el.clientWidth > 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setShowRightFade(hasOverflow && !atEnd);
  }, []);

  useEffect(() => {
    if (expanded) {
      setShowRightFade(false);
      return undefined;
    }
    updateFade();
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, [expanded, quickActions, updateFade]);

  return (
    <div className="px-4 py-2.5 border-b border-slate-100">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {t("ialab.valerio.quick_actions_title")}
        </h3>
        <div className="flex items-center gap-2 min-w-0">
          {hasLessonContext && (
            <span className="hidden sm:inline text-[10px] text-[var(--theme-primary)] font-medium px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/5">
              {["en", "pt"].includes(locale) ? "In-lesson" : "En lección"}
            </span>
          )}
          <button
            type="button"
            data-testid="quick-actions-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--theme-primary)] hover:text-[var(--theme-emphasis)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] rounded px-1 flex-shrink-0"
          >
            {expanded
              ? t("ialab.valerio.quick_actions_show_less")
              : t("ialab.valerio.quick_actions_show_all")}
            <Icon
              name={expanded ? "fa-chevron-up" : "fa-chevron-down"}
              className="text-[10px]"
            />
          </button>
        </div>
      </div>

      {expanded ? (
        <div
          className="grid grid-cols-2 gap-2"
          data-testid="quick-actions-grid"
        >
          {quickActions.map((action) => (
            <button
              key={action.id}
              data-testid="quick-action-btn"
              onClick={() => onAction(action)}
              disabled={disabled}
              className={GRID_CLASS}
            >
              <Icon
                name={action.icon}
                className="text-[var(--theme-primary)] flex-shrink-0"
              />
              <span className="text-left">{action.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={rowRef}
            onScroll={updateFade}
            className="flex gap-2 overflow-x-auto pb-1 -mb-1 pr-6"
            data-testid="quick-actions-row"
          >
            {quickActions.map((action) => (
              <button
                key={action.id}
                data-testid="quick-action-btn"
                onClick={() => onAction(action)}
                disabled={disabled}
                className={CHIP_CLASS}
              >
                <Icon
                  name={action.icon}
                  className="text-[var(--theme-primary)] text-xs"
                />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${
              showRightFade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}
    </div>
  );
};

ValerioQuickActions.propTypes = {
  quickActions: PropTypes.array,
  onAction: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ValerioQuickActions;
