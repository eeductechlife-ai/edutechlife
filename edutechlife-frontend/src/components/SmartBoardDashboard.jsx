import { useState, useEffect, useRef } from 'react';
import SidebarNavigation from './SidebarNavigation';
import ValeriaChat from './ValeriaChat';
import XPProgressBar from './XPProgressBar';
import MissionCard from './MissionCard';
import SubjectGrid from './SubjectGrid';
import { GraduationCap, Play, BookOpen, Trophy, TrendingUp, Mic, MessageCircle, Brain, LogOut, Download, FileText, Users, Clock, Target, Award } from 'lucide-react';
import { callDeepseek } from '../utils/api';

const SmartBoardDashboard = ({ onNavigate, onLogout }) => {
    const [activeTab, setActiveTab] = useState('inicio');
    const [valeriaState, setValeriaState] = useState('idle');
    const [userXP, setUserXP] = useState(1250);
    const [userLevel, setUserLevel] = useState(3);
    const [streakDays, setStreakDays] = useState(7);
    const [missions, setMissions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [studentName, setStudentName] = useState('Estudiante');
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
    
    const dashboardRef = useRef(null);
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

    const trackInteraction = (type, data = {}) => {
        setStudentData(prev => ({
            ...prev,
            interactions: prev.interactions + 1,
            [type]: (prev[type] || 0) + 1,
            lastActive: new Date()
        }));
    };

    const handleMissionStart = (mission) => {
        if (!mission.locked) {
            trackInteraction('missionsStarted');
            setValeriaState('thinking');
            setTimeout(() => {
                setValeriaState('idle');
            }, 2000);
        }
    };

    const handleMissionComplete = (mission) => {
        if (mission.completed) {
            trackInteraction('missionsCompleted');
            setUserXP(prev => prev + mission.xpReward);
            const newLevel = Math.floor((userXP + mission.xpReward) / 500) + 1;
            if (newLevel > userLevel) setUserLevel(newLevel);
        }
    };

    const handleSubjectClick = (subject) => {
        if (!subject.locked) {
            trackInteraction('topicsExplored', [...(studentData.topicsExplored || []), subject.name]);
            setActiveTab('materias');
        }
    };

    const handleValeriaQuestion = (question) => {
        trackInteraction('questionsAsked');
        callDeepseek(
            `Estudiante pregunta: ${question}`,
            'Eres Valeria, tutora virtual de Edutechlife. Responde de forma cálida, empática y en español latino. Usa emojis ocasionales. Mantén las respuestas cortas (2-3 oraciones máximo).',
            false
        );
    };

    const generateStudentReport = async () => {
        setReportData({
            studentName,
            generatedAt: new Date(),
            ...studentData,
            xpActual: userXP,
            nivelActual: userLevel,
            diasRacha: streakDays,
            promedioProgreso: Math.round(subjects.filter(s => !s.locked).reduce((acc, s) => acc + s.progress, 0) / subjects.filter(s => !s.locked).length),
            totalMaterias: subjects.length,
            materiasActivas: subjects.filter(s => s.progress > 0).length,
            tiempoSesion: Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
        });
        setShowReportModal(true);
    };

    const downloadStudentReport = () => {
        if (!reportData) return;
        
        const content = `
EDUTECHLIFE - REPORTE DE ESTUDIANTE
=====================================
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

=====================================
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
    };

    const renderActiveView = () => {
        switch (activeTab) {
            case 'inicio':
                return (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-white font-montserrat mb-1">¡Bienvenido, {studentName}!</h3>
                                    <p className="text-white/80 text-sm font-open-sans">
                                        Hoy tienes <span className="font-bold text-[#FFD166]">{missions.filter(m => !m.completed && !m.locked).length} misiones</span> pendientes 
                                        y <span className="font-bold text-[#FFD166]">{subjects.filter(s => s.progress > 0 && s.progress < 100).length} materias</span> para repasar.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                                    <div className="text-right mr-3">
                                        <p className="text-2xl font-bold text-white font-montserrat">{userLevel}</p>
                                        <p className="text-xs text-white/70 font-open-sans">Nivel</p>
                                    </div>
                                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <GraduationCap className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Valeria Status */}
                        <div className="glass-card p-6 rounded-[2rem]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#66CCCC] animate-pulse" />
                                    <span className="text-sm text-[#64748B] font-open-sans">Valeria está lista para ayudarte</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setActiveTab('lab-ia')}
                                        className="px-4 py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-lg text-sm font-semibold hover:bg-[#4DA8C4]/20 transition-all"
                                    >
                                        <MessageCircle className="w-4 h-4 inline mr-1" />Chat con Valeria
                                    </button>
                                    <button 
                                        onClick={() => onNavigate('vak')}
                                        className="px-4 py-2 bg-[#66CCCC]/10 text-[#004B63] rounded-lg text-sm font-semibold hover:bg-[#66CCCC]/20 transition-all"
                                    >
                                        <Brain className="w-4 h-4 inline mr-1" />Diagnóstico VAK
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button 
                                onClick={() => setActiveTab('misiones')}
                                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#4DA8C4] transition-all text-center group"
                            >
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-semibold text-[#004B63]">Misiones</p>
                                <p className="text-xs text-[#64748B]">{missions.filter(m => !m.completed).length} pendientes</p>
                            </button>
                            <button 
                                onClick={() => setActiveTab('materias')}
                                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#66CCCC] transition-all text-center group"
                            >
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#66CCCC] to-[#004B63] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-semibold text-[#004B63]">Materias</p>
                                <p className="text-xs text-[#64748B]">{subjects.length} disponibles</p>
                            </button>
                            <button 
                                onClick={() => generateStudentReport()}
                                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#FFD166] transition-all text-center group"
                            >
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#FFD166] to-[#FF8E53] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Download className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-semibold text-[#004B63]">Mi Reporte</p>
                                <p className="text-xs text-[#64748B]">Descargar</p>
                            </button>
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#FF6B9D] transition-all text-center group"
                            >
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#FF6B9D] to-[#FF8E53] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-semibold text-[#004B63]">IA Lab</p>
                                <p className="text-xs text-[#64748B]">Certifícate</p>
                            </button>
                        </div>

                        {/* Missions Section */}
                        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Misiones del Día</h3>
                                <button 
                                    onClick={() => setActiveTab('misiones')}
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
                                        onStart={handleMissionStart}
                                        onComplete={handleMissionComplete}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'misiones':
                return (
                    <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Todas las Misiones</h3>
                            <span className="text-sm text-[#64748B]">{missions.filter(m => m.completed).length}/{missions.length} completadas</span>
                        </div>
                        <div className="space-y-4">
                            {missions.map(mission => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                    onStart={handleMissionStart}
                                    onComplete={handleMissionComplete}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'materias':
                return (
                    <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Tus Materias</h3>
                            <span className="text-sm text-[#64748B]">{subjects.filter(s => !s.locked).length} activas</span>
                        </div>
                        <SubjectGrid 
                            subjects={subjects}
                            onSelectSubject={handleSubjectClick}
                        />
                    </div>
                );

            case 'lab-ia':
                return (
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-4">Laboratorio de IA</h3>
                            <p className="text-[#64748B] mb-6">
                                Explora herramientas avanzadas de inteligencia artificial para potenciar tu aprendizaje.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => setActiveTab('inicio')}
                                    className="bg-gradient-to-br from-[#4DA8C4]/10 to-[#004B63]/5 p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all hover:shadow-lg hover:border-[#4DA8C4]/30"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center mb-4 shadow-lg">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <h4 className="font-bold text-[#004B63] font-montserrat mb-2">Chat con Valeria</h4>
                                    <p className="text-sm text-[#64748B]">Conversa con tu tutor IA</p>
                                </button>
                                <button 
                                    onClick={() => onNavigate('vak')}
                                    className="bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5 p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all hover:shadow-lg hover:border-[#66CCCC]/30"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center mb-4 shadow-lg">
                                        <span className="text-2xl">🧠</span>
                                    </div>
                                    <h4 className="font-bold text-[#004B63] font-montserrat mb-2">Diagnóstico VAK</h4>
                                    <p className="text-sm text-[#64748B]">Descubre tu estilo de aprendizaje</p>
                                </button>
                                <button 
                                    onClick={() => onNavigate('ialab')}
                                    className="bg-gradient-to-br from-[#FFD166]/10 to-[#FF8E53]/5 p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all hover:shadow-lg hover:border-[#FFD166]/30"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFD166] to-[#FF8E53] flex items-center justify-center mb-4 shadow-lg">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <h4 className="font-bold text-[#004B63] font-montserrat mb-2">IA Lab Pro</h4>
                                    <p className="text-sm text-[#64748B]">Certifícate en IA</p>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'progreso':
                return (
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <XPProgressBar currentXP={userXP} level={userLevel} streak={streakDays} />
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Estadísticas de Aprendizaje</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#4DA8C4]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#4DA8C4] font-montserrat">
                                        {studentData.timeSpent || 0}min
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Tiempo total</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#66CCCC]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#66CCCC] font-montserrat">
                                        {studentData.interactions}
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Interacciones</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#FFD166]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#FFD166] font-montserrat">
                                        {Math.round(subjects.filter(s => !s.locked).reduce((acc, s) => acc + s.progress, 0) / subjects.filter(s => !s.locked).length)}%
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Promedio</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#FF6B9D]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#FF6B9D] font-montserrat">
                                        {streakDays}
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Días racha</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={generateStudentReport}
                            className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Descargar Reporte Completo
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div ref={dashboardRef} className="relative min-h-screen bg-[#F8FAFC] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="flex h-screen relative z-10">
                <div className="w-80">
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
                            {renderActiveView()}
                        </div>
                    </div>
                </div>

                <div className="w-96">
                    <ValeriaChat
                        studentName={studentName}
                        onNavigate={onNavigate}
                        onInteraction={trackInteraction}
                    />
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && reportData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-[#004B63]">Reporte de Aprendizaje</h3>
                            <button 
                                onClick={() => setShowReportModal(false)}
                                className="text-[#64748B] hover:text-[#004B63]"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#4DA8C4]/10 p-4 rounded-xl">
                                    <p className="text-sm text-[#64748B]">Nivel</p>
                                    <p className="text-2xl font-bold text-[#4DA8C4]">{reportData.nivelActual}</p>
                                </div>
                                <div className="bg-[#66CCCC]/10 p-4 rounded-xl">
                                    <p className="text-sm text-[#64748B]">XP Total</p>
                                    <p className="text-2xl font-bold text-[#66CCCC]">{reportData.xpActual}</p>
                                </div>
                                <div className="bg-[#FFD166]/10 p-4 rounded-xl">
                                    <p className="text-sm text-[#64748B]">Racha</p>
                                    <p className="text-2xl font-bold text-[#FFD166]">{reportData.diasRacha} días</p>
                                </div>
                                <div className="bg-[#FF6B9D]/10 p-4 rounded-xl">
                                    <p className="text-sm text-[#64748B]">Tiempo</p>
                                    <p className="text-2xl font-bold text-[#FF6B9D]">{reportData.tiempoSesion}min</p>
                                </div>
                            </div>

                            <div className="bg-[#F8FAFC] p-4 rounded-xl">
                                <p className="text-sm text-[#64748B] mb-2">Interacciones con Valeria</p>
                                <p className="text-lg font-bold text-[#004B63]">{reportData.questionsAsked} preguntas</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={downloadStudentReport}
                                    className="flex-1 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Descargar Reporte
                                </button>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="px-6 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartBoardDashboard;
