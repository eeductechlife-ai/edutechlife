import { useState, useEffect, useRef } from 'react';

const useCountUp = (end, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasStarted, startOnView]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime;
        let animationId;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [hasStarted, end, duration]);

    return { count, ref };
};

const StatsBar = () => {
    const students = useCountUp(20000, 2500);
    const research = useCountUp(3, 1500);
    const ai = useCountUp(100, 2000);

    const stats = [
        {
            number: students.count,
            suffix: '+',
            label: 'Estudiantes',
            sublabel: 'Formados en todo el pais',
            icon: 'fa-users',
        },
        {
            number: research.count,
            suffix: '',
            label: 'Lineas de Investigacion',
            sublabel: 'En pedagologia y tecnologia',
            icon: 'fa-microscope',
        },
        {
            number: ai.count,
            suffix: '%',
            label: 'IA Nativa',
            sublabel: 'Plataforma 100% inteligente',
            icon: 'fa-robot',
        },
    ];

    return (
        <section className="stats-section" ref={students.ref}>
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card glass-card">
                        <div className="stat-icon-wrap">
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                <span className="stat-value">
                                    {stat.number.toLocaleString('es-CO')}
                                </span>
                                <span className="stat-suffix">{stat.suffix}</span>
                            </div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-sublabel">{stat.sublabel}</div>
                        </div>
                        <div className="stat-decoration">
                            <div className="stat-line"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsBar;
