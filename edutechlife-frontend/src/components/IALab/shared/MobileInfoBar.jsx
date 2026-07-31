import PropTypes from "prop-types";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useIALabStore } from "../../../store/ialabStore";
import { Icon } from "../../../utils/iconMapping.jsx";

const MobileInfoBar = ({ user, activeMod, courseProgress }) => {
  const { t } = useTranslation();
  const xp = useIALabStore((s) => s.xp || 0);
  const streak = useIALabStore((s) => s.streak);
  const isStreakAtRisk = useIALabStore((s) => s.isStreakAtRisk);

  const streakValue =
    typeof streak === "number" ? streak : streak?.current || 0;
  const atRisk =
    typeof isStreakAtRisk === "function" ? isStreakAtRisk() : false;
  const level = Math.floor(xp / 100) + 1;
  const progress = Math.round(courseProgress || 0);

  return (
    <div className="lg:hidden flex flex-col gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-petroleum/8 dark:border-petroleum/20 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-xs font-bold">
            {user?.full_name
              ? user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {user?.full_name || t("ialab.user_fallback")}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t("ialab.module_progress", { current: activeMod, total: 5 })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Streak indicator */}
          {streakValue > 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
                atRisk
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
              title={`Racha: ${streakValue} días`}
            >
              <Icon
                name="fa-fire"
                className={`text-[10px] ${atRisk ? "text-red-500" : "text-amber-500"}`}
                aria-hidden="true"
              />
              <span
                className={`text-[10px] font-bold ${atRisk ? "text-red-600" : "text-amber-600"}`}
              >
                {streakValue}
              </span>
            </div>
          )}

          {/* Progress badge */}
          <div className="px-2.5 py-1 bg-petroleum/8 dark:bg-petroleum/20 border border-petroleum/15 text-petroleum dark:text-petroleum rounded-lg font-semibold text-[11px]">
            {progress}%
          </div>
        </div>
      </div>

      {/* Progress bar visual */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-petroleum via-corporate to-petroleum rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

MobileInfoBar.displayName = "MobileInfoBar";

MobileInfoBar.propTypes = {
  user: PropTypes.object,
  activeMod: PropTypes.number,
  courseProgress: PropTypes.number,
};

export default MobileInfoBar;
export { MobileInfoBar };
