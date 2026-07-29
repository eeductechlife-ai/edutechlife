/**
 * OVAEthicsCases — Casos Prácticos de Ética en IA
 *
 * Complementa OVAEtica (dilemas abiertos) con casos reales y un framework de análisis.
 * Estructura idéntica a OVAPromptLab/OVAIntroPrompt (welcome + screens + nav + menu + voice).
 *
 * Pantallas:
 *   welcome → OVAIntro con learningObjectives
 *   m1      → Framework de análisis ético (5 preguntas guía)
 *   m2      → Caso 1: IA en contratación laboral (sesgo)
 *   m3      → Caso 2: IA en diagnóstico médico (responsabilidad)
 *   m4      → Caso 3: IA generativa y derechos de autor
 *   m5      → Tu decisión (elige postura en un dilema propio)
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
  Shield,
  Scale,
  HeartPulse,
  BookLock,
  Users,
  Compass,
  AlertTriangle,
  MousePointer2,
  Gavel,
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

// M1: Framework de análisis ético (5 preguntas guía)
const EthicalFramework = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);
  const questions = [
    {
      k: 'harm',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-rose-500',
      label: t('ova.ethicscases.q_harm'),
      desc: t('ova.ethicscases.q_harm_desc'),
    },
    {
      k: 'benefit',
      icon: <HeartPulse className="w-5 h-5" />,
      color: 'bg-emerald-500',
      label: t('ova.ethicscases.q_benefit'),
      desc: t('ova.ethicscases.q_benefit_desc'),
    },
    {
      k: 'fairness',
      icon: <Scale className="w-5 h-5" />,
      color: 'bg-corporate',
      label: t('ova.ethicscases.q_fairness'),
      desc: t('ova.ethicscases.q_fairness_desc'),
    },
    {
      k: 'consent',
      icon: <BookLock className="w-5 h-5" />,
      color: 'bg-[#4361EE]',
      label: t('ova.ethicscases.q_consent'),
      desc: t('ova.ethicscases.q_consent_desc'),
    },
    {
      k: 'accountability',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-[#F72585]',
      label: t('ova.ethicscases.q_accountability'),
      desc: t('ova.ethicscases.q_accountability_desc'),
    },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t('ova.ethicscases.framework_intro')}
      </p>
      <div className="space-y-2">
        {questions.map((q) => (
          <button
            key={q.k}
            type="button"
            onClick={() => setExpanded(expanded === q.k ? null : q.k)}
            aria-expanded={expanded === q.k}
            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
              expanded === q.k
                ? 'border-corporate bg-blue-50 dark:bg-slate-700 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 ${q.color} text-white rounded-lg shrink-0`}>{q.icon}</div>
              <div className="flex-1 min-w-0">
                <h5 className="font-[900] text-petroleum dark:text-white text-sm leading-tight">{q.label}</h5>
                {expanded === q.k && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">{q.desc}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// M2/M3/M4: Vista de caso genérica (reutilizable)
const CaseView = ({ caseKey, icon, color, onDecide }) => {
  const { t } = useTranslation();
  const [choice, setChoice] = useState(null);
  const options = [
    { k: 'a', text: t(`ova.ethicscases.${caseKey}_opt_a`) },
    { k: 'b', text: t(`ova.ethicscases.${caseKey}_opt_b`) },
    { k: 'c', text: t(`ova.ethicscases.${caseKey}_opt_c`) },
  ];
  const handleChoice = (k) => {
    setChoice(k);
    if (onDecide) onDecide(k);
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${color} border-2 border-white/40 shadow-md`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t(`ova.ethicscases.${caseKey}_title`)}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t(`ova.ethicscases.${caseKey}_scenario`)}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
          {t('ova.ethicscases.what_would_you_do')}
        </p>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => handleChoice(opt.k)}
              aria-pressed={choice === opt.k}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                choice === opt.k
                  ? 'border-corporate bg-blue-50 dark:bg-slate-700 text-petroleum dark:text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                  choice === opt.k ? 'bg-corporate text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>{opt.k.toUpperCase()}</span>
                <span>{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {choice && (
        <div className="p-4 rounded-xl bg-petroleum text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-corporate" />
            <span className="text-corporate font-black uppercase text-[10px] tracking-[0.2em]">
              {t('ova.ethicscases.analysis')}
            </span>
          </div>
          <p className="text-xs text-white leading-relaxed">
            {t(`ova.ethicscases.${caseKey}_feedback_${choice}`)}
          </p>
        </div>
      )}
    </div>
  );
};
CaseView.propTypes = {
  caseKey: PropTypes.string.isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  onDecide: PropTypes.func,
};

// M5: Decisión propia (reflexión escrita)
const YourDecision = ({ onCompleted }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length < 40) return;
    setSubmitted(true);
    try {
      const key = 'ialab_ethics_reflections';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ text: text.slice(0, 2000), ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(list.slice(-20)));
    } catch { /* silent */ }
    if (onCompleted) onCompleted();
  };

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-white/40 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t('ova.ethicscases.decision_title')}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t('ova.ethicscases.decision_prompt')}
        </p>
      </div>

      <div>
        <label htmlFor="ethics-reflection" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
          {t('ova.ethicscases.decision_label')}
        </label>
        <textarea
          id="ethics-reflection"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          rows={6}
          placeholder={t('ova.ethicscases.decision_placeholder')}
          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-corporate focus:border-transparent resize-y text-petroleum dark:text-white disabled:opacity-70"
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-slate-400">
            {text.length} / 40 {t('ova.ethicscases.min_chars')}
          </span>
          {!submitted && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={text.trim().length < 40}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {t('ova.ethicscases.decision_submit')}
            </button>
          )}
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {t('ova.ethicscases.decision_saved')}
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
            {t('ova.ethicscases.decision_success')}
          </p>
        </div>
      )}
    </div>
  );
};
YourDecision.propTypes = { onCompleted: PropTypes.func };

