import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  { id: 1, category: 'Procesos', text: '¿Cómo se gestionan actualmente tus procesos operativos?', options: [
    { value: 1, label: 'Totalmente manuales (papel, hojas de cálculo)' },
    { value: 2, label: 'Semi-automatizados con herramientas básicas' },
    { value: 3, label: 'Automatizados con software especializado' },
    { value: 4, label: 'Automatizados con IA y analítica avanzada' },
  ]},
  { id: 2, category: 'Procesos', text: '¿Con qué frecuencia se optimizan los procesos?', options: [
    { value: 1, label: 'Nunca / No hay un proceso definido' },
    { value: 2, label: 'Anualmente' },
    { value: 3, label: 'Trimestralmente' },
    { value: 4, label: 'Continuamente con métricas en tiempo real' },
  ]},
  { id: 3, category: 'Datos', text: '¿Cómo se almacenan y gestionan los datos de tu empresa?', options: [
    { value: 1, label: 'Archivos locales sin estructura' },
    { value: 2, label: 'Sistemas básicos con bases de datos simples' },
    { value: 3, label: 'Data warehouse o data lake' },
    { value: 4, label: 'Plataforma integrada con analítica en tiempo real' },
  ]},
  { id: 4, category: 'Datos', text: '¿Qué nivel de calidad tienen tus datos?', options: [
    { value: 1, label: 'Datos inconsistentes con duplicados frecuentes' },
    { value: 2, label: 'Datos parcialmente limpios' },
    { value: 3, label: 'Datos limpios con procesos de validación' },
    { value: 4, label: 'Datos gobernados con calidad automatizada' },
  ]},
  { id: 5, category: 'Tecnología', text: '¿Qué stack tecnológico utiliza tu empresa?', options: [
    { value: 1, label: 'Herramientas básicas ofimáticas' },
    { value: 2, label: 'Software de gestión (ERP/CRM básico)' },
    { value: 3, label: 'Plataformas cloud con APIs' },
    { value: 4, label: 'Arquitectura cloud-native con IA integrada' },
  ]},
  { id: 6, category: 'Tecnología', text: '¿Tu empresa utiliza APIs o integraciones entre sistemas?', options: [
    { value: 1, label: 'No, los sistemas están aislados' },
    { value: 2, label: 'Integraciones puntuales manuales' },
    { value: 3, label: 'APIs estándar entre sistemas principales' },
    { value: 4, label: 'Arquitectura orientada a servicios (SOA/microservicios)' },
  ]},
  { id: 7, category: 'Equipo', text: '¿Qué nivel de habilidades digitales tiene tu equipo?', options: [
    { value: 1, label: 'Básico: uso de herramientas ofimáticas' },
    { value: 2, label: 'Intermedio: manejo de software especializado' },
    { value: 3, label: 'Avanzado: team con perfil técnico/data literate' },
    { value: 4, label: 'Expertos: equipo dedicado a innovación digital' },
  ]},
  { id: 8, category: 'Equipo', text: '¿Existe una cultura de innovación y adopción tecnológica?', options: [
    { value: 1, label: 'Resistente al cambio tecnológico' },
    { value: 2, label: 'Abierta pero sin procesos definidos' },
    { value: 3, label: 'Programas de capacitación continua' },
    { value: 4, label: 'Cultura data-driven con innovación constante' },
  ]},
  { id: 9, category: 'Presupuesto', text: '¿Qué presupuesto destinas a tecnología e innovación?', options: [
    { value: 1, label: 'Menos del 2% de ingresos' },
    { value: 2, label: 'Entre 2% y 5% de ingresos' },
    { value: 3, label: 'Entre 5% y 10% de ingresos' },
    { value: 4, label: 'Más del 10% de ingresos' },
  ]},
  { id: 10, category: 'Presupuesto', text: '¿Has implementado soluciones de IA en tu empresa?', options: [
    { value: 1, label: 'No, nunca' },
    { value: 2, label: 'Proyectos piloto sin escala' },
    { value: 3, label: 'IA implementada en áreas específicas' },
    { value: 4, label: 'IA integrada en procesos core del negocio' },
  ]},
];

