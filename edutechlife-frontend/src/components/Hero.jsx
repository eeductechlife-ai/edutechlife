import { memo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import SplitTextReveal from './SplitTextReveal';
import { Icon } from '../utils/iconMapping.jsx';

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
                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-8 border border-[#E2E8F0] shadow-sm"
                        >
                            <span className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse shadow-[0_0_8px_#4DA8C4]" />
                            <span className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest block">
                                Neuro-Métricas V2 Activas
                            </span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#004B63] tracking-tight leading-tight mb-6"
                        >
                            <SplitTextReveal text="Liderando la Educación del Futuro" />
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base md:text-lg text-gray-600 leading-relaxed font-normal mb-10 max-w-xl mx-auto lg:mx-0"
                        >
                            Infraestructura cognitiva asistida por inteligencia artificial. Tu entorno de aprendizaje evoluciona y se ajusta <span className="font-semibold text-[#004B63]">en tiempo real</span> a tu neuro-ergonomía.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            ref={statsRef} 
                            className="flex flex-wrap justify-center lg:justify-start gap-8 mb-12"
                        >
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
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <MagneticButton 
                                onClick={() => onNavigate('ialab')}
                                className="group btn-glow shadow-neuro-hover flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold font-montserrat"
                            >
                                <span className="text-[#004B63] group-hover:text-corporate transition-colors">Inicializar IA Lab</span>
                                <Icon name="fa-arrow-right" className="text-[#4DA8C4] transition-transform duration-300 group-hover:translate-x-1" />
                            </MagneticButton>
                            
                            <MagneticButton 
                                onClick={() => onNavigate('consultoria')}
                                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold font-montserrat bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-[#4DA8C4]/50 transition-all duration-300 text-[#004B63]"
                            >
                                <Icon name="fa-briefcase" className="text-[#64748B] group-hover:text-[#004B63] transition-colors" />
                                Integración B2B
                            </MagneticButton>
                        </motion.div>
                    </div>

                    {/* Right Column - 3D Video Hero */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="pt-10 lg:pt-0 flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-lg lg:max-w-xl aspect-square flex items-center justify-center">
                            {/* Video WebM con fondo transparente - Simula orbe de IA */}
                            <video 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                                style={{ filter: 'drop-shadow(0 0 30px rgba(77, 168, 196, 0.4))' }}
                            >
                                <source src="/videos/ai-orb.webm" type="video/webm" />
                            </video>
                            
                            {/* Fallback: Gradiente animado si no hay video */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#4DA8C4]/30 to-[#66CCCC]/20 animate-pulse-glow blur-xl" />
                                <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#004B63]/20 to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
