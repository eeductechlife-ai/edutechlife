import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/I18nProvider';
import { getMetrics, getStandards } from './AutomationData';

const AutomationHero = ({ onStartDiagnosis, onViewCases }) => {
  const { t, locale } = useTranslation();
  const metrics = getMetrics(locale);
  const standards = getStandards(locale);
  const navigate = useNavigate();
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [340, 60, 12, 42];
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCounts(targets.map(t => Math.min(Math.floor((t / steps) * step), t)));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#F0F8FA] to-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 -top-[300px] -right-[150px]"
             style={{ background: 'radial-gradient(circle, rgba(77,168,196,0.25), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 -bottom-[250px] -left-[100px]"
             style={{ background: 'radial-gradient(circle, rgba(0,75,99,0.2), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-1/3 right-[20%]"
             style={{ background: 'radial-gradient(circle, rgba(102,204,204,0.15), transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004B63] leading-tight mb-4">
            {t('automation.hero.title_1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
              {t('automation.hero.title_2')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('automation.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onStartDiagnosis}
              className="px-8 py-3.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full font-bold text-sm hover:shadow-[0_0_30px_rgba(0,75,99,0.3)] transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('automation.hero.btn_diagnosis')}
            </button>
            <button
              onClick={onViewCases}
              className="px-8 py-3.5 border-2 border-[#4DA8C4]/30 text-[#004B63] rounded-full font-semibold text-sm hover:border-[#4DA8C4] hover:bg-[#4DA8C4]/5 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('automation.hero.btn_cases')}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto mb-12">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 text-center shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: m.color }}>
                  {i === 0 ? `+${counts[0]}%` : i === 1 ? `-${counts[1]}%` : i === 2 ? `${counts[2]}+` : `${(counts[3] / 10).toFixed(1)}x`}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {t('automation.hero.standards_label')}
            </span>
            {standards.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"
              >
                <svg className="w-4 h-4 text-[#4DA8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-semibold text-[#004B63]">{s.name}</span>
                <span className="text-xs text-slate-400">— {s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AutomationHero;
