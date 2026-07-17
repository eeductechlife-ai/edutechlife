import { Icon } from '../../../utils/iconMapping'

export function ActivityHistoryHeader({
  t, isExpanded, setIsExpanded, onClose,
  handleExportPDF, pdfLoading, totalLessonsCompleted,
  totalLessonsCount, xp, level, streak, TABS,
}) {
  return (
    <div className="relative bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/10">
          <Icon name="fa-clock" className="text-white text-lg" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg font-montserrat tracking-tight">{t("activity.title")}</h1>
          <p className="text-white/60 text-xs">
            {t("activity.stats.progress")} · {totalLessonsCompleted}/{totalLessonsCount} {t("activity.stats.lessons").toLowerCase()} · {xp} XP
          </p>
          <span id="activity-history-desc" className="sr-only">
            {t("activity.aria_description", {
              lessonsCompleted: totalLessonsCompleted,
              lessonsTotal: totalLessonsCount,
              level, xp, streak,
              tabs: TABS.length,
              tabLabels: TABS.map((tab) => t(tab.labelKey)).join(", "),
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={handleExportPDF}
          disabled={pdfLoading}
          className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10 disabled:opacity-50"
          aria-label={t("activity.export_aria")}
        >
          <Icon name={pdfLoading ? "fa-spinner" : "fa-file-pdf"} className={`text-white text-xs ${pdfLoading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10"
          aria-label={isExpanded ? t("activity.collapse_aria") : t("activity.expand_aria")}
        >
          <Icon name={isExpanded ? "fa-compress" : "fa-expand"} className="text-white text-sm" />
        </button>
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 active:scale-90 ring-1 ring-white/10"
          aria-label={t("activity.close_aria")}
        >
          <Icon name="fa-times" className="text-white text-sm" />
        </button>
      </div>
    </div>
  )
}
