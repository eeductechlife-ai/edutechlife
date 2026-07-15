import { motion } from "framer-motion";
import { Smile, Meh, Frown } from "lucide-react";

const MOOD_BUTTONS = [
  { value: "happy", icon: Smile, labelKey: "vak.ui.mood_good" },
  { value: "neutral", icon: Meh, labelKey: "vak.ui.mood_neutral" },
  { value: "sad", icon: Frown, labelKey: "vak.ui.mood_bad" },
];

export default function MoodSelector({ studentMood, onSelect, t }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MOOD_BUTTONS.map((mood) => {
        const IconComponent = mood.icon;
        return (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.value)}
            className={`relative rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
              studentMood === mood.value
                ? "bg-[#4DA8C4]/10 ring-2 ring-[#4DA8C4] shadow-lg"
                : "bg-white/80 border-2 border-[#B2D8E5]/30 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                studentMood === mood.value
                  ? "bg-[#4DA8C4]/20"
                  : "bg-[#4DA8C4]/5"
              }`}
            >
              <IconComponent
                size={24}
                strokeWidth={2}
                className="text-[#4DA8C4]"
              />
            </div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                studentMood === mood.value
                  ? "text-[#004B63]"
                  : "text-[#004B63]/60"
              }`}
            >
              {t(mood.labelKey)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
