import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const DeckCard = memo(
  ({
    deck,
    onStudy,
    onStudyDue,
    onEdit,
    onDelete,
    index,
    dueCount,
    darkMode = false,
  }) => {
    const { t } = useTranslation();
    const themeColor = deck.metadata?.theme?.color || "#FF6B9D";
    const themeIcon = deck.metadata?.theme?.icon || "🎴";
    const gradeLabel = deck.metadata?.grade
      ? {
          "1-3": t("kid.flashcards.grade_1_3"),
          "4-6": t("kid.flashcards.grade_4_6"),
          "7-9": t("kid.flashcards.grade_7_9"),
          "10-12": t("kid.flashcards.grade_10_12"),
        }[deck.metadata.grade]
      : "";

    const cardBg = darkMode ? "#1E293B" : "#ffffff";
    const textPrimary = darkMode ? "#F1F5F9" : "#004B63";
    const textSecondary = darkMode ? "#94A3B8" : "#64748B";
    const borderDefault = darkMode ? "rgba(42,58,84,0.6)" : "#E2E8F0";
    const editBg = darkMode ? "#151F32" : "#F8FAFC";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-4 rounded-2xl border-2 shadow-sm hover:shadow-md transition-all"
        style={{ background: cardBg, borderColor: themeColor + "60" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: themeColor + "18" }}
            >
              {themeIcon}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold truncate" style={{ color: textPrimary }}>
                {deck.title}
              </h4>
              {deck.description && (
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: textSecondary }}
                >
                  {deck.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {dueCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600 whitespace-nowrap">
                🔔 {dueCount}
              </span>
            )}
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
              style={{ backgroundColor: themeColor + "20", color: themeColor }}
            >
              {t("kid.flashcards.cards_count", { count: deck.cards.length })}
            </span>
          </div>
        </div>

        {gradeLabel && (
          <div className="mb-3">
            <span
              className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: themeColor }}
            >
              👤 {gradeLabel}
            </span>
          </div>
        )}

        {deck.stats?.totalStudied > 0 && (
          <div
            className="flex gap-3 mb-3 text-xs"
            style={{ color: textSecondary }}
          >
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
              className="flex-1 py-2 rounded-xl font-bold text-xs shadow-sm"
              style={{
                background: darkMode ? "rgba(251,191,36,0.12)" : "#FEF3C7",
                border: "1px solid rgba(251,191,36,0.35)",
                color: "#D97706",
              }}
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
              backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
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
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              background: editBg,
              border: `1px solid ${borderDefault}`,
              color: textSecondary,
            }}
          >
            ✏️
          </motion.button>
          <motion.button
            onClick={() => onDelete(deck.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              background: darkMode ? "rgba(239,71,111,0.08)" : "#FEF2F2",
              border: "1px solid rgba(239,71,111,0.25)",
              color: "#EF476F",
            }}
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
