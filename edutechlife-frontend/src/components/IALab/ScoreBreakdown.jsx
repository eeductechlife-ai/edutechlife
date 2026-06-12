import PropTypes from 'prop-types';
import { Icon } from '../../utils/iconMapping.jsx';

const EXERCISE_KEYS = ['nota_ej1', 'nota_ej2', 'nota_ej3', 'nota_ej4'];

const ScoreBreakdown = ({ evaluation, isApproved, scoreBarColor, circumference, strokeDashoffset, t }) => {
  const exerciseCount = EXERCISE_KEYS.filter(k => evaluation[k] !== undefined).length;
  const exercises = EXERCISE_KEYS.slice(0, exerciseCount).map((key, i) => ({
    label: t(`ialab.evaluation.results.exercise_${i + 1}`),
    nota: evaluation[key],
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={isApproved ? "var(--color-success)" : "#ef4444"} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="46" textAnchor="middle" className="text-2xl font-bold fill-slate-800 dark:fill-slate-100">
                {evaluation.notaGlobal}%
              </text>
              <text x="50" y="60" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400">
                {t('ialab.evaluation.results.final_grade')}
              </text>
            </svg>
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('ialab.evaluation.results.performance_analysis')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{t('ialab.evaluation.results.status_label')}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <Icon name={isApproved ? "fa-check-circle" : "fa-xmark-circle"} className="mr-1" />
                    {isApproved ? t('ialab.evaluation.results.status_approved') : t('ialab.evaluation.results.status_in_progress')}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${scoreBarColor}`} style={{ width: `${evaluation.notaGlobal}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {isApproved ? t('ialab.evaluation.results.mastery_high') : t('ialab.evaluation.results.mastery_medium')}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t('ialab.evaluation.results.mastery_level')}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{exerciseCount}/{exerciseCount}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t('ialab.evaluation.results.exercises_completed')}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">{t('ialab.evaluation.results.exercise_breakdown')}</h4>
                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{ex.label}</span>
                      <span className={`font-semibold ${(ex.nota || 0) >= 80 ? 'text-emerald-600' : (ex.nota || 0) >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{ex.nota || 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


ScoreBreakdown.propTypes = {
  evaluation: PropTypes.object,
  isApproved: PropTypes.bool,
  scoreBarColor: PropTypes.string,
  circumference: PropTypes.number,
  strokeDashoffset: PropTypes.number,
  t: PropTypes.func,
};

export default ScoreBreakdown;
