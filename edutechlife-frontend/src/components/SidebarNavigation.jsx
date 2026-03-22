import React, { useState } from 'react';
import { 
  Home, 
  Target, 
  BookOpen, 
  Cpu, 
  BarChart3,
  ChevronRight,
  Sparkles,
  Zap,
  Award,
  Clock
} from 'lucide-react';

const SidebarNavigation = ({ activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, color: 'text-[#4DA8C4]', badge: null },
    { id: 'misiones', label: 'Misiones', icon: Target, color: 'text-[#66CCCC]', badge: '3' },
    { id: 'materias', label: 'Materias', icon: BookOpen, color: 'text-[#B2D8E5]', badge: '12' },
    { id: 'lab-ia', label: 'Lab IA', icon: Cpu, color: 'text-[#FF6B9D]', badge: 'Nuevo' },
    { id: 'progreso', label: 'Progreso', icon: BarChart3, color: 'text-[#FFD166]', badge: null },
  ];

  const stats = {
    xp: 1250,
    level: 8,
    streak: 14,
    missionsCompleted: 23
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0A1628]/90 to-[#004B63]/90 backdrop-blur-xl border-r border-white/10">
      {/* Header con logo y título */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-montserrat tracking-tight">
              SmartBoard v2.286
            </h2>
            <p className="text-xs text-[#B2D8E5]/70 font-open-sans">
              Premium Education Platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD166]" />
              <span className="text-xs text-white/80 font-open-sans">Nivel</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-montserrat">{stats.level}</span>
              <span className="text-xs text-[#B2D8E5]/60">/15</span>
            </div>
          </div>
          
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#66CCCC]" />
              <span className="text-xs text-white/80 font-open-sans">XP</span>
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-white font-montserrat">{stats.xp.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B9D]" />
              <span className="text-xs text-white/80 font-open-sans">Racha</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xl font-bold text-white font-montserrat">{stats.streak}</span>
              <span className="text-xs text-[#FF6B9D]">🔥</span>
            </div>
          </div>
          
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4DA8C4]" />
              <span className="text-xs text-white/80 font-open-sans">Misiones</span>
            </div>
            <div className="mt-1">
              <span className="text-xl font-bold text-white font-montserrat">{stats.missionsCompleted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#004B63]/40 to-[#4DA8C4]/20 border border-white/20 shadow-lg shadow-[#004B63]/20'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                } ${isHovered && !isActive ? 'transform -translate-x-1' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${tab.color}`} />
                    {isActive && (
                      <div className="absolute -inset-1 bg-current opacity-10 blur-sm rounded-full"></div>
                    )}
                  </div>
                  <span className={`font-medium font-open-sans ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tab.id === 'lab-ia'
                        ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]'
                        : 'bg-[#4DA8C4]/20 text-[#4DA8C4]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#4DA8C4] animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Settings */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#66CCCC] border-2 border-[#0A1628]"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white font-open-sans">
                Estudiante Premium
              </h4>
              <p className="text-xs text-[#B2D8E5]/60 font-open-sans">
                Plan: Elite v2.286
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 font-open-sans">Progreso diario</span>
              <span className="text-xs font-semibold text-[#66CCCC] font-open-sans">78%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                style={{ width: '78%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;