// M6: Conclusión
const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <Gavel className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black text-petroleum dark:text-white mb-2 uppercase tracking-tighter">
        {t('ova.ethicscases.conclusion_title')}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-4 leading-relaxed">
        {t('ova.ethicscases.conclusion_desc')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        {t('ova.ethicscases.conclusion_hint')}
      </p>
    </div>
  );
};

const SCREEN_ICONS = {
  m1: <Scale className="w-4 h-4" />,
  m2: <Users className="w-4 h-4" />,
  m3: <HeartPulse className="w-4 h-4" />,
  m4: <BookLock className="w-4 h-4" />,
  m5: <Compass className="w-4 h-4" />,
  m6: <Gavel className="w-4 h-4" />,
};

function OVAEthicsCases({ onComplete, onClose }) {
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
            icon="fa-scale-balanced"
            badge={t('ova.ethicscases.badge')}
            title={t('ova.ethicscases.welcome_title')}
            description={t('ova.ethicscases.welcome_desc')}
            audioText={t('ova.ethicscases.welcome_audio')}
            onStart={nextScreen}
            startLabel={t('ova.ethicscases.start')}
            objectives={[
              t('ova.ethicscases.learning_obj_1'),
              t('ova.ethicscases.learning_obj_2'),
              t('ova.ethicscases.learning_obj_3'),
              t('ova.ethicscases.learning_obj_4'),
            ]}
          />
        );
      case 'm1':
        return (
          <>
            <EthicalFramework />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m1')} />
            </div>
          </>
        );
      case 'm2':
        return (
          <>
            <CaseView
              caseKey="case_hiring"
              icon={<Users className="w-5 h-5 text-white" />}
              color="from-rose-500 to-pink-600"
              onDecide={() => markCompleted('m2')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m2')} />
            </div>
          </>
        );
      case 'm3':
        return (
          <>
            <CaseView
              caseKey="case_health"
              icon={<HeartPulse className="w-5 h-5 text-white" />}
              color="from-emerald-500 to-teal-600"
              onDecide={() => markCompleted('m3')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m3')} />
            </div>
          </>
        );
      case 'm4':
        return (
          <>
            <CaseView
              caseKey="case_copyright"
              icon={<BookLock className="w-5 h-5 text-white" />}
              color="from-amber-500 to-orange-600"
              onDecide={() => markCompleted('m4')}
            />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m4')} />
            </div>
          </>
        );
      case 'm5':
        return (
          <>
            <YourDecision onCompleted={() => markCompleted('m5')} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m5')} />
            </div>
          </>
        );
      case 'm6':
        return (
          <>
            <Conclusion />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.ethicscases.voice_m6')} />
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
            aria-label={t('ova.ethicscases.menu_title')}
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
                <Sparkles className="w-3 h-3" /> {t('ova.ethicscases.section_label')}
              </div>
              <h1 className="text-lg md:text-xl font-[900] text-petroleum dark:text-white tracking-tighter leading-tight">
                {t(`ova.ethicscases.screen_${screen}`)}
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
              aria-label={t('ova.ethicscases.nav_prev')}
              className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-petroleum dark:hover:text-corporate rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
              disabled={curIdx <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5" role="group" aria-label={t('ova.ethicscases.menu_title')}>
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
              {isLastScreen ? t('ova.ethicscases.nav_finish') : t('ova.ethicscases.nav_next')} <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t('ova.ethicscases.footer')}</p>
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
            aria-label={t('ova.ethicscases.menu_title')}
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{t('ova.ethicscases.menu_title')}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-petroleum">
                <Star className="w-3 h-3 text-corporate fill-current" />
                {completed.filter((id) => id.startsWith('m')).length}/{nav.filter((id) => id.startsWith('m')).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = idx;
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
                        {stepNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-petroleum dark:text-corporate' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? t('ova.ethicscases.menu_welcome') : t(`ova.ethicscases.screen_${id}`)}
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

OVAEthicsCases.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default OVAEthicsCases;
