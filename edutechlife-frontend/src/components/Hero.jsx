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
        <section 
            ref={heroRef} 
            className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Floating Particles Background */}
            <FloatingParticles count={45} className="z-0" />
            
            {/* Ambient Elements - Left */}
            <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-[#4DA8C4]/15 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#66CCCC]/12 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} />
            <div className="absolute top-[50%] left-[5%] w-2 h-2 bg-[#B2D8E5]/10 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
            
            {/* Ambient Elements - Right */}
            <div className="absolute top-[8%] right-[8%] w-3 h-3 bg-[#4DA8C4]/15 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" />
            <div className="absolute top-[20%] right-[5%] w-2 h-2 bg-[#66CCCC]/12 rounded-full animate-[float-3d_10s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] right-[12%] w-4 h-4 bg-[#B2D8E5]/10 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" />
            <div className="absolute top-[60%] right-[8%] w-3 h-3 bg-[#4DA8C4]/12 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" />
            <div className="absolute top-[75%] right-[15%] w-2 h-2 bg-[#66CCCC]/10 rounded-full animate-[float-3d_11s_ease-in-out_infinite]" />
            <div className="absolute bottom-[20%] right-[10%] w-3 h-3 bg-[#B2D8E5]/8 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[40%] right-[20%] w-2 h-2 bg-[#4DA8C4]/10 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" />
            
            {/* Center Glow */}
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-[#4DA8C4]/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Content - Centered Layout */}
                <div className="flex flex-col items-center justify-center text-center">
                    
                    {/* Badge - Floating Clean */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                    >
                        <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse" />
                        <span className="text-xs font-normal text-[#004B63] uppercase tracking-[0.2em] font-mono">
                            Neuro-Métricas V2 Activas
                        </span>
                    </motion.div>

                    {/* Title - Floating Clean */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#004B63] tracking-tight leading-tight mb-6 font-montserrat"
                    >
                        <SplitTextReveal text="Liderando la Educación del Futuro" />
                    </motion.h1>

                    {/* Subtitle - Floating Clean */}
                    <motion.p 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal mb-10 max-w-2xl"
                    >
                        Infraestructura cognitiva asistida por inteligencia artificial. Tu entorno de aprendizaje evoluciona y se ajusta <span className="text-[#004B63] font-semibold">en tiempo real</span> a tu neuro-ergonomía.
                    </motion.p>

                    {/* Stats Row - Clean Floating */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        ref={statsRef} 
                        className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-10"
                    >
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-[#004B63] font-montserrat tracking-tight mb-1">
                                {countEstudiantes.toLocaleString()}+
                            </div>
                            <div className="text-xs font-normal text-[#64748B] uppercase tracking-widest">
                                Estudiantes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-[#4DA8C4] font-montserrat tracking-tight mb-1">
                                {countExito}%
                            </div>
                            <div className="text-xs font-normal text-[#64748B] uppercase tracking-widest">
                                Tasa Éxito
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-[#66CCCC] font-montserrat tracking-tight mb-1">
                                {countAños}+
                            </div>
                            <div className="text-xs font-normal text-[#64748B] uppercase tracking-widest">
                                Años Refinando
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Buttons - Clean Container */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
                    >
                        {/* Primary CTA */}
                        <MagneticButton 
                            onClick={() => onNavigate('ialab')}
                            className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-[#4DA8C4] text-white shadow-lg hover:bg-[#004B63] hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
                            <span className="text-white relative z-10 font-semibold">Conoce el SmartBoard</span>
                            <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
                        </MagneticButton>
                        
                        {/* Secondary CTA - Ghost Style */}
                        <MagneticButton 
                            onClick={() => onNavigate('smartboard')}
                            className="group flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-transparent border-2 border-[#004B63] text-[#004B63] hover:bg-[#004B63] hover:text-white transition-all duration-300"
                        >
                            <Icon name="fa-chalkboard" className="text-[#004B63] group-hover:text-white transition-colors duration-300" />
                            <span className="font-semibold">SmartBoard</span>
                        </MagneticButton>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
