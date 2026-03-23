import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import GlobalCanvas from './components/GlobalCanvas';
import IALab from './components/IALab';
import Hero from './components/Hero';
import Metodo from './components/Metodo';
import Esencia from './components/Esencia';
import Ecosystem from './components/Ecosystem';
import Aliados from './components/Aliados';
import Footer from './components/Footer';
import NeuroEntorno from './components/NeuroEntorno';
import ProyectosNacional from './components/ProyectosNacional';
import Consultoria from './components/Consultoria';
import ConsultoriaB2B from './components/ConsultoriaB2B';
import AutomationArchitect from './components/AutomationArchitect';
import SmartBoardDashboard from './components/SmartBoardDashboard';
import SmartBoardLogin from './components/SmartBoardLogin';
import DiagnosticoVAK from './components/DiagnosticoVAK';
import VAKTest from './components/VAKTest';
import AdminLoginModal from './components/AdminLoginModal';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';

const CustomCursor = () => {
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
            const target = e.target;
            const isClickable = target.closest('a') !== null || 
                                target.closest('button') !== null ||
                                target.closest('[role="button"]') !== null;
            setIsHovering(isClickable);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    // Show only when moving (if needed) but generally track
    return (
        <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999999]">
            <div 
                id="custom-cursor-dot" 
                className={isHovering ? 'cursor-hovered-dot' : ''}
                style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            />
            <div 
                id="custom-cursor-ring" 
                className={isHovering ? 'cursor-hovered-ring' : ''}
                style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            />
        </div>
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
            window.scrollTo(0, 0);
        };
        window.addEventListener('navigate', handleNavigate);
        
        // Lenis setup
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        return () => {
            window.removeEventListener('navigate', handleNavigate);
            lenis.destroy();
        };
    }, []);

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
        <div className="min-h-screen flex flex-col bg-transparent text-[#334155]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <GlobalCanvas />
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
                    >
                        <img 
                            src="/images/logo-edutechlife.webp" 
                            alt="Edutechlife" 
                            className="h-6 w-auto transition-all duration-300 group-hover:opacity-80"
                            style={{ maxHeight: '24px', width: 'auto' }}
                        />
                    </button>
                </div>
            </header>
            )}

            {/* Main Content */}
            <main className="flex-grow">
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
                
                {/* Diagnóstico VAK - Versión conversacional con Dani */}
                {view === 'vak' && <VAKTest onNavigate={handleNavigate} />}
                
                {/* Versión simple (backup) */}
                {view === 'vak-simple' && <DiagnosticoVAK onNavigate={handleNavigate} />}
                
                {/* Admin Dashboard - Protected */}
                {view === 'admin' && adminAuthenticated && (
                    <AdminDashboard onLogout={handleAdminLogout} onBack={() => handleNavigate('landing')} />
                )}
            </main>

            {/* Floating Chatbot - Solo en páginas principales, no en Admin, VAK, IALab */}
            {view !== 'smartboard' && view !== 'vak' && view !== 'ialab' && view !== 'admin' && (
                <div className="chatbot-container">
                    {botOpen && (
                        <div className="chatbot-window bg-white border border-[#E2E8F0] shadow-neuro">
                            <div className="chatbot-header bg-[#F8FAFC] border-b border-[#E2E8F0] shadow-sm">
                                <div className="chatbot-avatar relative">
                                    <div className="absolute inset-[-4px] rounded-full border-[1.5px] border-[#4DA8C4] animate-[pulse-ring_3s_infinite]" />
                                    <i className="fa-solid fa-robot relative z-10 text-white"></i>
                                </div>
                                <span className="font-montserrat font-bold tracking-wide text-[#004B63]">Nico AI</span>
                                <button onClick={() => setBotOpen(false)} className="chatbot-close hover:bg-[#4DA8C4]/10 transition-colors">
                                    <i className="fa-solid fa-xmark text-[#004B63]"></i>
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
                                <button onClick={handleBotSend}>
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        className="chatbot-toggle btn-glow shadow-neuro bg-white text-[#4DA8C4]"
                        onClick={() => setBotOpen(!botOpen)} 
                    >
                        <i className={`fa-solid ${botOpen ? 'fa-xmark' : 'fa-comment-dots'}`}></i>
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
