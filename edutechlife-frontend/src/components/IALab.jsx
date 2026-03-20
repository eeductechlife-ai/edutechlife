import { useState, useRef, useEffect } from 'react';
import { PROMPT_VALERIO_DOCENTE } from '../constants/prompts';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';

const IALab = ({ onBack }) => {
    const [activeMod, setActiveMod] = useState(1);
    const [activeTab, setActiveTab] = useState('lab');
    const [input, setInput] = useState('');
    const [genData, setGenData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadMsg, setLoadMsg] = useState('');
    const [certName, setCertName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    
    const [evalAnswers, setEvalAnswers] = useState({});
    const [evalSubmitted, setEvalSubmitted] = useState(false);
    const [evalScore, setEvalScore] = useState(0);
    
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isHandsFree, setIsHandsFree] = useState(false);
    
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const loadingIntervalRef = useRef(null);

    const msgs = ['Analizando semántica...', 'Aplicando framework élite...', 'Optimizando parámetros...', 'Generando masterPrompt...'];

    const modules = [
        { id: 1, title: 'Ingeniería de Prompts', icon: 'fa-terminal', color: '#00C2E0', topics: ['Mastery Framework', 'Contexto Dinámico', 'Zero-Shot Prompting', 'Chain-of-Thought'], challenge: 'Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.', desc: 'Domina el arte de comunicarte con la IA a nivel experto.' },
        { id: 2, title: 'Potencia ChatGPT', icon: 'fa-robot', color: '#00E0FF', topics: ['Análisis Predictivo', 'GPTs Personalizados', 'Function Calling', 'System Prompts'], challenge: 'Estructura un GPT para análisis de mercados cuánticos.', desc: 'Desbloquea todo el potencial de los modelos GPT con técnicas avanzadas.' },
        { id: 3, title: 'Rastreo Profundo', icon: 'fa-search', color: '#7C3AED', topics: ['Razonamiento Multimodal', 'Grounding Real-Time', 'Deep Research', 'Fact-Checking IA'], challenge: 'Genera una comparativa técnica de latencia entre arquitecturas IA.', desc: 'Técnicas de investigación profunda con IA para resultados de élite.' },
        { id: 4, title: 'Inmersión NotebookLM', icon: 'fa-microphone', color: '#FB923C', topics: ['Curaduría de Fuentes', 'Síntesis de Conocimiento', 'Audio Overviews', 'Gestión Documental'], challenge: 'Genera un podcast analizando 5 papers sobre neuro-plasticidad.', desc: 'Convierte cualquier documento en conocimiento accionable con IA.' },
        { id: 5, title: 'Proyecto Disruptivo', icon: 'fa-trophy', color: '#FBBF24', topics: ['Integración Total', 'MVP Inteligente', 'Pitch Deck IA', 'Roadmap Estratégico'], challenge: 'Propón una automatización integral para una industria local de alto nivel.', desc: 'Aplica todo lo aprendido en un proyecto de impacto real.' },
    ];

    const evalQuestions = [
        { q: '¿Qué técnica de prompting guía al modelo paso a paso?', opts: ['Zero-Shot', 'Chain-of-Thought', 'Few-Shot', 'Role Play'], ans: 1 },
        { q: '¿Qué herramienta transforma documentos en podcasts de IA?', opts: ['ChatGPT', 'Midjourney', 'NotebookLM', 'Copilot'], ans: 2 },
        { q: '¿Qué mide el ROI en un proyecto de automatización con IA?', opts: ['Velocidad de la red', 'Retorno sobre inversión', 'Número de usuarios', 'Calidad de la imagen'], ans: 1 },
        { q: '¿Qué modelo de IA genera texto e imágenes de forma multimodal?', opts: ['GPT-4o', 'Whisper', 'DALL-E 2', 'Stable Diffusion'], ans: 0 },
        { q: '¿Cuál es el objetivo principal de la Ingeniería de Prompts?', opts: ['Programar en Python', 'Diseñar interfaces gráficas', 'Comunicarse efectivamente con IA', 'Entrenar modelos desde cero'], ans: 2 },
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
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setCoachQ(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    useEffect(() => {
        return () => {
            if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
            }
        };
    }, []);

    const askCoach = async () => {
        const q = coachQ.trim(); if (!q) return;
        setCoachLoad(true);
        const prompt = `Estudiante: ${q}`;
        const r = await callDeepseek(prompt, PROMPT_VALERIO_DOCENTE, false);
        setCoachMsg(r); 
        setCoachLoad(false); 
        setCoachQ('');
        doSpeak(r);
    };

    const toggleSpeech = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsHandsFree(false);
        } else {
            setCoachQ('');
            setIsListening(true); // Se agrega para actualizar el estado visual
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

        const MAX_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ['.txt', '.md', '.pdf', '.doc', '.docx'];
        
        if (file.size > MAX_SIZE) {
            setCoachMsg('El archivo excede el tamaño máximo de 5MB. Por favor intenta con un archivo más pequeño.');
            return;
        }
        
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_TYPES.includes(fileExt)) {
            setCoachMsg('Tipo de archivo no permitido. Usa: .txt, .md, .pdf, .doc o .docx');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const content = evt.target.result;
            setCoachLoad(true);
            setCoachMsg('Leyendo el documento...');
            const prompt = `El estudiante acaba de subir un documento con el siguiente contenido:\n\n${content}\n\nPregúntale de forma empática y motivadora qué desea hacer con la información, o si tiene preguntas al respecto (eres un profesor colombiano). Responde de forma muy natural y concisa (1 o 2 líneas).`;
            const r = await callDeepseek(prompt, PROMPT_VALERIO_DOCENTE, false);
            setCoachMsg(r);
            setCoachLoad(false);
            doSpeak(r);
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const doSpeak = (text) => {
        if (!text) return;
        speakTextConversational(text);
    };

    const handleOptimize = async () => {
        if (!input.trim()) return;
        setLoading(true); setGenData(null);
        let idx = 0; setLoadMsg(msgs[0]);
        loadingIntervalRef.current = setInterval(() => { idx = (idx + 1) % msgs.length; setLoadMsg(msgs[idx]); }, 1800);
        const r = await callDeepseek(input, 'Eres el Arquitecto de Prompts élite de Edutechlife. Devuelve SOLO JSON con: masterPrompt (string) y feedback (string, máx 2 oraciones).', true);
        if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
        }
        if (!r.error) setGenData(r);
        setLoading(false);
    };

    const handleEvalSubmit = () => {
        let score = 0;
        evalQuestions.forEach((q, i) => { if (evalAnswers[i] === q.ans) score++; });
        setEvalScore(score);
        setEvalSubmitted(true);
        if (score >= 3) setActiveTab('cert');
    };

    const downloadCert = () => {
        const studentName = certName.trim() || 'Estudiante';
        const canvas = document.createElement('canvas');
        canvas.width = 1200; canvas.height = 840;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 1200, 840);
        grad.addColorStop(0, '#0D2137'); grad.addColorStop(.5, '#0A3550'); grad.addColorStop(1, '#0D2137');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 840);
        ctx.strokeStyle = 'rgba(0,194,224,0.3)'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, 1140, 780);
        ctx.strokeStyle = 'rgba(0,194,224,0.1)'; ctx.lineWidth = 1; ctx.strokeRect(42, 42, 1116, 756);
        const orbGrad = ctx.createRadialGradient(600, 0, 0, 600, 0, 400);
        orbGrad.addColorStop(0, 'rgba(0,194,224,0.18)'); orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad; ctx.fillRect(0, 0, 1200, 400);
        ctx.fillStyle = 'rgba(0,194,224,0.6)'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center';
        ctx.fillText('E D U T E C H L I F E', 600, 130);
        ctx.fillStyle = 'rgba(0,194,224,0.4)'; ctx.fillRect(400, 145, 400, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = 'bold 36px Arial';
        ctx.fillText('CERTIFICADO DE EXCELENCIA', 600, 210);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '22px Arial';
        ctx.fillText('Este certificado acredita que', 600, 290);
        ctx.fillStyle = 'white'; ctx.font = 'bold 72px Arial';
        ctx.fillText(studentName, 600, 390);
        const nameGrad = ctx.createLinearGradient(300, 405, 900, 405);
        nameGrad.addColorStop(0, 'transparent'); nameGrad.addColorStop(.5, 'rgba(0,194,224,0.8)'); nameGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nameGrad; ctx.fillRect(300, 405, 600, 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '20px Arial';
        ctx.fillText('ha completado satisfactoriamente el programa', 600, 460);
        ctx.fillStyle = 'rgba(0,194,224,1)'; ctx.font = 'bold 32px Arial';
        ctx.fillText(`Módulo ${activeMod}: ${modules.find(m => m.id === activeMod)?.title}`, 600, 510);
        ctx.fillStyle = 'rgba(0,224,255,0.9)'; ctx.font = 'bold 20px Arial';
        ctx.fillText(`Evaluación: ${evalScore}/5 — ${evalScore >= 5 ? 'Distinción' : evalScore >= 4 ? 'Sobresaliente' : 'Aprobado'}`, 600, 565);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '16px Arial';
        ctx.fillText(`Fecha: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}`, 600, 640);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(400, 700); ctx.lineTo(800, 700); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '14px Arial';
        ctx.fillText('Programa Edutechlife — Hyper-Intelligence', 600, 725);
        const sealGrad = ctx.createRadialGradient(600, 780, 0, 600, 780, 40);
        sealGrad.addColorStop(0, 'rgba(0,194,224,0.6)'); sealGrad.addColorStop(1, 'rgba(0,194,224,0.1)');
        ctx.fillStyle = sealGrad; ctx.beginPath(); ctx.arc(600, 785, 35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.font = 'bold 20px Arial'; ctx.fillText('✓', 600, 793);
        const link = document.createElement('a'); link.download = `certificado-edutechlife-modulo${activeMod}.png`; link.href = canvas.toDataURL(); link.click();
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
    const tabBtnStyle = (t) => ({
        padding: '.6rem 1.4rem', borderRadius: '100px', border: '1px solid', cursor: 'pointer', transition: 'all .3s',
        fontFamily: 'DM Mono', fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.15em',
        background: activeTab === t ? 'linear-gradient(135deg,var(--primary),var(--accent))' : 'transparent',
        color: activeTab === t ? '#0A2540' : 'rgba(255,255,255,.5)',
        borderColor: activeTab === t ? 'transparent' : 'rgba(255,255,255,.15)',
    });

    return (
        <div className="ia-lab-view">
            <aside className="ia-lab-sidebar">
                <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,194,224,.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.5rem' }}>
                        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,194,224,.4)', flexShrink: 0 }}>
                            <i className="fa-solid fa-flask-vial" style={{ color: '#0A2540', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Syne', fontSize: '1rem', fontWeight: 800, color: 'white', letterSpacing: '-.01em' }}>IA LAB <span style={{ color: 'var(--primary)' }}>PRO</span></div>
                            <div style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.15em' }}>EDUTECHLIFE</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                            <span style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.15em' }}>Progreso general</span>
                            <span style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'var(--primary)' }}>20%</span>
                        </div>
                        <div className="xp-bar-bg"><div className="xp-bar-fill" style={{ width: '20%' }} /></div>
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: '.5rem', paddingLeft: '.4rem' }}>MÓDULOS</p>
                    {modules.map(mod => (
                        <button key={mod.id} onClick={() => { setActiveMod(mod.id); setGenData(null); setInput(''); setActiveTab('lab'); setEvalSubmitted(false); setEvalAnswers({}); }} className={`module-btn ${activeMod === mod.id ? 'active' : 'inactive'}`}>
                            <div className="module-num">{mod.id}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: 'DM Mono', fontWeight: 500, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.12em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mod.title}</p>
                            </div>
                            <i className={`fa-solid ${mod.icon}`} style={{ fontSize: '11px', opacity: .5, flexShrink: 0 }} />
                        </button>
                    ))}
                </nav>

                {/* CORRECCIÓN AQUÍ: Se eliminó borderTop duplicado y se unificó el estilo */}
                <button onClick={onBack} style={{ marginTop: '1.5rem', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'DM Mono', fontSize: '9px', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.2em', background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', transition: 'color .3s', width: '100%' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.25)'}>
                    <i className="fa-solid fa-power-off text-xs" />VOLVER AL NÚCLEO
                </button>
            </aside>

            <main className="ia-lab-content">
                <div className="pizarra-bg" />
                <div style={{ maxWidth: '60rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.75rem' }}>
                                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,rgba(0,194,224,.2),rgba(0,224,255,.1))', border: '1px solid rgba(0,194,224,.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`fa-solid ${curr.icon}`} style={{ color: 'var(--primary)', fontSize: '1rem' }} />
                                </div>
                                <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'rgba(0,194,224,.7)', textTransform: 'uppercase', letterSpacing: '.22em' }}>MÓDULO {activeMod} · IA LAB PRO</span>
                            </div>
                            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#0A2540', letterSpacing: '-.02em', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: .95 }}>{curr.title}</h2>
                            <p style={{ color: '#5A7FA0', fontSize: '.9rem', marginTop: '.75rem', fontWeight: 300 }}>{curr.desc}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0, background: 'rgba(10,37,64,.08)', padding: '6px', borderRadius: '100px', border: '1px solid rgba(0,194,224,.12)' }}>
                            <button style={tabBtnStyle('lab')} onClick={() => setActiveTab('lab')}><i className="fa-solid fa-terminal" style={{ marginRight: 5 }} />Lab</button>
                            <button style={tabBtnStyle('eval')} onClick={() => setActiveTab('eval')}><i className="fa-solid fa-clipboard-check" style={{ marginRight: 5 }} />Eval.</button>
                            <button style={tabBtnStyle('cert')} onClick={() => setActiveTab('cert')}><i className="fa-solid fa-medal" style={{ marginRight: 5 }} />Cert.</button>
                        </div>
                    </div>

                    {activeTab === 'lab' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,194,224,.1)' }}>
                                        <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,rgba(0,194,224,.15),rgba(0,224,255,.08))', border: '1px solid rgba(0,194,224,.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-layer-group" style={{ color: 'var(--primary)', fontSize: '11px' }} />
                                        </div>
                                        <h3 style={{ fontFamily: 'DM Mono', fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.22em', color: '#5A7FA0' }}>DOMINIO TÉCNICO</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
                                        {curr.topics.map((t, i) => (
                                            <div key={i} className="lab-topic-chip">
                                                <span>{t}</span>
                                                <i className="fa-solid fa-sparkles" style={{ color: 'var(--primary)', fontSize: '10px', flexShrink: 0 }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`synth-panel${loading ? ' neural-glow' : ''}`}>
                                    <div className="ai-panel-header">
                                        <div className="ai-panel-icon"><i className="fa-solid fa-terminal" /></div>
                                        <span className="ai-panel-title">SINTETIZADOR DE PROMPTS ÉLITE</span>
                                        <div className="ai-panel-badge"><span className="ai-panel-badge-dot" />GEMINI LIVE</div>
                                    </div>
                                    <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ingresa tu idea o prompt base para la transmutación..." className="ai-input-dark" rows={4} style={{ width: '100%' }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOptimize(); } }} />
                                    <button onClick={handleOptimize} disabled={loading} className="ai-run-btn">
                                        {loading ? <><span>Procesando</span><div className="ai-loading-bars"><span /><span /><span /><span /><span /></div></> : <><span>Sintetizar masterPrompt élite</span><i className="fa-solid fa-bolt text-xs relative z-10" /></>}
                                    </button>
                                    {loading && <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', marginTop: '1rem', background: 'rgba(0,194,224,.06)', border: '1px solid rgba(0,194,224,.15)', borderRadius: '1rem' }}>
                                        <div className="ai-loading-bars"><span /><span /><span /><span /><span /></div>
                                        <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'var(--primary)', letterSpacing: '.15em', textTransform: 'uppercase' }}>{loadMsg}</span>
                                    </div>}
                                    {genData && !loading && <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', marginBottom: '.6rem' }}>
                                            <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.2em' }}>MASTER PROMPT GENERADO</span>
                                            <button onClick={() => navigator.clipboard.writeText(genData.masterPrompt)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid rgba(0,224,255,.25)', color: 'var(--accent)', fontFamily: 'DM Mono', fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer', transition: 'all .25s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,224,255,.1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                                <i className="fa-solid fa-copy text-xs" />Copiar
                                            </button>
                                        </div>
                                        <div className="synth-result-code">{genData.masterPrompt}</div>
                                        <div className="synth-feedback"><strong>Feedback:</strong> {genData.feedback}</div>
                                    </>}
                                </div>

                                <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(165deg,rgba(0,194,224,.08),rgba(0,37,64,.15))' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                                        <i className="fa-solid fa-user-graduate" style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                                        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Tu Coach Virtual: Valerio</h3>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <textarea 
                                            value={coachQ} 
                                            onChange={e => setCoachQ(e.target.value)}
                                            placeholder="Escribe tu pregunta para Valerio..."
                                            className="ai-input-dark"
                                            rows={2}
                                            style={{ width: '100%', marginBottom: '0.75rem' }}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={askCoach} disabled={coachLoad || !coachQ.trim()} className="ai-run-btn" style={{ flex: 1 }}>
                                                {coachLoad ? 'Pensando...' : 'Preguntar'}
                                            </button>
                                            <button onClick={toggleSpeech} className="ai-run-btn" style={{ width: 'auto', padding: '0 1rem', background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', border: isListening ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)' }}>
                                                <i className="fa-solid fa-microphone" style={{ color: isListening ? '#EF4444' : 'var(--primary)' }} />
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".txt,.md,.pdf,.doc,.docx" />
                                            <button onClick={() => fileInputRef.current?.click()} className="ai-run-btn" style={{ width: 'auto', padding: '0 1rem' }}>
                                                <i className="fa-solid fa-paperclip" />
                                            </button>
                                        </div>
                                    </div>
                                    {coachMsg && (
                                        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(0,194,224,.2)', borderRadius: '1rem', padding: '1rem', color: 'rgba(255,255,255,.9)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                            {coachMsg}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ flexShrink: 0 }}>
                                <div style={{ background: 'linear-gradient(165deg,#0D2137,#0A3550)', borderRadius: '2rem', padding: '2.5rem', color: 'white', border: '1px solid rgba(0,194,224,.18)', boxShadow: '0 20px 50px rgba(0,0,0,.15)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, background: 'radial-gradient(circle,rgba(0,194,224,.15),transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
                                    <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, background: 'radial-gradient(circle,rgba(0,224,255,.1),transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
                                    <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,rgba(0,194,224,.25),rgba(0,224,255,.15))', border: '1px solid rgba(0,194,224,.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                                        <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                                    </div>
                                    <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.2em', position: 'relative', zIndex: 1 }}>DESAFÍO DEL MÓDULO</span>
                                    <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.75, fontStyle: 'italic', margin: '1rem 0 2rem', position: 'relative', zIndex: 1 }}>"{curr.challenge}"</p>
                                    <button className="ai-run-btn" style={{ borderRadius: '1rem', position: 'relative', zIndex: 1 }}>
                                        <span>Enviar solución</span><i className="fa-solid fa-paper-plane text-xs relative z-10" />
                                    </button>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                                    {[{ label: 'Duración', val: '4h 30min', icon: 'fa-clock', c: 'var(--primary)' }, { label: 'Nivel', val: 'Avanzado', icon: 'fa-signal', c: 'var(--accent)' }, { label: 'Videos', val: '12', icon: 'fa-play', c: '#FBBF24' }, { label: 'Proyectos', val: '3', icon: 'fa-briefcase', c: '#FB923C' }].map((s, i) => (
                                        <div key={i} style={{ background: 'white', border: '1px solid rgba(0,194,224,.12)', borderRadius: '1.1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
                                            <i className={`fa-solid ${s.icon}`} style={{ color: s.c, fontSize: '.9rem' }} />
                                            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: '#0A2540' }}>{s.val}</div>
                                            <div style={{ fontFamily: 'DM Mono', fontSize: '8px', color: '#5A7FA0', textTransform: 'uppercase', letterSpacing: '.1em' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'eval' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="glass-card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,194,224,.1)' }}>
                                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,194,224,.3)', flexShrink: 0 }}>
                                        <i className="fa-solid fa-clipboard-check" style={{ color: '#0A2540', fontSize: '1.3rem' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: '#0A2540', textTransform: 'uppercase', letterSpacing: '-.01em' }}>Evaluación del Módulo</h3>
                                        <p style={{ color: '#5A7FA0', fontSize: '.85rem', marginTop: 2 }}>Responde correctamente 3 de 5 preguntas para obtener tu certificado</p>
                                    </div>
                                    {!evalSubmitted && <div style={{ marginLeft: 'auto', background: 'rgba(0,194,224,.08)', border: '1px solid rgba(0,194,224,.15)', borderRadius: '100px', padding: '6px 16px', fontFamily: 'DM Mono', fontSize: '9px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.15em' }}>{Object.keys(evalAnswers).length}/5</div>}
                                </div>

                                {!evalSubmitted ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                        {evalQuestions.map((q, qi) => (
                                            <div key={qi}>
                                                <div style={{ display: 'flex', gap: 12, marginBottom: '.85rem', alignItems: 'flex-start' }}>
                                                    <span style={{ width: 28, height: 28, background: 'linear-gradient(135deg,rgba(0,194,224,.15),rgba(0,224,255,.08))', border: '1px solid rgba(0,194,224,.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono', fontSize: '11px', fontWeight: 500, color: 'var(--primary)', flexShrink: 0 }}>{qi + 1}</span>
                                                    <p style={{ fontWeight: 600, fontSize: '.95rem', color: '#1E3A5F', lineHeight: 1.5 }}>{q.q}</p>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', paddingLeft: '2.5rem' }}>
                                                    {q.opts.map((opt, oi) => (
                                                        <div key={oi} className={`eval-option${evalAnswers[qi] === oi ? ' selected' : ''}`} onClick={() => setEvalAnswers({ ...evalAnswers, [qi]: oi })}>
                                                            <div className="eval-radio">{evalAnswers[qi] === oi && <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />}</div>
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={handleEvalSubmit} disabled={Object.keys(evalAnswers).length < 5} className="ai-run-btn" style={{ background: Object.keys(evalAnswers).length < 5 ? 'rgba(0,0,0,.1)' : 'linear-gradient(135deg,var(--primary),var(--accent))', color: Object.keys(evalAnswers).length < 5 ? '#9CA3AF' : '#0A2540', boxShadow: 'none', cursor: Object.keys(evalAnswers).length < 5 ? 'not-allowed' : 'pointer', marginTop: '.5rem' }}>
                                            <span>Enviar evaluación</span><i className="fa-solid fa-check-circle text-sm relative z-10" />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <div style={{ width: 80, height: 80, background: evalScore >= 3 ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,.15)' }}>
                                            <i className={`fa-solid ${evalScore >= 3 ? 'fa-check' : 'fa-xmark'}`} style={{ color: 'white', fontSize: '2rem' }} />
                                        </div>
                                        <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#0A2540', marginBottom: '.5rem' }}>{evalScore >= 3 ? '¡Felicidades!' : 'Intenta de nuevo'}</h3>
                                        <p style={{ color: '#5A7FA0', fontSize: '1rem', marginBottom: '1.5rem' }}>Obtuviste {evalScore} de 5 respuestas correctas</p>
                                        {evalScore >= 3 && (
                                            <button onClick={() => setActiveTab('cert')} className="ai-run-btn" style={{ display: 'inline-flex' }}>
                                                <span>Ver certificado</span><i className="fa-solid fa-award text-sm relative z-10" />
                                            </button>
                                        )}
                                        {evalScore < 3 && (
                                            <button onClick={() => { setEvalSubmitted(false); setEvalAnswers({}); }} className="ai-run-btn" style={{ display: 'inline-flex', background: 'rgba(0,0,0,.1)', color: '#5A7FA0' }}>
                                                <span>Reintentar</span><i className="fa-solid fa-rotate-right text-sm relative z-10" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cert' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
                                <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg,rgba(0,194,224,.2),rgba(0,224,255,.1))', border: '2px solid rgba(0,194,224,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <i className="fa-solid fa-trophy" style={{ color: 'var(--primary)', fontSize: '2.5rem' }} />
                                </div>
                                <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#0A2540', marginBottom: '1rem' }}>¡Certificado de Excelencia!</h2>
                                <p style={{ color: '#5A7FA0', fontSize: '1rem', marginBottom: '2rem' }}>Has completado el módulo {activeMod}: {curr.title}</p>
                                <button onClick={handleDownloadCert} className="ai-run-btn" style={{ margin: '0 auto' }}>
                                    <span>Descargar Certificado</span><i className="fa-solid fa-download text-sm relative z-10" />
                                </button>
                            </div>
                        </div>
                    )}

                    {showNameModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                            <div style={{ background: '#0D2137', border: '1px solid rgba(0,194,224,0.3)', borderRadius: '1.5rem', padding: '2rem', maxWidth: '400px', width: '90%' }}>
                                <h3 style={{ color: 'white', fontFamily: 'Syne', fontSize: '1.5rem', marginBottom: '1rem' }}>Ingresa tu nombre</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Este nombre aparecerá en tu certificado</p>
                                <input 
                                    type="text" 
                                    value={certName} 
                                    onChange={(e) => setCertName(e.target.value)}
                                    placeholder="Tu nombre completo"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(0,194,224,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', marginBottom: '1.5rem', outline: 'none' }}
                                    onKeyDown={(e) => e.key === 'Enter' && confirmNameAndDownload()}
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setShowNameModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Cancelar</button>
                                    <button onClick={confirmNameAndDownload} disabled={!certName.trim()} style={{ flex: 1, padding: '1rem', borderRadius: '100px', border: 'none', background: certName.trim() ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'rgba(255,255,255,0.1)', color: certName.trim() ? 'white' : 'rgba(255,255,255,0.3)', cursor: certName.trim() ? 'pointer' : 'not-allowed' }}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default IALab;