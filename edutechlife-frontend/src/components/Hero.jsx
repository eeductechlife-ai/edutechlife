import { memo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        
        frameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [start, target, duration]);

    return count;
};

const AnimatedStat = ({ value, label, icon, gradient, start, delay, index }) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    const count = useAnimatedCounter(numericValue, 1800 + index * 200, start);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={start ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: delay / 1000, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative hyper-glass rounded-2xl px-6 py-5 min-w-[160px] overflow-hidden"
        >
            <div className={`absolute top-0 left-4 right-4 h-1 rounded-b-full bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(77,168,196,0.3)] transition-transform duration-300 group-hover:scale-110`}>
                <i className={`fa-solid ${icon} text-xl text-white`} />
            </div>
            
            <div className="text-3xl md:text-4xl font-black text-white leading-none mb-1 tabular-nums drop-shadow-md">
                {count.toLocaleString()}{suffix}
            </div>
            
            <div className="text-sm font-medium text-gray-400">
                {label}
            </div>
            
            <div className="absolute -top-1 -right-1 w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corporate opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-corporate" />
            </div>
        </motion.div>
    );
};

// Word reveal animation variants
const textContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
};

const textChild = {
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)'
    },
};

const Hero = memo(({ onNavigate }) => {
    const [mounted, setMounted] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setStatsVisible(true);
            },
            { threshold: 0.2 }
        );
        
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        { value: '6000', suffix: '+', label: 'Estudiantes', icon: 'fa-users', gradient: 'from-[#4DA8C4] to-[#004B63]' },
        { value: '98', suffix: '%', label: 'Tasa de Éxito', icon: 'fa-trophy', gradient: 'from-[#004B63] to-[#4DA8C4]' },
        { value: '10', suffix: '+', label: 'Años Refinando', icon: 'fa-clock', gradient: 'from-[#8B5CF6] to-[#004B63]' }
    ];

    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden font-montserrat tracking-tight pb-20 pt-32">
            
            {/* The global Mesh Background takes care of base colors, but let's add specific hero orbs */}
            <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-[#4DA8C4]/10 blur-[120px] mix-blend-screen pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left - Typography & Reveal */}
                    <div className="text-center lg:text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-8 border border-white/10 hyper-glass"
                        >
                            <span className="w-2 h-2 bg-corporate rounded-full animate-pulse shadow-[0_0_10px_#4DA8C4]" />
                            <span className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Neural Learning Core V2</span>
                        </motion.div>

                        <motion.div
                            variants={textContainer}
                            initial="hidden"
                            animate="visible"
                            className="mb-6 font-black leading-[1.05]"
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl">
                                <motion.span variants={textChild} className="block text-white drop-shadow-lg">
                                    Inteligencia
                                </motion.span>
                                <motion.span variants={textChild} className="block text-transparent bg-clip-text bg-gradient-to-r from-corporate to-[#8B5CF6] filter drop-shadow-[0_0_20px_rgba(77,168,196,0.3)]">
                                    Pedagógica
                                </motion.span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-open-sans font-light"
                        >
                            No es solo información. Es un <span className="font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">ecosistema neuronal</span> cognitivo diseñado para mapear tu potencial absoluto.
                        </motion.p>

                        <div ref={statsRef} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                            {stats.map((stat, index) => (
                                <AnimatedStat key={index} {...stat} start={statsVisible} delay={index * 150} index={index} />
                            ))}
                        </div>

                        {/* CTA Buttons - Premium Glow */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="group btn-glow flex items-center justify-center gap-3 px-8 py-5 rounded-full text-lg shadow-lg font-bold"
                            >
                                <i className="fa-solid fa-bolt text-corporate drop-shadow-[0_0_10px_#4DA8C4]" />
                                Sincronizar IA Lab
                                <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-2" />
                            </button>
                            <button 
                                onClick={() => onNavigate('consultoria')}
                                className="group flex items-center justify-center gap-3 px-8 py-5 rounded-full text-lg font-bold border border-white/10 hover:border-corporate/50 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 text-gray-200"
                            >
                                <i className="fa-solid fa-building text-gray-400 group-hover:text-corporate transition-colors" />
                                Protocolos B2B
                            </button>
                        </motion.div>
                    </div>

                    {/* Right - Glassmorphism Dashboard */}
                    <div className="relative pt-10 lg:pt-0">
                        <motion.div 
                            initial={{ opacity: 0, x: 50, rotateY: -10, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 1.2, delay: 0.6, type: 'spring', damping: 20 }}
                            style={{ perspective: 1000 }}
                        >
                            <div className="relative hyper-glass shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 md:p-8 transform-style-3d">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-corporate animate-pulse shadow-[0_0_10px_#4DA8C4]" />
                                        <span className="font-bold text-gray-200 uppercase tracking-widest text-xs">Terminal Neuronal</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                </div>

                                {/* Flow Preview */}
                                <div className="space-y-6 mb-8 relative">
                                    <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-corporate to-transparent opacity-30" />
                                    
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-corporate/20 border border-corporate/50 flex items-center justify-center flex-shrink-0 backdrop-blur-md z-10 shadow-[0_0_15px_rgba(77,168,196,0.4)]">
                                            <i className="fa-solid fa-server text-corporate text-sm" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 max-w-[85%] backdrop-blur-md shadow-lg">
                                            <p className="text-sm font-mono text-gray-300">
                                                &gt; Secuencia VAK iniciada.<br/>
                                                &gt; Calibrando sensores cognitivos...
                                            </p>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }} className="flex items-start gap-4 justify-end">
                                        <div className="bg-corporate/10 border border-corporate/30 rounded-2xl rounded-tr-none p-4 max-w-[85%] backdrop-blur-md shadow-[0_0_15px_rgba(77,168,196,0.1)]">
                                            <p className="text-sm font-mono text-corporate">
                                                [Estudiante responde: Kinestésico predominante]
                                            </p>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6 }} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 backdrop-blur-md z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                                            <i className="fa-solid fa-brain text-purple-400 text-sm" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 max-w-[85%] backdrop-blur-md shadow-lg">
                                            <p className="text-sm font-mono text-gray-300 leading-relaxed">
                                                &gt; Modificando rutas de aprendizaje...<br/>
                                                &gt; Generando módulos interactivos físicos.<br/>
                                                <span className="text-green-400">&gt; 100% Optimizado.</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Enlace Estable</span>
                                    </div>
                                    <div className="text-xs font-mono text-corporate">
                                        &gt; LATENCIA: 8ms
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Floating Neuromorphic Nodes */}
                        <motion.div 
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} 
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 w-20 h-20 hyper-glass rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(77,168,196,0.3)] z-50 border border-corporate/40"
                        >
                            <i className="fa-solid fa-atom text-3xl text-corporate" />
                        </motion.div>
                        <motion.div 
                            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }} 
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-6 w-16 h-16 hyper-glass rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] z-50 border border-purple-500/40"
                        >
                            <i className="fa-solid fa-code-branch text-2xl text-purple-400" />
                        </motion.div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
