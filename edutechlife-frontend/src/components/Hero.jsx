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
        <section 
            className="relative min-h-screen flex flex-col justify-center items-center px-5% pt-32 pb-20 overflow-hidden"
            style={{ background: '#0A1628' }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 perspective-500" style={{ transform: 'translateX(-50%) perspective(500px) rotateX(62deg)', width: '180%', height: '60vh', backgroundImage: 'linear-gradient(rgba(77, 168, 196, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 168, 196, 0.06) 1px, transparent 1px)', backgroundSize: '55px 55px', animation: 'grid-move 30s linear infinite', maskImage: 'radial-gradient(ellipse 80% 50% at center bottom, black 5%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at center bottom, black 5%, transparent 70%)' }} />

            <div className="absolute rounded-full pointer-events-none filter blur-3xl opacity-40" style={{ top: '5%', right: '-15%', width: 'min(600px, 50vw)', height: 'min(600px, 50vw)', background: 'radial-gradient(circle, rgba(77, 168, 196, 0.25), transparent 70%)', animation: 'orb-float-1 20s ease-in-out infinite' }} />
            <div className="absolute rounded-full pointer-events-none filter blur-3xl opacity-30" style={{ bottom: '15%', left: '-20%', width: 'min(500px, 45vw)', height: 'min(500px, 45vw)', background: 'radial-gradient(circle, rgba(102, 204, 204, 0.15), transparent 70%)', animation: 'orb-float-2 25s ease-in-out infinite' }} />
            <div className="absolute rounded-full pointer-events-none filter blur-3xl opacity-20" style={{ top: '50%', left: '25%', width: 'min(300px, 30vw)', height: 'min(300px, 30vw)', background: 'radial-gradient(circle, rgba(178, 216, 229, 0.1), transparent 70%)', animation: 'orb-float-3 18s ease-in-out infinite' }} />

            <div className="relative z-10 text-center max-w-4xl w-full">
                <div className="inline-flex items-center gap-3 mb-6 font-mono text-xs font-semibold uppercase tracking-widest text-mint px-4 py-2 rounded-full" style={{ background: 'rgba(102, 204, 204, 0.08)', border: '1px solid rgba(102, 204, 204, 0.15)', backdropFilter: 'blur(12px)' }}>
                    <span className="w-6 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, #4DA8C4, #66CCCC)' }} />
                    <span>Innovación Pedagógica</span>
                    <span className="w-2 h-2 rounded-full bg-mint animate-pulse" style={{ boxShadow: '0 0 12px #66CCCC' }} />
                </div>

                <h1 className="font-display font-black mb-8 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.04em' }}>
                    <span className="block text-white">Liderando la Educación</span>
                    <span className="block text-mint line-accent">del Futuro</span>
                    <span className="block text-white mt-2">con Pedagogía e </span>
                    <span className="block" style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Inteligencia Artificial</span>
                </h1>

                <p className="font-body text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Transformamos la educación a través de metodologías VAK y agentes de IA, 
                    creando experiencias personalizadas para estudiantes de 8 a 16 años.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={onNavigateToLab}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-base uppercase tracking-wide text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', boxShadow: '0 8px 24px rgba(77, 168, 196, 0.35)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(102, 204, 204, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(77, 168, 196, 0.35)';
                        }}
                    >
                        <span>Comenzar con Valerio</span>
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                    <button
                        onClick={onScrollToPilares}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-bold text-base uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-1"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)' }}
                    >
                        <span>Explorar Plataforma</span>
                        <i className="fa-solid fa-chevron-down" />
                    </button>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium uppercase tracking-widest" style={{ background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', color: '#B2D8E5' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-corporate animate-pulse" style={{ boxShadow: '0 0 8px #4DA8C4' }} />
                    <span>Powered by DeepSeek AI</span>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 font-mono text-xs uppercase tracking-widest animate-bounce cursor-pointer">
                <span>Scroll</span>
                <i className="fa-solid fa-chevron-down text-lg" />
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
