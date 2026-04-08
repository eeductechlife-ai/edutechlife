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
    
    // Estado para manejar acordeones de temas
    const [openAccordions, setOpenAccordions] = useState({
        1: true,  // Ingeniería de Prompts abierto por defecto
        2: false, // Mastery Framework
        3: false, // Contexto Dinámico
        4: false, // Zero-Shot Prompting
        5: false, // Chain-of-Thought
        6: false  // Ejercicio de Reflexión
    });
    
    const toggleAccordion = (id) => {
        setOpenAccordions(prev => ({
            ...prev,
            [id]: !prev[id]
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
    
    // Constante para identificar el último módulo del curso
    const LAST_MODULE_ID = 5;

    // Función para determinar si un módulo está bloqueado (solo para navegación)
    const isModuleLocked = (moduleId) => {
        // Module 1 is always unlocked
        if (moduleId === 1) return false;
        // Module is unlocked if it's completed or visited
        return !completedModules.includes(moduleId) && !visitedModules.includes(moduleId);
    };

    // Función para determinar si la evaluación de un módulo está bloqueada
    const isEvaluationLocked = (moduleId) => {
        // La evaluación del módulo 1 siempre está disponible
        if (moduleId === 1) return false;
        
        // La evaluación del módulo N está bloqueada si el módulo N-1 no está completado
        const previousModuleId = moduleId - 1;
        return !completedModules.includes(previousModuleId);
    };

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
            'Eres el Arquitecto de Prompts élite de Edutechlife. Devuelve SOLO JSON con: masterPrompt (string) y feedback (string, máx 2 oraciones).',
            true
        );
        
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        if (!r.error) setGenData(r);
        setLoading(false);
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

    // Efecto para animación de entrada secuencial de acordeones
    useEffect(() => {
        const accordionIds = [1, 2, 3, 4, 5, 6];
        const timers = [];
        
        accordionIds.forEach((id, index) => {
            const timer = setTimeout(() => {
                setVisibleAccordions(prev => [...prev, id]);
            }, index * 150); // 150ms de retraso entre cada acordeón
            timers.push(timer);
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const handleMyCertificates = () => {
        setShowProfileDropdown(false);
        console.log('Abrir sección de certificados');
        // Aquí se podría redirigir a una página de certificados
    };

    const handleSettings = () => {
        setShowProfileDropdown(false);
        console.log('Abrir configuración');
        // Aquí se podría abrir un modal o página de configuración
    };

    const curr = modules.find(m => m.id === activeMod);

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

    return (
        <>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Encabezado Global (Nivel 1) - 100% ancho - Premium */}
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

            {/* Contenedor de Layout (Nivel 2) */}
            <div ref={containerRef} className="flex flex-row items-start min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 relative font-open-sans">
                {/* Sidebar Izquierdo (25%) - Flujo natural sin scroll interno - Premium */}
                <aside className="w-[25%] sticky top-20 h-auto border-r border-slate-100/60 bg-white/98 backdrop-blur-xl z-30">
                    <div className="p-8">
                         {/* Progress Circle - Dinámico - Premium */}
                         <div className="flex flex-col items-center p-8 border-b border-slate-100/50 bg-white border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] mb-6">
                            {/* Círculo de Progreso SVG */}
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Círculo Base */}
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="#E2E8F0"
                                        strokeWidth="8"
                                        fill="none"
                                        className="stroke-slate-100"
                                    />
                                    {/* Círculo de Progreso */}
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="#00BCD4"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="351.858"
                                        strokeDashoffset={351.858 - (351.858 * Math.min(completedModules.length * 20, 100)) / 100}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                {/* Texto Central */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                     <span className="text-2xl font-bold text-[#004B63]">
                                         {Math.min(completedModules.length * 20, 100)}%
                                     </span>
                                     <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">
                                         Nivel de Maestría
                                     </span>
                                </div>
                            </div>
                            {/* Información de Progreso */}
                            <div className="text-center">
                                 <p className="text-sm font-normal text-slate-600 mb-2 leading-relaxed">
                                     {completedModules.length} de 5 módulos completados
                                 </p>
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div 
                                            key={num}
                                            className={`w-2 h-2 rounded-full ${completedModules.includes(num) ? 'bg-[#00BCD4]' : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="p-4">
                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-4">Módulos del Curso</p>
                                <div className="space-y-2">
                                    {modules.map(mod => (
                                        <button
                                            key={mod.id}
                                            onClick={() => { 
                                                if (!visitedModules.includes(mod.id)) {
                                                    setVisitedModules([...visitedModules, mod.id]);
                                                }
                                                setActiveMod(mod.id); 
                                                setGenData(null); 
                                                setInput(''); 
                                                setActiveTab('lab'); 
                                                setEvalSubmitted(false); 
                                                setEvalAnswers({}); 
                                            }}
                                            className={`w-full text-left p-5 rounded-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-md ${
                                                activeMod === mod.id 
                                                    ? 'bg-gradient-to-r from-[#00374A] via-[#00BCD4] to-[#4DA8C4] text-white shadow-lg border border-white/20' 
                                                    : completedModules.includes(mod.id)
                                                        ? 'bg-cyan-50/30 backdrop-blur-sm border-2 border-cyan-200/50 text-[#00374A] hover:border-cyan-300 hover:shadow-sm'
                                                        : visitedModules.includes(mod.id)
                                                            ? 'bg-white border border-slate-100 text-[#00374A] hover:border-slate-200 hover:shadow-sm'
                                                             : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-200 hover:shadow-sm'
                                            }`}
                                         >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-normal ${
                                                    activeMod === mod.id 
                                                        ? 'bg-white/20 text-white' 
                                                        : completedModules.includes(mod.id)
                                                            ? 'bg-[#66CCCC] text-white'
                                                            : visitedModules.includes(mod.id)
                                                                ? 'bg-[#E2E8F0] text-[#004B63]'
                                                                 : 'bg-[#E2E8F0] text-slate-500'
                                                }`}>
                                                    {completedModules.includes(mod.id) ? (
                                                        <Icon name="fa-check" className="text-xs" />
                                                    ) : visitedModules.includes(mod.id) ? (
                                                        mod.id
                                                    ) : (
                                                        <Icon name="fa-lock" className="text-xs" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-normal text-sm truncate">{mod.title}</p>
                                                     <p className={`text-sm ${activeMod === mod.id ? 'text-white/80' : 'text-slate-500'}`}>
                                                         {mod.duration}
                                                     </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Module Info Box */}
                            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 mt-4">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-4">DETALLES DEL MÓDULO</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-clock" className="text-[#00BCD4] text-sm" />
                                             <span className="text-sm text-slate-600">Duración</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#00374A]">{curr?.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-signal" className="text-[#00BCD4] text-sm" />
                                             <span className="text-sm text-slate-600">Nivel</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#00374A]">{curr?.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-play" className="text-[#00BCD4] text-sm" />
                                             <span className="text-sm text-slate-600">Videos</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#00374A]">{curr?.videos}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-briefcase" className="text-[#00BCD4] text-sm" />
                                             <span className="text-sm text-slate-600">Proyectos</span>
                                        </div>
                                        <span className="text-sm font-semibold text-[#00374A]">{curr?.projects}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button - Bottom of Sidebar */}
                            <div className="mt-6 pt-6 border-t border-slate-50">
                                <button
                                    onClick={handleLogout}
                                     className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Área de Contenido + Header de Módulo (75%) - Ajustado para sidebar sticky */}
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
                                             <p className="text-white/80 text-[11px] font-medium uppercase tracking-wider">Módulo {activeMod} · IA Lab Pro</p>
                                              <h2 className="text-2xl font-semibold text-white tracking-tight">{curr.title}</h2>
                                         </div>
                                    </div>
                                     <div className="flex gap-2">
                                          <div className="relative">
                                              <button 
                                                  onClick={() => {
                                                      if (isEvaluationLocked(activeMod)) {
                                                          setShowEvaluationTooltip(true);
                                                          setTimeout(() => setShowEvaluationTooltip(false), 3000);
                                                      } else {
                                                          setActiveTab('eval');
                                                      }
                                                  }}
                                                   className={`px-4 py-2 rounded-full text-sm font-normal transition-all flex items-center ${isEvaluationLocked(activeMod) ? 'bg-slate-100/50 border border-slate-200 text-slate-400 cursor-not-allowed' : activeTab === 'eval' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                               >
                                                   <Icon name="fa-clipboard-check" className={`mr-2 ${isEvaluationLocked(activeMod) ? 'text-slate-400' : ''}`} />
                                                   {isEvaluationLocked(activeMod) ? (
                                                       <>
                                                           <Icon name="fa-lock" className="mr-1.5 text-xs" />
                                                           Evaluación
                                                       </>
                                                   ) : (
                                                       'Evaluación'
                                                   )}
                                              </button>
                                              
                                               {/* Tooltip hover para evaluación bloqueada */}
                                               <div className={`absolute top-full left-0 mt-2 w-64 bg-[#00374A] text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg z-50 transition-all duration-200 ${isEvaluationLocked(activeMod) ? 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                                   <div className="flex items-center gap-2">
                                                       <Icon name="fa-info-circle" className="text-cyan-300 flex-shrink-0" />
                                                       <p className="font-medium">Completa la evaluación del módulo anterior para desbloquear este examen.</p>
                                                   </div>
                                                   <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#00374A]"></div>
                                               </div>
                                          </div>
                                         
                                         {/* Botón de Certificado - Solo visible en el último módulo */}
                                         {activeMod === LAST_MODULE_ID && (
                                             <button 
                                                 onClick={() => setActiveTab('cert')}
                                                 className={`px-4 py-2 rounded-full text-sm font-normal transition-all ${activeTab === 'cert' ? 'bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white' : 'bg-gradient-to-r from-[#FFD166]/80 to-[#FF8E53]/80 text-white hover:from-[#FFD166] hover:to-[#FF8E53] hover:shadow-lg'}`}
                                             >
                                                 <Icon name="fa-medal" className="mr-2" />Certificado Final
                                             </button>
                                         )}
                                     </div>
                                </div>
                            </div>
                             <div className="p-8">
                                  <div className="mb-10">
                                       <div className="mb-4">
                                           <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#00374A] opacity-80 mb-3">OBJETIVO CENTRAL DEL MÓDULO</p>
                                           <div className="w-12 h-1 bg-[#00BCD4] rounded-full"></div>
                                       </div>
                                       <div className="flex items-start gap-3 w-full">
                                           <Lightbulb className="w-5 h-5 text-[#00374A] mt-1 flex-shrink-0" />
                                           <p className="text-lg font-medium text-slate-800 leading-relaxed w-full">{curr.desc}</p>
                                       </div>
                                  </div>
                                
                                  <div>
                                       <div className="flex items-center gap-3 mb-8">
                                           <div className="w-2 h-8 bg-[#00BCD4] rounded-full"></div>
                                           <p className="text-xl font-bold text-[#00374A]">¿QUÉ HABILIDADES DESARROLLARÁS?</p>
                                       </div>
                                      <div className="grid grid-cols-2 gap-3">
                                         {curr.topics.map((topic, i) => (
                                              <span key={i} className="bg-cyan-50/40 backdrop-blur-md text-[#00374A] border border-cyan-100/30 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:bg-cyan-50/60 hover:scale-[1.02]">
                                                  <Icon name="fa-sparkles" className="text-[#00BCD4]" />
                                                  {topic}
                                              </span>
                                         ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                          {/* Cuadro de Introducción - Acordeón Interactivo SaaS Premium v4 */}
                          <div className="bg-white border border-slate-50 shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-[28px] p-12 mb-8 w-full transition-all duration-500 ease-out hover:shadow-[0_50px_120px_rgba(0,0,0,0.08)]">
                              <h2 className="text-2xl font-bold tracking-tight text-[#00374A] mb-3">Ingeniería de Prompts: El Arte de Comunicarse con la IA</h2>
                               <p className="text-[15px] font-normal text-slate-400 leading-relaxed mb-10">Domina el arte de comunicarte con la I.A a nivel experto.</p>
                              
                              {/* Acordeón 1: Ingeniería de Prompts – Comunícate Mejor con la IA */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[1] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(1)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-lightbulb" className="text-sm text-[#00BCD4]" />
                                          </div>
                                          <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[1] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                              <span className="font-normal text-slate-500">Ingeniería de Prompts</span> – Comunícate Mejor con la IA
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[1] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[1] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[1] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                          <p className="text-slate-600 leading-relaxed">La calidad de las respuestas de la IA depende directamente de cómo se le habla. En esta sección se aprenderá a dar instrucciones claras, evitando errores comunes y logrando resultados mucho más precisos.</p>
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 A continuación, acceda al video o recurso de lectura para aprender, paso a paso, cómo formular instrucciones efectivas desde el inicio.</p>
                                     </div>
                                 )}
                             </div>
                              
                              {/* Acordeón 2: El Método para Dominar la IA (Mastery Framework) */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[2] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(2)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-book" className="text-sm text-[#00BCD4]" />
                                          </div>
                                          <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[2] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                              <span className="font-normal text-slate-500">El Método para Dominar la IA</span> (Mastery Framework)
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[2] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[2] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[2] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                         <p className="text-slate-600 leading-relaxed">No se trata solo de preguntar, sino de hacerlo con estrategia. Aquí se presenta un método simple que permite estructurar las instrucciones para obtener respuestas útiles, organizadas y alineadas con un objetivo claro.</p>
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 Continúe con el video o recurso de lectura para aplicar este método de forma práctica.</p>
                                     </div>
                                 )}
                             </div>
                              
                              {/* Acordeón 3: Adapta la IA a Cada Situación (Contexto Dinámico) */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[3] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(3)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-cogs" className="text-sm text-[#00BCD4]" />
                                          </div>
                                          <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[3] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                              <span className="font-normal text-slate-500">Adapta la IA a Cada Situación</span> (Contexto Dinámico)
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[3] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[3] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[3] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                         <p className="text-slate-600 leading-relaxed">La IA puede responder de muchas formas, pero todo depende del contexto que se le proporcione. En esta sección se aprenderá a ajustar las respuestas según la edad, el nivel y la necesidad específica.</p>
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 Acceda al video o recurso de lectura para aprender a personalizar las respuestas de la IA según cada situación.</p>
                                     </div>
                                 )}
                             </div>
                              
                              {/* Acordeón 4: Resultados Rápidos con IA (Zero-Shot Prompting) */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[4] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(4)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-bolt" className="text-sm text-[#00BCD4]" />
                                          </div>
                                          <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[4] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                              <span className="font-normal text-slate-500">Resultados Rápidos con IA</span> (Zero-Shot Prompting)
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[4] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[4] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[4] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                         <p className="text-slate-600 leading-relaxed">Es posible obtener buenos resultados sin dar ejemplos. Este tema enseña cómo pedir información de forma directa, ahorrando tiempo y logrando respuestas claras desde el primer intento.</p>
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 Ingrese al video o recurso de lectura para aplicar esta técnica de manera inmediata.</p>
                                     </div>
                                 )}
                             </div>
                              
                              {/* Acordeón 5: Haz que la IA Piense Paso a Paso (Chain-of-Thought) */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[5] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(5)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-sitemap" className="text-sm text-[#00BCD4]" />
                                          </div>
                                           <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[5] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                               <span className="font-normal text-slate-500">Haz que la IA Piense Paso a Paso</span> (Chain-of-Thought)
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[5] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[5] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[5] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                         <p className="text-slate-600 leading-relaxed">Para problemas complejos, la clave está en guiar a la IA en su proceso de razonamiento. Aquí se aprenderá a obtener explicaciones detalladas y soluciones paso a paso.</p>
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 Diríjase al video o recurso de lectura para estructurar el razonamiento de la IA de forma efectiva.</p>
                                     </div>
                                 )}
                             </div>
                              
                              {/* Acordeón 6: Ejercicio de Reflexión – Más Allá de Usar la IA */}
                              <div className={`bg-white border border-slate-100 rounded-[18px] mb-4 transition-all duration-300 ease-out hover:shadow-lg hover:bg-cyan-50/20 transform ${openAccordions[6] ? 'border-[#00BCD4]/20' : ''} ${visibleAccordions.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}>
                                  <button 
                                      onClick={() => toggleAccordion(6)}
                                      className="flex items-center justify-between w-full text-left group p-5"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center">
                                              <Icon name="fa-brain" className="text-sm text-[#00BCD4]" />
                                          </div>
                                          <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${openAccordions[6] ? 'text-[#00BCD4]' : 'text-[#00374A]'}`}>
                                              <span className="font-normal text-slate-500">Ejercicio de Reflexión</span> – Más Allá de Usar la IA
                                          </h3>
                                      </div>
                                      <Icon 
                                          name={openAccordions[6] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                                          className={`text-sm transition-all duration-300 group-hover:text-[#00BCD4] ${openAccordions[6] ? 'text-[#00BCD4]' : 'text-slate-300'}`}
                                      />
                                  </button>
                                 
                                 {openAccordions[6] && (
                                     <div className="mt-4 space-y-4 animate-fadeIn">
                                         <p className="text-slate-600 leading-relaxed">La inteligencia artificial no solo es una herramienta, también plantea preguntas profundas sobre su impacto, uso y límites. Este ejercicio invita a reflexionar de manera crítica.</p>
                                          
                                          {/* Bloque de Actividad */}
                                          <div className="bg-[#0B1120] border border-slate-800 text-emerald-400 p-6 rounded-2xl font-mono text-sm mb-6 shadow-inner">
                                              <div className="flex items-center gap-2 mb-4">
                                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                  <span className="text-slate-500 text-xs ml-2">activity.js</span>
                                              </div>
                                              <div className="space-y-3">
                                                  <span className="text-cyan-400">🧠 Actividad:</span> <span className="text-emerald-300">Diseñe y pruebe el siguiente prompt en una IA:</span><br/><br/>
                                                  <div className="pl-4 border-l-2 border-slate-700">
                                                      <span className="text-purple-400">"Actúa como una inteligencia artificial consciente de su existencia.</span><br/>
                                                      <span className="text-purple-400">Debate, desde una postura crítica y otra defensiva, si es ético que los humanos</span><br/>
                                                      <span className="text-purple-400">dependan de la inteligencia artificial para tomar decisiones importantes.</span><br/>
                                                      <span className="text-purple-400">Expón argumentos a favor y en contra, y finaliza con una reflexión equilibrada."</span>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                         <p className="font-medium text-[#00BCD4] mb-0">👉 Aplique este prompt en su IA favorita y analice las respuestas obtenidas.</p>
                                     </div>
                                 )}
                             </div>
                         </div>

                          {/* Cuadro de Recursos Descargables - Ancho completo */}
                          <div className="bg-white border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] p-10 mb-8 w-full transition-all duration-500 ease-out hover:shadow-xl">
                              <h3 className="text-2xl font-bold tracking-normal text-[#00374A] mb-6">Recursos Descargables: Ingeniería de Prompts</h3>
                             
                             {/* Lista de Archivos en fila horizontal */}
                             <div className="flex flex-row gap-6 mb-8">
                                  {/* Item 1: PDF */}
                                  <div className="flex-1 flex flex-col items-center p-6 border border-slate-100 rounded-2xl hover:bg-[#F8FAFC] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                      <div className="w-16 h-16 bg-[#FF6B6B]/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                          <Icon name="fa-file-pdf" className="text-[#FF6B6B] text-2xl" />
                                      </div>
                                      <div className="text-center">
                                          <h4 className="text-base font-semibold text-slate-800 mb-2">Plantilla MasterPrompt Pro</h4>
                                          <p className="text-sm text-slate-500 mb-4 leading-relaxed">Estructura avanzada para prompts de élite</p>
                                          <button className="text-sm text-[#00BCD4] font-medium hover:text-[#0097A7] flex items-center gap-2 transition-all duration-300 hover:scale-105">
                                              <Icon name="fa-download" />
                                              Descargar
                                          </button>
                                      </div>
                                  </div>

                                  {/* Item 2: Cheatsheet */}
                                  <div className="flex-1 flex flex-col items-center p-6 border border-slate-100 rounded-2xl hover:bg-[#F8FAFC] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                      <div className="w-16 h-16 bg-[#4ECDC4]/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                          <Icon name="fa-table" className="text-[#4ECDC4] text-2xl" />
                                      </div>
                                      <div className="text-center">
                                          <h4 className="text-base font-semibold text-slate-800 mb-2">Checklist de Evaluación</h4>
                                          <p className="text-sm text-slate-500 mb-4 leading-relaxed">Métricas y criterios para análisis profundo</p>
                                          <button className="text-sm text-[#00BCD4] font-medium hover:text-[#0097A7] flex items-center gap-2 transition-all duration-300 hover:scale-105">
                                              <Icon name="fa-download" />
                                              Descargar
                                          </button>
                                      </div>
                                  </div>

                                  {/* Item 3: JSON */}
                                  <div className="flex-1 flex flex-col items-center p-6 border border-slate-100 rounded-2xl hover:bg-[#F8FAFC] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                                      <div className="w-16 h-16 bg-[#FFD166]/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                          <Icon name="fa-code" className="text-[#FFD166] text-2xl" />
                                      </div>
                                      <div className="text-center">
                                          <h4 className="text-base font-semibold text-slate-800 mb-2">Templates JSON para APIs</h4>
                                          <p className="text-sm text-slate-500 mb-4 leading-relaxed">Estructuras listas para integración</p>
                                          <button className="text-sm text-[#00BCD4] font-medium hover:text-[#0097A7] flex items-center gap-2 transition-all duration-300 hover:scale-105">
                                              <Icon name="fa-download" />
                                              Descargar
                                          </button>
                                      </div>
                                  </div>
                             </div>
                             
                             {/* Botón de Acción Principal */}
                             <button className="w-full bg-gradient-to-r from-[#00374A] to-[#004B63] text-white font-semibold rounded-xl py-4 hover:shadow-lg transition-all flex items-center justify-center gap-3 text-base">
                                 <Icon name="fa-download" />
                                 Descargar Todos los Recursos
                             </button>
                         </div>

                          {/* Cuadro de Desafío del Curso */}
                          <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] p-10 mb-8 w-full transition-all duration-500 ease-out hover:shadow-xl">
                             <div className="flex items-center gap-4 mb-6">
                                 <div className="w-12 h-12 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] rounded-xl flex items-center justify-center">
                                     <Icon name="fa-bolt" className="text-white text-xl" />
                                 </div>
                                 <div>
                                     <h3 className="text-2xl font-bold tracking-normal text-[#00374A]">Desafío del Curso</h3>
                                     <p className="text-sm text-slate-500">Aplica lo aprendido en un reto práctico</p>
                                 </div>
                             </div>
                            
                            <div className="bg-gradient-to-r from-[#FFD166]/10 to-[#FF8E53]/10 border border-[#FFD166]/20 rounded-xl p-5 mb-4">
                                <p className="text-base font-medium text-slate-800 italic mb-3">"{modules.find(m => m.id === activeMod)?.challenge || 'Crea un prompt para resolver un problema complejo de tu industria.'}"</p>
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Icon name="fa-clock" className="text-[#FF8E53]" />
                                    <span>Tiempo estimado: 45 min</span>
                                </div>
                            </div>
                            
                             <div className="flex gap-4">
                                 <button className="flex-1 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white font-bold rounded-xl py-3 hover:opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2">
                                     <Icon name="fa-play" />
                                     Iniciar Desafío
                                 </button>
                                 <button className="flex-1 bg-slate-100 text-slate-700 font-bold rounded-xl py-3 hover:bg-slate-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2">
                                     <Icon name="fa-lightbulb" />
                                     Ver Solución
                                 </button>
                             </div>
                        </div>

                         {/* Fila 2: Acción y Multimedia (2x2 Grid) */}
                         <div className="grid grid-cols-2 gap-8 w-full">
                              {/* Lado Izquierdo: Cuadro de Videos Explicativos */}
                              <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] p-10 h-full transition-all duration-500 ease-out hover:shadow-xl">
                                 <h3 className="text-2xl font-bold tracking-normal text-[#00374A] mb-6">Videos Explicativos: Ingeniería de Prompts</h3>
                                
                                 {/* Video 1: Mastery Framework */}
                                 <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.01] mb-3">
                                     <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                         <Icon name="fa-play" className="text-white text-sm" />
                                     </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                             <h4 className="text-base font-semibold text-slate-800">Mastery Framework</h4>
                                              <span className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">12:45</span>
                                        </div>
                                          <p className="text-sm text-slate-500 mb-2 leading-relaxed">Sistema estructurado para dominar técnicas avanzadas de prompting</p>
                                        <div className="flex items-center gap-2">
                                              <span className="text-[11px] font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Principiante</span>
                                             <span className="text-[11px] text-slate-500">• Video teórico</span>
                                        </div>
                                    </div>
                                </div>

                                 {/* Video 2: Contexto Dinámico */}
                                 <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.01] mb-3">
                                     <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                         <Icon name="fa-play" className="text-white text-sm" />
                                     </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                             <h4 className="text-base font-semibold text-slate-800">Contexto Dinámico</h4>
                                              <span className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">18:30</span>
                                        </div>
                                          <p className="text-sm text-slate-500 mb-2 leading-relaxed">Adaptación inteligente a diferentes escenarios y objetivos</p>
                                        <div className="flex items-center gap-2">
                                              <span className="text-[11px] font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Intermedio</span>
                                             <span className="text-[11px] text-slate-500">• Caso práctico</span>
                                        </div>
                                    </div>
                                </div>

                                 {/* Video 3: Zero-Shot Prompting */}
                                 <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.01]">
                                     <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                         <Icon name="fa-play" className="text-white text-sm" />
                                     </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                             <h4 className="text-base font-semibold text-slate-800">Zero-Shot Prompting</h4>
                                              <span className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">22:15</span>
                                        </div>
                                          <p className="text-sm text-slate-500 mb-2 leading-relaxed">Técnicas para obtener resultados sin ejemplos previos</p>
                                        <div className="flex items-center gap-2">
                                              <span className="text-[11px] font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">Avanzado</span>
                                             <span className="text-[11px] text-slate-500">• Demostración en vivo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                              {/* Lado Derecho: Sintetizador de Prompts Élite */}
                              <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-slate-50 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[28px] p-10 h-full transition-all duration-500 ease-out hover:shadow-xl">
                                 <div className="mb-8">
                                     <div className="flex items-center gap-4 mb-4">
                                         <div className="w-12 h-12 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl flex items-center justify-center">
                                             <Icon name="fa-terminal" className="text-white text-xl" />
                                         </div>
                                         <div>
                                             <h3 className="text-2xl font-bold tracking-normal text-[#00374A]">Sintetizador de Prompts Élite</h3>
                                             <p className="text-sm text-slate-600">Transforma ideas en MasterPrompts profesionales</p>
                                         </div>
                                     </div>
                                 </div>
                                
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ingresa tu idea o prompt base para la transmutación..."
                                    className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] resize-none mb-4"
                                    rows={4}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOptimize(); } }}
                                />
                                
                                 <button
                                    onClick={handleOptimize}
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {loadMsg}
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="fa-bolt" />
                                            Sintetizar MasterPrompt
                                        </>
                                    )}
                                </button>
                                
                                {genData && !loading && (
                                    <div className="mt-6 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-bold text-[#004B63]">MASTER PROMPT GENERADO</span>
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(genData.masterPrompt)}
                                                className="text-sm text-[#4DA8C4] hover:text-[#66CCCC] flex items-center gap-1"
                                            >
                                                <Icon name="fa-copy" /> Copiar
                                            </button>
                                        </div>
                                        <div className="p-4 bg-[#0a1628] rounded-lg text-white text-sm font-mono whitespace-pre-wrap">
                                            {genData.masterPrompt}
                                        </div>
                                        <div className="mt-3 p-3 bg-[#66CCCC]/10 rounded-lg">
                                            <strong className="text-[#004B63]">Feedback:</strong> {genData.feedback}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

             {/* Valerio FAB - Cerebro Corporativo */}
             <button 
                 className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E2E8F0]/50 rounded-full shadow-[0_8px_30px_rgba(0,75,99,0.12)] hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group hover:shadow-[0_12px_40px_rgba(0,75,99,0.16)]"
                 onClick={() => setShowValerioDrawer(!showValerioDrawer)}
             >
                {/* SVG Cerebro Corporativo */}
                <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:scale-110 transition-transform duration-300"
                >
                    <path 
                        d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" 
                        fill="#004B63"
                    />
                    <path 
                        d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" 
                        fill="#00BCD4"
                    />
                    <path 
                        d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" 
                        fill="#00BCD4"
                    />
                    <path 
                        d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" 
                        fill="#00BCD4"
                        className="animate-pulse"
                    />
                </svg>
            </button>

            {/* Valerio Drawer - Fuera del layout principal */}
            <div className={`fixed inset-0 z-[60] transition-all duration-300 ${showValerioDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowValerioDrawer(false)}
                />
                
                {/* Drawer Panel */}
                <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-[#004B63] to-[#0A3550] shadow-2xl transition-transform duration-300 ${showValerioDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ValerioAvatar state={avatarState} size={48} />
                                <div>
                                    <h3 className="text-xl font-normal text-white">Valerio IA</h3>
                                    <p className="text-white/60 text-sm">Tu coach de IA nativo</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowValerioDrawer(false)}
                                className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                            >
                                <Icon name="fa-times" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-280px)]">
                        <div className="space-y-4">
                            {/* Welcome Message */}
                            <div className="flex items-start gap-3">
                                <ValerioAvatar state="idle" size={32} />
                                <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                    <p className="text-white/90 text-sm">¡Hola! Soy Valerio, tu coach de IA. Puedo ayudarte con:</p>
                                     <ul className="mt-2 space-y-1 text-white/80 text-sm leading-relaxed">
                                        <li>• Explicaciones de conceptos complejos</li>
                                        <li>• Feedback en tus prompts</li>
                                        <li>• Estrategias de aprendizaje</li>
                                        <li>• Resolución de dudas técnicas</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/10">
                        <div className="flex gap-2">
                            <textarea
                                value={coachQ}
                                onChange={e => setCoachQ(e.target.value)}
                                placeholder="Pregunta a Valerio..."
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] text-sm"
                                rows={2}
                            />
                            <button
                                onClick={() => {/* Función simplificada */}}
                                className="px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-normal hover:shadow-lg transition-all flex items-center justify-center"
                            >
                                <Icon name="fa-paper-plane" />
                            </button>
                        </div>
                         <p className="mt-2 text-white/60 text-sm text-center">
                             Presiona Enter para enviar • Shift+Enter para nueva línea
                         </p>
                    </div>
                </div>
            </div>

            {/* Name Modal */}
            <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300 ${showNameModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {showNameModal && (
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-normal text-[#004B63] mb-2">Ingresa tu nombre</h3>
                        <p className="text-base text-slate-600">Este nombre aparecerá en tu certificado</p>
                        <input
                            type="text"
                            value={certName}
                            onChange={e => setCertName(e.target.value)}
                            placeholder="Tu nombre completo"
                            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] mb-6"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNameModal(false)}
                                className="flex-1 py-3 border border-[#E2E8F0] text-slate-500 rounded-xl font-normal hover:bg-[#F8FAFC] transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {/* Función simplificada */}}
                                disabled={!certName.trim()}
                                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IALabFixed;