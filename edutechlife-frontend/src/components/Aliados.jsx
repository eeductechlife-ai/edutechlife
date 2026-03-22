import { memo, useEffect, useState, useRef } from 'react';

const Aliados = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const aliados = [
        { 
            name: 'SENA', 
            icon: 'fa-graduation-cap',
            color: 'from-orange-500 to-orange-700',
            desc: 'Formación Técnica'
        },
        { 
            name: 'UNESCO', 
            icon: 'fa-landmark',
            color: 'from-blue-500 to-blue-700',
            desc: 'Educación Global'
        },
        { 
            name: 'Ministerio Educación', 
            icon: 'fa-university',
            color: 'from-red-500 to-red-700',
            desc: 'Educación Nacional'
        },
        { 
            name: 'Google', 
            icon: 'fa-search',
            color: 'from-blue-400 to-blue-600',
            desc: 'Google for Education'
        },
        { 
            name: 'Microsoft', 
            icon: 'fa-microsoft',
            color: 'from-blue-500 to-cyan-500',
            desc: 'Microsoft Education'
        },
        { 
            name: 'AWS', 
            icon: 'fa-cloud',
            color: 'from-orange-400 to-yellow-500',
            desc: 'AWS Educate'
        },
        { 
            name: 'ICETEX', 
            icon: 'fa-hand-holding-dollar',
            color: 'from-green-500 to-green-700',
            desc: 'Financiación Educativa'
        },
        { 
            name: 'Colciencias', 
            icon: 'fa-flask',
            color: 'from-purple-500 to-purple-700',
            desc: 'Ciencia e Innovación'
        },
        { 
            name: 'Apple', 
            icon: 'fa-apple-whole',
            color: 'from-gray-600 to-gray-800',
            desc: 'Apple Education'
        },
        { 
            name: 'STEAM', 
            icon: 'fa-gears',
            color: 'from-teal-500 to-cyan-500',
            desc: 'Educación STEM'
        }
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
        <section ref={sectionRef} className="relative w-full py-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-white" />
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #0A3044 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Premium Header */}
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#1B9EBA]" />
                        <span className="text-sm font-bold text-[#1B9EBA] uppercase tracking-[0.2em]">
                            Confían en nosotros
                        </span>
                        <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#1B9EBA]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A3044] mb-4">
                        Nuestros{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]">
                            Aliados Estratégicos
                        </span>
                    </h2>
                    <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
                        Colaboramos con las mejores instituciones educativas y empresas tecnológicas del mundo para garantizar una formación de excelencia.
                    </p>
                </div>

                {/* Logos Grid - Premium */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
                    {aliados.map((aliado, index) => (
                        <div 
                            key={`${aliado.name}-${index}`}
                            className={`group relative bg-white rounded-2xl p-6 shadow-md border border-[#E2E8F0] hover:shadow-xl hover:border-[#1B9EBA]/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${aliado.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <i className={`fa-solid ${aliado.icon} text-2xl text-white`} />
                            </div>

                            {/* Name */}
                            <h4 className="text-center font-bold text-[#0A3044] mb-1 group-hover:text-[#1B9EBA] transition-colors">
                                {aliado.name}
                            </h4>

                            {/* Description */}
                            <p className="text-center text-xs text-[#94A3B8]">
                                {aliado.desc}
                            </p>

                            {/* Hover Accent */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#1B9EBA] to-[#0A3044] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* Trust Badges - Premium */}
                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {[
                        { icon: 'fa-award', text: 'Certificaciones Internacionales', color: '#1B9EBA' },
                        { icon: 'fa-shield-halved', text: 'Estándares de Calidad', color: '#0A3044' },
                        { icon: 'fa-globe', text: 'Alcance Global', color: '#1B9EBA' },
                        { icon: 'fa-handshake', text: 'Alianzas Verificadas', color: '#0A3044' }
                    ].map((badge, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-[#E2E8F0] hover:shadow-lg hover:border-[#1B9EBA]/30 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center">
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
