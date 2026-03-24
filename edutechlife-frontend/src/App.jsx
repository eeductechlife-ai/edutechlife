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
        text: '¡Hola! Soy Nico, tu asistente virtual de Edutechlife. ¿En qué te puedo ayudar hoy?' 
    }]);
    const [botInput, setBotInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const botMsgsEndRef = useRef(null);

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
        setBotMsgs(prev => [...prev, { role: 'user', text: userMsg }]);
        setBotLoading(true);

        const systemPrompt = "Eres Nico, el asistente de soporte de Edutechlife. Eres amable, profesional y ayudas a los usuarios (posibles clientes o estudiantes) a entender la plataforma o resolver dudas breves. Tienes toda la experiencia y la sabiduría para guiar en temas de pedagogía con inteligencia artificial, metodologías VAK y STEAM.";
        const contextMessages = botMsgs.map(m => `${m.role === 'assistant' ? 'Nico' : 'Usuario'}: ${m.text}`).join('\n');
        const prompt = `${contextMessages}\nUsuario: ${userMsg}\nNico:`;

        try {
            const r = await callDeepseek(prompt, systemPrompt, false);
            setBotMsgs(prev => [...prev, { role: 'assistant', text: r }]);
        } catch (error) {
            setBotMsgs(prev => [...prev, { role: 'assistant', text: 'Lo siento, estoy experimentando dificultades técnicas. Por favor intenta de nuevo en unos momentos.' }]);
        }
        setBotLoading(false);
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
                <div className="chatbot-container">
                    {botOpen && (
                        <div className="chatbot-window bg-white border border-[#E2E8F0] shadow-neuro">
                            <div className="chatbot-header bg-[#F8FAFC] border-b border-[#E2E8F0] shadow-sm">
                                <div className="chatbot-avatar relative">
                                    <div className="absolute inset-[-4px] rounded-full border-[1.5px] border-[#4DA8C4] animate-[pulse-ring_3s_infinite]" />
                                    <Bot className="relative z-10 text-white w-5 h-5" />
                                </div>
                                <span className="font-montserrat font-bold tracking-wide text-[#004B63]">Nico AI</span>
                                <button onClick={() => setBotOpen(false)} className="chatbot-close hover:bg-[#4DA8C4]/10 transition-colors">
                                    <X className="w-5 h-5 text-[#004B63]" />
                                </button>
                            </div>
                            <div className="chatbot-messages">
                                {botMsgs.map((msg, i) => (
                                    <div key={i} className={`chatbot-msg ${msg.role}`}>
                                        {msg.text}
                                    </div>
                                ))}
                                {botLoading && (
                                    <div className="chatbot-loading">
                                        <MiniLoader size="sm" color="white" />
                                    </div>
                                )}
                                <div ref={botMsgsEndRef} />
                            </div>
                            <div className="chatbot-input">
                                <input 
                                    type="text" 
                                    value={botInput} 
                                    onChange={(e) => setBotInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                                    placeholder="Escribe un mensaje..."
                                />
                                <button onClick={handleBotSend} aria-label="Enviar mensaje">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        className="chatbot-toggle btn-glow shadow-neuro bg-white text-[#4DA8C4]"
                        onClick={() => setBotOpen(!botOpen)} 
                        aria-label={botOpen ? 'Cerrar chat' : 'Abrir chat'}
                    >
                        {botOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                    </button>
                </div>
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
