import React, { useState } from 'react';
import VoiceReader from './VoiceReader';

const CONTENT_TYPES = [
  { id: 'academico', label: 'Académico', icon: '📚', desc: 'Papers, tesis, artículos de investigación' },
  { id: 'tecnico', label: 'Técnico', icon: '⚙️', desc: 'Manuales, guías, documentación técnica' },
  { id: 'creativo', label: 'Creativo', icon: '🎨', desc: 'Guías de diseño, marketing, contenido' },
  { id: 'mixto', label: 'Mixto', icon: '📦', desc: 'Combinación de varios tipos' }
];

const GOALS = [
  { id: 'estudiar', label: 'Estudiar', icon: '📖', desc: 'Repasar y comprender conceptos clave' },
  { id: 'resumir', label: 'Resumir', icon: '📝', desc: 'Extraer lo esencial de documentos largos' },
  { id: 'presentar', label: 'Presentar', icon: '🎤', desc: 'Preparar material para una exposición' },
  { id: 'explorar', label: 'Explorar', icon: '🔍', desc: 'Investigación inicial sobre un tema nuevo' }
];

const DOC_COUNTS = [
  { id: 'pocos', label: '1-2 docs', icon: '📄', desc: 'Pocos documentos, muy enfocados' },
  { id: 'medio', label: '3-5 docs', icon: '📚', desc: 'Cantidad ideal para un buen debate' },
  { id: 'varios', label: '6-10 docs', icon: '📚📚', desc: 'Visión amplia del tema' },
  { id: 'muchos', label: '10+ docs', icon: '📚📚📚', desc: 'Investigación exhaustiva' }
];

const getRecommendations = (contentType, goal, docCount) => {
  const plan = {};

  const sourceTips = {
    academico: 'Usa papers revisados por pares, tesis y artículos académicos. La calidad de las fuentes define la profundidad del análisis.',
    tecnico: 'Manuales oficiales y documentación técnica generan podcasts precisos. Incluye ejemplos prácticos.',
    creativo: 'Guías de estilo, briefs y casos de éxito. La IA captura bien el tono creativo si las fuentes son descriptivas.',
    mixto: 'Agrupa tus fuentes por tema antes de subirlas. NotebookLM cruza información entre todas, así que la organización importa.'
  };

  const goalTips = {
    estudiar: 'Escucha el podcast primero para contexto general, luego lee los documentos para profundizar. El audio te da el mapa mental.',
    resumir: 'Selecciona las fuentes más importantes. El Audio Overview será un gran resumen conversacional, pero complementa con notas escritas.',
    presentar: 'Genera el podcast para obtener una narrativa coherente. Úsalo como inspiración para estructurar tu presentación.',
    explorar: 'Sube 5-10 fuentes diversas. El debate entre los presentadores te dará perspectivas que no habías considerado.'
  };

  const docTips = {
    pocos: 'Con pocos documentos, el podcast será muy enfocado. Ideal para repasar conceptos específicos antes de un examen.',
    medio: 'Cantidad ideal. Los presentadores tendrán suficiente material para generar un debate interesante con profundidad.',
    varios: 'Buena variedad de perspectivas. El podcast será más amplio pero menos profundo en cada tema.',
    muchos: 'El podcast cubrirá muchas ideas pero cada una superficialmente. Mejor divide en grupos temáticos y genera varios podcasts.'
  };

  const estimatedTime = docCount === 'pocos' ? '3-5 minutos' : docCount === 'medio' ? '5-10 minutos' : '10-15 minutos';
  const idealSources = docCount === 'pocos' ? '2-3 fuentes' : docCount === 'medio' ? '3-5 fuentes' : '6-8 fuentes';
  const formats = contentType === 'academico' ? 'PDF, Google Docs' : contentType === 'tecnico' ? 'PDF, TXT, URLs' : contentType === 'creativo' ? 'PDF, Google Docs, URLs' : 'PDF, Google Docs, TXT, URLs';

  return {
    sourceTip: sourceTips[contentType] || sourceTips.mixto,
    goalTip: goalTips[goal] || goalTips.explorar,
    docTip: docTips[docCount] || docTips.medio,
    estimatedTime,
    idealSources,
    formats
  };
};

