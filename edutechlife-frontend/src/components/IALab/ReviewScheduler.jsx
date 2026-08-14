/**
 * ReviewScheduler — Muestra items programados para repaso hoy y próximos
 *
 * ADITIVO: Solo lee de adaptiveSlice. No modifica nada existente.
 * Ideal para dashboards o widgets laterales.
 *
 * Uso:
 *   <ReviewScheduler compact onReviewClick={(item) => ...} />
 *
 * @see adaptiveSlice.js
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useIALabStore } from "../../store/ialabStore";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

const BOX_LABELS = {
  1: {
    name: "ialab.review_scheduler.box_new",
    color: "bg-rose-500",
    short: "N",
  },
  2: {
    name: "ialab.review_scheduler.box_recent",
    color: "bg-amber-500",
    short: "R",
  },
  3: {
    name: "ialab.review_scheduler.box_learned",
    color: "bg-yellow-500",
    short: "A",
  },
  4: {
    name: "ialab.review_scheduler.box_retained",
    color: "bg-emerald-500",
    short: "D",
  },
  5: {
    name: "ialab.review_scheduler.box_mastered",
    color: "bg-teal-500",
    short: "M",
  },
};

const formatDaysUntil = (ts, t) => {
  const diff = ts - Date.now();
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days <= 0) return t("ialab.review_scheduler.today");
  if (days === 1) return t("ialab.review_scheduler.tomorrow");
  if (days < 7) return t("ialab.review_scheduler.days_until", { days });
  const weeks = Math.floor(days / 7);
  return weeks === 1
    ? t("ialab.review_scheduler.weeks_singular", { weeks })
    : t("ialab.review_scheduler.weeks_plural", { weeks });
};

const ReviewScheduler = ({
  compact = false,
  maxUpcoming = 3,
  onReviewClick,
}) => {
  const { t } = useTranslation();
  const getDueReviews = useIALabStore((s) => s.getDueReviews);
  const getUpcomingReviews = useIALabStore((s) => s.getUpcomingReviews);
  const reviewScheduleLen = useIALabStore((s) => s.reviewSchedule?.length || 0);

  const due = getDueReviews ? getDueReviews() : [];
  const upcoming = getUpcomingReviews
    ? getUpcomingReviews(14).slice(0, maxUpcoming)
    : [];

  if (reviewScheduleLen === 0) {
    return (
      <div className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 text-center">
        <Icon
          name="fa-calendar-check"
          className="text-2xl text-gray-400 mb-2"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("ialab.review_scheduler.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="fa-calendar-days" className="text-corporate text-sm" />
          <h4 className="text-sm font-bold text-petroleum dark:text-white">
            {t("ialab.review_scheduler.title")}
          </h4>
        </div>
        {due.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {t("ialab.review_scheduler.due_today", { count: due.length })}
          </span>
        )}
      </div>

      {/* Vencidas HOY */}
      {due.length > 0 && (
        <div className="space-y-2">
          {due.slice(0, compact ? 3 : 5).map((item, i) => {
            const box = BOX_LABELS[item.box] || BOX_LABELS[1];
            return (
              <motion.button
                key={item.itemId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onReviewClick && onReviewClick(item)}
                type="button"
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 hover:shadow-sm transition-all text-left"
              >
                <div
                  className={`w-7 h-7 rounded-full ${box.color} flex items-center justify-center text-white font-bold text-[10px] shrink-0`}
                  title={t(box.name)}
                >
                  {box.short}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-petroleum dark:text-white truncate">
                    {item.itemId}
                  </div>
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                    {t("ialab.review_scheduler.overdue_review")}
                  </div>
                </div>
                <Icon name="fa-play" className="text-rose-500 text-[10px]" />
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Próximos */}
      {upcoming.length > 0 && !compact && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            {t("ialab.review_scheduler.upcoming")}
          </p>
          <div className="space-y-1.5">
            {upcoming.map((item, i) => {
              const box = BOX_LABELS[item.box] || BOX_LABELS[1];
              return (
                <motion.div
                  key={item.itemId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${box.color} shrink-0`}
                    title={t(box.name)}
                  />
                  <span className="flex-1 text-[11px] text-gray-700 dark:text-gray-300 truncate">
                    {item.itemId}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                    {formatDaysUntil(item.dueAt, t)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ReviewScheduler.propTypes = {
  compact: PropTypes.bool,
  maxUpcoming: PropTypes.number,
  onReviewClick: PropTypes.func,
};

export default ReviewScheduler;
