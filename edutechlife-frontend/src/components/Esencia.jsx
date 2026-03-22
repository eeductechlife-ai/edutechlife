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
        const section = document.getElementById('esencia-section');
        if (section) observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const slides = [
        { image: '/images/edutech-carrusel-1.webp', title: 'Innovación' },
        { image: '/images/edutech-carrusel-2.webp', title: 'Aprendizaje' },
        { image: '/images/edutech-carrusel-3.webp', title: 'Comunidad' },
        { image: '/images/edutech-carrusel-4.webp', title: 'Tecnología' },
        { image: '/images/edutech-carrusel-5.webp', title: 'Metodología' },
        { image: '/images/edutech-carrusel-6.webp', title: 'Proyectos' },
        { image: '/images/edutech-carrusel-7.webp', title: 'Certificaciones' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const values = [
        { icon: 'fa-lightbulb', text: 'Innovación', color: '#1B9EBA' },
        { icon: 'fa-heart', text: 'Pasión', color: '#0A3044' },
        { icon: 'fa-handshake', text: 'Compromiso', color: '#1B9EBA' },
        { icon: 'fa-users', text: 'Comunidad', color: '#0A3044' }
    ];

    return (
        <section id="esencia-section" className="relative w-full overflow-hidden bg-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#1B9EBA]/5 to-transparent blur-3xl pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                {/* Premium Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#1B9EBA]" />
                        <span className="text-sm font-bold text-[#1B9EBA] uppercase tracking-[0.2em]">
                            Quiénes Somos
                        </span>
                        <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#1B9EBA]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0A3044] mb-4">
                        Nuestra{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B9EBA] to-[#0A3044]">
                            Esencia
                        </span>
                    </h2>
                    <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                        Somos un equipo de magísteres, pedagogos y desarrolladores apasionados por la educación con IA.
                    </p>
                </div>

                {/* Main Content - Mission, Vision, Values + Carousel */}
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Left Column - Mission, Vision, Values */}
                    <div className="space-y-6">
                        {/* Mission */}
                        <div className="relative bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] rounded-2xl p-6 text-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: '25px 25px'
                            }} />
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-bullseye text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Misión</h3>
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        Democratizar la educación de calidad mediante herramientas de IA que se adapten al estilo de aprendizaje único de cada estudiante.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0] overflow-hidden group hover:shadow-xl hover:border-[#1B9EBA]/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1B9EBA]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-eye text-2xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0A3044] mb-2">Visión</h3>
                                    <p className="text-[#64748B] text-sm leading-relaxed">
                                        Ser la plataforma líder en Latinoamérica en metodologías pedagógicas con IA para formar profesionales del futuro.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carousel Preview - Small */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] h-[200px]">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ${
                                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <img 
                                        src={slide.image} 
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A3044]/70 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="text-white font-bold">{slide.title}</span>
                                    </div>
                                </div>
                            ))}
                            {/* Slide Indicators */}
                            <div className="absolute bottom-3 right-3 flex gap-1">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentSlide ? 'bg-[#1B9EBA] w-4' : 'bg-white/60 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Large Image + Values */}
                    <div className="space-y-6">
                        {/* Large Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-xl h-[320px] lg:h-[380px]">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A3044]/80 via-transparent to-transparent" />
                                </div>
                            ))}
                            {/* Navigation */}
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                            >
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                            >
                                <i className="fa-solid fa-chevron-right" />
                            </button>
                        </div>

                        {/* Values - Horizontal */}
                        <div className="grid grid-cols-2 gap-4">
                            {values.map((value, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#1B9EBA]/30 hover:shadow-md transition-all duration-300"
                                >
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${value.color}15` }}
                                    >
                                        <i 
                                            className={`fa-solid ${value.icon} text-xl`}
                                            style={{ color: value.color }}
                                        />
                                    </div>
                                    <span className="font-bold text-[#0A3044]">{value.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

Esencia.displayName = 'Esencia';

export default Esencia;
