import { memo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import FloatingParticles from './FloatingParticles';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

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

const Hero = memo(() => {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const navigate = useNavigate();
    const [statsVisible, setStatsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setStatsVisible(true);
        }, { threshold: 0.2 });
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const countEstudiantes = useAnimatedCounter(6000, 1800, statsVisible);
    const countExito = useAnimatedCounter(90, 2000, statsVisible);
    const countAños = useAnimatedCounter(10, 2200, statsVisible);

    return (
        <section 
            ref={heroRef} 
            className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
        >
            <FloatingParticles count={45} className="z-0" />
            
            <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-primary-light/15 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-mint/12 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} />
            <div className="absolute top-[50%] left-[5%] w-2 h-2 bg-soft-blue/10 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-[8%] right-[8%] w-3 h-3 bg-primary-light/15 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" />
            <div className="absolute top-[20%] right-[5%] w-2 h-2 bg-mint/12 rounded-full animate-[float-3d_10s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] right-[12%] w-4 h-4 bg-soft-blue/10 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" />
            <div className="absolute top-[60%] right-[8%] w-3 h-3 bg-primary-light/12 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" />
            <div className="absolute top-[75%] right-[15%] w-2 h-2 bg-mint/10 rounded-full animate-[float-3d_11s_ease-in-out_infinite]" />
            <div className="absolute bottom-[20%] right-[10%] w-3 h-3 bg-soft-blue/8 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[40%] right-[20%] w-2 h-2 bg-primary-light/10 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" />
            
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-primary-light/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-petroleum tracking-tighter leading-[0.9] mb-6"
                    >
                        {t('hero.title_line1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">
                            {t('hero.title_line2')}
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal mb-10 max-w-2xl"
                    >
                        {t('hero.subtitle_before')}<span className="text-petroleum font-semibold">{t('hero.subtitle_highlight')}</span>{t('hero.subtitle_after')}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        ref={statsRef} 
                        className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-10"
                    >
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-petroleum tracking-tight mb-1">
                                {countEstudiantes.toLocaleString()}+
                            </div>
                            <div className="text-xs font-normal text-slate-500 uppercase tracking-widest">
                                {t('hero.stat_estudiantes')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-primary-light tracking-tight mb-1">
                                {countExito}%
                            </div>
                            <div className="text-xs font-normal text-slate-500 uppercase tracking-widest">
                                {t('hero.stat_exito')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black text-mint tracking-tight mb-1">
                                {countAños}+
                            </div>
                            <div className="text-xs font-normal text-slate-500 uppercase tracking-widest">
                                {t('hero.stat_anios_experiencia')}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
                    >
                        <MagneticButton 
                            onClick={() => navigate('/conoce-smartboard')}
                            className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-primary-light text-white shadow-premium-lg hover:bg-petroleum hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
                            <span className="text-white relative z-10 font-semibold">{t('hero.cta_conoce_smartboard')}</span>
                            <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
                        </MagneticButton>
                        
                        <MagneticButton 
                            onClick={() => navigate('/smartboard')}
                            className="group flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-transparent border-2 border-petroleum text-petroleum hover:bg-petroleum hover:text-white transition-all duration-300"
                        >
                            <Icon name="fa-chalkboard" className="text-petroleum group-hover:text-white transition-colors duration-300" />
                            <span className="font-semibold">{t('hero.cta_smartboard')}</span>
                        </MagneticButton>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
