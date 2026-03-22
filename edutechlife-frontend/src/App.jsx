import { useState, useEffect, useRef, useCallback } from 'react';
import IALab from './components/IALab';
import Hero from './components/Hero';
import Metodo from './components/Metodo';
import Esencia from './components/Esencia';
import Ecosystem from './components/Ecosystem';
import Aliados from './components/Aliados';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import NeuroEntorno from './components/NeuroEntorno';
import ProyectosNacional from './components/ProyectosNacional';
import Consultoria from './components/Consultoria';
import ConsultoriaB2B from './components/ConsultoriaB2B';
import AutomationArchitect from './components/AutomationArchitect';
import SmartBoardDashboard from './components/SmartBoardDashboard';
import SmartBoardLogin from './components/SmartBoardLogin';
import DiagnosticoVAK from './components/DiagnosticoVAK';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('landing');
    const [smartboardAuthenticated, setSmartboardAuthenticated] = useState(false);
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
        return () => window.removeEventListener('navigate', handleNavigate);
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

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#334155]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={3000} />
            )}

            {/* Header - Navigation Premium */}
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

                    {/* CTA Button Premium */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleNavigate('smartboard')}
                            className="flex items-center gap-2 px-5 py-2 rounded-full font-display font-bold text-sm text-white transition-all duration-300 hover:opacity-90"
                            style={{ 
                                background: 'linear-gradient(135deg, #66CCCC, #4DA8C4)',
                                boxShadow: '0 4px 15px rgba(102, 204, 204, 0.3)'
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <i className="fa-solid fa-graduation-cap text-xs" />
                                SmartBoard
                            </span>
                        </button>
                        <button 
                            onClick={() => handleNavigate('ialab')}
                            className="flex items-center gap-2 px-5 py-2 rounded-full font-display font-bold text-sm text-white transition-all duration-300 hover:opacity-90"
                            style={{ 
                                background: 'linear-gradient(135deg, #4DA8C4, #004B63)',
                                boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)'
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <i className="fa-solid fa-rocket text-xs" />
                                Comenzar
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {view === 'landing' && (
                     <>
                        <Hero onNavigate={handleNavigate} />
                        <Esencia />
                        <Ecosystem onNavigate={handleNavigate} />
                        <Metodo />
                        <Aliados />
                        <FinalCTA onNavigate={handleNavigate} />
                    </>
                )}

                {/* Pillar Pages */}
                {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
                {view === 'neuroentorno' && <NeuroEntorno onBack={() => handleNavigate('landing')} />}
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
                
                {/* VAK Test - Fuera del SmartBoard */}
                {view === 'vak' && <DiagnosticoVAK onNavigate={handleNavigate} />}
            </main>

            {/* Floating Chatbot - Solo en páginas principales */}
            {view !== 'smartboard' && view !== 'vak' && (
                <div className="chatbot-container">
                    {botOpen && (
                        <div className="chatbot-window">
                            <div className="chatbot-header">
                                <div className="chatbot-avatar">
                                    <i className="fa-solid fa-robot"></i>
                                </div>
                                <span>Nico</span>
                                <button onClick={() => setBotOpen(false)} className="chatbot-close">
                                    <i className="fa-solid fa-xmark"></i>
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
                        className="chatbot-toggle"
                        onClick={() => setBotOpen(!botOpen)} 
                    >
                        <i className={`fa-solid ${botOpen ? 'fa-xmark' : 'fa-comment-dots'}`}></i>
                    </button>
                </div>
            )}
            {/* Footer - Solo se muestra en páginas principales, no en SmartBoard ni VAK */}
            {view !== 'smartboard' && view !== 'vak' && <Footer />}
        </div>
    );
};

export default App;
