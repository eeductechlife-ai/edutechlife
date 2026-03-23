import { memo, useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';

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
            {/* Solid overlay - ZERO LAG performance */}
            <div className="absolute inset-0 bg-gray-100/95" />
            
            <div 
                className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,75,99,0.15)] border border-[rgba(77,168,196,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative overflow-hidden rounded-t-3xl bg-[#F8FAFC] border-b border-[#E2E8F0] p-8 md:p-12">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#004B63] hover:bg-[#F8FAFC] transition-transform hover:scale-105"
                    >
                        <Icon name="fa-xmark" className="text-lg" />
                    </button>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center">
                            <Icon name={pilar.icon} className="text-4xl md:text-5xl text-[#4DA8C4]" />
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
                                    <Icon name={feature.icon} className="text-lg text-[#66CCCC]" />
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
                            <Icon name="fa-rocket" className="text-[#4DA8C4]" />
                            <span className="text-[#004B63] group-hover:text-corporate">{content.cta}</span>
                            <Icon name="fa-arrow-right" className="text-[#66CCCC]" />
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
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
    const requestRef = useRef(null);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(() => {
            x.set(mouseX / width - 0.5);
            y.set(mouseY / height - 0.5);
        });
    };
    
    const handleMouseLeave = () => { x.set(0); y.set(0); setIsHovered(false); };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            onClick={onClick}
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-3xl"
        >
            <motion.div 
                className="group relative h-full rounded-3xl p-8 text-left cursor-pointer transition-all duration-300 bg-white border-beam-card hover:shadow-neuro-hover"
            >
                {/* 3D Elevated Content */}
                <div 
                    style={{ transform: "translateZ(30px)", transition: "transform 0.3s ease-out" }} 
                    className="relative z-10 w-full h-full flex flex-col group-hover:translate-z-[40px]"
                >
                    {typeof children === 'function' ? children(isHovered) : children}
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
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#4DA8C4]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#66CCCC]/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20 max-w-3xl mx-auto"
                >
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
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* TARJETA 01 */}
                    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer" onClick={() => setSelectedPilar(pilares[0])}>
                        <div className="h-64 w-full overflow-hidden">
                            <img src="/images/eco-neuro.webp" alt="Neuro-Entorno Educativo" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8">
                            <div className="w-14 h-14 bg-[#4DA8C4]/10 rounded-2xl flex items-center justify-center mb-4">
                                <Icon name="fa-brain" className="text-2xl text-[#4DA8C4]" />
                            </div>
                            <span className="text-5xl font-black text-gray-100">01</span>
                            <h3 className="text-xl font-bold text-[#004B63] uppercase mt-6 mb-4">Neuro-Entorno Educativo</h3>
                            <p className="text-gray-600 leading-relaxed">Acompañamiento integral basado en metodologías VAK y STEAM. Docentes con maestría analizan procesos psicológicos y académicos para potenciar cada estilo de aprendizaje con herramientas de IA personalizadas.</p>
                        </div>
                    </div>

                    {/* TARJETA 02 */}
                    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer" onClick={() => setSelectedPilar(pilares[1])}>
                        <div className="h-64 w-full overflow-hidden">
                            <img src="/images/eco-nacional.webp" alt="Proyectos de Impacto Nacional" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8">
                            <div className="w-14 h-14 bg-[#4DA8C4]/10 rounded-2xl flex items-center justify-center mb-4">
                                <Icon name="fa-award" className="text-2xl text-[#4DA8C4]" />
                            </div>
                            <span className="text-5xl font-black text-gray-100">02</span>
                            <h3 className="text-xl font-bold text-[#004B63] uppercase mt-6 mb-4">Proyectos de Impacto Nacional</h3>
                            <p className="text-gray-600 leading-relaxed">Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera. Maestros que forman maestros: más de 200 docentes colombianos transformados en líderes digitales.</p>
                        </div>
                    </div>

                    {/* TARJETA 03 */}
                    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer" onClick={() => setSelectedPilar(pilares[2])}>
                        <div className="h-64 w-full overflow-hidden">
                            <img src="/images/edutech-carrusel-6.webp" alt="Consultoría B2B y Automatización" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8">
                            <div className="w-14 h-14 bg-[#4DA8C4]/10 rounded-2xl flex items-center justify-center mb-4">
                                <Icon name="fa-handshake" className="text-2xl text-[#4DA8C4]" />
                            </div>
                            <span className="text-5xl font-black text-gray-100">03</span>
                            <h3 className="text-xl font-bold text-[#004B63] uppercase mt-6 mb-4">Consultoría B2B y Automatización</h3>
                            <p className="text-gray-600 leading-relaxed">Transformamos organizaciones educativas y empresas con metodología STEAM aplicada. Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.</p>
                        </div>
                    </div>
                </div>

                {/* Direct Access Mini-Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
                >
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
                                 <Icon name={item.icon} className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#004B63] font-montserrat">{item.title}</h3>
                                <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold">{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </motion.div>
            </div>

            <PilarModal pilar={selectedPilar} isOpen={!!selectedPilar} onClose={() => setSelectedPilar(null)} />
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
