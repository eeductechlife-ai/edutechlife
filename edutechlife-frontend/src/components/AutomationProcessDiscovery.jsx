import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/I18nProvider';
import { getProcessToSolutions, getProcesosOptions, getProcesoIcons } from './AutomationData';

const AutomationProcessDiscovery = ({ onGeneratePlan }) => {
  const { t, locale } = useTranslation();
  const processToSolutions = getProcessToSolutions(locale);
  const allProcesses = getProcesosOptions(locale);
  const processIcons = getProcesoIcons();
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
    const enToEs = { High: 'Alto', Medium: 'Medio', Low: 'Bajo' };
    solutions.forEach(s => {
      const key = enToEs[s.impacto] || s.impacto;
      if (counts[key]) counts[key]++;
    });
    return counts;
  }, [solutions]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-[#004B63] mb-2">{t('automation.discovery.title')}</h3>
        <p className="text-slate-500 text-sm mb-6">
          {t('automation.discovery.subtitle')}
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
              : t('automation.discovery.no_selection')}
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
                  {`${t('automation.discovery.solutions_found')} (${solutions.length})`}
                </h3>
                <div className="flex gap-3">
                  {Object.entries(impactoCount).filter(([_, c]) => c > 0).map(([k, v]) => (
                    <span key={k} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      k === 'Alto' ? 'bg-green-100 text-green-700' :
                      k === 'Medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {t(`automation.discovery.impacto_${k.toLowerCase()}`)}: {v}
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
                        sol.impacto === 'Alto' || sol.impacto === 'High' ? 'text-green-600 bg-green-50' :
                        sol.impacto === 'Medio' || sol.impacto === 'Medium' ? 'text-amber-600 bg-amber-50' :
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
                  {t('automation.discovery.btn_plan')}
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