const CHECKLIST_ITEMS = [
  { id: 'select', label: 'Seleccioné y organicé mis mejores fuentes' },
  { id: 'create', label: 'Creé un notebook nuevo en NotebookLM' },
  { id: 'upload', label: 'Subí todas mis fuentes al notebook' },
  { id: 'generate', label: 'Inicié la generación del Audio Overview' },
  { id: 'listen', label: 'Escuché el resultado completo' },
  { id: 'notes', label: 'Tomé notas de los puntos clave' }
];

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: total }, (_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < current ? 'w-8 bg-[#259eb5]' : i === current ? 'w-8 bg-[#13374b]' : 'w-2 bg-slate-200'}`} />
    ))}
  </div>
);

export default function OVAPodcastStudio() {
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
          <span>Asistente de Audio Overview</span>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b]">Crea tu Audio Overview</h1>
        <p className="text-lg md:text-xl text-slate-500 font-light mb-2">NotebookLM · Para cualquier curso o materia</p>
        <p className="text-slate-600 max-w-xl mb-4">Hola, soy Valerio. Responde 3 preguntas sobre tu proyecto y recibirás un plan personalizado con recomendaciones y una checklist para crear tu podcast en NotebookLM. Funciona para cualquier tema: historia, ciencia, tecnología, arte, negocios...</p>
        <VoiceReader text="Hola, soy Valerio. Responde 3 preguntas sobre tu proyecto y recibirás un plan personalizado con recomendaciones y una checklist para crear tu podcast en NotebookLM. Funciona para cualquier materia: historia, ciencia, tecnología, arte, negocios, lo que tú estudies." />
        <button onClick={handleStart} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Comenzar
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
            <span>Cuéntame de tu proyecto</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">Responde 3 preguntas</h2>
          <p className="text-slate-500 text-sm mb-4">Recibirás recomendaciones personalizadas para tu caso.</p>
          <VoiceReader text="Responde 3 preguntas sobre tu proyecto y recibiré recomendaciones personalizadas para crear el mejor Audio Overview en NotebookLM." />
        </div>

        <StepIndicator current={currentQuestion} total={totalQuestions} />

        <div className="max-w-3xl mx-auto space-y-8">
          {showType && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] mb-4 text-center">¿Qué tipo de contenido tienes?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONTENT_TYPES.map(t => (
                  <button key={t.id} onClick={() => handleAnswer('contentType', t.id)}
                    className="bg-white rounded-2xl p-5 text-center border-2 border-slate-200 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] group-hover:text-[#259eb5] transition-colors">{t.label}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showGoal && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] mb-4 text-center">¿Cuál es tu objetivo?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => handleAnswer('goal', g.id)}
                    className="bg-white rounded-2xl p-5 text-center border-2 border-slate-200 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{g.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] group-hover:text-[#259eb5] transition-colors">{g.label}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showCount && (
            <div>
              <h3 className="text-lg font-bold text-[#13374b] mb-4 text-center">¿Cuántos documentos tienes?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DOC_COUNTS.map(d => (
                  <button key={d.id} onClick={() => handleAnswer('docCount', d.id)}
                    className="bg-white rounded-2xl p-5 text-center border-2 border-slate-200 hover:border-[#259eb5] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{d.icon}</div>
                    <div className="font-bold text-sm text-[#13374b] group-hover:text-[#259eb5] transition-colors">{d.label}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{d.desc}</div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span>Tu plan personalizado</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">Recomendaciones para tu podcast</h2>
          <p className="text-slate-500 text-sm mb-4">Basado en tu contenido, objetivo y cantidad de documentos.</p>
          <VoiceReader text={`Genial. Basado en tus respuestas, aquí tienes tu plan personalizado para crear un Audio Overview en NotebookLM. Tipo de contenido: ${cType?.label}. Objetivo: ${g?.label}. Documentos: ${dCount?.label}.`} />
        </div>

        <StepIndicator current={2} total={3} />

        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-2 bg-cyan-50 text-[#13374b] rounded-xl text-sm font-semibold border border-cyan-200">{cType?.icon} {cType?.label}</span>
            <span className="px-4 py-2 bg-purple-50 text-[#13374b] rounded-xl text-sm font-semibold border border-purple-200">{g?.icon} {g?.label}</span>
            <span className="px-4 py-2 bg-amber-50 text-[#13374b] rounded-xl text-sm font-semibold border border-amber-200">{dCount?.icon} {dCount?.label}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-[#13374b] mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              Resumen de tu plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Fuentes ideales</div>
                <div className="text-lg font-bold text-[#13374b]">{recs.idealSources}</div>
                <div className="text-xs text-slate-500">Formato: {recs.formats}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Tiempo estimado</div>
                <div className="text-lg font-bold text-[#13374b]">{recs.estimatedTime}</div>
                <div className="text-xs text-slate-500">De generación + duración</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Enfoque</div>
                <div className="text-lg font-bold text-[#13374b]">{g?.label}</div>
                <div className="text-xs text-slate-500">{g?.desc}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">📄</span>
                  <div>
                    <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Sobre tus fuentes</div>
                    <p className="text-sm text-blue-900 leading-relaxed">{recs.sourceTip}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">🎯</span>
                  <div>
                    <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Según tu objetivo</div>
                    <p className="text-sm text-purple-900 leading-relaxed">{recs.goalTip}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">📊</span>
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Según tu cantidad de documentos</div>
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
            Ir a la checklist
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#259eb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="18" x="5" y="2" rx="3" ry="3"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>
          <span>Checklist de preparación</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#13374b] mb-2">Sigue estos pasos</h2>
        <p className="text-slate-500 text-sm mb-4">Marca cada paso al completarlo. Puedes tener NotebookLM abierto en otra pestaña.</p>
        <VoiceReader text="Aquí tienes tu checklist de preparación. Marca cada paso a medida que lo completes mientras trabajas en NotebookLM. Yo te guiaré en el proceso." />
      </div>

      <StepIndicator current={3} total={3} />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#13374b]">Tu progreso</span>
            <span className="text-sm font-bold text-[#259eb5]">{checkedCount}/{CHECKLIST_ITEMS.length}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#259eb5] to-[#13374b] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {CHECKLIST_ITEMS.map(item => (
            <button key={item.id} onClick={() => toggleCheck(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                checked[item.id]
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-[#259eb5]'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                checked[item.id] ? 'bg-emerald-500' : 'bg-slate-100 border-2 border-slate-300'
              }`}>
                {checked[item.id] && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${checked[item.id] ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {checkedCount === CHECKLIST_ITEMS.length && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center mb-6 animate-fade-in">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-emerald-800 mb-2">¡Completaste todos los pasos!</h3>
            <p className="text-sm text-emerald-700 mb-4">Ya tienes todo listo para crear tu Audio Overview en NotebookLM. Ahora solo queda escuchar el resultado y tomar notas.</p>
            <VoiceReader text="¡Excelente! Has completado todos los pasos. Ahora tienes tu Audio Overview generado en NotebookLM. Escúchalo con atención y toma notas de los puntos clave. Recuerda que puedes regenerar cuantas veces quieras para obtener diferentes perspectivas." />
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button onClick={handleStart}
            className="px-6 py-3 bg-white text-[#13374b] border-2 border-slate-200 hover:border-[#259eb5] rounded-xl font-semibold transition-all inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Empezar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
