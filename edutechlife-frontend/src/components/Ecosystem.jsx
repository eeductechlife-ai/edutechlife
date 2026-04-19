import { memo, useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
// Cargar lottie dinámicamente para evitar problemas de importación
let lottieInstance = null;

const loadLottie = async () => {
  if (!lottieInstance) {
    const lottieModule = await import('lottie-web/build/player/esm/lottie.min.js');
    lottieInstance = lottieModule.default;
  }
  return lottieInstance;
};

// ==========================================
// Lottie Animation Data (Inline JSON - Zero External Requests)
// ==========================================
const brainAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Brain",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Circle",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "el",
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [80, 80] },
      nm: "Ellipse"
    }, {
      ty: "st",
      c: { a: 0, k: [0.302, 0.659, 0.769, 1] },
      o: { a: 0, k: 100 },
      w: { a: 0, k: 4 },
      lc: 2,
      lj: 1,
      nm: "Stroke"
    }]
  }]
};

const awardAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Award",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Star",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] }, { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 30, s: [120, 120, 100] }, { t: 60, s: [100, 100, 100] }] }
    },
    ao: 0,
    shapes: [{
      ty: "sr",
      p: { a: 0, k: [0, 0] },
      or: { a: 0, k: 35 },
      ir: { a: 0, k: 15 },
      pt: { a: 0, k: 5 },
      r: { a: 0, k: 0 },
      nm: "Star"
    }, {
      ty: "fl",
      c: { a: 0, k: [1, 0.82, 0.388, 1] },
      o: { a: 0, k: 100 },
      nm: "Fill"
    }]
  }]
};

const handshakeAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Handshake",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Pulse",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [100] }, { t: 60, s: [0] }] },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [50, 50, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] }, { t: 60, s: [150, 150, 100] }] }
    },
    ao: 0,
    shapes: [{
      ty: "el",
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [60, 60] },
      nm: "Ellipse"
    }, {
      ty: "st",
      c: { a: 0, k: [0.302, 0.659, 0.769, 1] },
      o: { a: 0, k: 100 },
      w: { a: 0, k: 3 },
      lc: 2,
      lj: 1,
      nm: "Stroke"
    }]
  }]
};

