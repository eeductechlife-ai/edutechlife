import { memo } from "react";
import { motion } from "framer-motion";
import {
  daysLeft,
  badgeCls,
  badgeEmj,
  sbj,
  PRACTICE_GRADIENT,
  PRACTICE_GLOW,
} from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const ExamCard = memo(({ e: exam, i, onView, onDelete, dm = false }) => {
  const { t } = useTranslation();
  const d = daysLeft(exam.date);
  const isUrgent = d < 7;

  const cardBg = dm ? "#1A2744" : "#ffffff";
  const cardBorder = dm ? "#243152" : "#F1F5F9";
  const textPrimary = dm ? "#E2F0FF" : "#1E293B";
  const textSecondary = dm ? "#94A3B8" : "#64748B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl p-5 transition-all"
      style={{
        background: cardBg,
        border: `1px solid ${isUrgent ? "rgba(239,71,111,0.25)" : cardBorder}`,
        boxShadow: isUrgent
          ? `0 4px 16px rgba(239,71,111,0.12)`
          : `0 1px 4px rgba(0,0,0,0.05)`,
      }}
      whileHover={{
        y: -2,
        boxShadow: isUrgent
          ? `0 8px 24px rgba(239,71,111,0.18)`
          : `0 4px 14px rgba(0,0,0,0.08)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: isUrgent
                ? "rgba(239,71,111,0.10)"
                : dm
                  ? "rgba(255,255,255,0.06)"
                  : "#F8FAFC",
            }}
          >
            {sbj(exam.subject)?.i || "📚"}
          </div>
          <div>
            <h4
              className="font-bold text-sm leading-tight"
              style={{ color: textPrimary }}
            >
              {exam.name}
            </h4>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              {sbj(exam.subject)
                ? t(`kid.exam.subject_${exam.subject}`)
                : exam.subject}
            </p>
          </div>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exam.id);
          }}
          whileHover={{ scale: 1.15 }}
          className="text-lg leading-none opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: dm ? "#94A3B8" : "#64748B" }}
          aria-label="Eliminar examen"
        >
          ×
        </motion.button>
      </div>

      {/* Badge urgency */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeCls(d)}`}
      >
        <span>{badgeEmj(d)}</span>
        <span>
          {d === 0
            ? t("kid.exam.today")
            : d === 1
              ? t("kid.exam.one_day")
              : t("kid.exam.days_left", { count: d })}
        </span>
      </div>

      {/* Urgency progress bar — animates when < 14 days */}
      {d < 14 && (
        <div
          className="mt-3 h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(239,71,111,0.12)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: PRACTICE_GRADIENT }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* View button */}
      <motion.button
        onClick={() => onView(exam)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-3 w-full text-xs font-bold py-2 rounded-xl transition-all"
        style={{
          color: "#EF476F",
          background: "rgba(239,71,111,0.08)",
          border: "1px solid rgba(239,71,111,0.15)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(239,71,111,0.14)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(239,71,111,0.08)")
        }
      >
        {t("kid.exam.view_detail")} →
      </motion.button>
    </motion.div>
  );
});

ExamCard.displayName = "ExamCard";
export default ExamCard;
