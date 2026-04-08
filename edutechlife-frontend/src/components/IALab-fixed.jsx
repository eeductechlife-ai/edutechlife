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
    
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const loadingIntervalRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const chartRef = useRef(null);
    const isChartInView = useInView(chartRef);

    const msgs = ['Analizando contexto...', 'Aplicando técnicas élite...', 'Optimizando estructura...', 'Generando masterPrompt...'];

    const modules = [
        { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#4DA8C4', topics: ['Mastery Framework', 'Contexto Dinámico', 'Zero-Shot Prompting', 'Chain-of-Thought'], challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.', desc: 'Domina el arte de comunicarte con la IA a nivel experto.', duration: '4h 30min', level: 'Avanzado', videos: 12, projects: 3 },
        { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#66CCCC', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.', duration: '5h 00min', level: 'Avanzado', videos: 15, projects: 4 },
        { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#B2D8E5', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.', duration: '3h 45min', level: 'Intermedio', videos: 10, projects: 2 },
        { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#004B63', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.', duration: '4h 00min', level: 'Intermedio', videos: 8, projects: 3 },
        { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FFD166', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.', duration: '6h 00min', level: 'Experto', videos: 6, projects: 5 },
    ];

    // Función simplificada para el ejemplo
    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const curr = modules.find(m => m.id === activeMod);

    return (
        <>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Encabezado Global (Nivel 1) - 100% ancho */}
            <header className="w-full fixed top-0 left-0 z-[60] h-20 bg-white border-b-2 border-slate-900 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-lg flex items-center justify-center">
                            <Icon name="fa-flask-vial" className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-montserrat font-normal text-lg text-[#004B63]">IA Lab Pro</h1>
                            <p className="text-xs text-[#64748B]">Hyper-Intelligence Certification</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-[#66CCCC]/20 border border-[#66CCCC]/40 rounded-full">
                        <span className="text-sm font-normal text-[#004B63]">{completedModules.length}/5 Módulos</span>
                    </div>
                </div>
            </header>

            {/* Contenedor de Layout (Nivel 2) */}
            <div ref={containerRef} className="flex flex-row pt-20 min-h-screen bg-[#F8FAFC] relative overflow-hidden font-open-sans">
                {/* Sidebar Izquierdo (25%) */}
                <aside className="w-[25%] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto border-r-2 border-slate-900/10 bg-white z-40">
                    <div className="p-6">
                        {/* Progress Circle - Dinámico */}
                        <div className="flex flex-col items-center p-6 border-b border-[#E2E8F0] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white rounded-[2rem] mb-4">
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
                                    <span className="text-2xl font-black text-[#004B63]">
                                        {Math.min(completedModules.length * 20, 100)}%
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                        Nivel de Maestría
                                    </span>
                                </div>
                            </div>
                            {/* Información de Progreso */}
                            <div className="text-center">
                                <p className="text-xs font-normal text-[#64748B] mb-1">
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
                                <p className="text-xs font-normal text-[#64748B] uppercase tracking-wide mb-4">Módulos del Curso</p>
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
                                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                                                activeMod === mod.id 
                                                    ? 'bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white shadow-lg' 
                                                    : completedModules.includes(mod.id)
                                                        ? 'bg-[#66CCCC]/10 border-2 border-[#66CCCC]/30 text-[#004B63] hover:border-[#4DA8C4]'
                                                        : visitedModules.includes(mod.id)
                                                            ? 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#004B63] hover:border-[#4DA8C4]'
                                                            : 'bg-[#F8FAFC]/50 border border-[#E2E8F0]/50 text-[#64748B]/50 hover:border-[#4DA8C4]/50'
                                            }`}
                                            disabled={!visitedModules.includes(mod.id) && !completedModules.includes(mod.id) && mod.id > 1}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-normal ${
                                                    activeMod === mod.id 
                                                        ? 'bg-white/20 text-white' 
                                                        : completedModules.includes(mod.id)
                                                            ? 'bg-[#66CCCC] text-white'
                                                            : visitedModules.includes(mod.id)
                                                                ? 'bg-[#E2E8F0] text-[#004B63]'
                                                                : 'bg-[#E2E8F0]/50 text-[#64748B]/50'
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
                                                    <p className={`text-xs ${activeMod === mod.id ? 'text-white/70' : 'text-[#64748B]'}`}>
                                                        {mod.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Module Info Box */}
                            <div className="p-4 border-t border-[#E2E8F0]">
                                <p className="text-xs font-normal text-[#64748B] uppercase tracking-wide mb-3">Detalles del Módulo</p>
                                <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-3 h-fit max-h-[300px] overflow-y-auto">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-clock" className="text-[#4DA8C4] text-sm" />
                                            <span className="text-sm text-[#64748B]">Duración</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#004B63]">{curr?.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-signal" className="text-[#66CCCC] text-sm" />
                                            <span className="text-sm text-[#64748B]">Nivel</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#004B63]">{curr?.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-play" className="text-[#FFD166] text-sm" />
                                            <span className="text-sm text-[#64748B]">Videos</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#004B63]">{curr?.videos}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon name="fa-briefcase" className="text-[#FF8E53] text-sm" />
                                            <span className="text-sm text-[#64748B]">Proyectos</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#004B63]">{curr?.projects}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Button - Bottom of Sidebar */}
                            <div className="mt-auto pt-6 pb-4 border-t border-slate-100">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-6 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                                >
                                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm tracking-tight">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Área de Contenido + Header de Módulo (75%) */}
                <main className="w-[75%] p-6">
                    <div className="space-y-6">
                        {/* Module Header */}
                        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
                            <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon name={curr.icon} className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-xs uppercase tracking-wider">Módulo {activeMod} · IA Lab Pro</p>
                                            <h2 className="text-2xl font-normal text-white font-montserrat">{curr.title}</h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setActiveTab('eval')}
                                            className={`px-4 py-2 rounded-full text-sm font-normal transition-all ${activeTab === 'eval' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-clipboard-check" className="mr-2" />Evaluación
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('cert')}
                                            className={`px-4 py-2 rounded-full text-sm font-normal transition-all ${activeTab === 'cert' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-medal" className="mr-2" />Certificado
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-base text-slate-600">{curr.desc}</p>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {curr.topics.map((topic, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#4DA8C4]/10 text-[#004B63] text-sm rounded-full font-normal">
                                            <Icon name="fa-sparkles" className="mr-1 text-[#4DA8C4]" />
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contenido simplificado para prueba */}
                        <div className="bg-white p-6 rounded-2xl">
                            <h3 className="text-lg font-normal text-[#004B63]">Contenido del Módulo</h3>
                            <p className="text-slate-600">Contenido de ejemplo para prueba de estructura JSX.</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Valerio FAB - Cerebro Corporativo */}
            <button 
                className="fixed bottom-8 right-8 w-16 h-16 bg-white border-2 border-[#004B63] rounded-full shadow-2xl drop-shadow-xl hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group"
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
                                    <ul className="mt-2 space-y-1 text-white/70 text-xs">
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
                        <p className="mt-2 text-white/40 text-xs text-center">
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
                                className="flex-1 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-normal hover:bg-[#F8FAFC] transition-all"
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