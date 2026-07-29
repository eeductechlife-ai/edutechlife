import PropTypes from "prop-types";
import { useTranslation } from "../../../i18n/I18nProvider";

const MobileInfoBar = ({ user, activeMod, courseProgress }) => {
  const { t } = useTranslation();
  return (
    <div className="md:hidden flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-petroleum/8 dark:border-petroleum/20 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-xs font-bold">
          {user?.full_name
            ? user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
            : "U"}
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            {user?.full_name || t("ialab.user_fallback")}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("ialab.module_progress", { current: activeMod, total: 5 })}
          </p>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-petroleum/8 dark:bg-petroleum/20 border border-petroleum/15 text-petroleum dark:text-petroleum rounded-lg font-semibold text-xs">
        {t("ialab.completed_pct", { pct: Math.round(courseProgress) })}
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
