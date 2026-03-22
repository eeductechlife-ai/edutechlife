import React, { useEffect, useState } from 'react';
import { Trophy, Zap, Flame, Star, Target, Award } from 'lucide-react';

const XPProgressBar = ({ currentXP = 1250, level = 8, streak = 14 }) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedLevel, setAnimatedLevel] = useState(level - 1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const levelThresholds = [
    0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
    3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
  ];

  const currentLevelXP = levelThresholds[level - 1] || 0;
  const nextLevelXP = levelThresholds[level] || 10000;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const progressPercentage = (xpInCurrentLevel / xpForNextLevel) * 100;

  const achievements = [
    { id: 1, name: 'Primeros Pasos', icon: Star, completed: true, xp: 50 },
    { id: 2, name: 'Racha de 7 días', icon: Flame, completed: true, xp: 100 },
    { id: 3, name: 'Master en Matemáticas', icon: Trophy, completed: true, xp: 200 },
    { id: 4, name: 'Lab IA Completado', icon: Zap, completed: false, xp: 150 },
    { id: 5, name: 'Racha de 30 días', icon: Flame, completed: false, xp: 300 },
    { id: 6, name: 'Todas las Misiones', icon: Target, completed: false, xp: 500 },
  ];

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

  const getLevelTitle = (lvl) => {
    const titles = [
      'Novato', 'Aprendiz', 'Estudiante', 'Avanzado', 'Experto',
      'Maestro', 'Sabio', 'Genio', 'Prodigio', 'Leyenda',
      'Ícono', 'Mito', 'Deidad', 'Cosmos', 'Infinito'
    ];
    return titles[lvl - 1] || 'Leyenda';
  };

  return (
    <div className="w-full">
      {/* Level Up Celebration */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#9D4EDD] rounded-full blur-xl opacity-60 animate-ping"></div>
            <div className="relative glass-card p-8 rounded-2xl border-2 border-[#66CCCC]/50 backdrop-blur-xl">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-[#FFD166] mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white font-montserrat mb-2">
                  ¡Nivel {level} Alcanzado!
                </h3>
                <p className="text-[#B2D8E5] font-open-sans">
                  Ahora eres <span className="text-[#FFD166] font-bold">{getLevelTitle(level)}</span>
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#66CCCC]/20">
                  <Zap className="w-4 h-4 text-[#FFD166]" />
                  <span className="text-sm font-semibold text-white">
                    +{xpForNextLevel - xpInCurrentLevel} XP obtenidos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Progress Container */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-montserrat tracking-tight">
              Progreso de Aprendizaje
            </h3>
            <p className="text-sm text-[#B2D8E5]/70 font-open-sans">
              Sigue avanzando hacia la excelencia
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-montserrat">
                {animatedLevel}
              </div>
              <div className="text-xs text-[#B2D8E5]/60 font-open-sans mt-1">
                Nivel
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/10"></div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-montserrat flex items-center gap-1">
                <Zap className="w-5 h-5 text-[#FFD166]" />
                {animatedXP.toLocaleString()}
              </div>
              <div className="text-xs text-[#B2D8E5]/60 font-open-sans mt-1">
                Puntos XP
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white font-open-sans">
              Nivel {level}: {getLevelTitle(level)}
            </span>
            <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
              {xpInCurrentLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          
          <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#004B63]/30 via-[#4DA8C4]/30 to-[#66CCCC]/30 animate-gradient-x"></div>
            
            {/* Progress fill */}
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#9D4EDD] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            </div>
            
            {/* Level markers */}
            <div className="absolute inset-0 flex">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute top-1/2 w-px h-6 -translate-y-1/2 bg-white/20"
                  style={{ left: `${percent}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/60 font-open-sans">
              {currentLevelXP.toLocaleString()} XP
            </span>
            <span className="text-xs text-white/60 font-open-sans">
              {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Streak & Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FF6B9D]/20">
                <Flame className="w-5 h-5 text-[#FF6B9D]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-montserrat">
                  {streak}
                </div>
                <div className="text-xs text-white/60 font-open-sans">
                  Días de racha
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FFD166]/20">
                <Target className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-montserrat">
                  23
                </div>
                <div className="text-xs text-white/60 font-open-sans">
                  Misiones completadas
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#66CCCC]/20">
                <Award className="w-5 h-5 text-[#66CCCC]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-montserrat">
                  12
                </div>
                <div className="text-xs text-white/60 font-open-sans">
                  Logros desbloqueados
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-4 font-open-sans">
            Logros Pendientes
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    achievement.completed
                      ? 'bg-[#66CCCC]/10 border-[#66CCCC]/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.completed
                        ? 'bg-[#66CCCC]/20'
                        : 'bg-white/10'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        achievement.completed ? 'text-[#66CCCC]' : 'text-white/60'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          achievement.completed ? 'text-white' : 'text-white/70'
                        } font-open-sans`}>
                          {achievement.name}
                        </span>
                        <span className={`text-xs font-semibold ${
                          achievement.completed ? 'text-[#FFD166]' : 'text-white/40'
                        }`}>
                          +{achievement.xp} XP
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              achievement.completed
                                ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]'
                                : 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4]'
                            }`}
                            style={{ width: achievement.completed ? '100%' : '0%' }}
                          ></div>
                        </div>
                        {achievement.completed && (
                          <Star className="w-3 h-3 text-[#FFD166]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Level Preview */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white font-open-sans">
                Próximo Nivel: {getLevelTitle(level + 1)}
              </h4>
              <p className="text-xs text-[#B2D8E5]/60 font-open-sans mt-1">
                Necesitas {(nextLevelXP - currentXP).toLocaleString()} XP más
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#004B63] to-[#4DA8C4]">
                <span className="text-xs font-semibold text-white">
                  {Math.ceil((nextLevelXP - currentXP) / 100)} días estimados
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPProgressBar;