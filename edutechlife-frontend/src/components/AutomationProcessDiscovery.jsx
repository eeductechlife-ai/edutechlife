import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const processToSolutions = {
  'Atención al cliente': [
    { name: 'Chatbot IA 24/7', desc: 'Atención automatizada con respuestas inteligentes y escalamiento a humano.', tools: 'Zendesk + GPT / Intercom + IA', impacto: 'Alto' },
    { name: 'Sistema de Tickets Inteligente', desc: 'Clasificación y routing automático de solicitudes por IA.', tools: 'Jira Service Management + ML', impacto: 'Alto' },
    { name: 'Voicebot', desc: 'Asistente telefónico con reconocimiento de voz y NLP.', tools: 'Twilio + Speech Recognition', impacto: 'Medio' },
  ],
  'Facturación y cobros': [
    { name: 'Facturación Automática', desc: 'Generación y envío automatizado de facturas con vencimiento programado.', tools: 'Stripe + QuickBooks / FreshBooks API', impacto: 'Alto' },
    { name: 'Cobranza Inteligente', desc: 'Sistema predictivo de cobranza con recordatorios automatizados.', tools: 'Chargebee + IA predictiva', impacto: 'Alto' },
    { name: 'Conciliación Automática', desc: 'Matching automático de pagos vs facturas usando ML.', tools: 'Xero + ML reconciliation', impacto: 'Medio' },
  ],
  'Gestión de inventario': [
    { name: 'Inventario Predictivo', desc: 'Predicción de demanda y reorden automático con IA.', tools: 'TradeGecko + ML forecasting', impacto: 'Alto' },
    { name: 'Escaneo Automatizado', desc: 'Reconocimiento de productos por imagen para entrada/salida.', tools: 'Computer Vision + RFID', impacto: 'Medio' },
    { name: 'Alertas de Stock', desc: 'Notificaciones automáticas cuando el stock baja del umbral mínimo.', tools: 'Zapier + ERP + Slack', impacto: 'Medio' },
  ],
  'Procesos contables': [
    { name: 'Contabilidad Automatizada', desc: 'Categorización automática de gastos e ingresos con IA.', tools: 'QuickBooks + ML categorization', impacto: 'Alto' },
    { name: 'Reportes Financieros', desc: 'Generación automática de estados financieros y dashboards.', tools: 'PowerBI + Tableau + APIs', impacto: 'Alto' },
    { name: 'Auditoría con IA', desc: 'Detección de anomalías y patrones sospechosos en transacciones.', tools: 'AuditBoard + ML anomaly detection', impacto: 'Medio' },
  ],
  'Recursos humanos': [
    { name: 'Reclutamiento IA', desc: 'Filtro automático de CVs y match con perfil del puesto.', tools: 'LinkedIn Recruiter + IA screening', impacto: 'Alto' },
    { name: 'Onboarding Automatizado', desc: 'Flujo de incorporación con documentos, training y accesos.', tools: 'BambooHR + Zapier + LMS', impacto: 'Alto' },
    { name: 'Evaluación de Desempeño', desc: 'Análisis automático de métricas y feedback 360° con IA.', tools: 'Lattice + ML analytics', impacto: 'Medio' },
  ],
  'Marketing y ventas': [
    { name: 'CRM Predictivo', desc: 'Scoring de leads y predicción de cierre con IA.', tools: 'Salesforce + Einstein AI', impacto: 'Alto' },
    { name: 'Email Marketing IA', desc: 'Segmentación automática y personalización de campañas.', tools: 'HubSpot + Mailchimp + ML', impacto: 'Alto' },
    { name: 'Analítica de Ventas', desc: 'Dashboard predictivo de ventas y recomendaciones.', tools: 'Tableau + PowerBI + ML', impacto: 'Medio' },
  ],
  'Logística y envíos': [
    { name: 'Rutas Inteligentes', desc: 'Optimización de rutas de entrega con IA en tiempo real.', tools: 'Route4Me + Google Maps API', impacto: 'Alto' },
    { name: 'Tracking Automatizado', desc: 'Notificaciones de seguimiento y estado de envíos.', tools: 'ShipStation + Twilio + IA', impacto: 'Alto' },
    { name: 'Gestión de Flota', desc: 'Monitoreo predictivo de mantenimiento y rendimiento.', tools: 'Samsara + Fleet Complete', impacto: 'Medio' },
  ],
  'Análisis de datos': [
    { name: 'Dashboard Automatizado', desc: 'Reportes en tiempo real con actualización automática.', tools: 'PowerBI + Tableau + Looker', impacto: 'Alto' },
    { name: 'Detección de Tendencias', desc: 'Identificación automática de patrones y anomalías.', tools: 'Python ML + AWS QuickSight', impacto: 'Alto' },
    { name: 'Data Pipeline Automatizado', desc: 'ETL automático con transformación y limpieza de datos.', tools: 'Airflow + dbt + Snowflake', impacto: 'Medio' },
  ],
  'Comunicación interna': [
    { name: 'Slackbot / Teams Bot', desc: 'Bot interno para consultas, reportes y notificaciones.', tools: 'Slack API + GPT + Power Automate', impacto: 'Medio' },
    { name: 'Newsletter Automática', desc: 'Generación y envío de comunicaciones internas con IA.', tools: 'Mailchimp + GPT + Canva API', impacto: 'Bajo' },
    { name: 'Encuestas Inteligentes', desc: 'Creación y análisis automático de encuestas de clima.', tools: 'Typeform + SurveyMonkey + ML', impacto: 'Bajo' },
  ],
  'Documentación y reportes': [
    { name: 'Generación de Reportes IA', desc: 'Redacción automática de reportes ejecutivos con datos en vivo.', tools: 'GPT + Notion + Airtable', impacto: 'Alto' },
    { name: 'OCR Inteligente', desc: 'Digitalización y clasificación automática de documentos.', tools: 'Google Vision + AWS Textract', impacto: 'Alto' },
    { name: 'Gestión Documental', desc: 'Archivo, búsqueda y recuperación inteligente de documentos.', tools: 'DocuSign + Box + IA indexing', impacto: 'Medio' },
  ],
};

