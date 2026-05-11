import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const WEIGHT_LABELS = {
  Comunidad: '5% del puntaje del módulo',
  Desafío: '30% del puntaje del módulo',
  Examen: '35% del puntaje del módulo',
};

const ActionCard = ({ icon, label, onClick, completed, score, color = 'from-petroleum to-corporate' }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      title={WEIGHT_LABELS[label] || ''}
      className={`relative w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
        completed
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-50/50 border-emerald-200/60 hover:shadow-md hover:border-emerald-300'
          : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md hover:border-petroleum/30 dark:hover:border-petroleum/40'
      }`}
    >
      {completed && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
          <Icon name="fa-check" className="text-white text-[10px]" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200 ${
        completed
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
          : 'bg-gradient-to-br from-petroleum to-corporate group-hover:shadow-md'
      }`}>
        <Icon name={icon} className="text-white text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm truncate ${
            completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100 group-hover:text-petroleum dark:group-hover:text-[#4DA8C4]'
          }`}>
            {label}
          </span>
        </div>
        <span className={`text-xs ${
          completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
        }`}>
          {completed ? `${score}% - Completado` : 'Pendiente'}
        </span>
      </div>
      {completed && score !== undefined && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{score}%</span>
        </div>
      )}
    </motion.button>
  );
};

const ModuleActions = ({ onAction, activeMod, challengeScores, completedExams, moduleProgress, isForumOpen, onToggleForum }) => {
  const handleCommunity = () => {
    onToggleForum?.();
    // Scroll to forum after it renders
    setTimeout(() => {
      document.getElementById('forum-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  };

  const handleChallenge = () => {
    if (challengeScores?.[activeMod]) {
      onAction?.('SHOW_CHALLENGE_RESULT');
    } else {
      onAction?.('OPEN_CHALLENGE');
    }
  };

  const handleExam = () => {
    if (completedExams?.[activeMod]) {
      onAction?.('SHOW_EXAM_RESULT');
    } else {
      onAction?.('OPEN_QUIZ');
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4 md:p-5">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon name="fa-bolt" className="text-white text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-petroleum dark:text-[#4DA8C4] leading-tight">Actividades del Módulo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Completa cada actividad para aprobar el módulo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ActionCard
          icon="fa-comments"
          label="Comunidad"
          onClick={handleCommunity}
          completed={moduleProgress?.[activeMod]?.community}
          score={100}
        />
        <ActionCard
          icon="fa-rocket"
          label="Desafío"
          onClick={handleChallenge}
          completed={!!challengeScores?.[activeMod]}
          score={challengeScores?.[activeMod]}
        />
        <ActionCard
          icon="fa-clipboard-check"
          label="Examen"
          onClick={handleExam}
          completed={!!completedExams?.[activeMod]}
          score={completedExams?.[activeMod]}
        />
      </div>
    </div>
  );
};

export default ModuleActions;
