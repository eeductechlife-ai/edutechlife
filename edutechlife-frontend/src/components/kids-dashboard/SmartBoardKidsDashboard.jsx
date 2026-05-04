import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import ParticlesBackground from './ParticlesBackground';
import HeroSection from './HeroSection';
import DaniTutorChat from './DaniTutorChat';
import DaniAvatar3D from './DaniAvatar3D';
import KidsCalendar from './KidsCalendar';
import PointsRewardsSystem from './PointsRewardsSystem';
import NewsTechFeed from './NewsTechFeed';
import ActivityUploader from './ActivityUploader';
import { VAKDiagnosticEnhanced } from './VAKDiagnosticEnhanced';

// ==========================================
// Premium Sidebar - Glassmorphism
// ==========================================
const PremiumSidebar = ({ activeTab, onTabChange, totalPoints }) => {
  const tabs = [
    { id: 'inicio', icon: '🏠', label: 'Inicio', color: '#4DA8C4' },
    { id: 'dani', icon: '🤖', label: 'Dani Tutor', color: '#FFD166' },
    { id: 'actividades', icon: '📝', label: 'Actividades', color: '#66CCCC' },
    { id: 'calendario', icon: '📅', label: 'Calendario', color: '#FF6B9D' },
    { id: 'puntos', icon: '💎', label: 'Puntos', color: '#B2D8E5' },
    { id: 'noticias', icon: '📰', label: 'Noticias', color: '#004B63' },
    { id: 'vak', icon: '🧠', label: 'Mi VAK', color: '#66CCCC' },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="hidden md:flex w-64 flex-col h-full bg-white/80 backdrop-blur-xl border-r border-[#E2E8F0] relative z-20"
    >
      {/* Logo Area */}
      <div className="p-6 border-b border-[#E2E8F0]/50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 400, delay: 0.3 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#004B63] to-[#4DA8C4] bg-clip-text text-transparent">
            SmartBoard
          </h2>
        </motion.div>
        <p className="text-xs text-[#64748B] mt-1">Premium SaaS</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : 'text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl -z-10"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            
            <span className="relative z-10 text-xl">{tab.icon}</span>
            <span className="relative z-10 font-semibold text-sm">{tab.label}</span>
            
            {/* Points badge on sidebar */}
            {tab.id === 'puntos' && (
              <motion.div
                className="ml-auto relative z-10 w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-[10px] font-bold text-[#004B63]">
                  {totalPoints >= 1000 ? '1K+' : totalPoints >= 100 ? Math.floor(totalPoints / 100) + 'H' : totalPoints}
                </span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* User Level */}
      <div className="p-4 border-t border-[#E2E8F0]/50">
        <div className="px-4 py-3 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-[#E2E8F0]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#64748B]">Nivel</span>
            <span className="text-xs font-bold text-[#4DA8C4]">
              {totalPoints >= 5000 ? '🏆 Maestro' : totalPoints >= 2500 ? '⭐ Experto' : totalPoints >= 1000 ? '📚 Avanzado' : totalPoints >= 500 ? '🌟 Intermedio' : '🌱 Principiante'}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPoints % 500) / 5, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

// ==========================================
// Mobile Bottom Tab Bar
// ==========================================
const MobileBottomBar = ({ activeTab, onTabChange }) => {
  const mobileTabs = [
    { id: 'inicio', icon: '🏠' },
    { id: 'dani', icon: '🤖' },
    { id: 'actividades', icon: '📝' },
    { id: 'calendario', icon: '📅' },
    { id: 'puntos', icon: '💎' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E2E8F0] z-50 px-2 py-1"
    >
      <div className="flex justify-around">
        {mobileTabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#4DA8C4]/10 text-[#004B63]'
                : 'text-[#64748B]'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">
              {tab.id === 'inicio' ? 'Inicio' : tab.id === 'dani' ? 'Dani' : tab.id === 'actividades' ? 'Activ.' : tab.id === 'calendario' ? 'Calen.' : 'Puntos'}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================
// Main Content Area with Cinematic Scroll
// ==========================================
const CinematicContent = ({ activeTab, onTabChange }) => {
  const { totalPoints, vakResult, addPoints } = useSmartBoardKids();
  
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div
            key="inicio"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <HeroSection />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <PointsRewardsSystem />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <NewsTechFeed />
            </motion.div>
          </motion.div>
        );
      
      case 'dani':
        return (
          <motion.div
            key="dani"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center max-w-2xl mx-auto p-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8 flex justify-center"
              >
                <DaniAvatar3D mood="happy" size="xl" />
              </motion.div>
              <h2 className="text-3xl font-black text-[#004B63] mb-4">
                ¡Hola! Soy <span className="text-[#4DA8C4]">Dani</span>
              </h2>
              <p className="text-lg text-[#64748B] mb-8">
                Tu tutor virtual, psicólogo y coach. Estoy aquí para ayudarte con tus tareas, 
                entender cómo aprendes mejor y apoyarte en lo que necesites.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(77, 168, 196, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('openDaniChat')?.click()}
                className="px-8 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
              >
                <span className="text-2xl">💬</span>
                <span>Abrir Chat con Dani</span>
              </motion.button>
            </div>
          </motion.div>
        );
      
      case 'actividades':
        return (
          <motion.div
            key="actividades"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <ActivityUploader />
          </motion.div>
        );
      
      case 'calendario':
        return (
          <motion.div
            key="calendario"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <KidsCalendar />
          </motion.div>
        );
      
      case 'puntos':
        return (
          <motion.div
            key="puntos"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <PointsRewardsSystem />
          </motion.div>
        );
      
      case 'noticias':
        return (
          <motion.div
            key="noticias"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <NewsTechFeed />
          </motion.div>
        );
      
      case 'vak':
        return (
          <motion.div
            key="vak"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <VAKDiagnosticEnhanced />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// Main SmartBoard Kids Dashboard Component
// ==========================================
const SmartBoardKidsDashboard = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isDaniOpen, setIsDaniOpen] = useState(false);
  const { totalPoints, vakResult, addPoints } = useSmartBoardKids();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['inicio', 'dani', 'actividades', 'calendario', 'puntos', 'noticias', 'vak'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Points per minute
  useEffect(() => {
    const interval = setInterval(() => {
      addPoints(1, 'Minuto activo');
    }, 60000);
    return () => clearInterval(interval);
  }, [addPoints]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Animated Background Particles */}
      <ParticlesBackground count={30} colors={['#4DA8C4', '#66CCCC', '#FFD166', '#FF6B9D']} />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        <PremiumSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalPoints={totalPoints}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Glassmorphism */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]/50 p-4 flex items-center justify-between z-20"
          >
            <h1 className="text-xl font-bold text-[#004B63]">
              {activeTab === 'inicio' && '🏠 Mi Panel'}
              {activeTab === 'dani' && '🤖 Dani Tutor'}
              {activeTab === 'actividades' && '📝 Mis Actividades'}
              {activeTab === 'calendario' && '📅 Mi Calendario'}
              {activeTab === 'puntos' && '💎 Mis Puntos'}
              {activeTab === 'noticias' && '📰 Noticias Tech'}
              {activeTab === 'vak' && '🧠 Mi Perfil VAK'}
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Dani Quick Access */}
              <motion.button
                id="openDaniChat"
                onClick={() => setIsDaniOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>🤖</span>
                <span className="hidden md:block">Hablar con Dani</span>
              </motion.button>
              
              {/* Points Display */}
              <motion.div
                className="px-4 py-2 bg-[#F8FAFC] rounded-full flex items-center gap-2 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-[#FFD166] font-bold text-lg">💎</span>
                <span className="text-sm font-bold text-[#004B63]">{totalPoints.toLocaleString()}</span>
              </motion.div>
            </div>
          </motion.header>

          {/* Scrollable Content */}
          <CinematicContent activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dani Chat Modal - Full Premium Experience */}
      <AnimatePresence>
        {isDaniOpen && (
          <DaniTutorChat isOpen={isDaniOpen} onClose={() => setIsDaniOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBoardKidsDashboard;
