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

const IALab = ({ onBack }) => {
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

    const evalQuestions = [
        { q: '¿Qué técnica de prompting guía al modelo paso a paso?', opts: ['Zero-Shot', 'Chain-of-Thought', 'Few-Shot', 'Role Play'], ans: 1 },
        { q: '¿Qué herramienta transforma documentos en podcasts de IA?', opts: ['ChatGPT', 'Midjourney', 'NotebookLM', 'Copilot'], ans: 2 },
        { q: '¿Qué modelo de IA genera texto e imágenes de forma multimodal?', opts: ['GPT-4o', 'Whisper', 'DALL-E 2', 'Stable Diffusion'], ans: 0 },
        { q: '¿Cuál es el objetivo principal de la Ingeniería de Prompts?', opts: ['Programar en Python', 'Diseñar interfaces gráficas', 'Comunicarse efectivamente con IA', 'Entrenar modelos desde cero'], ans: 2 },
        { q: '¿Qué metodología permite solicitar a una IA que muestre su razonamiento?', opts: ['Zero-Shot', 'Chain-of-Thought', 'Few-Shot', 'Prompt Chaining'], ans: 1 },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'es-CO';
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setCoachQ(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setAvatarState('thinking');
            };
        }
    }, []);

    useEffect(() => {
        return () => {
            if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        };
    }, []);

    // Cargar progreso desde Supabase al iniciar
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const progressData = await getAllProgress();
                
                const completed = progressData
                    .filter(p => p.status === PROGRESS_STATUS.COMPLETED)
                    .map(p => p.module_id);
                setCompletedModules(completed);

                const visited = progressData.map(p => p.module_id);
                if (visited.length > 0) {
                    setVisitedModules(visited);
                }

                const mainModulesCompleted = completed.filter(id => id <= 4).length;
                setCourseProgress(Math.min(Math.round((mainModulesCompleted / 4) * 100), 100));

                const lastProgress = await getUserLastProgress();
                if (lastProgress && lastProgress.last_lesson_id) {
                    setActiveMod(lastProgress.module_id);
                }
            } catch (error) {
                console.error('Error cargando progreso:', error);
            } finally {
                setIsLoadingProgress(false);
            }
        };

        if (!authLoading) {
            loadProgress();
        }
    }, [authLoading]);

    const handleModuleClick = async (moduleId) => {
        if (!visitedModules.includes(moduleId)) {
            setVisitedModules([...visitedModules, moduleId]);
        }
        setActiveMod(moduleId);
        setActiveTab('lab');
        
        try {
            await saveLastLesson(moduleId, `module_${moduleId}_start`);
        } catch (error) {
            console.error('Error guardando última lección:', error);
        }
    };

    const isModuleLocked = (moduleId) => {
        // Module 1 is always unlocked
        if (moduleId === 1) return false;
        // Module is unlocked if it's completed or visited
        return !completedModules.includes(moduleId) && !visitedModules.includes(moduleId);
    };

    const handleLogout = async () => {
        try {
            await saveLastLesson(activeMod, `module_${activeMod}_last`);
            
            for (const moduleId of visitedModules) {
                if (!completedModules.includes(moduleId)) {
                    await saveProgress(moduleId, PROGRESS_STATUS.IN_PROGRESS, {
                        lastActivityAt: new Date().toISOString()
                    });
                }
            }
            
            await signOut();
            
            if (onBack) {
                onBack();
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            await signOut();
            if (onBack) {
                onBack();
            }
        }
    };

    const askCoach = async () => {
        const q = coachQ.trim();
        if (!q) return;
        setCoachLoad(true);
        setAvatarState('thinking');
        const r = await callDeepseek(`Estudiante: ${q}`, PROMPT_VALERIO_DOCENTE, false);
        setCoachMsg(r);
        setCoachLoad(false);
        setCoachQ('');
        setAvatarState('speaking');
        speakTextConversational(r, 'valerio', () => setAvatarState('idle'));
    };

    const toggleSpeech = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setCoachQ('');
            setIsListening(true);
            setAvatarState('listening');
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("No pudo iniciar speech", e);
            }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const content = evt.target.result;
            setCoachLoad(true);
            setAvatarState('thinking');
            setCoachMsg('Leyendo el documento...');
            const r = await callDeepseek(
                `Documento:\n${content}\n\nPregúntale de forma empática qué desea hacer con la información.`,
                PROMPT_VALERIO_DOCENTE,
                false
            );
            setCoachMsg(r);
            setCoachLoad(false);
            setAvatarState('speaking');
            speakTextConversational(r, 'valerio', () => setAvatarState('idle'));
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
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

    const handleEvalSubmit = () => {
        let score = 0;
        evalQuestions.forEach((q, i) => {
            if (evalAnswers[i] === q.ans) score++;
        });
        setEvalScore(score);
        setEvalSubmitted(true);
        
        if (score >= 3) {
            if (!completedModules.includes(activeMod)) {
                const newCompleted = [...completedModules, activeMod];
                setCompletedModules(newCompleted);
                setCourseProgress(Math.min(Math.round((newCompleted.length / 5) * 100), 100));
            }
            setActiveTab('cert');
        }
    };

    const downloadCert = () => {
        const studentName = certName.trim() || 'Estudiante';
        const curr = modules.find(m => m.id === activeMod);
        
        const container = document.createElement('div');
        container.style.cssText = 'width: 1200px; min-height: 840px; background: linear-gradient(135deg, #004B63 0%, #0A3550 100%); padding: 60px; font-family: Montserrat, Arial, sans-serif; color: white;';
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <img src="/images/logo-edutechlife.webp" style="height: 60px; margin-bottom: 20px;" onerror="this.style.display='none'" />
                <div style="font-size: 24px; font-weight: 800; letter-spacing: 0.3em; color: #4DA8C4; margin-bottom: 10px;">E D U T E C H L I F E</div>
                <div style="width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #4DA8C4, transparent); margin: 0 auto;"></div>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 42px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Certificado de Excelencia</div>
                <div style="font-size: 18px; opacity: 0.8;">Este certificado acredita que</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 56px; font-weight: 900; color: #66CCCC; margin-bottom: 5px;">${studentName}</div>
                <div style="width: 300px; height: 2px; background: linear-gradient(90deg, transparent, #66CCCC, transparent); margin: 0 auto;"></div>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 18px; opacity: 0.8; margin-bottom: 15px;">ha completado satisfactoriamente el programa</div>
                <div style="font-size: 28px; font-weight: 700; color: #4DA8C4;">Módulo ${activeMod}: ${curr?.title}</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="display: inline-block; padding: 10px 30px; background: rgba(77, 168, 196, 0.2); border: 2px solid #4DA8C4; border-radius: 30px; font-size: 18px; font-weight: 700;">
                    Evaluación: ${evalScore}/5 — ${evalScore >= 4 ? 'SOBRESALIENTE' : evalScore >= 3 ? 'APROBADO' : 'EN PROGRESO'}
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 14px; opacity: 0.6;">Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 100px; margin-top: 40px;">
                <div style="text-align: center;">
                    <div style="width: 100px; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 10px;"></div>
                    <div style="font-size: 12px; opacity: 0.6;">Director Académico</div>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 10px;"></div>
                    <div style="font-size: 12px; opacity: 0.6;">Coordinador del Programa</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; opacity: 0.4;">EDUTECHLIFE v2.286 — Hyper-Intelligence Lab | www.edutechlife.com</div>
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `Certificado_Edutechlife_Modulo${activeMod}_${studentName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(container).save();
    };

    const handleDownloadCert = () => {
        if (!certName.trim()) {
            setShowNameModal(true);
        } else {
            downloadCert();
        }
    };

    const confirmNameAndDownload = () => {
        if (certName.trim()) {
            setShowNameModal(false);
            downloadCert();
        }
    };

    const curr = modules.find(m => m.id === activeMod);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-open-sans">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header - Neo-brutalista alineado */}
            <header className="fixed top-0 right-0 w-[73%] h-20 bg-white border-b-2 border-slate-900 z-40 px-10 flex items-center justify-between">
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
                    <span className="px-3 py-1 bg-[#FFD166]/20 border border-[#FFD166]/40 rounded-full text-xs text-[#004B63] font-mono font-normal">
                        PREMIUM
                    </span>
                </div>
            </header>

            {/* Layout Container - Sidebar + Main Content */}
            <div className="flex flex-row relative">
                {/* Sidebar - Module List - Fixed 27% */}
                <aside className="fixed left-0 top-0 w-[27%] h-full bg-white border-r-2 border-slate-900 z-30">
                    <div className="glass-card rounded-[2rem] overflow-hidden h-[calc(100vh-6rem)] mt-20 ml-6 mr-6">
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
                                                // Allow viewing any module, but track as visited
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

                {/* Main Content */}
                <div className="ml-[27%] pt-20 px-10">
                    <div className="w-full lg:w-[73%] space-y-6">
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
                                            onClick={() => setActiveTab('lab')}
                                            className={`px-4 py-2 rounded-full text-sm font-normal transition-all ${activeTab === 'lab' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-terminal" className="mr-2" />Lab
                                        </button>
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

                        {/* Cuadro Teórico Principal - Introducción */}
                         <div className="w-full ml-20 mb-8 border-2 border-slate-900 bg-white rounded-[2rem] p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-300">
                            <h2 className="text-xl font-bold text-[#004B63] mb-2">Ingeniería de Prompts: El Arte de Comunicarse con la IA</h2>
                            <p className="text-slate-600 mb-6">Domina el arte de comunicarte con la IA a nivel experto.</p>
                            
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00BCD4] mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <span className="font-bold text-[#004B63]">Mastery Framework:</span>
                                        <span className="text-slate-600"> Sistema estructurado para dominar técnicas avanzadas</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00BCD4] mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <span className="font-bold text-[#004B63]">Contexto Dinámico:</span>
                                        <span className="text-slate-600"> Adaptación inteligente a diferentes escenarios y objetivos</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00BCD4] mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <span className="font-bold text-[#004B63]">Zero-Shot Prompting:</span>
                                        <span className="text-slate-600"> Técnicas para obtener resultados sin ejemplos previos</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00BCD4] mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                        <span className="font-bold text-[#004B63]">Chain-of-Thought:</span>
                                        <span className="text-slate-600"> Guiar a la IA paso a paso para razonamiento complejo</span>
                                    </div>
                                </li>
                            </ul>

                            {/* Ejercicio de Reflexión */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-6">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="text-[#00BCD4] flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-slate-800 mb-1">Ejercicio de Reflexión:</p>
                                        <p className="text-slate-600">Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cuadro de Videos - Simetría 50% */}
                         <div className="flex flex-row gap-8 items-stretch w-full ml-20 mb-8">
                            {/* Columna Izquierda - Videos (50%) */}
                            <div className="w-1/2 border-2 border-slate-900 bg-white rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-[#004B63]">Videos Explicativos: Ingeniería de Prompts</h3>
                                
                                {/* Video 1: Mastery Framework */}
                                <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="fa-play" className="text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-800">Mastery Framework</h4>
                                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">12:45</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">Sistema estructurado para dominar técnicas avanzadas de prompting</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Principiante</span>
                                            <span className="text-xs text-slate-500">• Video teórico</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Video 2: Contexto Dinámico */}
                                <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="fa-play" className="text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-800">Contexto Dinámico</h4>
                                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">18:30</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">Adaptación inteligente a diferentes escenarios y objetivos</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Intermedio</span>
                                            <span className="text-xs text-slate-500">• Caso práctico</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Video 3: Zero-Shot Prompting */}
                                <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="fa-play" className="text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-800">Zero-Shot Prompting</h4>
                                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">22:15</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">Técnicas para obtener resultados sin ejemplos previos</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">Avanzado</span>
                                            <span className="text-xs text-slate-500">• Demostración en vivo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Columna Derecha - Recursos Descargables (50%) */}
                            <div className="w-1/2 border-2 border-slate-900 bg-white rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                <h3 className="text-lg font-bold text-[#004B63]">Recursos Descargables: Ingeniería de Prompts</h3>
                                
                                {/* Lista de Archivos */}
                                <div className="space-y-4">
                                    {/* Item 1: PDF */}
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-lg flex items-center justify-center">
                                                <Icon name="fa-file-pdf" className="text-[#FF6B6B] text-lg" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Plantilla MasterPrompt Pro</h4>
                                                <p className="text-sm text-slate-600">Estructura profesional para prompts élite</p>
                                            </div>
                                        </div>
                                        <Icon name="fa-download" className="text-[#00BCD4] text-lg hover:scale-110 transition-transform" />
                                    </div>

                                    {/* Item 2: Excel */}
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#4ECDC4]/10 rounded-lg flex items-center justify-center">
                                                <Icon name="fa-table" className="text-[#4ECDC4] text-lg" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Checklist de Evaluación Avanzada</h4>
                                                <p className="text-sm text-slate-600">Métricas y criterios para análisis profundo</p>
                                            </div>
                                        </div>
                                        <Icon name="fa-download" className="text-[#00BCD4] text-lg hover:scale-110 transition-transform" />
                                    </div>

                                    {/* Item 3: JSON */}
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#FFD166]/10 rounded-lg flex items-center justify-center">
                                                <Icon name="fa-code" className="text-[#FFD166] text-lg" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">Templates JSON para APIs</h4>
                                                <p className="text-sm text-slate-600">Estructuras listas para integración</p>
                                            </div>
                                        </div>
                                        <Icon name="fa-download" className="text-[#00BCD4] text-lg hover:scale-110 transition-transform" />
                                    </div>
                                </div>

                                {/* Botón de Acción */}
                                <button className="w-full bg-[#00BCD4] text-white font-bold rounded-xl py-3 mt-4 hover:bg-[#00A5C4] transition-colors flex items-center justify-center gap-2">
                                    <Icon name="fa-download" />
                                    Descargar Todos los Recursos
                                </button>
                            </div>
                        </div>

                        {/* Lab Tab */}
                        {activeTab === 'lab' && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <div className="lg:col-span-3 space-y-6">
                                    {/* Prompt Synthesizer */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden h-fit max-h-[500px]">
                                        <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Icon name="fa-terminal" className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-normal text-white">Sintetizador de Prompts Élite</h3>
                                                    <p className="text-white/70 text-xs">Transforma ideas en MasterPrompts profesionales</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <textarea
                                                value={input}
                                                onChange={e => setInput(e.target.value)}
                                                placeholder={isModuleLocked(activeMod) ? "Desbloquea este módulo para usar el sintetizador..." : "Ingresa tu idea o prompt base para la transmutación..."}
                                                className={`w-full px-4 py-3 ${isModuleLocked(activeMod) ? 'bg-[#F8FAFC]/50 border-[#E2E8F0]/50 text-[#64748B]/50' : 'bg-[#F8FAFC] border-[#E2E8F0]'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] resize-none`}
                                                rows={4}
                                                onKeyDown={e => { if (!isModuleLocked(activeMod) && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOptimize(); } }}
                                                disabled={isModuleLocked(activeMod)}
                                            />
                                            <button
                                                onClick={handleOptimize}
                                                disabled={loading || isModuleLocked(activeMod)}
                                                className={`mt-4 w-full py-3 ${isModuleLocked(activeMod) ? 'bg-gradient-to-r from-[#64748B]/50 to-[#94A3B8]/50' : 'bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4]'} text-white rounded-xl font-normal hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        {loadMsg}
                                                    </>
                                                ) : isModuleLocked(activeMod) ? (
                                                    <>
                                                        <Icon name="fa-lock" />
                                                        Módulo Bloqueado
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
                                                        <span className="text-sm font-normal text-[#004B63]">MASTER PROMPT GENERADO</span>
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

                                    {/* Valerio Coach - Compact */}
                                    <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)] rounded-[2rem] overflow-hidden relative h-fit max-h-[400px]">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA8C4] rounded-full blur-[80px] opacity-15 pointer-events-none"></div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <ValerioAvatar state={avatarState} size={36} />
                                                <div>
                                                    <h3 className="font-normal text-white text-sm">Tu Coach: Valerio</h3>
                                                    <p className="text-white/50 text-xs">IA Nativa</p>
                                                </div>
                                            </div>
                                            <textarea
                                                value={coachQ}
                                                onChange={e => setCoachQ(e.target.value)}
                                                placeholder={isModuleLocked(activeMod) ? "Desbloquea este módulo para consultar a Valerio..." : "Pregunta a Valerio..."}
                                                className={`w-full px-3 py-2 ${isModuleLocked(activeMod) ? 'bg-white/5 border-white/10 text-white/30' : 'bg-white/10 border-white/20 text-white'} border rounded-lg placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] text-sm`}
                                                rows={2}
                                                disabled={isModuleLocked(activeMod)}
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={askCoach}
                                                    disabled={coachLoad || !coachQ.trim() || isModuleLocked(activeMod)}
                                                    className={`flex-1 py-2 ${isModuleLocked(activeMod) ? 'bg-gradient-to-r from-[#64748B]/50 to-[#94A3B8]/50' : 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]'} text-white rounded-lg font-normal text-sm hover:shadow-lg transition-all disabled:opacity-50`}
                                                >
                                                    {isModuleLocked(activeMod) ? 'Módulo Bloqueado' : coachLoad ? 'Pensando...' : 'Preguntar'}
                                                </button>
                                                <button
                                                    onClick={toggleSpeech}
                                                    className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-[#4DA8C4]'}`}
                                                >
                                                    <Icon name="fa-microphone" className="text-sm" />
            </button>
            
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
                    {/* Cerebro principal - Azul Petróleo */}
                    <path 
                        d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" 
                        fill="#004B63"
                    />
                    {/* Lóbulos superiores */}
                    <path 
                        d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" 
                        fill="#00BCD4"
                    />
                    <path 
                        d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" 
                        fill="#00BCD4"
                    />
                    {/* Líneas de actividad neuronal - Cyan glow */}
                    <path 
                        d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" 
                        fill="#00BCD4"
                        className="animate-pulse"
                    />
                    <path 
                        d="M10 10C9.5 10 9 10.5 9 11C9 11.5 9.5 12 10 12C10.5 12 11 11.5 11 11C11 10.5 10.5 10 10 10Z" 
                        fill="#00BCD4"
                        opacity="0.7"
                    />
                    <path 
                        d="M14 10C13.5 10 13 10.5 13 11C13 11.5 13.5 12 14 12C14.5 12 15 11.5 15 11C15 10.5 14.5 10 14 10Z" 
                        fill="#00BCD4"
                        opacity="0.7"
                    />
                    {/* Efecto de brillo interno */}
                    <circle 
                        cx="12" 
                        cy="12" 
                        r="8" 
                        fill="url(#brain-glow)"
                        opacity="0.15"
                    />
                    <defs>
                        <radialGradient id="brain-glow">
                            <stop offset="0%" stopColor="#00BCD4" />
                            <stop offset="100%" stopColor="#004B63" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </button>

            {/* Valerio Drawer */}
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
                                    <ul className="mt-2 space-y-1 text-white/70 text-sm">
                                        <li>• Optimización de prompts</li>
                                        <li>• Explicaciones técnicas</li>
                                        <li>• Estrategias de aprendizaje</li>
                                        <li>• Feedback en tiempo real</li>
                                    </ul>
                                </div>
                            </div>

                            {/* User Message Example */}
                            {coachMsg && (
                                <div className="flex justify-end">
                                    <div className="bg-[#4DA8C4] rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                        <p className="text-white text-sm">{coachQ}</p>
                                    </div>
                                </div>
                            )}

                            {/* Valerio Response */}
                            {coachMsg && (
                                <div className="flex items-start gap-3">
                                    <ValerioAvatar state="thinking" size={32} />
                                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                        <p className="text-white/90 text-sm">{coachMsg}</p>
                                    </div>
                                </div>
                            )}
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
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        askCoach();
                                    }
                                }}
                            />
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={askCoach}
                                    disabled={coachLoad || !coachQ.trim()}
                                    className="px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-normal hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {coachLoad ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Icon name="fa-paper-plane" />
                                    )}
                                </button>
                                <button
                                    onClick={toggleSpeech}
                                    className={`px-4 py-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-[#4DA8C4]'}`}
                                >
                                    <Icon name="fa-microphone" />
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-white/40 text-xs text-center">
                            Presiona Enter para enviar • Shift+Enter para nueva línea
                        </p>
                    </div>
                </div>
            </div>
                                            </div>
                                            {coachMsg && (
                                                <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <div className="flex items-start gap-2">
                                                        <ValerioAvatar state={avatarState} size={24} />
                                                        <p className="text-white/90 text-xs">{coachMsg}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Challenge Sidebar - Taller */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-[2rem] p-6 text-white border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)] relative overflow-hidden h-fit max-h-[400px]">
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD166] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Icon name="fa-bolt" className="text-[#FFD166]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/60 uppercase tracking-wider">Desafío del Módulo</p>
                                            </div>
                                        </div>
                                        <p className="text-white/80 italic mb-6">"{curr.challenge}"</p>
                                        <button 
                                            className={`w-full py-3 ${isModuleLocked(activeMod) ? 'bg-gradient-to-r from-[#64748B]/50 to-[#94A3B8]/50 text-[#64748B]/70' : 'bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63]'} rounded-xl font-normal hover:shadow-lg transition-all`}
                                            disabled={isModuleLocked(activeMod)}
                                        >
                                            <Icon name={isModuleLocked(activeMod) ? "fa-lock" : "fa-paper-plane"} className="mr-2" />
                                            {isModuleLocked(activeMod) ? 'Módulo Bloqueado' : 'Enviar solución'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Evaluation Tab */}
                        {activeTab === 'eval' && (
                            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden h-fit max-h-[600px] overflow-y-auto">
                                <div className="p-6 border-b border-[#E2E8F0]">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 ${isModuleLocked(activeMod) ? 'bg-gradient-to-br from-[#64748B]/50 to-[#94A3B8]/50' : 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]'} rounded-xl flex items-center justify-center`}>
                                            <Icon name={isModuleLocked(activeMod) ? "fa-lock" : "fa-clipboard-check"} className="text-2xl text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-normal text-[#004B63]">{isModuleLocked(activeMod) ? 'Módulo Bloqueado' : 'Evaluación del Módulo'}</h3>
                                            <p className="text-base text-slate-600">{isModuleLocked(activeMod) ? 'Completa el módulo anterior para desbloquear esta evaluación' : 'Responde correctamente 3 de 5 preguntas para obtener tu certificado'}</p>
                                        </div>
                                        {!isModuleLocked(activeMod) && !evalSubmitted && (
                                            <div className="px-4 py-2 bg-[#4DA8C4]/10 rounded-full">
                                                <span className="text-sm font-normal text-[#004B63]">{Object.keys(evalAnswers).length}/5</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isModuleLocked(activeMod) ? (
                                    <div className="p-12 text-center">
                                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#64748B]/10 to-[#94A3B8]/10 rounded-full flex items-center justify-center">
                                            <Icon name="fa-lock" className="text-5xl text-[#64748B]/50" />
                                        </div>
                                        <h3 className="text-2xl font-normal text-[#64748B] mb-3">Módulo Bloqueado</h3>
                                        <p className="text-[#64748B] mb-6">Completa el módulo anterior para desbloquear esta evaluación y obtener tu certificado.</p>
                                        <button 
                                            onClick={() => setActiveMod(activeMod - 1)}
                                            className="px-8 py-3 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-lg transition-all"
                                        >
                                            <Icon name="fa-arrow-left" className="mr-2" />Ir al módulo anterior
                                        </button>
                                    </div>
                                ) : !evalSubmitted ? (
                                    <div className="p-6 space-y-6">
                                        {evalQuestions.map((q, qi) => (
                                            <div key={qi}>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-8 h-8 bg-[#4DA8C4]/10 rounded-lg flex items-center justify-center text-[#4DA8C4] font-normal text-sm">{qi + 1}</div>
                                                    <p className="font-normal text-[#334155] flex-1">{q.q}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 ml-11">
                                                    {q.opts.map((opt, oi) => (
                                                     <button
                                                         key={oi}
                                                         onClick={() => setEvalAnswers({ ...evalAnswers, [qi]: oi })}
                                                         className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                             evalAnswers[qi] === oi
                                                                 ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63]'
                                                                 : 'border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]'
                                                         }`}
                                                         disabled={isModuleLocked(activeMod)}
                                                     >
                                                            <div className={`w-5 h-5 rounded-full border-2 mr-3 inline-flex items-center justify-center ${
                                                                evalAnswers[qi] === oi ? 'border-[#4DA8C4] bg-[#4DA8C4]' : 'border-[#E2E8F0]'
                                                            }`}>
                                                                {evalAnswers[qi] === oi && <div className="w-2 h-2 bg-white rounded-full" />}
                                                            </div>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleEvalSubmit}
                                            disabled={Object.keys(evalAnswers).length < 5 || isModuleLocked(activeMod)}
                                            className={`w-full py-4 ${isModuleLocked(activeMod) ? 'bg-gradient-to-r from-[#64748B]/50 to-[#94A3B8]/50' : 'bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4]'} text-white rounded-xl font-normal hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <Icon name={isModuleLocked(activeMod) ? "fa-lock" : "fa-check-circle"} className="mr-2" />
                                            {isModuleLocked(activeMod) ? 'Módulo Bloqueado' : 'Enviar evaluación'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div ref={chartRef} className="w-48 h-48 mx-auto mb-8 relative">
                                            {isChartInView && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[{value: evalScore}, {value: 5 - evalScore}]}
                                                            cx="50%" cy="50%" innerRadius={70} outerRadius={90}
                                                            startAngle={90} endAngle={-270}
                                                            dataKey="value" stroke="none"
                                                        >
                                                            <Cell fill={evalScore >= 3 ? '#4DA8C4' : '#FF6B9D'} />
                                                            <Cell fill="#E2E8F0" />
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            )}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#004B63] font-montserrat tracking-tighter">{evalScore}</span>
                                                <span className="text-xs text-[#64748B] uppercase tracking-widest font-normal mt-1">de 5</span>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-[#004B63] mb-3 font-montserrat">{evalScore >= 3 ? '¡Certificación Aprobada!' : 'Evaluación no superada'}</h3>
                                        <p className="text-base text-slate-600 mb-6">Obtuviste {evalScore} de 5 respuestas correctas</p>
                                        {evalScore >= 3 ? (
                                            <button
                                                onClick={() => setActiveTab('cert')}
                                                className="px-8 py-3 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-xl font-normal hover:shadow-lg transition-all"
                                            >
                                                <Icon name="fa-award" className="mr-2" />Ver certificado
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setEvalSubmitted(false); setEvalAnswers({}); }}
                                                className="px-8 py-3 bg-[#E2E8F0] text-[#64748B] rounded-xl font-normal hover:bg-[#d1d5db] transition-all"
                                            >
                                                <Icon name="fa-rotate-right" className="mr-2" />Reintentar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Certificate Tab */}
                        {activeTab === 'cert' && (
                            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] p-16 text-center relative overflow-hidden h-fit max-h-[500px]">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD166] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
                                
                                {isModuleLocked(activeMod) ? (
                                    <>
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#64748B]/50 to-[#94A3B8]/50 rounded-full flex items-center justify-center mb-6">
                                            <Icon name="fa-lock" className="text-4xl text-white" />
                                        </div>
                                        <h2 className="text-3xl font-normal text-[#64748B] font-montserrat mb-4">Módulo Bloqueado</h2>
                                        <p className="text-base text-slate-600 mb-6">Completa la evaluación del módulo {activeMod} para desbloquear tu certificado.</p>
                                        <button
                                            onClick={() => setActiveTab('eval')}
                                            className="px-8 py-4 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-xl transition-all"
                                        >
                                            <Icon name="fa-clipboard-check" className="mr-2" />Ir a Evaluación
                                        </button>
                                    </>
                                ) : evalScore >= 3 ? (
                                    <>
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FFD166] to-[#FF8E53] rounded-full flex items-center justify-center mb-6">
                                            <Icon name="fa-trophy" className="text-4xl text-white" />
                                        </div>
                                        <h2 className="text-3xl font-normal text-[#004B63] font-montserrat mb-4">¡Certificado de Excelencia!</h2>
                                        <p className="text-base text-slate-600">Has completado el módulo {activeMod}: {curr.title}</p>
                                        <button
                                            onClick={handleDownloadCert}
                                            className="px-8 py-4 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-xl transition-all"
                                        >
                                            <Icon name="fa-download" className="mr-2" />Descargar Certificado PDF
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FF6B9D] to-[#FF8E53] rounded-full flex items-center justify-center mb-6">
                                            <Icon name="fa-exclamation-triangle" className="text-4xl text-white" />
                                        </div>
                                        <h2 className="text-3xl font-normal text-[#004B63] font-montserrat mb-4">Evaluación Pendiente</h2>
                                        <p className="text-base text-slate-600 mb-6">Necesitas aprobar la evaluación (3/5) para obtener tu certificado.</p>
                                        <button
                                            onClick={() => setActiveTab('eval')}
                                            className="px-8 py-4 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-xl transition-all"
                                        >
                                            <Icon name="fa-clipboard-check" className="mr-2" />Ir a Evaluación
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
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
                            onKeyDown={e => e.key === 'Enter' && confirmNameAndDownload()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNameModal(false)}
                                className="flex-1 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-normal hover:bg-[#F8FAFC] transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmNameAndDownload}
                                disabled={!certName.trim()}
                                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
                </div>
            </div>
        </div>
    </div>
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
                            onKeyDown={e => e.key === 'Enter' && confirmNameAndDownload()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNameModal(false)}
                                className="flex-1 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-normal hover:bg-[#F8FAFC] transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmNameAndDownload}
                                disabled={!certName.trim()}
                                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] text-white rounded-xl font-normal disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
);
};

export default IALab;