const levels = [
  { min: 10, max: 17, name: 'Emergente', color: '#EF4444', description: 'Tu empresa está en las etapas iniciales de transformación digital. Hay un gran potencial de mejora mediante automatización básica.', actions: ['Automatizar procesos manuales repetitivos', 'Implementar un CRM/ERP básico', 'Digitalizar documentos y procesos'], standards: 'ISO/IEC 42001 Sección 6.2 — Planificación del SGA' },
  { min: 18, max: 24, name: 'Básico', color: '#F59E0B', description: 'Tienes bases digitales pero falta integración y automatización de procesos multi-paso.', actions: ['Integrar sistemas mediante APIs', 'Implementar chatbots para atención al cliente', 'Automatizar reportes y documentación'], standards: 'ISO/IEC 23053 — Framework para sistemas IA' },
  { min: 25, max: 31, name: 'Intermedio', color: '#4DA8C4', description: 'Buena base tecnológica. El siguiente nivel es implementar IA predictiva y automatización inteligente.', actions: ['Implementar IA predictiva para toma de decisiones', 'Automatizar flujos multi-paso con IA', 'Dashboard analítico en tiempo real'], standards: 'NIST AI RMF — Mapear, Medir, Gestionar' },
  { min: 32, max: 37, name: 'Avanzado', color: '#66CCCC', description: 'Tu empresa está preparada para automatización cognitiva y agentes de IA autónomos.', actions: ['Desplegar multi-agentes IA autónomos', 'Automatización end-to-end de procesos core', 'Analítica prescriptiva con ML'], standards: 'ISO/IEC 42001 Sección 8 — Evaluación del SGA' },
  { min: 38, max: 40, name: 'Optimizado', color: '#004B63', description: 'Eres líder en transformación digital. El foco ahora es innovación continua y escalar IA a toda la organización.', actions: ['Escalar IA a toda la organización', 'Innovación continua con IA generativa', 'Crear centro de excelencia en IA'], standards: 'ISO/IEC 42001 + EU AI Act Compliance' },
];

const AutomationReadinessTest = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = useCallback((value) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  }, [currentQ?.id]);

  const handleNext = useCallback(() => {
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      calculateResult();
    }
  }, [step]);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const calculateResult = () => {
    const total = Object.values(answers).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
    const level = levels.find(l => total >= l.min && total <= l.max) || levels[0];
    setResult({ score: total, ...level });
    setAnimateResult(true);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setAnimateResult(false);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${result.color}15` }}>
            <svg className="w-10 h-10" style={{ color: result.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4" style={{ background: `${result.color}15`, color: result.color }}>
            {result.name}
          </div>

          <h3 className="text-2xl font-black text-[#004B63] mb-2">
            Madurez Digital: {result.score}/40
          </h3>
          <p className="text-slate-500 mb-6">{result.description}</p>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(result.score / 40) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${result.color}, ${result.color}dd)` }}
            />
          </div>

          <div className="text-left bg-slate-50 rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-[#004B63] text-sm mb-3">Recomendaciones:</h4>
            <ul className="space-y-2">
              {result.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${result.color}15`, color: result.color }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#004B63]/5 border border-[#004B63]/10 rounded-xl mb-6">
            <svg className="w-4 h-4 text-[#4DA8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
            <span className="text-xs font-semibold text-[#004B63]">{result.standards}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onComplete?.(result)}
              className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full font-bold text-sm hover:shadow-lg transition-all"
            >
              Generar Plan Personalizado
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-full font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Volver a Intentar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider">
              Categoría: {currentQ.category}
            </span>
            <h3 className="text-lg font-bold text-[#004B63] mt-1">
              Pregunta {step + 1} de {questions.length}
            </h3>
          </div>
          <span className="text-sm font-semibold text-slate-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl font-bold text-[#004B63] mb-6">{currentQ.text}</p>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium ${
                    answers[currentQ.id] === opt.value
                      ? 'border-[#4DA8C4] bg-[#4DA8C4]/5 text-[#004B63]'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      answers[currentQ.id] === opt.value
                        ? 'border-[#4DA8C4] bg-[#4DA8C4]'
                        : 'border-slate-300'
                    }`}>
                      {answers[currentQ.id] === opt.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="px-6 py-2.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step < questions.length - 1 ? (
              <>Siguiente <svg className="w-4 h-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
            ) : 'Ver Resultados'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationReadinessTest;
