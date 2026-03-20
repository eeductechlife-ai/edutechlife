import { useState, useEffect, useRef, useCallback } from 'react';

const images = [
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800', alt: 'Estudiantes Edutechlife' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800', alt: 'Aula Edutechlife' },
    { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800', alt: 'Tecnología Educativa' },
    { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800', alt: 'Aprendizaje Digital' },
];

const AboutCarousel = () => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (paused) return;
        timerRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timerRef.current);
    }, [active, paused]);

    const next = useCallback(() => setActive(prev => (prev + 1) % images.length), []);
    const prev = useCallback(() => setActive(prev => (prev - 1 + images.length) % images.length), []);

    return (
        <div
            className="about-carousel-wrap about-img-wrap reveal"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', height: '480px', boxShadow: '0 32px 80px rgba(0,0,0,.22)', cursor: 'pointer', flexShrink: 0 }}
        >
            {/* Slides */}
            {images.map((img, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: i === active ? 1 : 0,
                        zIndex: i === active ? 2 : (i === (active - 1 + images.length) % images.length ? 1 : 0),
                        transition: 'opacity .95s cubic-bezier(.4,0,.2,1)',
                        overflow: 'hidden'
                    }}
                >
                    <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: i === active ? 'scale(1.08)' : 'scale(1)',
                            transition: i === active ? 'transform 6s cubic-bezier(.25,.46,.45,.94)' : 'none'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(160deg,rgba(6,19,34,.05) 0%,rgba(6,19,34,.12) 30%,rgba(6,19,34,.78) 100%)'
                    }} />
                    {/* Scan line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg,transparent,rgba(0,194,224,.5),transparent)',
                        animation: i === active ? 'scan-line 3s ease-in-out infinite' : 'none'
                    }} />
                </div>
            ))}

            {/* Prev/Next buttons */}
            <button
                onClick={prev}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,.12)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all .3s'
                }}
            >
                <i className="fa-solid fa-chevron-left" />
            </button>
            <button
                onClick={next}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1rem',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,.12)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all .3s'
                }}
            >
                <i className="fa-solid fa-chevron-right" />
            </button>

            {/* Dot indicators */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '.4rem',
                zIndex: 10
            }}>
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        style={{
                            width: i === active ? 20 : 6,
                            height: 6,
                            borderRadius: 3,
                            border: 'none',
                            cursor: 'pointer',
                            background: i === active ? '#66CCCC' : 'rgba(255,255,255,.35)',
                            transition: 'all .4s'
                        }}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255,255,255,.08)',
                zIndex: 10
            }}>
                <div
                    key={active}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg,var(--color-corporate),var(--color-mint))',
                        borderRadius: '0 2px 2px 0',
                        animation: paused ? 'none' : 'carousel-progress 5.2s linear forwards'
                    }}
                />
            </div>

            {/* Slide counter */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                color: 'rgba(255,255,255,.5)',
                letterSpacing: '.12em',
                background: 'rgba(0,0,0,.25)',
                backdropFilter: 'blur(6px)',
                padding: '5px 10px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,.1)'
            }}>
                {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
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
        <section ref={sectionRef} className="about-section">
            <div className="max-w-7xl mx-auto" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
                {/* Columna Izquierda - Carousel */}
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                    <AboutCarousel />
                </div>

                {/* Columna Derecha - Texto */}
                <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                    {/* Eyebrow */}
                    <div className="eyebrow mb-6">
                        <span className="eyebrow-dot" />
                        <span>Nuestra Esencia</span>
                    </div>

                    {/* Título */}
                    <h2 className="heading-font mb-8" style={{ fontSize: 'clamp(2.5rem,4vw,4rem)', textAlign: 'left', lineHeight: 1.1 }}>
                        <span style={{ display: 'block', color: '#4A4A4A', fontWeight: 600, fontSize: '0.4em', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                            Nuestra esencia
                        </span>
                        <span style={{ display: 'block', color: '#4A4A4A' }}>El Factor</span>
                        <span style={{ display: 'block', position: 'relative', paddingBottom: '16px' }}>
                            <span style={{ 
                                color: 'var(--color-corporate)', 
                                textShadow: '0 0 30px rgba(77, 168, 196, 0.3)'
                            }}>
                                Humano.
                            </span>
                            <span style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '22.5%',
                                height: '4px',
                                width: '55%',
                                background: 'linear-gradient(90deg,var(--color-corporate),var(--color-mint))',
                                borderRadius: '2px',
                                boxShadow: '0 0 15px rgba(77, 168, 196, 0.5)'
                            }} />
                        </span>
                        <span style={{ display: 'block', fontSize: '0.3em', fontWeight: 500, color: '#4A4A4A', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                            Maestría detrás de la Tecnología
                        </span>
                    </h2>

                    {/* Descripción */}
                    <div className="flex flex-col gap-6" style={{ fontSize: '1.15rem', color: '#4A4A4A', fontWeight: 400, lineHeight: 1.8, textAlign: 'left' }}>
                        <p>
                            Edutechlife no es solo código — es pedagogía aplicada con rigor académico. Somos licenciados y magísteres con <strong style={{ color: '#004B63', fontWeight: 600 }}>más de 10 años en el aula colombiana</strong> que entienden profundamente cómo aprende el cerebro humano.
                        </p>
                        <p>
                            Aplicamos metodologías <strong style={{ color: '#004B63', fontWeight: 600 }}>VAK y STEAM</strong> para que la Inteligencia Artificial sea una herramienta de transformación real. Hemos formado a más de <strong style={{ color: '#66CCCC', fontWeight: 600 }}>200 docentes en IA avanzada</strong>, consolidándonos como el <em>Maestro de Maestros</em> de la comunidad educativa nacional.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
