import { memo, useState, useEffect, useRef } from 'react';

const PilarModal = ({ pilar, isOpen, onClose }) => {
    const modalContent = {
        neuroentorno: {
            fullDesc: 'Nuestro método NeuroEntornos Escolares integra diagnóstico VAK personalizado, inteligencia artificial con Valerio, y herramientas SmartBoard para crear espacios de aprendizaje únicos que se adaptan al cerebro de cada estudiante.',
            features: [
                { icon: 'fa-brain', title: 'Diagnóstico VAK', desc: 'Identificamos tu estilo de aprendizaje: Visual, Auditivo o Kinestésico' },
                { icon: 'fa-robot', title: 'IA Valerio', desc: 'Tutor inteligente que se adapta a tu ritmo y necesidades individuales' },
                { icon: 'fa-chalkboard', title: 'SmartBoard', desc: 'Pizarras interactivas con tecnología de última generación' },
                { icon: 'fa-chart-line', title: 'Seguimiento', desc: 'Métricas en tiempo real del progreso de cada estudiante' }
            ],
            cta: 'Explorar NeuroEntornos'
        },
        proyectos: {
            fullDesc: 'Proyectos SenaTIC y portafolio tecnológico con certificaciones internacionales. Formamos profesionales competitivos con experiencia práctica en las tecnologías más demandadas del mercado.',
            features: [
                { icon: 'fa-laptop-code', title: 'SenaTIC', desc: 'Proyectos colaborativos con el Servicio Nacional de Aprendizaje' },
                { icon: 'fa-certificate', title: 'Certificaciones', desc: 'Preparación para certificaciones tecnológicas globales' },
                { icon: 'fa-briefcase', title: 'Portafolio', desc: 'Construcción de proyectos reales para tu carrera profesional' },
                { icon: 'fa-users', title: 'Mentoría', desc: 'Acompañamiento de expertos de la industria tecnológica' }
            ],
            cta: 'Ver Proyectos'
        },
        consultoria: {
            fullDesc: 'Transformación digital para instituciones educativas y empresas. Desarrollamos agentes de IA personalizados que automatizan procesos, mejoran la eficiencia y garantizan un ROI measurable.',
            features: [
                { icon: 'fa-building', title: 'Diagnóstico', desc: 'Análisis profundo de procesos y oportunidades de automatización' },
                { icon: 'fa-robot', title: 'Agentes IA', desc: 'Sistemas inteligentes personalizados para cada necesidad' },
                { icon: 'fa-chart-pie', title: 'ROI Garantizado', desc: '3x retorno de inversión promedio en el primer año' },
                { icon: 'fa-headset', title: 'Soporte 24/7', desc: 'Asistencia continua para maximizar el rendimiento' }
            ],
            cta: 'Solicitar Consultoría'
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !pilar) return null;

    const content = modalContent[pilar.id];

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            {/* Backdrop Premium con blur */}
            <div 
                className="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-[8px]"
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            />
            
            {/* Modal Container */}
            <div 
                className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,75,99,0.4)] animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con gradiente */}
                <div className={`relative overflow-hidden rounded-t-3xl bg-gradient-to-br ${pilar.gradient} p-8 md:p-12`}>
                    {/* Pattern Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute inset-0" 
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '30px 30px'
                            }}
                        />
                    </div>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-90"
                    >
                        <i className="fa-solid fa-xmark text-lg" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-4">
                            {pilar.subtitle}
                        </span>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <i className={`fa-solid ${pilar.icon} text-4xl md:text-5xl text-white`} />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
                                    {pilar.title}
                                </h2>
                                <p className="text-white/80 text-lg max-w-xl">
                                    {content.fullDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#66CCCC]/20 blur-3xl" />
                </div>

                {/* Features Grid */}
                <div className="p-8 md:p-12 bg-[#F8FAFC]">
                    <h3 className="text-xl font-bold text-[#004B63] mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-stars text-[#66CCCC]" />
                        Características Principales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.features.map((feature, index) => (
                            <div 
                                key={index}
                                className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-lg hover:border-[#4DA8C4]/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <i className={`fa-solid ${feature.icon} text-lg text-white`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#004B63] mb-1">{feature.title}</h4>
                                    <p className="text-sm text-[#64748B] leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-[#E2E8F0]">
                        {pilar.stats.map((stat, index) => (
                            <div key={index} className="text-center px-8">
                                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                    {stat.num}
                                </div>
                                <div className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-10">
                        <button 
                            onClick={() => {
                                onClose();
                                pilar.onNavigate(pilar.id);
                            }}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_10px_40px_rgba(77,168,196,0.4)] hover:scale-105 hover:from-[#66CCCC] hover:to-[#4DA8C4]"
                        >
                            <i className="fa-solid fa-rocket" />
                            <span className="text-lg">{content.cta}</span>
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                    </div>
                </div>

                {/* Animation Styles */}
                <style>{`
                    @keyframes modal-slide-in {
                        0% {
                            opacity: 0;
                            transform: scale(0.95) translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                    .animate-modal-in {
                        animation: modal-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

const Ecosystem = memo(({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedPilar, setSelectedPilar] = useState(null);
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
            ],
            onNavigate
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
            ],
            onNavigate
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
            ],
            onNavigate
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
                            onClick={() => setSelectedPilar(pilar)}
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
                    {/* Direct Access Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                        <button 
                            onClick={() => onNavigate('vak')}
                            className="group p-6 bg-gradient-to-r from-[#66CCCC]/10 to-[#4DA8C4]/10 rounded-2xl border-2 border-[#4DA8C4]/30 text-left transition-all duration-300 hover:shadow-xl hover:border-[#4DA8C4] hover:scale-105"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-brain text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#004B63]">Test VAK Gratis</h3>
                                    <p className="text-[#64748B] text-sm">Sin registro</p>
                                </div>
                            </div>
                            <p className="text-[#64748B] text-sm">
                                Descubre tu estilo de aprendizaje en 5 minutos. Diagnóstico instantáneo y personalizado.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[#4DA8C4] font-semibold text-sm">
                                <span>Comenzar ahora</span>
                                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>

                        <button 
                            onClick={() => onNavigate('consultoria-b2b')}
                            className="group p-6 bg-gradient-to-r from-[#004B63]/10 to-[#4DA8C4]/10 rounded-2xl border-2 border-[#004B63]/30 text-left transition-all duration-300 hover:shadow-xl hover:border-[#004B63] hover:scale-105"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-chart-line text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#004B63]">Herramientas IA</h3>
                                    <p className="text-[#64748B] text-sm">ROI y Automatización</p>
                                </div>
                            </div>
                            <p className="text-[#64748B] text-sm">
                                Calcula el ROI y diseña flujos de automatización con inteligencia artificial.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[#004B63] font-semibold text-sm">
                                <span>Acceder gratis</span>
                                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>
                    </div>

                    <button 
                        onClick={() => onNavigate('ialab')}
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

            {/* Premium Modal */}
            <PilarModal 
                pilar={selectedPilar}
                isOpen={!!selectedPilar}
                onClose={() => setSelectedPilar(null)}
            />
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
