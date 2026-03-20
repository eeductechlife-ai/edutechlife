import { useState, useEffect, useRef, useCallback } from 'react';
import IALab from './components/IALab';
import Hero from './components/Hero';
import AllianceMarquee from './components/AllianceMarquee';
import StatsBar from './components/StatsBar';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import ProcessSection from './components/ProcessSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import NeuroEntorno from './components/NeuroEntorno';
import ProyectosNacional from './components/ProyectosNacional';
import Consultoria from './components/Consultoria';
import Ecosystem from './components/Ecosystem';
import LoadingScreen, { MiniLoader } from './components/LoadingScreen';
import { callDeepseek } from './utils/api';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('landing');
    const [botOpen, setBotOpen] = useState(false);
    const [botMsgs, setBotMsgs] = useState([{ role: 'assistant', text: '¡Hola! Soy Nico, tu asistente virtual de Edutechlife. ¿En qué te puedo ayudar hoy?' }]);
    const [botInput, setBotInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const pilaresRef = useRef(null);
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
        window.scrollTo(0, 0);
    }, []);

    const handleScrollToPilares = useCallback(() => {
        pilaresRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    const pilarData = [
        {
            id: 1,
            num: '01',
            title: 'NEURO-ENTORNO EDUCATIVO',
            desc: 'IA que analiza procesos psicológicos y académicos en tiempo real para cada estudiante. Acompañamiento integral basado en metodologías VAK y STEAM.',
            icon: 'fa-brain',
            img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800',
            view: 'neuroentorno'
        },
        {
            id: 2,
            num: '02',
            title: 'PROYECTOS DE IMPACTO NACIONAL',
            desc: 'Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera.',
            icon: 'fa-award',
            img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800',
            view: 'proyectos'
        },
        {
            id: 3,
            num: '03',
            title: 'CONSULTORÍA B2B Y AUTOMATIZACIÓN',
            desc: 'Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.',
            icon: 'fa-building',
            img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
            view: 'consultoria'
        },
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: '#FFFFFF', color: '#4A4A4A', fontFamily: "'Open Sans', sans-serif" }}>
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={3000} />
            )}

            {/* Header - Premium Navigation */}
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-b border-[rgba(0,75,99,0.08)]">
                <div className="max-w-7xl mx-auto px-5% py-4 flex items-center justify-between">
                    {/* Logo */}
                    <button 
                        onClick={() => handleNavigate('landing')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4)' }}>
                            <i className="fa-solid fa-graduation-cap text-white text-lg" />
                        </div>
                        <span className="font-montserrat font-bold text-lg text-[#004B63] tracking-tight">
                            EDUTECHLIFE
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-medium text-[#4A4A4A] hover:text-[#004B63] transition-colors">
                            Inicio
                        </button>
                        <button onClick={() => pilaresRef.current?.scrollIntoView({ behavior: 'smooth' })} className="font-medium text-[#4A4A4A] hover:text-[#004B63] transition-colors">
                            Pilares
                        </button>
                        <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="font-medium text-[#4A4A4A] hover:text-[#004B63] transition-colors">
                            Precios
                        </button>
                        <button onClick={() => handleNavigate('ialab')} className="font-medium text-[#4A4A4A] hover:text-[#004B63] transition-colors">
                            IA Lab
                        </button>
                    </nav>

                    {/* CTA Button */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleNavigate('ialab')}
                            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full font-montserrat font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                            style={{ 
                                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                                boxShadow: '0 4px 15px rgba(77, 168, 196, 0.3)'
                            }}
                        >
                            Comenzar
                            <i className="fa-solid fa-arrow-right text-xs" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ paddingTop: '0' }}>
                {view === 'landing' && (
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {/* Hero Section */}
                        <Hero 
                            onNavigateToLab={() => handleNavigate('ialab')}
                            onScrollToPilares={handleScrollToPilares}
                        />

                        {/* Alliance Marquee */}
                        <AllianceMarquee />

                        {/* Stats Bar */}
                        <StatsBar />

                        {/* About Section */}
                        <About />

                        {/* Ecosystem Section - Premium v2286 */}
                        <Ecosystem />

                        {/* Pilares Section - v2286 Premium */}
                        <section ref={pilaresRef} className="pilares-section">
                            <div className="pilares-header">
                                <div className="pilares-kicker">Líneas de Impacto · VAK + STEAM</div>
                                <h2 className="pilares-title">Nuestro <span>Ecosistema</span></h2>
                                <p className="pilares-subtitle">
                                    Seis líneas de impacto diseñadas por Magísteres en Educación. Cada pilar aplica metodología VAK y STEAM con las herramientas de IA más avanzadas del mercado.
                                </p>
                            </div>

                            <div className="pilares-grid">
                                {pilarData.map((pilar) => (
                                    <div 
                                        key={pilar.id} 
                                        className="pilar-card-v2286"
                                        onClick={() => handleNavigate(pilar.view)}
                                    >
                                        <span className="pilar-card-number">{pilar.num}</span>
                                        <div className="pilar-card-image">
                                            <img src={pilar.img} alt={pilar.title} />
                                            <div className="pilar-card-overlay" />
                                        </div>
                                        <div className="pilar-card-content">
                                            <div className="pilar-card-icon">
                                                <i className={`fa-solid ${pilar.icon}`}></i>
                                            </div>
                                            <h3 className="pilar-card-title">{pilar.title}</h3>
                                            <p className="pilar-card-desc">{pilar.desc}</p>
                                            <span className="pilar-card-cta">
                                                EXPLORAR <i className="fa-solid fa-arrow-right" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Testimonials */}
                        <Testimonials />

                        {/* Process Section */}
                        <ProcessSection />

                        {/* Pricing Section */}
                        <div id="pricing">
                            <Pricing />
                        </div>

                        {/* Final CTA */}
                        <FinalCTA onNavigate={handleNavigate} />

                        {/* Footer */}
                        <Footer />
                    </div>
                )}

                {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
                {view === 'neuroentorno' && <NeuroEntorno onBack={() => handleNavigate('landing')} />}
                {view === 'proyectos' && <ProyectosNacional onBack={() => handleNavigate('landing')} />}
                {view === 'consultoria' && <Consultoria onBack={() => handleNavigate('landing')} />}
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
        </div>
    );
};

export default App;
