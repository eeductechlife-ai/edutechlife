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
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5"
    >
      {subjects.map((s) => {
        const selected = s.id === selectedId;
        return (
          <motion.button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(s.id)}
            whileTap={{ scale: 0.97 }}
            className={`relative text-left rounded-2xl border-2 p-3 min-h-[76px] flex flex-col gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D4EDD] ${
              selected ? "text-white border-transparent shadow-lg" : idle
            }`}
            style={
              selected
                ? { background: s.color }
                : { borderColor: s.weak ? `${s.color}66` : undefined }
            }
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-xl leading-none shrink-0"
                aria-hidden="true"
              >
                {s.emoji}
              </span>
              <span className="text-sm font-bold leading-tight truncate">
                {s.label}
              </span>
              {selected && (
                <Check
                  className="w-4 h-4 ml-auto shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              {s.weak && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                    selected ? "bg-white/25 text-white" : "text-white"
                  }`}
                  style={selected ? {} : { background: s.color }}
                >
                  Reforzar
                </span>
              )}
              <span
                className={`text-[11px] truncate ${selected ? "text-white/85" : sub}`}
              >
                {statusText(s)}
              </span>
            </div>

            {s.hasData && (
              <div
                className={`h-1 rounded-full overflow-hidden ${selected ? "bg-white/30" : track}`}
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
