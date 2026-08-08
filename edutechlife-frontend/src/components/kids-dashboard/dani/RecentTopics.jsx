import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const TOPIC_KEYS = {
  Matemáticas: "dani.topic_math",
  Lenguaje: "dani.topic_language",
  Ciencias: "dani.topic_science",
  Historia: "dani.topic_history",
  Inglés: "dani.topic_english",
  Arte: "dani.topic_art",
  Tecnología: "dani.topic_technology",
};

// ==========================================
// Suggested Topics Chip
// ==========================================
const RecentTopics = memo(({ topics, onTopicClick, darkMode }) => {
  const { t } = useTranslation();
  if (!topics || topics.length === 0) return null;
  return (
    <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
      {topics.slice(-5).map((topic) => (
        <motion.button
          key={topic.topic}
          data-topic={topic.topic}
          onClick={(e) => onTopicClick(e.currentTarget.dataset.topic)}
          className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
            darkMode
              ? "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:bg-[#334155]"
              : "bg-[#B2D8E5]/30 border-[#B2D8E5] text-[#004B63] hover:bg-[#B2D8E5]/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {topic.icon || "📌"} {t(TOPIC_KEYS[topic.topic] || topic.topic)}
        </motion.button>
      ))}
    </div>
  );
});

RecentTopics.displayName = "RecentTopics";

export default RecentTopics;
