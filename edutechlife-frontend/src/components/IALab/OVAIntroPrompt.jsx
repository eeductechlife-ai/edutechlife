import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/I18nProvider';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';
import {
  BrainCircuit, ChevronRight, ChevronLeft,
  ArrowRightCircle, Star, Award, Sparkles, BookOpen, CheckCircle2,
  Menu, X, MousePointer2, AlertTriangle, Zap, Info, Search, Clock,
  Lightbulb, Target, Globe, Layers, FileText, Settings,
  Cpu, Rocket, HelpCircle, User, MapPin, ZapOff, File, Ban, Brain, RefreshCcw, Users,
  Hash, Sliders, Bug, ArrowLeftRight, XCircle
} from 'lucide-react';
import { stopSpeech, speakTextConversational } from '../../utils/speech';

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

const ImportanceQuality = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.importance_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-corporate/5 to-white rounded-[2rem] border-2 border-corporate/20 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-corporate/10 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-corporate" /></div>
          <h4 className="text-petroleum font-[900] text-xl tracking-tighter lowercase">{t('ova.introprompt.importance_title')}</h4>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
      </div>
    </div>
  );
};

const TypesPrompts = () => {
  const { t } = useTranslation();
  const [sel, setSel] = useState(null);
  const types = [
    { k: 'abierto', i: <Layers className="w-5 h-5" /> },
    { k: 'cerrado', i: <Target className="w-5 h-5" /> },
    { k: 'instructivo', i: <Zap className="w-5 h-5" /> },
    { k: 'creativo', i: <Sparkles className="w-5 h-5" /> },
    { k: 'refinamiento', i: <Globe className="w-5 h-5" /> }
  ];
  const labels = { abierto: 'Prompt Abierto', cerrado: 'Prompt Cerrado', instructivo: 'Prompt Instructivo', creativo: 'Prompt Creativo', refinamiento: 'Prompt de Refinamiento' };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {types.map(tp => (
          <button key={tp.k} onClick={() => setSel(tp)} className={`p-4 rounded-xl border-2 transition-all text-left ${sel?.k === tp.k ? 'border-corporate bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-700 text-petroleum rounded-lg">{tp.i}</div>
              <div>
                <h5 className="font-[900] text-petroleum text-xs uppercase leading-none mb-1">{labels[tp.k]}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{t(`ova.introprompt.types_desc_${tp.k}`)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div className="p-4 bg-petroleum text-white rounded-xl">
          <p className="text-xs text-white font-medium"><span className="text-corporate font-black uppercase text-xs">{labels[sel.k]}:</span> {t(`ova.introprompt.types_desc_${sel.k}`)}</p>
        </div>
      )}
    </div>
  );
};

const UniversalTemplate = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.universal_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-corporate/5 to-white rounded-[2rem] border-2 border-corporate/20 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-corporate/10 rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-corporate" /></div>
          <h4 className="text-petroleum font-[900] text-xl tracking-tighter lowercase">{t('ova.introprompt.universal_title')}</h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-petroleum text-white rounded-full text-[10px] font-black uppercase tracking-wider">Rol</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-corporate text-white rounded-full text-[10px] font-black uppercase tracking-wider">Contexto</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#4361EE] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Tarea</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#F72585] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Restricciones</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
      </div>
    </div>
  );
};

const HowAIThinks = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const [temp, setTemp] = useState(0.7);
  const concepts = [
    { k: 'tokens', icon: <Hash className="w-5 h-5" />, color: 'bg-petroleum' },
    { k: 'context', icon: <Globe className="w-5 h-5" />, color: 'bg-corporate' },
    { k: 'temp', icon: <Sliders className="w-5 h-5" />, color: 'bg-[#4361EE]' }
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.introprompt.howit_desc')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {concepts.map(c => (
          <button key={c.k} onClick={() => setActive(active === c.k ? null : c.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${active === c.k ? 'border-corporate bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className={`w-10 h-10 ${c.color} text-white rounded-lg flex items-center justify-center mb-2 shadow-sm`}>{c.icon}</div>
            <h5 className="font-[900] text-petroleum text-xs uppercase tracking-wider">{t(`ova.introprompt.howit_${c.k}_title`)}</h5>
          </button>
        ))}
      </div>
      {active ? (
        <div className="p-4 bg-petroleum text-white rounded-xl">
          <h5 className="text-corporate font-[900] text-xs uppercase tracking-[0.2em] mb-2">{t(`ova.introprompt.howit_${active}_title`)}</h5>
          <p className="text-sm text-white leading-relaxed font-medium">{t(`ova.introprompt.howit_${active}_desc`)}</p>
          {active === 'temp' && (
            <div className="mt-4 p-3 bg-white/10 rounded-xl space-y-2">
              <div className="flex justify-between text-[10px] font-black text-white/70 uppercase tracking-wider">
                <span>{t('ova.introprompt.howit_temp_precise')} (0.0)</span>
                <span className="text-corporate">{temp.toFixed(1)}</span>
                <span>{t('ova.introprompt.howit_temp_creative')} (1.0)</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={temp}
                onChange={e => setTemp(parseFloat(e.target.value))}
                className="w-full accent-corporate h-2 rounded-full appearance-none bg-white/20 cursor-pointer" />
              <p className="text-xs text-white/80 italic font-medium">{t('ova.introprompt.howit_temp_example')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 opacity-30 space-y-2">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">{t('ova.introprompt.howit_select')}</p>
        </div>
      )}
    </div>
  );
};

const DetectAndFix = () => {
  const { t } = useTranslation();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFix, setShowFix] = useState(false);
  const [correct, setCorrect] = useState(false);
  const R = [
    { prompt: t('ova.introprompt.detect_r1_prompt') || '"Explícame la fotosíntesis"', errors: ['context', 'format', 'task'], correctIdx: 0 },
    { prompt: t('ova.introprompt.detect_r2_prompt') || '"Eres tutor de matemáticas. Explica fracciones a un niño de 10 años."', errors: ['context', 'format', 'task'], correctIdx: 1 },
    { prompt: t('ova.introprompt.detect_r3_prompt') || '"Eres experto. Dame lección del sistema solar con tabla, 5 preguntas y resumen."', errors: ['context', 'format', 'task'], correctIdx: 2 },
  ];
  const opts = [
    t('ova.introprompt.detect_opt_context'),
    t('ova.introprompt.detect_opt_format'),
    t('ova.introprompt.detect_opt_task'),
  ];
  const fixes = [
    t('ova.introprompt.detect_fix_1'),
    t('ova.introprompt.detect_fix_2'),
    t('ova.introprompt.detect_fix_3'),
  ];
  const handleSelect = (idx) => {
    if (showFix) return;
    setSelected(idx);
    const isCorrect = idx === R[round].correctIdx;
    setCorrect(isCorrect);
    if (isCorrect) setShowFix(true);
  };
  const nextRound = () => {
    if (round < 2) { setRound(round + 1); setSelected(null); setShowFix(false); setCorrect(false); }
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.introprompt.detect_desc')}</p>
      <div className="flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4 text-corporate" />
        <span className="text-[10px] font-black text-petroleum uppercase tracking-wider">{t('ova.introprompt.detect_round')} {round + 1} {t('ova.introprompt.detect_of')} 3</span>
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-xl">
        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider mb-2">{t('ova.introprompt.detect_prompt_label')}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 font-mono font-medium">{R[round].prompt}</p>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t('ova.introprompt.detect_whats_wrong')}</p>
        {opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = showFix && i === R[round].correctIdx;
          const isWrong = isSelected && !correct;
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full p-3 rounded-xl border-2 text-left text-xs font-medium transition-all flex items-center justify-between gap-2 ${isCorrectOpt ? 'bg-green-50 border-green-500 text-green-700' : isWrong ? 'bg-red-50 border-red-500 text-red-700' : isSelected ? 'border-corporate bg-blue-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}>
              <span>{opt}</span>
              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
              {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </button>
          );
        })}
      </div>
      {showFix && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-black text-green-700 dark:text-green-300 uppercase tracking-wider">{t('ova.introprompt.detect_fix_label')}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{fixes[round]}</p>
          {round < 2 && (
            <button onClick={nextRound} className="mt-3 px-4 py-2 bg-petroleum text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              {t('ova.introprompt.next')} <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {round === 2 && (
            <p className="mt-3 text-xs font-bold text-green-700 dark:text-green-300">{t('ova.introprompt.detect_complete')}</p>
          )}
        </div>
      )}
    </div>
  );
};

const CreatePattern = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const createSteps = [
    { letter: 'C', key: 'c', color: 'bg-petroleum' },
    { letter: 'R', key: 'r', color: 'bg-corporate' },
    { letter: 'E', key: 'e', color: 'bg-[#4361EE]' },
    { letter: 'A', key: 'a', color: 'bg-[#4CC9F0]' },
    { letter: 'T', key: 't', color: 'bg-[#F72585]' },
    { letter: 'E', key: 'e2', color: 'bg-[#FF9F1C]' },
  ];
  const isLast = step >= createSteps.length;

  if (isLast) {
    return (
      <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-white rounded-[2rem] border-2 border-emerald-200 dark:border-slate-700 shadow-md text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="text-petroleum font-[900] text-lg tracking-tighter lowercase mb-2">{t('ova.introprompt.create_result_title')}</h4>
          <p className="text-xs text-slate-500 mb-4">{t('ova.introprompt.create_result_desc')}</p>
          <div className="bg-petroleum text-white p-4 rounded-xl text-left text-xs leading-relaxed font-medium">
            {t('ova.introprompt.create_prompt_result')}
          </div>
        </div>
      </div>
    );
  }

  const cs = createSteps[step];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('ova.introprompt.create_step')} {step + 1} / 6</span>
        <div className="flex gap-1">
          {createSteps.map((s, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-petroleum' : i < step ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${cs.color} text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>
          <span className="text-2xl font-black">{cs.letter}</span>
        </div>
        <div>
          <h4 className="font-[900] text-petroleum text-lg tracking-tighter lowercase">{t(`ova.introprompt.create_${cs.key}`)}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{t(`ova.introprompt.create_${cs.key}_desc`)}</p>
        </div>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
        <p className="text-xs text-slate-500 dark:text-slate-300 font-bold mb-1 uppercase tracking-wider">Ejemplo</p>
        <p className="text-sm text-petroleum dark:text-corporate font-mono font-medium leading-relaxed">{t(`ova.introprompt.create_${cs.key}_example`)}</p>
      </div>
      <button onClick={() => setStep(step + 1)}
        className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
        {t('ova.introprompt.create_next')} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const FinalChallenge = () => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (!audioPlayed) {
      speakTextConversational(t('ova.introprompt.challenge_instructions'), 'valerio', () => {});
      setAudioPlayed(true);
    }
    return () => stopSpeech();
  }, [audioPlayed, t]);

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-5">
      <div className="flex flex-col items-center text-center mb-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-lg mb-4 mt-2">
          <BrainCircuit className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-petroleum uppercase tracking-tighter mb-3">Desafío 1</h3>
        <div className="bg-gradient-to-br from-petroleum/[0.04] to-corporate/[0.04] rounded-2xl p-5 border border-petroleum/10 max-w-lg w-full mb-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            &ldquo;{t('ova.introprompt.challenge_instructions')}&rdquo;
          </p>
        </div>
        <VoiceReader text={t('ova.introprompt.challenge_instructions')} />
        <div className="grid grid-cols-3 gap-3 max-w-xs w-full mt-4">
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <BrainCircuit className="w-4 h-4 text-corporate mx-auto mb-1" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_apply') || 'Aplicar'}</p>
          </div>
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-500" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_practice') || 'Practicar'}</p>
          </div>
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_challenge') || 'Desafiar'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
        <p className="text-sm text-slate-500 dark:text-slate-300 font-bold mb-3">{t('ova.introprompt.challenge_desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{t('ova.introprompt.challenge_before_title')}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-mono italic">{t('ova.introprompt.challenge_before')}</p>
          </div>
          {revealed && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-green-600" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">{t('ova.introprompt.challenge_after_title')}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{t('ova.introprompt.challenge_after')}</p>
            </div>
          )}
        </div>
        {!revealed && (
          <button onClick={() => setRevealed(true)}
            className="w-full py-4 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg mt-3">
            <ArrowLeftRight className="w-5 h-5" /> {t('ova.introprompt.challenge_reveal')}
          </button>
        )}
        {revealed && (
          <div className="p-4 bg-petroleum text-white rounded-xl text-center mt-3">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-corporate" />
            <p className="font-bold text-sm text-white leading-relaxed">{t('ova.introprompt.challenge_complete')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Conclusion = ({ onComplete, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-petroleum mb-2 uppercase tracking-tighter">{t('ova.introprompt.cert_title')}</h2>
      <div className="bg-petroleum text-white inline-block px-10 py-5 rounded-[2rem] text-5xl font-black shadow-lg border-b-4 border-corporate mb-5">
        5 / 5
      </div>
      <div className="flex justify-center gap-1.5 mb-5">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-7 h-7 ${i <= 5 ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-600'}`} viewBox="0 0 24 24">
            <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
          </svg>
        ))}
      </div>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-6 leading-relaxed">{t('ova.introprompt.cert_score_msg')}</p>
      <button
        onClick={() => { onComplete?.(); onClose?.(); }}
        className="px-8 py-3.5 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2 mx-auto border-none"
      >
        {t('ova.introprompt.cert_receive_btn')}
      </button>
    </div>
  );
};

