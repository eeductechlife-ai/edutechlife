import { useState, useEffect, useRef } from 'react';
import SectionWrapper from './SectionWrapper';

const useAnimatedCounter = (target, duration = 2500, start = false) => {
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!start) return;
        
        setIsAnimating(true);
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * target));
            
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };
        
        frameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [start, target, duration]);

    return { count, isAnimating };
};

const StatItem = ({ n, suffix, label, icon, live, start, delay = 0 }) => {
    const { count, isAnimating } = useAnimatedCounter(n, 2200, start);
    const [showContent, setShowContent] = useState(false);
    
    useEffect(() => {
        if (start) {
            const timer = setTimeout(() => setShowContent(true), delay);
            return () => clearTimeout(timer);
        }
        setShowContent(false);
    }, [start, delay]);
    
    return (
        <div className={`stat-item transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`stat-icon transition-transform duration-500 ${showContent ? 'scale-100' : 'scale-0'}`}>
                <i className={`fa-solid ${icon}`} />
            </div>
            {live && (
                <div className="stat-live-dot-container">
                    <span className="live-pulse-ring" />
                    <span className="stat-live-dot" />
                </div>
            )}
            <div className={`stat-num ${isAnimating ? 'animating' : ''}`}>
                {n !== null ? count.toLocaleString() + suffix : 'Global'}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

const stats = [
    { n: 6000, suffix: '+', label: 'Estudiantes Certificados', icon: 'fa-graduation-cap', live: true, delay: 0 },
    { n: 10, suffix: '+', label: 'Años de Experiencia', icon: 'fa-clock', delay: 150 },
    { n: 200, suffix: '+', label: 'Docentes IA', icon: 'fa-chalkboard-user', delay: 300 },
    { n: 50, suffix: '+', label: 'Alianzas Globales', icon: 'fa-globe-americas', delay: 450 },
];

const StatsBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );

        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

     return (
        <SectionWrapper spacing="sm">
             <section className="w-full bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div 
                    ref={ref}
                    className="stats-bar mx-auto max-w-5xl reveal mt-0"
                >
                    {stats.map((stat, i) => (
                        <StatItem 
                            key={i} 
                            {...stat} 
                            start={isVisible}
                        />
                    ))}
                </div>
            </div>
        </SectionWrapper>
        </SectionWrapper>
    );
};

export default StatsBar;
