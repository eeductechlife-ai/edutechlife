import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';
import { ALL_LESSONS } from '../../data/ialab';
import ResourceBadge from '../ui/ResourceBadge';
import { useTranslation } from '../../i18n/I18nProvider';

const ModuleProgressCard = React.memo(({ moduleId, title, icon, score, config, completedVideos, completedInfographics, completedExams, challengeScores, completedModules }) => {
  const { t } = useTranslation();
  const lessonProgress = useIALabStore(s => s.lessonProgress);
  const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`)).length;
  const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`)).length;
  const examScore = completedExams[moduleId] || 0;
  const challengeScore = challengeScores[moduleId] || 0;
  const moduleLessonProgress = lessonProgress?.[moduleId] || {};
  const moduleLessons = ALL_LESSONS?.[moduleId] || [];
  const completedModuleLessons = Object.values(moduleLessonProgress).filter(s => s === 'completed').length;
  const totalModuleLessons = moduleLessons.length;
  const isPassed = score >= 80;
  const barColor = isPassed ? 'from-emerald-500 to-emerald-400' : score >= 60 ? 'from-amber-500 to-amber-400' : 'from-slate-300 to-slate-400';

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/50 transition-all duration-200 active:scale-[0.99] group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
        isPassed ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 shadow-sm shadow-emerald-500/10' : 'bg-gradient-to-br from-petroleum/10 to-corporate/10'
      }`}>
        <Icon name={icon} className={`text-sm transition-colors duration-300 ${isPassed ? 'text-emerald-600' : 'text-petroleum group-hover:text-corporate'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
          <span className={`text-xs font-bold flex-shrink-0 ${isPassed ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>{Math.round(score)}%</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <ResourceBadge completed={moduleVideos} total={config.videos} icon="fa-play-circle" />
          <ResourceBadge completed={moduleInfographics} total={config.infographics} icon="fa-file-image" />
          {examScore > 0 && (
            <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
              examScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Icon name="fa-file-alt" className="text-[7px]" /> {t('ialab.module_progress_card.exam_abbr')}{examScore}%
            </span>
          )}
          {challengeScore > 0 && (
            <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
              challengeScore >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <Icon name="fa-trophy" className="text-[7px]" /> {t('ialab.module_progress_card.challenge_abbr')}{challengeScore}%
            </span>
          )}
          {completedModuleLessons > 0 && (
            <span className="inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
              <Icon name="fa-check-circle" className="text-[7px]" /> {t('ialab.module_progress_card.lesson_abbr')}{completedModuleLessons}/{totalModuleLessons}
            </span>
          )}
          {completedModules.includes(moduleId) && (examScore > 0 || challengeScore > 0) && (
            <span className="inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-petroleum/5 text-petroleum border-petroleum/10">
              <Icon name="fa-comments" className="text-[7px]" /> {t('ialab.module_progress_card.forum_label')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`} style={{ width: `${Math.round(score)}%` }} />
          </div>
          {isPassed && (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="fa-check" className="text-white text-[9px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ModuleProgressCard;
