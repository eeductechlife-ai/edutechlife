import { useState, useEffect, useRef } from 'react';

const lines = [
    {
        id: 'neuroentorno',
        title: 'Neuro-Entorno Educativo',
        subtitle: 'Línea de Impacto 01',
        desc: 'IA que analiza procesos psicológicos y académicos en tiempo real para cada estudiante. Acompañamiento integral basado en metodologías VAK y STEAM.',
        icon: 'fa-brain',
        color: '#4DA8C4',
        glowColor: 'rgba(77, 168, 196, 0.3)',
        badge: 'Activo',
        features: ['Análisis VAK Automatizado', 'Perfil de Aprendizaje', 'Contenido Adaptativo', 'Seguimiento Neurocognitivo'],
        tools: ['Test VAK', 'Generador de Perfiles', 'Plan de Estudio', 'Dashboard de Progreso'],
        stats: { estudiantes: '6,000+', precision: '98%', satisfaccion: '4.8/5' },
    },
    {
        id: 'proyectos',
        title: 'Proyectos de Impacto Nacional',
        subtitle: 'Línea de Impacto 02',
        desc: 'Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera. Maestros que forman maestros.',
        icon: 'fa-award',
        color: '#66CCCC',
        glowColor: 'rgba(102, 204, 204, 0.3)',
        badge: 'Certificaciones',
        features: ['Certificación SenaTIC', 'IBM Academic Initiative', 'Coursera Campus', 'MinTIC Colombia'],
        tools: ['Catálogo de Cursos', 'Calculadora de Certificaciones', 'Progreso en Tiempo Real', 'Generador de Diplomas'],
        stats: { certificados: '12,000+', programas: '45+', alianzas: '40+' },
    },
    {
        id: 'consultoria',
        title: 'Consultoría B2B y Automatización',
        subtitle: 'Línea de Impacto 03',
        desc: 'Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.',
        icon: 'fa-building',
        color: '#004B63',
        glowColor: 'rgba(0, 75, 99, 0.4)',
        badge: 'Empresas',
        features: ['Agentes de IA Personalizados', 'Capacitación STEAM', 'Automatización de Procesos', 'Consultoría Estratégica'],
        tools: ['Diseñador de Agentes', 'Simulador de Procesos', 'ROI Calculator', 'Demo Interactiva'],
        stats: { empresas: '200+', automatizacion: '60%', productividad: '+35%' },
    },
];

