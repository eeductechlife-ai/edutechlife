import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Icon } from "../../utils/iconMapping";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  POSITION_ICONS,
  SECTION_HEADER,
  SECTION_TITLE,
  sectionVariants,
} from "./StreakDetailsModalExtras";

// Sección de clasificación del modal de progreso: top 10 por XP y, si el
// estudiante no aparece, su posición resumida al final.
const StreakLeaderboardSection = ({
  entries,
  loadingLb,
  userId,
  myEntry,
  myXp,
  myStreak,
  prefersReducedMotion,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      custom={3}
      variants={sectionVariants}
      initial={prefersReducedMotion ? {} : "hidden"}
      animate="visible"
    >
      <div className={SECTION_HEADER}>
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon name="fa-trophy" className="text-white text-[10px]" />
        </div>
        <h3 className={SECTION_TITLE}>{t("modal.leaderboard_title")}</h3>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
        {loadingLb ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-[var(--theme-emphasis)] animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-slate-400">
            <Icon name="fa-trophy" className="text-2xl mb-2 opacity-30" />
            <p className="text-sm font-medium">{t("leaderboard.empty")}</p>
            <p className="text-xs mt-1">{t("leaderboard.empty_hint")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.slice(0, 10).map((entry) => {
              const isMe = entry.userId === userId;
              const positionStyle = POSITION_ICONS[entry.rank];
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    isMe
                      ? "bg-[var(--theme-emphasis)]/[0.03] ring-1 ring-inset ring-[var(--theme-emphasis)]/10"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      positionStyle?.bg || "bg-slate-100"
                    }`}
                  >
                    {entry.rank <= 3 ? (
                      <Icon
                        name={positionStyle.icon}
                        className={`text-sm ${positionStyle.color}`}
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        #{entry.rank}
                      </span>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold overflow-hidden">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      entry.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {entry.name}
                      {isMe && (
                        <span className="text-[10px] text-[var(--theme-emphasis)] font-medium ml-1">
                          ({t("streak.you")})
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>
                        {t("streak.leaderboard_streak", {
                          days: entry.streak,
                        })}
                      </span>
                      <span>·</span>
                      <span>
                        {t("streak.leaderboard_badges", {
                          count: entry.badges,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[var(--theme-emphasis)]">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {t("streak.xp")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tu posicion si no está en top 10 */}
        {!myEntry && !loadingLb && entries.length > 0 && (
          <div className="border-t border-slate-100 p-3 bg-[var(--theme-emphasis)]/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-slate-400">—</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
                <Icon name="fa-user" className="text-white text-[10px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                  {t("streak.position")}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t("streak.position_line", {
                    xp: myXp.toLocaleString(),
                    days: myStreak,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--theme-emphasis)]">
                  {myXp.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">XP</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

StreakLeaderboardSection.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingLb: PropTypes.bool,
  userId: PropTypes.string,
  myEntry: PropTypes.object,
  myXp: PropTypes.number,
  myStreak: PropTypes.number,
  prefersReducedMotion: PropTypes.bool,
};

export default StreakLeaderboardSection;
