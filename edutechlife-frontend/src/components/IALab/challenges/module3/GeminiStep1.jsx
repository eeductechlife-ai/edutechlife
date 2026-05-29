import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';

const TOPIC_ICONS = ['fa-atom', 'fa-brain', 'fa-microchip'];

const GeminiStep1 = ({ exercise, response, onResponseChange, t: tProp }) => {
  const { t } = useTranslation();
  const translate = tProp || t;
  const shouldReduceMotion = useReducedMotion();

  const tema = exercise?.temaInvestigacion || '';

  const topics = React.useMemo(() => {
    if (!tema) return [];
    const lines = tema.split(',').filter(Boolean);
    return lines.length >= 3
      ? lines.slice(0, 3).map((s, i) => ({ id: s.trim().toLowerCase().replace(/\s+/g, '_'), label: s.trim(), icon: TOPIC_ICONS[i % TOPIC_ICONS.length] }))
      : [
          { id: tema.trim().toLowerCase().replace(/\s+/g, '_'), label: tema.trim(), icon: TOPIC_ICONS[0] },
          ...lines.map((s, i) => ({ id: s.trim().toLowerCase().replace(/\s+/g, '_'), label: s.trim(), icon: TOPIC_ICONS[(i + 1) % TOPIC_ICONS.length] })),
        ].slice(0, 3);
  }, [tema]);

  const [form, setForm] = useState({ topic: '', mainQuestion: '', subQuestions: ['', '', ''] });

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.topic !== undefined) setForm(parsed);
      } catch {}
    }
  }, [response]);

  const update = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    onResponseChange(JSON.stringify(next));
  };

  const handleSubChange = (index, value) => {
    const sq = [...form.subQuestions];
    sq[index] = value;
    update({ subQuestions: sq });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-search" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{translate('ialab.challenge.m3.step1_title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{translate('ialab.challenge.m3.step1_subtitle')}</p>
          </div>
        </div>
      </motion.div>

      {tema && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-gradient-to-br from-petroleum/5 to-corporate/5 dark:from-petroleum-dark/10 dark:to-corporate-dark/5 rounded-xl p-5 border border-petroleum/10 dark:border-petroleum-dark/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="fa-lightbulb" className="text-amber-500" />
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{translate('ialab.challenge.m3.step1_topic_label')}</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{tema}</p>
        </motion.div>
      )}

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {translate('ialab.challenge.m3.step1_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step1_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step1_example_q')} />
        <div className="mt-1">
          <ExampleToggle example={translate('ialab.challenge.m3.step1_example_sub')} />
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{translate('ialab.challenge.m3.step1_pick_topic')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topics.map((topic) => {
            const selected = form.topic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => update({ topic: topic.id })}
                className={`relative rounded-xl p-4 text-left transition-all duration-200 ${
                  selected
                    ? 'bg-gradient-to-br from-petroleum to-corporate text-white shadow-lg shadow-corporate/20'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-corporate/40 dark:hover:border-corporate-dark/40 hover:shadow-md text-slate-700 dark:text-slate-200'
                }`}
                aria-pressed={selected}
                aria-label={`${topic.label}${selected ? ' (selected)' : ''}`}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="fa-check" className="text-white text-xs" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  selected ? 'bg-white/20' : 'bg-corporate/10 dark:bg-corporate-dark/20'
                }`}>
                  <Icon name={topic.icon} className={selected ? 'text-white' : 'text-corporate dark:text-corporate-dark'} />
                </div>
                <p className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{topic.label}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {translate('ialab.challenge.m3.step1_main_question')}
          </label>
          <span className={`text-xs font-medium ${
            form.mainQuestion.length > 0 ? 'text-corporate dark:text-corporate-dark' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {form.mainQuestion.length}/500
          </span>
        </div>
        <AutoGrowTextarea
          value={form.mainQuestion}
          onChange={(v) => update({ mainQuestion: v })}
          placeholder={translate('ialab.challenge.m3.step1_main_placeholder')}
          maxLength={500}
        />
        {form.mainQuestion.length > 0 && form.mainQuestion.length < 20 && (
          <p className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 dark:text-amber-400">
            <Icon name="fa-info-circle" className="text-xs" />
            {translate('ialab.challenge.m3.step1_min_hint')}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{translate('ialab.challenge.m3.step1_sub_questions')}</label>
        <div className="space-y-2">
          {form.subQuestions.map((sq, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <input
                type="text"
                value={sq}
                onChange={(e) => handleSubChange(i, e.target.value)}
                placeholder={translate('ialab.challenge.m3.step1_sub_placeholder', { n: i + 1 })}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-corporate dark:focus:border-corporate-dark focus:ring-2 focus:ring-corporate/20 dark:focus:ring-corporate-dark/30"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <StepFeedback
        completed={form.topic && form.mainQuestion.length >= 20 ? 1 : 0}
        total={1}
        hints={[translate('ialab.challenge.m3.step1_min_hint')]}
        t={translate}
      />
    </div>
  );
};

export default GeminiStep1;
