import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const DeckCard = memo(
  ({ deck, onStudy, onStudyDue, onEdit, onDelete, index, dueCount }) => {
    const { t } = useTranslation();
    const themeColor = deck.metadata?.theme?.color || "#4DA8C4";
    const themeIcon = deck.metadata?.theme?.icon || "📚";
    const gradeLabel = deck.metadata?.grade
      ? {
          "1-3": t("kid.flashcards.grade_1_3"),
          "4-6": t("kid.flashcards.grade_4_6"),
          "7-9": t("kid.flashcards.grade_7_9"),
          "10-12": t("kid.flashcards.grade_10_12"),
        }[deck.metadata.grade]
      : "";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-5 rounded-2xl bg-white border-2 shadow-sm hover:shadow-md transition-all"
        style={{ borderColor: themeColor }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl">{themeIcon}</span>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[#004B63] truncate">
                {deck.title}
              </h4>
              {deck.description && (
                <p className="text-xs text-[#64748B] mt-1 truncate">
                  {deck.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {dueCount > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600 whitespace-nowrap">
                🔔 {dueCount}
              </span>
            )}
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
              style={{ backgroundColor: themeColor + "20", color: themeColor }}
            >
              {t("kid.flashcards.cards_count", { count: deck.cards.length })}
            </span>
          </div>
        </div>

        {gradeLabel && (
          <div className="mb-3">
            <span
              className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: themeColor }}
            >
              👤 {gradeLabel}
            </span>
          </div>
        )}

        {deck.stats?.totalStudied > 0 && (
          <div className="flex gap-3 mb-3 text-xs text-[#64748B]">
            <span>
              {t("kid.flashcards.studied_count", {
                count: deck.stats.totalStudied,
              })}
            </span>
            <span>
              {t("kid.flashcards.correct_count", { count: deck.stats.correct })}
            </span>
            <span>
              {t("kid.flashcards.streak_count", {
                count: deck.stats.streak || 0,
              })}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {dueCount > 0 && dueCount < deck.cards.length && (
            <motion.button
              onClick={() => onStudyDue(deck.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 bg-amber-50 border border-amber-300 text-amber-700 rounded-xl font-bold text-xs shadow-sm"
            >
              🔔 Hoy ({dueCount})
            </motion.button>
          )}
          <motion.button
            onClick={() => onStudy(deck.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 text-white rounded-xl font-bold text-sm shadow-md"
            style={{
              backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}80)`,
            }}
          >
            {dueCount > 0 && dueCount < deck.cards.length
              ? `Todas (${deck.cards.length})`
              : t("kid.flashcards.study")}
          </motion.button>
          <motion.button
            onClick={() => onEdit(deck.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm"
          >
            ✏️
          </motion.button>
          <motion.button
            onClick={() => onDelete(deck.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white border border-red-200 text-red-400 rounded-xl text-sm"
          >
            🗑️
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

DeckCard.displayName = "DeckCard";
export default DeckCard;
