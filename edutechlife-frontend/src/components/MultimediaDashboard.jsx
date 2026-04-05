import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Headphones, ChartBar, Users, GraduationCap, 
  Clock, CheckCircle, TrendingUp, Award, Target,
  Play, BookOpen, Zap, BarChart3, Calendar
} from 'lucide-react';

const MultimediaDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    microVideos: { completed: 0, total: 15, timeSpent: 0 },
    audioGuides: { completed: 0, total: 7, timeSpent: 0 },
    caseStudies: { completed: 0, total: 4, timeSpent: 0 },
    expertInterviews: { completed: 0, total: 4, timeSpent: 0 },
    tutorials: { completed: 0, total: 8, timeSpent: 0 }
  });

  const [learningStats, setLearningStats] = useState({
    totalTime: 0,
    completionRate: 0,
    streakDays: 0,
    lastActive: null
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [vakProfile, setVakProfile] = useState({ visual: 0, auditory: 0, kinesthetic: 0 });

  useEffect(() => {
    loadDashboardData();
    calculateVAKProfile();
    loadRecentActivity();
  }, []);

  const loadDashboardData = useCallback(() => {
    try {
      // Cargar datos de MicroVideos
      const microVideosCompleted = JSON.parse(localStorage.getItem('ialab_completed_videos') || '[]').length;
      const microVideosProgress = JSON.parse(localStorage.getItem('ialab_video_progress') || '{}');
      const microVideosTime = Object.values(microVideosProgress).reduce((acc, val) => acc + (val || 0), 0);

      // Cargar datos de AudioGuides
      const audioGuidesCompleted = JSON.parse(localStorage.getItem('audioGuidesProgress') || '[]').length;

      // Actualizar estado
      setDashboardData(prev => ({
        ...prev,
        microVideos: { 
          ...prev.microVideos, 
          completed: microVideosCompleted,
          timeSpent: Math.round(microVideosTime / 60) // Convertir a minutos
        },
        audioGuides: {
          ...prev.audioGuides,
          completed: audioGuidesCompleted
        }
      }));

      // Calcular estadísticas generales
      const totalCompleted = microVideosCompleted + audioGuidesCompleted;
      const totalItems = 15 + 7 + 4 + 4 + 8;
      const completionRate = Math.round((totalCompleted / totalItems) * 100);

      setLearningStats(prev => ({
        ...prev,
        totalTime: Math.round(microVideosTime / 60) + 45, // Ejemplo: agregar tiempo estimado
        completionRate,
        streakDays: calculateStreak(),
        lastActive: new Date().toLocaleDateString()
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  const calculateVAKProfile = useCallback(() => {
    // Simular perfil VAK basado en actividad
    const visualScore = dashboardData.microVideos.completed * 10;
    const auditoryScore = dashboardData.audioGuides.completed * 15;
    const kinestheticScore = dashboardData.tutorials.completed * 20;

    const total = visualScore + auditoryScore + kinestheticScore || 1;
    
    setVakProfile({
      visual: Math.round((visualScore / total) * 100),
      auditory: Math.round((auditoryScore / total) * 100),
      kinesthetic: Math.round((kinestheticScore / total) * 100)
    });
  }, [dashboardData]);

  const calculateStreak = useCallback(() => {
    // Simular cálculo de racha
    const lastActive = localStorage.getItem('lastLearningActivity');
    if (!lastActive) return 0;
    
    const lastDate = new Date(lastActive);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 1 ? 7 : Math.max(0, 7 - diffDays);
  }, []);

  const loadRecentActivity = useCallback(() => {
    const activities = [
      { id: 1, type: 'video', title: 'MasterPrompt: La Plantilla Definitiva', time: 'Hace 2 horas', module: 'Ingeniería de Prompts' },
      { id: 2, type: 'audio', title: '¿Qué es la Inteligencia Artificial?', time: 'Hace 1 día', module: 'Fundamentos de IA' },
      { id: 3, type: 'case', title: 'Transformación Digital en Retail', time: 'Hace 2 días', module: 'Casos de Estudio' },
      { id: 4, type: 'interview', title: 'El Futuro del Aprendizaje Automático', time: 'Hace 3 días', module: 'Entrevistas' },
      { id: 5, type: 'tutorial', title: 'Creando tu Primer Modelo de ML', time: 'Hace 4 días', module: 'Tutoriales' }
    ];
    setRecentActivity(activities);
  }, []);

  const multimediaModules = [
    {
      id: 'microvideos',
      title: 'Micro-Videos',
      icon: Video,
      color: 'from-[#2D7A94] to-[#4DA8C4]',
      description: 'Videos educativos de 5-10 minutos',
      stats: dashboardData.microVideos,
      link: '#microvideos'
    },
    {
      id: 'audioguides',
      title: 'Guías de Audio',
      icon: Headphones,
      color: 'from-[#4DA8C4] to-[#66CCCC]',
      description: 'Audios educativos de 15-30 minutos',
      stats: dashboardData.audioGuides,
      link: '#audioguides'
    },
    {
      id: 'casestudies',
      title: 'Casos de Estudio',
      icon: ChartBar,
      color: 'from-[#66CCCC] to-[#B2D8E5]',
      description: 'Casos reales de implementación',
      stats: dashboardData.caseStudies,
      link: '#casestudies'
    },
    {
      id: 'expertinterviews',
      title: 'Entrevistas',
      icon: Users,
      color: 'from-[#B2D8E5] to-[#2D7A94]',
      description: 'Conversaciones con expertos',
      stats: dashboardData.expertInterviews,
      link: '#expertinterviews'
    },
    {
      id: 'tutorials',
      title: 'Tutoriales',
      icon: GraduationCap,
      color: 'from-[#2D7A94] to-[#66CCCC]',
      description: 'Guías paso a paso prácticas',
      stats: dashboardData.tutorials,
      link: '#tutorials'
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'case': return ChartBar;
      case 'interview': return Users;
      case 'tutorial': return GraduationCap;
      default: return Play;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'video': return 'bg-[#2D7A94]';
      case 'audio': return 'bg-[#4DA8C4]';
      case 'case': return 'bg-[#66CCCC]';
      case 'interview': return 'bg-[#B2D8E5]';
      case 'tutorial': return 'bg-[#2D7A94]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#2D7A94] font-montserrat mb-2">
            Dashboard de Progreso Multimedia
          </h1>
          <p className="text-gray-600 font-open-sans">
            Visualiza tu progreso en todos los formatos de contenido educativo
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-open-sans">Tiempo Total</p>
                <p className="text-2xl font-bold text-[#2D7A94] font-montserrat">
                  {learningStats.totalTime} min
                </p>
              </div>
              <Clock className="w-10 h-10 text-[#B2D8E5]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-open-sans">Completado</p>
                <p className="text-2xl font-bold text-[#4DA8C4] font-montserrat">
                  {learningStats.completionRate}%
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-[#66CCCC]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-open-sans">Racha Actual</p>
                <p className="text-2xl font-bold text-[#66CCCC] font-montserrat">
                  {learningStats.streakDays} días
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-[#4DA8C4]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-open-sans">Última Actividad</p>
                <p className="text-2xl font-bold text-[#B2D8E5] font-montserrat">
                  {learningStats.lastActive || 'Hoy'}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-[#2D7A94]" />
            </div>
          </motion.div>
        </div>

        {/* Multimedia Modules Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Progreso por Formato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {multimediaModules.map((module, index) => {
              const IconComponent = module.icon;
              const progress = (module.stats.completed / module.stats.total) * 100;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 font-montserrat">{module.title}</h3>
                          <p className="text-sm text-gray-600 font-open-sans">{module.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                        <span>Progreso</span>
                        <span>{module.stats.completed} / {module.stats.total}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${module.color} rounded-full`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 font-open-sans">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.stats.timeSpent} min</span>
                      </div>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* VAK Profile and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VAK Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Tu Perfil VAK</h2>
            <p className="text-gray-600 mb-6 font-open-sans">
              Basado en tu actividad de aprendizaje, este es tu perfil de estilo de aprendizaje:
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                  <span className="flex items-center">
                    <Video className="w-4 h-4 mr-2 text-[#2D7A94]" />
                    Visual
                  </span>
                  <span>{vakProfile.visual}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                    style={{ width: `${vakProfile.visual}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                  <span className="flex items-center">
                    <Headphones className="w-4 h-4 mr-2 text-[#4DA8C4]" />
                    Auditivo
                  </span>
                  <span>{vakProfile.auditory}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                    style={{ width: `${vakProfile.auditory}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#66CCCC]" />
                    Kinestésico
                  </span>
                  <span>{vakProfile.kinesthetic}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#66CCCC] to-[#B2D8E5] rounded-full"
                    style={{ width: `${vakProfile.kinesthetic}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-open-sans">
                <strong>Recomendación:</strong> {
                  vakProfile.visual >= vakProfile.auditory && vakProfile.visual >= vakProfile.kinesthetic
                    ? 'Continúa explorando videos y contenido visual para maximizar tu aprendizaje.'
                    : vakProfile.auditory >= vakProfile.visual && vakProfile.auditory >= vakProfile.kinesthetic
                    ? 'Las guías de audio y entrevistas son ideales para tu estilo de aprendizaje.'
                    : 'Los tutoriales prácticos y ejercicios son perfectos para tu estilo kinestésico.'
                }
              </p>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Actividad Reciente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center`}>
                        <ActivityIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 font-open-sans">{activity.title}</p>
                        <p className="text-sm text-gray-600 font-open-sans">{activity.module}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 font-open-sans">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3 font-montserrat">Próximos Objetivos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#2D7A94]" />
                    <span className="text-sm text-gray-700 font-open-sans">Completar 5 micro-videos más</span>
                  </div>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#4DA8C4]" />
                    <span className="text-sm text-gray-700 font-open-sans">Escuchar 2 guías de audio</span>
                  </div>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#66CCCC]" />
                    <span className="text-sm text-gray-700 font-open-sans">Analizar 1 caso de estudio</span>
                  </div>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-montserrat mb-2">Recomendaciones Personalizadas</h3>
              <p className="font-open-sans opacity-90">
                Basado en tu progreso, te recomendamos continuar con:{' '}
                <strong>Micro-Videos de Ingeniería de Prompts</strong>
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-[#2D7A94] rounded-xl font-bold hover:bg-gray-100 transition-colors font-montserrat">
              Continuar Aprendiendo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultimediaDashboard;