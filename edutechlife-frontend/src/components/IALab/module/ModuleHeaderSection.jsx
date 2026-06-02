import PropTypes from 'prop-types';
import { ALL_LESSONS } from '../../../data/ialab';

const ModuleHeaderSection = ({ moduleData, activeMod, isDescriptionExpanded, setIsDescriptionExpanded, lessonProgress, t }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-petroleum leading-tight dark:text-petroleum font-montserrat">
          {moduleData.title}
        </h2>
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-petroleum dark:text-petroleum text-[10px] font-bold rounded-lg border border-slate-200/60 dark:border-slate-600">{moduleData.badge.duration}</span>
        {(() => {
          const prog = lessonProgress[activeMod] || {};
          const total = (ALL_LESSONS[activeMod] || []).length;
          const done = Object.values(prog).filter(s => s === 'completed').length;
          if (!total) return null;
          return (
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${done === total ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              {t('ialab.module.lessons', { done, total })}
            </span>
          );
        })()}
      </div>
     
      <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3 dark:text-slate-300">
        {isDescriptionExpanded ? moduleData.description : moduleData.description.split('. ').slice(0, 1).join('. ') + '.'}
      </p>
      {moduleData.description.split('. ').length > 1 && (
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="text-xs font-semibold text-corporate hover:text-petroleum transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 rounded"
        >
          {isDescriptionExpanded ? t('ialab.see_less') : t('ialab.see_more')}
        </button>
      )}
    </>
  );
};


ModuleHeaderSection.propTypes = {
  moduleData: PropTypes.any,
  activeMod: PropTypes.any,
  isDescriptionExpanded: PropTypes.any,
  setIsDescriptionExpanded: PropTypes.any,
  lessonProgress: PropTypes.any,
  t: PropTypes.any,
};

export default ModuleHeaderSection;