// ==========================================
// Card con Lottie Hover (Solo play en hover)
// ==========================================
const CardWithLottie = ({ children, animationData, onMouseEnter, onMouseLeave }) => {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    const initAnimation = async () => {
      try {
        const lottie = await loadLottie();
        if (mounted && animationContainer.current && !animationInstance.current) {
          animationInstance.current = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            animationData: animationData
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    };
    
    initAnimation();
    
    return () => {
      mounted = false;
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, [animationData]);
  
  const handleMouseEnter = (e) => {
    if (animationInstance.current) animationInstance.current.play();
    if (onMouseEnter) onMouseEnter(e);
  };
  
  const handleMouseLeave = (e) => {
    if (animationInstance.current) animationInstance.current.pause();
    if (onMouseLeave) onMouseLeave(e);
  };
  
  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-14 h-14 mb-4" ref={animationContainer} />
      {children}
    </div>
  );
};

// ==========================================
// Ecosystem Light Glassmorphism Modal
// ==========================================
const PilarModal = ({ pilar, isOpen, onClose }) => {
    const modalContent = {
        neuroentorno: {
            fullDesc: 'Nuestro método NeuroEntornos Escolares integra diagnóstico VAK personalizado, inteligencia artificial con Valerio, y herramientas SmartBoard para crear espacios de aprendizaje únicos que se adaptan al cerebro de cada estudiante.',
            features: [
                { icon: 'fa-brain', title: 'Diagnóstico VAK', desc: 'Identificamos tu estilo de aprendizaje: Visual, Auditivo o Kinestésico' },
                { icon: 'fa-chart-line', title: 'Seguimiento', desc: 'Métricas en tiempo real del progreso de cada estudiante' },
                { icon: 'fa-users', title: 'Comunidad', desc: 'Red de apoyo entre estudiantes y docentes' },
                { icon: 'fa-award', title: 'Certificación', desc: 'Credenciales reconocidas internacionalmente' }
            ],
            cta: 'Explorar NeuroEntornos'
        },
        ialab: {
            fullDesc: 'Laboratorio de Inteligencia Artificial con certificación internacional. Aprende a crear prompts efectivos, desarrolla agentes IA y obtén tu certificación profesional.',
            features: [
                { icon: 'fa-wand-magic-sparkles', title: 'Prompt Engineering', desc: 'Domina el arte de comunicarte con IA' },
                { icon: 'fa-code', title: 'Desarrollo IA', desc: 'Crea tus propios agentes inteligentes' },
                { icon: 'fa-certificate', title: 'Certificación', desc: 'Obtén tu certificado profesional reconocido' },
                { icon: 'fa-users', title: 'Proyectos Reales', desc: 'Aplica tus conocimientos en proyectos prácticos' }
            ],
            cta: 'Ir al Laboratorio IA'
        },
        consultoria: {
            fullDesc: 'Transformación digital para instituciones educativas y empresas. Desarrollamos agentes de IA personalizados que automatizan procesos, mejoran la eficiencia y garantizan un ROI measurable.',
            features: [
                { icon: 'fa-building', title: 'Diagnóstico', desc: 'Análisis profundo de procesos y oportunidades de automatización' },
                { icon: 'fa-chart-pie', title: 'ROI Garantizado', desc: '3x retorno de inversión promedio en el primer año' },
                { icon: 'fa-cogs', title: 'Automatización', desc: 'Sistemas optimizados para cada proceso' },
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
                            <span className="inline-block px-4 py-1 bg-[#4DA8C4]/10 rounded-full text-xs font-normal uppercase tracking-widest text-[#4DA8C4] mb-4">
                                {pilar.subtitle}
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] mb-2 tracking-tight">
                                {pilar.title}
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed font-normal max-w-xl">
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
                                    <h4 className="font-normal text-[#004B63] mb-1">{feature.title}</h4>
                                    <p className="text-base text-slate-600 leading-relaxed font-normal">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 pt-8 border-t border-[#E2E8F0]">
                        <button 
                            onClick={() => { onClose(); window.location.href = `/${pilar.id}`; }}
                            className="btn-glow inline-flex items-center gap-3 px-10 py-4 font-normal rounded-full font-montserrat bg-white"
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
const Ecosystem = memo(() => {
    const [selectedPilar, setSelectedPilar] = useState(null);
    const sectionRef = useRef(null);

    const pilares = [
        {
            id: 'neuroentorno', icon: 'fa-brain', title: 'NeuroEntornos Escolares', subtitle: 'Pilar 1',
            desc: 'Diagnóstico VAK, IA Lab con Valerio, SmartBoard y herramientas neuropedagógicas.',
            stats: [{ num: '6,000+', label: 'Estudiantes' }, { num: '98%', label: 'Efectividad' }],
            onNavigate: () => window.location.href = '/neuroentorno'
        },
        {
            id: 'ialab', icon: 'fa-robot', title: 'Laboratorio IA', subtitle: 'Certificación Profesional',
            desc: 'Aprende inteligencia artificial, crea prompts y obtén tu certificación.',
            stats: [{ num: '5', label: 'Módulos' }, { num: '100%', label: 'Online' }],
            onNavigate: () => window.location.href = '/ialab'
        },
        {
            id: 'consultoria', icon: 'fa-handshake', title: 'Consultoría B2B y Automatización', subtitle: 'Pilar 3',
            desc: 'Transformación digital, agentes IA personalizados y ROI garantizado.',
            stats: [{ num: '100+', label: 'Instituciones' }, { num: '3x', label: 'ROI Promedio' }],
            onNavigate: () => window.location.href = '/consultoria'
        }
    ];

  return (
    <section id="ecosystem" ref={sectionRef} className="relative w-full overflow-hidden bg-[#F8FAFC]">
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#4DA8C4]/5 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#66CCCC]/5 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            
            {/* Floating decorative elements */}
            <div className="absolute top-[15%] right-[20%] w-3 h-3 bg-[#4DA8C4]/40 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] left-[10%] w-2 h-2 bg-[#66CCCC]/50 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <div className="absolute bottom-[20%] right-[15%] w-4 h-4 bg-[#FFD166]/30 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] tracking-tight mb-4">
                        Ecosistema
                        <span className="block gradient-text-animated">
                            Interconectado.
                        </span>
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal">
                        Accede a herramientas estructuradas para potenciar la educación mediante la sinergia de neuro-ciencia e inteligencia artificial.
                    </p>
                </motion.div>

                {/* 3D Perspective Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-3d">
                    {/* TARJETA 01 */}
                    <motion.div 
                        className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_20px_60px_rgba(77,168,196,0.35)] transition-all duration-300 cursor-pointer relative"
                        onClick={() => setSelectedPilar(pilares[0])}
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Glow border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#4DA8C4]/40 transition-all duration-300 animate-[border-glow_3s_ease-in-out_infinite]" />
                        
                        <div className="h-56 w-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004B63]/30 to-transparent z-10" />
                            <img src="/images/eco-neuro.webp" alt="Neuro-Entorno Educativo" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6 relative z-10">
                            <CardWithLottie animationData={brainAnimation}>
                                <h3 className="text-xl font-normal text-[#004B63] uppercase mt-6 mb-4 group-hover:glow-text-cyan transition-all duration-300">Neuro-Entorno Educativo</h3>
                                <p className="text-gray-600 leading-relaxed">Acompañamiento integral basado en metodologías VAK y STEAM. Docentes con maestría analizan procesos psicológicos y académicos para potenciar cada estilo de aprendizaje con herramientas de IA personalizadas.</p>
                            </CardWithLottie>
                        </div>
                    </motion.div>

                    {/* TARJETA 02 */}
                    <motion.div 
                        className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_20px_60px_rgba(77,168,196,0.35)] transition-all duration-300 cursor-pointer relative"
                        onClick={() => setSelectedPilar(pilares[1])}
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Glow border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#66CCCC]/40 transition-all duration-300 animate-[border-glow_3s_ease-in-out_infinite]" style={{ animationDelay: '-1.5s' }} />
                        
                        <div className="h-56 w-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004B63]/30 to-transparent z-10" />
                            <img src="/images/eco-nacional.webp" alt="Proyectos de Impacto Nacional" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6 relative z-10">
                            <CardWithLottie animationData={awardAnimation}>
                                <h3 className="text-xl font-normal text-[#004B63] uppercase mt-6 mb-4 group-hover:glow-text-mint transition-all duration-300">Proyectos de Impacto Nacional</h3>
                                <p className="text-gray-600 leading-relaxed">Operadores oficiales SenaTIC. Certificamos a más de 6,000 estudiantes con respaldo internacional de IBM y Coursera. Maestros que forman maestros: más de 200 docentes colombianos transformados en líderes digitales.</p>
                            </CardWithLottie>
                        </div>
                    </motion.div>

                    {/* TARJETA 03 */}
                    <motion.div 
                        className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden hover:shadow-[0_20px_60px_rgba(77,168,196,0.35)] transition-all duration-300 cursor-pointer relative"
                        onClick={() => setSelectedPilar(pilares[2])}
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Glow border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#FFD166]/50 transition-all duration-300 animate-[border-glow_3s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
                        
                        <div className="h-56 w-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004B63]/30 to-transparent z-10" />
                            <img src="/images/edutech-carrusel-6.webp" alt="Consultoría B2B y Automatización" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6 relative z-10">
                            <CardWithLottie animationData={handshakeAnimation}>
                                <h3 className="text-xl font-normal text-[#004B63] uppercase mt-6 mb-4 group-hover:glow-text-cyan transition-all duration-300">Consultoría B2B y Automatización</h3>
                                <p className="text-gray-600 leading-relaxed">Transformamos organizaciones educativas y empresas con metodología STEAM aplicada. Agentes de IA personalizados y capacitación de alto nivel que generan productividad real desde el primer mes de implementación.</p>
                            </CardWithLottie>
                        </div>
                    </motion.div>
                </div>
            </div>

            <PilarModal pilar={selectedPilar} isOpen={!!selectedPilar} onClose={() => setSelectedPilar(null)} />
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
