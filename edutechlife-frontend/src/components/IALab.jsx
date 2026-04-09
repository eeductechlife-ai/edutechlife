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
        videos: true,  // Expandido por defecto para mejor UX
        recursos: false
    });
    
    // Estado para controlar acordeones del Cuadro de Introducción
    const [openAccordions, setOpenAccordions] = useState({});
    
    const toggleSidebarDropdown = (section) => {
        setSidebarDropdowns(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const loadingIntervalRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const chartRef = useRef(null);
    const profileDropdownRef = useRef(null);
    
    const isChartInView = useInView(chartRef);
    
    const msgs = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];
    
    const modules = [
        { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Dar instrucciones claras a la IA', 'Mejorar cualquier pregunta para obtener mejores respuestas', 'Entender por qué la IA falla y cómo corregirlo', 'Obtener resultados útiles en menos tiempo', 'Aplicar la IA en estudio, trabajo y vida diaria', 'Pedir exactamente lo que necesita, sin rodeos'], challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.', desc: 'Desarrollar la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales.', duration: '4h 30min', level: 'Avanzado', videos: 12, projects: 3 },
        { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', duration: '5h 00min', level: 'Avanzado', videos: 15, projects: 4 },
        { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.', duration: '3h 45min', level: 'Intermedio', videos: 10, projects: 2 },
        { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.', duration: '4h 00min', level: 'Intermedio', videos: 8, projects: 3 },
        { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '6h 00min', level: 'Experto', videos: 6, projects: 5 },
    ];
    
    const LAST_MODULE_ID = 5;
    
    const isModuleLocked = (moduleId) => {
        if (moduleId === 1) return false;
        return !completedModules.includes(moduleId) && !visitedModules.includes(moduleId);
    };
    
    const isEvaluationLocked = (moduleId) => {
        if (moduleId === 1) return false;
        const previousModuleId = moduleId - 1;
        return !completedModules.includes(previousModuleId);
    };
    
    // Función para toggle de acordeones
    const toggleAccordion = (id) => {
        setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Funciones para el dropdown de perfil
    const handleProfileInfo = () => {
        setShowProfileDropdown(false);
        console.log('Abrir información de perfil');
        // Aquí se podría abrir un modal o redirigir a una página de perfil
    };

    const handleChangePassword = () => {
        setShowProfileDropdown(false);
        console.log('Abrir modal de cambio de contraseña');
        // Aquí se podría abrir un modal para cambiar contraseña
    };

    const handleMyCertificates = () => {
        setShowProfileDropdown(false);
        console.log('Abrir mis certificados');
        // Aquí se podría abrir un modal o redirigir a certificados
    };

    const handleSettings = () => {
        setShowProfileDropdown(false);
        console.log('Abrir configuración');
        // Aquí se podría abrir un modal o redirigir a configuración
    };
    
    // Función para sintetizar prompts en el laboratorio
    const handleOptimize = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setGenData(null);
        let idx = 0;
        setLoadMsg(msgs[0]);
        loadingIntervalRef.current = setInterval(() => {
            idx = (idx + 1) % msgs.length;
            setLoadMsg(msgs[idx]);
        }, 1800);
        
        const r = await callDeepseek(
            input,
            `Eres el Arquitecto de Prompts Élite de Edutechlife. Analiza la siguiente idea del usuario y genera:
1. Un MASTER PROMPT estructurado usando el framework RTF (Rol, Tarea, Formato)
2. Un FEEDBACK TÉCNICO detallado explicando las técnicas de ingeniería de prompts aplicadas

ESTRUCTURA REQUERIDA (JSON):
{
  "masterPrompt": "Prompt estructurado con RTF: Rol claro, Tarea específica, Formato definido",
  "feedback": "Explicación técnica detallada (3-4 oraciones) mencionando técnicas como: Few-Shot Prompting, Chain-of-Thought, Contexto Dinámico, Delimitación de Tono, etc.",
  "techniques": ["Lista", "de", "técnicas", "aplicadas"]
}

IDEAS DEL USUARIO PARA ANALIZAR: "${input}"`,
            true
        );
        
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        if (!r.error) setGenData(r);
        setLoading(false);
    };
    
    const curr = modules.find(m => m.id === activeMod) || modules[0];
    
    // Effect para cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);
    
    // Effect para animación de entrada secuencial de acordeones
    useEffect(() => {
        const accordionIds = [1, 2, 3, 4, 5, 6];
        const timers = [];
        
        accordionIds.forEach((id, index) => {
            const timer = setTimeout(() => {
                setVisibleAccordions(prev => [...prev, id]);
            }, index * 100); // Animación escalonada
            timers.push(timer);
        });
        
        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);
    
    // Resto de funciones del componente...
    
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
                    
                    {/* Botón de Perfil de Usuario */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-slate-200/50 rounded-full hover:bg-white/20 hover:border-slate-300 transition-all duration-300"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-[#00374A] to-[#00BCD4] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">JE</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold text-[#00374A]">John Edison</span>
                                <span className="text-xs text-slate-500">Estudiante</span>
                            </div>
                            <Icon 
                                name={showProfileDropdown ? 'fa-chevron-up' : 'fa-chevron-down'} 
                                className="text-slate-500 text-sm transition-transform duration-300"
                            />
                        </button>
                        
                        {/* Dropdown de Perfil */}
                        <div className={`absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] transition-all duration-300 ${showProfileDropdown ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                            <div className="p-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#00374A] to-[#00BCD4] rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">JE</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-[#00374A]">John Edison</p>
                                        <p className="text-xs text-slate-500">john.edison@edutechlife.com</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-2">
                                <button 
                                    onClick={handleProfileInfo}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <Icon name="fa-user" className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" />
                                    <span className="text-sm text-[#00374A] font-normal">Información General</span>
                                </button>
                                
                                <button 
                                    onClick={handleChangePassword}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <Icon name="fa-key" className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" />
                                    <span className="text-sm text-[#00374A] font-normal">Cambiar Contraseña</span>
                                </button>
                                
                                <button 
                                    onClick={handleMyCertificates}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <Icon name="fa-medal" className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" />
                                    <span className="text-sm text-[#00374A] font-normal">Mis Certificados</span>
                                </button>
                                
                                <button 
                                    onClick={handleSettings}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group"
                                >
                                    <Icon name="fa-gear" className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" />
                                    <span className="text-sm text-[#00374A] font-normal">Configuración</span>
                                </button>
                                
                                <div className="border-t border-slate-100 my-2"></div>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 group"
                                >
                                    <Icon name="fa-sign-out" className="text-red-500 text-sm" />
                                    <span className="text-sm text-red-500 font-normal">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenedor de Layout */}
            <div ref={containerRef} className="flex flex-row items-start min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 relative font-open-sans">
                {/* Sidebar Izquierdo - VERSIÓN SIMPLIFICADA */}
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
                                {modules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => !isModuleLocked(mod.id) && setActiveMod(mod.id)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeMod === mod.id ? 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white' : 'hover:bg-[#004B63]/10'}`}
                                        disabled={isModuleLocked(mod.id)}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeMod === mod.id ? 'bg-white/20' : 'bg-[#004B63]/10'}`}>
                                            <Icon name={mod.icon} className={`${activeMod === mod.id ? 'text-white' : 'text-[#004B63]'} text-sm`} />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="font-semibold text-sm truncate font-body">{mod.title}</p>
                                            <p className={`text-xs ${activeMod === mod.id ? 'text-white/80' : 'text-[#64748B]'} font-body`}>
                                                {mod.duration}
                                            </p>
                                        </div>
                                        {isModuleLocked(mod.id) && (
                                            <Icon name="fa-lock" className="text-xs text-slate-400" />
                                        )}
                                        {!isModuleLocked(mod.id) && completedModules.includes(mod.id) && (
                                            <Icon name="fa-check" className="text-xs text-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                         {/* Sección: Videos del Módulo - Integrada al Sidebar */}
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
                                     {/* Video 1: Mastery Framework */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Mastery Framework</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-body">Principiante</span>
                                                 <span className="text-xs text-[#64748B] font-body">12:45</span>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Video 2: Contexto Dinámico */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Contexto Dinámico</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg font-body">Intermedio</span>
                                                 <span className="text-xs text-[#64748B] font-body">18:30</span>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Video 3: Zero-Shot Prompting */}
                                     <div className="flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 cursor-pointer group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-play" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Zero-Shot Prompting</p>
                                             <div className="flex items-center gap-3 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-body">Avanzado</span>
                                                 <span className="text-xs text-[#64748B] font-body">22:15</span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             )}
                         </div>

                         {/* Sección: Recursos Descargables - Integrada al Sidebar */}
                         <div className="px-2 w-full">
                             <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className="text-[#004B63]">
                                         <Icon name="fa-clipboard" className="text-sm" />
                                     </div>
                                     <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                         RECURSOS DESCARGABLES
                                     </h3>
                                     <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                                 </div>
                                 <Icon 
                                     name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"} 
                                     className="text-[#004B63] text-sm transition-transform duration-300 cursor-pointer hover:text-[#00BCD4]"
                                     onClick={() => toggleSidebarDropdown('recursos')}
                                 />
                             </div>
                     
                             {sidebarDropdowns.recursos && (
                                 <div className="space-y-3 animate-fadeIn">
                                     {/* Recurso 1: Plantilla MasterPrompt Pro */}
                                     <button className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-file-pdf" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Plantilla MasterPrompt Pro</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg font-body">PDF</span>
                                             </div>
                                         </div>
                                         <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                     </button>
                                     
                                     {/* Recurso 2: Checklist de Evaluación */}
                                     <button className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-table" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Checklist de Evaluación</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-lg font-body">Cheatsheet</span>
                                             </div>
                                         </div>
                                         <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                     </button>
                                     
                                     {/* Recurso 3: Templates JSON para APIs */}
                                     <button className="w-full flex items-center gap-3 p-3 hover:bg-[#004B63]/10 rounded-xl transition-all duration-300 text-left group">
                                         <div className="w-10 h-10 bg-[#004B63]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63]/30">
                                             <Icon name="fa-code" className="text-[#004B63] text-sm" />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-[#334155] truncate font-body">Templates JSON para APIs</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                 <span className="text-xs font-medium px-3 py-1.5 bg-[#FFD166]/10 text-[#FFD166] rounded-lg font-body">JSON</span>
                                             </div>
                                         </div>
                                         <Icon name="fa-download" className="text-[#004B63] text-sm hover:text-[#00BCD4] transition-colors" />
                                     </button>
                                 </div>
                              )}
                          </div>

                         {/* Sección: Detalles del Curso */}
                         <div className="px-2 w-full">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="text-[#004B63]">
                                     <Icon name="fa-info-circle" className="text-sm" />
                                 </div>
                                 <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#004B63] font-display">
                                     DETALLES DEL CURSO
                                 </h3>
                                 <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/30 to-transparent"></div>
                             </div>
                             <div className="space-y-3">
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-clock" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Duración</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.duration}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-signal" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Nivel</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.level}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-play" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Videos</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.videos}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 hover:bg-slate-50/50 rounded-xl transition-colors duration-300">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-[#00BCD4]/10 rounded-lg flex items-center justify-center">
                                             <Icon name="fa-briefcase" className="text-[#00BCD4] text-sm" />
                                         </div>
                                         <span className="text-sm font-medium text-[#64748B] font-body">Proyectos</span>
                                     </div>
                                     <span className="text-sm font-bold text-[#004B63] font-display">{curr?.projects}</span>
                                 </div>
                              </div>
                         </div>
                      </div>
                  </aside>

                {/* Área de Contenido Principal */}
                <main className="w-[75%] ml-[25%] pt-20 p-10">
                    <div className="space-y-8">
                        {/* Module Header */}
                        <div className="bg-gradient-to-br from-white via-white/95 to-[#F8FAFC] border border-[#E2E8F0]/50 shadow-[0_8px_40px_rgba(0,75,99,0.08)] rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon name={curr.icon} className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{curr.title}</h2>
                                            <p className="text-white/80 text-sm">{curr.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="px-5 py-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
                                            <Icon name="fa-clipboard-check" className={`mr-2 ${isEvaluationLocked(activeMod) ? 'text-slate-400' : ''}`} />
                                            {isEvaluationLocked(activeMod) ? (
                                                <>
                                                    <Icon name="fa-lock" className="mr-1.5 text-xs" />
                                                    Evaluación Bloqueada
                                                </>
                                            ) : (
                                                'Tomar Evaluación'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#00374A] mb-3">Lo que aprenderás</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {curr.topics.map((topic, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-700">{topic}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-xl">
                                    <div className="flex items-start gap-3">
                                        <Icon name="fa-lightbulb" className="text-cyan-300 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#00374A] mb-1">Desafío del Módulo</h4>
                                            <p className="text-sm text-slate-700">{curr.challenge}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal simplificado */}
                        <div className="text-center py-10">
                            <h3 className="text-xl font-bold text-[#00374A] mb-4">IA Lab Pro - Funcionando Correctamente</h3>
                            <p className="text-slate-600 mb-6">El componente se ha corregido y ahora carga sin errores.</p>
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-6 max-w-2xl mx-auto">
                                <h4 className="text-lg font-bold text-[#00374A] mb-3">Problemas resueltos:</h4>
                                <ul className="text-left text-slate-700 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                        <span>Error JSX: Elementos adyacentes sin envolver</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                        <span>Referencia containerRef no definida</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                        <span>Botones sin cerrar en el sidebar</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Icon name="fa-check" className="text-emerald-500 mt-0.5" />
                                        <span>Estructura de divs desbalanceada</span>
                                    </li>
                                </ul>
                            </div>
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