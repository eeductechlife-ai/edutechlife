import { memo } from 'react';
import SectionWrapper from './SectionWrapper';

const Hero = memo(({ onNavigate }) => {
    return (
        <SectionWrapper spacing="first">
            <section className="w-full min-h-[90vh] flex items-center relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.015]">
                    <div 
                        className="absolute inset-0" 
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #0A3044 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Decorative Gradient Orbs */}
                <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#1B9EBA]/10 to-transparent blur-3xl" />
                <div className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#1B9EBA]/8 to-transparent blur-3xl" />

                {/* Main Content */}
                <div className="container-premium relative z-10 mx-auto px-6 lg:px-8 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Logo Principal */}
                        <div className="mb-12 animate-fade-in">
                            <img 
                                src="/images/logo-edutechlife.webp" 
                                alt="Edutechlife" 
                                className="h-20 w-auto mx-auto mb-6"
                                style={{ filter: 'drop-shadow(0 4px 20px rgba(27, 158, 186, 0.15))' }}
                            />
                        </div>

                        {/* Título Principal */}
                        <div className="mb-8 animate-slide-up">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0A3044] leading-tight mb-4">
                                Pedagogía de Élite
                            </h1>
                            <div className="inline-block">
                                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B9EBA]">
                                    con Inteligencia Artificial
                                </span>
                            </div>
                        </div>

                        {/* Subtítulo */}
                        <div className="mb-12 animate-slide-up" style={{ animationDelay: '150ms' }}>
                            <p className="text-xl md:text-2xl text-[#334155] max-w-2xl mx-auto leading-relaxed">
                                Transformamos la educación con <span className="font-semibold text-[#1B9EBA]">metodologías de vanguardia</span> y el poder de la IA para formar profesionales del futuro.
                            </p>
                        </div>

                        {/* Indicadores de Impacto */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            {[
                                { value: '6,000+', label: 'Estudiantes' },
                                { value: '98%', label: 'Certificación' },
                                { value: '10+', label: 'Años de Experiencia' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-black text-[#0A3044] mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-[#64748B] uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '450ms' }}>
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1B9EBA] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#0A3044] hover:scale-105 hover:shadow-xl"
                                style={{ boxShadow: '0 10px 30px rgba(27, 158, 186, 0.3)' }}
                            >
                                <i className="fa-solid fa-rocket text-lg" />
                                <span className="text-lg">Explorar IA Lab</span>
                            </button>
                            <button 
                                onClick={() => onNavigate('consultoria')}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0A3044] font-bold rounded-full border-2 border-[#1B9EBA]/20 transition-all duration-300 hover:border-[#1B9EBA] hover:shadow-lg"
                            >
                                <i className="fa-solid fa-handshake text-lg text-[#1B9EBA]" />
                                <span className="text-lg">Consultoría B2B</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="flex flex-col items-center gap-2 text-[#64748B]">
                        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
                        <div className="w-6 h-10 border-2 border-[#1B9EBA]/30 rounded-full flex items-start justify-center p-1">
                            <div className="w-1.5 h-3 bg-[#1B9EBA] rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        </SectionWrapper>
    );
});

Hero.displayName = 'Hero';

export default Hero;
