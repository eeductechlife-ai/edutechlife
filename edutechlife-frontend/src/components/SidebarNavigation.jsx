import React, { useState, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  BookOpen, 
  Cpu, 
  BarChart3,
  ChevronRight,
  Award,
  Clock,
  LogOut
} from 'lucide-react';

const tabsConfig = [
  { id: 'inicio', label: 'Inicio', icon: Home, color: 'text-[#4DA8C4]', bgActive: 'bg-[#4DA8C4]/20', badge: null },
  { id: 'misiones', label: 'Misiones', icon: Target, color: 'text-[#66CCCC]', bgActive: 'bg-[#66CCCC]/20', badge: '3' },
  { id: 'materias', label: 'Materias', icon: BookOpen, color: 'text-[#004B63]', bgActive: 'bg-[#004B63]/10', badge: '12' },
  { id: 'lab-ia', label: 'Lab IA', icon: Cpu, color: 'text-[#FF6B9D]', bgActive: 'bg-[#FF6B9D]/20', badge: 'Nuevo' },
  { id: 'progreso', label: 'Progreso', icon: BarChart3, color: 'text-[#FFD166]', bgActive: 'bg-[#FFD166]/20', badge: null },
];

const TabButton = memo(({ 
  tab, 
  isActive, 
  onClick 
}) => {
  const Icon = tab.icon;

  return (
    <motion.button
      key={tab.id}
      onClick={() => onClick(tab.id)}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl
        transition-all duration-300 ease-out
        ${isActive
          ? `${tab.bgActive} border-2 border-[#4DA8C4]/30 shadow-md`
          : 'hover:bg-[#F1F5F9] border-2 border-transparent'
        }
      `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="relative"
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <Icon className={`w-5 h-5 ${tab.color}`} />
        </motion.div>
        <span className={`
          font-medium font-open-sans
          ${isActive ? 'text-[#004B63] font-semibold' : 'text-[#64748B]'}
        `}>
          {tab.label}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {tab.badge && (
          <motion.span 
            className={`
              px-2 py-1 rounded-full text-xs font-semibold
              ${tab.id === 'lab-ia'
                ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]'
                : 'bg-[#4DA8C4]/20 text-[#4DA8C4]'
              }
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {tab.badge}
          </motion.span>
        )}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <ChevronRight className="w-4 h-4 text-[#4DA8C4]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
});

TabButton.displayName = 'TabButton';

const SidebarNavigation = memo(({ 
  activeTab, 
  onTabChange, 
  onNavigate, 
  onLogout 
}) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  const stats = useMemo(() => ({
    xp: 1250,
    level: 8,
    streak: 14,
    missionsCompleted: 23
  }), []);

  const handleTabClick = useCallback((tabId) => {
    onTabChange?.(tabId);
  }, [onTabChange]);

  return (
    <motion.div 
      className="h-full flex flex-col bg-white border-r border-[#E2E8F0] shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 p-4 pt-6">
        <nav className="space-y-2">
          {tabsConfig.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={handleTabClick}
            />
          ))}
        </nav>

        <motion.div 
          className="mt-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div 
            className="flex items-center justify-between p-3 bg-[#FFD166]/10 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD166]" />
              <span className="text-xs text-[#64748B] font-open-sans">Nivel {stats.level}</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat">
              {stats.xp.toLocaleString()} XP
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between p-3 bg-[#FF6B9D]/10 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B9D]" />
              <span className="text-xs text-[#64748B] font-open-sans">Racha</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat flex items-center gap-1">
              {stats.streak} 🔥
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between p-3 bg-[#4DA8C4]/10 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4DA8C4]" />
              <span className="text-xs text-[#64748B] font-open-sans">Misiones</span>
            </div>
            <span className="text-lg font-bold text-[#004B63] font-montserrat">
              {stats.missionsCompleted}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="p-4 border-t border-[#E2E8F0]">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#64748B] font-open-sans">Progreso diario</span>
            <span className="text-xs font-semibold text-[#66CCCC] font-open-sans">78%</span>
          </div>
          <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <motion.button
          onClick={onLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FF6B9D]/10 border border-[#FF6B9D]/20 rounded-xl hover:bg-[#FF6B9D]/20 transition-all duration-300 group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <LogOut className="w-4 h-4 text-[#FF6B9D]" />
          <span className="text-sm font-semibold text-[#FF6B9D] font-open-sans">
            Cerrar Sesión
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
});

SidebarNavigation.displayName = 'SidebarNavigation';

export default SidebarNavigation;
