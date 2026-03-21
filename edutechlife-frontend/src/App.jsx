import { useState, useEffect, useRef, useCallback } from 'react';
import IALab from './components/IALab';
import Hero from './components/Hero';
import AllianceMarquee from './components/AllianceMarquee';
import StatsBar from './components/StatsBar';
import About from './components/About';
import Ecosystem from './components/Ecosystem';
import ProcessSection from './components/ProcessSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import NeuroEntorno from './components/NeuroEntorno';
import ProyectosNacional from './components/ProyectosNacional';
import Consultoria from './components/Consultoria';
import AutomationArchitect from './components/AutomationArchitect';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('landing');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF', color: '#4A4A4A', fontFamily: "'Open Sans', sans-serif" }}>
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={3000} />
            )}

            {/* Header - Navigation Premium */}
            <header className="sticky top-0 left-0 right-0 z-[1000] glass-light border-b border-white/20 shadow-sm">
                    <div className="container-premium flex items-center justify-between py-3">
                    {/* Logo Premium */}
                    <button 
                        onClick={() => handleNavigate('landing')}
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative">
                            <div className="absolute -inset-3 bg-gradient-to-r from-[#4DA8C4]/20 to-[#66CCCC]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img 
                                src="/images/logo-edutechlife.webp" 
                                alt="Edutechlife" 
                                className="h-9 w-auto relative z-10"
                                style={{ maxHeight: '36px', width: 'auto' }}
                            />
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-display font-bold text-[#0A1628] tracking-tight">EDUTECHLIFE</div>
                            <div className="text-xs font-mono text-[#4DA8C4] font-medium">v2286</div>
                        </div>
                    </button>

                    {/* Desktop Navigation Premium */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { label: 'Inicio', action: () => handleNavigate('landing'), icon: 'fa-home' },
                            { label: 'Líneas de Impacto', action: () => scrollToSection('ecosystem'), icon: 'fa-chart-line' },
                            { label: 'Neuro-Entorno', action: () => handleNavigate('neuroentorno'), icon: 'fa-brain' },
                            { label: 'Consultoría', action: () => handleNavigate('consultoria'), icon: 'fa-handshake' },
                            { label: 'Arquitecto IA', action: () => handleNavigate('automation'), icon: 'fa-robot' }
                        ].map((item, index) => (
                            <button 
                                key={index}
                                onClick={item.action}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#475569] hover:text-[#004B63] transition-all duration-300 relative group/nav rounded-lg hover:bg-white/50"
                            >
                                <i className={`fa-solid ${item.icon} text-xs text-[#4DA8C4]`} />
                                <span>{item.label}</span>
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] group-hover/nav:w-3/4 transition-all duration-300 rounded-full" />
                            </button>
                        ))}
                    </nav>

                    {/* CTA & Utils Premium */}
                    <div className="flex items-center gap-3">
                        {/* AI Status Premium */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/20 rounded-full">
                            <div className="relative">
                                <div className="w-2 h-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full animate-ping opacity-30" />
                            </div>
                            <span className="text-xs font-mono font-semibold text-[#004B63]">IA: ONLINE</span>
                        </div>

                        {/* CTA Button Premium */}
                        <button 
                            onClick={() => handleNavigate('ialab')}
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-sm text-white transition-all duration-300 hover-lift hover-glow"
                            style={{ 
                                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                                boxShadow: '0 6px 20px rgba(77, 168, 196, 0.3)'
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <i className="fa-solid fa-rocket text-xs" />
                                Comenzar
                                <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>

                        {/* Mobile Menu Button Premium */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-[#475569] hover:text-[#004B63] hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Premium */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass-light border-t border-white/20 px-6 py-4">
                        <nav className="flex flex-col gap-1">
                            {[
                                { label: 'Inicio', action: () => handleNavigate('landing'), icon: 'fa-home' },
                                { label: 'Líneas de Impacto', action: () => scrollToSection('ecosystem'), icon: 'fa-chart-line' },
                                { label: 'Neuro-Entorno', action: () => handleNavigate('neuroentorno'), icon: 'fa-brain' },
                                { label: 'Consultoría', action: () => handleNavigate('consultoria'), icon: 'fa-handshake' },
                                { label: 'Arquitecto IA', action: () => handleNavigate('automation'), icon: 'fa-robot' }
                            ].map((item, index) => (
                                <button 
                                    key={index}
                                    onClick={item.action}
                                    className="flex items-center gap-3 px-4 py-3 text-left text-[#475569] hover:text-[#004B63] hover:bg-white/50 rounded-lg transition-colors"
                                >
                                    <i className={`fa-solid ${item.icon} text-sm text-[#4DA8C4] w-5`} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/10">
                                <button 
                                    onClick={() => handleNavigate('ialab')}
                                    className="w-full px-6 py-3 rounded-full font-display font-bold text-sm text-white transition-all duration-300 hover-lift"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                                        boxShadow: '0 6px 20px rgba(77, 168, 196, 0.3)'
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-rocket text-xs" />
                                        Comenzar Ahora
                                        <i className="fa-solid fa-arrow-right text-xs" />
                                    </span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {view === 'landing' && (
                     <>
                        <Hero 
                          onNavigateToLab={() => handleNavigate('neuroentorno')}
                          onScrollToPilares={() => scrollToSection('ecosystem')}
                        />
                        <AllianceMarquee />
                        <StatsBar />
                        <About />
                        <Ecosystem onExplore={handleNavigate} />
                        <ProcessSection />
                        <FinalCTA onNavigate={handleNavigate} />
                    </>
                )}

                {/* Pillar Pages */}
                {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
                {view === 'neuroentorno' && <NeuroEntorno onBack={() => handleNavigate('landing')} />}
                {view === 'proyectos' && <ProyectosNacional onBack={() => handleNavigate('landing')} />}
                {view === 'consultoria' && <Consultoria onBack={() => handleNavigate('landing')} />}
                {view === 'automation' && <AutomationArchitect onBack={() => handleNavigate('landing')} />}
            </main>

            {/* Floating Chatbot */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {botOpen && (
                    <div style={{ background: '#0B0F19', border: '1px solid rgba(0,194,224,0.3)', borderRadius: '1rem', width: '350px', height: '450px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #004B63, #4DA8C4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-robot" style={{ color: 'white', fontSize: '0.9rem' }}></i>
                                </div>
                                <span style={{ fontWeight: 600, color: 'white' }}>Nico</span>
                            </div>
                            <button onClick={() => setBotOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {botMsgs.map((msg, i) => (
                                <div key={i} style={{ 
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                                    maxWidth: '80%',
                                    background: msg.role === 'user' ? '#4DA8C4' : 'rgba(255,255,255,0.1)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.9rem',
                                    color: 'white'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {botLoading && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MiniLoader size="sm" color="white" />
                                </div>
                            )}
                            <div ref={botMsgsEndRef} />
                        </div>
                        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                value={botInput} 
                                onChange={(e) => setBotInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBotSend()}
                                placeholder="Escribe un mensaje..."
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '0.75rem 1rem', color: 'white', outline: 'none' }}
                            />
                            <button onClick={handleBotSend} style={{ background: '#4DA8C4', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer' }}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => setBotOpen(!botOpen)} 
                    style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1.3rem', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(77,168,196,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <i className={`fa-solid ${botOpen ? 'fa-xmark' : 'fa-comment-dots'}`}></i>
                </button>
            </div>
            {/* Footer moved outside main to ensure sticky footer effect */}
            <Footer />
        </div>
    );
};

export default App;