const LineCard = ({ line, index, onExplore }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), index * 150);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [index]);

    const handleExplore = () => {
        if (onExplore) {
            onExplore(line.id);
        }
    };

    return (
        <div
            ref={cardRef}
            className={`ecosystem-card group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleExplore}
            style={{
                '--line-color': line.color,
                '--line-glow': line.glowColor,
                minHeight: 'auto',
            }}
        >
            {/* Background Image */}
            <div 
                className="absolute inset-0 opacity-20 transition-opacity duration-500"
                style={{
                    backgroundImage: `linear-gradient(180deg, transparent 0%, ${line.color}40 100%)`,
                }}
            />

            {/* Glow Effect on Hover */}
            <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `radial-gradient(circle at 50% 30%, ${line.glowColor} 0%, transparent 60%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isHovered ? 'scale-110 -rotate-3' : ''
                        }`}
                        style={{
                            background: isHovered
                                ? `linear-gradient(135deg, ${line.color}, ${line.color}aa)`
                                : `${line.color}15`,
                            border: `1px solid ${line.color}30`,
                        }}
                    >
                        <i
                            className={`fa-solid ${line.icon} text-2xl transition-colors duration-300`}
                            style={{ color: isHovered ? 'white' : line.color }}
                        />
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider"
                        style={{
                            background: `${line.color}15`,
                            color: line.color,
                            border: `1px solid ${line.color}30`,
                        }}
                    >
                        {line.badge}
                    </span>
                </div>

                {/* Subtitle */}
                <span
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 block"
                    style={{ color: `${line.color}aa` }}
                >
                    {line.subtitle}
                </span>

                {/* Title */}
                <h3
                    className="font-montserrat text-xl font-bold mb-4 transition-colors duration-300 leading-tight"
                    style={{ color: isHovered ? line.color : 'white' }}
                >
                    {line.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    {line.desc}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {line.features.slice(0, 4).map((feature, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 text-[11px] font-mono bg-white/[0.03] border border-white/10 rounded-full text-white/50"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-white/10">
                    {Object.entries(line.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                            <div 
                                className="font-montserrat text-lg font-black mb-1"
                                style={{ color: line.color }}
                            >
                                {value}
                            </div>
                            <div className="text-white/40 text-[10px] font-mono uppercase">
                                {key}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleExplore();
                    }}
                    className="w-full py-4 rounded-xl font-montserrat font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 group/btn overflow-hidden relative"
                    style={{
                        background: isHovered
                            ? `linear-gradient(135deg, ${line.color}, ${line.color}aa)`
                            : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isHovered ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                        color: isHovered ? 'white' : line.color,
                    }}
                >
                    <span
                        className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                        style={{
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                        }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                        Explorar Módulo
                        <i
                            className={`fa-solid fa-arrow-right text-xs transition-transform duration-300 ${
                                isHovered ? 'translate-x-1' : ''
                            }`}
                        />
                    </span>
                </button>
            </div>

            {/* Decorative Elements */}
            <div
                className={`absolute top-0 right-0 w-24 h-24 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `linear-gradient(135deg, ${line.color}30 0%, transparent 50%)`,
                    borderTopRightRadius: '1.5rem',
                }}
            />
            <div
                className={`absolute bottom-0 left-0 w-24 h-24 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `linear-gradient(315deg, ${line.color}20 0%, transparent 50%)`,
                    borderBottomLeftRadius: '1.5rem',
                }}
            />
        </div>
    );
};

const Ecosystem = ({ onExplore }) => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsHeaderVisible(true);
            },
            { threshold: 0.3 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleExplore = (lineId) => {
        if (onExplore) {
            onExplore(lineId);
        }
    };

    return (
        <section
            id="ecosystem"
            className="relative py-16 md:py-24 px-4 md:px-8 lg:px-5% overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #0A1628 0%, #070B14 50%, #0A1628 100%)',
            }}
        >
            {/* Background Grid */}
            <div className="grid-bg-3d" />

            {/* Particle Container */}
            <div className="particle-container">
                {Array.from({ length: 25 }).map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${4 + Math.random() * 4}s`,
                            opacity: 0.1 + Math.random() * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Orbs */}
            <div className="orb orb-primary" style={{ top: '10%', right: '15%', width: '500px', height: '500px' }} />
            <div className="orb orb-secondary" style={{ bottom: '15%', left: '5%', width: '400px', height: '400px' }} />
            <div className="orb orb-accent" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px' }} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {/* Kicker */}
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA8C4]">
                            Líneas de Impacto · VAK + STEAM
                        </span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>

                    {/* Title */}
                    <h2 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        Nuestro{' '}
                        <span
                            className="relative inline-block"
                            style={{
                                background: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 50%, #B2D8E5 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Ecosistema
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
                        Seis líneas de impacto diseñadas por Magísteres en Educación. Cada pilar aplica metodología VAK y STEAM 
                        con las herramientas de IA más avanzadas del mercado.
                    </p>
                </div>

                {/* Lines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
                    {lines.map((line, index) => (
                        <div key={line.id} className="mb-8 md:mb-0">
                            <LineCard
                                line={line}
                                index={index}
                                onExplore={handleExplore}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 md:mt-16">
                    <div
                        className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 px-6 md:px-8 py-4 rounded-2xl md:rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-700 delay-300 ${
                            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <div className="flex -space-x-2">
                            {lines.map((line) => (
                                <div
                                    key={line.id}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm border-2 border-[#0A1628]"
                                    style={{ background: line.color }}
                                >
                                    <i className={`fa-solid ${line.icon}`} />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/70 text-sm font-medium">
                            3 Módulos Activos · +6,000 Estudiantes · 98% Satisfacción
                        </span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${
                    isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    {[
                        { icon: 'fa-brain', title: 'Metodología VAK', desc: 'Visual, Auditivo y Kinestésico integrado en cada módulo' },
                        { icon: 'fa-microchip', title: 'IA Avanzada', desc: 'GPT-4, Claude y modelos especializados en educación' },
                        { icon: 'fa-certificate', title: 'Certificaciones', desc: 'IBM, Coursera, SenaTIC y MinTIC reconocidas' },
                    ].map((item, i) => (
                        <div key={i} className="text-center p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                                style={{ background: 'linear-gradient(135deg, rgba(77, 168, 196, 0.2), rgba(102, 204, 204, 0.1))' }}
                            >
                                <i className={`fa-solid ${item.icon} text-xl`} style={{ color: '#4DA8C4' }} />
                            </div>
                            <h4 className="font-montserrat font-bold text-white mb-2">{item.title}</h4>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Ecosystem;
