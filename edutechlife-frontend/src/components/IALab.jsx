import { useState, useRef, useEffect } from 'react';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';
import ValerioAvatar from './ValerioAvatar';
import html2pdf from 'html2pdf.js';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useInView } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';

const IALab = ({ onBack }) => {
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
    
    const [evalAnswers, setEvalAnswers] = useState({});
    const [evalSubmitted, setEvalSubmitted] = useState(false);
    const [evalScore, setEvalScore] = useState(0);
    
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');
    
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
        speakTextConversational(r, () => setAvatarState('idle'));
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
            speakTextConversational(r, () => setAvatarState('idle'));
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
                setCourseProgress(Math.round((newCompleted.length / 5) * 100));
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

            {/* Header - glass-nav para elemento pequeno */}
            <div className="glass-nav border-b border-[rgba(77,168,196,0.2)] shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-4">
                         <button
                             onClick={onBack}
                             className="flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] hover:bg-[#4DA8C4] hover:text-white border border-[#E2E8F0] rounded-lg transition-all duration-300"
                         >
                             <Icon name="fa-arrow-left" className="text-[#4DA8C4] hover:text-white" />
                             <span className="text-sm text-[#64748B] hover:text-white">Volver</span>
                         </button>
                        <div className="h-8 w-px bg-[#E2E8F0]" />
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-lg flex items-center justify-center">
                                 <Icon name="fa-flask-vial" className="text-white" />
                             </div>
                            <div>
                                <h1 className="font-montserrat font-bold text-lg text-[#004B63]">IA Lab Pro</h1>
                                <p className="text-xs text-[#64748B]">Hyper-Intelligence Certification</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-[#66CCCC]/20 border border-[#66CCCC]/40 rounded-full">
                            <span className="text-sm font-semibold text-[#004B63]">{completedModules.length}/5 Módulos</span>
                        </div>
                        <span className="px-3 py-1 bg-[#FFD166]/20 border border-[#FFD166]/40 rounded-full text-xs text-[#004B63] font-mono font-semibold">
                            PREMIUM
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                    {/* Sidebar - Module List */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-[2rem] overflow-hidden">
                            {/* Progress */}
                            <div className="p-6 border-b border-[#E2E8F0]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Progreso</span>
                                    <span className="text-sm font-bold text-[#4DA8C4]">{courseProgress}%</span>
                                </div>
                                <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full transition-all duration-500"
                                        style={{ width: `${courseProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="p-4">
                                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-4">Módulos del Curso</p>
                                <div className="space-y-2">
                                    {modules.map(mod => (
                                        <button
                                            key={mod.id}
                                            onClick={() => { setActiveMod(mod.id); setGenData(null); setInput(''); setActiveTab('lab'); setEvalSubmitted(false); setEvalAnswers({}); }}
                                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                                                activeMod === mod.id 
                                                    ? 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-lg' 
                                                    : completedModules.includes(mod.id)
                                                        ? 'bg-[#66CCCC]/10 border-2 border-[#66CCCC]/30 text-[#004B63] hover:border-[#4DA8C4]'
                                                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4] hover:text-[#004B63]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                                    activeMod === mod.id 
                                                        ? 'bg-white/20 text-white' 
                                                        : completedModules.includes(mod.id)
                                                            ? 'bg-[#66CCCC] text-white'
                                                            : 'bg-[#E2E8F0] text-[#64748B]'
                                                }`}>
                                                    {completedModules.includes(mod.id) ? (
                                                         <Icon name="fa-check" className="text-xs" />
                                                    ) : (
                                                        mod.id
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{mod.title}</p>
                                                    <p className={`text-xs ${activeMod === mod.id ? 'text-white/70' : 'text-[#64748B]'}`}>
                                                        {mod.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Module Header */}
                        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
                            <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                             <Icon name={curr.icon} className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-xs uppercase tracking-wider">Módulo {activeMod} · IA Lab Pro</p>
                                            <h2 className="text-2xl font-bold text-white font-montserrat">{curr.title}</h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setActiveTab('lab')}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'lab' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-terminal" className="mr-2" />Lab
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('eval')}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'eval' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-clipboard-check" className="mr-2" />Evaluación
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('cert')}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'cert' ? 'bg-white text-[#004B63]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                        >
                                            <Icon name="fa-medal" className="mr-2" />Certificado
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[#64748B]">{curr.desc}</p>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {curr.topics.map((topic, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#4DA8C4]/10 text-[#004B63] text-sm rounded-full font-medium">
                                            <Icon name="fa-sparkles" className="mr-1 text-[#4DA8C4]" />
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Lab Tab */}
                        {activeTab === 'lab' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Prompt Synthesizer */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Icon name="fa-terminal" className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">Sintetizador de Prompts Élite</h3>
                                                    <p className="text-white/70 text-xs">Transforma ideas en MasterPrompts profesionales</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <textarea
                                                value={input}
                                                onChange={e => setInput(e.target.value)}
                                                placeholder="Ingresa tu idea o prompt base para la transmutación..."
                                                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] resize-none"
                                                rows={4}
                                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOptimize(); } }}
                                            />
                                            <button
                                                onClick={handleOptimize}
                                                disabled={loading}
                                                className="mt-4 w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

                                    {/* Valerio Coach */}
                                    <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)] rounded-[2rem] overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4DA8C4] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <ValerioAvatar state={avatarState} size={64} />
                                                <div>
                                                    <h3 className="font-bold text-white text-lg">Tu Coach Virtual: Valerio</h3>
                                                    <p className="text-white/60 text-sm">Método Socrático · IA Nativa</p>
                                                </div>
                                            </div>
                                            <textarea
                                                value={coachQ}
                                                onChange={e => setCoachQ(e.target.value)}
                                                placeholder="Escribe tu pregunta para Valerio..."
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]"
                                                rows={2}
                                            />
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={askCoach}
                                                    disabled={coachLoad || !coachQ.trim()}
                                                    className="flex-1 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                                >
                                                    {coachLoad ? 'Pensando...' : 'Preguntar'}
                                                </button>
                                                <button
                                                    onClick={toggleSpeech}
                                                    className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-[#4DA8C4]'}`}
                                                >
                                                    <Icon name="fa-microphone" />
                                                </button>
                                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".txt,.md,.pdf,.doc,.docx" />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="p-3 rounded-xl bg-white/10 text-[#4DA8C4] hover:bg-white/20 transition-all"
                                                >
                                                    <Icon name="fa-paperclip" />
                                                </button>
                                            </div>
                                            {coachMsg && (
                                                <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                                    <div className="flex items-start gap-3">
                                                        <ValerioAvatar state={avatarState} size={40} />
                                                        <p className="text-white/90">{coachMsg}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Challenge Sidebar */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-[2rem] p-8 text-white border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)] relative overflow-hidden">
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
                                        <button className="w-full py-3 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-xl font-bold hover:shadow-lg transition-all">
                                            <Icon name="fa-paper-plane" className="mr-2" />Enviar solución
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/80 text-center shadow-sm">
                                            <Icon name="fa-clock" className="text-[#4DA8C4] text-lg mb-2" />
                                            <p className="font-bold text-[#004B63]">{curr.duration}</p>
                                            <p className="text-xs text-[#64748B]">Duración</p>
                                        </div>
                                        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/80 text-center shadow-sm">
                                            <Icon name="fa-signal" className="text-[#66CCCC] text-lg mb-2" />
                                            <p className="font-bold text-[#004B63]">{curr.level}</p>
                                            <p className="text-xs text-[#64748B]">Nivel</p>
                                        </div>
                                        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/80 text-center shadow-sm">
                                            <Icon name="fa-play" className="text-[#FFD166] text-lg mb-2" />
                                            <p className="font-bold text-[#004B63]">{curr.videos}</p>
                                            <p className="text-xs text-[#64748B]">Videos</p>
                                        </div>
                                        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/80 text-center shadow-sm">
                                            <Icon name="fa-briefcase" className="text-[#FF8E53] text-lg mb-2" />
                                            <p className="font-bold text-[#004B63]">{curr.projects}</p>
                                            <p className="text-xs text-[#64748B]">Proyectos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Evaluation Tab */}
                        {activeTab === 'eval' && (
                            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
                                <div className="p-6 border-b border-[#E2E8F0]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-xl flex items-center justify-center">
                                            <Icon name="fa-clipboard-check" className="text-2xl text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-[#004B63]">Evaluación del Módulo</h3>
                                            <p className="text-[#64748B] text-sm">Responde correctamente 3 de 5 preguntas para obtener tu certificado</p>
                                        </div>
                                        {!evalSubmitted && (
                                            <div className="px-4 py-2 bg-[#4DA8C4]/10 rounded-full">
                                                <span className="text-sm font-semibold text-[#004B63]">{Object.keys(evalAnswers).length}/5</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!evalSubmitted ? (
                                    <div className="p-6 space-y-6">
                                        {evalQuestions.map((q, qi) => (
                                            <div key={qi}>
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-8 h-8 bg-[#4DA8C4]/10 rounded-lg flex items-center justify-center text-[#4DA8C4] font-bold text-sm">{qi + 1}</div>
                                                    <p className="font-semibold text-[#334155] flex-1">{q.q}</p>
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
                                            disabled={Object.keys(evalAnswers).length < 5}
                                            className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Icon name="fa-check-circle" className="mr-2" />Enviar evaluación
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
                                                <span className="text-xs text-[#64748B] uppercase tracking-widest font-bold mt-1">de 5</span>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-[#004B63] mb-3 font-montserrat">{evalScore >= 3 ? '¡Certificación Aprobada!' : 'Evaluación no superada'}</h3>
                                        <p className="text-[#64748B] mb-6">Obtuviste {evalScore} de 5 respuestas correctas</p>
                                        {evalScore >= 3 ? (
                                            <button
                                                onClick={() => setActiveTab('cert')}
                                                className="px-8 py-3 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-xl font-bold hover:shadow-lg transition-all"
                                            >
                                                <Icon name="fa-award" className="mr-2" />Ver certificado
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setEvalSubmitted(false); setEvalAnswers({}); }}
                                                className="px-8 py-3 bg-[#E2E8F0] text-[#64748B] rounded-xl font-bold hover:bg-[#d1d5db] transition-all"
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
                            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] p-16 text-center relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD166] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FFD166] to-[#FF8E53] rounded-full flex items-center justify-center mb-6">
                                    <Icon name="fa-trophy" className="text-4xl text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#004B63] font-montserrat mb-4">¡Certificado de Excelencia!</h2>
                                <p className="text-[#64748B] mb-8">Has completado el módulo {activeMod}: {curr.title}</p>
                                <button
                                    onClick={handleDownloadCert}
                                    className="px-8 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-xl transition-all"
                                >
                                    <Icon name="fa-download" className="mr-2" />Descargar Certificado PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Name Modal */}
            {showNameModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-[#004B63] mb-2">Ingresa tu nombre</h3>
                        <p className="text-[#64748B] mb-6">Este nombre aparecerá en tu certificado</p>
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
                                className="flex-1 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmNameAndDownload}
                                disabled={!certName.trim()}
                                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-semibold disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IALab;
