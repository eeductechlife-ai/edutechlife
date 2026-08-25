import { memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import "../styles/dani-colors.css";
import "../styles/quick-actions-improved.css";

const QUICK_ACTIONS = [
  {
    id: "homework",
    icon: "📚",
    titleKey: "dani.qa_homework_title",
    subtitleKey: "dani.qa_homework_subtitle",
    color: "blue",
  },
  {
    id: "motivation",
    icon: "💬",
    titleKey: "dani.qa_motivation_title",
    subtitleKey: "dani.qa_motivation_subtitle",
    color: "green",
  },
  {
    id: "vak",
    icon: "🧠",
    titleKey: "dani.qa_vak_title",
    subtitleKey: "dani.qa_vak_subtitle",
    color: "purple",
  },
  {
    id: "today",
    icon: "📝",
    titleKey: "dani.qa_today_title",
    subtitleKey: "dani.qa_today_subtitle",
    color: "orange",
  },
  {
    id: "explain",
    icon: "💡",
    titleKey: "dani.qa_explain_title",
    subtitleKey: "dani.qa_explain_subtitle",
    color: "yellow",
  },
  {
    id: "emotional",
    icon: "❤️",
    titleKey: "dani.qa_emotional_title",
    subtitleKey: "dani.qa_emotional_subtitle",
    color: "red",
  },
];

const QuickActionsImproved = memo(
  ({ onAction, studentAge = 10, darkMode = false, hasHistory = false }) => {
    const { t } = useTranslation();

    // Age-adaptive configuration
    const ageGroup = useMemo(() => {
      if (studentAge <= 8) return "pequeño"; // 6-8: Large colorful cards
      if (studentAge <= 12) return "explorador"; // 9-12: Medium cards
      return "avanzado"; // 13-16: Compact, like Max/Valerio
    }, [studentAge]);

    const visibleCount = useMemo(() => {
      if (studentAge <= 8) return 4;
      if (studentAge <= 12) return 6;
      return 6;
    }, [studentAge]);

    const visibleActions = QUICK_ACTIONS.slice(0, visibleCount);

    const handleAction = useCallback(
      (actionId) => {
        onAction(actionId);
      },
      [onAction],
    );

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };

    const getActionGradient = (color) => {
      const gradients = {
        blue: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
        green: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
        purple: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
        orange: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
        yellow: "linear-gradient(135deg, #FBBF24 0%, #FCD34D 100%)",
        red: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
      };
      return gradients[color] || gradients.blue;
    };

    return (
      <motion.div
        className={`quick-actions-improved ${darkMode ? "dark-mode" : "light-mode"} ${ageGroup}${hasHistory ? " compact" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="region"
        aria-label={t("dani.qa_label")}
      >
        <div className="quick-actions-header">
          <span className="quick-actions-label">{t("dani.qa_label")}</span>
          <motion.div
            className="quick-actions-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden="true"
          >
            ✨
          </motion.div>
        </div>

        <motion.div className="quick-actions-grid" layout>
          <AnimatePresence>
            {visibleActions.map((action) => (
              <motion.button
                key={action.id}
                variants={itemVariants}
                onClick={() => handleAction(action.id)}
                className="quick-action-card"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ background: getActionGradient(action.color) }}
                aria-label={`${t(action.titleKey)}: ${t(action.subtitleKey)}`}
              >
                <div className="quick-action-icon" aria-hidden="true">
                  {action.icon}
                </div>
                <div className="quick-action-content">
                  <h3 className="quick-action-title">{t(action.titleKey)}</h3>
                  {ageGroup !== "avanzado" && (
                    <p className="quick-action-subtitle">
                      {t(action.subtitleKey)}
                    </p>
                  )}
                </div>
                <div className="quick-action-arrow" aria-hidden="true">
                  →
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  },
);

QuickActionsImproved.displayName = "QuickActionsImproved";

export default QuickActionsImproved;
