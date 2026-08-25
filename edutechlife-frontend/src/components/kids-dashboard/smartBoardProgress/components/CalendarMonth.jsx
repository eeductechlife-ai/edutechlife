import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { getDayStatus, getActiveHour, item } from "../gamificationData";

const CalendarMonth = ({ streakLog, darkMode }) => {
  const { t } = useTranslation();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ day: d, dateStr });
  }

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
        📅 {monthName}
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {t("smartboard.calendar_days")
          .split("")
          .map((d, i) => (
            <span
              key={i}
              className="text-center text-[10px] font-semibold text-[#64748B] py-1"
            >
              {d}
            </span>
          ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const status = getDayStatus(d.dateStr, streakLog);
          const hour = getActiveHour(d.dateStr, streakLog);
          return (
            <motion.div
              key={d.dateStr}
              whileHover={{ scale: 1.2 }}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                status === "active"
                  ? "bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] text-white shadow-sm"
                  : status === "missed"
                    ? darkMode
                      ? "bg-[#334155] text-[#64748B]"
                      : "bg-[#F1F5F9] text-[#94A3B8]"
                    : "text-transparent"
              }`}
              title={
                hour
                  ? t("smartboard.connected_at", { day: d.day, hour })
                  : `${d.day}`
              }
            >
              {status !== "future" && d.day}
              {status === "active" && hour && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-[#64748B]">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]" />{" "}
          {t("smartboard.connected")}
        </span>
        <span className="flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${darkMode ? "bg-[#334155]" : "bg-[#F1F5F9]"}`}
          />{" "}
          {t("smartboard.not_connected")}
        </span>
      </div>
    </motion.div>
  );
};

export default CalendarMonth;
