import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { item } from "../gamificationData";

const PointsHistory = ({ pointsHistory, darkMode }) => {
  const reversed = useMemo(
    () => [...pointsHistory].reverse().slice(0, 50),
    [pointsHistory],
  );
  let balance = pointsHistory.reduce((sum, p) => sum + p.points, 0);

  if (reversed.length === 0) return null;

  return (
    <motion.div
      variants={item}
      className={`rounded-2xl p-5 border transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/80 border-[#E2E8F0]/50"
      } backdrop-blur-xl`}
    >
      <h3
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
      >
        💳 Historial de Puntos
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {reversed.map((entry, i) => {
          balance -= entry.points;
          const date = new Date(entry.timestamp).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
          });
          const isNeg = entry.points < 0;
          return (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                darkMode ? "hover:bg-[#334155]" : "hover:bg-[#F8FAFC]"
              }`}
            >
              <span
                className={`w-14 flex-shrink-0 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {date}
              </span>
              <span
                className={`flex-1 px-2 truncate ${darkMode ? "text-[#CBD5E1]" : "text-[#334155]"}`}
              >
                {entry.reason}
              </span>
              <span
                className={`w-16 text-right font-bold ${isNeg ? "text-red-400" : "text-[#FB8500]"}`}
              >
                {isNeg ? "" : "+"}
                {entry.points}
              </span>
              <span
                className={`w-14 text-right ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                {balance}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PointsHistory;