const allProcesses = Object.keys(processToSolutions);

const processIcons = {
  'Atención al cliente': 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  'Facturación y cobros': 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'Gestión de inventario': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  'Procesos contables': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'Recursos humanos': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  'Marketing y ventas': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055zM17 6h3m-3 3h3M2 11h2m8-8v2m0 6h10',
  'Logística y envíos': 'M13 10V3L4 14h7v7l9-11h-7z',
  'Análisis de datos': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'Comunicación interna': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  'Documentación y reportes': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
};

const AutomationProcessDiscovery = ({ onGeneratePlan }) => {
  const [selected, setSelected] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const toggleProcess = (name) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
    setShowResults(false);
  };

  const solutions = useMemo(() => {
    if (selected.length === 0) return [];
    return selected.flatMap(p => (processToSolutions[p] || []).slice(0, 3));
  }, [selected]);

  const impactoCount = useMemo(() => {
    const counts = { Alto: 0, Medio: 0, Bajo: 0 };
    solutions.forEach(s => { if (counts[s.impacto]) counts[s.impacto]++; });
    return counts;
  }, [solutions]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-[#004B63] mb-2">Selecciona tus Procesos</h3>
        <p className="text-slate-500 text-sm mb-6">
          Elegí los procesos que querés automatizar y descubrí las soluciones IA disponibles.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {allProcesses.map((p) => (
            <button
              key={p}
              onClick={() => toggleProcess(p)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                selected.includes(p)
                  ? 'border-[#4DA8C4] bg-[#4DA8C4]/5 text-[#004B63]'
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selected.includes(p) ? 'bg-[#4DA8C4] text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={processIcons[p] || 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'} />
                </svg>
              </div>
              <span className="text-[10px] font-semibold leading-tight">{p}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {selected.length > 0
              ? `${selected.length} proceso${selected.length > 1 ? 's' : ''} seleccionado${selected.length > 1 ? 's' : ''}`
              : 'Ningún proceso seleccionado'}
          </span>
          <button
            onClick={() => setShowResults(true)}
            disabled={selected.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Ver Soluciones IA
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showResults && solutions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#004B63]">
                  Soluciones IA ({solutions.length})
                </h3>
                <div className="flex gap-3">
                  {Object.entries(impactoCount).filter(([_, c]) => c > 0).map(([k, v]) => (
                    <span key={k} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      k === 'Alto' ? 'bg-green-100 text-green-700' :
                      k === 'Medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {solutions.map((sol, i) => (
                  <motion.div
                    key={`${sol.name}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#4DA8C4]" />
                      <h4 className="text-sm font-bold text-[#004B63]">{sol.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{sol.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{sol.tools}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        sol.impacto === 'Alto' ? 'text-green-600 bg-green-50' :
                        sol.impacto === 'Medio' ? 'text-amber-600 bg-amber-50' :
                        'text-slate-500 bg-slate-50'
                      }`}>{sol.impacto}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => onGeneratePlan?.(selected)}
                  className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all"
                >
                  Generar Arquitectura con estos Procesos
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutomationProcessDiscovery;
