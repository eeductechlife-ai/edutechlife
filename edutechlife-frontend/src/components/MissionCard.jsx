import React, { useState } from 'react';
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

const MissionCard = ({ mission, onStart, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    easy: { bg: 'bg-[#66CCCC]/20', text: 'text-[#66CCCC]', border: 'border-[#66CCCC]/30' },
    medium: { bg: 'bg-[#FFD166]/20', text: 'text-[#FFD166]', border: 'border-[#FFD166]/30' },
    hard: { bg: 'bg-[#FF6B9D]/20', text: 'text-[#FF6B9D]', border: 'border-[#FF6B9D]/30' },
    expert: { bg: 'bg-[#9D4EDD]/20', text: 'text-[#9D4EDD]', border: 'border-[#9D4EDD]/30' },
  };

  const difficultyConfig = difficultyColors[mission.difficulty] || difficultyColors.easy;

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getMissionIcon = (type) => {
    const icons = {
      quiz: '❓',
      challenge: '⚡',
      project: '🛠️',
      research: '🔍',
      collaboration: '👥',
      creative: '🎨',
    };
    return icons[type] || '🎯';
  };

  return (
    <div
      className={`relative glass-card rounded-2xl border transition-all duration-500 overflow-hidden ${
        mission.completed
          ? 'border-[#66CCCC]/50 bg-gradient-to-br from-[#004B63]/20 to-[#66CCCC]/10'
          : 'border-white/10 hover:border-white/20 bg-gradient-to-br from-white/5 to-transparent'
      } ${isHovered ? 'transform -translate-y-1 shadow-2xl shadow-[#004B63]/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* 3D Hover Effect Layers */}
      {isHovered && !mission.completed && (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 blur-xl opacity-50"></div>
          <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
        </>
      )}

      {/* Mission Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Mission Icon */}
            <div className={`relative ${mission.completed ? 'scale-110' : ''} transition-transform duration-300`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                mission.completed
                  ? 'bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4]'
                  : 'bg-gradient-to-br from-[#004B63] to-[#0A1628]'
              }`}>
                {getMissionIcon(mission.type)}
              </div>
              
              {mission.featured && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD166] to-[#FF6B9D] flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Mission Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-lg font-bold font-montserrat tracking-tight ${
                  mission.completed ? 'text-white' : 'text-white'
                }`}>
                  {mission.title}
                </h3>
                
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}`}>
                  {mission.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-[#B2D8E5]/80 font-open-sans mb-4">
                {mission.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B2D8E5]/60" />
                  <span className="text-sm text-white/80 font-open-sans">
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

          {/* Action Button */}
          <div className="flex flex-col items-end gap-3">
            {mission.completed ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#66CCCC]/20 border border-[#66CCCC]/30">
                <CheckCircle className="w-4 h-4 text-[#66CCCC]" />
                <span className="text-sm font-semibold text-[#66CCCC] font-open-sans">
                  Completada
                </span>
              </div>
            ) : mission.locked ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Lock className="w-4 h-4 text-white/60" />
                <span className="text-sm font-semibold text-white/60 font-open-sans">
                  Nivel {mission.requiredLevel}+
                </span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart(mission);
                }}
                className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:from-[#66CCCC] hover:to-[#4DA8C4] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white font-open-sans">
                    Iniciar Misión
                  </span>
                </div>
              </button>
            )}
            
            {/* Progress Indicator */}
            {mission.progress > 0 && !mission.completed && (
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60 font-open-sans">Progreso</span>
                  <span className="text-xs font-semibold text-[#66CCCC] font-open-sans">
                    {mission.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] transition-all duration-1000"
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-white/10 px-6 py-4 animate-slide-down">
          <div className="grid grid-cols-2 gap-6">
            {/* Skills Gained */}
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-3 font-open-sans">
                Habilidades Desarrolladas
              </h4>
              <div className="flex flex-wrap gap-2">
                {mission.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-[#004B63]/30 border border-[#4DA8C4]/20 text-sm text-[#B2D8E5] font-open-sans"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h4 className="text-sm font-semibold text-white/80 mb-3 font-open-sans">
                Recompensas
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FFD166]" />
                    <span className="text-sm text-white/80 font-open-sans">Experiencia</span>
                  </div>
                  <span className="text-sm font-semibold text-[#FFD166] font-open-sans">
                    +{mission.xpReward} XP
                  </span>
                </div>
                
                {mission.badgeReward && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#66CCCC]" />
                      <span className="text-sm text-white/80 font-open-sans">Insignia</span>
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
                      <span className="text-sm text-white/80 font-open-sans">Bonus de Racha</span>
                    </div>
                    <span className="text-sm font-semibold text-[#FF6B9D] font-open-sans">
                      +{mission.streakBonus}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {mission.prerequisites && mission.prerequisites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-2 font-open-sans">
                Prerrequisitos
              </h4>
              <div className="flex items-center gap-2">
                {mission.prerequisites.map((prereq, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                  >
                    <Target className="w-3 h-3 text-white/60" />
                    <span className="text-sm text-white/60 font-open-sans">
                      {prereq}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {!mission.completed && !mission.locked && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="px-4 py-2 rounded-full border border-white/20 text-sm text-white/80 font-open-sans hover:bg-white/10 transition-colors"
                >
                  Más tarde
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart(mission);
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-sm font-semibold text-white font-open-sans hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all duration-300"
                >
                  Iniciar Ahora
                </button>
              </>
            )}
            
            {mission.completed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(mission);
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] text-sm font-semibold text-white font-open-sans"
              >
                Ver Certificado
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Badge */}
      {mission.completed && (
        <div className="absolute top-4 right-4">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -inset-2 bg-[#66CCCC] rounded-full opacity-20 blur-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionCard;