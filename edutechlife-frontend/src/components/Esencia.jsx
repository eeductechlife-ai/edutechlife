import { memo, useState, useEffect } from 'react';

const Esencia = memo(() => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        observer.observe(document.getElementById('esencia-section'));
        return () => observer.disconnect();
    }, []);

    const slides = [
        {
            image: '/images/edutech-carrusel-1.webp',
            title: 'Innovación Educativa',
            description: 'Transformamos la manera de enseñar con tecnología de vanguardia'
        },
        {
            image: '/images/edutech-carrusel-2.webp',
            title: 'Aprendizaje Personalizado',
            description: 'Cada estudiante tiene su propio camino hacia el éxito'
        },
        {
            image: '/images/edutech-carrusel-3.webp',
            title: 'Comunidad STEAM',
            description: 'Formamos la próxima generación de innovadores'
        },
        {
            image: '/images/edutech-carrusel-4.webp',
            title: 'Tecnología de Vanguardia',
            description: 'Herramientas avanzadas para el aprendizaje del futuro'
        },
        {
            image: '/images/edutech-carrusel-5.webp',
            title: 'Metodología VAK',
            description: 'Diagnóstico personalizado para cada estudiante'
        },
        {
            image: '/images/edutech-carrusel-6.webp',
            title: 'Proyectos Prácticos',
            description: 'Aplicación real de conocimientos en entornos profesionales'
        },
        {
            image: '/images/edutech-carrusel-7.webp',
            title: 'Certificaciones Globales',
            description: 'Credenciales respaldadas por líderes de la industria'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const values = [
        { icon: 'fa-lightbulb', text: 'Innovación', desc: ' Siempre adelante' },
        { icon: 'fa-heart', text: 'Pasión', desc: 'Por la educación' },
        { icon: 'fa-handshake', text: 'Compromiso', desc: 'Con cada estudiante' },
        { icon: 'fa-users', text: 'Comunidad', desc: 'Juntos crecemos' }
    ];

    return (
        <section id="esencia-section" className="relative w-full overflow-hidden bg-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#1B9EBA]/5 to-transparent blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#0A3044]/5 to-transparent blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                {/* Premium Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#1B9EBA]" />
                        <span className="text-sm font-bold text-[#1B9EBA] uppercase tracking-[0.2em]">
                            Quiénes Somos
                        </span>
                        <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#1B9EBA]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A3044] mb-6">
                        Nuestra{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]">
                            Esencia
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
                        Somos un equipo de magísteres, pedagogos y desarrolladores{' '}
                        <span className="text-[#1B9EBA] font-semibold">apasionados</span> por transformar 
                        la educación mediante la inteligencia artificial.
                    </p>
                </div>

                {/* Main Content - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Mission Card */}
                    <div className={`group relative bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] rounded-3xl p-8 text-white overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: '30px 30px'
                            }} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <i className="fa-solid fa-bullseye text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Misión</h3>
                            <p className="text-white/90 leading-relaxed">
                                Democratizar la educación de calidad mediante herramientas de inteligencia artificial que se adapten al estilo de aprendizaje único de cada estudiante.
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                    </div>

                    {/* Vision Card */}
                    <div className={`group relative bg-white rounded-3xl p-8 shadow-xl border border-[#E2E8F0] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#1B9EBA]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <i className="fa-solid fa-eye text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0A3044] mb-4">Visión</h3>
                            <p className="text-[#64748B] leading-relaxed">
                                Ser la plataforma líder en Latinoamérica en la integración de metodologías pedagógicas con inteligencia artificial para formar profesionales del futuro.
                            </p>
                        </div>
                    </div>

                    {/* Values Card */}
                    <div className={`group relative bg-[#F8FAFC] rounded-3xl p-8 border border-[#E2E8F0] overflow-hidden transition-all duration-700 hover:border-[#1B9EBA]/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-[#0A3044] mb-6">Nuestros Valores</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {values.map((value, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B9EBA]/20 to-[#0A3044]/20 flex items-center justify-center">
                                            <i className={`fa-solid ${value.icon} text-[#1B9EBA]`} />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-[#0A3044]">{value.text}</span>
                                            <span className="block text-xs text-[#94A3B8]">{value.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                    {/* Section Subtitle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
                        <span className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                            Nuestra Galería
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
                    </div>

                    {/* Premium Carousel */}
                    <div className="relative bg-[#0A3044] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Carousel Images */}
                        <div className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-1000 ${
                                        index === currentSlide 
                                            ? 'opacity-100 scale-100' 
                                            : 'opacity-0 scale-105'
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

                            {/* Slide Content */}
                            <div className="absolute inset-0 flex items-end">
                                <div className="p-8 md:p-12 text-white w-full">
                                    <div className="max-w-2xl">
                                        <span className="inline-block px-4 py-1 bg-[#1B9EBA] rounded-full text-sm font-semibold mb-4">
                                            {currentSlide + 1} / {slides.length}
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-bold mb-3">
                                            {slides[currentSlide].title}
                                        </h3>
                                        <p className="text-lg text-white/80 mb-6">
                                            {slides[currentSlide].description}
                                        </p>
                                        <div className="flex gap-2">
                                            {slides.map((_, index) => (
                                                <span 
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        index === currentSlide 
                                                            ? 'bg-[#1B9EBA] w-8' 
                                                            : 'bg-white/40 hover:bg-white/60'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            >
                                <i className="fa-solid fa-chevron-left text-lg" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            >
                                <i className="fa-solid fa-chevron-right text-lg" />
                            </button>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#1B9EBA] to-[#0A3044] transition-all duration-300"
                                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

Esencia.displayName = 'Esencia';

export default Esencia;
