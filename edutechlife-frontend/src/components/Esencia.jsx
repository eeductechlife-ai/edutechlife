import { memo, useState, useEffect } from 'react';

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
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#1B9EBA]" />
                        <span className="text-sm font-bold text-[#1B9EBA] uppercase tracking-[0.2em]">
                            Quiénes Somos
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#1B9EBA]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A3044] mb-4">
                        Nuestra{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]">
                            Esencia
                        </span>
                    </h2>
                    <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                        Somos un equipo de magísteres, pedagogos y desarrolladores apasionados por transformar la educación mediante la inteligencia artificial.
                    </p>
                </div>

                {/* Mission, Vision + Carousel */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Left Column - Mission & Vision */}
                    <div className="space-y-6">
                        {/* Mission */}
                        <div className="group bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-bullseye text-2xl" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-[#1B9EBA] uppercase tracking-wider">Objetivo</span>
                                    <h3 className="text-xl font-bold">Misión</h3>
                                </div>
                            </div>
                            <p className="text-white/90 leading-relaxed">
                                Democratizar la educación de calidad mediante herramientas de inteligencia artificial que se adapten al estilo de aprendizaje único de cada estudiante.
                            </p>
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <div className="flex items-center gap-2 text-[#1B9EBA]">
                                    <i className="fa-solid fa-rocket" />
                                    <span className="font-semibold text-sm">Impulsando el futuro</span>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="group bg-[#F8FAFC] rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl hover:border-[#1B9EBA]/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-eye text-2xl text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-[#1B9EBA] uppercase tracking-wider">Proyección</span>
                                    <h3 className="text-xl font-bold text-[#0A3044]">Visión</h3>
                                </div>
                            </div>
                            <p className="text-[#64748B] leading-relaxed">
                                Ser la plataforma líder en Latinoamérica en la integración de metodologías pedagógicas con inteligencia artificial para formar profesionales del futuro.
                            </p>
                            <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                                <div className="flex items-center gap-2 text-[#1B9EBA]">
                                    <i className="fa-solid fa-globe" />
                                    <span className="font-semibold text-sm text-[#0A3044]">Liderazgo regional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Carousel */}
                    <div className="lg:col-span-2">
                        <div className="relative bg-[#0A3044] rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px] lg:min-h-[460px]">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3044] via-[#0A3044]/30 to-transparent" />
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <div className="max-w-lg">
                                    <span className="inline-block px-4 py-1 bg-[#1B9EBA] rounded-full text-sm font-semibold mb-4">
                                        {currentSlide + 1} / {slides.length}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
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
                                                index === currentSlide ? 'w-8 bg-[#1B9EBA]' : 'w-4 bg-white/40 hover:bg-white/60'
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
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <i className="fa-solid fa-chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block text-sm font-bold text-[#1B9EBA] uppercase tracking-widest mb-4">
                            Lo que nos define
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-[#0A3044] mb-4">
                            Nuestros Valores
                        </h3>
                        <p className="text-[#64748B] max-w-xl mx-auto">
                            Los principios que guían cada decisión y acción en nuestro camino hacia la excelencia educativa.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div 
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl hover:border-[#1B9EBA]/30 hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B9EBA]/10 to-[#0A3044]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <i className={`fa-solid ${value.icon} text-3xl text-[#1B9EBA]`} />
                                </div>
                                <h4 className="text-xl font-bold text-[#0A3044] mb-2">{value.text}</h4>
                                <p className="text-[#64748B] text-sm">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

Esencia.displayName = 'Esencia';

export default Esencia;
