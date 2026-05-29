import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import VoiceReader from './VoiceReader';

const SvgShield = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
);
const SvgCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const SvgX = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const SvgAlert = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const SvgPlay = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const SvgPaste = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
);
const SvgRefresh = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v5h-5"/></svg>
);
const SvgSearch = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
);
const SvgChevronRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const getFilters = (t) => [
  {
    id: 'exactitud',
    titulo: t('ialab.ethics_explorer.filter_accuracy_title'),
    pregunta: t('ialab.ethics_explorer.filter_accuracy_question'),
    si: t('ialab.ethics_explorer.filter_accuracy_yes'),
    parcial: t('ialab.ethics_explorer.filter_accuracy_partial'),
    no: t('ialab.ethics_explorer.filter_accuracy_no'),
    icono: <SvgSearch className="w-5 h-5" />
  },
  {
    id: 'sesgo',
    titulo: t('ialab.ethics_explorer.filter_bias_title'),
    pregunta: t('ialab.ethics_explorer.filter_bias_question'),
    si: t('ialab.ethics_explorer.filter_bias_yes'),
    parcial: t('ialab.ethics_explorer.filter_bias_partial'),
    no: t('ialab.ethics_explorer.filter_bias_no')
  },
  {
    id: 'privacidad',
    titulo: t('ialab.ethics_explorer.filter_privacy_title'),
    pregunta: t('ialab.ethics_explorer.filter_privacy_question'),
    si: t('ialab.ethics_explorer.filter_privacy_yes'),
    parcial: t('ialab.ethics_explorer.filter_privacy_partial'),
    no: t('ialab.ethics_explorer.filter_privacy_no')
  },
  {
    id: 'transparencia',
    titulo: t('ialab.ethics_explorer.filter_transparency_title'),
    pregunta: t('ialab.ethics_explorer.filter_transparency_question'),
    si: t('ialab.ethics_explorer.filter_transparency_yes'),
    parcial: t('ialab.ethics_explorer.filter_transparency_partial'),
    no: t('ialab.ethics_explorer.filter_transparency_no')
  },
  {
    id: 'responsabilidad',
    titulo: t('ialab.ethics_explorer.filter_accountability_title'),
    pregunta: t('ialab.ethics_explorer.filter_accountability_question'),
    si: t('ialab.ethics_explorer.filter_accountability_yes'),
    parcial: t('ialab.ethics_explorer.filter_accountability_partial'),
    no: t('ialab.ethics_explorer.filter_accountability_no')
  }
];

const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreBg = (score) => {
  if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
  if (score >= 50) return 'bg-gradient-to-r from-amber-500 to-amber-400';
  return 'bg-gradient-to-r from-rose-500 to-rose-400';
};

const getScoreLabel = (score, t) => {
  if (score >= 80) return t('ialab.ethics_explorer.score_reliable');
  if (score >= 50) return t('ialab.ethics_explorer.score_caution');
  return t('ialab.ethics_explorer.score_critical');
};

const Welcome = ({ onNext, t }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in px-4 py-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
      <SvgShield className="w-4 h-4 text-[#259eb5]" /><span>{t('ialab.ethics_explorer.badge')}</span>
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
      <SvgSearch className="text-white w-8 h-8" />
    </div>
    <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b]">{t('ialab.ethics_explorer.title')}</h1>
    <p className="text-lg md:text-xl text-slate-500 font-light mb-2">{t('ialab.ethics_explorer.subtitle')}</p>
    <p className="text-slate-600 max-w-xl mb-4">{t('ialab.ethics_explorer.welcome_desc')}</p>
    <VoiceReader text={t('ialab.ethics_explorer.welcome_desc')} />
    <button onClick={onNext} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
      <SvgPlay className="w-5 h-5" />{t('ialab.ethics_explorer.start')}
    </button>
  </div>
);

