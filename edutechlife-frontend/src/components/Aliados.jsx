import { memo, useEffect, useState, useRef } from 'react';

const Aliados = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const aliados = [
        { name: 'SENA', icon: 'fa-graduation-cap', color: '#F97316' },
        { name: 'UNESCO', icon: 'fa-landmark', color: '#3B82F6' },
        { name: 'Ministerio', icon: 'fa-university', color: '#EF4444' },
        { name: 'Google', icon: 'fa-search', color: '#4285F4' },
        { name: 'Microsoft', icon: 'fa-microsoft', color: '#00A4EF' },
        { name: 'AWS', icon: 'fa-cloud', color: '#FF9900' },
        { name: 'ICETEX', icon: 'fa-hand-holding-dollar', color: '#22C55E' },
        { name: 'Colciencias', icon: 'fa-flask', color: '#8B5CF6' },
        { name: 'Apple', icon: 'fa-apple-whole', color: '#64748B' },
        { name: 'STEAM', icon: 'fa-gears', color: '#14B8A6' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
            {/* Premium Header */}
            <div className={`max-w-7xl mx-auto px-6 lg:px-8 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center">
                    <span className="inline-block text-sm font-bold text-[#1B9EBA] uppercase tracking-widest mb-4">
                        Confían en nosotros
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#0A3044] mb-4">
                        Aliados Estratégicos
                    </h2>
                    <p className="text-[#64748B] max-w-2xl mx-auto">
                        Las mejores instituciones y empresas tecnológicas del mundo trabajan con nosotros.
                    </p>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative overflow-hidden">
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

                {/* Top Row - Moving Right */}
                <div className="flex mb-4">
                    <div className={`flex gap-8 animate-marquee-slow ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                        {[...aliados, ...aliados].map((aliado, index) => (
                            <div 
                                key={`top-${aliado.name}-${index}`}
                                className="flex-shrink-0"
                            >
                                <div className="w-[160px] h-[100px] bg-white rounded-2xl shadow-lg border border-[#E2E8F0] flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:border-[#1B9EBA]/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${aliado.color}20` }}
                                    >
                                        <i 
                                            className={`fa-solid ${aliado.icon} text-2xl`}
                                            style={{ color: aliado.color }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-[#0A3044]">{aliado.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row - Moving Left */}
                <div className="flex">
                    <div className={`flex gap-8 animate-marquee-slow-reverse ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                        {[...aliados.reverse(), ...aliados.reverse()].map((aliado, index) => (
                            <div 
                                key={`bottom-${aliado.name}-${index}`}
                                className="flex-shrink-0"
                            >
                                <div className="w-[160px] h-[100px] bg-white rounded-2xl shadow-lg border border-[#E2E8F0] flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:border-[#1B9EBA]/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${aliado.color}20` }}
                                    >
                                        <i 
                                            className={`fa-solid ${aliado.icon} text-2xl`}
                                            style={{ color: aliado.color }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-[#0A3044]">{aliado.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className={`max-w-7xl mx-auto px-6 lg:px-8 mt-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex flex-wrap justify-center gap-4">
                    {[
                        { icon: 'fa-award', text: 'Certificaciones Internacionales' },
                        { icon: 'fa-shield-halved', text: 'Estándares de Calidad' },
                        { icon: 'fa-globe', text: 'Alcance Global' }
                    ].map((badge, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm border border-[#E2E8F0]"
                        >
                            <i className={`fa-solid ${badge.icon} text-[#1B9EBA]`} />
                            <span className="text-sm font-medium text-[#334155]">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Aliados.displayName = 'Aliados';

export default Aliados;
