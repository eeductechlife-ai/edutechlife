import { useState, useRef, useEffect } from "react";
import { useIALabStore } from "../../../store/ialabStore";
import { getAllLessons } from "../../../data/ialab";
import { useTranslation } from "../../../i18n/I18nProvider";

const ValerioContextIndicator = ({ currentModule }) => {
  const { t, locale } = useTranslation();
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  const hasLessonContext =
    lastVisitedLesson?.moduleId === currentModule?.id &&
    lastVisitedLesson?.lessonId != null;
  const isGreen = !!hasLessonContext;

  const lessons = getAllLessons(locale)?.[currentModule?.id] || [];
  const currentLesson = hasLessonContext
    ? lessons.find((l) => l.id === lastVisitedLesson.lessonId)
    : null;

  const tooltipText = currentLesson
    ? `${locale === "en" ? "Helping with" : "Ayudando con"}: ${currentModule?.title} › ${currentLesson.title}`
    : `${locale === "en" ? "Ready to help with" : "Listo para ayudar con"} ${currentModule?.title || ""}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
        style={{ backgroundColor: isGreen ? "#10B981" : "#F59E0B" }}
        aria-label={tooltipText}
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-[11px] rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none">
          {tooltipText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

export default ValerioContextIndicator;
