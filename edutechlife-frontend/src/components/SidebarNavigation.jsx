import React, { useState } from 'react';
import { 
  Home, 
  Target, 
  BookOpen, 
  Cpu, 
  BarChart3,
  ChevronRight,
  Award,
  Clock
} from 'lucide-react';

const SidebarNavigation = ({ activeTab, onTabChange, onNavigate }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, color: 'text-[#4DA8C4]', bgActive: 'bg-[#4DA8C4]/20', badge: null },
    { id: 'misiones', label: 'Misiones', icon: Target, color: 'text-[#66CCCC]', bgActive: 'bg-[#66CCCC]/20', badge: '3' },
    { id: 'materias', label: 'Materias', icon: BookOpen, color: 'text-[#004B63]', bgActive: 'bg-[#004B63]/10', badge: '12' },
    { id: 'lab-ia', label: 'Lab IA', icon: Cpu, color: 'text-[#FF6B9D]', bgActive: 'bg-[#FF6B9D]/20', badge: 'Nuevo' },
    { id: 'progreso', label: 'Progreso', icon: BarChart3, color: 'text-[#FFD166]', bgActive: 'bg-[#FFD166]/20', badge: null },
  ];

  const stats = {
    xp: 1250,
    level: 8,
    streak: 14,
    missionsCompleted: 23
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-[#E2E8F0] shadow-lg">
      {/* Navigation Tabs */}
      <div className="flex-1 p-4 pt-6">
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
                    ? `${tab.bgActive} border-2 border-[#4DA8C4]/30 shadow-md`
                    : 'hover:bg-[#F1F5F9] border-2 border-transparent'
                } ${isHovered && !isActive ? 'transform translate-x-1' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${tab.color}`} />
                  </div>
                  <span className={`font-medium font-open-sans ${
                    isActive ? 'text-[#004B63] font-semibold' : 'text-[#64748B]'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tab.id === 'lab-ia'
                        ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]'
                        : 'bg-[#4DA8C4]/20 text-[#4DA8C4]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#4DA8C4]" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Stats Compact */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#FFD166]/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD166]" />
              <span className="text-xs text-[#64748B] font-open-sans">Nivel {stats.level}</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat">{stats.xp.toLocaleString()} XP</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#FF6B9D]/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B9D]" />
              <span className="text-xs text-[#64748B] font-open-sans">Racha</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat flex items-center gap-1">
              {stats.streak} 🔥
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#4DA8C4]/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4DA8C4]" />
              <span className="text-xs text-[#64748B] font-open-sans">Misiones</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat">{stats.missionsCompleted}</span>
          </div>
        </div>
      </div>

      {/* User Profile Compact */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#66CCCC] border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#004B63] font-open-sans">
              Estudiante Premium
            </h4>
            <p className="text-xs text-[#64748B] font-open-sans">
              Plan: Elite v2.286
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#64748B] font-open-sans">Progreso diario</span>
            <span className="text-xs font-semibold text-[#66CCCC] font-open-sans">78%</span>
          </div>
          <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              style={{ width: '78%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;