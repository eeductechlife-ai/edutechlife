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
            gradient: 'from-[#4DA8C4] to-[#66CCCC]',
        },
        {
            number: research.count,
            suffix: '',
            label: 'Lineas de Investigacion',
            sublabel: 'En pedagoxia y tecnologia',
            icon: 'fa-microscope',
            gradient: 'from-[#66CCCC] to-[#B2D8E5]',
        },
        {
            number: ai.count,
            suffix: '%',
            label: 'IA Nativa',
            sublabel: 'Plataforma 100% inteligente',
            icon: 'fa-robot',
            gradient: 'from-[#4DA8C4] to-[#66CCCC]',
        },
    ];

    return (
        <section ref={students.ref} className="relative py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-[#070B14] via-[#0A1628] to-[#070B14]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative flex items-center gap-5 p-6 sm:p-8
                                bg-white/[0.05] backdrop-blur-xl
                                border border-white/10 rounded-2xl
                                transition-all duration-500 ease-out
                                hover:bg-white/[0.08] hover:border-[#4DA8C4]/30 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                                before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#4DA8C4]/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
                        >
                            <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/10 transition-all duration-500 hover:rotate-[-5deg] hover:scale-105 hover:shadow-[0_8px_25px_rgba(77,168,196,0.4)]`}>
                                <i className={`fa-solid ${stat.icon} text-white text-xl`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="font-montserrat font-black text-4xl sm:text-5xl bg-gradient-to-r from-white to-[#B2D8E5] bg-clip-text text-transparent leading-none tracking-tight">
                                        {stat.number.toLocaleString('es-CO')}
                                    </span>
                                    <span className="font-montserrat font-black text-2xl bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] bg-clip-text text-transparent">
                                        {stat.suffix}
                                    </span>
                                </div>
                                <div className="font-montserrat font-bold text-base text-white mb-0.5 tracking-tight">
                                    {stat.label}
                                </div>
                                <div className="font-sans text-xs text-white/50 leading-relaxed">
                                    {stat.sublabel}
                                </div>
                            </div>

                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                                <div className="w-1 h-16 bg-gradient-to-b from-[#4DA8C4] to-transparent rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
