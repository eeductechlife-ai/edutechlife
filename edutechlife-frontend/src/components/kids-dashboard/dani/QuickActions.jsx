import { memo } from "react";
import { motion } from "framer-motion";

// ==========================================
// Quick Action Buttons
// ==========================================
const QuickActions = memo(({ onAction, darkMode }) => {
  const actions = [
    { icon: "📚", label: "Ayuda con tarea", value: "ayuda_tarea" },
    { icon: "💭", label: "Dime algo motivador", value: "motivame" },
    { icon: "🎯", label: "Mi estilo VAK", value: "vak_estrategias" },
    { icon: "📅", label: "Qué debo hacer hoy", value: "que_hacer_hoy" },
    { icon: "🧠", label: "Explícame un tema", value: "explicar_tema" },
    { icon: "🤗", label: "Apoyo emocional", value: "apoyo_emocional" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-4 pb-3"
    >
      {actions.map((action) => (
        <motion.button
          key={action.value}
          data-value={action.value}
          onClick={(e) => onAction(e.currentTarget.dataset.value)}
          className={`px-3 py-2 border rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
            darkMode
              ? "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:bg-[#334155]"
              : "bg-white border-[#E2E8F0] text-[#004B63] hover:bg-[#4DA8C4]/10 hover:border-[#4DA8C4]/30"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
});

QuickActions.displayName = "QuickActions";

export default QuickActions;
