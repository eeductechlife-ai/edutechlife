import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";
import { useTranslation } from "../../i18n/I18nProvider";
import { useIALabProgressContext } from "../../context/IALabContext";

const DAY_NOTES_KEY = "ialab_day_notes";

const loadDayNotes = () => {
  try {
    return JSON.parse(localStorage.getItem(DAY_NOTES_KEY)) || {};
  } catch {
    return {};
  }
};
const saveDayNotes = (dayNotes) =>
  localStorage.setItem(DAY_NOTES_KEY, JSON.stringify(dayNotes));

const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const ACTIVITY_COLORS = {
  exam: "bg-purple-500",
  challenge: "bg-amber-500",
  video: "bg-sky-500",
  infographic: "bg-emerald-500",
  session: "bg-petroleum",
  community: "bg-rose-400",
  default: "bg-slate-400",
};

const ACTIVITY_LABELS = {
  exam: "E",
  challenge: "D",
  video: "V",
  infographic: "I",
  session: "S",
  community: "C",
};

const loadActivityLog = () => {
  try {
    return JSON.parse(localStorage.getItem("ialab_activity_log")) || [];
  } catch {
    return [];
  }
};

const loadSessionLog = () => {
  try {
    return JSON.parse(localStorage.getItem("ialab_session_log")) || [];
  } catch {
    return [];
  }
};

const buildActivityTypeMap = (year, month) => {
  const activities = loadActivityLog();
  const sessions = loadSessionLog();
  const typeMap = {};
  const allEntries = [
    ...activities.map((a) => ({
      date: new Date(a.completed_at),
      type: a.activity_type,
    })),
    ...sessions.map((s) => ({
      date: new Date(s.completed_at),
      type: "session",
    })),
  ];
  allEntries.forEach(({ date, type }) => {
    if (date.getFullYear() === year && date.getMonth() === month) {
      const key = date.toDateString();
      if (!typeMap[key]) typeMap[key] = new Set();
      typeMap[key].add(type || "default");
    }
  });
  return typeMap;
};

const buildCalendar = (year, month, months) => {
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = isCurrentMonth ? today.getDate() : -1;
  const isPastMonth =
    today.getFullYear() > year ||
    (today.getFullYear() === year && today.getMonth() > month);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return {
    year,
    month,
    days,
    todayDate,
    isPastMonth,
    label: `${months[month]} ${year}`,
  };
};

