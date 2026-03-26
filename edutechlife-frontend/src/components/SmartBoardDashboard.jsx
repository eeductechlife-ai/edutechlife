import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarNavigation from './SidebarNavigation';
import NicoChat from './NicoChat';
import XPProgressBar from './XPProgressBar';
import MissionCard from './MissionCard';
import SubjectGrid from './SubjectGrid';
import GlassCard from './GlassCard';
import { GraduationCap, Play, BookOpen, Trophy, TrendingUp, Mic, MessageCircle, Brain, LogOut, Download, FileText, Users, Clock, Target, Award } from 'lucide-react';
import { callDeepseek } from '../utils/api';

const HomeView = memo(({
  studentName,
  missions,
  subjects,
  userLevel,
  onNavigate,
  onMissionStart,
  onMissionComplete,
  onGenerateReport
}) => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white font-montserrat mb-1">
            ¡Bienvenido, {studentName}!
          </h3>
          <p className="text-white/80 text-sm font-open-sans">
            Hoy tienes <span className="font-bold text-[#FFD166]">{missions.filter(m => !m.completed && !m.locked).length} misiones</span> pendientes 
            y <span className="font-bold text-[#FFD166]">{subjects.filter(s => s.progress > 0 && s.progress < 100).length} materias</span> para repasar.
          </p>
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right mr-3">
            <p className="text-3xl font-bold text-white font-montserrat">{userLevel}</p>
            <p className="text-xs text-white/70 font-open-sans">Nivel</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </motion.div>

    <GlassCard animate delay={0.1}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#66CCCC]"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-[#64748B] font-open-sans">Valeria está lista para ayudarte</span>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => onNavigate('lab-ia')}
            className="px-4 py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-lg text-sm font-semibold hover:bg-[#4DA8C4]/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />Chat con Valeria
          </motion.button>
          <motion.button
            onClick={() => onNavigate('vak')}
            className="px-4 py-2 bg-[#66CCCC]/10 text-[#004B63] rounded-lg text-sm font-semibold hover:bg-[#66CCCC]/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Brain className="w-4 h-4 inline mr-1" />Diagnóstico VAK
          </motion.button>
        </div>
      </div>
    </GlassCard>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Target, label: 'Misiones', count: missions.filter(m => !m.completed).length, gradient: 'from-[#4DA8C4] to-[#66CCCC]', onClick: () => onNavigate('misiones') },
        { icon: BookOpen, label: 'Materias', count: subjects.length, gradient: 'from-[#66CCCC] to-[#004B63]', onClick: () => onNavigate('materias') },
        { icon: Download, label: 'Mi Reporte', count: 'PDF', gradient: 'from-[#FFD166] to-[#FF8E53]', onClick: onGenerateReport },
        { icon: Brain, label: 'IA Lab', count: 'Pro', gradient: 'from-[#FF6B9D] to-[#FF8E53]', onClick: () => onNavigate('ialab') },
      ].map((action, index) => (
        <motion.button
          key={action.label}
          onClick={action.onClick}
          className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all text-center group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold text-[#004B63]">{action.label}</p>
          <p className="text-xs text-[#64748B]">{action.count} {typeof action.count === 'number' ? 'pendientes' : ''}</p>
        </motion.button>
      ))}
    </div>

    <GlassCard animate delay={0.3}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Misiones del Día</h3>
        <button 
          onClick={() => onNavigate('misiones')}
          className="text-sm text-[#4DA8C4] font-semibold hover:underline"
        >
          Ver todas →
        </button>
      </div>
      <div className="space-y-4">
        {missions.slice(0, 3).map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onStart={onMissionStart}
            onComplete={onMissionComplete}
          />
        ))}
      </div>
    </GlassCard>
  </div>
));

HomeView.displayName = 'HomeView';

