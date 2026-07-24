import PropTypes from "prop-types";
import { getAllLessons } from "../../../data/ialab";
import { useTranslation } from "../../../i18n/I18nProvider";

const ModuleHeaderSection = ({
  moduleData,
  activeMod,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  lessonProgress,
}) => {
  const { t, locale } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-petroleum/10 to-corporate/10 text-[10px] font-bold text-petroleum uppercase tracking-[0.18em]">
          {t("ialab.module.module_label", { number: activeMod })}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-petroleum leading-tight dark:text-petroleum font-montserrat">
          {moduleData.title}
        </h2>
        <span className="px-3 py-1.5 bg-gradient-to-br from-petroleum/10 to-corporate/5 text-petroleum text-[10px] font-bold rounded-lg border border-petroleum/10 shadow-sm">
          {moduleData.badge.duration}
        </span>
        {(() => {
          const prog = lessonProgress[activeMod] || {};
          const total = (getAllLessons(locale)[activeMod] || []).length;
          const done = Object.values(prog).filter(
            (s) => s === "completed",
          ).length;
          if (!total) return null;
          return (
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${done === total ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
            >
              {t("ialab.module.lessons", { done, total })}
            </span>
          );
        })()}
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3 dark:text-slate-300">
        {isDescriptionExpanded
          ? moduleData.description
          : moduleData.description.split(". ").slice(0, 1).join(". ") + "."}
      </p>
      {moduleData.description.split(". ").length > 1 && (
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-corporate hover:text-petroleum transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 rounded group/see"
        >
          {isDescriptionExpanded ? t("ialab.see_less") : t("ialab.see_more")}
          <svg
            className={`w-3 h-3 transition-all duration-300 group-hover/see:translate-y-0.5 ${isDescriptionExpanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </>
  );
};

ModuleHeaderSection.propTypes = {
  moduleData: PropTypes.object,
  activeMod: PropTypes.number,
  isDescriptionExpanded: PropTypes.bool,
  setIsDescriptionExpanded: PropTypes.func,
  lessonProgress: PropTypes.object,
  t: PropTypes.func,
};

export default ModuleHeaderSection;
