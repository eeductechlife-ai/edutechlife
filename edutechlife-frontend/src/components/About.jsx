import { useState, useEffect, useRef, useCallback } from 'react';

const carouselImages = [
    { src: '/images/edutech-carrusel-1.webp', alt: 'Estudiantes Edutechlife' },
    { src: '/images/edutech-carrusel-2.webp', alt: 'Aula Edutechlife' },
    { src: '/images/edutech-carrusel-3.webp', alt: 'Tecnología Educativa' },
    { src: '/images/edutech-carrusel-4.webp', alt: 'Aprendizaje Digital' },
    { src: '/images/edutech-carrusel-5.webp', alt: 'Innovación' },
    { src: '/images/edutech-carrusel-6.webp', alt: 'Comunidad' },
    { src: '/images/edutech-carrusel-7.webp', alt: 'Educación del Futuro' },
];

const AboutCarousel = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const timerRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        if (paused) return;
        timerRef.current = setInterval(() => {
            goToNext();
        }, 6000);
        return () => clearInterval(timerRef.current);
    }, [active, paused]);

    useEffect(() => {
        carouselImages.forEach((img, i) => {
            const image = new Image();
            image.onload = () => setLoadedImages(prev => ({ ...prev, [i]: true }));
            image.src = img.src;
        });
    }, []);

    const goToNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActive(prev => (prev + 1) % carouselImages.length);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning]);

    const goToPrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActive(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning]);

    const handleDotClick = (index) => {
        if (isTransitioning || index === active) return;
        setIsTransitioning(true);
        setActive(index);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    return (
        <div 
            className="premium-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Glow Effects */}
            <div className="carousel-glow carousel-glow-1" />
            <div className="carousel-glow carousel-glow-2" />
            
            {/* Main Image Container */}
            <div className="carousel-main">
                {carouselImages.map((img, i) => (
                    <div
                        key={i}
                        className={`carousel-slide ${i === active ? 'active' : ''} ${i === (active - 1 + carouselImages.length) % carouselImages.length ? 'prev' : ''}`}
                    >
                        {loadedImages[i] ? (
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover saturate-110"
                            />
                        ) : (
                            <div className="carousel-placeholder">
                                <div className="placeholder-shimmer" />
                            </div>
                        )}
                        
                        {/* Overlay Gradient */}
                        <div className="carousel-overlay" />
                        
                        {/* Mask bottom gradient to merge with page */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                        
                        {/* Neural Grid Effect */}
                        <div className="carousel-grid" />
                        
                        {/* Accent Line */}
                        <div className="carousel-accent-line" />
                    </div>
                ))}
            </div>

            {/* Floating Elements */}
            <div className="carousel-float carousel-float-1">
                <div className="float-icon">
                    <i className="fa-solid fa-brain" />
                </div>
            </div>
            <div className="carousel-float carousel-float-2">
                <div className="float-icon">
                    <i className="fa-solid fa-robot" />
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                className="carousel-arrow carousel-arrow-prev" 
                onClick={goToPrev}
                aria-label="Imagen anterior"
            >
                <i className="fa-solid fa-chevron-left" />
            </button>
            <button 
                className="carousel-arrow carousel-arrow-next" 
                onClick={goToNext}
                aria-label="Siguiente imagen"
            >
                <i className="fa-solid fa-chevron-right" />
            </button>

            {/* Progress Bar */}
            <div className="carousel-progress-track">
                <div 
                    className="carousel-progress-bar"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                />
            </div>

            {/* Navigation Dots */}
            <div className="carousel-dots">
                {carouselImages.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === active ? 'active' : ''}`}
                        onClick={() => handleDotClick(i)}
                        aria-label={`Ir a imagen ${i + 1}`}
                    >
                        <span className="dot-inner" />
                        {i === active && <span className="dot-pulse" />}
                    </button>
                ))}
            </div>

            {/* Slide Counter */}
            <div className="carousel-counter">
                <span className="counter-current">{String(active + 1).padStart(2, '0')}</span>
                <span className="counter-separator">/</span>
                <span className="counter-total">{String(carouselImages.length).padStart(2, '0')}</span>
            </div>

            {/* Caption */}
            <div className="carousel-caption">
                <div className="caption-badge">
                    <i className="fa-solid fa-sparkles" />
                    <span>Nuestra Esencia</span>
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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

    return (
        <section ref={sectionRef} className="about-section w-full py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Columna Izquierda - Premium Carousel */}
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                    <AboutCarousel />
                </div>

                {/* Columna Derecha - Texto */}
                <div className={`about-content transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                    {/* Eyebrow */}
                    <div className="about-eyebrow">
                        <span className="eyebrow-line" />
                        <span className="eyebrow-text">Nuestra Esencia</span>
                    </div>

                    {/* Título */}
                    <h2 className="about-title">
                        <span className="title-kicker">Nuestra esencia</span>
                        <span className="title-main">El Factor</span>
                        <span className="title-accent">
                            Humano.
                            <span className="title-underline" />
                        </span>
                        <span className="title-sub">Maestría detrás de la Tecnología</span>
                    </h2>

                    {/* Descripción */}
                    <div className="about-description">
                        <p>
                            Edutechlife no es solo código — es pedagogía aplicada con rigor académico. Somos licenciados y magísteres con <strong>más de 10 años en el aula colombiana</strong> que entienden profundamente cómo aprende el cerebro humano.
                        </p>
                        <p>
                            Aplicamos metodologías <strong>VAK y STEAM</strong> para que la Inteligencia Artificial sea una herramienta de transformación real. Hemos formado a más de <strong>200 docentes en IA avanzada</strong>, consolidándonos como el <em>Maestro de Maestros</em> de la comunidad educativa nacional.
                        </p>
                    </div>

                    {/* Stats Preview */}
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Años de Experiencia</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">6,000+</span>
                            <span className="stat-label">Estudiantes</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Satisfacción</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
