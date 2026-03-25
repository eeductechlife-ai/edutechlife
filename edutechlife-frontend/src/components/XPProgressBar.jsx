import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Flame, Star, Target, Award } from 'lucide-react';

const levelThresholds = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
];

const levelTitles = [
  'Novato', 'Aprendiz', 'Estudiante', 'Avanzado', 'Experto',
  'Maestro', 'Sabio', 'Genio', 'Prodigio', 'Leyenda',
  'Ícono', 'Mito', 'Deidad', 'Cosmos', 'Infinito'
];

const achievements = [
  { id: 1, name: 'Primeros Pasos', icon: Star, completed: true, xp: 50 },
  { id: 2, name: 'Racha de 7 días', icon: Flame, completed: true, xp: 100 },
  { id: 3, name: 'Master en Matemáticas', icon: Trophy, completed: true, xp: 200 },
  { id: 4, name: 'Lab IA Completado', icon: Zap, completed: false, xp: 150 },
  { id: 5, name: 'Racha de 30 días', icon: Flame, completed: false, xp: 300 },
  { id: 6, name: 'Todas las Misiones', icon: Target, completed: false, xp: 500 },
];

const LevelUpCelebration = memo(({ level, xpForNextLevel, xpInCurrentLevel, onClose }) => {
  const title = levelTitles[level - 1] || 'Leyenda';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#9D4EDD] rounded-full blur-xl opacity-60"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative bg-white p-8 rounded-2xl border-2 border-[#66CCCC] shadow-2xl">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Trophy className="w-16 h-16 text-[#FFD166] mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-[#004B63] font-montserrat mb-2">
              ¡Nivel {level} Alcanzado!
            </h3>
            <p className="text-[#64748B] font-open-sans">
              Ahora eres <span className="text-[#FFD166] font-bold">{title}</span>
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#66CCCC]/20">
              <Zap className="w-4 h-4 text-[#FFD166]" />
              <span className="text-sm font-semibold text-[#004B63]">
                +{xpForNextLevel - xpInCurrentLevel} XP obtenidos
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

LevelUpCelebration.displayName = 'LevelUpCelebration';

const AchievementCard = memo(({ achievement }) => {
  const Icon = achievement.icon;

  return (
    <motion.div
      className={`
        p-3 rounded-xl border transition-all duration-300
        ${achievement.completed
          ? 'bg-[#66CCCC]/10 border-[#66CCCC]/30'
          : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }
      `}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg
          ${achievement.completed ? 'bg-[#66CCCC]/20' : 'bg-[#E2E8F0]'}
        `}>
          <Icon className={`w-4 h-4 ${
            achievement.completed ? 'text-[#66CCCC]' : 'text-[#64748B]'
          }`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`
              text-sm font-medium
              ${achievement.completed ? 'text-[#004B63]' : 'text-[#64748B]'}
            font-open-sans`}>
              {achievement.name}
            </span>
            <span className={`
              text-xs font-semibold
              ${achievement.completed ? 'text-[#FFD166]' : 'text-[#94A3B8]'}
            `}>
              +{achievement.xp} XP
            </span>
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${
                  achievement.completed
                    ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]'
                    : 'bg-gradient-to-r from-[#94A3B8] to-[#64748B]'
                }`}
                initial={{ width: 0 }}
                animate={{ width: achievement.completed ? '100%' : '0%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {achievement.completed && (
              <Star className="w-3 h-3 text-[#FFD166]" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

AchievementCard.displayName = 'AchievementCard';

const XPProgressBar = memo(({ currentXP = 1250, level = 8, streak = 14 }) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedLevel, setAnimatedLevel] = useState(level - 1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const levelData = useMemo(() => {
    const currentLevelXP = levelThresholds[level - 1] || 0;
    const nextLevelXP = levelThresholds[level] || 10000;
    const xpForNextLevel = nextLevelXP - currentLevelXP;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const progressPercentage = (xpInCurrentLevel / xpForNextLevel) * 100;
    
    return {
      currentLevelXP,
      nextLevelXP,
      xpForNextLevel,
      xpInCurrentLevel,
      progressPercentage,
      title: levelTitles[level - 1] || 'Leyenda',
      nextTitle: levelTitles[level] || 'Leyenda',
    };
  }, [currentXP, level]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedXP(currentXP);
      setAnimatedLevel(level);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentXP, level]);

  useEffect(() => {
    if (animatedLevel === level && level > 1) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [animatedLevel, level]);

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpCelebration
            level={level}
            xpForNextLevel={levelData.xpForNextLevel}
            xpInCurrentLevel={levelData.xpInCurrentLevel}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </AnimatePresence>

      <div className="p-6">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h3 className="text-lg font-bold text-[#004B63] font-montserrat tracking-tight">
              Progreso de Aprendizaje
            </h3>
            <p className="text-sm text-[#64748B] font-open-sans">
              Sigue avanzando hacia la excelencia
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-[#4DA8C4] font-montserrat"
                key={animatedLevel}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {animatedLevel}
              </motion.div>
              <div className="text-xs text-[#64748B] font-open-sans mt-1">
                Nivel
              </div>
            </div>
            
            <div className="h-12 w-px bg-[#E2E8F0]"></div>
            
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-[#004B63] font-montserrat flex items-center gap-1"
                key={animatedXP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Zap className="w-5 h-5 text-[#FFD166]" />
                {animatedXP.toLocaleString()}
              </motion.div>
              <div className="text-xs text-[#64748B] font-open-sans mt-1">
                Puntos XP
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#334155] font-open-sans">
              Nivel {level}: {levelData.title}
            </span>
            <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
              {levelData.xpInCurrentLevel.toLocaleString()} / {levelData.xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          
          <div className="relative h-4 rounded-full bg-[#E2E8F0] overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#9D4EDD] transition-all duration-1000 ease-out"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelData.progressPercentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
            </motion.div>
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs text-[#64748B] font-open-sans">
              {levelData.currentLevelXP.toLocaleString()} XP
            </span>
            <span className="text-xs text-[#64748B] font-open-sans">
              {levelData.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="bg-[#FF6B9D]/10 p-4 rounded-xl border border-[#FF6B9D]/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FF6B9D]/20">
                <Flame className="w-5 h-5 text-[#FF6B9D]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#004B63] font-montserrat">
                  {streak}
                </div>
                <div className="text-xs text-[#64748B] font-open-sans">
                  Días de racha
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#FFD166]/10 p-4 rounded-xl border border-[#FFD166]/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FFD166]/20">
                <Target className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#004B63] font-montserrat">
                  23
                </div>
                <div className="text-xs text-[#64748B] font-open-sans">
                  Misiones completadas
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#66CCCC]/10 p-4 rounded-xl border border-[#66CCCC]/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#66CCCC]/20">
                <Award className="w-5 h-5 text-[#66CCCC]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#004B63] font-montserrat">
                  12
                </div>
                <div className="text-xs text-[#64748B] font-open-sans">
                  Logros desbloqueados
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-sm font-semibold text-[#334155] mb-4 font-open-sans">
            Logros Pendientes
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-6 pt-6 border-t border-[#E2E8F0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#334155] font-open-sans">
                Próximo Nivel: {levelData.nextTitle}
              </h4>
              <p className="text-xs text-[#64748B] font-open-sans mt-1">
                Necesitas {(levelData.nextLevelXP - currentXP).toLocaleString()} XP más
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                <span className="text-xs font-semibold text-white">
                  {Math.ceil((levelData.nextLevelXP - currentXP) / 100)} días estimados
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

XPProgressBar.displayName = 'XPProgressBar';

export default XPProgressBar;
