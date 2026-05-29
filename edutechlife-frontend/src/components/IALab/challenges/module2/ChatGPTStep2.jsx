import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import CaseContextBanner from './CaseContextBanner';
import AutoGrowTextarea from '../shared/AutoGrowTextarea';
import StepFeedback from '../shared/StepFeedback';
import ProgressStepper from '../shared/ProgressStepper';

const TONE_OPTIONS = [
  { id: 'professional', icon: 'fa-briefcase', labelKey: 'ialab.challenge.m2.step2_tone_professional' },
  { id: 'casual', icon: 'fa-comment', labelKey: 'ialab.challenge.m2.step2_tone_casual' },
  { id: 'technical', icon: 'fa-microchip', labelKey: 'ialab.challenge.m2.step2_tone_technical' },
  { id: 'creative', icon: 'fa-palette', labelKey: 'ialab.challenge.m2.step2_tone_creative' },
];

const getKnowledgeByCase = (selectedCase) => {
  const base = [
    { id: 'manual', icon: 'fa-file-pdf', labelKey: 'ialab.challenge.m2.step2_knowledge_manual', descKey: 'ialab.challenge.m2.step2_knowledge_manual_desc' },
    { id: 'faq', icon: 'fa-file-alt', labelKey: 'ialab.challenge.m2.step2_knowledge_faq', descKey: 'ialab.challenge.m2.step2_knowledge_faq_desc' },
  ];
  if (selectedCase === 'dev') return [...base, { id: 'schema', icon: 'fa-layer-group', labelKey: 'ialab.challenge.m2.step2_knowledge_schema', descKey: 'ialab.challenge.m2.step2_knowledge_schema_desc' }];
  if (selectedCase === 'marketing') return [...base, { id: 'brand', icon: 'fa-palette', labelKey: 'ialab.challenge.m2.step2_knowledge_brand', descKey: 'ialab.challenge.m2.step2_knowledge_brand_desc' }];
  if (selectedCase === 'support') return [...base, { id: 'crm', icon: 'fa-address-book', labelKey: 'ialab.challenge.m2.step2_knowledge_crm', descKey: 'ialab.challenge.m2.step2_knowledge_crm_desc' }];
  return base;
};

const getCapabilitiesByCase = (selectedCase) => {
  const all = [
    { id: 'web', icon: 'fa-globe', labelKey: 'ialab.challenge.m2.step2_cap_web' },
    { id: 'dalle', icon: 'fa-image', labelKey: 'ialab.challenge.m2.step2_cap_dalle' },
    { id: 'code', icon: 'fa-code', labelKey: 'ialab.challenge.m2.step2_cap_code' },
    { id: 'data', icon: 'fa-calculator', labelKey: 'ialab.challenge.m2.step2_cap_data' },
  ];
  if (selectedCase === 'marketing') return all.filter(c => c.id !== 'code');
  if (selectedCase === 'dev') return all.filter(c => c.id !== 'dalle');
  if (selectedCase === 'support') return all.filter(c => c.id !== 'dalle' && c.id !== 'data');
  return all;
};

