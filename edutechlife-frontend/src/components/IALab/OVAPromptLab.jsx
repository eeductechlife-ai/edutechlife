/**
 * OVAPromptLab — Laboratorio Interactivo de Prompt Engineering
 *
 * Estructura idéntica a OVAIntroPrompt (welcome + screens + nav + menu + voice + auto-complete)
 * pero enfocado en PRÁCTICA con el sandbox real de DeepSeek.
 *
 * Pantallas:
 *   welcome → OVAIntro con learningObjectives
 *   m1      → Anatomía del prompt (rol + contexto + tarea + formato)
 *   m2      → Técnicas (zero-shot, few-shot, chain-of-thought, role-play)
 *   m3      → Laboratorio (PromptSandbox real, ejecuta contra DeepSeek)
 *   m4      → Reto (usuario debe cumplir un objetivo específico)
 *   m5      → Conclusión
 *
 * Props: onComplete, onClose (patrón OVA estándar)
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/I18nProvider';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';
import PromptSandbox from './PromptSandbox';
import { useIALabStore } from '../../store/ialabStore';
import {
  BrainCircuit,
  ChevronRight,
  ChevronLeft,
  ArrowRightCircle,
  Star,
  CheckCircle2,
  Menu,
  MousePointer2,
  Sparkles,
  User,
  Layers,
  Target,
  MessageSquare,
  FlaskConical,
  Trophy,
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] text-[var(--theme-emphasis)]">edutech</span>
      <span className="font-[400] text-[var(--theme-primary)]">life</span>
    </div>
  </div>
);

// M1: Anatomía del prompt (interactivo, click en cada parte)
const PromptAnatomy = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const parts = [
    {
      k: 'rol',
      label: t('ova.promptlab.part_rol'),
      icon: <User className="w-5 h-5" />,
      color: 'bg-[var(--theme-emphasis)]',
      desc: t('ova.promptlab.part_rol_desc'),
      example: t('ova.promptlab.part_rol_example'),
    },
    {
      k: 'ctx',
      label: t('ova.promptlab.part_ctx'),
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-[var(--theme-primary)]',
      desc: t('ova.promptlab.part_ctx_desc'),
      example: t('ova.promptlab.part_ctx_example'),
    },
    {
      k: 'tarea',
      label: t('ova.promptlab.part_tarea'),
      icon: <Target className="w-5 h-5" />,
      color: 'bg-[#4361EE]',
      desc: t('ova.promptlab.part_tarea_desc'),
      example: t('ova.promptlab.part_tarea_example'),
    },
    {
      k: 'fmt',
      label: t('ova.promptlab.part_fmt'),
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-[#F72585]',
      desc: t('ova.promptlab.part_fmt_desc'),
      example: t('ova.promptlab.part_fmt_example'),
    },
  ];

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t('ova.promptlab.anatomy_intro')}
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {parts.map((p) => (
          <button
            key={p.k}
            onClick={() => setSelected(selected?.k === p.k ? null : p)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition-all ${p.color} ${
              selected?.k === p.k ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-[var(--theme-primary)] scale-110' : 'opacity-80 hover:opacity-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {parts.map((p) => (
          <button
            key={p.k}
            onClick={() => setSelected(selected?.k === p.k ? null : p)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selected?.k === p.k
                ? 'border-[var(--theme-primary)] bg-blue-50 dark:bg-slate-700 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${p.color} text-white rounded-lg`}>{p.icon}</div>
              <div>
                <h5 className="font-[900] text-[var(--theme-emphasis)] text-xs uppercase leading-none mb-1">{p.label}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-4 bg-[var(--theme-emphasis)] text-white rounded-xl">
          <span className="text-[var(--theme-primary)] font-black uppercase text-xs mb-1 block">{t('ova.promptlab.anatomy_example_label')}: {selected.label}</span>
          <p className="text-sm text-white italic">{selected.example}</p>
        </div>
      )}
    </div>
  );
};

// M2: Técnicas de prompting (cards seleccionables)
const PromptTechniques = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const techniques = [
    {
      k: 'zeroshot',
      label: t('ova.promptlab.tech_zeroshot'),
      color: 'bg-[var(--theme-emphasis)]',
      desc: t('ova.promptlab.tech_zeroshot_desc'),
      example: t('ova.promptlab.tech_zeroshot_example'),
    },
    {
      k: 'fewshot',
      label: t('ova.promptlab.tech_fewshot'),
      color: 'bg-[var(--theme-primary)]',
      desc: t('ova.promptlab.tech_fewshot_desc'),
      example: t('ova.promptlab.tech_fewshot_example'),
    },
    {
      k: 'cot',
      label: t('ova.promptlab.tech_cot'),
      color: 'bg-[#4361EE]',
      desc: t('ova.promptlab.tech_cot_desc'),
      example: t('ova.promptlab.tech_cot_example'),
    },
    {
      k: 'role',
      label: t('ova.promptlab.tech_role'),
      color: 'bg-[#F72585]',
      desc: t('ova.promptlab.tech_role_desc'),
      example: t('ova.promptlab.tech_role_example'),
    },
  ];

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t('ova.promptlab.tech_intro')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {techniques.map((tech) => (
          <button
            key={tech.k}
            onClick={() => setActive(active === tech.k ? null : tech.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              active === tech.k
                ? 'border-[var(--theme-primary)] bg-blue-50 dark:bg-slate-700 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
            }`}
          >
            <div className={`inline-block px-2.5 py-1 mb-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${tech.color}`}>
              {tech.label}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{tech.desc}</p>
          </button>
        ))}
      </div>
      {active && (
        <div className="p-4 bg-[var(--theme-emphasis)] text-white rounded-xl">
          <span className="text-[var(--theme-primary)] font-black uppercase text-xs mb-1 block">{t('ova.promptlab.tech_example_label')}</span>
          <p className="text-sm text-white font-mono italic">{techniques.find((tech) => tech.k === active)?.example}</p>
        </div>
      )}
      {!active && (
        <div className="text-center py-4 opacity-30 space-y-1">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">{t('ova.promptlab.tech_hint')}</p>
        </div>
      )}
    </div>
  );
};

// M3: Laboratorio real (PromptSandbox integrado)
const LabScreen = ({ onCompleted }) => {
  const { t } = useTranslation();
  const SAMPLES = [
    {
      label: 'Zero-shot básico',
      system: '',
      user: 'Explica qué es el aprendizaje por refuerzo en una frase simple.',
    },
    {
      label: 'Few-shot',
      system: 'Clasificas textos en positivo, negativo o neutro.',
      user: 'Ejemplo 1: "Amo este producto" → positivo\nEjemplo 2: "No funciona" → negativo\nEjemplo 3: "Es normal" → neutro\nClasifica: "El envío llegó a tiempo pero la caja venía rota"',
    },
    {
      label: 'Chain-of-thought',
      system: 'Eres un solucionador metódico. Piensas paso a paso.',
      user: 'Pensemos paso a paso: si un modelo de lenguaje se entrena solo con textos de 2020, ¿por qué no puede responder sobre eventos de 2025?',
    },
    {
      label: 'Role-play',
      system: 'Eres una editora de revista científica. Revisas textos con rigor pero con empatía.',
      user: 'Da 3 sugerencias para mejorar este texto: "La IA es muy buena y ayuda mucho a las personas."',
    },
  ];

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <PromptSandbox
        title={t('ova.promptlab.lab_title')}
        samplePrompts={SAMPLES}
        itemId="ova-prompt-lab-sandbox"
        onComplete={onCompleted}
      />
    </div>
  );
};
LabScreen.propTypes = { onCompleted: PropTypes.func };

// M4: Reto (usuario debe conseguir un output específico)
const ChallengeScreen = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-[var(--theme-emphasis)] dark:text-white font-[900] text-lg tracking-tight lowercase">{t('ova.promptlab.challenge_title')}</h4>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{t('ova.promptlab.challenge_goal')}</p>
      </div>

      <PromptSandbox
        title={t('ova.promptlab.challenge_zone')}
        samplePrompts={[
          {
            label: 'JSON',
            system: 'Devuelves siempre JSON válido, sin markdown, sin comentarios.',
            user: 'Dame un JSON con 3 países latinoamericanos y su capital. Formato: [{pais, capital}]. Nada más.',
          },
        ]}
        itemId="ova-prompt-lab-challenge"
        onComplete={() => setClaimed(true)}
      />

      {claimed && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {t('ova.promptlab.challenge_success')}
          </p>
          <button
            type="button"
            onClick={onSuccess}
            className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
          >
            {t('ova.promptlab.challenge_mark')}
          </button>
        </div>
      )}
    </div>
  );
};
ChallengeScreen.propTypes = { onSuccess: PropTypes.func };

// M5: Conclusión
const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black text-[var(--theme-emphasis)] dark:text-white mb-2 uppercase tracking-tighter">
        {t('ova.promptlab.conclusion_title')}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-4 leading-relaxed">
        {t('ova.promptlab.conclusion_desc')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        {t('ova.promptlab.conclusion_hint')}
      </p>
    </div>
  );
};

const SCREEN_ICONS = {
  m1: <User className="w-4 h-4" />,
  m2: <Sparkles className="w-4 h-4" />,
  m3: <FlaskConical className="w-4 h-4" />,
  m4: <Trophy className="w-4 h-4" />,
  m5: <CheckCircle2 className="w-4 h-4" />,
};

function OVAPromptLab({ onComplete, onClose }) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoCompletedRef = useRef(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5'];
  const curIdx = nav.indexOf(screen);
  const addXp = useIALabStore((s) => s.addXp);

  useEffect(() => {
    if (screen === 'm5' && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      if (addXp) addXp(25); // recompensa por completar el OVA
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

  const isLastScreen = screen === 'm5';

  const renderContent = () => {
    switch (screen) {
      case 'welcome':
        return (
          <OVAIntro
            icon="fa-flask"
            badge={t('ova.promptlab.badge')}
            title={t('ova.promptlab.welcome_title')}
            description={t('ova.promptlab.welcome_desc')}
            audioText={t('ova.promptlab.welcome_audio')}
            onStart={nextScreen}
            startLabel={t('ova.promptlab.start')}
            objectives={[
              t('ova.promptlab.learning_obj_1'),
              t('ova.promptlab.learning_obj_2'),
              t('ova.promptlab.learning_obj_3'),
              t('ova.promptlab.learning_obj_4'),
            ]}
          />
        );
      case 'm1':
        return (
          <>
            <PromptAnatomy />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.promptlab.voice_m1')} />
            </div>
          </>
        );
      case 'm2':
        return (
          <>
            <PromptTechniques />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.promptlab.voice_m2')} />
            </div>
          </>
        );
      case 'm3':
        return (
          <>
            <LabScreen onCompleted={() => markCompleted('m3')} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.promptlab.voice_m3')} />
            </div>
          </>
        );
      case 'm4':
        return (
          <>
            <ChallengeScreen onSuccess={() => markCompleted('m4')} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.promptlab.voice_m4')} />
            </div>
          </>
        );
      case 'm5':
        return (
          <>
            <Conclusion />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t('ova.promptlab.voice_m5')} />
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
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[var(--theme-primary)]/20">
              <Star className="text-[var(--theme-primary)] fill-current" size={14} />
              <span className="font-bold text-[var(--theme-emphasis)] text-xs">
                {nav.filter((id) => completed.includes(id)).length}/{nav.length - 1}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú de navegación"
            className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
          >
            <Menu className="w-5 h-5 text-[var(--theme-emphasis)]" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary)] font-[900] text-[10px] tracking-[0.3em] uppercase">
                <Sparkles className="w-3 h-3" /> {t('ova.promptlab.section_label')}
              </div>
              <h1 className="text-lg md:text-xl font-[900] text-[var(--theme-emphasis)] dark:text-white tracking-tighter leading-tight">
                {t(`ova.promptlab.screen_${screen}`)}
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
              aria-label={t('ova.promptlab.nav_prev')}
              className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[var(--theme-emphasis)] dark:hover:text-[var(--theme-primary)] rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
              disabled={curIdx <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5" role="group" aria-label={t('ova.promptlab.menu_title')}>
              {nav.slice(1).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i + 1 === curIdx ? 'w-8 bg-[var(--theme-emphasis)]' : completed.includes(nav[i + 1]) ? 'w-2 bg-[var(--theme-primary)]' : 'w-2 bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={
                isLastScreen
                  ? () => {
                      onClose?.();
                    }
                  : nextScreen
              }
              className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${
                isLastScreen ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white'
              }`}
            >
              {isLastScreen ? t('ova.promptlab.nav_finish') : t('ova.promptlab.nav_next')} <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t('ova.promptlab.footer')}</p>
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
            aria-label={t('ova.promptlab.menu_title')}
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{t('ova.promptlab.menu_title')}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--theme-emphasis)]">
                <Star className="w-3 h-3 text-[var(--theme-primary)] fill-current" />
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
                      isCurrent ? 'bg-[var(--theme-emphasis)] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                          isCompleted ? 'bg-[var(--theme-primary)] text-white' : isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {stepNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? t('ova.promptlab.menu_welcome') : t(`ova.promptlab.screen_${id}`)}
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'w-full bg-[var(--theme-primary)]' : isCurrent ? 'w-1/3 bg-[var(--theme-emphasis)]' : 'w-0'}`} />
                        </div>
                      </div>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />}
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

OVAPromptLab.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default OVAPromptLab;
