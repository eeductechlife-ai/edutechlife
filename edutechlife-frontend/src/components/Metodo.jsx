import { memo } from 'react';

const Metodo = memo(() => {
    const steps = [
        {
            number: '01',
            title: 'Diagnóstico VAK',
            description: 'Identificamos tu estilo de aprendizaje único mediante nuestro sistema de IA.',
            icon: 'fa-brain'
        },
        {
            number: '02',
            title: 'Ruta Personalizada',
            description: 'Diseñamos un currículo STEAM adaptado a tus fortalezas neuro-cognitivas.',
            icon: 'fa-route'
        },
        {
            number: '03',
            title: 'Ejecución Práctica',
            description: 'Aplica lo aprendido en el SmartBoard interactivo con mentores expertos.',
            icon: 'fa-laptop-code'
        },
        {
            number: '04',
            title: 'Certificación',
            description: 'Obtén credenciales oficiales respaldadas por gigantes tecnológicos globales.',
            icon: 'fa-certificate'
        }
    ];

    return (
        <section className="w-full relative overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.015]">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #004B63 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Content - Full Width */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-bold text-[#4DA8C4] uppercase tracking-widest mb-4">
                        Proceso Educativo
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#004B63] mb-6">
                        Nuestro Método
                    </h2>
                    <p className="text-xl text-[#334155] max-w-3xl mx-auto">
                        Un proceso claro, diseñado por magísteres, guiado por Inteligencia Artificial y enfocado en resultados medibles.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div 
                            key={step.number}
                            className="relative group"
                        >
                            {/* Connector Line (hidden on mobile, visible on lg) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#4DA8C4]/30 to-[#4DA8C4]/30 z-0" style={{ width: 'calc(100% - 4rem)', left: '2rem' }} />
                            )}

                            {/* Card */}
                            <div className="relative z-10 bg-[#F8FAFC] rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-[#4DA8C4]/20">
                                {/* Step Number */}
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] text-white font-black text-lg mb-6">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4">
                                    <i className={`fa-solid ${step.icon} text-2xl text-[#4DA8C4]`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-[#004B63] mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-[#334155] leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Hover Accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4DA8C4] to-[#004B63] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#004B63] text-white font-bold rounded-full transition-all duration-300 hover:bg-[#4DA8C4] hover:shadow-xl">
                        <i className="fa-solid fa-rocket text-lg" />
                        <span className="text-lg">Comenzar Mi Transformación</span>
                        <i className="fa-solid fa-arrow-right text-lg" />
                    </button>
                </div>
            </div>
        </section>
    );
});

Metodo.displayName = 'Metodo';

export default Metodo;
