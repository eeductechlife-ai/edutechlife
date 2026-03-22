import { memo } from 'react';

const Ecosystem = memo(({ onExplore }) => {
    const tools = [
        {
            id: 'ialab',
            icon: 'fa-brain',
            title: 'IA Lab con Valerio',
            subtitle: 'Asistente de IA Educativo',
            description: 'Interactúa con Valerio, nuestro agente de IA especializado en educación. Obtén explicaciones, resúmenes y guía personalizada.',
            features: ['Chat inteligente 24/7', 'Análisis de documentos', 'Explicaciones detalladas'],
            color: '#1B9EBA',
            gradient: 'from-[#1B9EBA] to-[#0A3044]'
        },
        {
            id: 'neuroentorno',
            icon: 'fa-graduation-cap',
            title: 'NeuroEntorno Educativo',
            subtitle: 'Diagnóstico VAK',
            description: 'Descubre tu estilo de aprendizaje con nuestro test científico y optimiza tu forma de estudiar.',
            features: ['Test VAK completo', 'Perfil personalizado', 'Recomendaciones'],
            color: '#0A3044',
            gradient: 'from-[#0A3044] to-[#1B9EBA]'
        },
        {
            id: 'proyectos',
            icon: 'fa-laptop-code',
            title: 'Proyectos SenaTIC',
            subtitle: 'Portafolio Tecnológico',
            description: 'Explora proyectos reales desarrollados por estudiantes con tecnologías de última generación.',
            features: ['Proyectos prácticos', 'Tecnologías actuales', 'Certificaciones'],
            color: '#1B9EBA',
            gradient: 'from-[#1B9EBA] to-[#0A3044]'
        },
        {
            id: 'consultoria',
            icon: 'fa-handshake',
            title: 'Consultoría B2B',
            subtitle: 'Transformación Digital',
            description: 'Implementa soluciones de IA en tu institución educativa con nuestro equipo de expertos.',
            features: ['Agentes IA personalizados', 'Capacitación STEAM', 'ROI garantizado'],
            color: '#0A3044',
            gradient: 'from-[#0A3044] to-[#1B9EBA]'
        }
    ];

    return (
        <section className="w-full relative overflow-hidden bg-[#F8FAFC]">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #0A3044 1px, transparent 0)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Content - Full Width */}
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

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {tools.map((tool, index) => (
                        <div 
                            key={tool.id}
                            className="group relative bg-white rounded-2xl p-8 border border-[#1B9EBA]/10 transition-all duration-300 hover:border-[#1B9EBA]/30 hover:shadow-xl hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} mb-6 shadow-lg`}>
                                <i className={`fa-solid ${tool.icon} text-2xl text-white`} />
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <span className="text-xs font-bold text-[#1B9EBA] uppercase tracking-wider mb-2 block">
                                    {tool.subtitle}
                                </span>
                                <h3 className="text-2xl font-bold text-[#0A3044] mb-3">
                                    {tool.title}
                                </h3>
                                <p className="text-[#334155] leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {tool.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-3 text-[#334155]">
                                        <i className="fa-solid fa-check text-[#1B9EBA] text-sm" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button 
                                onClick={() => onExplore(tool.id)}
                                className={`w-full py-3 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-semibold transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2`}
                            >
                                <span>Explorar</span>
                                <i className="fa-solid fa-arrow-right text-sm transition-transform group-hover:translate-x-1" />
                            </button>

                            {/* Hover Accent */}
                            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${tool.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
