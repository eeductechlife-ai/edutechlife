import { useState, useEffect, useRef } from 'react';

const pillars = [
    {
        id: 'tecnica',
        title: 'IA y Computación Cuántica',
        subtitle: 'Línea Técnica',
        desc: 'Explora los límites de la inteligencia artificial y la computación cuántica. Desarrolla algoritmos que revolucionarán el procesamiento de datos.',
        icon: 'fa-microchip',
        color: '#4DA8C4',
        glowColor: 'rgba(77, 168, 196, 0.3)',
        features: ['Machine Learning Avanzado', 'Algoritmos Cuánticos', 'Procesamiento Paralelo', 'Redes Neuronales'],
        badge: 'Pionero',
    },
    {
        id: 'biologica',
        title: 'Bioinformática y Edición Genética',
        subtitle: 'Línea Biológica',
        desc: 'Convergence de biología y tecnología. Aprende sobre CRISPR, análisis de genomas y modelado de proteínas con IA.',
        icon: 'fa-dna',
        color: '#66CCCC',
        glowColor: 'rgba(102, 204, 204, 0.3)',
        features: ['CRISPR y Edición Genética', 'Secuenciación de ADN', 'Bioestadística', 'Modelado Molecular'],
        badge: 'Innovador',
    },
    {
        id: 'astrofisica',
        title: 'Astrofísica y Aeroespacial',
        subtitle: 'Línea Astrofísica',
        desc: 'Desde exoplanetas hasta agujeros negros. Aplica la física de frontera para resolver los misterios del universo.',
        icon: 'fa-rocket',
        color: '#004B63',
        glowColor: 'rgba(0, 75, 99, 0.4)',
        features: ['Cosmología Computacional', 'Misión Espacial Simulada', 'Astrobiología', 'Física de Partículas'],
        badge: 'Explorador',
    },
];

const EcosystemCard = ({ pillar, index }) => {
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
        console.log(`Explorar laboratorio: ${pillar.title}`);
    };

    return (
        <div
            ref={cardRef}
            className={`ecosystem-card group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                '--pillar-color': pillar.color,
                '--pillar-glow': pillar.glowColor,
            }}
        >
            {/* Glow Effect on Hover */}
            <div
                className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${pillar.glowColor} 0%, transparent 70%)`,
                }}
            />

            {/* Glow Border on Hover */}
            <div
                className={`absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    boxShadow: `inset 0 0 30px ${pillar.glowColor}, 0 0 60px ${pillar.glowColor}`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isHovered ? 'scale-110 -rotate-3' : ''
                        }`}
                        style={{
                            background: isHovered
                                ? `linear-gradient(135deg, ${pillar.color}, ${pillar.color}aa)`
                                : `${pillar.color}15`,
                            border: `1px solid ${pillar.color}30`,
                        }}
                    >
                        <i
                            className={`fa-solid ${pillar.icon} text-2xl transition-colors duration-300`}
                            style={{ color: isHovered ? 'white' : pillar.color }}
                        />
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider"
                        style={{
                            background: `${pillar.color}15`,
                            color: pillar.color,
                            border: `1px solid ${pillar.color}30`,
                        }}
                    >
                        {pillar.badge}
                    </span>
                </div>

                {/* Subtitle */}
                <span
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 block"
                    style={{ color: `${pillar.color}aa` }}
                >
                    {pillar.subtitle}
                </span>

                {/* Title */}
                <h3
                    className="font-montserrat text-xl font-bold mb-4 transition-colors duration-300"
                    style={{ color: isHovered ? pillar.color : 'white' }}
                >
                    {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                    {pillar.desc}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {pillar.features.map((feature, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 text-[11px] font-mono bg-white/[0.03] border border-white/10 rounded-full text-white/50 transition-all duration-300 hover:border-white/20"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleExplore}
                    className="w-full py-4 rounded-xl font-montserrat font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 group/btn overflow-hidden relative"
                    style={{
                        background: isHovered
                            ? `linear-gradient(135deg, ${pillar.color}, ${pillar.color}aa)`
                            : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isHovered ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                        color: isHovered ? 'white' : pillar.color,
                    }}
                >
                    {/* Shine Effect */}
                    <span
                        className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                        style={{
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                        }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                        Explorar Laboratorio
                        <i
                            className={`fa-solid fa-arrow-right text-xs transition-transform duration-300 ${
                                isHovered ? 'translate-x-1' : ''
                            }`}
                        />
                    </span>
                </button>
            </div>

            {/* Decorative Corner Lines */}
            <div
                className={`absolute top-0 right-0 w-20 h-20 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `linear-gradient(135deg, ${pillar.color}30 0%, transparent 50%)`,
                    borderTopRightRadius: '1.5rem',
                }}
            />
            <div
                className={`absolute bottom-0 left-0 w-20 h-20 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    background: `linear-gradient(315deg, ${pillar.color}20 0%, transparent 50%)`,
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

    return (
        <section
            className="relative py-24 px-5% overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #0A1628 0%, #070B14 50%, #0A1628 100%)',
            }}
        >
            {/* Background Grid */}
            <div className="grid-bg-3d" />

            {/* Particle Container */}
            <div className="particle-container">
                {Array.from({ length: 20 }).map((_, i) => (
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
            <div className="orb orb-primary" style={{ top: '10%', right: '10%', width: '400px', height: '400px' }} />
            <div className="orb orb-secondary" style={{ bottom: '20%', left: '5%', width: '300px', height: '300px' }} />
            <div className="orb orb-accent" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px' }} />

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
                            Ecosistema Educativo
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
                    <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        Tres líneas de investigación de frontera diseñadas por magísteres en educación. 
                        Cada pilar integra metodologías VAK y STEAM con las herramientas más avanzadas.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map((pillar, index) => (
                        <EcosystemCard
                            key={pillar.id}
                            pillar={pillar}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div
                        className={`inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-700 delay-300 ${
                            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <div className="flex -space-x-2">
                            {pillars.map((p) => (
                                <div
                                    key={p.id}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                                    style={{ background: p.color }}
                                >
                                    <i className={`fa-solid ${p.icon}`} />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/70 text-sm font-medium">
                            3 Laboratorios Activos · +150 Estudiantes
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ecosystem;
