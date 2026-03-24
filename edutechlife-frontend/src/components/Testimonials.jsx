import { useState, useEffect, useRef } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const testimonials = [
    {
        id: 1,
        name: 'Dra. María Elena Gómez',
        role: 'Rectora - I.E. San José, Manizales',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
        content: 'La metodología VAK de Edutechlife transformó completamente nuestra institución. Los docentes ahora comprenden realmente cómo aprenden sus estudiantes y adaptan sus clases en consecuencia.',
        rating: 5,
        result: '+35% rendimiento en pruebas Saber',
        logo: 'fa-school'
    },
    {
        id: 2,
        name: 'Carlos Andrés Ríos',
        role: 'Estudiante SenaTIC - Certificación IBM',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        content: 'Gracias a la formación de Edutechlife obtuve la certificación IBM en IA. Hoy trabajo en una multinacional y todo comenzó con Valerio, el coach virtual.',
        rating: 5,
        result: 'Empleo en multinacionall',
        logo: 'fa-briefcase'
    },
    {
        id: 3,
        name: 'Prof. Juan Carlos Mendoza',
        role: 'Docente STEAM - Instituto Técnico Central',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        content: 'Nunca había visto una plataforma que combine tan bien la pedagogía con la tecnología. El enfoque STEAM de Edutechlife ha hecho que mis clases sean realmente interactivas.',
        rating: 5,
        result: '+200 estudiantes formados',
        logo: 'fa-chalkboard-teacher'
    },
    {
        id: 4,
        name: 'Laura Patricia Vega',
        role: 'Directora de Proyectos - Fundación Edúcate',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
        content: 'La consultoría B2B fue exactamente lo que necesitábamos. Los agentes de IA personalizados automatizaron el 60% de nuestros procesos de seguimiento.',
        rating: 5,
        result: '60% automatización procesos',
        logo: 'fa-building'
    },
    {
        id: 5,
        name: 'Andrés Felipe Torres',
        role: 'Estudiante - Programa Neuro-Entorno',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
        content: 'El análisis VAK me ayudó a descubrir que soy un aprendiz kinestésico. Ahora estudio de forma más eficiente y mis notas mejoraron significativamente.',
        rating: 5,
        result: '+15% promedio académico',
        logo: 'fa-graduation-cap'
    },
    {
        id: 6,
        name: 'Claudia Marcela Ruiz',
        role: 'Coordinadora Académica - UNAD',
        image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop',
        content: 'Implementamos el SmartBoard con 50 docentes. La capacidad de analizar documentos con IA y generar planes de estudio personalizados es revolutionary.',
        rating: 5,
        result: '50+ docentes capacitados',
        logo: 'fa-university'
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section
            ref={sectionRef}
            className="py-24 px-5% relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)',
            }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(77, 168, 196, 0.08) 0%, transparent 50%)`,
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 80% 50%, rgba(102, 204, 204, 0.08) 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#66CCCC]" />
                        <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#66CCCC]">
                            Historias de Éxito
                        </span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#66CCCC]" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] tracking-tight mb-4">
                        Lo Que Dicen Nuestros
                        <span className="block mt-2" style={{
                            background: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Alumnos
                        </span>
                    </h2>

                    <p className="text-gray-600 leading-relaxed font-normal text-lg max-w-2xl mx-auto">
                        Más de 6,000 estudiantes y docentes han transformado su vida académica con nuestra metodología.
                    </p>
                </div>

                {/* Main Testimonial */}
                <div
                    className={`relative mb-12 transition-all duration-1000 delay-200 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[rgba(0,75,99,0.08)] overflow-hidden">
                        {/* Quote Icon */}
                        <div
                            className="absolute top-8 right-8 text-[#B2D8E5] opacity-20"
                            style={{ fontSize: '8rem', lineHeight: 1 }}
                        >
                            <Icon name="fa-quote-right" />
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F1F5F9]">
                            <div
                                key={activeIndex}
                                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                                style={{
                                    animation: isPaused ? 'none' : 'progress-testimonial 5s linear forwards',
                                }}
                            />
                        </div>

                        <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-center">
                            {/* Avatar & Info */}
                            <div className="text-center md:text-left">
                                <div className="relative inline-block">
                                    <img
                                        src={testimonials[activeIndex].image}
                                        alt={testimonials[activeIndex].name}
                                        className="w-24 h-24 rounded-2xl object-cover mx-auto md:mx-0 mb-4 shadow-lg"
                                    />
                                    <div
                                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                        style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)' }}
                                    >
                                        <Icon name={testimonials[activeIndex].logo} />
                                    </div>
                                </div>
                                <h4 className="font-montserrat font-bold text-lg text-[#004B63]">
                                    {testimonials[activeIndex].name}
                                </h4>
                                <p className="text-[#64748B] text-sm mb-3">
                                    {testimonials[activeIndex].role}
                                </p>
                                <div className="flex gap-1 justify-center md:justify-start">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            name="fa-star"
                                            className="text-sm"
                                            style={{ color: '#FBBF24' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <p className="text-[#4A4A4A] text-lg md:text-xl leading-relaxed italic mb-6">
                                    "{testimonials[activeIndex].content}"
                                </p>
                                <div
                                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(77, 168, 196, 0.1), rgba(102, 204, 204, 0.05))',
                                        border: '1px solid rgba(77, 168, 196, 0.2)',
                                    }}
                                >
                                    <Icon name="fa-arrow-trend-up" className="text-[#10B981]" />
                                    <span className="font-montserrat font-bold text-sm text-[#004B63]">
                                        {testimonials[activeIndex].result}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    i === activeIndex
                                        ? 'w-8 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]'
                                        : 'bg-[#B2D8E5] hover:bg-[#4DA8C4]'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-400 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {[
                        { value: '6,000+', label: 'Estudiantes', icon: 'fa-user-graduate' },
                        { value: '200+', label: 'Docentes', icon: 'fa-chalkboard-teacher' },
                        { value: '98%', label: 'Satisfacción', icon: 'fa-star' },
                        { value: '10+', label: 'Años', icon: 'fa-award' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-6 text-center border border-[rgba(0,75,99,0.08)] hover:shadow-lg transition-shadow"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                style={{ background: 'linear-gradient(135deg, rgba(77, 168, 196, 0.15), rgba(102, 204, 204, 0.1))' }}
                            >
                                <Icon name={stat.icon} className="text-xl" style={{ color: '#4DA8C4' }} />
                            </div>
                            <div className="font-montserrat text-2xl md:text-3xl font-black text-[#004B63] mb-1">
                                {stat.value}
                            </div>
                            <div className="text-[#64748B] text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes progress-testimonial {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
