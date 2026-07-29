import PropTypes from "prop-types";
import { useIALabStore } from "../../../store/ialabStore";
import { getAllLessons } from "../../../data/ialab";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";

const ValerioContextBar = ({ currentModule }) => {
  const { t, locale } = useTranslation();
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const lessonProgress = useIALabStore((s) => s.lessonProgress);

  if (!currentModule) return null;

  const moduleId = currentModule.id;
  const lessons = getAllLessons(locale)?.[moduleId] || [];
  const currentLessonId =
    lastVisitedLesson?.moduleId === moduleId
      ? lastVisitedLesson.lessonId
      : null;
  const currentLesson = currentLessonId
    ? lessons.find((l) => l.id === currentLessonId)
    : null;
  const modProgress = lessonProgress?.[moduleId] || {};
  const completedCount = Object.values(modProgress).filter(
    (s) => s === "completed",
  ).length;
  const totalLessons = lessons.length;

  return (
    <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
      <a
        href={currentLesson ? "#current-lesson" : "#"}
        onClick={(e) => {
          if (!currentLesson) e.preventDefault();
        }}
        className="flex items-center justify-between text-xs text-slate-500 hover:text-corporate transition-colors group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-corporate/10 flex items-center justify-center flex-shrink-0 group-hover:bg-corporate/20 transition-colors">
            <Icon name="fa-book-open" className="w-3 h-3 text-corporate" />
          </div>
          <span className="truncate font-medium">
            {currentLesson ? (
              <span className="flex items-center gap-1.5">
                <span className="text-slate-600">{currentModule.title}</span>
                <span className="text-slate-300 text-[10px]">›</span>
                <span className="text-corporate">{currentLesson.title}</span>
              </span>
            ) : (
              currentModule.title
            )}
          </span>
        </div>
        {totalLessons > 0 && (
          <span className="text-slate-400 flex-shrink-0 ml-3">
            {locale === "en" ? "Lesson" : "Lección"}{" "}
            {currentLessonId || completedCount + 1} / {totalLessons}
          </span>
        )}
      </a>
    </div>
  );
};

ValerioContextBar.propTypes = {
  currentModule: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
  }),
};

export default ValerioContextBar;
