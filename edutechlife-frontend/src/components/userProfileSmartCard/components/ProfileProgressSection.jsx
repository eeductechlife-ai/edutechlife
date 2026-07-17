import { Icon } from '../../../utils/iconMapping.jsx';

const TOTAL_MODULES = 5;

const ProfileProgressSection = ({ t, stats }) => (
  <div className="mb-5">
    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
      <Icon name="fa-chart-simple" className="text-[#004B63] text-xs" />
      {t('profile.learning_stats')}
    </h4>

    <div className="mb-4 p-3 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 rounded-xl border border-[#004B63]/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-slate-500">{t('profile.course_progress')}</span>
        <span className="text-[10px] font-bold text-[#004B63]">{stats.progressPercent}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full transition-all duration-500"
          style={{ width: `${stats.progressPercent}%` }}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
        <p className="text-lg font-bold text-[#004B63]">{stats.completedLessons}</p>
        <p className="text-[10px] text-slate-500">{t('profile.completed_lessons')}</p>
      </div>
      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
        <p className="text-lg font-bold text-[#004B63]">{stats.completedModules}/{TOTAL_MODULES}</p>
        <p className="text-[10px] text-slate-500">{t('profile.completed_modules')}</p>
      </div>
      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
        <p className="text-lg font-bold text-[#004B63]">{stats.bestScore}%</p>
        <p className="text-[10px] text-slate-500">{t('profile.best_score')}</p>
      </div>
      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
        <p className="text-lg font-bold text-[#004B63]">
          {stats.learningHours > 0
            ? `${stats.learningHours}${t('profile.hours_unit')}`
            : '\u2014'}
        </p>
        <p className="text-[10px] text-slate-500">{t('profile.learning_hours')}</p>
      </div>
    </div>

    {stats.certificates > 0 && (
      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
        <Icon name="fa-certificate" className="text-emerald-500 text-sm flex-shrink-0" />
        <span className="text-[10px] font-medium text-emerald-700">{t('profile.certificate_earned')}</span>
      </div>
    )}
  </div>
);

export default ProfileProgressSection;
