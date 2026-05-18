import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import ParticlesBackground from './ParticlesBackground';
import HeroSection from './HeroSection';
import DaniTutorChat from './DaniTutorChat';
import DaniAvatar3D from './DaniAvatar3D';
import KidsCalendar from './KidsCalendar';
import PointsRewardsSystem from './PointsRewardsSystem';
import NewsTechFeed from './NewsTechFeed';
import ActivityUploader from './ActivityUploader';
import SmartBoardProgress from './SmartBoardProgress';
import { VAKDiagnosticEnhanced } from './VAKDiagnosticEnhanced';
import PersonalizedPlan from './PersonalizedPlan';
import DashboardErrorBoundary from './DashboardErrorBoundary';

// ==========================================
// Premium Sidebar - Glassmorphism
// ==========================================
const PremiumSidebar = ({ activeTab, onTabChange, totalPoints, vakCompleted, darkMode, streak, onNavigate, onLogout }) => {
  const tabs = [
    { id: 'inicio', icon: '🏠', label: 'Inicio', color: '#4DA8C4' },
    { id: 'vak', icon: '🧠', label: 'Mi VAK', color: '#66CCCC' },
    { id: 'misiones', icon: '🎯', label: 'Misiones', color: '#FF6B9D' },
    { id: 'materias', icon: '📚', label: 'Materias', color: '#4DA8C4' },
    { id: 'actividades', icon: '📝', label: 'Actividades', color: '#FFD166' },
    { id: 'calendario', icon: '📅', label: 'Calendario', color: '#FF6B9D' },
    { id: 'progreso', icon: '📊', label: 'Progreso', color: '#66CCCC' },
    { id: 'padres', icon: '👨‍👩‍👧', label: 'Vista Padres', color: '#4DA8C4' },
    { id: 'noticias', icon: '📰', label: 'Noticias', color: '#004B63' },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`hidden md:flex w-64 flex-col h-full backdrop-blur-xl border-r relative z-20 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]'
      }`}
    >
      {/* Logo Area */}
      <div className="p-6 border-b border-[#E2E8F0]/50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 400, delay: 0.3 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent">
            SmartBoard
          </h2>
        </motion.div>
        <p className={`text-xs mt-1 transition-colors duration-500 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Premium SaaS</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            onClick={() => tab.id === 'padres' ? onNavigate?.('/smartboard/padres') : onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : darkMode
                  ? 'text-[#94A3B8] hover:bg-[#334155]/50'
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
            
            {/* Plan active badge on VAK tab */}
            {tab.id === 'vak' && vakCompleted && (
              <span className="ml-auto relative z-10 text-[10px] px-1.5 py-0.5 bg-green-400 text-white rounded-full font-bold">
                Plan
              </span>
            )}
            

          </motion.button>
        ))}
      </nav>

      {/* User Level */}
      <div className={`p-4 border-t transition-colors duration-500 ${darkMode ? 'border-[#334155]/50' : 'border-[#E2E8F0]/50'}`}>
        <div className={`px-4 py-3 rounded-xl border transition-colors duration-500 ${
          darkMode
            ? 'bg-gradient-to-br from-[#334155] to-[#1E293B] border-[#475569]/50'
            : 'bg-gradient-to-br from-[#F8FAFC] to-white border-[#E2E8F0]/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs transition-colors duration-500 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Nivel</span>
            <span className="text-xs font-bold text-[#4DA8C4]">
              {totalPoints >= 5000 ? '🏆 Maestro' : totalPoints >= 2500 ? '⭐ Experto' : totalPoints >= 1000 ? '📚 Avanzado' : totalPoints >= 500 ? '🌟 Intermedio' : '🌱 Principiante'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">🔥</span>
            <span className={`text-xs ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>
              {streak.current} días seguidos
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
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-[#334155] text-red-400 hover:bg-[#475569] hover:text-red-300'
              : 'bg-[#F8FAFC] text-red-500 hover:bg-red-50'
          }`}
        >
          🚪 Cerrar sesión
        </motion.button>
      </div>
    </motion.aside>
  );
};

// ==========================================
// Mobile Bottom Tab Bar
// ==========================================
const MobileBottomBar = ({ activeTab, onTabChange, darkMode }) => {
  const mobileTabs = [
    { id: 'inicio', icon: '🏠' },
    { id: 'vak', icon: '🧠' },
    { id: 'misiones', icon: '🎯' },
    { id: 'materias', icon: '📚' },
    { id: 'actividades', icon: '📝' },
    { id: 'calendario', icon: '📅' },
    { id: 'progreso', icon: '📊' },
    { id: 'noticias', icon: '📰' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/90 border-[#334155]/50' : 'bg-white/90 border-[#E2E8F0]'
      }`}
    >
      <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1 px-2 gap-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mobileTabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`snap-start flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#4DA8C4]/10 text-[#004B63]'
                : 'text-[#64748B]'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium whitespace-nowrap">
              {tab.id === 'inicio' ? 'Inicio' : tab.id === 'vak' ? 'VAK' : tab.id === 'misiones' ? 'Misiones' : tab.id === 'materias' ? 'Materias' : tab.id === 'actividades' ? 'Activ.' : tab.id === 'calendario' ? 'Calen.' : tab.id === 'noticias' ? 'Noticias' : 'Progreso'}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================
// Missions View
// ==========================================
const MissionsView = ({ missions, onCompleteMission }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-bold text-[#004B63]">🎯 Mis Misiones</h3>
      <span className="text-sm text-[#64748B]">{missions.filter(m => m.completed).length}/{missions.length}</span>
    </div>
    {missions.map((mission, index) => (
      <motion.div
        key={mission.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`p-4 rounded-xl border-2 transition-all ${
          mission.completed
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-[#E2E8F0] hover:border-[#4DA8C4]/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            mission.completed ? 'bg-green-100' : 'bg-[#F8FAFC]'
          }`}>
            {mission.completed ? '✅' : mission.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${mission.completed ? 'text-green-600 line-through' : 'text-[#004B63]'}`}>
              {mission.title}
            </h4>
            <p className="text-sm text-[#64748B]">{mission.description}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold ${mission.completed ? 'text-green-500' : 'text-[#4DA8C4]'}`}>
              +{mission.xp} pts
            </span>
            {!mission.completed && (
              <motion.button
                onClick={() => onCompleteMission(mission.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block mt-1 px-3 py-1 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-xs rounded-full font-semibold"
              >
                Completar
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ==========================================
// Subjects View
// ==========================================
const SubjectsView = ({ subjects }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-[#004B63]">📚 Mis Materias</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white p-5 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${subject.color}20` }}
            >
              {subject.icon}
            </div>
            <h4 className="font-semibold text-[#004B63]">{subject.name}</h4>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: subject.color }}
              initial={{ width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#64748B]">Progreso</span>
            <span className="text-xs font-bold" style={{ color: subject.color }}>{subject.progress}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ==========================================
// Main Content Area with Cinematic Scroll
// ==========================================
const CinematicContent = ({ activeTab, onTabChange, missions, subjects, onCompleteMission, darkMode }) => {
  const { totalPoints, vakResult, addPoints, setVakResultAndRecommendations, streak, studentMoodHistory, academicTopics, conversationCount } = useSmartBoardKids();
  
  const handleVakComplete = useCallback((result) => {
    setVakResultAndRecommendations(result);
  }, [setVakResultAndRecommendations]);

  const renderContent = () => {
    const sharedTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div
            key="inicio"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
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
        const lastMoods = studentMoodHistory.slice(-3).map(m => m.mood);
        const topTopics = academicTopics.slice(-4);

        return (
          <motion.div
            key="dani"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center max-w-2xl mx-auto p-8">
              <div className="relative mb-6 flex justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <DaniAvatar3D mood="happy" size="xl" />
                </motion.div>
                {streak.current > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
                  >
                    🔥 {streak.current}
                  </motion.div>
                )}
              </div>

              {/* Stats row */}
              {conversationCount > 0 && (
                <div className="flex justify-center gap-4 mb-6">
                  <div className="px-4 py-2 bg-[#B2D8E5]/20 rounded-full text-sm text-[#004B63] font-medium">
                    💬 {conversationCount} mensajes
                  </div>
                  {lastMoods.length > 0 && (
                    <div className="px-4 py-2 bg-[#B2D8E5]/20 rounded-full text-sm text-[#004B63] font-medium">
                      {lastMoods.includes('feliz') ? '😊' : lastMoods.includes('triste') ? '😢' : '💭'} Último: {lastMoods[lastMoods.length - 1]}
                    </div>
                  )}
                </div>
              )}

              {/* Recent topics */}
              {topTopics.length > 0 && (
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {topTopics.map(t => (
                    <span key={t.topic} className="px-3 py-1 bg-white border border-[#B2D8E5] rounded-full text-xs text-[#004B63]">
                      📌 {t.topic}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="text-3xl font-black text-[#004B63] mb-4">
                ¡Hola! Soy <span className="text-[#4DA8C4]">Dani</span>
              </h2>
              <p className="text-lg text-[#64748B] mb-8">
                Tu mentor virtual, psicólogo y coach. Estoy aquí para ayudarte con tus tareas, 
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
      
      case 'misiones':
        return (
          <motion.div
            key="misiones"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <MissionsView missions={missions} onCompleteMission={onCompleteMission} />
          </motion.div>
        );
      
      case 'materias':
        return (
          <motion.div
            key="materias"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <SubjectsView subjects={subjects} />
          </motion.div>
        );
      
      case 'actividades':
        return (
          <motion.div
            key="actividades"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <ActivityUploader />
          </motion.div>
        );
      
      case 'calendario':
        return (
          <motion.div
            key="calendario"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <KidsCalendar />
          </motion.div>
        );
      
      case 'puntos':
        return (
          <motion.div
            key="puntos"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <PointsRewardsSystem />
          </motion.div>
        );
      
      case 'noticias':
        return (
          <motion.div
            key="noticias"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <NewsTechFeed />
          </motion.div>
        );
      
      case 'vak':
        return (
          <motion.div
            key="vak"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="space-y-6"
          >
            <VAKDiagnosticEnhanced onComplete={handleVakComplete} />
            {vakResult && <PersonalizedPlan />}
          </motion.div>
        );

      case 'progreso':
        return (
          <motion.div
            key="progreso"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="h-full"
          >
            <SmartBoardProgress />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative p-4 md:p-6">
      <AnimatePresence mode="wait">
        <DashboardErrorBoundary key={activeTab} message={`Error al cargar la sección "${activeTab}".`} onTabChange={onTabChange}>
          {renderContent()}
        </DashboardErrorBoundary>
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
  const { totalPoints, vakResult, addPoints, setVakResultAndRecommendations, darkMode, avatarAnimado, fondoGalaxia, lastUnlockedReward, streak } = useSmartBoardKids();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signOut } = useClerk();

  const handleLogout = useCallback(() => {
    signOut();
    navigate('/');
  }, [signOut, navigate]);

  // Missions state
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('edutechlife_missions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Completa tu Diagnóstico VAK', description: 'Descubre cómo aprendes mejor', icon: '🧠', xp: 100, completed: false },
      { id: 2, title: 'Sube tu primera actividad', description: 'Comparte un trabajo con Dani', icon: '📤', xp: 50, completed: false },
      { id: 3, title: 'Habla con Dani 5 veces', description: 'Haz preguntas a tu tutor virtual', icon: '💬', xp: 75, completed: false },
      { id: 4, title: 'Agrega 3 eventos al calendario', description: 'Organiza tu semana de estudio', icon: '📅', xp: 60, completed: false },
      { id: 5, title: 'Gana 500 puntos', description: 'Acumula puntos canjeables por premios', icon: '💎', xp: 200, completed: false },
      { id: 6, title: 'Lee 3 noticias tech', description: 'Mantente al día con la tecnología', icon: '📰', xp: 80, completed: false },
    ];
  });

  // Subjects state
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('edutechlife_subjects');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'matematicas', name: 'Matemáticas', icon: '🔢', progress: 0, color: '#4DA8C4' },
      { id: 'lenguaje', name: 'Lenguaje', icon: '📖', progress: 0, color: '#66CCCC' },
      { id: 'ciencias', name: 'Ciencias', icon: '🔬', progress: 0, color: '#FFD166' },
      { id: 'historia', name: 'Historia', icon: '🏛️', progress: 0, color: '#FF6B9D' },
      { id: 'ingles', name: 'Inglés', icon: '🌎', progress: 0, color: '#B2D8E5' },
      { id: 'arte', name: 'Arte', icon: '🎨', progress: 0, color: '#004B63' },
    ];
  });

  // Persist missions and subjects
  useEffect(() => {
    localStorage.setItem('edutechlife_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('edutechlife_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const completeMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m =>
      m.id === missionId && !m.completed
        ? { ...m, completed: true }
        : m
    ));
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      addPoints(mission.xp, `Misión completada: ${mission.title}`);
    }
  }, [missions, addPoints]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['inicio', 'vak', 'misiones', 'materias', 'actividades', 'calendario', 'noticias', 'progreso', 'padres'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC]'
      } ${fondoGalaxia ? 'bg-[#0F172A]' : ''}`}
      style={fondoGalaxia ? {
        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(77,168,196,0.15) 1px, transparent 0px), radial-gradient(circle at 75px 75px, rgba(77,168,196,0.1) 1px, transparent 0px)',
        backgroundSize: '100px 100px',
      } : {}}
    >
      {/* Unlock Notification */}
      <AnimatePresence>
        {lastUnlockedReward && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 right-4 z-[100] bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold">¡Recompensa desbloqueada!</p>
              <p className="text-sm opacity-90">{lastUnlockedReward.icon} {lastUnlockedReward.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            vakCompleted={!!vakResult}
            darkMode={darkMode}
            streak={streak}
            onNavigate={navigate}
            onLogout={handleLogout}
          />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Glassmorphism */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`backdrop-blur-xl border-b p-4 flex items-center justify-between z-20 transition-colors duration-500 ${
              darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
            }`}
          >
            <h1 className={`text-xl font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
              {activeTab === 'inicio' && '🏠 Mi Panel'}
              {activeTab === 'vak' && '🧠 Mi Perfil VAK'}
              {activeTab === 'misiones' && '🎯 Mis Misiones'}
              {activeTab === 'materias' && '📚 Mis Materias'}
              {activeTab === 'actividades' && '📝 Mis Actividades'}
              {activeTab === 'calendario' && '📅 Mi Calendario'}
              {activeTab === 'noticias' && '📰 Noticias Tech'}
              {activeTab === 'progreso' && '📊 Mi Progreso'}
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Dani Quick Access */}
              <motion.button
                id="openDaniChat"
                type="button"
                onClick={() => setIsDaniOpen(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(77,168,196,0.4)' }}
                whileTap={{ scale: 0.92 }}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
              >
                <motion.span
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  🤖
                </motion.span>
                <span className="hidden md:block">Hablar con Dani</span>
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                  initial={{ opacity: 0, scale: 1 }}
                  whileTap={{ opacity: 1, scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              
              {/* Streak Display */}
              <motion.div
                className={`px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors duration-500 ${
                  darkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'
                }`}
                whileHover={{ scale: 1.02 }}
                title="Racha de días"
              >
                <span className="text-sm">🔥</span>
                <span className={`text-xs font-bold ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>
                  {streak.current}
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>días</span>
              </motion.div>

              {/* Points Display */}
              <motion.div
                className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-500 ${
                  darkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-[#FFD166] font-bold text-lg">💎</span>
                <span className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>{totalPoints.toLocaleString()}</span>
                <span className={`text-[10px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>puntos</span>
              </motion.div>
            </div>
          </motion.header>

          {/* Scrollable Content */}
          <CinematicContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            missions={missions}
            subjects={subjects}
            onCompleteMission={completeMission}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />

      {/* Dani Chat Modal - Full Premium Experience */}
      <AnimatePresence>
        {isDaniOpen && (
          <DaniTutorChat isOpen={isDaniOpen} onClose={() => setIsDaniOpen(false)} activeTab={activeTab} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBoardKidsDashboard;