const screensData = {
  m1: { title: 'Importancia de la Calidad' },
  m2: { title: 'Tipos de Prompts' },
  m3: { title: 'Plantilla Universal' },
  m4: { title: '¿Cómo "Piensa" la IA?' },
  m5: { title: 'Detecta y Corrige' },
  m6: { title: 'CREATE: Método en 6 Pasos' },
  m7: { title: 'Reto Final' },
  m8: { title: 'Conclusión' }
};


OVAIntroPrompt.propTypes = {
  onComplete: PropTypes.any,
  onClose: PropTypes.any,
};

export default function OVAIntroPrompt({ onComplete, onClose }) {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoCompletedRef = useRef(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
  const curIdx = nav.indexOf(screen);

  useEffect(() => {
    if (screen === 'm8' && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onComplete?.();
    }
  }, [screen, onComplete]);

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screen === 'welcome') { setScreen('m1'); return; }
    const c = [...completed];
    if (!c.includes(screen)) c.push(screen);
    setCompleted(c);
    const next = nav.indexOf(screen) + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === 'm8';

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return (
        <>
          <OVAIntro
            icon="fa-brain"
            badge={t('ova.introprompt.lab_title')}
            title={`${t('ova.introprompt.welcome_title1')} ${t('ova.introprompt.welcome_title2')}`}
            description={t('ova.introprompt.welcome_desc')}
            onStart={nextScreen}
          />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.welcome_audio')} />
          </div>
        </>
      );
      case 'm1': return (
        <>
          <ImportanceQuality />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.importance_desc')} />
          </div>
        </>
      );
      case 'm2': return (
        <>
          <TypesPrompts />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.types_desc_abierto')} />
          </div>
        </>
      );
      case 'm3': return (
        <>
          <UniversalTemplate />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.universal_desc')} />
          </div>
        </>
      );
      case 'm4': return (
        <>
          <HowAIThinks />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.howit_voice')} />
          </div>
        </>
      );
      case 'm5': return (
        <>
          <DetectAndFix />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.detect_voice_1')} />
          </div>
        </>
      );
      case 'm6': return (
        <>
          <CreatePattern />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.create_voice')} />
          </div>
        </>
      );
      case 'm7': return (
        <>
          <FinalChallenge />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.challenge_voice')} />
          </div>
        </>
      );
      case 'm8': return (
        <>
          <Conclusion onComplete={onComplete} onClose={onClose} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.introprompt.conclusion_desc')} />
          </div>
        </>
      );
      default: return null;
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
              <span className="font-bold text-petroleum text-xs">{nav.filter(id => completed.includes(id)).length}/{nav.length - 1}</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de navegación" className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"><Menu className="w-5 h-5 text-petroleum" /></button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-corporate font-[900] text-[10px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> {t('ova.introprompt.master')}</div>
              <h1 className="text-lg md:text-xl font-[900] text-petroleum tracking-tighter leading-tight">{screensData[screen]?.title}</h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">{renderContent()}</div>
        </div>
      </main>

      {screen !== 'welcome' && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button onClick={() => { if (curIdx > 1) setScreen(nav[curIdx - 1]); stopSpeech(); }} aria-label="Anterior" className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-petroleum dark:hover:text-corporate rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700" disabled={curIdx <= 1}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-1.5">{nav.slice(1).map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 === curIdx ? 'w-8 bg-petroleum' : completed.includes(nav[i + 1]) ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />)}</div>
            <button onClick={isLastScreen ? () => { onClose?.(); } : nextScreen} className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${isLastScreen ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-petroleum to-corporate text-white'}`}>
              {isLastScreen ? t('ova.introprompt.finish_btn') : t('ova.introprompt.next')} <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t('ova.introprompt.footer')}</p>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{t('ova.introprompt.map')}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-petroleum">
                <Star className="w-3 h-3 text-corporate fill-current" />
                {completed.filter(id => id.startsWith('m')).length}/{nav.filter(id => id.startsWith('m')).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = idx;
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button key={id} onClick={() => goToScreen(id)} className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${isCurrent ? 'bg-petroleum text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isCompleted ? 'bg-corporate text-white' : isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>{stepNum}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-petroleum dark:text-corporate' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? t('ova.introprompt.menu_welcome') : screensData[id]?.title}
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
