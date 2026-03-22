import { useState, useEffect, useRef } from 'react';
import SidebarNavigation from './SidebarNavigation';
import ValeriaHologram from './ValeriaHologram';
import XPProgressBar from './XPProgressBar';
import MissionCard from './MissionCard';
import SubjectGrid from './SubjectGrid';
import { useCustomCursor } from '../hooks/useCustomCursor';
import { ArrowLeft, Home } from 'lucide-react';

const SmartBoardDashboard = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('inicio');
    const [valeriaState, setValeriaState] = useState('idle');
    const [userXP, setUserXP] = useState(1250);
    const [userLevel, setUserLevel] = useState(3);
    const [streakDays, setStreakDays] = useState(7);
    const [missions, setMissions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const dashboardRef = useRef(null);
    useCustomCursor();

    // Initialize dashboard data
    useEffect(() => {
        // Sample missions data
        setMissions([
            {
                id: 1,
                title: 'Completa tu primer VAK Test',
                description: 'Descubre tu estilo de aprendizaje preferido mediante un análisis personalizado',
                type: 'quiz',
                difficulty: 'easy',
                duration: 15,
                xpReward: 100,
                progress: 100,
                completed: true,
                locked: false,
                featured: true,
                collaborative: false,
                skills: ['Auto-conocimiento', 'Metacognición', 'Estilos de aprendizaje'],
                badgeReward: 'Explorador VAK',
                streakBonus: 10,
                prerequisites: []
            },
            {
                id: 2,
                title: 'Sube tu primer documento al SmartBoard',
                description: 'Analiza un documento con Valeria IA y obtén insights personalizados',
                type: 'project',
                difficulty: 'medium',
                duration: 30,
                xpReward: 150,
                progress: 60,
                completed: false,
                locked: false,
                featured: false,
                collaborative: true,
                skills: ['Análisis de texto', 'IA aplicada', 'Comprensión lectora'],
                badgeReward: 'Analista Digital',
                streakBonus: 15,
                prerequisites: ['VAK Test completado']
            },
            {
                id: 3,
                title: 'Completa el módulo de Prompt Engineering',
                description: 'Domina la comunicación con IA para obtener mejores resultados',
                type: 'challenge',
                difficulty: 'hard',
                duration: 45,
                xpReward: 200,
                progress: 0,
                completed: false,
                locked: true,
                featured: true,
                collaborative: false,
                skills: ['Prompt engineering', 'Comunicación con IA', 'Pensamiento crítico'],
                badgeReward: 'Maestro de Prompts',
                streakBonus: 20,
                prerequisites: ['Documento analizado', 'Nivel 5+'],
                requiredLevel: 5
            },
            {
                id: 4,
                title: 'Proyecto colaborativo de ciencias',
                description: 'Trabaja en equipo para resolver un problema científico real',
                type: 'collaboration',
                difficulty: 'medium',
                duration: 60,
                xpReward: 180,
                progress: 30,
                completed: false,
                locked: false,
                featured: false,
                collaborative: true,
                skills: ['Trabajo en equipo', 'Método científico', 'Presentación'],
                badgeReward: 'Científico Colaborativo',
                streakBonus: 25,
                prerequisites: []
            },
            {
                id: 5,
                title: 'Creación de portfolio digital',
                description: 'Desarrolla tu portfolio digital con proyectos destacados',
                type: 'creative',
                difficulty: 'expert',
                duration: 90,
                xpReward: 300,
                progress: 0,
                completed: false,
                locked: true,
                featured: true,
                collaborative: false,
                skills: ['Diseño digital', 'Storytelling', 'Presentación personal'],
                badgeReward: 'Creador Digital',
                streakBonus: 30,
                prerequisites: ['3 proyectos completados', 'Nivel 8+'],
                requiredLevel: 8
            }
        ]);

        // Sample subjects data
        setSubjects([
            {
                id: 'matematicas',
                name: 'Matemáticas Avanzadas',
                icon: 'mathematics',
                category: 'stem',
                level: 'Avanzado',
                teacher: 'Prof. Elena Rodríguez',
                description: 'Domina conceptos matemáticos complejos desde álgebra hasta cálculo diferencial',
                progress: 75,
                lessons: 24,
                quizzes: 12,
                xp: 1200,
                prerequisites: 0,
                locked: false,
                featured: true
            },
            {
                id: 'fisica',
                name: 'Física Moderna',
                icon: 'physics',
                category: 'stem',
                level: 'Intermedio',
                teacher: 'Dr. Carlos Méndez',
                description: 'Explora los fundamentos de la física cuántica y relatividad',
                progress: 60,
                lessons: 18,
                quizzes: 9,
                xp: 900,
                prerequisites: 1,
                locked: false,
                featured: false
            },
            {
                id: 'programacion',
                name: 'Programación con Python',
                icon: 'programming',
                category: 'tech',
                level: 'Principiante',
                teacher: 'Ing. Ana López',
                description: 'Aprende los fundamentos de programación con Python desde cero',
                progress: 45,
                lessons: 30,
                quizzes: 15,
                xp: 1500,
                prerequisites: 0,
                locked: false,
                featured: true
            },
            {
                id: 'ia',
                name: 'Inteligencia Artificial',
                icon: 'data-science',
                category: 'tech',
                level: 'Avanzado',
                teacher: 'Dra. Sofia Chen',
                description: 'Introducción a machine learning y redes neuronales artificiales',
                progress: 30,
                lessons: 20,
                quizzes: 10,
                xp: 1000,
                prerequisites: 2,
                locked: true,
                featured: true
            },
            {
                id: 'historia',
                name: 'Historia Universal',
                icon: 'history',
                category: 'humanities',
                level: 'Intermedio',
                teacher: 'Prof. Miguel Ángel',
                description: 'Recorrido por los hitos más importantes de la historia mundial',
                progress: 85,
                lessons: 15,
                quizzes: 8,
                xp: 750,
                prerequisites: 0,
                locked: false,
                featured: false
            },
            {
                id: 'literatura',
                name: 'Literatura Clásica',
                icon: 'literature',
                category: 'humanities',
                level: 'Principiante',
                teacher: 'Dra. Isabel García',
                description: 'Análisis de obras maestras de la literatura universal',
                progress: 40,
                lessons: 12,
                quizzes: 6,
                xp: 600,
                prerequisites: 0,
                locked: false,
                featured: false
            },
            {
                id: 'musica',
                name: 'Teoría Musical',
                icon: 'music',
                category: 'arts',
                level: 'Intermedio',
                teacher: 'Maestro Roberto',
                description: 'Fundamentos de teoría musical y composición',
                progress: 25,
                lessons: 16,
                quizzes: 8,
                xp: 800,
                prerequisites: 1,
                locked: false,
                featured: false
            },
            {
                id: 'arte',
                name: 'Arte Digital',
                icon: 'art',
                category: 'arts',
                level: 'Principiante',
                teacher: 'Artista Digital Luna',
                description: 'Creación de arte digital con herramientas modernas',
                progress: 10,
                lessons: 22,
                quizzes: 11,
                xp: 1100,
                prerequisites: 0,
                locked: false,
                featured: true
            },
            {
                id: 'biologia',
                name: 'Biología Molecular',
                icon: 'biology',
                category: 'stem',
                level: 'Avanzado',
                teacher: 'Dr. Javier Ruiz',
                description: 'Estudio de la biología a nivel molecular y celular',
                progress: 50,
                lessons: 20,
                quizzes: 10,
                xp: 1000,
                prerequisites: 2,
                locked: true,
                featured: false
            }
        ]);

        // Animate dashboard entry
        if (dashboardRef.current) {
            // Simple fade-in animation
            dashboardRef.current.style.opacity = '0';
            dashboardRef.current.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (dashboardRef.current) {
                    dashboardRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    dashboardRef.current.style.opacity = '1';
                    dashboardRef.current.style.transform = 'translateY(0)';
                }
            }, 100);
        }
    }, []);

    const handleMissionStart = (mission) => {
        if (!mission.locked) {
            setValeriaState('thinking');
            // Simulate mission start
            setTimeout(() => {
                setValeriaState('speaking');
                
                // Valeria feedback
                setTimeout(() => {
                    setValeriaState('idle');
                }, 2000);
            }, 1500);
        }
    };

    const handleMissionComplete = (mission) => {
        if (mission.completed) {
            console.log('View certificate for mission:', mission.id);
            // Handle certificate view
        }
    };

    const handleSubjectClick = (subject) => {
        console.log('Selected subject:', subject);
        // Handle subject selection
    };

    const handleValeriaMessage = (message) => {
        console.log('Valeria message:', message);
        // Handle chat messages
    };

    const renderActiveView = () => {
        switch (activeTab) {
            case 'inicio':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-4">¡Bienvenido de vuelta!</h3>
                                <p className="text-[#64748B] font-open-sans mb-4">
                                    Hoy tienes <span className="font-bold text-[#4DA8C4]">{missions.filter(m => !m.completed && !m.locked).length} misiones</span> pendientes 
                                    y <span className="font-bold text-[#66CCCC]">{subjects.filter(s => s.progress > 0 && s.progress < 100).length} materias</span> para repasar.
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
                                    <span className="text-sm text-[#64748B] font-open-sans">Valeria está lista para ayudarte</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                                <XPProgressBar currentXP={userXP} level={userLevel} streak={streakDays} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-[#004B63] font-montserrat">Misiones del Día</h3>
                                <span className="text-sm font-mono text-[#4DA8C4] font-open-sans">
                                    {missions.filter(m => m.completed).length}/{missions.length} completadas
                                </span>
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
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Todas las Misiones</h3>
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
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Tus Materias</h3>
                        <SubjectGrid 
                            subjects={subjects}
                            onSelectSubject={handleSubjectClick}
                        />
                    </div>
                );

            case 'lab-ia':
                return (
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Laboratorio de IA</h3>
                        <p className="text-[#64748B] font-open-sans mb-6">
                            Explora herramientas avanzadas de inteligencia artificial 
                            para potenciar tu aprendizaje.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button className="bg-gradient-to-br from-[#4DA8C4]/10 to-[#004B63]/5 p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:border-[#4DA8C4]/30">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <h4 className="font-bold text-[#004B63] font-montserrat mb-2">Chat con Valeria</h4>
                                <p className="text-sm text-[#64748B] font-open-sans">Conversa con tu tutor IA sobre cualquier tema</p>
                            </button>
                            <button className="bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5 p-6 rounded-2xl border border-[#E2E8F0] text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:border-[#66CCCC]/30">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-2xl">🧠</span>
                                </div>
                                <h4 className="font-bold text-[#004B63] font-montserrat mb-2">VAK Test</h4>
                                <p className="text-sm text-[#64748B] font-open-sans">Descubre tu estilo de aprendizaje preferido</p>
                            </button>
                        </div>
                    </div>
                );

            case 'progreso':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                            <XPProgressBar currentXP={userXP} level={userLevel} streak={streakDays} />
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                            <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">Estadísticas de Aprendizaje</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#4DA8C4]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#4DA8C4] font-montserrat">
                                        24h
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Tiempo total</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#66CCCC]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#66CCCC] font-montserrat">
                                        42
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Misiones</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#FFD166]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#FFD166] font-montserrat">
                                        87%
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Promedio</div>
                                </div>
                                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[#FF6B9D]/10 to-transparent border border-[#E2E8F0]">
                                    <div className="text-3xl font-black text-[#FF6B9D] font-montserrat">
                                        14
                                    </div>
                                    <div className="text-sm text-[#64748B] font-open-sans mt-2">Días racha</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div 
            ref={dashboardRef}
            className="relative min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#E2E8F0] overflow-hidden"
        >
            {/* Botón flotante para volver al inicio */}
            <button
                onClick={() => onNavigate('landing')}
                className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold font-open-sans">Volver al Inicio</span>
            </button>
            
            {/* Dashboard Layout */}
            <div className="flex h-screen">
                {/* Sidebar Navigation */}
                <div className="w-80">
                    <SidebarNavigation 
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Content Area */}
                    <div className="flex-1 overflow-auto p-8">
                        <div className="max-w-7xl mx-auto">
                            {renderActiveView()}
                        </div>
                    </div>
                </div>

                {/* Valeria Hologram Panel */}
                <div className="w-96">
                    <ValeriaHologram
                        status={valeriaState}
                        message="¡Hola! Estoy aquí para ayudarte en tu aprendizaje."
                    />
                </div>
            </div>
        </div>
    );
};

export default SmartBoardDashboard;