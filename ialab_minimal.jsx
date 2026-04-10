import { useState, useRef, useEffect } from 'react';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';
import ValerioAvatar from './ValerioAvatar';
import html2pdf from 'html2pdf.js';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useInView } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { useAuth } from '../context/AuthContext';
import { getAllProgress, saveProgress, PROGRESS_STATUS, saveLastLesson, getUserLastProgress } from '../lib/progress';
import { LogOut, Lightbulb } from 'lucide-react';

const IALabFixed = ({ onBack }) => {
    const { user, isLoading: authLoading, signOut } = useAuth();
    
    const [activeMod, setActiveMod] = useState(1);
    const [activeTab, setActiveTab] = useState('lab');
    const [input, setInput] = useState('');
    const [genData, setGenData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadMsg, setLoadMsg] = useState('');
    const [certName, setCertName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [completedModules, setCompletedModules] = useState([]);
    const [courseProgress, setCourseProgress] = useState(20);
    const [visitedModules, setVisitedModules] = useState([1]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    
    const [evalAnswers, setEvalAnswers] = useState({});
    const [evalSubmitted, setEvalSubmitted] = useState(false);
    const [evalScore, setEvalScore] = useState(0);
    
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');
    const [showValerioDrawer, setShowValerioDrawer] = useState(false);
    
    // Estado para controlar dropdown de perfil de usuario
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    
    // Estado para mostrar tooltip de evaluación bloqueada
    const [showEvaluationTooltip, setShowEvaluationTooltip] = useState(false);
    
    // Estado para animaciones de entrada secuencial de acordeones
    const [visibleAccordions, setVisibleAccordions] = useState([]);
    
    // Estado para controlar expansión del Muro de Insights
    const [insightsExpanded, setInsightsExpanded] = useState(false);
    
    // Estado para controlar dropdowns del sidebar
    const [sidebarDropdowns, setSidebarDropdowns] = useState({
        videos: false,
        recursos: false
    });
    
    const toggleSidebarDropdown = (section) => {
        setSidebarDropdowns(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    // Resto del código de estado y funciones...
    
    return (
        <>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Encabezado Global */}
            <header className="w-full fixed top-0 left-0 z-[60] h-20 bg-gradient-to-r from-white via-white/98 to-white/95 backdrop-blur-xl border-b border-slate-100/80 px-10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,55,74,0.08)]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00374A] via-[#00BCD4] to-[#4DA8C4] rounded-xl flex items-center justify-center shadow-sm">
                            <Icon name="fa-flask-vial" className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl text-[#00374A] tracking-tight">IA Lab Pro</h1>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed">Hyper-Intelligence Certification</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-cyan-50/40 backdrop-blur-md border border-cyan-100/50 text-cyan-700 rounded-full hover:bg-cyan-50/60 hover:scale-[1.02] hover:shadow-sm transition-all duration-500 ease-out">
                        <span className="text-sm font-semibold">{completedModules.length}/5 Módulos</span>
                    </div>
                </div>
            </header>

            {/* Contenedor de Layout */}
            <div ref={containerRef} className="flex flex-row items-start min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 relative font-open-sans">
                {/* Sidebar Izquierdo */}
                <aside className="w-[25%] sticky top-20 h-[calc(100vh-5rem)] border-r border-[#004B63]/10 bg-gradient-to-b from-white via-white/98 to-[#F8FAFC]/95 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,75,99,0.12)] z-30">
                    <div className="px-6 py-8 space-y-8">
                        {/* Progress Circle */}
                        <div className="flex flex-col items-center p-6 border border-slate-100/60 bg-white/90 shadow-[0_40px_80px_rgba(0,75,99,0.08)] rounded-3xl w-full backdrop-blur-sm">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="#E2E8F0" strokeWidth="10" fill="none" className="stroke-slate-100" />
                                    <circle cx="64" cy="64" r="56" stroke="#00BCD4" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="351.858" strokeDashoffset={351.858 - (351.858 * Math.min(completedModules.length * 20, 100)) / 100} className="transition-all duration-700 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#00374A]">{Math.min(completedModules.length * 20, 100)}%</div>
                                        <div className="text-xs text-slate-500 mt-1">Completado</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-[#00374A] mb-1">Progreso del Curso</h3>
                                <p className="text-sm text-slate-600">Avanza completando módulos</p>
                            </div>
                        </div>

                        {/* Sección: Módulos del Curso */}
                        <div className="px-2 w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-[#004B63]">
                                    <Icon name="fa-layer-group" className="text-sm" />
                                </div>
                                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                    MÓDULOS DEL CURSO
                                </h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                            </div>
                            <div className="space-y-2">
                                {/* Módulos aquí */}
                            </div>
                        </div>

                        {/* Sección: Videos del Módulo */}
                        <div className="px-2 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-[#004B63]">
                                        <Icon name="fa-video-camera" className="text-sm" />
                                    </div>
                                    <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                        VIDEOS DEL MÓDULO
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                                </div>
                                <Icon 
                                    name={sidebarDropdowns.videos ? "fa-chevron-up" : "fa-chevron-down"} 
                                    className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
                                    onClick={() => toggleSidebarDropdown('videos')}
                                />
                            </div>
                            {sidebarDropdowns.videos && (
                                <div className="space-y-3 animate-fadeIn">
                                    {/* Videos aquí */}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Área de Contenido Principal */}
                <main className="w-[75%] ml-[25%] pt-20 p-10">
                    <div className="space-y-8">
                        {/* Contenido principal aquí */}
                        <div className="text-center py-20">
                            <h2 className="text-3xl font-bold text-[#00374A] mb-4">IA Lab Pro</h2>
                            <p className="text-slate-600">Componente funcionando correctamente</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Valerio FAB */}
            <button 
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0]/50 rounded-full shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group hover:shadow-[0_12px_40px_rgba(0,75,99,0.16)]"
                onClick={() => setShowValerioDrawer(!showValerioDrawer)}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                    <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="#004B63" />
                    <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="#00BCD4" />
                    <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="#00BCD4" />
                    <path d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" fill="#00BCD4" className="animate-pulse" />
                </svg>
            </button>
        </>
    );
};

export default IALabFixed;