const StudyCalendarSection = () => {
  const { t } = useTranslation();
  const streak = useIALabStore((s) => s.streak);
  const getWeeklyXP = useIALabStore((s) => s.getWeeklyXP);
  const weeklyStats = getWeeklyXP();
  const { completedExams, challengeScores, modules } =
    useIALabProgressContext() || {};

  const DAYS = useMemo(
    () => [
      t("ialab.study_planner.day_dom"),
      t("ialab.study_planner.day_lun"),
      t("ialab.study_planner.day_mar"),
      t("ialab.study_planner.day_mie"),
      t("ialab.study_planner.day_jue"),
      t("ialab.study_planner.day_vie"),
      t("ialab.study_planner.day_sab"),
    ],
    [t],
  );

  const MONTHS = useMemo(
    () => [
      t("ialab.study_planner.month_enero"),
      t("ialab.study_planner.month_febrero"),
      t("ialab.study_planner.month_marzo"),
      t("ialab.study_planner.month_abril"),
      t("ialab.study_planner.month_mayo"),
      t("ialab.study_planner.month_junio"),
      t("ialab.study_planner.month_julio"),
      t("ialab.study_planner.month_agosto"),
      t("ialab.study_planner.month_septiembre"),
      t("ialab.study_planner.month_octubre"),
      t("ialab.study_planner.month_noviembre"),
      t("ialab.study_planner.month_diciembre"),
    ],
    [t],
  );

  const [dayNotes, setDayNotes] = useState(loadDayNotes);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayText, setDayText] = useState("");
  const dayTextareaRef = useRef(null);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const calendar = buildCalendar(calYear, calMonth, MONTHS);
  const activityTypeMap = useMemo(
    () => buildActivityTypeMap(calYear, calMonth),
    [calYear, calMonth],
  );

  const pendingDeadlines = useMemo(() => {
    const deadlines = [];
    const now = new Date();
    if (completedExams && modules) {
      modules.forEach((mod) => {
        if (!completedExams[mod.id]) {
          deadlines.push({
            id: `exam-m${mod.id}`,
            label: t("ialab.study_calendar.pending_exam", { modulo: mod.id }),
            moduleId: mod.id,
            type: "exam",
            icon: "fa-file-pen",
            color:
              "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300",
          });
        }
      });
    }
    if (challengeScores && modules) {
      modules.forEach((mod) => {
        const score = challengeScores[mod.id];
        if (score === undefined || score === null || score < 80) {
          deadlines.push({
            id: `challenge-m${mod.id}`,
            label: t("ialab.study_calendar.pending_challenge", {
              modulo: mod.id,
            }),
            moduleId: mod.id,
            type: "challenge",
            icon: "fa-trophy",
            color:
              "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300",
          });
        }
      });
    }
    return deadlines;
  }, [completedExams, challengeScores, modules, t]);

  const goToPrevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  };

  const handleDaySelect = (day) => {
    if (!day) return;
    const dateKey = formatDate(calendar.year, calendar.month, day);
    setSelectedDay(dateKey);
    const all = loadDayNotes();
    setDayNotes(all);
    setDayText(all[dateKey] || "");
    setTimeout(() => dayTextareaRef.current?.focus(), 100);
  };

  const handleDayNoteChange = (val) => {
    if (!selectedDay) return;
    setDayText(val);
    const updated = { ...dayNotes };
    if (val) updated[selectedDay] = val;
    else delete updated[selectedDay];
    setDayNotes(updated);
    saveDayNotes(updated);
  };

  const handleClearDayNote = () => {
    if (!selectedDay) return;
    const updated = { ...dayNotes };
    delete updated[selectedDay];
    setDayNotes(updated);
    setDayText("");
    saveDayNotes(updated);
  };

  const todayKey = formatDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  const todayActive = dayNotes[todayKey] || "";

  return (
    <div
      id="study-calendar-section"
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
      role="region"
      aria-label={t("ialab.study_planner.title")}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Icon name="fa-calendar" className="text-petroleum text-sm" />
          <h2 className="text-sm font-bold text-petroleum">
            {t("ialab.study_planner.title")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
            <Icon name="fa-fire" className="text-amber-500 text-xs" /> {streak}d
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            {weeklyStats.weekly} XP
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevMonth}
                aria-label="Mes anterior"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 transition-all"
              >
                ‹
              </button>
              <span className="text-xs font-bold text-petroleum dark:text-petroleum w-28 text-center">
                {calendar.label}
              </span>
              <button
                onClick={goToNextMonth}
                aria-label="Mes siguiente"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 transition-all"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 py-1"
              >
                {d}
              </div>
            ))}
            {calendar.days.map((d, i) => {
              const dateKey = d
                ? formatDate(calendar.year, calendar.month, d)
                : null;
              const hasNote = dateKey && dayNotes[dateKey];
              const isSelected = dateKey === selectedDay;
              const types = dateKey
                ? activityTypeMap[
                    new Date(calendar.year, calendar.month, d).toDateString()
                  ]
                : null;
              const isPastDay =
                calendar.isPastMonth || (d !== null && d < calendar.todayDate);
              return (
                <div
                  key={i}
                  onClick={() => handleDaySelect(d)}
                  className={`relative text-xs py-2 rounded-lg cursor-pointer transition-all duration-150 flex flex-col items-center gap-0.5 ${
                    d === null
                      ? "cursor-default"
                      : isSelected
                        ? "ring-2 ring-petroleum bg-petroleum/15 font-bold text-petroleum"
                        : d === calendar.todayDate
                          ? "bg-gradient-to-r from-petroleum to-corporate text-white font-bold shadow-sm"
                          : isPastDay
                            ? "bg-petroleum/5 dark:bg-petroleum/10 text-slate-500 dark:text-slate-400 hover:bg-petroleum/10"
                            : "text-slate-600 dark:text-slate-400 hover:bg-petroleum/5"
                  }`}
                >
                  <span>{d || ""}</span>
                  {types && types.size > 0 && (
                    <div className="flex gap-0.5">
                      {[...types].slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className={`w-1.5 h-1.5 rounded-full ${ACTIVITY_COLORS[type] || ACTIVITY_COLORS.default}`}
                        />
                      ))}
                    </div>
                  )}
                  {hasNote && (
                    <span className="absolute -bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-petroleum" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />{" "}
                {ACTIVITY_LABELS.exam}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />{" "}
                {ACTIVITY_LABELS.challenge}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" />{" "}
                {ACTIVITY_LABELS.video}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-petroleum" />{" "}
                {ACTIVITY_LABELS.session}
              </span>
            </div>
          </div>
        </div>

        {pendingDeadlines.length > 0 && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-3">
            <h3 className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
              <Icon name="fa-clock" className="text-[9px]" />
              {t("ialab.study_calendar.deadlines")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {pendingDeadlines.map((d) => (
                <span
                  key={d.id}
                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md ${d.color}`}
                >
                  <Icon name={d.icon} className="text-[9px]" />
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-gradient-to-br from-petroleum/5 to-corporate/5 border border-petroleum/10">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[10px] font-bold text-petroleum flex items-center gap-1">
              <Icon name="fa-chart-simple" className="text-[9px]" />
              {t("ialab.study_planner.weekly_summary")}
            </h4>
            <span className="text-[9px] text-slate-500">
              {t("ialab.study_planner.daily_avg", {
                avg: weeklyStats.dailyAvg,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-petroleum">
              {weeklyStats.weekly} XP
            </span>
            <span className="text-[9px] text-slate-500">
              {t("ialab.study_planner.of_target", {
                target: weeklyStats.weeklyTarget,
              })}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500"
              style={{ width: `${weeklyStats.weeklyPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[9px] text-slate-400 text-right">
            {t("ialab.study_planner.weekly_pct", {
              pct: weeklyStats.weeklyPct,
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[10px] font-bold text-petroleum flex items-center gap-1">
                  <Icon name="fa-pen" className="text-[9px]" />
                  {t("ialab.study_planner.day_note_label", {
                    date: selectedDay
                      .split("-")
                      .reverse()
                      .slice(0, 2)
                      .join("/"),
                  })}
                </h4>
                <button
                  onClick={handleClearDayNote}
                  className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label={t("ialab.study_planner.delete_note_aria")}
                >
                  <Icon
                    name="fa-trash"
                    className="text-[9px] text-slate-400 hover:text-red-500"
                  />
                </button>
              </div>
              <textarea
                ref={dayTextareaRef}
                value={dayText}
                onChange={(e) => handleDayNoteChange(e.target.value)}
                placeholder={t("ialab.study_planner.note_placeholder")}
                className="w-full h-16 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
                aria-label={t("ialab.study_planner.note_aria")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-3 rounded-xl bg-gradient-to-br from-petroleum/5 to-corporate/5 border border-petroleum/10">
          <h4 className="text-[10px] font-bold text-petroleum mb-1.5 flex items-center gap-1">
            <Icon name="fa-lightbulb" className="text-[9px]" />
            {t("ialab.study_planner.daily_tip")}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {streak >= 7
              ? t("ialab.study_planner.tip_streak_7", {
                  weekly: getWeeklyXP().weekly,
                  target: getWeeklyXP().weeklyTarget,
                })
              : streak >= 3
                ? t("ialab.study_planner.tip_streak_3", {
                    streak,
                    avg: getWeeklyXP().dailyAvg,
                  })
                : t("ialab.study_planner.tip_default", {
                    weekly: getWeeklyXP().weekly,
                    target: getWeeklyXP().weeklyTarget,
                  })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            <Icon
              name="fa-check"
              className="text-[9px] mr-1 text-emerald-500"
            />
            {t("ialab.study_planner.auto_save")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyCalendarSection;
