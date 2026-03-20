import { useState, useEffect, useRef, useCallback } from 'react';
import VAKTest from './components/VAKTest';
import IALab from './components/IALab';
import AIPanel from './components/AIPanel';
import Hero from './components/Hero';
import AllianceMarquee from './components/AllianceMarquee';
import StatsBar from './components/StatsBar';
import { callDeepseek } from './utils/api';

const App = () => {
    const [view, setView] = useState('landing');
    const [botOpen, setBotOpen] = useState(false);
    const [botMsgs, setBotMsgs] = useState([{ role: 'assistant', text: '¡Hola! Soy Nico, tu asistente virtual. ¿En qué te puedo ayudar hoy?' }]);
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

        const systemPrompt = "Eres Nico, el asistente de soporte de Edutechlife. Eres amable, usas emojis y ayudas a los usuarios (posibles clientes o estudiantes) a entender la plataforma o resolver dudas breves. Tienes toda la experiencia y la sabiduría para guiar en temas de pedagogía con inteligencia artificial.";
        const contextMessages = botMsgs.map(m => `${m.role === 'assistant' ? 'Nico' : 'Usuario'}: ${m.text}`).join('\n');
        const prompt = `${contextMessages}\nUsuario: ${userMsg}\nNico:`;

        const r = await callDeepseek(prompt, systemPrompt, false);

        setBotMsgs(prev => [...prev, { role: 'assistant', text: r }]);
        setBotLoading(false);
    };

    const handleNavigate = useCallback(v => {
        setView(v);
        window.scrollTo(0, 0);
    }, []);

    const handleScrollToPilares = useCallback(() => {
        pilaresRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const pilarData = [
        {
            id: 1,
            num: '01',
            title: 'NEURO-ENTORNO EDUCATIVO',
            desc: 'Acompañamiento integral basado en metodologías VAK y STEAM. Docentes con maestría analizan procesos psicológicos y académicos para potenciar cada estilo de aprendizaje con herramientas de IA personalizadas.',
            icon: 'fa-children',
            img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800'
        },
        {
            id: 2,
            num: '02',
            title: 'PROYECTOS DE IMPACTO NACIONAL',
            desc: 'Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera. Maestros que forman maestros: más de 200 docentes colombianos transformados en líderes digitales.',
            icon: 'fa-award',
            img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800'
        },
        {
            id: 3,
            num: '03',
            title: 'CONSULTORÍA B2B Y AUTOMATIZACIÓN',
            desc: 'Transformamos organizaciones educativas y empresas con metodología STEAM aplicada. Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.',
            icon: 'fa-building',
            img: 'https://images.unsplash.com/photo-1664575600796-ffa828c5cb6e?q=80&w=800'
        },
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, #171131 0%, #070B14 100%)', backgroundAttachment: 'fixed', color: 'white', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7, 11, 20, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-graduation-cap" style={{ color: 'white', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>EDUTECHLIFE</span>
                </div>
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <button onClick={() => handleNavigate('landing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.9rem' }}>Inicio</button>
                    <button onClick={() => handleNavigate('ialab')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.9rem' }}>IA Lab</button>
                </nav>
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

                        {/* Pilares Section */}
                        <section ref={pilaresRef} id="pilares" style={{ padding: '6rem 5%' }}>
                            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
                                Nuestros <span style={{ color: '#0EA5E9' }}>Pilares</span>
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                {pilarData.map((pilar, idx) => (
                                    <div key={pilar.id} className="relative overflow-hidden rounded-2xl bg-white border border-[#B2D8E5]/50 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group flex flex-col">
                                        
                                        {/* Contenedor de la Imagen */}
                                        <div className="w-full h-56 overflow-hidden bg-gray-100">
                                            <img 
                                                src={pilar.img} 
                                                alt={pilar.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Contenedor del Texto - BLANCO PURO Y SIN MORADO */}
                                        <div className="p-8 bg-white flex-1 relative z-10">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#F0F8FA] flex items-center justify-center text-[#4DA8C4] group-hover:bg-[#4DA8C4] group-hover:text-white transition-colors duration-300">
                                                    <i className={`fa-solid ${pilar.icon} text-xl`}></i>
                                                </div>
                                                <span className="text-3xl font-black text-[#F0F8FA] drop-shadow-sm group-hover:text-[#B2D8E5] transition-colors">{pilar.num}</span>
                                            </div>
                                            
                                            <h3 className="text-[#004B63] font-bold text-xl mb-3 leading-tight">
                                                {pilar.title}
                                            </h3>
                                            
                                            <div className="w-10 h-1 bg-[#66CCCC] rounded-full mb-4 transition-all duration-300 group-hover:w-20"></div>
                                            
                                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                                {pilar.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {view === 'ialab' && <IALab onBack={() => handleNavigate('landing')} />}
            </main>

            {/* Floating Chatbot */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {botOpen && (
                    <div style={{ background: '#0B0F19', border: '1px solid rgba(0,194,224,0.3)', borderRadius: '1rem', width: '350px', height: '450px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    background: msg.role === 'user' ? '#4F46E5' : 'rgba(255,255,255,0.1)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.9rem'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {botLoading && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '1rem' }}>
                                    <i className="fa-solid fa-ellipsis" style={{ animation: 'pulse 1s infinite' }}></i>
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
                            <button onClick={handleBotSend} style={{ background: '#4F46E5', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer' }}>
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
                        background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1.3rem', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
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
