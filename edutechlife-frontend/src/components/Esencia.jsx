import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';

const Esencia = memo(() => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        const section = document.getElementById('esencia-section');
        if (section) observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const slides = [
        { image: '/images/edutech-carrusel-1.webp', title: 'Innovación Educativa' },
        { image: '/images/edutech-carrusel-2.webp', title: 'Aprendizaje Personalizado' },
        { image: '/images/edutech-carrusel-3.webp', title: 'Comunidad STEAM' },
        { image: '/images/edutech-carrusel-4.webp', title: 'Tecnología de Vanguardia' },
        { image: '/images/edutech-carrusel-5.webp', title: 'Metodología VAK' },
        { image: '/images/edutech-carrusel-6.webp', title: 'Proyectos Prácticos' },
        { image: '/images/edutech-carrusel-7.webp', title: 'Certificaciones Globales' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const values = [
        { icon: 'fa-lightbulb', text: 'Innovación', desc: 'Siempre adelante' },
        { icon: 'fa-heart', text: 'Pasión', desc: 'Por la educación' },
        { icon: 'fa-handshake', text: 'Compromiso', desc: 'Con cada estudiante' },
        { icon: 'fa-users', text: 'Comunidad', desc: 'Juntos crecemos' }
    ];

    return (
        <section id="esencia-section" className="relative w-full overflow-hidden bg-white">
            <FloatingParticles count={15} className="z-0" />
            
            {/* Ambient Glows */}
            <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-[#4DA8C4]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-[#66CCCC]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                        <span className="text-sm font-normal text-[#4DA8C4] uppercase tracking-widest block mb-2">
                            Quiénes Somos
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#004B63] tracking-tight mb-6">
                        Nuestra{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">
                            Esencia
                        </span>
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
                        Somos un equipo de magísteres, pedagogos y desarrolladores apasionados por transformar la educación mediante la inteligencia artificial.
                    </p>
                </div>

                {/* Values Section - AFTER Header */}
                <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {values.map((value, index) => (
                            <div 
                                key={index}
                                className="group bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-[#4DA8C4]/30 hover:-translate-y-1 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#004B63]/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                                     <Icon name={value.icon} className="text-xl md:text-2xl text-[#4DA8C4]" />
                                </div>
                                <h4 className="text-base md:text-lg font-normal text-[#004B63] mb-1 md:mb-2">{value.text}</h4>
                                <p className="text-base text-slate-600 leading-relaxed font-normal">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission, Vision + Carousel */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Left Column - Mission & Vision */}
                    <div className="space-y-6">
                        {/* Mission */}
                        <div className="group bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon name="fa-bullseye" className="text-2xl" />
                                </div>
                                <div>
                                    <span className="text-sm font-normal text-[#4DA8C4] uppercase tracking-widest block mb-2">Objetivo</span>
                                    <h3 className="text-xl md:text-2xl font-normal">Misión</h3>
                                </div>
                            </div>
                            <p className="text-base text-white/90 leading-relaxed font-normal">
                                Democratizar la educación de calidad mediante herramientas de inteligencia artificial que se adapten al estilo de aprendizaje único de cada estudiante.
                            </p>
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <div className="flex items-center gap-2 text-[#4DA8C4]">
                                    <Icon name="fa-rocket" />
                                    <span className="font-normal text-sm">Impulsando el futuro</span>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="group bg-[#F8FAFC] rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl hover:border-[#4DA8C4]/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon name="fa-eye" className="text-2xl text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-normal text-[#4DA8C4] uppercase tracking-widest block mb-2">Proyección</span>
                                    <h3 className="text-xl md:text-2xl font-normal text-[#004B63]">Visión</h3>
                                </div>
                            </div>
                            <p className="text-base text-gray-600 leading-relaxed font-normal">
                                Ser la plataforma líder en Latinoamérica en la integración de metodologías pedagógicas con inteligencia artificial para formar profesionales del futuro.
                            </p>
                            <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                                <div className="flex items-center gap-2 text-[#4DA8C4]">
                                    <Icon name="fa-globe" />
                                    <span className="font-normal text-sm text-[#004B63]">Liderazgo regional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Carousel */}
                    <div className="lg:col-span-2">
                        <div className="relative bg-[#004B63] rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px] lg:min-h-[460px]">
                            {/* Images */}
                            <div className="absolute inset-0">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-1000 ${
                                            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                        }`}
                                    >
                                        <img 
                                            src={slide.image} 
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#004B63] via-[#004B63]/30 to-transparent" />
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <div className="max-w-lg">
                                    <h3 className="text-xl md:text-2xl font-normal text-white mb-3">
                                        {slides[currentSlide].title}
                                    </h3>
                                </div>

                                {/* Indicators */}
                                <div className="flex items-center gap-2 mt-6">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`h-1 rounded-full transition-all duration-500 ${
                                                index === currentSlide ? 'w-8 bg-[#4DA8C4]' : 'w-4 bg-white/40 hover:bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <Icon name="fa-chevron-left" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <Icon name="fa-chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

Esencia.displayName = 'Esencia';

export default Esencia;