const MissionsView = memo(({
  missions,
  onMissionStart,
  onMissionComplete,
  onNavigate
}) => (
  <GlassCard animate>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Todas las Misiones</h3>
      <span className="text-sm text-[#64748B]">{missions.filter(m => m.completed).length}/{missions.length} completadas</span>
    </div>
    <div className="space-y-4">
      {missions.map(mission => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onStart={onMissionStart}
          onComplete={onMissionComplete}
        />
      ))}
    </div>
  </GlassCard>
));

MissionsView.displayName = 'MissionsView';

const SubjectsView = memo(({
  subjects,
  onSelectSubject,
  onNavigate
}) => (
  <GlassCard animate>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Tus Materias</h3>
      <span className="text-sm text-[#64748B]">{subjects.filter(s => !s.locked).length} activas</span>
    </div>
    <SubjectGrid 
      subjects={subjects}
      onSelectSubject={onSelectSubject}
    />
  </GlassCard>
));

SubjectsView.displayName = 'SubjectsView';

const IALabView = memo(({ onNavigate }) => (
  <div className="space-y-6">
    <GlassCard animate>
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-4">Laboratorio de IA</h3>
      <p className="text-[#64748B] mb-6">
        Explora herramientas avanzadas de inteligencia artificial para potenciar tu aprendizaje.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🤖', title: 'Chat con Valeria', desc: 'Conversa con tu tutor IA', gradient: 'from-[#4DA8C4]/10 to-[#004B63]/5', action: () => onNavigate('lab-ia') },
          { icon: '🧠', title: 'Diagnóstico VAK', desc: 'Descubre tu estilo de aprendizaje', gradient: 'from-[#66CCCC]/10 to-[#4DA8C4]/5', action: () => onNavigate('vak') },
          { icon: '🏆', title: 'IA Lab Pro', desc: 'Certifícate en IA', gradient: 'from-[#FFD166]/10 to-[#FF8E53]/5', action: () => onNavigate('ialab') },
        ].map((item, index) => (
          <motion.button
            key={item.title}
            onClick={item.action}
            className={`bg-gradient-to-br ${item.gradient} p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all hover:shadow-lg hover:border-[#4DA8C4]/30`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <h4 className="font-bold text-[#004B63] font-montserrat mb-2">{item.title}</h4>
            <p className="text-sm text-[#64748B]">{item.desc}</p>
          </motion.button>
        ))}
      </div>
    </GlassCard>
  </div>
));

IALabView.displayName = 'IALabView';

