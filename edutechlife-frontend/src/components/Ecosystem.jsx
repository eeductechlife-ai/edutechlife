import { memo, useState, useEffect, useRef } from 'react';

const Ecosystem = memo(({ onExplore }) => {
    const [activePilar, setActivePilar] = useState(null);
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

    const pilares = [
        {
            id: 'neuro',
            icon: 'fa-brain',
            title: 'NeuroEntornos Escolares',
            subtitle: 'Pilar 1',
            gradient: 'from-[#1B9EBA] to-[#0A3044]',
            bgDark: true,
            items: [
                {
                    title: 'IA Lab con Valerio',
                    icon: 'fa-robot',
                    desc: 'Tu tutor personal de IA disponible 24/7. Valerio te ayuda con explicaciones detalladas, análisis de documentos y guía personalizada.',
                    features: ['Chat inteligente 24/7', 'Análisis de documentos', 'Explicaciones detalladas'],
                    cta: 'Probar Valerio'
                },
                {
                    title: 'Diagnóstico VAK',
                    icon: 'fa-brain',
                    desc: 'Descubre tu estilo de aprendizaje único: Visual, Auditivo o Kinestésico. Test científico con recomendaciones personalizadas.',
                    features: ['Test VAK completo', 'Perfil personalizado', 'SmartBoard integrado'],
                    cta: 'Realizar Test'
                }
            ]
        },
        {
            id: 'proyectos',
            icon: 'fa-laptop-code',
            title: 'Proyectos de Impacto Nacional',
            subtitle: 'Pilar 2',
            gradient: 'from-[#0A3044] to-[#1B9EBA]',
            bgDark: false,
            items: [
                {
                    title: 'Proyectos SenaTIC',
                    icon: 'fa-folder-open',
                    desc: 'Explora proyectos reales desarrollados por estudiantes con tecnologías de última generación. Portafolio tecnológico completo.',
                    features: ['Proyectos prácticos', 'Tecnologías actuales', 'Certificaciones'],
                    cta: 'Explorar Proyectos'
                }
            ]
        },
        {
            id: 'consultoria',
            icon: 'fa-handshake',
            title: 'Consultoría B2B y Automatización',
            subtitle: 'Pilar 3',
            gradient: 'from-[#1B9EBA] to-[#0A3044]',
            bgDark: true,
            items: [
                {
                    title: 'Consultoría B2B',
                    icon: 'fa-building',
                    desc: 'Implementa soluciones de IA en tu institución educativa con nuestro equipo de expertos. Transformación digital garantizada.',
                    features: ['Agentes IA personalizados', 'Capacitación STEAM', 'ROI garantizado'],
                    cta: 'Solicitar Consultoría'
                },
                {
                    title: 'Automation Architect',
                    icon: 'fa-gears',
                    desc: 'Diseña flujos de trabajo automatizados para tu institución educativa. Herramienta de automatización con IA.',
                    features: ['Agentes personalizados', 'ROI Calculator', 'Automatización total'],
                    cta: 'Probar Automation'
                }
            ]
        }
    ];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#F8FAFC]">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#1B9EBA]" />
                        <span className="text-sm font-bold text-[#1B9EBA] uppercase tracking-widest">
                            Nuestros 3 Pilares
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#1B9EBA]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A3044] mb-6">
                        Plataforma Integral
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]"> de Aprendizaje</span>
                    </h2>
                    <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                        Accede a un conjunto completo de herramientas diseñadas para transformar la educación con inteligencia artificial.
                    </p>
                </div>

                {/* 3 Pilares Preview - Interactive Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {pilares.map((pilar, index) => (
                        <div
                            key={pilar.id}
                            onClick={() => setActivePilar(activePilar === pilar.id ? null : pilar.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                if (activePilar !== pilar.id) {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                }
                            }}
                            className={`relative rounded-3xl p-8 cursor-pointer transition-all duration-500 group ${
                                pilar.bgDark 
                                    ? 'bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] text-white' 
                                    : 'bg-white shadow-xl border border-[#E2E8F0]'
                            } ${activePilar === pilar.id ? 'ring-4 ring-[#1B9EBA] scale-[1.02]' : ''}`}
                            style={{ 
                                transformStyle: 'preserve-3d',
                                perspective: '1000px'
                            }}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                                pilar.bgDark 
                                    ? 'bg-gradient-to-br from-[#1B9EBA]/20 to-transparent' 
                                    : 'bg-[#1B9EBA]/10'
                            }`} />

                            {/* Floating Icon */}
                            <div className="relative z-10">
                                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 ${
                                    pilar.bgDark 
                                        ? 'bg-white/20' 
                                        : 'bg-gradient-to-br from-[#1B9EBA] to-[#0A3044]'
                                }`}>
                                    <i className={`fa-solid ${pilar.icon} text-3xl ${pilar.bgDark ? 'text-white' : 'text-white'}`} />
                                </div>

                                <span className={`inline-block text-xs font-bold uppercase tracking-wider mb-2 ${pilar.bgDark ? 'text-[#1B9EBA]' : 'text-[#1B9EBA]'}`}>
                                    {pilar.subtitle}
                                </span>

                                <h3 className={`text-xl md:text-2xl font-bold text-center mb-4 ${
                                    pilar.bgDark ? 'text-white' : 'text-[#0A3044]'
                                }`}>
                                    {pilar.title}
                                </h3>

                                <div className={`flex justify-center transition-transform duration-500 ${activePilar === pilar.id ? 'rotate-180' : ''}`}>
                                    <i className={`fa-solid fa-chevron-down ${pilar.bgDark ? 'text-[#1B9EBA]' : 'text-[#64748B]'}`} />
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <div 
                                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
                                    animation: 'shine 2s ease-in-out infinite'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Expanded Pilares */}
                {pilares.map((pilar) => (
                    <div 
                        key={pilar.id}
                        className={`transition-all duration-700 overflow-hidden ${
                            activePilar === pilar.id ? 'max-h-[2000px] opacity-100 mb-12' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className={`rounded-3xl p-8 md:p-12 ${
                            pilar.bgDark 
                                ? 'bg-gradient-to-br from-[#0A3044] to-[#1B9EBA]' 
                                : 'bg-white shadow-xl border border-[#E2E8F0]'
                        }`}>
                            <div className={`grid grid-cols-1 ${pilar.items.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8`}>
                                {pilar.items.map((item, itemIndex) => (
                                    <div 
                                        key={itemIndex}
                                        className={`${pilar.items.length > 1 ? 'md:col-span-1' : 'md:col-span-2'}`}
                                    >
                                        <div className={`flex items-start gap-6 ${pilar.bgDark ? 'text-white' : 'text-[#0A3044]'}`}>
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                                pilar.bgDark 
                                                    ? 'bg-white/20' 
                                                    : 'bg-gradient-to-br from-[#1B9EBA] to-[#0A3044]'
                                            }`}>
                                                <i className={`fa-solid ${item.icon} text-2xl text-white`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h4 className={`text-2xl font-bold mb-3 ${pilar.bgDark ? 'text-white' : 'text-[#0A3044]'}`}>
                                                    {item.title}
                                                </h4>
                                                <p className={`mb-6 leading-relaxed ${pilar.bgDark ? 'text-white/80' : 'text-[#64748B]'}`}>
                                                    {item.desc}
                                                </p>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-3 mb-6">
                                                    {item.features.map((feature, fIndex) => (
                                                        <span 
                                                            key={fIndex}
                                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                                                pilar.bgDark 
                                                                    ? 'bg-white/10 text-white/90' 
                                                                    : 'bg-[#1B9EBA]/10 text-[#1B9EBA]'
                                                            }`}
                                                        >
                                                            <i className="fa-solid fa-check text-xs" />
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* CTA */}
                                                <button 
                                                    onClick={() => onExplore(pilar.id)}
                                                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 ${
                                                        pilar.bgDark 
                                                            ? 'bg-white text-[#0A3044] hover:bg-[#1B9EBA] hover:text-white' 
                                                            : 'bg-[#1B9EBA] text-white hover:bg-[#0A3044]'
                                                    }`}
                                                >
                                                    <span>{item.cta}</span>
                                                    <i className="fa-solid fa-arrow-right" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shine Animation */}
            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
