import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';

const readLocalExamScores = () => {
  try {
    return JSON.parse(localStorage.getItem('ialab_completed_exams') || '{}');
  } catch { return {}; }
};

const WEIGHT_LABELS = {
  Comunidad: '5% del puntaje del módulo',
  Desafío: '30% del puntaje del módulo',
  Examen: '35% del puntaje del módulo',
};

const ActionCard = ({ icon, label, onClick, completed, score, remainingAttempts, color = 'from-petroleum to-corporate' }) => {
  const prefersReducedMotion = useReducedMotion();
  const isApproved = completed && score !== undefined && score >= 80;
  const isFailed = completed && score !== undefined && score < 80;
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      title={WEIGHT_LABELS[label] || ''}
      className={`relative w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
        isApproved
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-50/50 border-emerald-200/60 hover:shadow-md hover:border-emerald-300'
          : isFailed
          ? 'bg-gradient-to-br from-red-50 to-red-50/50 border-red-200/60 hover:shadow-md hover:border-red-300'
          : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md hover:border-petroleum/30 dark:hover:border-petroleum/40'
      }`}
    >
      {isApproved && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
          <Icon name="fa-check" className="text-white text-[10px]" />
        </div>
      )}
      {isFailed && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
          <Icon name="fa-xmark" className="text-white text-[10px]" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200 ${
        isApproved
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
          : isFailed
          ? 'bg-gradient-to-br from-red-500 to-red-600'
          : 'bg-gradient-to-br from-petroleum to-corporate group-hover:shadow-md'
      }`}>
        <Icon name={icon} className="text-white text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm truncate ${
            isApproved ? 'text-emerald-700 dark:text-emerald-400' : isFailed ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100 group-hover:text-petroleum dark:group-hover:text-[#4DA8C4]'
          }`}>
            {label}
          </span>
        </div>
        <span className={`text-xs ${
          isApproved ? 'text-emerald-600 dark:text-emerald-400' : isFailed ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
        }`}>
          {isApproved ? `${score}% - Aprobado` : isFailed ? `${score}% - Reprobado` : 'Pendiente'}
        </span>
        {!completed && remainingAttempts !== undefined && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 block">
            {remainingAttempts} de 3 intentos restantes
          </span>
        )}
      </div>
      {(isApproved || isFailed) && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${
          isApproved ? 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-red-500/10 border-red-200 dark:border-red-500/30'
        }`}>
          <span className={`text-sm font-bold ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{score}%</span>
        </div>
      )}
    </motion.button>
  );
};

const ModuleActions = ({ onAction, activeMod, challengeScores, completedExams, moduleProgress, isForumOpen, onToggleForum }) => {
  const [localExamScores, setLocalExamScores] = useState(readLocalExamScores);
  const [examAttempts, setExamAttempts] = useState(3);
  const [challengeAttempts, setChallengeAttempts] = useState(3);
  const effectiveExamScore = completedExams?.[activeMod] ?? localExamScores[activeMod];

  const refreshAttempts = useCallback(() => {
    const store = useIALabStore.getState();
    setExamAttempts(store.getExamRemainingAttempts(activeMod));
    setChallengeAttempts(store.getChallengeRemainingAttempts(activeMod));
  }, [activeMod]);

  useEffect(() => {
    refreshAttempts();
  }, [activeMod, refreshAttempts]);

  useEffect(() => {
    const handler = () => setLocalExamScores(readLocalExamScores());
    window.addEventListener('ialab:examCompleted', handler);
    const interval = setInterval(refreshAttempts, 5000);
    return () => {
      window.removeEventListener('ialab:examCompleted', handler);
      clearInterval(interval);
    };
  }, [refreshAttempts]);

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
    if (effectiveExamScore !== undefined) {
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
          remainingAttempts={!challengeScores?.[activeMod] ? challengeAttempts : undefined}
        />
        <ActionCard
          icon="fa-clipboard-check"
          label="Examen"
          onClick={handleExam}
          completed={effectiveExamScore !== undefined}
          score={effectiveExamScore}
          remainingAttempts={effectiveExamScore === undefined ? examAttempts : undefined}
        />
      </div>
    </div>
  );
};

export default ModuleActions;
