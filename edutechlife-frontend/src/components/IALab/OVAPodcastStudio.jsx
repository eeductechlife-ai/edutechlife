import React, { useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import VoiceReader from './VoiceReader';
import { CONTENT_TYPES, GOALS, DOC_COUNTS, SOURCE_TIPS, GOAL_TIPS, DOC_TIPS, ESTIMATED_TIME, IDEAL_SOURCES, FORMATS, CHECKLIST_ITEMS } from '../../data/ova/podcastStudio';

const getRecommendations = (contentType, goal, docCount) => {
  const sourceTip = SOURCE_TIPS[contentType] || SOURCE_TIPS.mixto;
  const goalTip = GOAL_TIPS[goal] || GOAL_TIPS.explorar;
  const docTip = DOC_TIPS[docCount] || DOC_TIPS.medio;
  const estimatedTime = ESTIMATED_TIME[docCount] || ESTIMATED_TIME.medio;
  const idealSources = IDEAL_SOURCES[docCount] || IDEAL_SOURCES.medio;
  const formats = FORMATS[contentType] || FORMATS.mixto;

  return { sourceTip, goalTip, docTip, estimatedTime, idealSources, formats };
};

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: total }, (_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < current ? 'w-8 bg-[#259eb5]' : i === current ? 'w-8 bg-[#13374b]' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
    ))}
  </div>
);

