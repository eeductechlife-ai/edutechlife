import { memo } from 'react';

const Ecosystem = memo(({ onExplore }) => {
    return (
        <section className="w-full relative overflow-hidden bg-white">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.015]">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #0A3044 1px, transparent 0)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-bold text-[#1B9EBA] uppercase tracking-widest mb-4">
                        Herramientas de Alto Impacto
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0A3044] mb-6">
                        Tu Ecosistema de Aprendizaje
                    </h2>
                    <p className="text-xl text-[#334155] max-w-2xl mx-auto">
                        Accede a un conjunto completo de herramientas diseñadas para transformar la educación con inteligencia artificial.
                    </p>
                </div>

                {/* Unified AI + VAK Section */}
                <div className="mb-16">
                    <div className="bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div 
                                className="absolute inset-0" 
                                style={{
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
                                    <i className="fa-solid fa-brain text-[#1B9EBA]" />
                                    <span className="text-sm font-semibold text-white">Inteligencia Artificial + Neuropedagogía</span>
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                                    Plataforma Integral de Aprendizaje
                                </h3>
                                <p className="text-white/80 max-w-2xl mx-auto">
                                    Combina el poder de la IA educativa con el diagnóstico científico de tu estilo de aprendizaje para resultados extraordinarios.
                                </p>
                            </div>

                            {/* Two Main Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* IA Lab Card */}
                                <div 
                                    onClick={() => onExplore('ialab')}
                                    className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <i className="fa-solid fa-robot text-3xl text-white" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-[#1B9EBA] uppercase tracking-wider">Asistente IA</span>
                                            <h4 className="text-2xl font-bold text-white">IA Lab con Valerio</h4>
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/80 mb-6 leading-relaxed">
                                        Tu tutor personal de IA disponible 24/7. Valerio te ayuda con explicaciones detalladas, análisis de documentos y guía personalizada en tu proceso de aprendizaje.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                        {['Chat inteligente 24/7', 'Análisis de documentos', 'Explicaciones detalladas'].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-white/90 text-sm">
                                                <i className="fa-solid fa-check text-[#1B9EBA] text-xs" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-3 rounded-xl bg-white text-[#0A3044] font-bold transition-all duration-300 hover:bg-[#1B9EBA] hover:text-white flex items-center justify-center gap-2">
                                        <span>Probar Valerio</span>
                                        <i className="fa-solid fa-arrow-right text-sm" />
                                    </button>
                                </div>

                                {/* VAK Card */}
                                <div 
                                    onClick={() => onExplore('neuroentorno')}
                                    className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] border border-white/10"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <i className="fa-solid fa-brain text-3xl text-white" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-[#1B9EBA] uppercase tracking-wider">Diagnóstico</span>
                                            <h4 className="text-2xl font-bold text-white">NeuroEntorno VAK</h4>
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/80 mb-6 leading-relaxed">
                                        Descubre tu estilo de aprendizaje único: Visual, Auditivo o Kinestésico. Nuestro test científico te proporciona un perfil personalizado con recomendaciones adaptadas a tu cerebro.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                        {['Test VAK completo', 'Perfil personalizado', 'SmartBoard integrado'].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-white/90 text-sm">
                                                <i className="fa-solid fa-check text-[#1B9EBA] text-xs" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-3 rounded-xl bg-[#1B9EBA] text-white font-bold transition-all duration-300 hover:bg-white hover:text-[#0A3044] flex items-center justify-center gap-2">
                                        <span>Realizar Test</span>
                                        <i className="fa-solid fa-arrow-right text-sm" />
                                    </button>
                                </div>
                            </div>

                            {/* Synergy Banner */}
                            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#1B9EBA]/30 flex items-center justify-center">
                                            <i className="fa-solid fa-link text-xl text-[#1B9EBA]" />
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-bold text-white">Potencia tu aprendizaje</h5>
                                            <p className="text-white/70 text-sm">Valerio adapta sus explicaciones a tu perfil VAK para resultados óptimos</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">IA Personalizada</span>
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">Neurociencia</span>
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">STEAM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Proyectos SenaTIC */}
                    <div 
                        onClick={() => onExplore('proyectos')}
                        className="group relative bg-[#F8FAFC] rounded-2xl p-8 border border-[#1B9EBA]/10 cursor-pointer transition-all duration-300 hover:border-[#1B9EBA]/30 hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center">
                                <i className="fa-solid fa-laptop-code text-2xl text-white" />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-bold text-[#1B9EBA] uppercase tracking-wider">Portafolio</span>
                                <h4 className="text-xl font-bold text-[#0A3044] mb-2">Proyectos SenaTIC</h4>
                                <p className="text-[#334155] text-sm leading-relaxed">
                                    Explora proyectos reales desarrollados por estudiantes con tecnologías de última generación.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1B9EBA]/10">
                            <div className="flex gap-3">
                                {['Proyectos prácticos', 'Tecnologías actuales', 'Certificaciones'].map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-[#1B9EBA]/10 text-[#1B9EBA] rounded-full">{tag}</span>
                                ))}
                            </div>
                            <i className="fa-solid fa-arrow-right text-[#1B9EBA] transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>

                    {/* Consultoría B2B */}
                    <div 
                        onClick={() => onExplore('consultoria')}
                        className="group relative bg-[#F8FAFC] rounded-2xl p-8 border border-[#1B9EBA]/10 cursor-pointer transition-all duration-300 hover:border-[#1B9EBA]/30 hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] flex items-center justify-center">
                                <i className="fa-solid fa-handshake text-2xl text-white" />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-bold text-[#1B9EBA] uppercase tracking-wider">Corporativo</span>
                                <h4 className="text-xl font-bold text-[#0A3044] mb-2">Consultoría B2B</h4>
                                <p className="text-[#334155] text-sm leading-relaxed">
                                    Implementa soluciones de IA en tu institución educativa con nuestro equipo de expertos.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1B9EBA]/10">
                            <div className="flex gap-3">
                                {['Agentes IA', 'Capacitación', 'ROI Garantizado'].map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-[#1B9EBA]/10 text-[#1B9EBA] rounded-full">{tag}</span>
                                ))}
                            </div>
                            <i className="fa-solid fa-arrow-right text-[#1B9EBA] transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
