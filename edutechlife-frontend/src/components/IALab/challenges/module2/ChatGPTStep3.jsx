import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import CaseContextBanner from './CaseContextBanner';
import AutoGrowTextarea from '../shared/AutoGrowTextarea';
import ExampleToggle from '../shared/ExampleToggle';
import StepFeedback from '../shared/StepFeedback';
import ProgressStepper from '../shared/ProgressStepper';

const getDataFieldsByCase = (selectedCase) => {
  const base = [
    { id: 'id', icon: 'fa-hashtag', labelKey: 'ialab.challenge.m2.step3_field_id' },
    { id: 'name', icon: 'fa-tag', labelKey: 'ialab.challenge.m2.step3_field_name' },
  ];
  if (selectedCase === 'marketing') return [...base, { id: 'dateRange', icon: 'fa-calendar', labelKey: 'ialab.challenge.m2.step3_field_daterange' }, { id: 'platform', icon: 'fa-globe', labelKey: 'ialab.challenge.m2.step3_field_platform' }];
  if (selectedCase === 'support') return [...base, { id: 'priority', icon: 'fa-flag', labelKey: 'ialab.challenge.m2.step3_field_priority' }, { id: 'description', icon: 'fa-align-left', labelKey: 'ialab.challenge.m2.step3_field_description' }];
  if (selectedCase === 'dev') return [...base, { id: 'repo', icon: 'fa-code-branch', labelKey: 'ialab.challenge.m2.step3_field_repo' }, { id: 'tags', icon: 'fa-tags', labelKey: 'ialab.challenge.m2.step3_field_tags' }];
  return base;
};

const ChatGPTStep3 = ({ exercise, response, onResponseChange, selectedCase }) => {
  const { t } = useTranslation();
  const [functionName, setFunctionName] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [returnValue, setReturnValue] = useState('');

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.functionName !== undefined) setFunctionName(parsed.functionName);
        if (Array.isArray(parsed.selectedFields)) setSelectedFields(parsed.selectedFields);
        if (parsed.returnValue !== undefined) setReturnValue(parsed.returnValue);
      } catch { /* ignore */ }
    }
  }, [response]);

  const emitChange = (updates) => {
    const next = {
      functionName: updates.functionName !== undefined ? updates.functionName : functionName,
      selectedFields: updates.selectedFields !== undefined ? updates.selectedFields : selectedFields,
      returnValue: updates.returnValue !== undefined ? updates.returnValue : returnValue,
    };
    onResponseChange(JSON.stringify(next));
  };

  const functionCallSpec = exercise?.functionCallSpec || exercise || '';
  const dataFields = getDataFieldsByCase(selectedCase);
  const completed = [functionName.length >= 3, selectedFields.length > 0, returnValue.length >= 10].filter(Boolean).length;

  const generatedSchema = useMemo(() => {
    const props = {};
    selectedFields.forEach((fieldId) => {
      const field = dataFields.find(f => f.id === fieldId);
      if (field) {
        props[fieldId] = { type: 'string', description: field.labelKey };
      }
    });
    return {
      name: functionName || 'miFuncion',
      description: t('ialab.challenge.m2.step3_schema_desc', { returnValue: returnValue || 'resultado' }),
      parameters: {
        type: 'object',
        properties: props,
        required: selectedFields,
      },
    };
  }, [functionName, selectedFields, returnValue, dataFields, t]);

  const getExample = () => {
    const examples = {
      marketing: 'generarInformeRedes("cliente-123", "2026-01-01", "2026-03-31", "instagram,facebook")',
      support: 'crearTicketSoporte("cliente-456", "alta", "El usuario no puede acceder a su cuenta desde el lunes")',
      dev: 'generarChangelog("mi-app", "v1.0.0", "v1.1.0", "fix,feature")',
    };
    return examples[selectedCase] || 'miFuncion(param1, param2)';
  };

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={3} t={t} />

      <div className="bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-2xl p-6 border border-corporate/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-corporate/20 flex-shrink-0">
            <Icon name="fa-plug" className="text-white text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('ialab.challenge.m2.step3_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/10 dark:to-cyan-900/10 rounded-xl p-5 border border-sky-200 dark:border-sky-700/30">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="fa-bullseye" className="text-sky-500" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_spec_context')}</h3>
        </div>
        <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed whitespace-pre-wrap">{functionCallSpec}</p>
      </div>

      <CaseContextBanner selectedCase={selectedCase} stepNumber={3} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-petroleum/10 dark:bg-petroleum/20 flex items-center justify-center">
            <Icon name="fa-cog" className="text-petroleum" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_function_name')}</h3>
        </div>
        <input
          type="text"
          value={functionName}
          onChange={(e) => { setFunctionName(e.target.value); emitChange({ functionName: e.target.value }); }}
          placeholder={t('ialab.challenge.m2.step3_function_name_placeholder')}
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-corporate focus:ring-2 focus:ring-corporate/20 text-sm font-mono"
        />
        <ExampleToggle t={t} example={getExample()} />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate/20 flex items-center justify-center">
            <Icon name="fa-database" className="text-corporate" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_data_needed')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.challenge.m2.step3_data_needed_hint')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {dataFields.map((field) => {
            const isSelected = selectedFields.includes(field.id);
            return (
              <button
                key={field.id}
                onClick={() => {
                  const next = isSelected ? selectedFields.filter(f => f !== field.id) : [...selectedFields, field.id];
                  setSelectedFields(next);
                  emitChange({ selectedFields: next });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-corporate/10 border-corporate text-corporate dark:bg-mint/10 dark:border-mint dark:text-mint'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <Icon name={field.icon} className={`text-sm ${isSelected ? 'text-corporate dark:text-mint' : 'text-slate-400'}`} />
                <span className="font-medium">{t(field.labelKey)}</span>
                {isSelected && <Icon name="fa-check" className="text-xs" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <Icon name="fa-arrow-right" className="text-emerald-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_return')}</h3>
        </div>
        <AutoGrowTextarea
          value={returnValue}
          onChange={(value) => { setReturnValue(value); emitChange({ returnValue: value }); }}
          placeholder={t('ialab.challenge.m2.step3_return_placeholder')}
        />
        <span className="text-xs text-slate-400 block text-right">{returnValue.length} {t('ialab.challenge.m2.step3_chars')}</span>
      </div>

      {functionName && selectedFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Icon name="fa-code" className="text-emerald-500" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_schema_generated')}</h3>
          </div>
          <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-5 overflow-x-auto">
            <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre">
{JSON.stringify(generatedSchema, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}

      <StepFeedback
        completed={completed}
        total={3}
        hints={[t('ialab.challenge.m2.step3_tip_1'), t('ialab.challenge.m2.step3_tip_2')]}
        t={t}
      />

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-700/30">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="fa-lightbulb" className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step3_tips_title')}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step3_tip_1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step3_tip_2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step3_tip_3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatGPTStep3;
