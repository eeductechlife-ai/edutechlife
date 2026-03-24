import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sun, Moon, Bot, X, Send, MessageCircle } from 'lucide-react';
const GlobalCanvas = lazy(() => import('./components/GlobalCanvas'));
const IALab = lazy(() => import('./components/IALab'));
import Hero from './components/Hero';
import Metodo from './components/Metodo';
import Esencia from './components/Esencia';
import Ecosystem from './components/Ecosystem';
import Aliados from './components/Aliados';
import Footer from './components/Footer';
const NeuroEntorno = lazy(() => import('./components/NeuroEntorno'));
const ProyectosNacional = lazy(() => import('./components/ProyectosNacional'));
const Consultoria = lazy(() => import('./components/Consultoria'));
const ConsultoriaB2B = lazy(() => import('./components/ConsultoriaB2B'));
const AutomationArchitect = lazy(() => import('./components/AutomationArchitect'));
const SmartBoardDashboard = lazy(() => import('./components/SmartBoardDashboard'));
const SmartBoardLogin = lazy(() => import('./components/SmartBoardLogin'));
const DiagnosticoVAK = lazy(() => import('./components/DiagnosticoVAK'));
const VAKTest = lazy(() => import('./components/VAKTest'));
const VAKDiagnostic = lazy(() => import('./components/VAKDiagnostic'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import AdminLoginModal from './components/AdminLoginModal';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';
import { NICO_KNOWLEDGE_BASE } from './utils/knowledgeBase';

/* ==================== PREMIUM CURSOR - ZERO LATENCY ==================== */
/* Núcleo decursor maneja por CSS nativo - 0ms latencia */
/* Aura visual con GPU acceleration - solo elementos interactivos */
const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 500, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    
    const isHovering = useMotionValue(0);
    const scaleTransform = useSpring(1, springConfig);
    
    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        
        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive')) {
                isHovering.set(1);
            }
        };
        
        const handleMouseOut = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive')) {
                isHovering.set(0);
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mouseout', handleMouseOut, { passive: true });
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const current = isHovering.get();
            scaleTransform.set(current === 1 ? 1.5 : 1);
        }, 16);
        return () => clearInterval(interval);
    }, [isHovering, scaleTransform]);

    return (
        <motion.div
            className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
        >
            <motion.div
                className="absolute w-8 h-8 rounded-full border-2 border-[#004B63]/60 pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: scaleTransform,
                    backgroundColor: 'rgba(77, 168, 196, 0.15)',
                    willChange: 'transform',
                }}
            />
            <motion.div
                className="absolute w-2 h-2 rounded-full bg-[#4DA8C4] pointer-events-none"
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                    willChange: 'transform',
                }}
            />
        </motion.div>
    );
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('landing');
    const [smartboardAuthenticated, setSmartboardAuthenticated] = useState(false);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
    const [botOpen, setBotOpen] = useState(false);
    const [botMsgs, setBotMsgs] = useState([{ 
        role: 'assistant', 
        text: 'Hola, soy Nico. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
    }]);
    const [botInput, setBotInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const botMsgsEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechSynthesisRef = useRef(null);

    const scrollToBottom = () => {
        botMsgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (botOpen) scrollToBottom();
    }, [botMsgs, botOpen]);

    useEffect(() => {
        const handleNavigate = (e) => {
            setView(e.detail);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('navigate', handleNavigate);
        
        return () => {
            window.removeEventListener('navigate', handleNavigate);
        };
    }, []);

    // Dark mode effect
    useEffect(() => {
        const storedTheme = localStorage.getItem('edutechlife-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('edutechlife-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('edutechlife-theme', 'light');
        }
    };

    const handleBotSend = async () => {
        if (!botInput.trim()) return;
        const userMsg = botInput;
        setBotInput('');
        setBotMsgs(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
        setBotLoading(true);

        const systemPrompt = `Eres Nico, agente de atención al cliente de Edutechlife con más de 15 años de experiencia. 

Tu estilo de atención al cliente es exactamente como el de un agente telefónico profesional:
- Amable, empático y muy profesional
- Hablas como en una llamada telefónica, fluido y natural
- NUNCA uses emojis, emoticones, asteriscos, guiones bajos ni ningún tipo de signo raro
- Tus respuestas son en texto plano, limpio y profesional
- Resumes la información clave de forma clara y concisa
- Validas los sentimientos del cliente y demuestras empatía genuina
- Hablas en español neutro, claro y muy comprensible
- Das respuestas cortas y directas, como en una llamada telefónica

Para responder a las preguntas, básate ÚNICA Y EXCLUSIVAMENTE en la siguiente base de conocimientos. Si el usuario pregunta algo que no está en este texto, responde amablemente que no tienes esa información exacta pero que con gusto puedes conectar con un asesor humano.

--- BASE DE CONOCIMIENTOS OFICIAL ---
${NICO_KNOWLEDGE_BASE}
-------------------------------------`;
        const contextMessages = botMsgs.map(m => `${m.role === 'assistant' ? 'Nico' : 'Usuario'}: ${m.text}`).join('\n');
        const prompt = `${contextMessages}\nUsuario: ${userMsg}\nNico:`;

        try {
            const r = await callDeepseek(prompt, systemPrompt, false);
            const cleanResponse = r.replace(/[*_~`]/g, '').replace(/:\w+:/g, '');
            setBotMsgs(prev => [...prev, { role: 'assistant', text: cleanResponse, timestamp: new Date() }]);
        } catch (error) {
            setBotMsgs(prev => [...prev, { role: 'assistant', text: 'Disculpa, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo en un momento?', timestamp: new Date() }]);
        }
        setBotLoading(false);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Tu navegador no soporta reconocimiento de voz');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'es-CO';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setBotInput(transcript);
        };

        recognitionRef.current.onerror = () => {
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CO';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleNavigate = useCallback(v => {
        setView(v);
        window.scrollTo(0, 0);
    }, []);

    const handleSmartboardLogin = useCallback((user) => {
        setSmartboardAuthenticated(true);
        setView('smartboard');
    }, []);

    const handleSmartboardLogout = useCallback(() => {
        setSmartboardAuthenticated(false);
        setView('landing');
    }, []);

    const handleAdminLogin = useCallback(() => {
        setAdminAuthenticated(true);
        setAdminLoginModalOpen(false);
        setView('admin');
    }, []);

    const handleAdminLogout = useCallback(() => {
        setAdminAuthenticated(false);
        setView('landing');
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Suspense fallback={null}>
                <GlobalCanvas />
            </Suspense>
            <CustomCursor />
            
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={3000} />
            )}

            {/* Header - Navigation Premium - Hidden on SmartBoard, IALab and Admin */}
            {view !== 'smartboard' && view !== 'ialab' && view !== 'admin' && (
                <header className="sticky top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
                    <div className="container-premium flex items-center justify-between py-3">
                    {/* Logo Premium */}
                    <button 
                        onClick={() => handleNavigate('landing')}
                        className="flex items-center group"
                        aria-label="Ir al inicio"
                    >
                        <img 
                            src="/images/logo-edutechlife.webp" 
                            alt="Edutechlife" 
                            className="h-6 w-auto transition-all duration-300 group-hover:opacity-80"
                            style={{ maxHeight: '24px', width: 'auto' }}
                        />
                    </button>
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </header>
            )}

            {/* Main Content */}
            <main className="flex-grow">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#4DA8C4] border-t-transparent rounded-full animate-spin"></div></div>}>
                    {view === 'landing' && (
                         <>
                            <Hero onNavigate={handleNavigate} />
                            <Esencia />
                            <Ecosystem onNavigate={handleNavigate} />
                            <Metodo />
                            <Aliados />
                        </>
                    )}

                    {/* Pillar Pages */}
                    {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
                    {view === 'neuroentorno' && <NeuroEntorno onBack={() => handleNavigate('landing')} onNavigate={handleNavigate} />}
                    {view === 'proyectos' && <ProyectosNacional onBack={() => handleNavigate('landing')} />}
                    {view === 'consultoria' && <Consultoria onBack={() => handleNavigate('landing')} />}
                    {view === 'consultoria-b2b' && <ConsultoriaB2B onBack={() => handleNavigate('landing')} />}
                    {view === 'automation' && <AutomationArchitect onBack={() => handleNavigate('landing')} />}
                    
                    {/* SmartBoard - Con Login */}
                    {view === 'smartboard' && !smartboardAuthenticated && (
                        <SmartBoardLogin onLogin={handleSmartboardLogin} />
                    )}
                    {view === 'smartboard' && smartboardAuthenticated && (
                        <SmartBoardDashboard onNavigate={handleNavigate} onLogout={handleSmartboardLogout} />
                    )}
                    
                    {/* Diagnóstico VAK - Nuevo componente premium */}
                    {view === 'vak' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    {view === 'vak-simple' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    {view === 'vak-premium' && (
                        <Suspense fallback={<div>Cargando Diagnóstico VAK Premium...</div>}>
                            <VAKDiagnostic onNavigate={handleNavigate} />
                        </Suspense>
                    )}
                    
                    {/* Admin Dashboard - Protected */}
                    {view === 'admin' && adminAuthenticated && (
                        <AdminDashboard onLogout={handleAdminLogout} onBack={() => handleNavigate('landing')} />
                    )}
                </Suspense>
            </main>

            {/* Floating Chatbot - Solo en páginas principales, no en Admin, VAK, IALab */}
            {view !== 'smartboard' && view !== 'vak' && view !== 'ialab' && view !== 'admin' && (
                <>
                    {botOpen && (
                        <div className="chatbot-window">
                            <div className="chatbot-header">
                                <div className="chatbot-avatar">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="chatbot-header-info">
                                    <div className="chatbot-header-name">Nico - Asesor Virtual</div>
                                    <div className="chatbot-header-status">En línea</div>
                                </div>
                                <button onClick={() => setBotOpen(false)} className="chatbot-close">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="chatbot-messages">
                                {botMsgs.map((msg, i) => (
                                    <div key={i} className={`chatbot-msg ${msg.role}`}>
                                        <div className="chatbot-msg-content">{msg.text}</div>
                                        <div className="chatbot-msg-time">
                                            {msg.timestamp ? msg.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                        {msg.role === 'assistant' && (
                                            <button 
                                                className="chatbot-msg-audio" 
                                                onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                                                title={isSpeaking ? 'Detener' : 'Escuchar'}
                                            >
                                                {isSpeaking ? <X className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {botLoading && (
                                    <div className="chatbot-loading">
                                        <div className="chatbot-loading-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <span className="chatbot-loading-text">Nico está escribiendo...</span>
                                    </div>
                                )}
                                <div ref={botMsgsEndRef} />
                            </div>
                            <div className="chatbot-input">
                                <button 
                                    className={`chatbot-btn chatbot-btn-voice ${isListening ? 'listening' : ''}`}
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? 'Detener' : 'Hablar'}
                                >
                                    {isListening ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                                </button>
                                <div className="chatbot-input-field">
                                    <input 
                                        type="text" 
                                        value={botInput} 
                                        onChange={(e) => setBotInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                                        placeholder="Escribe tu mensaje..."
                                        disabled={botLoading}
                                    />
                                </div>
                                <button 
                                    className="chatbot-btn chatbot-btn-send" 
                                    onClick={handleBotSend}
                                    disabled={!botInput.trim() || botLoading}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        className="chatbot-toggle"
                        onClick={() => setBotOpen(!botOpen)} 
                        aria-label={botOpen ? 'Cerrar chat' : 'Hablar con Nico'}
                    >
                        {botOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                        <span>{botOpen ? 'Cerrar' : 'Hablar con Nico'}</span>
                    </button>
                </>
            )}
            {/* Footer - Solo se muestra en páginas principales, no en SmartBoard, VAK, IALab ni Admin */}
            {view !== 'smartboard' && view !== 'vak' && view !== 'ialab' && view !== 'admin' && <Footer />}

            {/* Admin Login Modal */}
            <AdminLoginModal 
                isOpen={adminLoginModalOpen}
                onClose={() => setAdminLoginModalOpen(false)}
                onLogin={handleAdminLogin}
            />
        </div>
    );
};

export default App;
