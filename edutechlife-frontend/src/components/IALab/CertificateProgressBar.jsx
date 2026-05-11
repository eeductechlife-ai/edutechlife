import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';

const CertificateProgressBar = () => {
  const { modules, calculateModuleScore, courseProgress } = useIALabContext();

  const moduleScores = modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    score: calculateModuleScore(mod.id),
    completed: calculateModuleScore(mod.id) >= 80,
  }));

  const completedCount = moduleScores.filter((m) => m.completed).length;

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4 md:p-5">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon name="fa-award" className="text-white text-sm" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">Progreso hacia tu certificado</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{completedCount} de 5 módulos aprobados</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-petroleum dark:text-white">{Math.round(courseProgress)}%</div>
          <div className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Global</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {moduleScores.map((mod, idx) => (
          <React.Fragment key={mod.id}>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                  mod.completed
                    ? 'bg-gradient-to-r from-petroleum to-corporate'
                    : mod.score > 0
                    ? 'bg-gradient-to-r from-petroleum/40 to-corporate/30'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                style={mod.score > 0 && !mod.completed ? { width: `${mod.score}%`, margin: '0 auto' } : {}}
              />
              <span
                className={`text-[9px] font-medium ${
                  mod.completed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {mod.completed ? (
                  <Icon name="fa-check-circle" className="text-xs" />
                ) : (
                  <span>{mod.id}</span>
                )}
              </span>
            </div>
            {idx < moduleScores.length - 1 && (
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CertificateProgressBar;
