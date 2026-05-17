import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';

const Metodo = memo(() => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', interes: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const leadData = {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            interes: formData.interes || 'Transformación Educativa',
            tema: 'Comenzar Mi Transformación - Método'
        };
        const existing = JSON.parse(localStorage.getItem('edutechlife_leads') || '[]');
        existing.push({ ...leadData, timestamp: new Date().toISOString() });
        localStorage.setItem('edutechlife_leads', JSON.stringify(existing));
        setSubmitted(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSubmitted(false);
        setFormData({ nombre: '', email: '', telefono: '', interes: '' });
    };
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
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] tracking-tighter mb-4">
                        Nuestro{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                            Método
                        </span>
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
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
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#4DA8C4] text-white font-normal rounded-full transition-all duration-300 hover:bg-[#004B63] hover:shadow-xl"
                    >
                        <Icon name="fa-rocket" className="text-lg" />
                        <span className="text-lg">Comenzar Mi Transformación</span>
                        <Icon name="fa-arrow-right" className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4" onClick={closeForm}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100">
                            <button
                                onClick={closeForm}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-[#004B63] hover:bg-gray-100 transition-all"
                            >
                                <Icon name="fa-xmark" className="text-lg" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center">
                                    <Icon name="fa-rocket" className="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#004B63]">Comenzar Mi Transformación</h3>
                                    <p className="text-sm text-[#4DA8C4]">Un asesor se comunicará contigo</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center mx-auto mb-6">
                                        <Icon name="fa-check" className="text-white text-3xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-[#004B63] mb-2">¡Gracias por confiar en nosotros!</h4>
                                    <p className="text-gray-600 mb-8">Un asesor especializado se pondrá en contacto contigo en las próximas 24 horas para guiarte en tu transformación educativa.</p>
                                    <button
                                        onClick={closeForm}
                                        className="px-8 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all duration-300"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#004B63] mb-1.5">Nombre completo <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DA8C4] focus:border-[#4DA8C4] outline-none transition-all text-[#004B63] text-sm"
                                            placeholder="Tu nombre"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#004B63] mb-1.5">Correo electrónico <span className="text-red-400">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DA8C4] focus:border-[#4DA8C4] outline-none transition-all text-[#004B63] text-sm"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#004B63] mb-1.5">Teléfono <span className="text-red-400">*</span></label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DA8C4] focus:border-[#4DA8C4] outline-none transition-all text-[#004B63] text-sm"
                                            placeholder="300 123 4567"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#004B63] mb-1.5">¿Qué te gustaría transformar?</label>
                                        <select
                                            name="interes"
                                            value={formData.interes}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DA8C4] focus:border-[#4DA8C4] outline-none transition-all bg-white text-[#004B63] text-sm"
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="Diagnóstico VAK">Diagnóstico VAK</option>
                                            <option value="Cursos STEAM">Cursos STEAM</option>
                                            <option value="Tutorías Personalizadas">Tutorías Personalizadas</option>
                                            <option value="SmartBoard">SmartBoard Interactivo</option>
                                            <option value="Consultoría B2B">Consultoría B2B</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Icon name="fa-paper-plane" className="text-sm" />
                                        Enviar
                                    </button>

                                    <p className="text-xs text-gray-400 text-center">
                                        Al enviar, aceptas que te contactemos para brindarte información sobre nuestros servicios educativos.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
});

Metodo.displayName = 'Metodo';

export default Metodo;
