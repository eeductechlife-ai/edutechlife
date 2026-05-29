import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/I18nProvider';
import { getCases } from './AutomationData';

const AutomationCaseStudies = () => {
  const { t, locale } = useTranslation();
  const cases = getCases(locale);
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
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">{t('automation.cases.problema')}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.problema}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">{t('automation.cases.solucion')}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.solucion}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#004B63] uppercase tracking-wider mb-2">{t('automation.cases.resultados')}</h4>
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
