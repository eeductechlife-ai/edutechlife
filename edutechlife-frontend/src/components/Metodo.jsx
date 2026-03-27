import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';

const Metodo = memo(() => {
    const steps = [
        {
            title: 'Diagnóstico VAK',
            description: 'Identificamos tu estilo de aprendizaje único mediante nuestro sistema de IA.',
            icon: 'fa-brain'
        },
        {
            title: 'Ruta Personalizada',
            description: 'Diseñamos un currículo STEAM adaptado a tus fortalezas neuro-cognitivas.',
            icon: 'fa-route'
        },
        {
            title: 'Ejecución Práctica',
            description: 'Aplica lo aprendido en el SmartBoard interactivo con mentores expertos.',
            icon: 'fa-laptop-code'
        },
        {
            title: 'Certificación',
            description: 'Obtén credenciales oficiales respaldadas por gigantes tecnológicos globales.',
            icon: 'fa-certificate'
        }
    ];

    return (
        <section id="metodo" className="w-full relative overflow-hidden bg-white">
            <FloatingParticles count={15} className="z-0" />
            
            {/* Ambient Glows */}
            <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-[#4DA8C4]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-[#66CCCC]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            
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
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#004B63] tracking-tight mb-4">
                        Nuestro Método
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
                        Un proceso claro, diseñado por magísteres, guiado por Inteligencia Artificial y enfocado en resultados medibles.
                    </p>
                </div>

                {/* Camino de Pasos - Diseño de Círculos */}
                <div className="relative">
                    {/* Línea de conexión horizontal - solo desktop */}
                    <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 mx-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] rounded-full opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] animate-pulse-slow rounded-full" style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />
                    </div>

                    {/* Steps - Círculos */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                        {steps.map((step, index) => (
                            <div 
                                key={index}
                                className="relative group flex flex-col items-center"
                            >
                                {/* Círculo grande con icono */}
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="relative z-10 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-white shadow-xl border-4 border-[#4DA8C4]/30 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-[#4DA8C4] group-hover:shadow-2xl group-hover:shadow-[#4DA8C4]/20"
                                >
                                    {/* Efecto de brillo en hover */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4DA8C4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Icono centrado */}
                                    <Icon name={step.icon} className="text-3xl lg:text-4xl text-[#4DA8C4] relative z-10" />
                                    
                                    {/* Punto indicador (último paso diferente color) */}
                                    {index === steps.length - 1 && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#66CCCC] border-4 border-white flex items-center justify-center">
                                            <Icon name="fa-check" className="text-xs text-white" />
                                        </div>
                                    )}
                                </motion.div>

                                {/* Información centrada debajo del círculo */}
                                <div className="text-center max-w-[180px] lg:max-w-[200px]">
                                    <h3 className="text-base lg:text-lg font-semibold text-[#004B63] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Conector vertical para móvil - entre círculos */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden absolute top-14 -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-[#4DA8C4]/50 to-[#4DA8C4]/20" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4DA8C4] text-white font-normal rounded-full transition-all duration-300 hover:bg-[#004B63] hover:shadow-xl">
                        <Icon name="fa-rocket" className="text-lg" />
                        <span className="text-lg">Comenzar Mi Transformación</span>
                        <Icon name="fa-arrow-right" className="text-lg" />
                    </button>
                </div>
            </div>
        </section>
    );
});

Metodo.displayName = 'Metodo';

export default Metodo;