const ProgressView = memo(({
  userXP,
  userLevel,
  streakDays,
  subjects,
  studentData,
  onGenerateReport
}) => {
  const averageProgress = useMemo(() => {
    const activeSubjects = subjects.filter(s => !s.locked);
    if (activeSubjects.length === 0) return 0;
    return Math.round(activeSubjects.reduce((acc, s) => acc + s.progress, 0) / activeSubjects.length);
  }, [subjects]);

  return (
    <div className="space-y-6">
      <GlassCard animate>
        <XPProgressBar currentXP={userXP} level={userLevel} streak={streakDays} />
      </GlassCard>
      
      <GlassCard animate delay={0.1}>
        <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Estadísticas de Aprendizaje</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Tiempo total', value: `${studentData.timeSpent || 0}min`, color: '#4DA8C4', bg: 'from-[#4DA8C4]/10 to-transparent' },
            { label: 'Interacciones', value: studentData.interactions, color: '#66CCCC', bg: 'from-[#66CCCC]/10 to-transparent' },
            { label: 'Promedio', value: `${averageProgress}%`, color: '#FFD166', bg: 'from-[#FFD166]/10 to-transparent' },
            { label: 'Días racha', value: streakDays, color: '#FF6B9D', bg: 'from-[#FF6B9D]/10 to-transparent' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`text-center p-6 rounded-xl bg-gradient-to-br ${stat.bg} border border-[#E2E8F0]`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-[#64748B] font-open-sans mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <motion.button
        onClick={onGenerateReport}
        className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Download className="w-5 h-5" />
        Descargar Reporte Completo
      </motion.button>
    </div>
  );
});

ProgressView.displayName = 'ProgressView';

const ReportModal = memo(({
  show,
  reportData,
  subjects,
  studentName,
  onClose,
  onDownload
}) => (
  <AnimatePresence>
    {show && reportData && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#004B63]">Reporte de Aprendizaje</h3>
            <button 
              onClick={onClose}
              className="text-[#64748B] hover:text-[#004B63] text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nivel', value: reportData.nivelActual, color: '#4DA8C4' },
                { label: 'XP Total', value: reportData.xpActual, color: '#66CCCC' },
                { label: 'Racha', value: `${reportData.diasRacha} días`, color: '#FFD166' },
                { label: 'Tiempo', value: `${reportData.tiempoSesion}min`, color: '#FF6B9D' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <p className="text-sm text-[#64748B]">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl">
              <p className="text-sm text-[#64748B] mb-2">Interacciones con Valeria</p>
              <p className="text-lg font-bold text-[#004B63]">{reportData.questionsAsked} preguntas</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={onDownload}
                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                Descargar Reporte
              </motion.button>
              <motion.button
                onClick={onClose}
                className="px-6 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cerrar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

ReportModal.displayName = 'ReportModal';

const SmartBoardDashboard = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [userXP, setUserXP] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [streakDays, setStreakDays] = useState(7);
  const [missions, setMissions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentName] = useState('Estudiante');
  const [studentData, setStudentData] = useState({
    sessionStart: new Date(),
    interactions: 0,
    questionsAsked: 0,
    missionsCompleted: 0,
    timeSpent: 0,
    topicsExplored: [],
    moodHistory: [],
    learningStyle: null,
    lastActive: new Date()
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  const sessionStartRef = useRef(new Date());

  useEffect(() => {
    const savedData = localStorage.getItem('edutechlife_student_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStudentData(prev => ({ ...prev, ...parsed }));
    }

    setMissions([
      { id: 1, title: 'Completa tu Diagnóstico VAK', description: 'Descubre tu estilo de aprendizaje preferido', type: 'quiz', difficulty: 'easy', duration: 15, xpReward: 100, progress: 100, completed: true, locked: false, featured: true, collaborative: false, skills: ['Auto-conocimiento', 'Metacognición'], badgeReward: 'Explorador VAK', streakBonus: 10, prerequisites: [] },
      { id: 2, title: 'Sube tu primer documento', description: 'Analiza un documento con Valeria IA', type: 'project', difficulty: 'medium', duration: 30, xpReward: 150, progress: 60, completed: false, locked: false, featured: false, collaborative: true, skills: ['Análisis de texto', 'IA aplicada'], badgeReward: 'Analista Digital', streakBonus: 15, prerequisites: [] },
      { id: 3, title: 'Módulo de Prompt Engineering', description: 'Domina la comunicación con IA', type: 'challenge', difficulty: 'hard', duration: 45, xpReward: 200, progress: 0, completed: false, locked: true, featured: true, collaborative: false, skills: ['Prompt engineering', 'Comunicación IA'], badgeReward: 'Maestro de Prompts', streakBonus: 20, prerequisites: [], requiredLevel: 5 },
      { id: 4, title: 'Proyecto colaborativo de ciencias', description: 'Trabaja en equipo para resolver problemas', type: 'collaboration', difficulty: 'medium', duration: 60, xpReward: 180, progress: 30, completed: false, locked: false, featured: false, collaborative: true, skills: ['Trabajo en equipo', 'Método científico'], badgeReward: 'Científico Colaborativo', streakBonus: 25, prerequisites: [] },
      { id: 5, title: 'Creación de portfolio digital', description: 'Desarrolla tu portfolio digital', type: 'creative', difficulty: 'expert', duration: 90, xpReward: 300, progress: 0, completed: false, locked: true, featured: true, collaborative: false, skills: ['Diseño digital', 'Storytelling'], badgeReward: 'Creador Digital', streakBonus: 30, prerequisites: [], requiredLevel: 8 }
    ]);

    setSubjects([
      { id: 'matematicas', name: 'Matemáticas Avanzadas', icon: 'mathematics', category: 'stem', level: 'Avanzado', teacher: 'Prof. Elena Rodríguez', description: 'Domina conceptos matemáticos complejos', progress: 75, lessons: 24, quizzes: 12, xp: 1200, prerequisites: 0, locked: false, featured: true },
      { id: 'fisica', name: 'Física Moderna', icon: 'physics', category: 'stem', level: 'Intermedio', teacher: 'Dr. Carlos Méndez', description: 'Explora los fundamentos de la física', progress: 60, lessons: 18, quizzes: 9, xp: 900, prerequisites: 1, locked: false, featured: true },
      { id: 'quimica', name: 'Química Avanzada', icon: 'chemistry', category: 'stem', level: 'Avanzado', teacher: 'Dra. María López', description: 'Química orgánica e inorgánica', progress: 45, lessons: 20, quizzes: 10, xp: 1000, prerequisites: 1, locked: false, featured: false },
      { id: 'literatura', name: 'Literatura Contemporánea', icon: 'literature', category: 'humanidades', level: 'Intermedio', teacher: 'Prof. Ana Torres', description: 'Análisis de obras contemporáneas', progress: 85, lessons: 16, quizzes: 8, xp: 800, prerequisites: 0, locked: false, featured: true },
      { id: 'historia', name: 'Historia Universal', icon: 'history', category: 'humanidades', level: 'Principiante', teacher: 'Prof. Roberto Díaz', description: 'Historia desde el origen hasta hoy', progress: 30, lessons: 22, quizzes: 11, xp: 1100, prerequisites: 0, locked: false, featured: false },
      { id: 'biologia', name: 'Biología Molecular', icon: 'biology', category: 'stem', level: 'Avanzado', teacher: 'Dr. Javier Ruiz', description: 'Estudio a nivel molecular', progress: 50, lessons: 20, quizzes: 10, xp: 1000, prerequisites: 2, locked: true, featured: false }
    ]);

    const timer = setInterval(() => {
      setStudentData(prev => ({
        ...prev,
        timeSpent: Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('edutechlife_student_data', JSON.stringify({
      ...studentData,
      lastActive: new Date()
    }));
  }, [studentData]);

  const trackInteraction = useCallback((type, data = {}) => {
    setStudentData(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      [type]: (prev[type] || 0) + 1,
      lastActive: new Date()
    }));
  }, []);

  const handleMissionStart = useCallback((mission) => {
    if (!mission.locked) {
      trackInteraction('missionsStarted');
    }
  }, [trackInteraction]);

  const handleMissionComplete = useCallback((mission) => {
    if (mission.completed) {
      trackInteraction('missionsCompleted');
      setUserXP(prev => prev + mission.xpReward);
      const newLevel = Math.floor((userXP + mission.xpReward) / 500) + 1;
      if (newLevel > userLevel) setUserLevel(newLevel);
    }
  }, [trackInteraction, userXP, userLevel]);

  const handleSubjectClick = useCallback((subject) => {
    if (!subject.locked) {
      trackInteraction('topicsExplored', [...(studentData.topicsExplored || []), subject.name]);
      setActiveTab('materias');
    }
  }, [trackInteraction, studentData.topicsExplored]);

  const handleValeriaQuestion = useCallback((question) => {
    trackInteraction('questionsAsked');
    callDeepseek(
      `Estudiante pregunta: ${question}`,
      'Eres Valeria, tutora virtual de Edutechlife. Responde de forma cálida, empática y en español latino. Usa emojis ocasionales. Mantén las respuestas cortas (2-3 oraciones máximo).',
      false
    );
  }, [trackInteraction]);

  const generateStudentReport = useCallback(() => {
    const activeSubjects = subjects.filter(s => !s.locked);
    const promedioProgreso = activeSubjects.length > 0 
      ? Math.round(activeSubjects.reduce((acc, s) => acc + s.progress, 0) / activeSubjects.length)
      : 0;

    setReportData({
      studentName,
      generatedAt: new Date(),
      ...studentData,
      xpActual: userXP,
      nivelActual: userLevel,
      diasRacha: streakDays,
      promedioProgreso,
      totalMaterias: subjects.length,
      materiasActivas: subjects.filter(s => s.progress > 0).length,
      tiempoSesion: Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
    });
    setShowReportModal(true);
  }, [studentName, studentData, userXP, userLevel, streakDays, subjects]);

  const downloadStudentReport = useCallback(() => {
    if (!reportData) return;
    
    const content = `
EDUTECHLIFE - REPORTE DE ESTUDIANTE
====================================
Fecha de generación: ${reportData.generatedAt.toLocaleString('es-ES')}
Estudiante: ${reportData.studentName}

RESUMEN DE ACTIVIDAD
--------------------
Tiempo en plataforma: ${reportData.timeSpent} minutos
Interacciones totales: ${reportData.interactions}
Preguntas a Valeria: ${reportData.questionsAsked}
Misiones completadas: ${reportData.missionsCompleted}

RENDIMIENTO ACADÉMICO
----------------------
Nivel actual: ${reportData.nivelActual}
XP acumulado: ${reportData.xpActual}
Racha de días: ${reportData.diasRacha}
Promedio de progreso: ${reportData.promedioProgreso}%

MATERIAS
--------
Total de materias: ${reportData.totalMaterias}
Materias activas: ${reportData.materiasActivas}
${subjects.filter(s => !s.locked).map(s => `- ${s.name}: ${s.progress}%`).join('\n')}

RECOMENDACIONES
---------------
${reportData.promedioProgreso >= 80 ? '✅ El estudiante muestra excelente rendimiento. Considerar desafíos avanzados.' : ''}
${reportData.promedioProgreso >= 50 && reportData.promedioProgreso < 80 ? '📚 El estudiante va bien. Sugerir más práctica en materias con bajo rendimiento.' : ''}
${reportData.promedioProgreso < 50 ? '⚠️ El estudiante necesita apoyo adicional. Considerar tutorías personalizadas.' : ''}

====================================
Documento generado por Edutechlife v2.286
Plataforma de Neuro-Educación Premium
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reportData, studentName, subjects]);

  const renderActiveView = useMemo(() => {
    const views = {
      inicio: (
        <HomeView
          studentName={studentName}
          missions={missions}
          subjects={subjects}
          userLevel={userLevel}
          onNavigate={setActiveTab}
          onMissionStart={handleMissionStart}
          onMissionComplete={handleMissionComplete}
          onGenerateReport={generateStudentReport}
        />
      ),
      misiones: (
        <MissionsView
          missions={missions}
          onMissionStart={handleMissionStart}
          onMissionComplete={handleMissionComplete}
          onNavigate={setActiveTab}
        />
      ),
      materias: (
        <SubjectsView
          subjects={subjects}
          onSelectSubject={handleSubjectClick}
          onNavigate={setActiveTab}
        />
      ),
      'lab-ia': (
        <IALabView onNavigate={onNavigate} />
      ),
      progreso: (
        <ProgressView
          userXP={userXP}
          userLevel={userLevel}
          streakDays={streakDays}
          subjects={subjects}
          studentData={studentData}
          onGenerateReport={generateStudentReport}
        />
      ),
    };

    return views[activeTab] || views.inicio;
  }, [
    activeTab, studentName, missions, subjects, userLevel, userXP, streakDays, studentData,
    handleMissionStart, handleMissionComplete, handleSubjectClick, generateStudentReport, onNavigate
  ]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="flex h-screen relative z-10">
        <div className="w-80 flex-shrink-0">
          <SidebarNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {renderActiveView}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-96 flex-shrink-0">
          <NicoChat
            studentName={studentName}
            onNavigate={onNavigate}
            onInteraction={trackInteraction}
          />
        </div>
      </div>

      <ReportModal
        show={showReportModal}
        reportData={reportData}
        subjects={subjects}
        studentName={studentName}
        onClose={() => setShowReportModal(false)}
        onDownload={downloadStudentReport}
      />
    </div>
  );
};

export default SmartBoardDashboard;
