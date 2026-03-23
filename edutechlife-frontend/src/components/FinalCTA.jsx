import { memo } from 'react';

const FinalCTA = memo(({ onNavigate }) => {
    return (
        <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#004B63] to-[#4DA8C4]">
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#4DA8C4]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#4DA8C4]/10 blur-3xl" />

            {/* Content - Full Width */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Direct Access Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                        <button 
                            onClick={() => onNavigate('vak')}
                            className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 text-left transition-all duration-300 hover:bg-white/20 hover:border-[#4DA8C4] hover:scale-105"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#66CCCC] to-[#4DA8C4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-brain text-2xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Diagnóstico VAK Gratis</h3>
                                    <p className="text-white/70 text-sm">Diagnóstico en 5 minutos</p>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm">
                                Descubre cómo aprendes mejor con nuestro test de estilos de aprendizaje. Sin registro, directo y gratuito.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[#4DA8C4] font-semibold">
                                <span>Haz el test ahora</span>
                                <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>

                        <button 
                            onClick={() => onNavigate('consultoria-b2b')}
                            className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 text-left transition-all duration-300 hover:bg-white/20 hover:border-[#66CCCC] hover:scale-105"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-chart-line text-2xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Herramientas IA</h3>
                                    <p className="text-white/70 text-sm">ROI y Automatización</p>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm">
                                Calcula el ROI de implementar IA en tu organización o diseña flujos de automatización personalizados.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[#66CCCC] font-semibold">
                                <span>Acceder gratis</span>
                                <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>
                    </div>

                    {/* Additional CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => onNavigate('consultoria')}
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4DA8C4] text-white font-bold rounded-full transition-all duration-300 hover:bg-white hover:text-[#004B63] hover:scale-105"
                            style={{ boxShadow: '0 10px 40px rgba(27, 158, 186, 0.4)' }}
                        >
                            <i className="fa-solid fa-rocket text-lg" />
                            <span className="text-lg">Solicitar Consultoría</span>
                        </button>
                        <button 
                            onClick={() => onNavigate('ialab')}
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300 hover:bg-white hover:text-[#004B63] backdrop-blur-sm"
                        >
                            <i className="fa-solid fa-play text-lg" />
                            <span className="text-lg">Ver Demo Gratuita</span>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-8 text-white/60 mt-12">
                        {[
                            { icon: 'fa-shield-halved', text: 'Certificados Globally' },
                            { icon: 'fa-clock', text: 'Soporte 24/7' },
                            { icon: 'fa-users', text: '6,000+ Estudiantes' }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <i className={`fa-solid ${item.icon} text-[#4DA8C4]`} />
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

FinalCTA.displayName = 'FinalCTA';

export default FinalCTA;
