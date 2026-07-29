import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useIALabStore } from "../../../store/ialabStore";

const ValerioQuickActions = ({ quickActions, onAction, disabled }) => {
  const { t, locale } = useTranslation();
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const hasLessonContext = lastVisitedLesson?.lessonId != null;

  return (
    <div className="p-4 border-b border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-600">
          {t("ialab.valerio.quick_actions_title")}
        </h3>
        {hasLessonContext && (
          <span className="text-[10px] text-corporate font-medium px-2 py-0.5 rounded-full bg-corporate/5">
            {locale === "en" ? "In-lesson" : "En lección"}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm text-slate-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate"
          >
            <Icon name={action.icon} className="text-corporate" />
            <span className="text-left">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

ValerioQuickActions.propTypes = {
  quickActions: PropTypes.array,
  onAction: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ValerioQuickActions;
