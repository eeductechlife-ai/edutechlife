import { memo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import SplitTextReveal from './SplitTextReveal';
import FloatingParticles from './FloatingParticles';
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
            {/* Floating Particles Background */}
            <FloatingParticles count={25} className="z-0" />
            
            {/* Soft Ambient Glows - Enhanced with 3D Effect */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#4DA8C4]/10 blur-[120px] pointer-events-none will-change-transform animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#66CCCC]/10 blur-[120px] pointer-events-none will-change-transform animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            
            {/* Additional 3D Ambient Elements */}
            <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-[#4DA8C4]/30 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-[60%] right-[15%] w-3 h-3 bg-[#66CCCC]/40 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#FFD166]/30 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column - Typography & CTAs */}
                    <div className="text-center lg:text-left pt-10 lg:pt-0">
                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#4DA8C4]/10 backdrop-blur-md rounded-full mb-10 border border-[#4DA8C4]/30 shadow-[0_0_20px_rgba(77,168,196,0.2)]"
                        >
                            <span className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse shadow-[0_0_10px_#4DA8C4]" />
                            <span className="text-xs font-normal text-[#004B63] uppercase tracking-[0.2em] block">
                                Neuro-Métricas V2 Activas
                            </span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#004B63] tracking-tight leading-tight mb-8"
                        >
                            <SplitTextReveal text="Liderando la Educación del Futuro" />
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base text-slate-600 leading-relaxed font-normal mb-12 max-w-xl mx-auto lg:mx-0"
                        >
                            Infraestructura cognitiva asistida por inteligencia artificial. Tu entorno de aprendizaje evoluciona y se ajusta <span className="text-[#004B63]">en tiempo real</span> a tu neuro-ergonomía.
                        </motion.p>

                        {/* Stats Container with Glassmorphism and Glow */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            ref={statsRef} 
                            className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 mb-12 inline-flex flex-wrap justify-center lg:justify-start gap-8 relative overflow-hidden"
                        >
                            {/* Animated Border Glow */}
                            <div className="absolute inset-0 border border-[#4DA8C4]/20 rounded-2xl animate-[border-glow_3s_ease-in-out_infinite]" />
                            
                            <div className="text-left relative z-10">
                                <div className="text-4xl font-black text-[#004B63] font-montserrat tracking-tight mb-1 glow-text-cyan">
                                    {countEstudiantes.toLocaleString()}+
                                </div>
                                <div className="text-sm font-normal text-gray-600 uppercase tracking-widest">
                                    Estudiantes
                                </div>
                            </div>
                            <div className="text-left border-l border-gray-200/50 pl-8 relative z-10">
                                <div className="text-4xl font-black text-[#4DA8C4] font-montserrat tracking-tight mb-1">
                                    {countExito}%
                                </div>
                                <div className="text-sm font-normal text-gray-600 uppercase tracking-widest">
                                    Tasa Éxito
                                </div>
                            </div>
                            <div className="text-left border-l border-gray-200/50 pl-8 relative z-10">
                                <div className="text-4xl font-black text-[#66CCCC] font-montserrat tracking-tight mb-1">
                                    {countAños}+
                                </div>
                                <div className="text-sm font-normal text-gray-600 uppercase tracking-widest">
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
                                className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold bg-gradient-to-r from-[#004B63] to-[#006a8e] text-white hover:shadow-[0_0_30px_rgba(77,168,196,0.6)] transition-all duration-300 border border-[#4DA8C4]/30"
                            >
                                <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
                                <span className="text-white relative z-10">Inicializar IA Lab</span>
                                <Icon name="fa-arrow-right" className="text-white/80 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                            </MagneticButton>
                            
                            <MagneticButton 
                                onClick={() => onNavigate('consultoria')}
                                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-bold bg-transparent border-2 border-[#004B63] text-[#004B63] hover:bg-[#004B63] hover:text-white hover:shadow-[0_0_20px_rgba(77,168,196,0.4)] transition-all duration-300"
                            >
                                <Icon name="fa-briefcase" className="text-[#004B63] group-hover:text-white transition-colors" />
                                Integración B2B
                            </MagneticButton>
                        </motion.div>
                    </div>

                    {/* Right Column - 3D Video Hero with Enhanced Glow */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="pt-10 lg:pt-0 flex items-center justify-center perspective-3d"
                    >
                        <div className="relative w-full max-w-lg lg:max-w-xl aspect-square flex items-center justify-center transform-style-3d">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4DA8C4]/20 to-[#66CCCC]/10 blur-xl animate-[pulse-glow_3s_ease-in-out_infinite]" />
                            
                            {/* Video WebM con fondo transparente - Simula orbe de IA */}
                            <video 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl relative z-10"
                                style={{ filter: 'drop-shadow(0 0 40px rgba(77, 168, 196, 0.6))' }}
                            >
                                <source src="/videos/ai-orb.webm" type="video/webm" />
                            </video>
                            
                            {/* Fallback: Gradiente animado si no hay video - Enhanced */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#4DA8C4]/30 to-[#66CCCC]/20 animate-pulse-glow blur-xl" />
                                <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#004B63]/20 to-transparent animate-[pulse-slow_4s_ease-in-out_infinite]" />
                            </div>
                            
                            {/* Floating decorative elements */}
                            <div className="absolute w-20 h-20 border border-[#4DA8C4]/20 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-2s', transform: 'translateZ(-20px)' }} />
                            <div className="absolute w-32 h-32 border border-[#66CCCC]/10 rounded-full animate-[float-3d_10s_ease-in-out_infinite]" style={{ animationDelay: '-5s', transform: 'translateZ(-40px)' }} />
                        </div>
                    </motion.div>
                </div>
            </div>
            
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
