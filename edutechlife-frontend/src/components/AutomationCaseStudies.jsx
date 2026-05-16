import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cases = [
  {
    id: 1,
    empresa: 'TechCorp Solutions',
    sector: 'Tecnología / SaaS',
    resultado: '+340% eficiencia',
    metricas: [
      { label: 'Ahorro operativo', value: '$180K/año' },
      { label: 'ROI', value: '4.2x' },
      { label: 'Implementación', value: '3 meses' },
    ],
    problema: 'La empresa gestionaba 15,000+ tickets de soporte al mes manualmente, con tiempos de respuesta de 48+ horas y un equipo de 12 agentes al límite.',
    solucion: 'Implementamos un sistema multi-agente con chatbot IA para nivel 1, routing inteligente con NLP, y automatización de respuestas para problemas recurrentes. Se integró con Zendesk y el CRM existente.',
    resultados: 'Reducción del 78% en tickets de nivel 1, tiempo de respuesta bajó a <5 minutos, el equipo humano se enfoca en casos complejos. Ahorro anual de $180,000.',
    icono: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    color: '#4DA8C4',
  },
  {
    id: 2,
    empresa: 'Clínica Santa María',
    sector: 'Salud',
    resultado: '-70% carga admin',
    metricas: [
      { label: 'Ahorro operativo', value: '$240K/año' },
      { label: 'ROI', value: '5.8x' },
      { label: 'Implementación', value: '4 meses' },
    ],
    problema: 'El 40% del tiempo del personal médico se perdía en tareas administrativas: agendamiento, facturación, historias clínicas y autorizaciones.',
    solucion: 'Desplegamos un ecosistema de automatización con NLP para transcripción médica, chatbot para agendamiento, OCR para historias clínicas, y facturación automática con IA.',
    resultados: 'Los médicos recuperaron 15h/semana para atención de pacientes. Reducción del 70% en tareas administrativas. Precisión del 95% en codificación de diagnósticos.',
    icono: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    color: '#66CCCC',
  },
  {
    id: 3,
    empresa: 'LogiCo Express',
    sector: 'Logística',
    resultado: '+180% capacidad',
    metricas: [
      { label: 'Ahorro operativo', value: '$320K/año' },
      { label: 'ROI', value: '6.3x' },
      { label: 'Implementación', value: '5 meses' },
    ],
    problema: 'Gestión manual de rutas para 200+ envíos diarios, con demoras del 25% y costos de combustible elevados por rutas ineficientes.',
    solucion: 'IA para optimización de rutas en tiempo real, automatización de tracking y notificaciones, dashboard predictivo de demanda, y sistema de gestión de flota con ML.',
    resultados: 'Reducción del 35% en costos de combustible, 99.8% de entregas a tiempo, capacidad de envíos duplicada sin contratar más personal. Ahorro anual de $320,000.',
    icono: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    color: '#004B63',
  },
  {
    id: 4,
    empresa: 'FinTech Pay',
    sector: 'Fintech',
    resultado: '+250% conversión',
    metricas: [
      { label: 'Ahorro operativo', value: '$150K/año' },
      { label: 'ROI', value: '3.9x' },
      { label: 'Implementación', value: '2 meses' },
    ],
    problema: 'Alto volumen de consultas de clientes (8,000/mes) con equipo limitado. Procesos de onboarding manual que tomaban 3 días promedio.',
    solucion: 'Chatbot financiero con IA para atención al cliente, automatización del proceso KYC con OCR y verificación de identidad, y scoring crediticio con ML predictivo.',
    resultados: 'Onboarding reducido de 3 días a 15 minutos. 85% de consultas resueltas por chatbot. Aumento del 250% en tasa de conversión de leads. NPS subió de 62 a 91.',
    icono: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#10B981',
  },
];

const AutomationCaseStudies = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 ${
              expandedId === c.id ? 'md:col-span-2 shadow-lg' : 'hover:shadow-md border-slate-100'
            }`}
          >
            <button
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              className="w-full text-left p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                  <svg className="w-7 h-7" style={{ color: c.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icono} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#004B63]">{c.empresa}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{c.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: c.color }}>{c.resultado}</span>
                    <svg className={`w-4 h-4 text-slate-300 transition-transform ${expandedId === c.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="flex gap-4 mt-3">
                    {c.metricas.map((m) => (
                      <div key={m.label} className="text-center">
                        <div className="text-sm font-black" style={{ color: c.color }}>{m.value}</div>
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {expandedId === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">Problema</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.problema}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">Solución</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.solucion}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">Resultados</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.resultados}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AutomationCaseStudies;