export default function EthicsExplorer() {
  const { t } = useTranslation();
  const filters = useMemo(() => getFilters(t), [t]);
  const [step, setStep] = useState('welcome');
  const [respuesta, setRespuesta] = useState('');
  const [evaluaciones, setEvaluaciones] = useState({});
  const [reflexion, setReflexion] = useState('');

  const reset = () => {
    setStep('welcome');
    setRespuesta('');
    setEvaluaciones({});
    setReflexion('');
  };

  const totalFilters = filters.length;
  const evaluatedCount = Object.keys(evaluaciones).length;
  const score = evaluatedCount > 0
    ? Math.round(Object.values(evaluaciones).reduce((s, v) => {
        if (v === 'si') return s + 100;
        if (v === 'parcial') return s + 50;
        return s + 0;
      }, 0) / totalFilters)
    : 0;

  const ejemplos = [
    {
      label: t('ialab.ethics_explorer.example_bias'),
      texto: 'Los médicos son más competentes que las enfermeras, según estudios. La mayoría de los líderes empresariales exitosos son hombres porque tienen mayor capacidad de toma de decisiones bajo presión. Las mujeres prefieren carreras en educación y cuidado porque son más empáticas por naturaleza.'
    },
    {
      label: t('ialab.ethics_explorer.example_no_sources'),
      texto: 'Estudios recientes demuestran que el 94% de las empresas que implementan IA generativa aumentan su productividad en un 300% durante el primer trimestre. Además, el 87% de los empleados reportan mayor satisfacción laboral. Estos números han sido validados por múltiples investigaciones independientes.'
    }
  ];

  if (step === 'welcome') return <Welcome onNext={() => setStep('paste')} t={t} />;

  if (step === 'paste') {
    const hasText = respuesta.trim().length > 0;
    return (
      <div className="animate-fade-in px-4 py-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
            <SvgPaste className="w-4 h-4 text-[#259eb5]" /><span>{t('ialab.ethics_explorer.paste_btn')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">{t('ialab.ethics_explorer.paste_title')}</h2>
          <p className="text-slate-500 text-sm mb-4">{t('ialab.ethics_explorer.paste_desc')}</p>
          <VoiceReader text={t('ialab.ethics_explorer.paste_desc')} />
        </div>

        <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)}
          placeholder={t('ialab.ethics_explorer.paste_placeholder')}
          className="w-full h-44 p-5 rounded-2xl border-2 border-slate-200 focus:border-[#259eb5] focus:ring-2 focus:ring-[#259eb5]/20 outline-none resize-none text-sm text-slate-700 placeholder:text-slate-300 transition-all"
        />

        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {ejemplos.map((ej, i) => (
            <button key={i} onClick={() => setRespuesta(ej.texto)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-all">
              {ej.label}
            </button>
          ))}
          {hasText && (
            <button onClick={() => setRespuesta('')}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 transition-all">
              {t('ialab.ethics_explorer.clear')}
            </button>
          )}
        </div>

        <button disabled={!hasText} onClick={() => setStep('evaluate')}
          className={`w-full py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
            hasText
              ? 'bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-100 text-slate-600 cursor-not-allowed'
          }`}>
          <SvgSearch className="w-5 h-5" />{t('ialab.ethics_explorer.apply_filter')}
        </button>
      </div>
    );
  }

  if (step === 'evaluate') {
    const allEvaluated = evaluatedCount === totalFilters;
    return (
      <div className="animate-fade-in px-4 py-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
            <SvgSearch className="w-4 h-4 text-[#259eb5]" /><span>{t('ialab.ethics_explorer.evaluate_title')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">{t('ialab.ethics_explorer.evaluate_desc')}</h2>
          <p className="text-slate-500 text-sm mb-4">{t('ialab.ethics_explorer.evaluate_hint')}</p>
          <VoiceReader text="Ahora vamos a aplicar 5 filtros éticos a la respuesta. Para cada uno, elige entre Sí, Parcialmente o No según tu criterio. Sé honesto en tu evaluación." />
        </div>

        <div className="flex items-center gap-2 mb-6 bg-slate-50 p-3 rounded-2xl">
          <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#259eb5] h-full rounded-full transition-all duration-500" style={{ width: `${(evaluatedCount / totalFilters) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-500">{evaluatedCount}/{totalFilters}</span>
        </div>

        <div className="space-y-4 mb-6">
          {filters.map((f) => {
            const val = evaluaciones[f.id];
            return (
              <div key={f.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                    {f.icono || <SvgSearch className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#13374b]">{f.titulo}</h3>
                    <p className="text-xs text-slate-500">{f.pregunta}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setEvaluaciones(prev => ({ ...prev, [f.id]: 'si' }))}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      val === 'si'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      {val === 'si' && <SvgCheck className="w-4 h-4" />} {t('ialab.ethics_explorer.yes')}
                    </div>
                    <div className="text-[9px] font-normal opacity-70 leading-tight">{f.si}</div>
                  </button>
                  <button onClick={() => setEvaluaciones(prev => ({ ...prev, [f.id]: 'parcial' }))}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      val === 'parcial'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      {val === 'parcial' && <SvgAlert className="w-4 h-4" />} {t('ialab.ethics_explorer.partial')}
                    </div>
                    <div className="text-[9px] font-normal opacity-70 leading-tight">{f.parcial}</div>
                  </button>
                  <button onClick={() => setEvaluaciones(prev => ({ ...prev, [f.id]: 'no' }))}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      val === 'no'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:bg-rose-50/50'
                    }`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      {val === 'no' && <SvgX className="w-4 h-4" />} {t('ialab.ethics_explorer.no')}
                    </div>
                    <div className="text-[9px] font-normal opacity-70 leading-tight">{f.no}</div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {allEvaluated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('report')}
              className="w-full py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm">
              {t('ialab.ethics_explorer.view_report')} <SvgChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  if (step === 'report') {
    return (
      <div className="animate-fade-in px-4 py-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
            <SvgShield className="w-4 h-4 text-[#259eb5]" /><span>{t('ialab.ethics_explorer.report_badge')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">{t('ialab.ethics_explorer.report_title')}</h2>
          <p className="text-slate-500 text-sm mb-4">{t('ialab.ethics_explorer.report_desc')}</p>
          <VoiceReader text={`El score ético de esta respuesta es ${score} sobre 100. Categoría: ${getScoreLabel(score, t)}. Revisa cada filtro para ver las recomendaciones específicas.`} />
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 mb-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: score >= 80 ? 'linear-gradient(135deg, #10B981, #34D399)' : score >= 50 ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'linear-gradient(135deg, #EF4444, #F87171)' }}>
              <span className="text-3xl font-black text-white">{score}%</span>
            </div>
            <h3 className={`text-xl font-black ${getScoreColor(score)}`}>{getScoreLabel(score, t)}</h3>
            <p className="text-slate-500 text-xs mt-1">
              {score >= 80 ? t('ialab.ethics_explorer.result_good')
              : score >= 50 ? t('ialab.ethics_explorer.result_caution')
              : t('ialab.ethics_explorer.result_critical')}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
              className={`h-full rounded-full ${getScoreBg(score)}`} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>

          <div className="space-y-3">
            {filters.map((f) => {
              const val = evaluaciones[f.id];
              const isGood = val === 'si';
              const isWarn = val === 'parcial';
              const isBad = val === 'no';
              return (
                <div key={f.id} className={`p-4 rounded-2xl border-2 ${
                  isGood ? 'border-emerald-200 bg-emerald-50/50' : isWarn ? 'border-amber-200 bg-amber-50/50' : 'border-rose-200 bg-rose-50/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isGood ? 'bg-emerald-100 text-emerald-600' : isWarn ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {isGood ? <SvgCheck className="w-4 h-4" /> : isWarn ? <SvgAlert className="w-4 h-4" /> : <SvgX className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-sm text-[#13374b]">{f.titulo}</span>
                    </div>
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isGood ? 'text-emerald-600' : isWarn ? 'text-amber-600' : 'text-rose-600'
                    }`}>{val === 'si' ? t('ialab.ethics_explorer.yes') : val === 'parcial' ? t('ialab.ethics_explorer.partial') : t('ialab.ethics_explorer.no')}</span>
                  </div>
                  <p className="text-xs text-slate-600 ml-10 leading-relaxed">
                    {isGood ? f.si : isWarn ? f.parcial : f.no}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
          <h3 className="font-bold text-sm text-[#13374b] mb-3">{t('ialab.ethics_explorer.reflection_question')}</h3>
          <p className="text-xs text-slate-500 mb-3">{t('ialab.ethics_explorer.reflection_desc')}</p>
          <textarea value={reflexion} onChange={e => setReflexion(e.target.value)}
            placeholder={t('ialab.ethics_explorer.reflection_placeholder')}
            className="w-full h-24 p-4 rounded-xl border-2 border-slate-200 focus:border-[#259eb5] focus:ring-2 focus:ring-[#259eb5]/20 outline-none resize-none text-sm text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>

        <div className="bg-gradient-to-r from-[#13374b] to-[#259eb5] rounded-2xl p-6 text-white text-center mb-6">
          <SvgShield className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-medium text-cyan-200">{t('ialab.ethics_explorer.remember_message')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setStep('paste'); setEvaluaciones({}); setReflexion(''); }}
            className="px-8 py-3 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
            <SvgPaste className="w-4 h-4" />{t('ialab.ethics_explorer.analyze_another')}
          </button>
          <button onClick={reset}
            className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-[#13374b] transition-all flex items-center justify-center gap-2 text-sm">
            <SvgRefresh className="w-4 h-4" />{t('ialab.ethics_explorer.restart')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
