import { memo, useEffect, useState } from 'react';

const Hero = memo(({ onNavigate }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { value: '6,000+', label: 'Estudiantes' },
        { value: '98%', label: 'Certificación' },
        { value: '10+', label: 'Años de Experiencia' }
    ];

    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden">
            {/* Light Void Background - Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFFFF_0%,#F8FAFC_70%,#E2E8F0_100%)]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.4]" style={{
                backgroundImage: `
                    linear-gradient(#E2E8F0 1px, transparent 1px),
                    linear-gradient(90deg, #E2E8F0 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }} />

            {/* Hero Orbs - Energy Balls */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#1B9EBA]/20 blur-3xl animate-orb-1" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#0A3044]/15 blur-3xl animate-orb-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1B9EBA]/10 blur-3xl animate-orb-3" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Typography */}
                    <div className={`text-center lg:text-left transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B9EBA]/10 rounded-full mb-8 border border-[#1B9EBA]/20">
                            <span className="w-2 h-2 bg-[#1B9EBA] rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-[#0A3044]">Innovación Educativa con IA</span>
                        </div>

                        {/* Main Title with Gradient */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0A3044] to-[#1B9EBA]">
                                Pedagogía
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]">
                                de Élite
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-[#334155] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Transformamos la educación con{' '}
                            <span className="font-semibold text-[#1B9EBA]">metodologías de vanguardia</span>{' '}
                            y el poder de la IA para formar profesionales del futuro.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
                            {stats.map((stat, index) => (
                                <div 
                                    key={index}
                                    className={`text-center transition-all duration-700 delay-${(index + 1) * 200} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                >
                                    <div className="text-3xl md:text-4xl font-black text-[#0A3044]">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-[#64748B] uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1B9EBA] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-[#0A3044] hover:shadow-[0_0_25px_rgba(27,158,186,0.5)] hover:scale-105"
                            >
                                <i className="fa-solid fa-rocket text-lg" />
                                <span className="text-lg">Explorar IA Lab</span>
                                <i className="fa-solid fa-arrow-right text-lg transition-transform duration-300 group-hover:translate-x-2" />
                            </button>
                            <button 
                                onClick={() => onNavigate('consultoria')}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0A3044] font-bold rounded-full border-2 border-[#1B9EBA]/30 transition-all duration-300 hover:border-[#1B9EBA] hover:shadow-xl hover:scale-105"
                            >
                                <i className="fa-solid fa-handshake text-lg text-[#1B9EBA]" />
                                <span className="text-lg">Consultoría B2B</span>
                            </button>
                        </div>
                    </div>

                    {/* Right - Dashboard Visual */}
                    <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Glassmorphism Panel */}
                        <div className="relative bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#1B9EBA]" />
                                    <span className="font-bold text-[#0A3044]">Edutechlife AI</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/50" />
                                </div>
                            </div>

                            {/* AI Chat Preview */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-robot text-white text-sm" />
                                    </div>
                                    <div className="bg-white/60 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                        <p className="text-sm font-mono text-[#334155]">
                                            ¡Hola! Soy Valerio. ¿En qué tema necesitas ayuda hoy?
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="bg-[#1B9EBA]/10 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                        <p className="text-sm font-mono text-[#334155]">
                                            Explícame el método VAK
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center flex-shrink-0">
                                        <i className="fa-solid fa-robot text-white text-sm" />
                                    </div>
                                    <div className="bg-white/60 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                                        <p className="text-sm font-mono text-[#334155] leading-relaxed">
                                            El método VAK identifica tu estilo de aprendizaje: Visual, Auditivo o Kinestésico...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Live Indicators */}
                            <div className="flex items-center justify-between border-t border-[#1B9EBA]/20 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono text-[#334155]">IA Activa</span>
                                </div>
                                <div className="text-xs font-mono text-[#64748B]">
                                    Respuesta en &lt;1s
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#1B9EBA]/20 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center animate-float">
                            <i className="fa-solid fa-brain text-2xl text-[#1B9EBA]" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#0A3044]/20 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center animate-float-delayed">
                            <i className="fa-solid fa-graduation-cap text-xl text-[#0A3044]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
