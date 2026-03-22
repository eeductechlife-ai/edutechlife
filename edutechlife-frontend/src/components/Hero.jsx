import { memo, useEffect, useState, useRef } from 'react';

const useAnimatedCounter = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!start) return;
        
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOut * target));
            
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        
        frameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [start, target, duration]);

    return count;
};

const AnimatedStat = ({ value, label, icon, gradient, start, delay, index }) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    const count = useAnimatedCounter(numericValue, 1800 + index * 200, start);
    
    return (
        <div 
            className={`group relative bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl px-6 py-5 min-w-[160px] transition-all duration-700 ${start ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 left-4 right-4 h-1 rounded-b-full bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <i className={`fa-solid ${icon} text-xl text-white`} />
            </div>
            
            <div className="text-3xl md:text-4xl font-black text-[#004B63] leading-none mb-1 tabular-nums">
                {count.toLocaleString()}{suffix}
            </div>
            
            <div className="text-sm font-medium text-[#64748B]">
                {label}
            </div>
            
            <div className="absolute -top-1 -right-1 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66CCCC] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#66CCCC]" />
            </div>
        </div>
    );
};

const Hero = memo(({ onNavigate }) => {
    const [mounted, setMounted] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                }
            },
            { threshold: 0.2 }
        );
        
        if (statsRef.current) {
            observer.observe(statsRef.current);
        }
        
        return () => observer.disconnect();
    }, []);

    const stats = [
        { 
            value: '6000', 
            suffix: '+', 
            label: 'Estudiantes', 
            icon: 'fa-users',
            gradient: 'from-[#4DA8C4] to-[#004B63]'
        },
        { 
            value: '98', 
            suffix: '%', 
            label: 'Tasa de Éxito', 
            icon: 'fa-trophy',
            gradient: 'from-[#004B63] to-[#4DA8C4]'
        },
        { 
            value: '10', 
            suffix: '+', 
            label: 'Años de Experiencia', 
            icon: 'fa-clock',
            gradient: 'from-[#4DA8C4] to-[#004B63]'
        }
    ];

    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden">
            {/* Light Void Background - Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFFFF_0%,#F8FAFC_70%,#B2D8E5_100%)]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.3]" style={{
                backgroundImage: `
                    linear-gradient(#B2D8E5 1px, transparent 1px),
                    linear-gradient(90deg, #B2D8E5 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }} />

            {/* Hero Orbs - Energy Balls */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#4DA8C4]/20 blur-3xl animate-orb-1" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#004B63]/15 blur-3xl animate-orb-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#66CCCC]/10 blur-3xl animate-orb-3" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Typography */}
                    <div className={`text-center lg:text-left transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4DA8C4]/10 rounded-full mb-8 border border-[#4DA8C4]/20">
                            <span className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-[#004B63]">Innovación Educativa con IA</span>
                        </div>

                        {/* Main Title with Gradient */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#004B63] to-[#4DA8C4]">
                                Pedagogía
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                de Élite
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-[#334155] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Transformamos la educación con{' '}
                            <span className="font-semibold text-[#4DA8C4]">metodologías de vanguardia</span>{' '}
                            y el poder de la IA para formar profesionales del futuro.
                        </p>

                        {/* Stats Premium Cards - Animated Counters */}
                        <div ref={statsRef} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                            {stats.map((stat, index) => (
                                <AnimatedStat 
                                    key={index}
                                    {...stat}
                                    start={statsVisible}
                                    delay={index * 150}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4DA8C4] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-[#004B63] hover:shadow-[0_0_25px_rgba(77,168,196,0.5)] hover:scale-105"
                            >
                                <i className="fa-solid fa-rocket text-lg" />
                                <span className="text-lg">Explorar IA Lab</span>
                                <i className="fa-solid fa-arrow-right text-lg transition-transform duration-300 group-hover:translate-x-2" />
                            </button>
                            <button 
                                onClick={() => onNavigate('consultoria')}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#004B63] font-bold rounded-full border-2 border-[#4DA8C4]/30 transition-all duration-300 hover:border-[#4DA8C4] hover:shadow-xl hover:scale-105"
                            >
                                <i className="fa-solid fa-handshake text-lg text-[#4DA8C4]" />
                                <span className="text-lg">Consultoría B2B</span>
                            </button>
                        </div>
                    </div>

                    {/* Right - Dashboard Visual */}
                    <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Glassmorphism Panel */}
                        <div className="relative bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#4DA8C4]" />
                                    <span className="font-bold text-[#004B63]">Edutechlife AI</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/50" />
                                </div>
                            </div>

                            {/* AI Chat Preview */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-robot text-white text-sm" />
                                    </div>
                                    <div className="bg-white/60 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                        <p className="text-sm font-mono text-[#334155]">
                                            ¡Hola! Soy Valerio. ¿En qué tema necesitas ayuda hoy?
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="bg-[#4DA8C4]/10 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                        <p className="text-sm font-mono text-[#334155]">
                                            Explícame el método VAK
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-robot text-white text-sm" />
                                    </div>
                                    <div className="bg-white/60 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                                        <p className="text-sm font-mono text-[#334155] leading-relaxed">
                                            El método VAK identifica tu estilo de aprendizaje: Visual, Auditivo o Kinestésico...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Live Indicators */}
                            <div className="flex items-center justify-between border-t border-[#4DA8C4]/20 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono text-[#334155]">IA Activa</span>
                                </div>
                                <div className="text-xs font-mono text-[#64748B]">
                                    Respuesta en &lt;1s
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#4DA8C4]/20 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center animate-float">
                            <i className="fa-solid fa-brain text-2xl text-[#4DA8C4]" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#004B63]/20 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center animate-float-delayed">
                            <i className="fa-solid fa-graduation-cap text-xl text-[#004B63]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
