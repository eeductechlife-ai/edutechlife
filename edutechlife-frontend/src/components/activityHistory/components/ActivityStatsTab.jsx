import { motion } from 'framer-motion'
import { Icon } from '../../../utils/iconMapping'
import { AccordionSection } from './ActivityAccordion'
import { StudyTimeChart, ActivityDistributionChart } from './StatsCharts'

export function ActivityStatsTab({
  t, monthlyData, timeRange, setTimeRange, studyHours, studyMins,
  activityDistribution, moduleScores, courseProgress, completedCount,
  totalVideosCount, totalVideosTarget, totalInfographicsCount, totalInfographicsTarget,
  totalExamsCount, totalChallengesCount, sessionStats, liveSeconds,
  effectiveTodayMinutes, daysActive, streak, getStreakMessage, syncStatus,
  accordionSections, toggleAccordion, badges, BADGE_INFO, nextBadge,
  xp, level, weeklyXP, totalLessonsCompleted, totalLessonsCount,
  lastActivityTime, effectiveAllMinutes,
}) {
  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl shadow-lg p-5 sm:p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Icon name="fa-chart-line" className="text-sm text-white" />
          </div>
          <h2 className="text-sm font-bold font-montserrat tracking-wide text-white/90">
            {t("activity.stats.executive_summary")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
              XP {t("activity.stats.total_label")}
            </p>
            <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">{xp}</p>
            <p className="text-[10px] text-white/70 mt-0.5">Nivel {level}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
              {t("activity.stats.weekly_xp")}
            </p>
            <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
              {weeklyXP?.weekly}/{weeklyXP?.weeklyTarget}
            </p>
            <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${weeklyXP?.weeklyPct || 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
              {t("activity.stats.study_time")}
            </p>
            <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
              {sessionStats?.sessionCount > 0 || liveSeconds >= 30
                ? `${studyHours}h ${studyMins}m`
                : "—"}
            </p>
            <p className="text-[10px] text-white/70 mt-0.5">
              {t("activity.stats.active_days", { days: daysActive })}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
              {t("activity.stats.course_progress")}
            </p>
            <p className="text-xl font-bold font-montserrat tracking-tight mt-0.5">
              {Math.round(courseProgress || 0)}%
            </p>
            <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                style={{ width: `${Math.min(courseProgress || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/40 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
              <Icon name="fa-tachometer-alt" className="text-petroleum text-sm" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-petroleum uppercase tracking-wider">
                {t("activity.stats.global_progress")}
              </h3>
              <p className="text-[10px] text-slate-400">
                {t("activity.progress_label", {
                  completed: totalVideosCount + totalInfographicsCount + totalExamsCount + totalChallengesCount + completedCount,
                  total: totalVideosTarget + totalInfographicsTarget + 5 + 5 + 5 + totalLessonsCount,
                })}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-petroleum font-montserrat tracking-tight">
            {Math.round(courseProgress || 0)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${Math.min(courseProgress || 0, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-[10px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-petroleum" />
            {t("activity.modules_completed", { count: completedCount })}
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-corporate" />
            {t("activity.videos_completed", { count: totalVideosCount, target: totalVideosTarget })}
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t("activity.evaluations_completed", { count: totalExamsCount + totalChallengesCount })}
          </span>
        </div>
      </div>

      <AccordionSection
        id="estudio"
        title={t("activity.stats.study_time")}
        icon="fa-clock"
        isOpen={accordionSections.estudio}
        onToggle={() => toggleAccordion("estudio")}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-3 rounded-xl bg-gradient-to-b from-petroleum/5 to-transparent border border-petroleum/10">
            <div className="text-xl font-bold text-petroleum">
              {sessionStats?.sessionCount > 0 || liveSeconds >= 30 ? `${studyHours}h ${studyMins}m` : "—"}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">{t("activity.stats.total_time_label")}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-b from-corporate/5 to-transparent border border-corporate/10">
            <div className="text-xl font-bold text-corporate">{sessionStats?.sessionCount}</div>
            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">{t("activity.stats.sessions_label")}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/10">
            <div className="text-xl font-bold text-emerald-600">{daysActive}</div>
            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">{t("activity.stats.days_active")}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10">
            <div className="text-xl font-bold text-amber-600">
              {sessionStats?.sessionCount > 0 || liveSeconds >= 30 ? `${Math.round(effectiveTodayMinutes)} min` : "—"}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">{t("activity.stats.today")}</p>
          </div>
        </div>
        <StudyTimeChart monthlyData={monthlyData} timeRange={timeRange} studyHours={studyHours} studyMins={studyMins} t={t} />
      </AccordionSection>

      <AccordionSection
        id="progreso"
        title={t("activity.stats.global_progress")}
        icon="fa-chart-bar"
        isOpen={accordionSections.progreso}
        onToggle={() => toggleAccordion("progreso")}
      >
        <ActivityDistributionChart activityDistribution={activityDistribution} t={t} />
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            {t("activity.stats.by_module")}
          </h4>
          <div className="space-y-2.5">
            {moduleScores.map((mod) => {
              const barColor = mod.score >= 80
                ? "from-emerald-500 to-emerald-400"
                : mod.score >= 60
                  ? "from-amber-500 to-amber-400"
                  : "from-slate-400 to-slate-300"
              return (
                <div key={mod.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={mod.icon} className="text-[10px] text-petroleum" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold text-slate-700 truncate">{mod.title}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {mod.examScore > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${mod.examScore >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                            E:{mod.examScore}%
                          </span>
                        )}
                        {mod.challengeScore > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${mod.challengeScore >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                            D:{mod.challengeScore}%
                          </span>
                        )}
                        {mod.dominance && (
                          <span className={`text-[8px] font-bold px-1.5 py-[1px] rounded-md border ${mod.dominance.bg} ${mod.dominance.color}`}>
                            {mod.dominance.label}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold ${mod.score >= 80 ? "text-emerald-600" : mod.score >= 60 ? "text-amber-600" : "text-slate-500"}`}>
                          {Math.round(mod.score)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`} style={{ width: `${Math.round(mod.score)}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        id="logros"
        title={t("activity.stats.achievements")}
        icon="fa-star"
        isOpen={accordionSections.logros}
        onToggle={() => toggleAccordion("logros")}
      >
        {badges && badges.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
              {badges.map((badgeId) => {
                const info = BADGE_INFO?.[badgeId] || { icon: "fa-star", label: badgeId, desc: "", color: "#94A3B8" }
                return (
                  <div key={badgeId} className="group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/40 shadow-sm p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-500/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                      <Icon name={info.icon} className="text-sm" style={{ color: info.color }} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{info.label}</p>
                    <p className="text-[8px] text-slate-400 mt-0.5">{info.desc}</p>
                  </div>
                )
              })}
            </div>
            {nextBadge && (
              <div className="pt-3 border-t border-slate-100/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center opacity-60 flex-shrink-0">
                      <Icon name={nextBadge.icon} className="text-[10px] text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 leading-tight">
                        {t("activity.stats.next_badge")} {nextBadge.label}
                      </p>
                      <p className="text-[8px] text-slate-400">{nextBadge.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{nextBadge.current}/{nextBadge.target}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all duration-500" style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }} />
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">{t("activity.stats.no_badges")}</p>
        )}
      </AccordionSection>

      <div className="flex items-center justify-end gap-2 px-1">
        <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === "synced" ? "bg-emerald-500" : syncStatus === "syncing" ? "bg-amber-500 animate-pulse" : "bg-slate-400"}`} />
        <span className="text-[10px] font-medium text-slate-400">
          {syncStatus === "synced" ? t("activity.stats.sync_synced") : syncStatus === "syncing" ? t("activity.stats.sync_syncing") : syncStatus === "offline" ? t("activity.stats.sync_offline") : t("activity.stats.sync_local")}
        </span>
      </div>
    </div>
  )
}
