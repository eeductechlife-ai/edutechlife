import PropTypes from 'prop-types';
import { Icon } from '../../utils/iconMapping.jsx';

const EXERCISE_CONFIG = [
  { key: 'ej1', titleKey: 'ialab.evaluation.results.exercise_1', icon: 'fa-search', color: 'text-corporate', bgColor: 'bg-corporate/10' },
  { key: 'ej2', titleKey: 'ialab.evaluation.results.exercise_2', icon: 'fa-magic', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { key: 'ej3', titleKey: 'ialab.evaluation.results.exercise_3', icon: 'fa-plus-circle', color: 'text-petroleum', bgColor: 'bg-petroleum/10' },
  { key: 'ej4', titleKey: 'ialab.evaluation.results.exercise_4', icon: 'fa-file-alt', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
];

const ExerciseFeedback = ({ icon, iconColor, iconBg, title, nota, feedback }) => (
  <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} className={`${iconColor} text-lg`} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('ialab.evaluation.results.detailed_analysis')}</p>
      </div>
      <div className={`px-4 py-2 rounded-lg text-lg font-bold ${nota >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : nota >= 60 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'}`}>
        {nota}%
      </div>
    </div>
    <div className="mb-3">
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${nota >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : nota >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`} style={{ width: `${nota}%` }} />
      </div>
    </div>
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
      <div className="flex items-start gap-3">
        <Icon name="fa-comment" className="text-slate-600 mt-1" />
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{feedback}</p>
      </div>
    </div>
  </div>
);

const FeedbackPanel = ({ evaluation, t }) => (
  <div className="space-y-6">
    {EXERCISE_CONFIG.map((config, index) => {
      const feedback = evaluation[`feedback_${config.key}`];
      const nota = evaluation[`nota_${config.key}`];
      if (nota === undefined) return null;
      return (
        <ExerciseFeedback
          key={index}
          icon={config.icon}
          iconColor={config.color}
          iconBg={config.bgColor}
          title={t(config.titleKey)}
          nota={nota}
          feedback={feedback}
        />
      );
    })}
  </div>
);


FeedbackPanel.propTypes = {
  evaluation: PropTypes.object,
  t: PropTypes.func,
};

export default FeedbackPanel;
