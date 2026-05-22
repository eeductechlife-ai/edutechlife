import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const filters = [
  {
    id: 'exactitud',
    titulo: 'Exactitud',
    pregunta: '¿La respuesta cita fuentes verificables o presenta datos sin respaldo?',
    si: 'Cita fuentes claras y verificables. Los datos tienen respaldo.',
    parcial: 'Menciona información general pero le faltan referencias concretas.',
    no: 'No cita fuentes. Los datos parecen inventados o genéricos sin sustento.',
    icono: <SvgSearch className="w-5 h-5" />
  },
  {
    id: 'sesgo',
    titulo: 'Sesgo',
    pregunta: '¿La respuesta presenta una sola perspectiva o muestra diversidad de enfoques?',
    si: 'Reconoce múltiples perspectivas y matiza sus afirmaciones.',
    parcial: 'Muestra una tendencia clara pero menciona brevemente otras posturas.',
    no: 'Presenta una sola visión como verdad absoluta, sin matices ni contexto.'
  },
  {
    id: 'privacidad',
    titulo: 'Privacidad',
    pregunta: '¿La respuesta solicita, expone o asume datos personales innecesarios?',
    si: 'No pide ni expone datos personales. Respeta la privacidad.',
    parcial: 'Menciona datos genéricos pero no entra en detalles personales.',
    no: 'Solicita información personal o asume datos que no debería conocer.'
  },
  {
    id: 'transparencia',
    titulo: 'Transparencia',
    pregunta: '¿Es claro que esto es contenido generado por IA o podría engañar a alguien?',
    si: 'Se nota que es IA pero es honesto sobre sus limitaciones y naturaleza.',
    parcial: 'Suena natural pero no aclara si fue generado por IA.',
    no: 'Podría engañar a cualquier persona haciéndose pasar por humano experto.'
  },
  {
    id: 'responsabilidad',
    titulo: 'Responsabilidad',
    pregunta: '¿Delegarías una decisión importante basada únicamente en esta respuesta?',
    si: 'Es información sólida que complementaría bien una decisión informada.',
    parcial: 'Tiene información útil pero necesitas verificarla antes de decidir.',
    no: 'No confiarías en esto para tomar una decisión importante sin validar.'
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

const getScoreLabel = (score) => {
  if (score >= 80) return 'Confiable';
  if (score >= 50) return 'Cautela';
  return 'Crítico';
};

const Welcome = ({ onNext }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in px-4 py-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
      <SvgShield className="w-4 h-4 text-[#259eb5]" /><span>Ethical Lens — Lupa Ética IA</span>
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
      <SvgSearch className="text-white w-8 h-8" />
    </div>
    <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b]">Ponle Lupa a la IA</h1>
    <p className="text-lg md:text-xl text-slate-500 font-light mb-2">Analiza cualquier respuesta con criterio ético</p>
    <p className="text-slate-600 max-w-xl mb-4">Hola, soy Valerio. Esta herramienta te ayuda a evaluar respuestas de inteligencia artificial con 5 filtros éticos: exactitud, sesgo, privacidad, transparencia y responsabilidad. Pega cualquier respuesta que hayas recibido de una IA y aplícale la lupa.</p>
    <VoiceReader text="Hola, soy Valerio. Esta herramienta te ayuda a evaluar respuestas de inteligencia artificial con 5 filtros éticos: exactitud, sesgo, privacidad, transparencia y responsabilidad. Pega cualquier respuesta de IA y aplícale la lupa." />
    <button onClick={onNext} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
      <SvgPlay className="w-5 h-5" />Comenzar
    </button>
  </div>
);

export default function EthicsExplorer() {
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
      label: 'Ejemplo con sesgo',
      texto: 'Los médicos son más competentes que las enfermeras, según estudios. La mayoría de los líderes empresariales exitosos son hombres porque tienen mayor capacidad de toma de decisiones bajo presión. Las mujeres prefieren carreras en educación y cuidado porque son más empáticas por naturaleza.'
    },
    {
      label: 'Ejemplo sin fuentes',
      texto: 'Estudios recientes demuestran que el 94% de las empresas que implementan IA generativa aumentan su productividad en un 300% durante el primer trimestre. Además, el 87% de los empleados reportan mayor satisfacción laboral. Estos números han sido validados por múltiples investigaciones independientes.'
    }
  ];

  if (step === 'welcome') return <Welcome onNext={() => setStep('paste')} />;

  if (step === 'paste') {
    const hasText = respuesta.trim().length > 0;
    return (
      <div className="animate-fade-in px-4 py-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
            <SvgPaste className="w-4 h-4 text-[#259eb5]" /><span>Pega la respuesta</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">¿Qué te dijo la IA?</h2>
          <p className="text-slate-500 text-sm mb-4">Pega aquí cualquier respuesta que hayas recibido de ChatGPT, Gemini, Claude u otra IA.</p>
          <VoiceReader text="Pega aquí cualquier respuesta que hayas recibido de una inteligencia artificial. Puede ser de ChatGPT, Gemini, Claude o cualquier otra. Vamos a analizarla juntos." />
        </div>

        <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)}
          placeholder="Pega aquí la respuesta de la IA que quieras analizar..."
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
              Limpiar
            </button>
          )}
        </div>

        <button disabled={!hasText} onClick={() => setStep('evaluate')}
          className={`w-full py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
            hasText
              ? 'bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-100 text-slate-600 cursor-not-allowed'
          }`}>
          <SvgSearch className="w-5 h-5" />Aplicar lupa ética
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
            <SvgSearch className="w-4 h-4 text-[#259eb5]" /><span>Evalúa con criterio</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">Aplica los 5 filtros</h2>
          <p className="text-slate-500 text-sm mb-4">Para cada filtro, elige la opción que mejor describa la respuesta que pegaste.</p>
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
                      {val === 'si' && <SvgCheck className="w-4 h-4" />} Sí
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
                      {val === 'parcial' && <SvgAlert className="w-4 h-4" />} Parcial
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
                      {val === 'no' && <SvgX className="w-4 h-4" />} No
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
              Ver reporte ético <SvgChevronRight className="w-5 h-5" />
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
            <SvgShield className="w-4 h-4 text-[#259eb5]" /><span>Reporte Ético</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">Resultado del análisis</h2>
          <p className="text-slate-500 text-sm mb-4">Basado en tus evaluaciones de los 5 filtros éticos.</p>
          <VoiceReader text={`El score ético de esta respuesta es ${score} sobre 100. Categoría: ${getScoreLabel(score)}. Revisa cada filtro para ver las recomendaciones específicas.`} />
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 mb-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: score >= 80 ? 'linear-gradient(135deg, #10B981, #34D399)' : score >= 50 ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'linear-gradient(135deg, #EF4444, #F87171)' }}>
              <span className="text-3xl font-black text-white">{score}%</span>
            </div>
            <h3 className={`text-xl font-black ${getScoreColor(score)}`}>{getScoreLabel(score)}</h3>
            <p className="text-slate-500 text-xs mt-1">
              {score >= 80 ? 'Respuesta con buen nivel ético. Úsala con confianza pero siempre con criterio.'
              : score >= 50 ? 'Respuesta con aspectos positivos pero que requiere verificación adicional.'
              : 'Esta respuesta necesita revisión crítica. No la uses sin validar cada punto.'}
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
                    }`}>{val}</span>
                  </div>
                  <p className="text-xs text-slate-600 ml-10 leading-relaxed">
                    {isGood ? 'Bien. ' + f.si : isWarn ? 'Revisa. ' + f.parcial : 'Atención. ' + f.no}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
          <h3 className="font-bold text-sm text-[#13374b] mb-3">¿Qué harías diferente?</h3>
          <p className="text-xs text-slate-500 mb-3">Reflexiona: después de este análisis, ¿volverías a usar esta respuesta? ¿Qué le preguntarías a la IA para mejorarla?</p>
          <textarea value={reflexion} onChange={e => setReflexion(e.target.value)}
            placeholder="Ej: Le pediría que cite fuentes específicas y que incluya perspectivas alternativas..."
            className="w-full h-24 p-4 rounded-xl border-2 border-slate-200 focus:border-[#259eb5] focus:ring-2 focus:ring-[#259eb5]/20 outline-none resize-none text-sm text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>

        <div className="bg-gradient-to-r from-[#13374b] to-[#259eb5] rounded-2xl p-6 text-white text-center mb-6">
          <SvgShield className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-medium text-cyan-200">Recuerda: la mejor defensa contra la desinformación es tu pensamiento crítico. Usa esta lupa con cada respuesta que recibas.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setStep('paste'); setEvaluaciones({}); setReflexion(''); }}
            className="px-8 py-3 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
            <SvgPaste className="w-4 h-4" />Analizar otra respuesta
          </button>
          <button onClick={reset}
            className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-[#13374b] transition-all flex items-center justify-center gap-2 text-sm">
            <SvgRefresh className="w-4 h-4" />Empezar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return null;
}
