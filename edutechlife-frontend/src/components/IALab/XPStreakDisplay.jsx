import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";

/**
 * XPStreakDisplay — Muestra XP + Nivel + Streak en el header
 * Componente aislado para evitar errores en el header principal
 */
const XPStreakDisplay = () => {
  const xp = useIALabStore((s) => s.xp || 0);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);

  const streakValue =
    typeof streak === "number" ? streak : streak?.current || 0;
  const level = Math.floor(xp / 100) + 1;
  const atRisk =
    typeof isStreakAtRisk === "function" ? isStreakAtRisk() : false;

  return (
    <>
      {/* XP + Nivel Display */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-lg border border-petroleum/20">
        <Icon
          name="fa-bolt"
          className="text-sm text-petroleum"
          aria-hidden="true"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-slate-600 font-medium">
            Nivel {level}
          </span>
          <span className="text-xs font-bold text-petroleum">{xp} XP</span>
        </div>
      </div>

      {/* Streak Display */}
      {streakValue > 0 && (
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
            atRisk ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          }`}
        >
          <Icon
            name="fa-fire"
            className={`text-sm ${atRisk ? "text-red-500" : "text-amber-500"}`}
            aria-hidden="true"
          />
          <span
            className={`text-xs font-bold ${
              atRisk ? "text-red-600" : "text-amber-600"
            }`}
          >
            {streakValue} días
          </span>
        </div>
      )}
    </>
  );
};

export default XPStreakDisplay;
