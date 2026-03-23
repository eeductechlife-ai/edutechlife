import { memo, useState, useEffect, useRef } from 'react';
import EcosystemTransform from './EcosystemTransform';
import EcosystemTransform from './EcosystemTransform';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Ecosystem Light Glassmorphism Modal
// ==========================================
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
        ialab: {
            fullDesc: 'Laboratorio de Inteligencia Artificial con certificación internacional. Aprende a crear prompts efectivos, desarrolla agentes IA y obtén tu certificación profesional.',
            features: [
                { icon: 'fa-robot', title: 'IA Lab Pro', desc: 'Plataforma completa de formación en inteligencia artificial' },
                { icon: 'fa-wand-magic-sparkles', title: 'Prompt Engineering', desc: 'Domina el arte de comunicarte con IA' },
                { icon: 'fa-certificate', title: 'Certificación', desc: 'Obtén tu certificado profesional reconocido' },
                { icon: 'fa-users', title: 'Proyectos Reales', desc: 'Aplica tus conocimientos en proyectos prácticos' }
            ],
            cta: 'Ir al Laboratorio IA'
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
        const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !pilar || !modalContent[pilar.id]) return null;
    const content = modalContent[pilar.id];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" onClick={onClose}>
            {/* Bright Backdrop */}
            <div className="absolute inset-0 bg-[#F8FAFC]/80 backdrop-blur-md" />
            
            <div 
                className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,75,99,0.15)] border border-[#E2E8F0] animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative overflow-hidden rounded-t-3xl bg-[#F8FAFC] border-b border-[#E2E8F0] p-8 md:p-12">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#004B63] hover:bg-[#F8FAFC] transition-transform hover:scale-105"
                    >
                        <i className="fa-solid fa-xmark text-lg" />
                    </button>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center">
                            <i className={`fa-solid ${pilar.icon} text-4xl md:text-5xl text-[#4DA8C4]`} />
                        </div>
                        <div>
                            <span className="inline-block px-4 py-1 bg-[#4DA8C4]/10 rounded-full text-xs font-black uppercase tracking-widest text-[#4DA8C4] mb-4">
                                {pilar.subtitle}
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] mb-2 font-montserrat tracking-tight">
                                {pilar.title}
                            </h2>
                            <p className="text-[#64748B] text-lg max-w-xl font-open-sans">
                                {content.fullDesc}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.features.map((feature, index) => (
                            <div key={index} className="group flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] transition-colors hover:bg-white hover:border-[#4DA8C4]/30 hover:shadow-neuro">
                                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <i className={`fa-solid ${feature.icon} text-lg text-[#66CCCC]`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#004B63] mb-1 font-montserrat">{feature.title}</h4>
                                    <p className="text-sm text-[#64748B] font-open-sans">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 pt-8 border-t border-[#E2E8F0]">
                        <button 
                            onClick={() => { onClose(); pilar.onNavigate(pilar.id); }}
                            className="btn-glow inline-flex items-center gap-3 px-10 py-4 font-bold rounded-full font-montserrat bg-white"
                        >
                            <i className="fa-solid fa-rocket text-[#4DA8C4]" />
                            <span className="text-[#004B63] group-hover:text-corporate">{content.cta}</span>
                            <i className="fa-solid fa-arrow-right text-[#66CCCC]" />
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes modal-slide-in {
                        0% { opacity: 0; transform: scale(0.98) translateY(10px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-modal-in { animation: modal-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                `}</style>
            </div>
        </div>
    );
};

// ==========================================
// 3D Tilt Card using Framer Motion
// ==========================================
const TiltCard = ({ children, pilar, onClick }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };
    
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="gsap-eco-reveal h-full rounded-3xl"
        >
            <motion.div 
                className="group relative h-full rounded-3xl p-8 text-left cursor-pointer transition-all duration-300 bg-white border border-[#E2E8F0] hover:border-[#4DA8C4]/40 hover:shadow-neuro-hover"
            >
                {/* 3D Elevated Content */}
                <div 
                    style={{ transform: "translateZ(30px)", transition: "transform 0.3s ease-out" }} 
                    className="relative z-10 w-full h-full flex flex-col group-hover:translate-z-[40px]"
                >
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// Ecosystem Component (Light Theme)
// ==========================================
const Ecosystem = memo(({ onNavigate }) => {
    const [selectedPilar, setSelectedPilar] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Reveal
            gsap.fromTo(".gsap-eco-header",
                { opacity: 0, y: 30, filter: "blur(8px)" },
                { 
                    opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
                }
            );

            // Cards Reveal
            gsap.fromTo(".gsap-eco-reveal", 
                { opacity: 0, y: 50, filter: "blur(12px)" },
                { 
                    opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.15, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const pilares = [
        {
            id: 'neuroentorno', icon: 'fa-brain', title: 'NeuroEntornos Escolares', subtitle: 'Pilar 1',
            desc: 'Diagnóstico VAK, IA Lab con Valerio, SmartBoard y herramientas neuropedagógicas.',
            stats: [{ num: '6,000+', label: 'Estudiantes' }, { num: '98%', label: 'Efectividad' }],
            onNavigate
        },
        {
            id: 'ialab', icon: 'fa-robot', title: 'Laboratorio IA', subtitle: 'Certificación Profesional',
            desc: 'Aprende inteligencia artificial, crea prompts y obtén tu certificación.',
            stats: [{ num: '5', label: 'Módulos' }, { num: '100%', label: 'Online' }],
            onNavigate
        },
        {
            id: 'consultoria', icon: 'fa-handshake', title: 'Consultoría B2B y Automatización', subtitle: 'Pilar 3',
            desc: 'Transformación digital, agentes IA personalizados y ROI garantizado.',
            stats: [{ num: '100+', label: 'Instituciones' }, { num: '3x', label: 'ROI Promedio' }],
            onNavigate
        }
    ];

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#F8FAFC]">
      <EcosystemTransform />
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#4DA8C4]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#66CCCC]/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="gsap-eco-header text-center mb-20 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-xs font-bold text-[#4DA8C4] uppercase tracking-widest mb-6 shadow-sm">
                        Plataforma Modular
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004B63] mb-6 font-montserrat tracking-tight">
                        Ecosistema
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                            Interconectado.
                        </span>
                    </h2>
                    <p className="text-lg text-[#64748B] font-open-sans leading-relaxed">
                        Accede a herramientas estructuradas para potenciar la educación mediante la sinergia de neuro-ciencia e inteligencia artificial.
                    </p>
                </div>

                {/* 3 Pilares Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pilares.map((pilar) => (
                        <TiltCard key={pilar.id} pilar={pilar} onClick={() => setSelectedPilar(pilar)}>
                            {/* Icon & Badge */}
                            <div className="mb-6">
                                <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#004B63] rounded-full mb-5">
                                    {pilar.subtitle}
                                </span>
                                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center group-hover:border-[#4DA8C4]/50 group-hover:scale-105 transition-all">
                                    <i className={`fa-solid ${pilar.icon} text-2xl text-[#4DA8C4]`} />
                                </div>
                            </div>

                            {/* Text */}
                            <h3 className="text-2xl font-black mb-3 text-[#004B63] font-montserrat tracking-tight">
                                {pilar.title}
                            </h3>
                            <p className="text-sm text-[#64748B] font-open-sans leading-relaxed mb-8 flex-grow">
                                {pilar.desc}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-4 mb-6 border-t border-[#E2E8F0] pt-6">
                                {pilar.stats.map((stat, sIndex) => (
                                    <div key={sIndex}>
                                        <div className="text-2xl font-black text-[#004B63] font-mono tracking-tighter">
                                            {stat.num}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Link */}
                            <div className="mt-auto flex items-center gap-2 font-bold text-[#4DA8C4] group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                                <span>Explorar</span>
                                <i className="fa-solid fa-arrow-right" />
                            </div>
                        </TiltCard>
                    ))}
                </div>

                {/* Direct Access Mini-Cards */}
                <div className="gsap-eco-header mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {[
                        { id: 'vak', icon: 'fa-brain', title: 'Diagnóstico VAK', sub: 'Métrica V1' },
                        { id: 'ialab', icon: 'fa-flask', title: 'IA Lab Pro', sub: 'Entrenamiento' },
                        { id: 'consultoria', icon: 'fa-robot', title: 'Automatización', sub: 'B2B Analytics' },
                        { id: 'smartboard', icon: 'fa-chalkboard', title: 'SmartBoard', sub: 'Pizarra Live' }
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className="group p-5 bg-white rounded-2xl border border-[#E2E8F0] text-left transition-all hover:border-[#4DA8C4]/50 hover:shadow-neuro flex items-center gap-4"
                        >
                            <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#4DA8C4] group-hover:bg-[#4DA8C4] group-hover:text-white transition-colors">
                                <i className={`fa-solid ${item.icon}`} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#004B63] font-montserrat">{item.title}</h3>
                                <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold">{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <PilarModal pilar={selectedPilar} isOpen={!!selectedPilar} onClose={() => setSelectedPilar(null)} />
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
