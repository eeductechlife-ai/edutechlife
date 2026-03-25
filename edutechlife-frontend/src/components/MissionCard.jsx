import React, { useState, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Zap, 
  Users, 
  CheckCircle, 
  PlayCircle,
  TrendingUp,
  Lock,
  Star,
  Award
} from 'lucide-react';

const difficultyColors = {
  easy: { bg: 'bg-[#66CCCC]/20', text: 'text-[#66CCCC]', border: 'border-[#66CCCC]/30' },
  medium: { bg: 'bg-[#FFD166]/20', text: 'text-[#FFD166]', border: 'border-[#FFD166]/30' },
  hard: { bg: 'bg-[#FF6B9D]/20', text: 'text-[#FF6B9D]', border: 'border-[#FF6B9D]/30' },
  expert: { bg: 'bg-[#9D4EDD]/20', text: 'text-[#9D4EDD]', border: 'border-[#9D4EDD]/30' },
};

const missionIcons = {
  quiz: '❓',
  challenge: '⚡',
  project: '🛠️',
  research: '🔍',
  collaboration: '👥',
  creative: '🎨',
};

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

const MissionCard = memo(({ mission, onStart, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyConfig = useMemo(() => 
    difficultyColors[mission.difficulty] || difficultyColors.easy,
    [mission.difficulty]
  );

  const handleStart = useCallback((e) => {
    e.stopPropagation();
    onStart?.(mission);
  }, [onStart, mission]);

  const handleComplete = useCallback((e) => {
    e.stopPropagation();
    onComplete?.(mission);
  }, [onComplete, mission]);

  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <motion.div
      layout
      className={`
        relative rounded-2xl border transition-all duration-500 overflow-hidden
        ${mission.completed
          ? 'border-[#66CCCC] bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5'
          : 'border-[#E2E8F0] hover:border-[#4DA8C4]/30 bg-white hover:shadow-lg'
        }
        ${isHovered ? 'transform -translate-y-1 shadow-xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleExpand}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <motion.div 
              className={`relative ${mission.completed ? 'scale-110' : ''}`}
              animate={{ scale: mission.completed ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg
                ${mission.completed
                  ? 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
                  : 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]'
                }
              `}>
                {missionIcons[mission.type] || '🎯'}
              </div>
              
              {mission.featured && (
                <motion.div 
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD166] to-[#FF6B9D] flex items-center justify-center shadow-lg">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold font-montserrat tracking-tight text-[#004B63]">
                  {mission.title}
                </h3>
                
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}
                `}>
                  {mission.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-[#B2D8E5]/80 font-open-sans mb-4">
                {mission.description}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#64748B]" />
                  <span className="text-sm text-[#64748B] font-open-sans">
                    {formatTime(mission.duration)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFD166]" />
                  <span className="text-sm font-semibold text-[#FFD166] font-open-sans">
                    +{mission.xpReward} XP
                  </span>
                </div>
                
                {mission.collaborative && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="text-sm text-[#4DA8C4] font-open-sans">
                      Colaborativo
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {mission.completed ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#66CCCC]/20 border border-[#66CCCC]/30">
                <CheckCircle className="w-4 h-4 text-[#66CCCC]" />
                <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
                  Completada
                </span>
              </div>
            ) : mission.locked ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]">
                <Lock className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-sm font-semibold text-[#94A3B8] font-open-sans">
                  Nivel {mission.requiredLevel}+
                </span>
              </div>
            ) : (
              <motion.button
                onClick={handleStart}
                className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white font-open-sans">
                    Iniciar Misión
                  </span>
                </div>
              </motion.button>
            )}
            
            {mission.progress > 0 && !mission.completed && (
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#64748B] font-open-sans">Progreso</span>
                  <span className="text-xs font-semibold text-[#66CCCC] font-open-sans">
                    {mission.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E2E8F0] px-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#334155] mb-3 font-open-sans">
                    Habilidades Desarrolladas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mission.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-[#4DA8C4]/10 border border-[#4DA8C4]/20 text-sm text-[#004B63] font-open-sans"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#334155] mb-3 font-open-sans">
                    Recompensas
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FFD166]" />
                        <span className="text-sm text-[#64748B] font-open-sans">Experiencia</span>
                      </div>
                      <span className="text-sm font-semibold text-[#FFD166] font-open-sans">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                    
                    {mission.badgeReward && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#66CCCC]" />
                          <span className="text-sm text-[#64748B] font-open-sans">Insignia</span>
                        </div>
                        <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
                          {mission.badgeReward}
                        </span>
                      </div>
                    )}
                    
                    {mission.streakBonus && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#FF6B9D]" />
                          <span className="text-sm text-[#64748B] font-open-sans">Bonus de Racha</span>
                        </div>
                        <span className="text-sm font-semibold text-[#FF6B9D] font-open-sans">
                          +{mission.streakBonus}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {mission.prerequisites?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <h4 className="text-sm font-semibold text-[#334155] mb-2 font-open-sans">
                    Prerrequisitos
                  </h4>
                  <div className="flex items-center gap-2">
                    {mission.prerequisites.map((prereq, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]"
                      >
                        <Target className="w-3 h-3 text-[#64748B]" />
                        <span className="text-sm text-[#64748B] font-open-sans">
                          {prereq}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                {!mission.completed && !mission.locked && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                      className="px-4 py-2 rounded-full border border-[#E2E8F0] text-sm text-[#64748B] font-open-sans hover:bg-[#F1F5F9] transition-colors"
                    >
                      Más tarde
                    </button>
                    
                    <motion.button
                      onClick={handleStart}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-sm font-semibold text-white font-open-sans hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Iniciar Ahora
                    </motion.button>
                  </>
                )}
                
                {mission.completed && (
                  <motion.button
                    onClick={handleComplete}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] text-sm font-semibold text-white font-open-sans shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ver Certificado
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mission.completed && (
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -inset-2 bg-[#66CCCC] rounded-full opacity-20 blur-sm"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

MissionCard.displayName = 'MissionCard';

export default MissionCard;
