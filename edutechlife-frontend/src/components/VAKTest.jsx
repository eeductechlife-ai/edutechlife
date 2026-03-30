import { useState, useEffect, useRef } from 'react';
import { PROMPT_PSICOLOGO_VAK } from '../constants/prompts';
import { getQuestionsByAge } from '../constants/vakData';
import { callDeepseek } from '../utils/api';
import { speakTextConversational, iniciarReconocimiento } from '../utils/speech';

const VAKTest = ({ onNavigate }) => {
    const [step, setStep] = useState('intro-greeting');
    const [feeling, setFeeling] = useState('');
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [answers, setAnswers] = useState([]);
    const [res, setRes] = useState('');
    const [load, setLoad] = useState(false);
    const [speak, setSpeak] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pdfLoad, setPdfLoad] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [autoVoice, setAutoVoice] = useState(true);
    
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: 'Hola, soy Dani, psicóloga de Edutechlife y experta en diagnóstico VAK. Para empezar, ¿cuál es tu nombre?', type: 'text' }
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

    useEffect(() => {
        const lastMsg = chatHistory[chatHistory.length - 1];
        if (autoVoice && lastMsg && lastMsg.role === 'assistant' && !speakingRef.current && !isHandsFree) {
            speakingRef.current = true;
            let textToSpeak = lastMsg.text;
            if (lastMsg.type === 'options' && lastMsg.options) {
                const optionsText = lastMsg.options.map((opt, i) => 
                    `${opt.letra || String.fromCharCode(65 + i)}: ${opt.text}`
                ).join(', o ');
                textToSpeak += ". Opciones: " + optionsText;
            }
            
            speakTextConversational(textToSpeak, 'valeria', () => {
                speakingRef.current = false;
            });
        }
    }, [chatHistory, autoVoice, isHandsFree]);

    const [questions, setQuestions] = useState([]);

    const handleHandsFreeTranscription = (transcript) => {
        if (!transcript.trim()) return;
        
        const currentStep = stepRef.current;
        if (currentStep === 'intro-greeting') {
            handleNameSubmit(transcript);
        } else if (currentStep === 'ask-mood') {
            handleMoodSubmit(transcript);
        } else if (currentStep === 'ask-age') {
            handleAgeSubmit(transcript);
        } else if (currentStep === 'test-active') {
            const currentQuestionIndex = answers.length;
            if (currentQuestionIndex < questions.length) {
                const qObj = questions[currentQuestionIndex];
                if (!qObj) return;

                const spoken = transcript.toLowerCase();
                let selectedIndex = -1;

                if (spoken.match(/\b(a|uno|primera|primero)\b/)) selectedIndex = 0;
                else if (spoken.match(/\b(b|dos|segunda|segundo)\b/)) selectedIndex = 1;
                else if (spoken.match(/\b(c|tres|tercera|tercero)\b/)) selectedIndex = 2;
                else if (spoken.match(/\b(d|cuatro|cuarta|cuarto)\b/)) selectedIndex = 3;
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

                if (selectedIndex !== -1 && qObj.options[selectedIndex]) {
                    handleAnswer(qObj.options[selectedIndex]);
                } else {
                    setChatHistory(prev => [...prev, { role: 'assistant', text: "No te entendí bien, ¿puedes repetir tu respuesta?", type: 'text' }]);
                    speakTextConversational("No te entendí bien, ¿puedes repetir tu respuesta?", 'valeria', () => {
                        if (isHandsFreeRef.current) iniciarReconocimiento(handleHandsFreeInput, handleHandsFreeTranscription, setIsListening);
                    });
                }
            }
        }
    };
    
    const handleHandsFreeInput = (transcript) => {
        const currentStep = stepRef.current;
        if (currentStep === 'intro-greeting') {
            setUserName(transcript);
        } else if (currentStep === 'ask-mood') {
            setFeeling(transcript);
        } else if (currentStep === 'ask-age') {
            setUserAge(transcript);
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
                    const optionsText = lastMsg.options.map((opt, i) => 
                        `${opt.letra || String.fromCharCode(65 + i)}: ${opt.text}`
                    ).join(', o ');
                    text += ". Opciones: " + optionsText;
                }
                speakTextConversational(text, 'valeria', () => {
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
                const optionsText = lastMsg.options.map((opt, i) => 
                    `${opt.letra || String.fromCharCode(65 + i)}: ${opt.text}`
                ).join(', o ');
                textToSpeak += ". Opciones: " + optionsText;
            }
            speakTextConversational(textToSpeak, 'valeria', () => {
                speakingRef.current = false;
                if (isHandsFreeRef.current && stepRef.current !== 'result' && stepRef.current !== 'loading') {
                    iniciarReconocimiento(handleHandsFreeInput, handleHandsFreeTranscription, setIsListening);
                }
            });
        }
    }, [chatHistory]);

    const handleNameSubmit = (overrideText) => {
        const finalUserName = typeof overrideText === 'string' ? overrideText : userName;
        if (!finalUserName.trim()) return;
        setChatHistory(prev => [
            ...prev, 
            { role: 'user', text: finalUserName },
            { role: 'assistant', text: `¡Mucho gusto, ${finalUserName}! Cuéntame, ¿cómo te sientes el día de hoy?`, type: 'text' }
        ]);
        setUserName(finalUserName);
        setStep('ask-mood');
    };

    const handleMoodSubmit = (overrideText) => {
        const finalFeeling = typeof overrideText === 'string' ? overrideText : feeling;
        if (!finalFeeling.trim()) return;
        
        let feedback = "¡Entendido! Vamos a hacer que este test sea súper dinámico.";
        if (finalFeeling.toLowerCase().includes('bien') || finalFeeling.toLowerCase().includes('feliz') || finalFeeling.toLowerCase().includes('content')) {
            feedback = "¡Me alegra que te sientas bien! Vamos a hacer que este test sea súper dinámico.";
        } else if (finalFeeling.toLowerCase().includes('mal') || finalFeeling.toLowerCase().includes('triste') || finalFeeling.toLowerCase().includes('cansad')) {
            feedback = "Entiendo cómo te sientes. Este test te ayudará a descubrir tu mejor forma de aprender. ¡Vamos a hacerlo dinámico!";
        } else if (finalFeeling.toLowerCase().includes('nervios') || finalFeeling.toLowerCase().includes('ansied')) {
            feedback = "No te preocupes, es normal sentirse así. Este test es muy amigable y te ayudará a conocerte mejor. ¡Vamos a hacerlo dinámico!";
        }
        
        setChatHistory(prev => [
            ...prev, 
            { role: 'user', text: finalFeeling },
            { role: 'assistant', text: `${feedback} ¿Cuántos años tienes? Así podré hacerte las preguntas adecuadas para ti.`, type: 'text' }
        ]);
        setFeeling(finalFeeling);
        setStep('ask-age');
    };

    const handleAgeSubmit = (overrideText) => {
        const finalAge = typeof overrideText === 'string' ? overrideText : userAge;
        if (!finalAge.trim()) return;
        
        const ageNum = parseInt(finalAge);
        if (isNaN(ageNum) || ageNum < 8 || ageNum > 16) {
            setChatHistory(prev => [
                ...prev, 
                { role: 'user', text: finalAge },
                { role: 'assistant', text: 'Por favor ingresa una edad válida entre 8 y 16 años.', type: 'text' }
            ]);
            return;
        }
        
        const ageQuestions = getQuestionsByAge(ageNum);
        setQuestions(ageQuestions);
        setUserAge(finalAge);
        
        setChatHistory(prev => [
            ...prev, 
            { role: 'user', text: finalAge },
            { role: 'assistant', text: '¡Perfecto! Empecemos con la primera pregunta.', type: 'text' }
        ]);
        
        setTimeout(() => {
            if (ageQuestions.length > 0) {
                const firstQuestion = ageQuestions[0];
                setChatHistory(prev => [
                    ...prev,
                    { role: 'assistant', text: firstQuestion.text, type: 'options', options: firstQuestion.options }
                ]);
                setStep('test-active');
            }
        }, 800);
    };

    const handleAnswer = (opt) => {
        const currentQuestionIndex = answers.length;
        if (currentQuestionIndex >= questions.length) return;
        
        const currentQuestion = questions[currentQuestionIndex];
        const newAns = [...answers, { q: currentQuestion.text, a: opt.text, type: opt.type }];
        setAnswers(newAns);
        
        setChatHistory(prev => {
            const newHist = [...prev];
            if (newHist[newHist.length - 1].type === 'options') {
                newHist[newHist.length - 1].type = 'text';
                delete newHist[newHist.length - 1].options;
            }
            newHist.push({ role: 'user', text: opt.text });
            return newHist;
        });

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                const nextQuestion = questions[currentQuestionIndex + 1];
                setChatHistory(prev => [
                    ...prev,
                    { role: 'assistant', text: nextQuestion.text, type: 'options', options: nextQuestion.options }
                ]);
            }, 500);
        } else {
            generateDiagnosis(newAns);
        }
    };

    const generateDiagnosis = async (finalAnswers) => {
        setLoad(true);
        setStep('loading');

        const farewellMessage = `¡Excelente trabajo, ${userName || 'amigo/a'}! He terminado de analizar tu perfil cognitivo. En la pantalla tienes tus resultados, por favor descárgalos en PDF. ¡Un abrazo!`;
        
        setChatHistory(prev => [
            ...prev,
            { role: 'assistant', text: farewellMessage, type: 'text' }
        ]);

        if (autoVoice) {
            speakTextConversational(farewellMessage, 'valeria');
        }

        const context = finalAnswers.map((x, i) => `${i + 1}. ${x.q} R: ${x.a}`).join(`\n`);
        const prompt = `El estudiante se llama ${userName || 'Usuario'}. Tiene ${userAge || 'edad no especificada'} años. Evalúa estas respuestas al Test de Aprendizaje VAK:\n${context}\n\nActúa como un psicólogo experto en metodología VAK utilizando el siguiente rol: ${PROMPT_PSICOLOGO_VAK}. Dirígete a ${userName || 'el/la estudiante'} por su nombre de forma empática y motivadora. Su estado de ánimo inicial fue: "${feeling}". Dame un diagnóstico técnico pero fácil de entender. Incluye su estilo predominante, cómo funciona su cerebro para aprender, y 3 estrategias precisas para su tipo de aprendizaje.`;

        const r = await callDeepseek(prompt, "Experto Psicopedagogo. Responde estructurado con subtítulos y bullet points.", false);
        setRes(r);
        setLoad(false);
        setStep('result');
    };

    const reset = () => {
        setStep('intro-greeting'); 
        setFeeling(''); 
        setUserName(''); 
        setUserAge('');
        setQuestions([]);
        setAnswers([]); 
        setRes('');
        setChatHistory([
            { role: 'assistant', text: 'Hola, soy Dani, psicóloga de Edutechlife y experta en diagnóstico VAK. Para empezar, ¿cuál es tu nombre?', type: 'text' }
        ]);
    };

    const handleSpeak = async () => { if (!res || speak) return; setSpeak(true); await speakTextConversational(res, 'valeria'); setSpeak(false); };
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

    const progressPercentage = questions.length > 0 ? (answers.length / questions.length) * 100 : 0;

    return (
        <div className="ai-panel" style={{ display: 'flex', flexDirection: 'column', height: '650px', maxHeight: '80vh', padding: '0', overflow: 'hidden', background: '#0A1628' }}>
            <style>
                {`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes loading-bar {
                    0%, 100% { transform: scaleY(0.3); }
                    50% { transform: scaleY(1); }
                }
                .valerio-avatar-ring.listening {
                    animation: pulse 1s infinite;
                    box-shadow: 0 0 20px rgba(77, 168, 196, 0.8);
                }
                .valerio-avatar-ring.thinking {
                    animation: pulse 1.5s infinite;
                }
                `}
            </style>
            <div className="ai-panel-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)' }}>
                <div className="ai-panel-icon"><i className="fa-solid fa-brain-circuit" /></div>
                <span className="ai-panel-title">DANI PSICÓLOGO VAK</span>
                <div className="ai-panel-badge"><span className="ai-panel-badge-dot" />TEST DINÁMICO</div>
                
                <button 
                    onClick={() => setAutoVoice(!autoVoice)}
                    style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
                        background: autoVoice ? 'rgba(0,194,224,0.1)' : 'rgba(255,255,255,0.05)',
                        border: autoVoice ? '1px solid #00C2E0' : '1px solid rgba(255,255,255,0.1)',
                        color: autoVoice ? '#00C2E0' : 'rgba(255,255,255,0.7)',
                        padding: '6px 14px', borderRadius: '100px', fontSize: '10px',
                        fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '.1em',
                        cursor: 'pointer', transition: 'all 0.3s'
                    }}
                >
                    <i className={`fa-solid ${autoVoice ? 'fa-volume-high' : 'fa-volume-xmark'}`} /> {autoVoice ? 'Voz : ON' : 'Voz : OFF'}
                </button>
                
                <button 
                    onClick={toggleHandsFree}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
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

            {step === 'test-active' && questions.length > 0 && (
                <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#66CCCC', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            PROGRESO DEL TEST
                        </span>
                        <span style={{ fontSize: '12px', color: '#4DA8C4', fontWeight: 'bold' }}>
                            {answers.length} / {questions.length}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                            style={{ 
                                width: `${progressPercentage}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, #4DA8C4, #66CCCC)',
                                borderRadius: '4px',
                                transition: 'width 0.5s ease-in-out',
                                boxShadow: '0 0 10px rgba(77, 168, 196, 0.5)'
                            }}
                        />
                    </div>
                </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#0A1628' }}>
                {chatHistory.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                         {msg.role === 'assistant' && (
                            <div className={`valerio-avatar-ring ${isListening && idx === chatHistory.length - 1 ? 'listening' : ''}`} style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: '50%', 
                                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                flexShrink: 0, 
                                marginTop: '4px',
                                border: '1px solid rgba(102, 204, 204, 0.5)',
                                boxShadow: '0 2px 10px rgba(77, 168, 196, 0.4)'
                            }}>
                                <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '14px' }}></i>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{
                                background: msg.role === 'user' 
                                    ? 'linear-gradient(135deg, #004B63, #4DA8C4)' 
                                    : 'rgba(15,23,42,0.6)',
                                border: msg.role === 'user' 
                                    ? 'none' 
                                    : '1px solid #4DA8C4',
                                borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                padding: '1rem 1.25rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                fontFamily: 'var(--font-body)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: msg.role === 'user' 
                                    ? '0 4px 20px rgba(0, 75, 99, 0.3)' 
                                    : '0 4px 20px rgba(77, 168, 196, 0.2)'
                            }} dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parseInline(msg.text) : msg.text }} />

                             {msg.type === 'options' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                                     {msg.options.map((opt, i) => (
                                        <button key={i} onClick={() => handleAnswer(opt)} 
                                            style={{ 
                                                textAlign: 'left', 
                                                background: 'rgba(15,23,42,0.7)', 
                                                border: '1px solid #4DA8C4', 
                                                padding: '14px 20px', 
                                                borderRadius: '1rem', 
                                                color: 'white', 
                                                fontSize: '0.95rem', 
                                                cursor: 'pointer', 
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '16px',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: '0 4px 15px rgba(77, 168, 196, 0.2)'
                                            }}
                                            onMouseEnter={e => { 
                                                e.currentTarget.style.background = 'rgba(77, 168, 196, 0.2)'; 
                                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; 
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 168, 196, 0.4), 0 0 0 2px rgba(102, 204, 204, 0.3)';
                                                e.currentTarget.style.borderColor = '#66CCCC';
                                            }}
                                            onMouseLeave={e => { 
                                                e.currentTarget.style.background = 'rgba(15,23,42,0.7)'; 
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(77, 168, 196, 0.2)';
                                                e.currentTarget.style.borderColor = '#4DA8C4';
                                            }}
                                        >
                                            <span style={{ 
                                                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', 
                                                color: 'white', 
                                                width: '32px', 
                                                height: '32px', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                fontSize: '14px', 
                                                fontWeight: 'bold', 
                                                flexShrink: 0,
                                                boxShadow: '0 2px 8px rgba(77, 168, 196, 0.5)'
                                            }}>
                                                {opt.letra || String.fromCharCode(65 + i)}
                                            </span>
                                            <span style={{ flex: 1, textAlign: 'left', fontWeight: '500' }}>{opt.text}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: '50%', 
                                background: 'linear-gradient(135deg, #004B63, #4DA8C4)', 
                                border: '1px solid rgba(77, 168, 196, 0.5)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                flexShrink: 0, 
                                marginTop: '4px',
                                boxShadow: '0 2px 10px rgba(0, 75, 99, 0.3)'
                            }}>
                                <i className="fa-solid fa-user" style={{ color: 'white', fontSize: '14px' }}></i>
                            </div>
                        )}
                    </div>
                ))}

                {load && step === 'loading' && (
                    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
                        <div className="valerio-avatar-ring thinking" style={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0, 
                            marginTop: '4px',
                            border: '1px solid rgba(102, 204, 204, 0.5)',
                            boxShadow: '0 2px 10px rgba(77, 168, 196, 0.4)',
                            animation: 'pulse 1.5s infinite'
                        }}>
                            <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '14px' }}></i>
                        </div>
                        <div style={{ 
                            background: 'rgba(15,23,42,0.6)', 
                            border: '1px solid #4DA8C4', 
                            borderRadius: '1rem 1rem 1rem 0', 
                            padding: '1rem 1.25rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 20px rgba(77, 168, 196, 0.2)'
                        }}>
                            <div className="ai-loading-bars" style={{ height: '20px' }}>
                                <span style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4DA8C4, #66CCCC)',
                                    borderRadius: '2px',
                                    animation: 'loading-bar 1.5s infinite ease-in-out'
                                }} />
                                <span style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4DA8C4, #66CCCC)',
                                    borderRadius: '2px',
                                    animation: 'loading-bar 1.5s infinite ease-in-out 0.2s'
                                }} />
                                <span style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4DA8C4, #66CCCC)',
                                    borderRadius: '2px',
                                    animation: 'loading-bar 1.5s infinite ease-in-out 0.4s'
                                }} />
                            </div>
                            <span style={{ color: '#66CCCC', fontFamily: 'DM Mono', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>ANALIZANDO NEURO-PERFIL...</span>
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
