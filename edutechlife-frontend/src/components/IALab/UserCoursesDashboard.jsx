import { useState, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "../../utils/iconMapping";
import { useIALabStore } from "../../store/ialabStore";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "../../i18n/I18nProvider";
import { courses as ALL_COURSES } from "./data/landingPageData";
import CourseCard from "./CourseCard";

const CourseCardMemo = memo(CourseCard);

const FILTER_TABS = (t) => [
  { id: "all", label: t("ialab.dashboard.filter_all") },
  { id: "in-progress", label: t("ialab.dashboard.filter_in_progress") },
  { id: "completed", label: t("ialab.dashboard.filter_completed") },
];

const calculateCourseProgress = (
  course,
  courseProgressVal,
  completedModules,
) => {
  if (course.id === "ia-generativa" && course.status === "active") {
    return Math.min(Math.round(courseProgressVal), 100);
  }
  if (course.status === "coming-soon" && completedModules.length > 0) {
    return Math.min(Math.round((completedModules.length / 5) * 100), 100);
  }
  return course.progress || 0;
};

const UserCoursesDashboard = () => {
  const { t } = useTranslation();
  const tabs = FILTER_TABS(t);
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    xp: storeXp,
    level: storeLevel,
    streak: storeStreak,
    courseProgress: courseProgressVal,
    completedModules,
  } = useIALabStore(
    useShallow((s) => ({
      xp: s.xp,
      level: s.getLevel(),
      streak: s.streak,
      courseProgress: s.courseProgress,
      completedModules: s.completedModules,
    })),
  );

  const setShowCertificateModal = useIALabStore(
    (s) => s.setShowCertificateModal,
  );
  const shouldReduceMotion = useReducedMotion();

  const courses = ALL_COURSES.map((c) => ({
    ...c,
    progress: calculateCourseProgress(c, courseProgressVal, completedModules),
  }));

  const filtered = courses.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in-progress")
      return c.status === "active" && c.progress > 0 && c.progress < 100;
    if (activeFilter === "completed") return c.progress >= 100;
    return true;
  });

  const activeCourse = courses.find((c) => c.id === "ia-generativa");
  const hasCert = activeCourse?.progress >= 80;

  const statVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: i * 0.08,
      },
    }),
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div
        className="grid grid-cols-3 max-sm:grid-cols-2 gap-3"
        role="region"
        aria-label={
          t("ialab.dashboard.stats_label") || "Estadísticas de progreso"
        }
      >
        {[
          { label: t("streak.xp"), value: storeXp.toLocaleString() },
          { label: t("streak.level"), value: storeLevel },
          { label: t("streak.days"), value: storeStreak },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-[var(--theme-emphasis)]/[0.06] to-[var(--theme-primary)]/[0.04] rounded-xl p-3 border border-[var(--theme-emphasis)]/20"
          >
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-[var(--theme-emphasis)] mt-0.5">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1.5 bg-slate-100 rounded-xl p-1 w-fit"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeFilter === tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === tab.id
                ? "bg-white text-[var(--theme-emphasis)] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          exit={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : -8,
            transition: { duration: 0.15 },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
        >
          {filtered.length === 0 ? (
            <motion.div
              variants={cardVariants}
              className="col-span-full text-center py-12 text-slate-400"
              role="status"
              aria-label={
                t("ialab.dashboard.no_courses") ||
                "No hay cursos en esta categoría"
              }
            >
              <motion.div
                initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Icon
                  name="fa-book-open"
                  className="text-3xl mb-3 mx-auto text-slate-300"
                  aria-hidden="true"
                />
              </motion.div>
              <p className="text-sm font-medium">{t("leaderboard.empty")}</p>
            </motion.div>
          ) : (
            filtered.map((course) => (
              <motion.div key={course.id} variants={cardVariants}>
                <CourseCardMemo course={course} isSignedIn />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Certificates section */}
      {hasCert && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
            delay: 0.3,
          }}
          className="border-t border-slate-100 pt-6"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon name="fa-award" className="text-[var(--theme-primary)]" />
            {t("ialab.dashboard.certificates_title")}
          </h3>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Icon
                name="fa-check-circle"
                className="text-emerald-600 text-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {activeCourse.title}
              </p>
              <p className="text-xs text-slate-500">
                {t("ialab.dashboard.completed_at", {
                  pct: Math.round(activeCourse.progress),
                })}
              </p>
            </div>
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
            >
              {t("ialab.dashboard.view_certificate")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserCoursesDashboard;
