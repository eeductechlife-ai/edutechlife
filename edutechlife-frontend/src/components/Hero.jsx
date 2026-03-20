import { useEffect, useRef, useMemo } from 'react';

const Hero = ({ onNavigateToLab, onScrollToPilares }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        const particles = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.3,
            color: Math.random() > 0.5 ? '#4DA8C4' : '#66CCCC',
        });

        const initParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                const p = createParticle();
                p.y = Math.random() * canvas.height;
                particles.push(p);
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();

                p.y -= p.speedY;
                p.x += p.speedX;

                if (p.y < -10) {
                    particles[index] = createParticle();
                }
            });

            ctx.globalAlpha = 1;
        };

        const animate = () => {
            drawParticles();
            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <section className="hero-section">
            <canvas 
                ref={canvasRef}
                className="hero-particles"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />

            <div className="grid-3d"></div>

            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
            <div className="hero-orb hero-orb-3"></div>

            <div className="hero-content">
                <div className="hero-kicker">
                    <span>Innovacion Pedagogica</span>
                    <div className="hero-kicker-dot"></div>
                </div>

                <h1 className="hero-title">
                    Liderando la Educacion del{' '}
                    <span className="line-accent" style={{ color: '#66CCCC' }}>Futuro</span>
                    {' '}con Pedagogia e{' '}
                    <span className="line-dark" style={{ color: '#4DA8C4' }}>IA</span>
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
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    <button 
                        onClick={onScrollToPilares}
                        className="btn-hero-secondary"
                    >
                        <span>Conocer Mas</span>
                        <i className="fa-solid fa-chevron-down"></i>
                    </button>
                </div>

                <div className="hero-badge">
                    <div className="hero-badge-dot"></div>
                    <span>Powered by DeepSeek AI</span>
                </div>
            </div>

            <div className="scroll-indicator">
                <span>Scroll</span>
                <i className="fa-solid fa-chevron-down"></i>
            </div>
        </section>
    );
};

export default Hero;
