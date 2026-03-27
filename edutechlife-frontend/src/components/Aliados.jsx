import { memo, useEffect, useState, useRef } from 'react';
import { GraduationCap, Globe, Building2, Search, Cloud, Award, FlaskConical, Laptop, Cpu, Sparkles, Users, Shield, Heart } from 'lucide-react';

const Aliados = memo(() => {
    const sectionRef = useRef(null);
    const marqueeRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const aliados = [
        { id: 1, name: 'SENA', category: 'Educación Técnica', icon: GraduationCap, color: '#004B63' },
        { id: 2, name: 'UNESCO', category: 'Organización Internacional', icon: Globe, color: '#4DA8C4' },
        { id: 3, name: 'Ministerio', category: 'Educación Nacional', icon: Building2, color: '#66CCCC' },
        { id: 4, name: 'Google', category: 'Tecnología', icon: Search, color: '#004B63' },
        { id: 5, name: 'Microsoft', category: 'Cloud Computing', icon: Cloud, color: '#4DA8C4' },
        { id: 6, name: 'AWS', category: 'Infraestructura', icon: Cloud, color: '#66CCCC' },
        { id: 7, name: 'ICETEX', category: 'Financiamiento', icon: Award, color: '#004B63' },
        { id: 8, name: 'Colciencias', category: 'Ciencia y Tecnología', icon: FlaskConical, color: '#4DA8C4' },
        { id: 9, name: 'Apple', category: 'Tecnología', icon: Laptop, color: '#66CCCC' },
        { id: 10, name: 'IBM', category: 'Inteligencia Artificial', icon: Cpu, color: '#004B63' },
        { id: 11, name: 'Coursera', category: 'Educación Online', icon: Sparkles, color: '#4DA8C4' },
        { id: 12, name: 'Steam', category: 'Educación STEM', icon: Cpu, color: '#66CCCC' },
    ];

    const duplicatedAliados = [...aliados, ...aliados, ...aliados];

    return (
        <section id="aliados" ref={sectionRef} className="relative w-full py-20 lg:py-32 overflow-hidden bg-[#F8FAFC]">
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(77,168,196,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_50%,rgba(0,75,99,0.05)_0%,transparent_50%)]" />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest block mb-2">
                            Confían en nosotros
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] tracking-tight mb-6">
                        Nuestros{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]">
                            Aliados Estratégicos
                        </span>
                    </h2>
                </div>

                {/* Infinite Marquee Container */}
                <div className="relative">
                    {/* Left Fade Mask */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#F8FAFC] to-transparent pointer-events-none" />
                    
                    {/* Right Fade Mask */}
                    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none" />

                    {/* Marquee */}
                    <div 
                        ref={marqueeRef}
                        className="overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div 
                            className="flex gap-6 py-4"
                            style={{
                                animation: isPaused ? 'none' : 'marquee 40s linear infinite',
                            }}
                        >
                            {duplicatedAliados.map((aliado, index) => (
                                <div 
                                    key={`${aliado.id}-${index}`}
                                    className="group flex-shrink-0 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 cursor-pointer hover:[animation-play-state:paused]"
                                    style={{
                                        minWidth: '220px',
                                    }}
                                >
                                    {/* Icon Circle */}
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            background: `linear-gradient(135deg, ${aliado.color}20, ${aliado.color}10)`,
                                            border: `1px solid ${aliado.color}30`
                                        }}
                                    >
                                        <aliado.icon 
                                            className="text-lg transition-colors duration-300" 
                                            style={{ color: aliado.color }}
                                        />
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#004B63]">{aliado.name}</span>
                                        <span className="font-mono text-xs tracking-widest text-gray-600 uppercase">
                                            {aliado.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }
            `}</style>
        </section>
    );
});

Aliados.displayName = 'Aliados';

export default Aliados;
