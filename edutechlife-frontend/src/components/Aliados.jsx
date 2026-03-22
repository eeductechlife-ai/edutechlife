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
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Premium Header */}
                <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest">
                            Confían en nosotros
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] mb-4">
                        Nuestros{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                            Aliados Estratégicos
                        </span>
                    </h2>
                    <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
                        Las mejores instituciones y empresas tecnológicas del mundo trabajan con nosotros para garantizar una formación de excelencia.
                    </p>
                </div>

                {/* Single Carousel */}
                <div className="relative overflow-hidden mb-12">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

                    {/* Carousel Container */}
                    <div className={`flex overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex gap-8 animate-marquee py-4">
                            {[...aliados, ...aliados, ...aliados].map((aliado, index) => (
                                <div 
                                    key={`${aliado.name}-${index}`}
                                    className="flex-shrink-0 group"
                                >
                                    <div className="w-[180px] h-[120px] bg-white rounded-2xl shadow-lg border border-[#E2E8F0] flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:border-[#4DA8C4]/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                                        <div 
                                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${aliado.color}15` }}
                                        >
                                            <i 
                                                className={`fa-solid ${aliado.icon} text-2xl`}
                                                style={{ color: aliado.color }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-[#004B63]">{aliado.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {[
                        { icon: 'fa-award', text: 'Certificaciones Internacionales' },
                        { icon: 'fa-shield-halved', text: 'Estándares de Calidad' },
                        { icon: 'fa-globe', text: 'Alcance Global' }
                    ].map((badge, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-[#E2E8F0] hover:shadow-lg hover:border-[#4DA8C4]/30 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center">
                                <i className={`fa-solid ${badge.icon} text-white`} />
                            </div>
                            <span className="text-sm font-semibold text-[#334155]">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Aliados.displayName = 'Aliados';

export default Aliados;
