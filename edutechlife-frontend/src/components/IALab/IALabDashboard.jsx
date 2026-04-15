import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, Flame, Play, Pause, 
  Brain, Rocket, Terminal, Trophy, Sparkles,
  ChevronRight, BookOpen, GraduationCap, FileText,
  TrendingUp, Award, Target, Zap, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllProgress, 
  getProgress, 
  PROGRESS_STATUS,
  saveProgress 
} from '../lib/progress';

const IALabDashboard = ({ onModuleSelect, modules = [] }) => {
  const [activeModule, setActiveModule] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Datos de Supabase
  const [userProgress, setUserProgress] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [promptsGenerated, setPromptsGenerated] = useState(0);
  
  const { user, loading: authLoading } = useAuth();
  
  // Cargar progreso desde Supabase
  const loadProgressFromSupabase = useCallback(async () => {
    if (!user) {
      setIsLoadingProgress(false);
      return;
    }

    setIsLoadingProgress(true);
    try {
      const progressData = await getAllProgress();
      setUserProgress(progressData);

      // Calcular módulos completados
      const completedCount = progressData.filter(
        p => p.status === PROGRESS_STATUS.COMPLETED
      ).length;

      // Calcular promedio de scores
      const scoresWithValue = progressData.filter(
        p => p.metadata?.evaluationScore
      );
      
      if (scoresWithValue.length > 0) {
        const sumScores = scoresWithValue.reduce(
          (sum, p) => sum + (p.metadata?.evaluationScore || 0), 0
        );
        setAverageScore(Math.round(sumScores / scoresWithValue.length));
      }

      // Calcular streak (días consecutivos)
      if (progressData.length > 0) {
        const sortedDates = progressData
          .map(p => new Date(p.updated_at).toDateString())
          .filter((date, index, self) => self.indexOf(date) === index)
          .sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < sortedDates.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          
          if (sortedDates.includes(checkDate.toDateString())) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        setStreakDays(streak);
      }

      // Calcular tiempo total (aproximado: 150 min por módulo completado)
      setTotalTimeSpent(completedCount * 150);

      // Contar prompts evaluados
      setPromptsGenerated(scoresWithValue.length);

    } catch (error) {
      console.error('Error loading progress from Supabase:', error);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user]);

  // Cargar datos cuando cambia el usuario
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Usuario no logueado - mostrar modal de login
        setShowLoginModal(true);
        setIsLoadingProgress(false);
      } else {
        setShowLoginModal(false);
        loadProgressFromSupabase();
      }
    }
  }, [user, authLoading, loadProgressFromSupabase]);

  // Efecto para mostrar bienvenida
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Calcular progreso del curso basado en Supabase
  const calculateCourseProgress = useCallback(() => {
    if (userProgress.length === 0) return 0;
    const completed = userProgress.filter(
      p => p.status === PROGRESS_STATUS.COMPLETED
    ).length;
    return Math.round((completed / 4) * 100);
  }, [userProgress]);

  const courseProgress = calculateCourseProgress();

  // Obtener módulos completados
  const completedModules = userProgress
    .filter(p => p.status === PROGRESS_STATUS.COMPLETED)
    .map(p => p.module_id);

  // Función para obtener progreso de un módulo específico
  const getModuleProgress = (moduleId) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    if (!progress) return 0;
    
    if (progress.status === PROGRESS_STATUS.COMPLETED) return 100;
    if (progress.status === PROGRESS_STATUS.IN_PROGRESS) return 50;
    return 0;
  };

  // Función para obtener stats de un módulo
  const getModuleStats = (moduleId) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    let completed = 0;
    let total = 8; // 2 videos + 3 infografías + 1 actividad + 2 items extra

    if (progress?.status === PROGRESS_STATUS.COMPLETED) {
      completed = total;
    } else if (progress?.status === PROGRESS_STATUS.IN_PROGRESS) {
      completed = Math.floor(total / 2);
    }

    return { completed, total };
  };
  
  const defaultModules = [
    { id: 1, title: 'Ingeniería de Prompts', subtitle: 'Mastery Framework, Zero-Shot, CoT', color: '#4DA8C4', duration: '2h 30min', lessons: 8, icon: Brain },
    { id: 2, title: 'Potencia ChatGPT', subtitle: 'GPTs personalizados, Function Calling', color: '#66CCCC', duration: '2h 30min', lessons: 8, icon: Terminal },
    { id: 3, title: 'Gemini Deep Research', subtitle: 'Razonamiento Multimodal, Deep Research', color: '#B2D8E5', duration: '2h 30min', lessons: 8, icon: Rocket },
    { id: 4, title: 'Notebook LM Mastery', subtitle: 'Curaduría, Síntesis, Audio Overviews', color: '#004B63', duration: '2h 30min', lessons: 8, icon: Trophy }
  ];

  const courseModules = modules.length > 0 ? modules : defaultModules;

  const getCurrentLesson = () => {
    const module = courseModules.find(m => m.id === activeModule);
    const stats = getModuleStats(activeModule);
    return module ? {
      title: `${module.title}`,
      duration: module.duration,
      progress: getModuleProgress(activeModule)
    } : null;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
    if (onModuleSelect) onModuleSelect(moduleId);
  };

  const handleContinueLearning = () => handleModuleClick(activeModule);

  const moduleTitles = {
    1: 'Ingeniería de Prompts',
    2: 'Potencia ChatGPT',
    3: 'Gemini Deep Research',
    4: 'Notebook LM Mastery'
  };

  const courseModules = modules.length > 0 ? modules : defaultModules;

  const getCurrentLesson = () => {
    const module = courseModules.find(m => m.id === activeModule);
    const stats = getModuleStats(activeModule);
    return module ? {
      title: `${module.title}`,
      duration: module.duration,
      progress: getModuleProgress(activeModule)
    } : null;
  };

  return (
    <div className="min-h-screen bg-[var(--color-slate-50)] p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto">
        
        {/* LADO IZQUIERDO - 30% */}
        <div className="w-full lg:w-[30%] flex flex-col gap-4">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] rounded-xl flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-[var(--color-petroleum)] font-montserrat">IALab Pro</h2>
                <p className="text-xs text-[var(--color-slate-500)]">Inteligencia Artificial Aplicada</p>
              </div>
            </div>
          </div>

          {/* Módulos del Curso */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[var(--color-corporate)]" />
              <h3 className="text-sm font-bold text-[var(--color-slate-700)] uppercase tracking-wider font-montserrat">
                Módulos del Curso
              </h3>
            </div>
            
            <div className="space-y-3">
              {courseModules.map((module) => {
                const progress = getModuleProgress(module.id);
                const stats = getModuleStats(module.id);
                const isActive = activeModule === module.id;
                const isCompleted = completedModules.includes(module.id);
                const ModuleIcon = module.icon;
                
                return (
                  <motion.button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] text-white shadow-lg' 
                        : 'bg-[var(--color-slate-50)] border border-[var(--color-border-light)] hover:border-[var(--color-corporate)] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white/20' : 'bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <ModuleIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-[var(--color-slate-700)]'}`}>
                            M{module.id}: {module.title}
                          </h4>
                          <p className={`text-xs ${isActive ? 'text-white/70' : 'text-[var(--color-slate-500)]'}`}>
                            {module.duration} • {stats.completed}/{stats.total} lecciones
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[var(--color-corporate)]'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isActive ? 'bg-white/20' : 'bg-[var(--color-slate-200)]'}`}>
                      <motion.div 
                        className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Progreso General */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-[var(--color-accent)]" />
              <h3 className="text-sm font-bold text-[var(--color-slate-700)] uppercase tracking-wider font-montserrat">
                Progreso del Curso
              </h3>
            </div>
            
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs text-[var(--color-slate-500)]">{completedModules.filter(id => id <= 4).length}/4 módulos completados</span>
              <span className="text-sm font-bold text-[var(--color-petroleum)]">{courseProgress}%</span>
            </div>
            
            <div className="h-2.5 bg-[var(--color-slate-200)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[var(--color-petroleum)] via-[var(--color-corporate)] to-[var(--color-mint)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${courseProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* LADO DERECHO - 70% */}
        <div className="w-full lg:w-[70%] flex flex-col gap-4">
          
          {/* Stats Cards - Fila Horizontal */}
          <div className="grid grid-cols-4 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-petroleum)]/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[var(--color-petroleum)]" />
              </div>
              <p className="text-lg font-bold text-[var(--color-slate-800)] font-montserrat">{formatTime(totalTimeSpent)}</p>
              <p className="text-xs text-[var(--color-slate-500)]">Tiempo Total</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-corporate)]/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-[var(--color-corporate)]" />
              </div>
              <p className="text-lg font-bold text-[var(--color-slate-800)] font-montserrat">{courseProgress}%</p>
              <p className="text-xs text-[var(--color-slate-500)]">Progreso</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <p className="text-lg font-bold text-[var(--color-slate-800)] font-montserrat">{streakDays} días</p>
              <p className="text-xs text-[var(--color-slate-500)]">Racha</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-soft-blue)]/50 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-[var(--color-petroleum)]" />
              </div>
              <p className="text-lg font-bold text-[var(--color-slate-800)] font-montserrat">{promptsGenerated}</p>
              <p className="text-xs text-[var(--color-slate-500)]">Prompts</p>
            </motion.div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3"
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-slate-500)]">Objetivos</p>
                <p className="text-sm font-bold text-[var(--color-slate-800)]">12/15</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-slate-500)]">Logros</p>
                <p className="text-sm font-bold text-[var(--color-slate-800)]">3/8</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 bg-white rounded-xl shadow-[var(--shadow-glass)] border border-[var(--color-border-light)] p-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-slate-500)]">Nivel</p>
                <p className="text-sm font-bold text-[var(--color-slate-800)]">Principiante</p>
              </div>
            </motion.div>
          </div>

          {/* Main Module Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-[var(--shadow-glass-lg)] border border-[var(--color-border-light)] overflow-hidden flex-1"
          >
            {/* Header con gradiente */}
            <div className="h-1.5 bg-gradient-to-r from-[var(--color-petroleum)] via-[var(--color-corporate)] to-[var(--color-mint)]" />
            
            <div className="p-5">
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-[var(--color-petroleum)]/10 text-[var(--color-petroleum)] text-xs font-semibold rounded-full">
                      Módulo {activeModule}
                    </span>
                    <span className="text-xs text-[var(--color-slate-500)]">
                      {moduleTitles[activeModule]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--color-slate-800)] font-montserrat">
                    {courseModules.find(m => m.id === activeModule)?.title}
                  </h2>
                </div>
                
                {/* Navegación de módulos */}
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map(num => (
                    <button
                      key={num}
                      onClick={() => setActiveModule(num)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeModule === num 
                          ? 'w-6 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)]' 
                          : 'bg-[var(--color-slate-300)] hover:bg-[var(--color-slate-400)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Video Player */}
              <div className="bg-gradient-to-br from-[var(--color-slate-900)] to-[var(--color-petroleum)] rounded-xl p-4 text-white mb-4">
                <div className="aspect-video bg-[var(--color-slate-800)] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-petroleum)]/30 to-transparent" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-[var(--color-corporate)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-mint)] transition-colors relative z-10"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Video Introductorio</p>
                    <p className="text-xs text-white/60">{isPlaying ? 'Reproduciendo...' : '5:30 min'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-2 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-3 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>

              {/* Current Lesson Info */}
              <div className="flex items-start gap-3 p-4 bg-[var(--color-slate-50)] rounded-xl border border-[var(--color-border-light)] mb-4">
                <div className="w-10 h-10 bg-[var(--color-corporate)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-[var(--color-corporate)]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-slate-500)] mb-1">📖 Siguiente lección</p>
                  <p className="text-sm font-semibold text-[var(--color-slate-800)]">{getCurrentLesson()?.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-slate-500)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getCurrentLesson()?.duration}
                    </span>
                    <span className="text-[var(--color-corporate)] font-medium">{getCurrentLesson()?.progress}% completado</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <motion.button 
                onClick={handleContinueLearning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-[var(--color-corporate)] hover:to-[var(--color-mint)] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Continuar Aprendiendo</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Welcome Banner */}
      <AnimatePresence>
        {showWelcome && user && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-white rounded-2xl shadow-[var(--shadow-glass-lg)] border border-[var(--color-border-light)] p-4 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-petroleum)] font-montserrat">¡Bienvenido a IALab Pro!</h4>
                <p className="text-xs text-[var(--color-slate-500)]">Tu camino hacia la maestría en IA comienza aquí</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal - cuando no hay usuario */}
      <AnimatePresence>
        {showLoginModal && !user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-[var(--shadow-glass-lg)] border border-[var(--color-border-light)] p-8 max-w-md w-full mx-4 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] rounded-2xl flex items-center justify-center">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-petroleum)] font-montserrat mb-3">
                ¡Inicia Sesión!
              </h2>
              <p className="text-[var(--color-slate-500)] mb-6">
                Para continuar tu aprendizaje y guardar tu progreso, necesitas iniciar sesión con tu cuenta de Edutechlife.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // Redirigir a página de login o abrir modal de auth
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }));
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[var(--color-petroleum)] to-[var(--color-corporate)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                  }}
                  className="w-full py-3 bg-[var(--color-slate-50)] border border-[var(--color-border-light)] text-[var(--color-petroleum)] rounded-xl font-semibold hover:bg-[var(--color-slate-100)] transition-all"
                >
                  Crear Cuenta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IALabDashboard;
