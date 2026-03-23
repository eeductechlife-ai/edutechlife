import { memo, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';

// ==========================================
// Magnetic Button Component
// ==========================================
const MagneticButton = ({ children, className, onClick }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        // Attract cursor subtly up to 20px
        const x = (clientX - (left + width / 2)) * 0.25; 
        const y = (clientY - (top + height / 2)) * 0.25;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

// ==========================================
// 3D Parallax Glass Orb Component
// ==========================================
const GlassOrb = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
    
    // Reverse movement for parallax feeling
    const translateX = useTransform(mouseXSpring, [-1, 1], [30, -30]);
    const translateY = useTransform(mouseYSpring, [-1, 1], [30, -30]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            x.set(e.clientX / width - 0.5);
            y.set(e.clientY / height - 0.5);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none perspective-1000">
            {/* Primary Orb Layer */}
            <motion.div 
                style={{ translateX, translateY }}
                className="absolute w-80 h-80 rounded-full border border-white/60 bg-gradient-to-br from-white/80 to-[#B2D8E5]/30 backdrop-blur-xl shadow-neuro flex items-center justify-center"
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Inner Core */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#66CCCC]/40 to-[#4DA8C4]/40 blur-lg animate-pulse" />
                
                {/* Surface Reflection */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/60 rounded-full blur-md opacity-80" />
            </motion.div>

            {/* Orbiting Satellite Data Nodes */}
            <motion.div 
                style={{ translateX: translateY, translateY: translateX }}
                className="absolute w-20 h-20 rounded-2xl border border-white/80 bg-white/40 backdrop-blur-lg shadow-neuro-hover right-[15%] top-[20%] flex items-center justify-center transform rotate-12"
                animate={{ y: [10, -10, 10], rotate: [12, -5, 12] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <i className="fa-solid fa-atom text-2xl text-[#004B63]" />
            </motion.div>

            <motion.div 
                style={{ translateX: useTransform(mouseXSpring, [-1, 1], [40, -40]), translateY: useTransform(mouseYSpring, [-1, 1], [-40, 40]) }}
                className="absolute w-16 h-16 rounded-full border border-[#4DA8C4]/30 bg-[#4DA8C4]/10 backdrop-blur-md shadow-sm left-[20%] bottom-[25%] flex items-center justify-center"
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <i className="fa-solid fa-brain text-xl text-[#004B63]" />
            </motion.div>
        </div>
    );
};

// ==========================================
// Animated Counter for Stats
// ==========================================
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
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [start, target, duration]);

    return count;
};

// ==========================================
// Hero Component
// ==========================================
const Hero = memo(({ onNavigate }) => {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    // Initial GSAP Reveal Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".gsap-reveal", 
                { opacity: 0, y: 40, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power3.out" }
            );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // Intersection Observer for Stats Counter
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setStatsVisible(true);
        }, { threshold: 0.2 });
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const countEstudiantes = useAnimatedCounter(6000, 1800, statsVisible);
    const countExito = useAnimatedCounter(98, 2000, statsVisible);
    const countAños = useAnimatedCounter(10, 2200, statsVisible);

    return (
        <section ref={heroRef} className="relative w-full min-h-screen flex items-center overflow-hidden font-open-sans">
            {/* Soft Ambient Glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#4DA8C4]/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#66CCCC]/10 blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column - Typography & CTAs */}
                    <div className="text-center lg:text-left pt-10 lg:pt-0">
                        <div className="gsap-reveal inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-8 border border-[#E2E8F0] shadow-sm">
                            <span className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse shadow-[0_0_8px_#4DA8C4]" />
                            <span className="text-xs font-bold text-[#004B63] uppercase tracking-widest font-montserrat">
                                Neuro-Métricas V2 Activas
                            </span>
                        </div>

                        <h1 className="gsap-reveal text-6xl md:text-7xl lg:text-8xl font-black font-montserrat tracking-[-0.03em] leading-[1.05] mb-6 text-[#004B63]">
                            Educación que se 
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                                Adapta a ti.
                            </span>
                        </h1>

                        <p className="gsap-reveal text-xl md:text-2xl text-[#64748B] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Infraestructura cognitiva asistida por inteligencia artificial. Tu entorno de aprendizaje evoluciona y se ajusta <span className="font-semibold text-[#004B63]">en tiempo real</span> a tu neuro-ergonomía.
                        </p>

                        <div ref={statsRef} className="gsap-reveal flex flex-wrap justify-center lg:justify-start gap-8 mb-12">
                            <div className="text-left">
                                <div className="text-4xl font-black text-[#004B63] font-montserrat tracking-tight mb-1">
                                    {countEstudiantes.toLocaleString()}+
                                </div>
                                <div className="text-sm font-semibold text-[#64748B] uppercase tracking-widest">
                                    Estudiantes
                                </div>
                            </div>
                            <div className="text-left border-l border-[#E2E8F0] pl-8">
                                <div className="text-4xl font-black text-[#4DA8C4] font-montserrat tracking-tight mb-1">
                                    {countExito}%
                                </div>
                                <div className="text-sm font-semibold text-[#64748B] uppercase tracking-widest">
                                    Tasa Éxito
                                </div>
                            </div>
                            <div className="text-left border-l border-[#E2E8F0] pl-8">
                                <div className="text-4xl font-black text-[#66CCCC] font-montserrat tracking-tight mb-1">
                                    {countAños}+
                                </div>
                                <div className="text-sm font-semibold text-[#64748B] uppercase tracking-widest">
                                    Años Refinando
                                </div>
                            </div>
                        </div>

                        <div className="gsap-reveal flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <MagneticButton 
                                onClick={() => onNavigate('ialab')}
                                className="group btn-glow shadow-neuro-hover flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold font-montserrat"
                            >
                                <span className="text-[#004B63] group-hover:text-corporate transition-colors">Inicializar IA Lab</span>
                                <i className="fa-solid fa-arrow-right text-[#4DA8C4] transition-transform duration-300 group-hover:translate-x-1" />
                            </MagneticButton>
                            
                            <MagneticButton 
                                onClick={() => onNavigate('consultoria')}
                                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold font-montserrat bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-[#4DA8C4]/50 transition-all duration-300 text-[#004B63]"
                            >
                                <i className="fa-solid fa-briefcase text-[#64748B] group-hover:text-[#004B63] transition-colors" />
                                Integración B2B
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Right Column - 3D Interactive Orb */}
                    <div className="gsap-reveal pt-10 lg:pt-0">
                        <GlassOrb />
                    </div>
                </div>
            </div>
            
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
