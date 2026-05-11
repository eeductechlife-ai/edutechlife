import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const ModuleProgressBar = ({ moduleScore, activeMod, totalModules = 5, challengeScores, completedExams }) => {
  const challengeDone = challengeScores?.[activeMod];
  const examDone = completedExams?.[activeMod];

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4 md:p-5">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-md flex-shrink-0">
            <Icon name="fa-chart-line" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">Progreso del Módulo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Módulo {activeMod} de {totalModules}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl md:text-3xl font-bold text-petroleum dark:text-white">{moduleScore}%</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Completado</div>
        </div>
      </div>

      <div className="h-3 md:h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-petroleum via-corporate to-corporate rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${moduleScore}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" style={{ width: `${Math.min(100, 100 - moduleScore + 10)}%`, left: `${moduleScore - 10}%`, opacity: moduleScore > 10 ? 0.3 : 0 }} />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Icon name="fa-file" className="text-xs" />
          Recursos
        </span>
        {challengeDone && (
          <span className="flex items-center gap-1">
            <Icon name="fa-rocket" className="text-xs" />
            Desafío: {challengeDone}%
          </span>
        )}
        {examDone && (
          <span className="flex items-center gap-1">
            <Icon name="fa-clipboard-check" className="text-xs" />
            Examen: {examDone}%
          </span>
        )}
        {!challengeDone && (
          <span className="flex items-center gap-1 text-amber-500">
            <Icon name="fa-hourglass" className="text-xs" />
            Desafío pendiente
          </span>
        )}
        {!examDone && (
          <span className="flex items-center gap-1 text-amber-500">
            <Icon name="fa-hourglass" className="text-xs" />
            Examen pendiente
          </span>
        )}
      </div>
    </div>
  );
};

export default ModuleProgressBar;
