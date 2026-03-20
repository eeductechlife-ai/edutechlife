import { useState, useEffect, useRef } from 'react';

const useCounter = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let t0 = null;

        const step = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [start, target, duration]);

    return count;
};

const StatItem = ({ n, suffix, label, icon, live, start }) => {
    const count = useCounter(n, 2200, start);
    return (
        <div className="stat-item">
            <div className="stat-icon">
                <i className={`fa-solid ${icon}`} />
            </div>
            {live && <span className="stat-live-dot" />}
            <div className="stat-num">
                {n !== null ? count.toLocaleString() + suffix : 'Global'}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

const stats = [
    { n: 6000, suffix: '+', label: 'Estudiantes Certificados', icon: 'fa-graduation-cap', live: true },
    { n: 10, suffix: ' Años', label: 'Experiencia', icon: 'fa-clock' },
    { n: 200, suffix: '+', label: 'Docentes IA', icon: 'fa-chalkboard-user' },
    { n: null, suffix: '', label: 'Alianzas Globales', icon: 'fa-globe-americas' },
];

const StatsBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.3 }
        );

        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div 
            ref={ref}
            className="stats-bar mx-auto max-w-5xl reveal"
            style={{ marginTop: '3.5rem' }}
        >
            {stats.map((stat, i) => (
                <StatItem 
                    key={i} 
                    {...stat} 
                    start={isVisible}
                />
            ))}
        </div>
    );
};

export default StatsBar;
