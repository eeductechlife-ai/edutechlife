import { useState, useEffect, useRef } from 'react';
import { PROMPT_PSICOLOGO_VAK } from '../constants/prompts';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';

const VAKTest = ({ onNavigate }) => {
    const [step, setStep] = useState('intro-greeting');
    const [feeling, setFeeling] = useState('');
    const [userName, setUserName] = useState('');
    const [answers, setAnswers] = useState([]);
    const [res, setRes] = useState('');
    const [load, setLoad] = useState(false);
    const [speak, setSpeak] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pdfLoad, setPdfLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isHandsFree, setIsHandsFree] = useState(false);
    
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: '¡Hola! Soy Dani, tu guía de aprendizaje. Antes de empezar a descubrir tu estilo cognitivo...\n**¿Cómo te sientes hoy?**', type: 'text' }
    ]);
    
    const chatEndRef = useRef(null);
    const isHandsFreeRef = useRef(isHandsFree);
    const stepRef = useRef(step);
    const speakingRef = useRef(false);

    useEffect(() => {
        isHandsFreeRef.current = isHandsFree;
        stepRef.current = step;
    }, [isHandsFree, step]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, step, load]);

    const questions = [
        { q: "¿Cómo prefieres aprender algo nuevo?", opts: ["Viendo gráficos o demostraciones", "Escuchando explicaciones", "Haciendo la tarea físicamente"] },
        { q: "¿Qué recuerdas mejor después de unos días?", opts: ["Las caras y los lugares", "Los nombres y las conversaciones", "Las actividades y lo que hiciste"] },
        { q: "Cuando tratas de concentrarte, ¿qué te distrae más?", opts: ["El desorden visual", "Los ruidos o voces", "La incomodidad o temperatura"] },
        { q: "En tu tiempo libre prefieres...", opts: ["Ver películas o leer", "Escuchar música o podcasts", "Hacer deportes o manualidades"] },
        { q: "¿Cómo organizas tus ideas para un proyecto?", opts: ["Haciendo esquemas o mapas mentales", "Hablando con otros o en voz alta", "Experimentando y tomando notas sueltas"] },
        { q: "Si te pierdes, ¿qué haces para ubicarte?", opts: ["Miro un mapa o busco señales visuales", "Le pregunto a alguien por indicaciones", "Sigo mi instinto y exploro caminando"] },
        { q: "¿Qué tipo de profesor prefieres?", opts: ["El que usa presentaciones ricas en imágenes", "El que domina la oratoria e invita al debate", "El que propone proyectos y laboratorios"] },
        { q: "Cuando te enojas, tú tiendes a...", opts: ["Callar y fruncir el ceño", "Gritar o quejarte en voz alta", "Tensar el cuerpo y caminar rápido"] },
        { q: "Para resolver un problema de matemáticas...", opts: ["Lo escribo para visualizar los números", "Me repito los pasos en la mente", "Uso los dedos o objetos para contar"] },
        { q: "Si tuvieras que memorizar una contraseña...", opts: ["La escribo varias veces", "La repito en voz alta", "La tecleo en mi mente como si fuera un piano"] }
    ];

    const handleHandsFreeTranscription = (transcript) => {
        if (!transcript.trim()) return;
        
        const currentStep = stepRef.current;
        if (currentStep === 'intro-greeting') {
            handleFeelingSubmit(transcript);
        } else if (currentStep === 'intro-name') {
            handleNameSubmit(transcript);
        } else if (typeof currentStep === 'number') {
            const qObj = questions[currentStep];
            if (!qObj) return;

            const spoken = transcript.toLowerCase();
            let selectedIndex = -1;

            if (spoken.match(/\b(a|uno|primera|primero)\b/)) selectedIndex = 0;
            else if (spoken.match(/\b(b|dos|segunda|segundo)\b/)) selectedIndex = 1;
            else if (spoken.match(/\b(c|tres|tercera|tercero)\b/)) selectedIndex = 2;
            else {
                for (let i = 0; i < qObj.options.length; i++) {
                    const optText = qObj.options[i].text.toLowerCase();
                    const keywords = optText.split(' ').slice(0, 3).join(' ');
                    if (spoken.includes(keywords) || optText.includes(spoken)) {
                        selectedIndex = i;
                        break;
                    }
                }
            }

            if (selectedIndex !== -1) {
                handleAnswer(qObj.options[selectedIndex]);
            } else {
                setChatHistory(prev => [...prev, { role: 'assistant', text: "No te entendí bien, ¿puedes repetir tu respuesta?", type: 'text' }]);
                speakTextConversational("No te entendí bien, ¿puedes repetir tu respuesta?", () => {
                    if (isHandsFreeRef.current) iniciarReconocimiento(handleHandsFreeInput, handleHandsFreeTranscription, setIsListening);
                });
            }
        }
    };
    
    const handleHandsFreeInput = (transcript) => {
        const currentStep = stepRef.current;
        if (currentStep === 'intro-greeting') {
            setFeeling(transcript);
        } else if (currentStep === 'intro-name') {
            setUserName(transcript);
        }
    };

    const toggleHandsFree = () => {
        const newHandsFree = !isHandsFree;
        setIsHandsFree(newHandsFree);
        if (newHandsFree) {
            const lastMsg = chatHistory[chatHistory.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
                let text = lastMsg.text;
                if (lastMsg.type === 'options' && lastMsg.options) {
                    text += ". Opciones: " + lastMsg.options.join(', o ');
                }
                speakTextConversational(text, () => {
                    if (isHandsFreeRef.current) {
                        iniciarReconocimiento(handleHandsFreeInput, handleHandsFreeTranscription, setIsListening);
                    }
                });
            }
        } else {
            window.speechSynthesis.cancel();
        }
    };

    useEffect(() => {
        const lastMsg = chatHistory[chatHistory.length - 1];
        if (isHandsFree && lastMsg && lastMsg.role === 'assistant' && !speakingRef.current) {
            speakingRef.current = true;
            let textToSpeak = lastMsg.text;
            if (lastMsg.type === 'options' && lastMsg.options) {
                textToSpeak += ". Opciones: " + lastMsg.options.join(', o ');
            }
            speakTextConversational(textToSpeak, () => {
                speakingRef.current = false;
                if (isHandsFreeRef.current && stepRef.current !== 'result' && stepRef.current !== 'loading') {
                    iniciarReconocimiento(handleHandsFreeInput, handleHandsFreeTranscription, setIsListening);
                }
            });
        }
    }, [chatHistory]);

    const handleFeelingSubmit = (overrideText) => {
        const finalFeeling = typeof overrideText === 'string' ? overrideText : feeling;
        if (!finalFeeling.trim()) return;
        setChatHistory(prev => [
            ...prev, 
            { role: 'user', text: finalFeeling },
            { role: 'assistant', text: '¡Qué alegría escucharte! Para hacer tu diagnóstico mucho más personalizado e interactuar contigo, dime:\n**¿Cómo te llamas?**', type: 'text' }
        ]);
        setFeeling('');
        setStep('intro-name');
    };

    const handleNameSubmit = (overrideText) => {
        const finalUserName = typeof overrideText === 'string' ? overrideText : userName;
        if (!finalUserName.trim()) return;
        setChatHistory(prev => [
            ...prev, 
            { role: 'user', text: finalUserName },
            { role: 'assistant', text: `¡Muy bien, ${finalUserName}! Empecemos el test. Te haré unas preguntas y tú eliges la respuesta que más vaya contigo.`, type: 'text' },
            { role: 'assistant', text: questions[0].q, type: 'options', options: questions[0].opts }
        ]);
        setStep(0);
    };

    const handleAnswer = (opt) => {
        const newAns = [...answers, { q: questions[step].q, a: opt }];
        setAnswers(newAns);
        
        setChatHistory(prev => {
            const newHist = [...prev];
            if (newHist[newHist.length - 1].type === 'options') {
                newHist[newHist.length - 1].type = 'text';
                delete newHist[newHist.length - 1].options;
            }
            newHist.push({ role: 'user', text: opt });
            return newHist;
        });

        if (step < questions.length - 1) {
            const nextStep = step + 1;
            setTimeout(() => {
                setChatHistory(prev => [
                    ...prev,
                    { role: 'assistant', text: questions[nextStep].q, type: 'options', options: questions[nextStep].opts }
                ]);
                setStep(nextStep);
            }, 500);
        } else {
            generateDiagnosis(newAns);
        }
    };

    const generateDiagnosis = async (finalAnswers) => {
        setLoad(true);
        setStep('loading');

        const context = finalAnswers.map((x, i) => `${i + 1}. ${x.q} R: ${x.a}`).join(`\n`);
        const prompt = `El estudiante se llama ${userName || 'Usuario'}. Evalúa estas respuestas al Test de Aprendizaje VAK:\n${context}\n\nActúa como un psicólogo experto en metodología VAK utilizando el siguiente rol: ${PROMPT_PSICOLOGO_VAK}. Dirígete a ${userName || 'el/la estudiante'} por su nombre de forma empática y motivadora. Su estado de ánimo inicial fue: "${feeling}". Dame un diagnóstico técnico pero fácil de entender. Incluye su estilo predominante, cómo funciona su cerebro para aprender, y 3 estrategias precisas para su tipo de aprendizaje.`;

        const r = await callDeepseek(prompt, "Experto Psicopedagogo. Responde estructurado con subtítulos y bullet points.", false);
        setRes(r);
        setLoad(false);
        setStep('result');
    };

    const reset = () => {
        setStep('intro-greeting'); 
        setFeeling(''); 
        setUserName(''); 
        setAnswers([]); 
        setRes('');
        setChatHistory([
            { role: 'assistant', text: '¡Hola! Soy Dani, tu guía de aprendizaje. Antes de empezar a descubrir tu estilo cognitivo...\n**¿Cómo te sientes hoy?**', type: 'text' }
        ]);
    };

    const handleSpeak = async () => { if (!res || speak) return; setSpeak(true); await speakTextConversational(res); setSpeak(false); };
    const handleCopy = () => {
        if (!res) return;
        navigator.clipboard.writeText(res).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const handleDownloadPDF = () => {
        if (!res) return;
        setPdfLoad(true);
        const container = document.createElement('div');
        container.style.padding = '40px';
        container.style.fontFamily = "'DM Sans', sans-serif";
        container.style.color = '#061322';
        container.style.background = '#ffffff';
        container.innerHTML = `
            <div style="border-bottom: 2px solid #0090B8; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0090B8, #00B8D4); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                    <h1 style="font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; margin: 0; color: #061322; letter-spacing: -0.04em;">EDUTECHLIFE</h1>
                    <p style="font-family: 'DM Mono', monospace; font-size: 10px; color: #0090B8; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">Inteligencia Analítica · Perfil Cognitivo</p>
                </div>
            </div>
            <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; color: #061322; margin-bottom: 8px;">Diagnóstico VAK Generado Para:</h2>
            <h3 style="font-family: 'Syne', sans-serif; font-size: 22px; color: #0090B8; margin-bottom: 20px; text-transform: capitalize;">${userName || 'Estudiante'}</h3>
            <div style="line-height: 1.6; font-size: 14px;" class="pdf-content">
                ${window.marked ? window.marked.parse(res) : res}
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-family: 'DM Mono', monospace; font-size: 10px; color: #6b7280; text-align: center;">
                Generado automáticamente por Dani (Diagnóstico VAK) — Test de 10 factores — ${new Date().toLocaleDateString('es-CO')}
            </div>`;
        const opt = { margin: 10, filename: `edutechlife-diagnostico-vak-${userName || 'test'}-${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        window.html2pdf().set(opt).from(container).save().then(() => setPdfLoad(false));
    };

    return (
        <div className="ai-panel" style={{ display: 'flex', flexDirection: 'column', height: '650px', maxHeight: '80vh', padding: '0', overflow: 'hidden' }}>
            <div className="ai-panel-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0, background: 'rgba(15,23,42,0.4)' }}>
                <div className="ai-panel-icon"><i className="fa-solid fa-brain-circuit" /></div>
                <span className="ai-panel-title">DANI PSICÓLOGO VAK</span>
                <div className="ai-panel-badge"><span className="ai-panel-badge-dot" />TEST DINÁMICO</div>
                
                <button 
                    onClick={toggleHandsFree}
                    style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
                        background: isHandsFree ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                        border: isHandsFree ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                        color: isHandsFree ? '#10B981' : 'rgba(255,255,255,0.7)',
                        padding: '6px 14px', borderRadius: '100px', fontSize: '10px',
                        fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '.1em',
                        cursor: 'pointer', transition: 'all 0.3s'
                    }}
                >
                    <i className="fa-solid fa-hands-bubbles" /> {isHandsFree ? 'Manos Libres : ON' : 'Manos Libres : OFF'}
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {chatHistory.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        {msg.role === 'assistant' && (
                            <div className={`valerio-avatar-ring ${isListening && idx === chatHistory.length - 1 ? 'listening' : ''}`} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                                <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '14px' }}></i>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{
                                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,.05)',
                                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,.1)',
                                borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                padding: '1rem 1.25rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                fontFamily: 'var(--font-body)'
                            }} dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parseInline(msg.text) : msg.text }} />

                            {msg.type === 'options' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                                    {msg.options.map((opt, i) => (
                                        <button key={i} onClick={() => handleAnswer(opt)} 
                                            style={{ textAlign: 'left', background: 'rgba(0,194,224,.1)', border: '1px solid rgba(0,194,224,.25)', padding: '10px 16px', borderRadius: '1rem', color: 'rgba(255,255,255,.9)', fontSize: '.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,194,224,.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,194,224,.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                                <i className="fa-solid fa-user" style={{ color: 'rgba(255,255,255,.7)', fontSize: '14px' }}></i>
                            </div>
                        )}
                    </div>
                ))}

                {load && step === 'loading' && (
                    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
                        <div className="valerio-avatar-ring thinking" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                            <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '14px' }}></i>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '1rem 1rem 1rem 0', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="ai-loading-bars" style={{ height: '20px' }}>
                                <span style={{height:'100%'}} /><span style={{height:'100%'}} /><span style={{height:'100%'}} />
                            </div>
                            <span style={{ color: 'var(--primary)', fontFamily: 'DM Mono', fontSize: '10px', textTransform: 'uppercase' }}>Analizando neuro-perfil...</span>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', width: '100%', paddingRight: '1rem' }}>
                        <div className="valerio-avatar-ring" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                            <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '14px' }}></i>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div className="ai-result" style={{ marginTop: 0, width: '100%' }}>
                                <div className="ai-result-topbar">
                                    <span className="ai-result-label">DIAGNÓSTICO VAK GENERADO</span>
                                    <div className="ai-result-actions">
                                        <button onClick={reset} className="ai-copy-btn" style={{ marginRight: 'auto' }}>
                                            <i className="fa-solid fa-rotate-right text-xs" />Reiniciar
                                        </button>
                                        <button onClick={handleCopy} className={`ai-copy-btn${copied ? ' copied' : ''}`}>
                                            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-xs`} />
                                            {copied ? 'Copiado' : 'Copiar'}
                                        </button>
                                        <button onClick={handleSpeak} className={`ai-audio-btn${speak ? ' speaking' : ''}`}>
                                            <i className={`fa-solid ${speak ? 'fa-waveform-lines' : 'fa-volume-high'} text-xs`} />{speak ? 'Hablando' : 'Audio'}
                                        </button>
                                        <button onClick={handleDownloadPDF} disabled={pdfLoad} style={{
                                            display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,rgba(0,194,224,.1),rgba(0,224,255,.05))',
                                            border: '1px solid rgba(0,194,224,.3)', color: 'var(--primary)', fontFamily: 'DM Mono', fontSize: '9px',
                                            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', padding: '6px 14px', borderRadius: '100px',
                                            cursor: 'pointer', transition: 'all .3s'
                                        }}>
                                            <i className={`fa-solid ${pdfLoad ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-xs`} />{pdfLoad ? 'Generando...' : 'PDF'}
                                        </button>
                                    </div>
                                </div>
                                <div className="ai-result-body" dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(res) : res }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default VAKTest;
