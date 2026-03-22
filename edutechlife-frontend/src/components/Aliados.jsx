import { memo, useEffect, useState, useRef } from 'react';

const Aliados = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const aliados = [
        { name: 'SENA', logo: 'SENA' },
        { name: 'UNESCO', logo: 'UNESCO' },
        { name: 'Ministerio de Educación', logo: 'MINED' },
        { name: 'Google for Education', logo: 'GFE' },
        { name: 'Microsoft Education', logo: 'MSE' },
        { name: 'AWS Educate', logo: 'AWS' },
        { name: 'ICETEX', logo: 'ICETEX' },
        { name: 'Colciencias', logo: 'COLC' },
        { name: 'Apple Education', logo: 'APE' },
        { name: 'Steam Education', logo: 'STEAM' }
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
        <section ref={sectionRef} className="w-full py-16 bg-gradient-to-r from-[#F8FAFC] via-white to-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block text-sm font-bold text-[#1B9EBA] uppercase tracking-widest mb-4">
                        Trabajamos con los mejores
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#0A3044] mb-4">
                        Aliados Estratégicos
                    </h2>
                    <p className="text-[#334155] max-w-2xl mx-auto">
                        Colaboramos con instituciones educativas y empresas líderes a nivel nacional e internacional para garantizar la mejor formación.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative overflow-hidden">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

                    {/* Marquee Container */}
                    <div className="flex overflow-hidden">
                        <div className={`flex gap-12 animate-marquee ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                            {[...aliados, ...aliados, ...aliados, ...aliados].map((aliado, index) => (
                                <div 
                                    key={`${aliado.name}-${index}`}
                                    className="flex-shrink-0 group"
                                >
                                    <div className="w-[180px] h-[80px] bg-white rounded-xl shadow-md border border-[#E2E8F0] flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:border-[#1B9EBA]/30 hover:scale-105">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        {aliado.logo.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-[#334155] tracking-wide">
                                                {aliado.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 mt-12">
                    {[
                        { icon: 'fa-award', text: 'Certificaciones Internacionales' },
                        { icon: 'fa-shield-halved', text: 'Estándares de Calidad' },
                        { icon: 'fa-globe', text: 'Alcance Global' }
                    ].map((badge, index) => (
                        <div 
                            key={index}
                            className={`flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm border border-[#E2E8F0] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
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