export default function OVAPodcastStudio() {
  const { t } = useTranslation();
  const [step, setStep] = useState('welcome');
  const [contentType, setContentType] = useState(null);
  const [goal, setGoal] = useState(null);
  const [docCount, setDocCount] = useState(null);
  const [checked, setChecked] = useState({});

  const totalQuestions = 3;
  const currentQuestion = contentType ? (goal ? 2 : 1) : 0;

  const handleStart = () => {
    setContentType(null);
    setGoal(null);
    setDocCount(null);
    setChecked({});
    setStep('questions');
  };

  const handleAnswer = (type, value) => {
    if (type === 'contentType') setContentType(value);
    if (type === 'goal') setGoal(value);
    if (type === 'docCount') { setDocCount(value); setStep('plan'); }
  };

  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (step === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in px-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#13374b] dark:text-slate-100 font-semibold text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
          <span>{t('ova.podcaststudio.badge_assistant')}</span>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b] dark:text-slate-100">{t('ova.podcaststudio.title')}</h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light mb-2">{t('ova.podcaststudio.subtitle')}</p>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mb-4">{t('ova.podcaststudio.welcome_desc')}</p>
        <VoiceReader text={t('ova.podcaststudio.welcome_voice')} />
        <button onClick={handleStart} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          {t('ova.podcaststudio.start_btn')}
        </button>
      </div>
    );
  }

  if (step === 'questions') {
    const showType = !contentType;
    const showGoal = contentType && !goal;
    const showCount = contentType && goal && !docCount;

    return (
      <div className="animate-fade-in px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#13374b] dark:text-slate-100 font-semibold text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
            <span>{t('ova.podcaststudio.badge_project')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] dark:text-slate-100 mb-2">{t('ova.podcaststudio.questions_title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('ova.podcaststudio.questions_desc')}</p>
          <VoiceReader text={t('ova.podcaststudio.questions_voice')} />
        </div>

        <StepIndicator current={currentQuestion} total={totalQuestions} />

        <div className="max-w-3xl mx-auto space-y-8">
          {showType && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] dark:text-slate-100 mb-4 text-center">{t('ova.podcaststudio.q_content_type')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONTENT_TYPES.map(t => (
                  <button key={t.id} onClick={() => handleAnswer('contentType', t.id)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] dark:text-slate-100 group-hover:text-[#259eb5] transition-colors">{t.label}</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showGoal && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] dark:text-slate-100 mb-4 text-center">{t('ova.podcaststudio.q_goal')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => handleAnswer('goal', g.id)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{g.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] dark:text-slate-100 group-hover:text-[#259eb5] transition-colors">{g.label}</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showCount && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] dark:text-slate-100 mb-4 text-center">{t('ova.podcaststudio.q_doc_count')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DOC_COUNTS.map(d => (
                  <button key={d.id} onClick={() => handleAnswer('docCount', d.id)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{d.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] dark:text-slate-100 group-hover:text-[#259eb5] transition-colors">{d.label}</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'plan') {
    const recs = getRecommendations(contentType, goal, docCount);
    const cType = CONTENT_TYPES.find(t => t.id === contentType);
    const g = GOALS.find(t => t.id === goal);
    const dCount = DOC_COUNTS.find(t => t.id === docCount);

    return (
      <div className="animate-fade-in px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span>{t('ova.podcaststudio.badge_plan')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] dark:text-slate-100 mb-2">{t('ova.podcaststudio.plan_title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('ova.podcaststudio.plan_desc')}</p>
          <VoiceReader text={t('ova.podcaststudio.plan_voice', { cTypeLabel: cType?.label, gLabel: g?.label, dCountLabel: dCount?.label })} />
        </div>

        <StepIndicator current={2} total={3} />

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-2 bg-cyan-50 text-[#13374b] dark:text-slate-100 rounded-xl text-sm font-semibold border border-cyan-200">{cType?.icon} {cType?.label}</span>
            <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-[#13374b] dark:text-slate-100 rounded-xl text-sm font-semibold border border-purple-200">{g?.icon} {g?.label}</span>
            <span className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-[#13374b] dark:text-slate-100 rounded-xl text-sm font-semibold border border-amber-200">{dCount?.icon} {dCount?.label}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm">
            <h3 className="font-bold text-[#13374b] dark:text-slate-100 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              {t('ova.podcaststudio.plan_summary')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{t('ova.podcaststudio.sources_label')}</div>
                <div className="text-lg font-bold text-[#13374b] dark:text-slate-100">{recs.idealSources}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('ova.podcaststudio.format_label')} {recs.formats}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{t('ova.podcaststudio.time_label')}</div>
                <div className="text-lg font-bold text-[#13374b] dark:text-slate-100">{recs.estimatedTime}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('ova.podcaststudio.time_sublabel')}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{t('ova.podcaststudio.focus_label')}</div>
                <div className="text-lg font-bold text-[#13374b] dark:text-slate-100">{g?.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{g?.desc}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">📄</span>
                  <div>
                    <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">{t('ova.podcaststudio.tip_sources')}</div>
                    <p className="text-sm text-blue-900 leading-relaxed">{recs.sourceTip}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">🎯</span>
                  <div>
                    <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">{t('ova.podcaststudio.tip_goal')}</div>
                    <p className="text-sm text-purple-900 leading-relaxed">{recs.goalTip}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">📊</span>
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">{t('ova.podcaststudio.tip_docs')}</div>
                    <p className="text-sm text-amber-900 leading-relaxed">{recs.docTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setStep('checklist')}
            className="px-8 py-3 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            {t('ova.podcaststudio.go_checklist')}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  }

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="animate-fade-in px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#13374b] dark:text-slate-100 font-semibold text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
          <span>{t('ova.podcaststudio.badge_checklist')}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] dark:text-slate-100 mb-2">{t('ova.podcaststudio.checklist_title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('ova.podcaststudio.checklist_desc')}</p>
        <VoiceReader text={t('ova.podcaststudio.checklist_voice')} />
      </div>

      <StepIndicator current={3} total={3} />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#13374b] dark:text-slate-100">{t('ova.podcaststudio.progress_label')}</span>
            <span className="text-sm font-bold text-[#259eb5]">{checkedCount}/{CHECKLIST_ITEMS.length}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#259eb5] to-[#13374b] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {CHECKLIST_ITEMS.map(item => (
            <button key={item.id} onClick={() => toggleCheck(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                checked[item.id]
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-[#259eb5]'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                checked[item.id] ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-700/50 border-2 border-slate-300'
              }`}>
                {checked[item.id] && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${checked[item.id] ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {checkedCount === CHECKLIST_ITEMS.length && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center mb-6 animate-fade-in">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2">{t('ova.podcaststudio.completed_title')}</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">{t('ova.podcaststudio.completed_desc')}</p>
            <VoiceReader text={t('ova.podcaststudio.completed_voice')} />
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button onClick={handleStart}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-[#13374b] dark:text-slate-100 border-2 border-slate-200 dark:border-slate-600 hover:border-[#259eb5] rounded-xl font-semibold transition-all inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {t('ova.podcaststudio.restart_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
