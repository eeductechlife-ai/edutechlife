import { memo, useState, useEffect, useRef } from 'react';

const Ecosystem = memo(({ onExplore }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handlePilarClick = (pilarId) => {
        onExplore(pilarId);
    };

    const pilares = [
        {
            id: 'neuroentorno',
            icon: 'fa-brain',
            title: 'NeuroEntornos Escolares',
            subtitle: 'Pilar 1',
            gradient: 'from-[#4DA8C4] to-[#004B63]',
            bgDark: true,
            desc: 'Diagnóstico VAK, IA Lab con Valerio, SmartBoard y herramientas neuropedagógicas.',
            stats: [
                { num: '6,000+', label: 'Estudiantes' },
                { num: '98%', label: 'Efectividad' }
            ]
        },
        {
            id: 'proyectos',
            icon: 'fa-laptop-code',
            title: 'Proyectos de Impacto Nacional',
            subtitle: 'Pilar 2',
            gradient: 'from-[#004B63] to-[#4DA8C4]',
            bgDark: false,
            desc: 'Proyectos SenaTIC, portafolio tecnológico y certificaciones.',
            stats: [
                { num: '500+', label: 'Proyectos' },
                { num: '50+', label: 'Tecnologías' }
            ]
        },
        {
            id: 'consultoria',
            icon: 'fa-handshake',
            title: 'Consultoría B2B y Automatización',
            subtitle: 'Pilar 3',
            gradient: 'from-[#4DA8C4] to-[#004B63]',
            bgDark: true,
            desc: 'Transformación digital, agentes IA personalizados y ROI garantizado.',
            stats: [
                { num: '100+', label: 'Instituciones' },
                { num: '3x', label: 'ROI Promedio' }
            ]
        }
    ];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#F8FAFC]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4DA8C4]/5 to-transparent blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#004B63]/5 to-transparent blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest">
                            Nuestros 3 Pilares
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004B63] mb-6">
                        Plataforma Integral
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]"> de Aprendizaje</span>
                    </h2>
                    <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                        Accede a un conjunto completo de herramientas diseñadas para transformar la educación con inteligencia artificial.
                    </p>
                </div>

                {/* 3 Pilares Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {pilares.map((pilar, index) => (
                        <button
                            key={pilar.id}
                            onClick={() => handlePilarClick(pilar.id)}
                            className={`group relative rounded-3xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-[#4DA8C4]/30 ${
                                pilar.bgDark 
                                    ? 'bg-gradient-to-br from-[#004B63] to-[#4DA8C4] text-white' 
                                    : 'bg-white shadow-xl'
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 rounded-3xl opacity-10">
                                <div 
                                    className="absolute inset-0" 
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 1px 1px, ${pilar.bgDark ? 'white' : '#004B63'} 1px, transparent 0)`,
                                        backgroundSize: '30px 30px'
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 ${
                                    pilar.bgDark 
                                        ? 'bg-white/20 backdrop-blur-sm' 
                                        : 'bg-gradient-to-br from-[#4DA8C4] to-[#004B63]'
                                }`}>
                                    <i className={`fa-solid ${pilar.icon} text-4xl text-white`} />
                                </div>

                                {/* Badge */}
                                <span className={`inline-block text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded-full ${
                                    pilar.bgDark 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-[#4DA8C4]/10 text-[#4DA8C4]'
                                }`}>
                                    {pilar.subtitle}
                                </span>

                                {/* Title */}
                                <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-colors ${
                                    pilar.bgDark ? 'text-white' : 'text-[#004B63]'
                                }`}>
                                    {pilar.title}
                                </h3>

                                {/* Description */}
                                <p className={`mb-6 text-sm leading-relaxed ${
                                    pilar.bgDark ? 'text-white/80' : 'text-[#64748B]'
                                }`}>
                                    {pilar.desc}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 mb-6">
                                    {pilar.stats.map((stat, sIndex) => (
                                        <div key={sIndex} className="text-center">
                                            <div className={`text-2xl font-black ${pilar.bgDark ? 'text-[#4DA8C4]' : 'text-[#4DA8C4]'}`}>
                                                {stat.num}
                                            </div>
                                            <div className={`text-xs uppercase tracking-wider ${pilar.bgDark ? 'text-white/60' : 'text-[#64748B]'}`}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className={`flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-4 ${
                                    pilar.bgDark ? 'text-[#4DA8C4]' : 'text-[#4DA8C4]'
                                }`}>
                                    <span>Explorar pilar</span>
                                    <i className="fa-solid fa-arrow-right text-sm" />
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${
                                pilar.bgDark 
                                    ? 'bg-gradient-to-br from-[#4DA8C4]/30 to-transparent' 
                                    : 'bg-[#4DA8C4]/20'
                            }`} />

                            {/* Shine Effect */}
                            <div 
                                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            >
                                <div 
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                                        animation: 'shine-sweep 3s ease-in-out infinite'
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <button 
                        onClick={() => handlePilarClick('ialab')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#4DA8C4] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#004B63] hover:shadow-xl hover:scale-105"
                    >
                        <i className="fa-solid fa-rocket" />
                        <span>Comenzar ahora</span>
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes shine-sweep {
                    0% { transform: translateX(-100%); }
                    50%, 100% { transform: translateX(200%); }
                }
            `}</style>
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
