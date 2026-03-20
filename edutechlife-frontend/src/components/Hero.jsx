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
            canvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.3 + 0.15),
            speedX: (Math.random() - 0.5) * 0.1,
            opacity: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.6 ? '#4DA8C4' : Math.random() > 0.5 ? '#66CCCC' : '#B2D8E5',
            twinkle: Math.random() * Math.PI * 2,
        });

        const initParticles = () => {
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            particlesRef.current = Array.from({ length: count }, createParticle);
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.02;

            particlesRef.current.forEach((p, index) => {
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(time + p.twinkle) * 0.05;
                p.twinkle += 0.01;

                const twinkleOpacity = p.opacity * (0.6 + Math.sin(time * 2 + p.twinkle) * 0.4);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = twinkleOpacity;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();

                if (p.y < -20) {
                    particlesRef.current[index] = createParticle();
                }
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
        <section className="hero-section">
            <canvas
                ref={canvasRef}
                className="hero-particles"
            />

            <div className="hero-grid-3d" />

            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />

            <div className="hero-content">
                <div className="hero-kicker">
                    <span className="kicker-line" />
                    <span className="kicker-text">Innovacion Pedagogica</span>
                    <span className="kicker-dot" />
                </div>

                <h1 className="hero-title">
                    <span className="title-line">Liderando la Educacion del{' '}</span>
                    <span className="title-accent">Futuro</span>
                    <br className="title-break" />
                    <span className="title-line">con Pedagogia e </span>
                    <span className="title-ia">IA</span>
                </h1>

                <p className="hero-subtitle">
                    Transformamos la educacion a traves de la inteligencia artificial, 
                    creando experiencias de aprendizaje personalizadas para estudiantes de 8 a 16 anos.
                </p>

                <div className="hero-cta">
                    <button
                        onClick={onNavigateToLab}
                        className="btn-hero-primary"
                    >
                        <span>Comenzar Ahora</span>
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                    <button
                        onClick={onScrollToPilares}
                        className="btn-hero-secondary"
                    >
                        <span>Conocer Mas</span>
                        <i className="fa-solid fa-chevron-down" />
                    </button>
                </div>

                <div className="hero-badge">
                    <span className="badge-dot" />
                    <span>Powered by DeepSeek AI</span>
                </div>
            </div>

            <div className="scroll-indicator">
                <span>Scroll</span>
                <i className="fa-solid fa-chevron-down" />
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
