import { memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { getMasteryState } from "./components/SubjectsView";

const MASTERY_ORDER = ["recovery", "practice", "mastery", "transfer"];

const MasteryPassportStrip = memo(({ onTabChange }) => {
  const { subjects, subjectsWithGrades } = useSmartBoardKids();
  const list =
    (subjectsWithGrades?.length ? subjectsWithGrades : subjects) || [];

  if (!list.length) return null;

  const sorted = [...list].sort(
    (a, b) => (Number(a.progress) || 0) - (Number(b.progress) || 0),
  );

  const counts = { recovery: 0, practice: 0, mastery: 0, transfer: 0 };
  for (const s of sorted) counts[getMasteryState(s.progress).key]++;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden"
      role="region"
      aria-label="Nivel por materia"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎒</span>
          <span className="text-sm font-black text-[#004B63] uppercase tracking-wide">
            Nivel por materia
          </span>
        </div>
        <button
          type="button"
          onClick={() => onTabChange?.("materias")}
          className="text-[10px] font-bold text-[#0096C7] hover:underline"
        >
          Ver detalle →
        </button>
      </div>

      {/* Legend bar — 4 mastery states */}
      <div className="px-4 pb-3 flex gap-2 flex-wrap">
        {[
          {
            key: "recovery",
            label: "Recuperación",
            emoji: "🆘",
            color: "#EF4444",
            bg: "#FEF2F2",
          },
          {
            key: "practice",
            label: "Práctica",
            emoji: "📖",
            color: "#F59E0B",
            bg: "#FFFBEB",
          },
          {
            key: "mastery",
            label: "Dominio",
            emoji: "⭐",
            color: "#10B981",
            bg: "#ECFDF5",
          },
          {
            key: "transfer",
            label: "Transferencia",
            emoji: "🚀",
            color: "#7C3AED",
            bg: "#F5F3FF",
          },
        ].map((state) => {
          const n = counts[state.key];
          if (n === 0) return null;
          return (
            <span
              key={state.key}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: state.bg, color: state.color }}
            >
              {state.emoji} {state.label} · {n}
            </span>
          );
        })}
      </div>

      {/* Subject rows */}
      <div className="border-t border-[#F1F5F9] divide-y divide-[#F1F5F9]">
        {sorted.map((s, i) => {
          const ms = getMasteryState(s.progress);
          const prog = Number(s.progress) || 0;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onTabChange?.("materias")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors active:scale-[0.99]"
            >
              <span className="text-lg flex-shrink-0">{s.icon || "📚"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#004B63] truncate">
                    {s.name}
                  </span>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{ backgroundColor: ms.bg, color: ms.color }}
                  >
                    {ms.emoji} {ms.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EDF3F7] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: ms.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.06,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-black tabular-nums flex-shrink-0 w-9 text-right"
                style={{ color: ms.color }}
              >
                {prog}%
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});

MasteryPassportStrip.displayName = "MasteryPassportStrip";
export default MasteryPassportStrip;
