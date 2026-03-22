import { memo, useEffect, useState, useRef } from 'react';

const Aliados = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scannerPosition, setScannerPosition] = useState(0);
    const sectionRef = useRef(null);
    const scannerRef = useRef(null);

    const aliados = [
        { 
            name: 'SENA', 
            icon: 'fa-graduation-cap', 
            color: '#F97316',
            description: 'Servicio Nacional de Aprendizaje'
        },
        { 
            name: 'UNESCO', 
            icon: 'fa-landmark', 
            color: '#3B82F6',
            description: 'Educación de calidad mundial'
        },
        { 
            name: 'Ministerio', 
            icon: 'fa-university', 
            color: '#EF4444',
            description: 'Educación Nacional'
        },
        { 
            name: 'Google', 
            icon: 'fa-search', 
            color: '#4285F4',
            description: 'Google for Education'
        },
        { 
            name: 'Microsoft', 
            icon: 'fa-microsoft', 
            color: '#00A4EF',
            description: 'Microsoft Education'
        },
        { 
            name: 'AWS', 
            icon: 'fa-cloud', 
            color: '#FF9900',
            description: 'Amazon Web Services'
        },
        { 
            name: 'ICETEX', 
            icon: 'fa-hand-holding-dollar', 
            color: '#22C55E',
            description: 'Financiamiento Educativo'
        },
        { 
            name: 'Colciencias', 
            icon: 'fa-flask', 
            color: '#8B5CF6',
            description: 'Ciencia y Tecnología'
        },
        { 
            name: 'Apple', 
            icon: 'fa-apple-whole', 
            color: '#64748B',
            description: 'Apple Education'
        },
        { 
            name: 'STEAM', 
            icon: 'fa-gears', 
            color: '#14B8A6',
            description: 'Educación STEAM'
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % aliados.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animateScanner = () => {
            let position = 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                position = progress * 100;
                setScannerPosition(position);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        };

        const scannerInterval = setInterval(animateScanner, 3000);
        animateScanner();

        return () => clearInterval(scannerInterval);
    }, []);

    const trustBadges = [
        { icon: 'fa-award', text: 'Certificaciones Internacionales' },
        { icon: 'fa-shield-halved', text: 'Estándares de Calidad' },
        { icon: 'fa-globe', text: 'Alcance Global' }
    ];

    return (
        <section ref={sectionRef} className="relative w-full py-20 lg:py-32 overflow-hidden">
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(77,168,196,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_50%,rgba(0,75,99,0.05)_0%,transparent_50%),#F8FAFC]" />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* LEFT: Cinematic Carousel */}
                    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        {/* Carousel Container */}
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                            {/* Background */}
                            <div className="absolute inset-0 bg-[#0B0F19]" />
                            
                            {/* Ken Burns Images */}
                            {aliados.map((aliado, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-[1500ms] ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#004B63]/90 via-[#0B0F19]/80 to-[#0B0F19]/60 z-10" />
                                    
                                    {/* Icon Background with Ken Burns Effect */}
                                    <div 
                                        className={`absolute inset-0 flex items-center justify-center ${index === currentSlide ? 'animate-ken-burns' : ''}`}
                                        style={{
                                            background: `radial-gradient(circle at center, ${aliado.color}20 0%, transparent 70%)`
                                        }}
                                    >
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${aliado.color}30, ${aliado.color}10)`,
                                                boxShadow: `0 0 80px ${aliado.color}40`
                                            }}
                                        >
                                            <i 
                                                className={`fa-solid ${aliado.icon} text-6xl md:text-7xl`}
                                                style={{ color: aliado.color }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
                                        <span 
                                            className="text-xs font-mono font-semibold uppercase tracking-[0.3em] mb-2 px-4 py-1 rounded-full"
                                            style={{ 
                                                color: aliado.color,
                                                backgroundColor: `${aliado.color}20`,
                                                border: `1px solid ${aliado.color}40`
                                            }}
                                        >
                                            Partner
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-black text-white mt-4 text-center">
                                            {aliado.name}
                                        </h3>
                                        <p className="text-white/60 mt-2 text-center font-mono text-sm">
                                            {aliado.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Scanner Line Effect */}
                            <div 
                                ref={scannerRef}
                                className="absolute top-0 bottom-0 w-[2px] z-30 pointer-events-none"
                                style={{
                                    left: `${scannerPosition}%`,
                                    background: 'linear-gradient(180deg, transparent 0%, #66CCCC 20%, #4DA8C4 50%, #66CCCC 80%, transparent 100%)',
                                    boxShadow: '0 0 20px #66CCCC, 0 0 40px #4DA8C4, 0 0 60px rgba(77,168,196,0.5)'
                                }}
                            >
                                {/* Scanner Glow Dots */}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#66CCCC] animate-pulse" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#66CCCC] animate-pulse" />
                            </div>

                            {/* Scan Line */}
                            <div 
                                className="absolute left-0 right-0 h-[1px] z-30 pointer-events-none"
                                style={{
                                    top: `${scannerPosition}%`,
                                    background: 'linear-gradient(90deg, transparent 0%, #66CCCC 50%, transparent 100%)',
                                    boxShadow: '0 0 10px #66CCCC'
                                }}
                            />

                            {/* Corner Brackets - Computed Vision Style */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#4DA8C4]/50 z-20" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#4DA8C4]/50 z-20" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#4DA8C4]/50 z-20" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#4DA8C4]/50 z-20" />

                            {/* Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B0F19]/80 to-transparent z-20 flex items-center px-4 gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#66CCCC] animate-pulse" />
                                <span className="text-[#66CCCC] font-mono text-[10px] tracking-wider">
                                    VISION.SYS // SCANNING
                                </span>
                            </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {aliados.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        index === currentSlide 
                                            ? 'w-8 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]' 
                                            : 'w-4 bg-[#004B63]/20 hover:bg-[#4DA8C4]/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Text Content */}
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Header */}
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                            <span className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest font-mono">
                                Confían en nosotros
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-[#004B63] mb-6 leading-tight">
                            Nuestros{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                Aliados Estratégicos
                            </span>
                        </h2>
                        
                        <p className="text-lg text-[#64748B] mb-10 leading-relaxed">
                            Las mejores instituciones y empresas tecnológicas del mundo trabajan con nosotros 
                            para garantizar una formación de excelencia que prepara profesionales 
                            competitivos a nivel global.
                        </p>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            {trustBadges.map((badge, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-md border border-[#E2E8F0] hover:shadow-lg hover:border-[#4DA8C4]/30 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <i className={`fa-solid ${badge.icon} text-white text-lg`} />
                                    </div>
                                    <span className="text-sm font-semibold text-[#334155]">{badge.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-8 pt-6 border-t border-[#E2E8F0]">
                            <div className="text-center">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                    50+
                                </div>
                                <div className="text-sm font-mono text-[#64748B] uppercase tracking-wider mt-1">
                                    Aliados
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                    10+
                                </div>
                                <div className="text-sm font-mono text-[#64748B] uppercase tracking-wider mt-1">
                                    Años
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                    Global
                                </div>
                                <div className="text-sm font-mono text-[#64748B] uppercase tracking-wider mt-1">
                                    Alcance
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ken Burns Animation */}
            <style>{`
                @keyframes ken-burns {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(1.1);
                    }
                }
                .animate-ken-burns {
                    animation: ken-burns 4s ease-out forwards;
                }
            `}</style>
        </section>
    );
});

Aliados.displayName = 'Aliados';

export default Aliados;
