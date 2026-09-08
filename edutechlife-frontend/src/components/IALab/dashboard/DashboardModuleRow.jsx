import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

export default function DashboardModuleRow({
  id,
  title,
  icon,
  approved,
  unlocked,
  score,
  examScore,
  challengeScore,
  resourcesDone,
  examDone,
  challengeDone,
  prevModuleId,
  onNavigate,
}) {
  const { t } = useTranslation();
  const isActive = unlocked && !approved;
  const isLocked = !unlocked;

  const examPassed = examDone && (examScore == null || examScore >= 80);
  const examFailed = examDone && examScore != null && examScore < 80;

  const steps = isActive
    ? [
        { done: resourcesDone, failed: false, label: "Contenido" },
        {
          done: examDone,
          failed: examFailed,
          label: examScore ? `Mi reto · ${examScore}%` : "Mi reto",
        },
        { done: challengeDone, failed: false, label: "Desafío" },
      ]
    : null;
  const nextStepIdx = steps ? steps.findIndex((s) => !s.done || s.failed) : -1;

  return (
    <motion.div
      whileHover={unlocked ? { x: 3 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 16 }}
      className={`flex items-start gap-3.5 bg-white dark:bg-slate-800/80 rounded-xl p-3.5 shadow-sm border transition-all duration-200 ${
        isActive
          ? "border-[var(--theme-primary)]/60 shadow-[0_0_0_2px_rgba(0,188,212,0.08),0_4px_16px_rgba(0,188,212,0.1)]"
          : "border-slate-100 dark:border-slate-700"
      } ${isLocked ? "opacity-60" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
          approved
            ? "bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-[var(--theme-primary)]/20"
            : isActive
              ? "bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-[var(--theme-primary)]/20"
              : "bg-slate-100 dark:bg-slate-700/80"
        }`}
      >
        {approved ? (
          <Icon name="fa-check-circle" className="w-5 h-5 text-white" />
        ) : isLocked ? (
          <Icon
            name="fa-lock"
            className="w-4 h-4 text-slate-400 dark:text-slate-500"
          />
        ) : (
          <Icon
            name={isActive ? "fa-play" : icon}
            className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-300"}`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold truncate ${isLocked ? "text-slate-400 dark:text-slate-500" : "text-[var(--theme-emphasis)] dark:text-slate-100"}`}
        >
          {t("dashboard.module_row_title", { id, title })}
        </p>

        {isActive && steps && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {steps.map((s, i) => {
              const isNext = i === nextStepIdx;
              if (s.done && !s.failed) {
                return (
                  <span
                    key={s.label}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--theme-primary)]"
                  >
                    <Icon name="fa-check-circle" className="w-3 h-3" />
                    {s.label}
                  </span>
                );
              }
              if (s.failed) {
                return (
                  <span
                    key={s.label}
                    className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-400/10 border border-orange-200 dark:border-orange-400/30 px-2 py-0.5 rounded-full"
                  >
                    <Icon
                      name="fa-exclamation-triangle"
                      className="w-2.5 h-2.5"
                    />
                    {s.label} · Reintentar
                  </span>
                );
              }
              if (isNext) {
                return (
                  <span
                    key={s.label}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 px-2 py-0.5 rounded-full"
                  >
                    <Icon name="fa-arrow-right" className="w-2.5 h-2.5" />
                    {s.label}
                  </span>
                );
              }
              return (
                <span
                  key={s.label}
                  className="flex items-center gap-1 text-[11px] text-slate-300 dark:text-slate-600"
                >
                  <Icon name="fa-bullet" className="w-2 h-2" />
                  {s.label}
                </span>
              );
            })}
          </div>
        )}

        {approved && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t("dashboard.module_score_detail", {
                score,
                examScore,
                challengeScore,
              })}
            </span>
          </div>
        )}

        {isLocked && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Disponible al terminar M{prevModuleId ?? id - 1}
          </p>
        )}
      </div>

      {unlocked ? (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 12 }}
          onClick={onNavigate}
          className={`flex-shrink-0 self-center text-white text-xs font-bold px-5 py-3 min-h-[44px] rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all ${
            !approved && resourcesDone && !examDone
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-[var(--theme-primary)]"
          }`}
        >
          {approved
            ? t("dashboard.review_btn")
            : !approved && resourcesDone && !examDone
              ? t("dashboard.exam_btn") || "Ir al examen"
              : t("dashboard.continue_btn")}{" "}
          <Icon name="fa-arrow-right" className="w-3 h-3" />
        </motion.button>
      ) : null}
    </motion.div>
  );
}
