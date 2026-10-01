import { motion } from "framer-motion";
import { Smile, Meh, Frown, Check } from "lucide-react";

const MOOD_BUTTONS = [
  { value: "happy", icon: Smile, labelKey: "vak.ui.mood_good" },
  { value: "neutral", icon: Meh, labelKey: "vak.ui.mood_neutral" },
  { value: "sad", icon: Frown, labelKey: "vak.ui.mood_bad" },
];

export default function MoodSelector({ studentMood, onSelect, t }) {
  return (
    <div className="grid grid-cols-3 gap-3" role="group">
      {MOOD_BUTTONS.map((mood) => {
        const IconComponent = mood.icon;
        const selected = studentMood === mood.value;
        return (
          <motion.button
            key={mood.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.value)}
            aria-pressed={selected}
            className={`relative rounded-2xl p-3 min-h-[88px] flex flex-col items-center justify-center transition-colors border-2 ${
              selected
                ? "bg-[#004B63] border-[#004B63] text-white shadow-lg"
                : "bg-white border-[#B2D8E5] text-[#004B63] hover:border-[#4DA8C4]"
            }`}
          >
            {selected && (
              <Check
                size={16}
                strokeWidth={3}
                className="absolute top-2 right-2"
                aria-hidden="true"
              />
            )}
            <IconComponent size={28} strokeWidth={2} aria-hidden="true" />
            <span className="mt-1 text-sm font-semibold leading-tight">
              {t(mood.labelKey)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
