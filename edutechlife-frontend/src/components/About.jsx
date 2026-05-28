import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../i18n/I18nProvider';
import SectionWrapper from './SectionWrapper';
import { Icon } from '../utils/iconMapping.jsx';

const AboutCarousel = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const { t } = useTranslation();
    const carouselImages = [
        { src: '/images/edutech-carrusel-1.webp', altKey: 'about.carousel.alt_1' },
        { src: '/images/edutech-carrusel-2.webp', altKey: 'about.carousel.alt_2' },
        { src: '/images/edutech-carrusel-3.webp', altKey: 'about.carousel.alt_3' },
        { src: '/images/edutech-carrusel-4.webp', altKey: 'about.carousel.alt_4' },
        { src: '/images/edutech-carrusel-5.webp', altKey: 'about.carousel.alt_5' },
        { src: '/images/edutech-carrusel-6.webp', altKey: 'about.carousel.alt_6' },
        { src: '/images/edutech-carrusel-7.webp', altKey: 'about.carousel.alt_7' },
    ];
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
                                alt={t(img.altKey)}
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
                    <Icon name="fa-brain" />
                </div>
            </div>
            <div className="carousel-float carousel-float-2">
                <div className="float-icon">
                    <Icon name="fa-robot" />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="carousel-progress-track">
                <div 
                    className="carousel-progress-bar"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                />
            </div>

            {/* Caption */}
            <div className="carousel-caption">
                <div className="caption-badge">
                    <Icon name="fa-sparkles" />
                    <span>{t('about.caption_badge')}</span>
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const { t } = useTranslation();
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
        <SectionWrapper spacing="md">
             <section ref={sectionRef} className="about-section w-full">
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
                        <span className="eyebrow-text">{t('about.eyebrow_text')}</span>
                    </div>

                    {/* Título */}
                    <h2 className="about-title">
                        <span className="title-kicker">{t('about.title_kicker')}</span>
                        <span className="title-main">{t('about.title_main')}</span>
                        <span className="title-accent">
                            {t('about.title_accent')}
                            <span className="title-underline" />
                        </span>
                        <span className="title-sub">{t('about.title_sub')}</span>
                    </h2>

                    {/* Descripción */}
                    <div className="about-description">
                        <p dangerouslySetInnerHTML={{ __html: t('about.desc_1') }} />
                        <p dangerouslySetInnerHTML={{ __html: t('about.desc_2') }} />
                    </div>

                    {/* Stats Preview */}
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">{t('about.stat_years')}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">6,000+</span>
                            <span className="stat-label">{t('about.stat_students')}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">{t('about.stat_satisfaction')}</span>
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </SectionWrapper>
    );
};

export default About;
