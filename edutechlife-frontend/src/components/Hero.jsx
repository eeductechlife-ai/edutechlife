import { useEffect, useRef, memo } from 'react';

const Hero = memo(({ onNavigateToLab, onScrollToPilares }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.offsetHeight || 600;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1,
            color: Math.random() > 0.5 ? 'rgba(0, 194, 224, 0.3)' : 'rgba(0, 75, 99, 0.15)',
        });

        const initParticles = () => {
            const count = Math.min(40, Math.floor((canvas.width * canvas.height) / 20000));
            particlesRef.current = Array.from({ length: count }, createParticle);
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });

            ctx.globalAlpha = 1;
        };

        const animate = () => {
            drawParticles();
            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        const handleResize = () => {
            resizeCanvas();
            initParticles();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section 
            className="w-full min-h-screen flex flex-col justify-center pt-24 pb-0 bg-white relative overflow-hidden"
        >
            {/* Grid 3D Animation */}
            <div className="grid-3d" />

            {/* Organic Blobs */}
            <div className="blob blob-tl" style={{ top: -100, left: -100 }} />
            <div className="blob blob-br" style={{ bottom: -100, right: -100 }} />

            {/* Subtle Particles Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{ zIndex: 1 }}
            />

            {/* Hero Orbs */}
            <div className="hero-orb-main" />
            <div className="hero-orb-satellite" />
            <div className="hero-orb-micro" />

            {/* Main Content Grid */}
            <div 
                className="max-w-7xl mx-auto w-full relative z-10 px-6 lg:px-8"
                style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'center' }}
            >
                {/* Columna Izquierda - Texto Editorial */}
                <div>
                    {/* Kicker supratítulo */}
                    <div className="hero-kicker">
                        Manizales · Colombia · Est. 2015
                    </div>

                    {/* Título profesional compacto */}
                    <div className="mb-10" style={{ textAlign: 'left' }}>
                        <h1 className="hero-title">
                            <span className="line-dark">Pedagogía</span>
                            <span className="line-accent">de Élite</span>
                            <span className="line-thin">con Inteligencia Artificial.</span>
                        </h1>

                        {/* Badge IA inline */}
                        <div className="ia-badge">
                            <span className="ia-badge-dot" />
                            IA · Educación · Impacto Nacional
                        </div>
                    </div>

                    <p className="hero-sub" style={{ maxWidth: '38rem', marginBottom: '3rem' }}>
                        Magísteres en Educación que dominan la IA más avanzada. Más de <strong>6,000 estudiantes certificados</strong> con respaldo global de IBM y Coursera.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap justify-start items-center gap-4 mb-10">
                        <button 
                            onClick={onNavigateToLab}
                            className="btn-primary glass-button"
                        >
                            Conoce nuestro impacto <i className="fa-solid fa-arrow-right text-xs ml-2" />
                        </button>
                        <button 
                            className="btn-ghost glass-button"
                            onClick={onScrollToPilares}
                        >
                            <i className="fa-solid fa-play mr-2" />
                            Líneas de Impacto
                        </button>
                    </div>

                    {/* Trust Strip */}
                    <div className="trust-strip">
                        <span>Operadores certificados:</span>
                        <div className="flex items-center gap-4">
                            {['SenaTIC', 'IBM', 'Coursera', 'MinTIC'].map((brand) => (
                                <span 
                                    key={brand}
                                    className="font-bold text-sm"
                                    style={{ 
                                        opacity: 0.6,
                                        fontFamily: 'var(--font-display)'
                                    }}
                                >
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer">
                <span className="text-xs uppercase tracking-widest opacity-40">Scroll</span>
                <i className="fa-solid fa-chevron-down text-sm opacity-40" />
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