const ChatGPTStep2 = ({ exercise, response, onResponseChange, selectedCase }) => {
  const { t } = useTranslation();
  const [gptRole, setGptRole] = useState('');
  const [tone, setTone] = useState('');
  const [rules, setRules] = useState('');
  const [knowledge, setKnowledge] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.gptRole !== undefined) setGptRole(parsed.gptRole);
        if (parsed.tone !== undefined) setTone(parsed.tone);
        if (parsed.rules !== undefined) setRules(parsed.rules);
        if (Array.isArray(parsed.knowledge)) setKnowledge(parsed.knowledge);
        if (Array.isArray(parsed.capabilities)) setCapabilities(parsed.capabilities);
      } catch { /* ignore */ }
    }
  }, [response]);

  const emitChange = (updates) => {
    const next = {
      gptRole: updates.gptRole !== undefined ? updates.gptRole : gptRole,
      tone: updates.tone !== undefined ? updates.tone : tone,
      rules: updates.rules !== undefined ? updates.rules : rules,
      knowledge: updates.knowledge !== undefined ? updates.knowledge : knowledge,
      capabilities: updates.capabilities !== undefined ? updates.capabilities : capabilities,
    };
    onResponseChange(JSON.stringify(next));
  };

  const gptConfig = exercise?.gptConfig || exercise || '';
  const knowledgeFiles = getKnowledgeByCase(selectedCase);
  const capabilitiesList = getCapabilitiesByCase(selectedCase);
  const completed = [gptRole.length >= 3, tone, knowledge.length > 0, capabilities.length > 0].filter(Boolean).length;

  const toneLabel = TONE_OPTIONS.find(o => o.id === tone);
  const previewLines = [];
  if (gptRole) previewLines.push(`Rol: ${gptRole}`);
  if (tone) previewLines.push(`Tono: ${t(toneLabel?.labelKey || '')}`);
  if (rules) previewLines.push(`Reglas:\n${rules}`);
  if (knowledge.length) previewLines.push(`Conocimiento: ${knowledge.map(k => t(knowledgeFiles.find(f => f.id === k)?.labelKey || k)).join(', ')}`);
  if (capabilities.length) previewLines.push(`Capacidades: ${capabilities.map(c => t(capabilitiesList.find(ca => ca.id === c)?.labelKey || c)).join(', ')}`);

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={2} t={t} />

      <div className="bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-2xl p-6 border border-corporate/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-corporate/20 flex-shrink-0">
            <Icon name="fa-cog" className="text-white text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('ialab.challenge.m2.step2_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-700/30">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="fa-bullseye" className="text-amber-500" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_config_context')}</h3>
        </div>
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">{gptConfig}</p>
      </div>

      <CaseContextBanner selectedCase={selectedCase} stepNumber={2} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-petroleum/10 dark:bg-petroleum/20 flex items-center justify-center">
                <Icon name="fa-robot" className="text-petroleum" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_role')}</h3>
            </div>
            <input
              type="text"
              value={gptRole}
              onChange={(e) => { setGptRole(e.target.value); emitChange({ gptRole: e.target.value }); }}
              placeholder={t('ialab.challenge.m2.step2_role_placeholder')}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-corporate focus:ring-2 focus:ring-corporate/20 text-sm"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate/20 flex items-center justify-center">
                <Icon name="fa-comment-dots" className="text-corporate" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_tone')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((opt) => {
                const isActive = tone === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setTone(opt.id); emitChange({ tone: opt.id }); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-corporate/10 border-corporate text-corporate dark:bg-mint/10 dark:border-mint dark:text-mint'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <Icon name={opt.icon} className="text-sm" />
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Icon name="fa-list-check" className="text-emerald-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_rules')}</h3>
            </div>
            <AutoGrowTextarea
              value={rules}
              onChange={(value) => { setRules(value); emitChange({ rules: value }); }}
              placeholder={t('ialab.challenge.m2.step2_rules_placeholder')}
            />
            <span className="text-xs text-slate-400 block text-right">{rules.length} {t('ialab.challenge.m2.step2_chars')}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                <Icon name="fa-folder-open" className="text-violet-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_knowledge')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.challenge.m2.step2_knowledge_hint')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {knowledgeFiles.map((file) => {
                const isSelected = knowledge.includes(file.id);
                return (
                  <button
                    key={file.id}
                    onClick={() => {
                      const next = isSelected ? knowledge.filter(k => k !== file.id) : [...knowledge, file.id];
                      setKnowledge(next);
                      emitChange({ knowledge: next });
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-violet-500/10 border-violet-500 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <Icon name={file.icon} className={`text-sm ${isSelected ? 'text-violet-500' : 'text-slate-400'}`} />
                    <span className="font-medium">{t(file.labelKey)}</span>
                    {isSelected && <Icon name="fa-check" className="text-xs text-violet-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate/20 flex items-center justify-center">
                <Icon name="fa-sliders" className="text-corporate" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_capabilities')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.challenge.m2.step2_capabilities_hint')}</p>
              </div>
            </div>
            <div className="space-y-2">
              {capabilitiesList.map((cap) => {
                const isEnabled = capabilities.includes(cap.id);
                return (
                  <button
                    key={cap.id}
                    onClick={() => {
                      const next = isEnabled ? capabilities.filter(c => c !== cap.id) : [...capabilities, cap.id];
                      setCapabilities(next);
                      emitChange({ capabilities: next });
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                      isEnabled
                        ? 'bg-corporate/5 border-corporate dark:bg-mint/10 dark:border-mint'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-corporate/10 dark:bg-mint/20' : 'bg-slate-100 dark:bg-slate-600'}`}>
                        <Icon name={cap.icon} className={`text-sm ${isEnabled ? 'text-corporate dark:text-mint' : 'text-slate-400 dark:text-slate-500'}`} />
                      </div>
                      <span className={`text-sm font-medium ${isEnabled ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {t(cap.labelKey)}
                      </span>
                    </div>
                    <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isEnabled ? 'bg-corporate dark:bg-mint' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isEnabled ? 'translate-x-5' : 'left-0.5'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon name="fa-eye" className="text-corporate" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('ialab.challenge.m2.step2_preview_title')}</span>
          </div>
          <Icon name={showPreview ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-slate-400 text-xs" />
        </button>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="px-4 pb-4"
          >
            <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-5 font-mono text-xs leading-relaxed">
              {previewLines.length > 0 ? (
                previewLines.map((line, i) => (
                  <div key={i} className="mb-2">
                    {line.startsWith('Reglas:') ? (
                      <>
                        <span className="text-cyan-400">Reglas:</span>
                        <pre className="text-slate-300 mt-1 whitespace-pre-wrap pl-3">{rules}</pre>
                      </>
                    ) : line.startsWith('Conocimiento:') || line.startsWith('Capacidades:') ? (
                      <>
                        <span className="text-cyan-400">{line.split(':')[0]}:</span>
                        <span className="text-emerald-300"> {line.split(':').slice(1).join(':')}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-cyan-400">{line.split(':')[0]}:</span>
                        <span className="text-slate-200"> {line.split(':').slice(1).join(':')}</span>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">{t('ialab.challenge.m2.step2_preview_empty')}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <StepFeedback
        completed={completed}
        total={4}
        hints={[t('ialab.challenge.m2.step2_tip_1'), t('ialab.challenge.m2.step2_tip_2')]}
        t={t}
      />

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-700/30">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="fa-lightbulb" className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step2_tips_title')}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step2_tip_1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step2_tip_2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step2_tip_3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatGPTStep2;
