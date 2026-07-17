import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { item } from "../gamificationData";

const SessionLog = ({ sessions, darkMode }) => {
  const { t } = useTranslation();
  const recent = useMemo(
    () => [...sessions].reverse().slice(0, 20),
    [sessions],
  );

  if (recent.length === 0) return null;

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
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#004B63]"}`}
      >
        🕐 Sesiones Recientes
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-1">
        <div
          className={`flex items-center justify-between px-3 py-2 text-[10px] font-semibold ${
            darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
          }`}
        >
          <span className="w-16">{t("smartboard.date")}</span>
          <span className="w-16">{t("smartboard.start")}</span>
          <span className="w-14">{t("smartboard.duration")}</span>
          <span className="flex-1 text-right">{t("smartboard.subject")}</span>
        </div>
        {recent.map((s, i) => {
          const start = s.start
            ? new Date(s.start).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-";
          const date =
            s.date ||
            (s.start
              ? new Date(s.start).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                })
              : "-");
          const dur = s.duration ? `${s.duration} min` : "-";
          const subj = s.subject || t("smartboard.general");
          return (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                darkMode ? "hover:bg-[#334155]" : "hover:bg-[#F8FAFC]"
              }`}
            >
              <span
                className={`w-16 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
              >
                {date}
              </span>
              <span
                className={`w-16 ${darkMode ? "text-[#CBD5E1]" : "text-[#334155]"}`}
              >
                {start}
              </span>
              <span
                className={`w-14 ${darkMode ? "text-[#CBD5E1]" : "text-[#334155]"}`}
              >
                {dur}
              </span>
              <span
                className={`flex-1 text-right truncate ${darkMode ? "text-[#CBD5E1]" : "text-[#334155]"}`}
              >
                {subj}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SessionLog;
