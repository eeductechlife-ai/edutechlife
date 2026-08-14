import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useIALabStore } from "../../../store/ialabStore";
import { getBadgeInfo } from "../../../data/ialab";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";
import { getSessionStats } from "../../../hooks/useSessionTracker";
import XPCard from "./XPCard";
import StreakCalendar from "./StreakCalendar";
import ActivityFeed from "./ActivityFeed";

const MODULES = [1, 2, 3, 4, 5];

function AnalyticsDashboard() {
  const { locale } = useTranslation();
  const xp = useIALabStore((s) => s.xp);
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const badges = useIALabStore((s) => s.badges);
  const badgesDates = useIALabStore((s) => s.badgesDates);

  const [sessionStats, setSessionStats] = useState(() => getSessionStats());
  useEffect(() => {
    setSessionStats(getSessionStats());
  }, []);

  const badgeInfo = useMemo(() => getBadgeInfo(locale), [locale]);

  const weeklyData = useMemo(() => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const today = new Date().getDay();
    const dayIdx = today === 0 ? 6 : today - 1;
    const activeDays = dayIdx + 1;
    const avg = Math.max(5, Math.round(xp / Math.max(1, activeDays)));
    const seeds = [0.7, 1.1, 0.5, 0.9, 1.3, 0.3, 0.1];
    let total = 0;
    const values = days.map((day, i) => {
      const val = i <= dayIdx ? Math.round(avg * seeds[i]) : 0;
      if (i <= dayIdx) total += val;
      return { day, xp: val };
    });
    const remainder = xp - total;
    if (remainder > 0 && dayIdx >= 0) {
      values[dayIdx].xp += remainder;
    }
    return values;
  }, [xp]);

  const maxXp = Math.max(...weeklyData.map((d) => d.xp), 1);

  const moduleScores = useMemo(
    () =>
      MODULES.map((id) => ({
        id,
        score: moduleProgress[id]?.currentScore || 0,
      })),
    [moduleProgress],
  );

  const badgeItems = useMemo(() => {
    const all = Object.entries(badgeInfo).map(([id, info]) => ({
      id,
      ...info,
      earned: badges.includes(id),
      dateEarned: badgesDates[id] || null,
    }));
    const earned = all.filter((b) => b.earned);
    const unearned = all.filter((b) => !b.earned);
    return [...earned, ...unearned].slice(0, 6);
  }, [badgeInfo, badges, badgesDates]);

  const scoreColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-400";
    return "bg-red-400";
  };

  const scoreTextColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Icon name="fa-chart-line" className="w-4 h-4 text-petroleum" />
        <h2 className="text-sm font-bold text-petroleum uppercase tracking-wider">
          Analíticas
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <XPCard />
        <StreakCalendar />
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate/20 flex items-center justify-center">
              <Icon name="fa-chart-line" className="w-4 h-4 text-corporate" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              XP Semanal
            </p>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {weeklyData.map((d, i) => {
              const height = d.xp > 0 ? Math.max(8, (d.xp / maxXp) * 100) : 0;
              return (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    className="w-full rounded-md bg-corporate/5 relative overflow-hidden"
                    style={{ height: 80 }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-corporate to-corporate/60 rounded-t-md"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400">{d.day}</span>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {d.xp} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session time stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Icon name="fa-clock" className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Tiempo de Estudio
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {Math.round(sessionStats.todayMinutes)}
              <span className="text-[11px] font-normal text-slate-400 ml-1">
                min hoy
              </span>
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {sessionStats.allMinutes < 60
                ? Math.round(sessionStats.allMinutes) + " min"
                : (sessionStats.allMinutes / 60).toFixed(1) + " h"}
              <span className="text-[11px] font-normal text-slate-400 ml-1">
                total
              </span>
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {sessionStats.daysActive}
              <span className="text-[11px] font-normal text-slate-400 ml-1">
                días activos
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Icon name="fa-trophy" className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Puntaje por Módulo
            </p>
          </div>
          <div className="space-y-2.5">
            {moduleScores.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 w-10">
                  Mód. {m.id}
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.score}%` }}
                    transition={{
                      duration: 0.8,
                      delay: m.id * 0.1,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${scoreColor(m.score)}`}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold w-10 text-right ${scoreTextColor(m.score)}`}
                >
                  {m.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Icon name="fa-award" className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Insignias
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {badgeItems.map((b) => (
              <div
                key={b.id}
                className={`p-2 rounded-lg text-center transition-all ${b.earned ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-100 opacity-50"}`}
              >
                <Icon
                  name={b.icon}
                  className="w-5 h-5 mx-auto mb-1"
                  color={b.earned ? b.color : undefined}
                />
                <p
                  className={`text-[9px] font-semibold ${b.earned ? "text-slate-700" : "text-slate-400"}`}
                >
                  {b.label}
                </p>
                {b.earned && b.dateEarned && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(b.dateEarned).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ActivityFeed />
    </motion.section>
  );
}

export default AnalyticsDashboard;
