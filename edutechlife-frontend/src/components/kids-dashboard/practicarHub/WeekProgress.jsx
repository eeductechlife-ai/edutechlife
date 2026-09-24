import { memo } from "react";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
export const WEEKLY_GOAL = 4;

function message(daysPracticed, practicedToday) {
  if (daysPracticed >= WEEKLY_GOAL)
    return "¡Cumpliste tu meta de la semana! 🏆";
  if (practicedToday)
    return "¡Ya practicaste hoy! Vuelve mañana para seguir tu racha.";
  if (daysPracticed === 0)
    return "Esta semana aún no practicas. ¡Hoy es un gran día para empezar!";
  return `Te faltan ${WEEKLY_GOAL - daysPracticed} ${WEEKLY_GOAL - daysPracticed === 1 ? "día" : "días"} para tu meta. ¡Tú puedes!`;
}

const WeekProgress = memo(({ progress, darkMode }) => {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const { days, daysPracticed, retosThisWeek, avgScore } = progress;
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const empty = darkMode
    ? "bg-[#0F172A] border-[#334155] text-[#64748B]"
    : "bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8]";

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`text-xs font-bold uppercase tracking-wide ${sub}`}>
          Tu semana
        </p>
        <p className={`text-xs font-bold ${sub}`}>
          Meta: {daysPracticed}/{WEEKLY_GOAL} días 🎯
        </p>
      </div>
      <ol
        className="grid grid-cols-7 gap-1.5"
        aria-label={`Practicaste ${daysPracticed} de 7 días esta semana`}
      >
        {days.map((done, i) => {
          const isToday = i === todayIdx;
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <span
                className={`w-full max-w-[40px] aspect-square rounded-xl flex items-center justify-center text-sm font-black border-2 ${
                  done ? "text-white border-transparent" : empty
                } ${isToday && !done ? "border-[#EF476F] border-dashed" : ""}`}
                style={
                  done
                    ? {
                        background:
                          "linear-gradient(135deg, #EF476F 0%, #FF8FA3 100%)",
                      }
                    : {}
                }
                aria-label={`${DAY_LABELS[i]}${done ? ": practicaste" : ""}${isToday ? " (hoy)" : ""}`}
              >
                {done ? "✓" : ""}
              </span>
              <span
                className={`text-[10px] font-bold ${isToday ? "text-[#EF476F]" : sub}`}
              >
                {isToday ? "Hoy" : DAY_LABELS[i]}
              </span>
            </li>
          );
        })}
      </ol>
      <p
        className={`text-sm mt-3 leading-snug ${darkMode ? "text-white" : "text-[#1E293B]"}`}
      >
        {message(daysPracticed, days[todayIdx])}
      </p>
      {retosThisWeek > 0 && (
        <p className={`text-xs mt-1 ${sub}`}>
          {retosThisWeek} {retosThisWeek === 1 ? "reto" : "retos"} esta semana ·
          promedio {avgScore}%
        </p>
      )}
    </div>
  );
});

WeekProgress.displayName = "WeekProgress";
export default WeekProgress;
