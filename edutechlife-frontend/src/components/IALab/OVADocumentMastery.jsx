/**
 * OVADocumentMastery — Flujo Completo: Documento → Síntesis → Podcast
 *
 * Cierra el gap pedagógico del Módulo 4 conectando síntesis con audio.
 * Estructura idéntica a OVAPromptLab/OVAEthicsCases/OVAAutomationFlows.
 *
 * Pantallas:
 *   welcome → OVAIntro con learningObjectives
 *   m1      → Framework: El flujo ideal (fuentes → síntesis → podcast)
 *   m2      → Caso 1: Investigador (paper → resumen ejecutivo → podcast divulgativo)
 *   m3      → Caso 2: Educador (syllabus → FAQ → guía de audio para estudiantes)
 *   m4      → Caso 3: Empresa (report anual → síntesis → comunicado en audio)
 *   m5      → Tu flujo (usuario diseña su propio workflow)
 *   m6      → Conclusión
 *
 * Props: onComplete, onClose (patrón OVA estándar)
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/I18nProvider';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';
import { useIALabStore } from '../../store/ialabStore';
import {
  BrainCircuit,
  ChevronLeft,
  ArrowRightCircle,
  Star,
  CheckCircle2,
  Menu,
  Sparkles,
  BookOpen,
  Headphones,
  FileText,
  Users,
  TrendingUp,
  Wand2,
  MousePointer2,
  ArrowRight,
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-petroleum to-corporate rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] text-petroleum">edutech</span>
      <span className="font-[400] text-corporate">life</span>
    </div>
  </div>
);

// M1: Framework del flujo
const DocumentFlowFramework = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);
  const stages = [
    {
      k: 'sources',
      label: t('ova.docmastery.stage_sources'),
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-blue-500',
      desc: t('ova.docmastery.stage_sources_desc'),
      example: t('ova.docmastery.stage_sources_example'),
    },
    {
      k: 'synthesis',
      label: t('ova.docmastery.stage_synthesis'),
      icon: <Wand2 className="w-5 h-5" />,
      color: 'bg-purple-500',
      desc: t('ova.docmastery.stage_synthesis_desc'),
      example: t('ova.docmastery.stage_synthesis_example'),
    },
    {
      k: 'podcast',
      label: t('ova.docmastery.stage_podcast'),
      icon: <Headphones className="w-5 h-5" />,
      color: 'bg-emerald-500',
      desc: t('ova.docmastery.stage_podcast_desc'),
      example: t('ova.docmastery.stage_podcast_example'),
    },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t('ova.docmastery.framework_intro')}
      </p>
      <div className="space-y-3">
        {stages.map((s, idx) => (
          <button
            key={s.k}
            type="button"
            onClick={() => setExpanded(expanded === s.k ? null : s.k)}
            aria-expanded={expanded === s.k}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              expanded === s.k
                ? 'border-corporate bg-blue-50 dark:bg-slate-700 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${s.color} text-white font-bold text-sm`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-[900] text-petroleum dark:text-white text-sm leading-tight">{s.label}</h5>
                {expanded === s.k && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{s.desc}</p>
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono text-slate-700 dark:text-slate-200 italic">
                      "{s.example}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// M2/M3/M4: Caso genérico
const CaseView = ({ caseKey, icon, gradient, onComplete }) => {
  const { t } = useTranslation();
  const [analyzed, setAnalyzed] = useState(false);
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border-2 border-white/40 shadow-md`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {icon}
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t(`ova.docmastery.${caseKey}_title`)}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t(`ova.docmastery.${caseKey}_scenario`)}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('ova.docmastery.the_flow')}
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-petroleum text-white text-[10px] font-black flex items-center justify-center">
                {step}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t(`ova.docmastery.${caseKey}_step${step}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setAnalyzed(true);
          onComplete();
        }}
        disabled={analyzed}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 transition-all"
      >
        {analyzed ? t('ova.docmastery.analyzed') : t('ova.docmastery.analyze_workflow')}
      </button>

      {analyzed && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {t('ova.docmastery.flow_understood')}
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
            {t(`ova.docmastery.${caseKey}_insight`)}
          </p>
        </div>
      )}
    </div>
  );
};
CaseView.propTypes = {
  caseKey: PropTypes.string.isRequired,
  icon: PropTypes.node,
  gradient: PropTypes.string,
  onComplete: PropTypes.func,
};

// M5: Diseña tu flujo
const DesignYourFlow = ({ onCompleted }) => {
  const { t } = useTranslation();
  const [elements, setElements] = useState([]);
  const elementOptions = [
    { k: 'pdf', label: t('ova.docmastery.elem_pdf'), icon: '📄' },
    { k: 'website', label: t('ova.docmastery.elem_website'), icon: '🌐' },
    { k: 'video', label: t('ova.docmastery.elem_video'), icon: '🎥' },
    { k: 'notebook', label: t('ova.docmastery.elem_notebook'), icon: '📓' },
  ];
  const toggleElement = (k) => {
    setElements((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };
  const handleSubmit = () => {
    try {
      const key = 'ialab_document_flows';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ elements, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(list.slice(-10)));
    } catch { /* silent */ }
    onCompleted();
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 border-2 border-white/40 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            🏗️
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t('ova.docmastery.design_title')}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t('ova.docmastery.design_prompt')}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
          {t('ova.docmastery.select_sources')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {elementOptions.map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => toggleElement(opt.k)}
              aria-pressed={elements.includes(opt.k)}
              className={`p-2.5 rounded-lg border-2 transition-all text-xs font-bold text-center ${
                elements.includes(opt.k)
                  ? 'border-corporate bg-blue-50 dark:bg-slate-700 text-petroleum dark:text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="text-lg mb-0.5">{opt.icon}</div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {elements.length > 0 && (
        <>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
              {t('ova.docmastery.your_flow')}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {elements.map((e, i) => (
                <React.Fragment key={e}>
                  <span className="px-2.5 py-1 rounded-full bg-petroleum text-white text-xs font-black">
                    {elementOptions.find((x) => x.k === e)?.label}
                  </span>
                  {i < elements.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                </React.Fragment>
              ))}
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                🎧 {t('ova.docmastery.output_podcast')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all"
          >
            {t('ova.docmastery.save_flow')}
          </button>
        </>
      )}
    </div>
  );
};
DesignYourFlow.propTypes = { onCompleted: PropTypes.func };

// M6: Conclusión
const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <Headphones className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black text-petroleum dark:text-white mb-2 uppercase tracking-tighter">
        {t('ova.docmastery.conclusion_title')}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-4 leading-relaxed">
        {t('ova.docmastery.conclusion_desc')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        {t('ova.docmastery.conclusion_hint')}
      </p>
    </div>
  );
};

function OVADocumentMastery({ onComplete, onClose }) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoCompletedRef = useRef(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  const curIdx = nav.indexOf(screen);
  const addXp = useIALabStore((s) => s.addXp);

  useEffect(() => {
    if (screen === 'm6' && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      if (addXp) addXp(25);
      onComplete?.();
    }
  }, [screen, onComplete, addXp]);

  const markCompleted = (id) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screen === 'welcome') {
      setScreen('m1');
      return;
    }
    markCompleted(screen);
    const next = curIdx + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === 'm6';

  const renderContent = () => {
    switch (screen) {
      case 'welcome':
        return (
          <OVAIntro
            icon="fa-book"
            badge={t('ova.docmastery.badge')}
            title={t('ova.docmastery.welcome_title')}
            description={t('ova.docmastery.welcome_desc')}
            audioText={t('ova.docmastery.welcome_audio')}
            onStart={nextScreen}
            startLabel={t('ova.docmastery.start')}
            objectives={[
              t('ova.docmastery.learning_obj_1'),
              t('ova.docmastery.learning_obj_2'),
              t('ova.docmastery.learning_obj_3'),
              t('ova.docmastery.learning_obj_4'),
            ]}
          />
        );
      case 'm1':
        return (
          <>
            <DocumentFlowFramework />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m1')} />
            </div>
          </>
        );
      case 'm2':
        return (
          <>
            <CaseView
              caseKey="case_researcher"
              icon={<BookOpen className="w-5 h-5" />}
              gradient="from-blue-500 to-cyan-600"
              onComplete={() => markCompleted('m2')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m2')} />
            </div>
          </>
        );
      case 'm3':
        return (
          <>
            <CaseView
              caseKey="case_educator"
              icon={<Users className="w-5 h-5" />}
              gradient="from-purple-500 to-pink-600"
              onComplete={() => markCompleted('m3')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m3')} />
            </div>
          </>
        );
      case 'm4':
        return (
          <>
            <CaseView
              caseKey="case_enterprise"
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="from-amber-500 to-orange-600"
              onComplete={() => markCompleted('m4')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m4')} />
            </div>
          </>
        );
      case 'm5':
        return (
          <>
            <DesignYourFlow onCompleted={() => markCompleted('m5')} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m5')} />
            </div>
          </>
        );
      case 'm6':
        return (
          <>
            <Conclusion />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.docmastery.voice_m6')} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          {screen !== 'welcome' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-corporate/20">
              <Star className="text-corporate fill-current" size={14} />
              <span className="font-bold text-petroleum text-xs">
                {nav.filter((id) => completed.includes(id)).length}/{nav.length - 1}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t('ova.docmastery.menu_title')}
            className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
          >
            <Menu className="w-5 h-5 text-petroleum" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-corporate font-[900] text-[10px] tracking-[0.3em] uppercase">
                <Sparkles className="w-3 h-3" /> {t('ova.docmastery.section_label')}
              </div>
              <h1 className="text-lg md:text-xl font-[900] text-petroleum dark:text-white tracking-tighter leading-tight">
                {t(`ova.docmastery.screen_${screen}`)}
              </h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">{renderContent()}</div>
        </div>
      </main>

      {screen !== 'welcome' && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button
              onClick={() => {
                if (curIdx > 1) setScreen(nav[curIdx - 1]);
                stopSpeech();
              }}
              aria-label={t('ova.docmastery.nav_prev')}
              className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-petroleum dark:hover:text-corporate rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
              disabled={curIdx <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5" role="group" aria-label={t('ova.docmastery.menu_title')}>
              {nav.slice(1).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i + 1 === curIdx ? 'w-8 bg-petroleum' : completed.includes(nav[i + 1]) ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={isLastScreen ? () => { onClose?.(); } : nextScreen}
              className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${
                isLastScreen ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-petroleum to-corporate text-white'
              }`}
            >
              {isLastScreen ? t('ova.docmastery.nav_finish') : t('ova.docmastery.nav_next')} <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t('ova.docmastery.footer')}</p>
        </div>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('ova.docmastery.menu_title')}
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{t('ova.docmastery.menu_title')}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-petroleum">
                <Star className="w-3 h-3 text-corporate fill-current" />
                {completed.filter((id) => id.startsWith('m')).length}/{nav.filter((id) => id.startsWith('m')).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button
                    key={id}
                    onClick={() => goToScreen(id)}
                    className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${
                      isCurrent ? 'bg-petroleum text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                          isCompleted ? 'bg-corporate text-white' : isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {idx}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-petroleum dark:text-corporate' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? t('ova.docmastery.menu_welcome') : t(`ova.docmastery.screen_${id}`)}
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'w-full bg-corporate' : isCurrent ? 'w-1/3 bg-petroleum' : 'w-0'}`} />
                        </div>
                      </div>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-corporate shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

OVADocumentMastery.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default OVADocumentMastery;
