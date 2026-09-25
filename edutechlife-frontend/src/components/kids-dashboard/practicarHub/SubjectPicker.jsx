import { memo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

function statusText(s) {
  if (s.score != null) return `Nota ${s.score.toFixed(1)}`;
  if (s.lastReto) return `Último reto: ${s.lastReto.score}%`;
  if (s.hasData) return `${s.progress}% de avance`;
  return "¡Pruébala!";
}

const SubjectPicker = memo(({ subjects, selectedId, onSelect, darkMode }) => {
  const idle = darkMode
    ? "bg-[#1E293B] border-[#334155] text-white"
    : "bg-white border-[#E2E8F0] text-[#1E293B]";
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const track = darkMode ? "bg-[#334155]" : "bg-[#EEF2F6]";

  return (
    <div
      role="radiogroup"
      aria-label="Materias"
      className="grid grid-cols-3 lg:grid-cols-6 gap-2"
    >
      {subjects.map((s) => {
        const selected = s.id === selectedId;
        return (
          <motion.button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${s.label}${s.weak ? ", para reforzar" : ""}. ${statusText(s)}`}
            onClick={() => onSelect(s.id)}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-2xl border-2 px-1.5 pt-2 pb-2 min-h-[84px] !flex flex-col !items-center !justify-start gap-0.5 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D4EDD] ${
              selected ? "text-white border-transparent shadow-lg" : idle
            }`}
            style={
              selected
                ? { background: s.color }
                : { borderColor: s.weak ? `${s.color}88` : undefined }
            }
          >
            {selected && (
              <Check
                className="absolute top-1.5 right-1.5 w-3.5 h-3.5"
                aria-hidden="true"
              />
            )}
            {s.weak && !selected && (
              <span
                className="absolute top-1 right-1 w-5 h-5 rounded-full text-[11px] flex items-center justify-center text-white"
                style={{ background: s.color }}
                aria-hidden="true"
              >
                💪
              </span>
            )}
            <span className="text-2xl leading-none" aria-hidden="true">
              {s.emoji}
            </span>
            <span className="w-full text-xs font-bold leading-tight truncate">
              {s.label}
            </span>
            <span
              className={`w-full text-[10px] leading-tight truncate ${selected ? "text-white/85" : sub} ${s.weak ? "font-bold" : ""}`}
              aria-hidden="true"
            >
              {statusText(s)}
            </span>

            {s.hasData && (
              <div
                className={`w-full max-w-[64px] mt-0.5 h-1 rounded-full overflow-hidden ${selected ? "bg-white/30" : track}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(4, Math.min(100, s.progress))}%`,
                    background: selected ? "#fff" : s.color,
                  }}
                />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
});

SubjectPicker.displayName = "SubjectPicker";
export default SubjectPicker;
