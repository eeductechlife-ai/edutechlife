import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import "../styles/dani-colors.css";
import "../styles/quick-actions-improved.css";

const QUICK_ACTIONS = [
  {
    id: "homework",
    icon: "📚",
    title: "Ayuda con Tarea",
    subtitle: "Explícame este concepto",
    color: "blue",
  },
  {
    id: "motivation",
    icon: "💬",
    title: "Motivación Diaria",
    subtitle: "Dame un impulso positivo",
    color: "green",
  },
  {
    id: "vak",
    icon: "🧠",
    title: "Mi Estilo VAK",
    subtitle: "Descubre cómo aprendes mejor",
    color: "purple",
  },
  {
    id: "today",
    icon: "📝",
    title: "Qué Debo Hacer",
    subtitle: "Mi agenda de hoy",
    color: "orange",
  },
  {
    id: "explain",
    icon: "💡",
    title: "Explícame un Tema",
    subtitle: "Necesito que me enseñes",
    color: "yellow",
  },
  {
    id: "emotional",
    icon: "❤️",
    title: "Apoyo Emocional",
    subtitle: "Necesito hablar",
    color: "red",
  },
];

const QuickActionsImproved = memo(
  ({ onAction, studentAge = 10, darkMode = false, hasHistory = false }) => {
    const handleAction = useCallback(
      (actionId, title) => {
        onAction(actionId);
      },
      [onAction],
    );

    // Determine number of actions based on age
    const getVisibleActions = () => {
      if (studentAge <= 9) return 4;
      if (studentAge <= 13) return 6;
      return 6;
    };

    const visibleActions = QUICK_ACTIONS.slice(0, getVisibleActions());

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
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
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
        className={`quick-actions-improved ${darkMode ? "dark-mode" : "light-mode"}${hasHistory ? " compact" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="quick-actions-header">
          <span className="quick-actions-label">Acciones Rápidas</span>
          <motion.div
            className="quick-actions-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </div>

        <div className="quick-actions-grid">
          {visibleActions.map((action) => (
            <motion.button
              key={action.id}
              variants={itemVariants}
              onClick={() => handleAction(action.id, action.title)}
              className="quick-action-card"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: getActionGradient(action.color),
              }}
            >
              <div className="quick-action-icon">{action.icon}</div>
              <div className="quick-action-content">
                <h3 className="quick-action-title">{action.title}</h3>
                <p className="quick-action-subtitle">{action.subtitle}</p>
              </div>
              <div className="quick-action-arrow">→</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  },
);

QuickActionsImproved.displayName = "QuickActionsImproved";

export default QuickActionsImproved;
