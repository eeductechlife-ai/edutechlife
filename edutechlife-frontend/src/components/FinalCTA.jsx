import { memo } from 'react';
import SectionWrapper from './SectionWrapper';

const FinalCTA = memo(({ onNavigate }) => {
    return (
        <SectionWrapper spacing="last">
            <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#0A3044] via-[#0A3044] to-[#1B9EBA]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div 
                        className="absolute inset-0" 
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

                {/* Decorative Orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1B9EBA]/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1B9EBA]/10 blur-3xl" />

                <div className="container-premium relative z-10 mx-auto px-6 lg:px-8 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8 backdrop-blur-sm border border-white/10">
                            <span className="w-2 h-2 bg-[#1B9EBA] rounded-full animate-pulse" />
                            <span className="text-white/80 text-sm font-medium">Únete a la revolución educativa</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            Transforma la Educación
                            <span className="block text-[#1B9EBA]">con Inteligencia Artificial</span>
                        </h2>

                        {/* Description */}
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Más de 6,000 estudiantes ya están aprendiendo con nuestras metodologías de vanguardia. 
                            ¿Listo para ser parte del futuro de la educación?
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button 
                                onClick={() => onNavigate('consultoria')}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1B9EBA] text-white font-bold rounded-full transition-all duration-300 hover:bg-white hover:text-[#0A3044] hover:scale-105"
                                style={{ boxShadow: '0 10px 40px rgba(27, 158, 186, 0.4)' }}
                            >
                                <i className="fa-solid fa-rocket text-lg" />
                                <span className="text-lg">Solicitar Consultoría</span>
                            </button>
                            <button 
                                onClick={() => onNavigate('ialab')}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300 hover:bg-white hover:text-[#0A3044] backdrop-blur-sm"
                            >
                                <i className="fa-solid fa-play text-lg" />
                                <span className="text-lg">Ver Demo Gratuita</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-8 text-white/60">
                            {[
                                { icon: 'fa-shield-halved', text: 'Certificados Globally' },
                                { icon: 'fa-clock', text: 'Soporte 24/7' },
                                { icon: 'fa-users', text: '6,000+ Estudiantes' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <i className={`fa-solid ${item.icon} text-[#1B9EBA]`} />
                                    <span className="text-sm font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </SectionWrapper>
    );
});

FinalCTA.displayName = 'FinalCTA';

export default FinalCTA;
