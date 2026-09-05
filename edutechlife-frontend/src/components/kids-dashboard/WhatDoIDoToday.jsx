import { memo, useState } from "react";
import { motion } from "framer-motion";

/**
 * Compact "¿Qué Hago Hoy?" adaptive next-action card for HeroSection.
 */
const WhatDoIDoToday = memo(
  ({ nextAction, loading, onTabChange, onMinutesChange }) => {
    const [selected, setSelected] = useState(20);

    if (!nextAction && !loading) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 rounded-2xl border border-white/20"
        style={{ background: "rgba(255,255,255,0.10)" }}
        role="region"
        aria-label="Recomendación de hoy"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
            ¿Qué hago hoy?
          </p>
          {loading && !nextAction ? (
            <p className="text-white/50 text-sm">Calculando tu plan...</p>
          ) : (
            <>
              <p className="text-white font-bold text-sm leading-tight truncate">
                {nextAction?.label}
              </p>
              <p className="text-white/60 text-[11px] mt-0.5 line-clamp-2">
                {nextAction?.reason}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Time selector */}
          <div className="flex gap-1">
            {[5, 10, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelected(m);
                  onMinutesChange?.(m);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selected === m
                    ? "bg-white text-[#00303F]"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
                aria-pressed={selected === m}
              >
                {m}m
              </button>
            ))}
          </div>

          {nextAction?.tab && (
            <button
              onClick={() => onTabChange?.(nextAction.tab)}
              className="px-3 py-1.5 rounded-xl bg-[#06D6A0] text-[#00303F] text-xs font-black hover:opacity-90 transition-opacity"
              aria-label={`Ir a ${nextAction.label}`}
            >
              Ir →
            </button>
          )}
        </div>
      </motion.div>
    );
  },
);

WhatDoIDoToday.displayName = "WhatDoIDoToday";
export default WhatDoIDoToday;
