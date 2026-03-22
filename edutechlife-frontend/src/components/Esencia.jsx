import { memo, useState, useEffect } from 'react';

const Esencia = memo(() => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
            title: 'Innovación Educativa',
            description: 'Transformamos la manera de enseñar con tecnología de vanguardia'
        },
        {
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
            title: 'Aprendizaje Personalizado',
            description: 'Cada estudiante tiene su propio camino hacia el éxito'
        },
        {
            image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
            title: 'Comunidad STEAM',
            description: 'Formamos la próxima generación de innovadores'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="w-full relative overflow-hidden bg-[#F8FAFC]">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #0A3044 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-bold text-[#1B9EBA] uppercase tracking-widest mb-4">
                        Quiénes Somos
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0A3044] mb-6">
                        Nuestra Esencia
                    </h2>
                    <p className="text-xl text-[#334155] max-w-3xl mx-auto">
                        Somos un equipo de magísteres, pedagogos y desarrolladores apasionados por transformar la educación mediante la inteligencia artificial.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Info */}
                    <div className="space-y-8">
                        {/* Mission */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#1B9EBA]/10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9EBA] to-[#0A3044] flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-bullseye text-2xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0A3044] mb-2">Misión</h3>
                                    <p className="text-[#334155] leading-relaxed">
                                        Democratizar la educación de calidad mediante herramientas de inteligencia artificial que se adapten al estilo de aprendizaje único de cada estudiante.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#1B9EBA]/10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-eye text-2xl text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0A3044] mb-2">Visión</h3>
                                    <p className="text-[#334155] leading-relaxed">
                                        Ser la plataforma líder en Latinoamérica en la integración de metodologías pedagógicas con inteligencia artificial para formar profesionales del futuro.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="bg-gradient-to-br from-[#0A3044] to-[#1B9EBA] rounded-2xl p-8 text-white">
                            <h3 className="text-xl font-bold mb-4">Nuestros Valores</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: 'fa-lightbulb', text: 'Innovación' },
                                    { icon: 'fa-heart', text: 'Pasión' },
                                    { icon: 'fa-handshake', text: 'Compromiso' },
                                    { icon: 'fa-users', text: 'Comunidad' }
                                ].map((value, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <i className={`fa-solid ${value.icon} text-[#1B9EBA]`} />
                                        <span className="text-sm font-medium">{value.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Carousel */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#1B9EBA]/10">
                            {/* Images */}
                            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3044]/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                            <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                                            <p className="text-white/80">{slide.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'bg-[#1B9EBA] w-8' 
                                                : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#0A3044] hover:bg-white transition-all shadow-lg"
                            >
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#0A3044] hover:bg-white transition-all shadow-lg"
                            >
                                <i className="fa-solid fa-chevron-right" />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {[
                                { value: '6,000+', label: 'Estudiantes' },
                                { value: '10+', label: 'Años' },
                                { value: '98%', label: 'Satisfacción' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md border border-[#1B9EBA]/10">
                                    <div className="text-2xl font-black text-[#1B9EBA]">{stat.value}</div>
                                    <div className="text-xs text-[#64748B] uppercase tracking-wider">{stat.label}</div>
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
