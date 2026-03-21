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
            className="w-full min-h-screen flex flex-col justify-center pt-24 pb-0 bg-gradient-to-b from-[#0B0F19] to-[#0A1628] relative overflow-hidden"
        >
            {/* Dashboard Grid Background */}
            <div className="absolute inset-0">
                <div className="grid-3d" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F19]/20 to-[#0A1628]" />
            </div>

            {/* Dashboard Orbs */}
            <div className="hero-orb-1" />
            <div className="hero-orb-2" />
            <div className="hero-orb-3" />

            {/* Subtle Particles Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{ zIndex: 1 }}
            />

            {/* Main Dashboard Content */}
            <div className="max-w-7xl mx-auto w-full relative z-10 px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Dashboard Left Panel - Editorial */}
                    <div className="space-y-8">
                        {/* Dashboard Kicker */}
                        <div className="hero-kicker">
                            <div className="kicker-line" />
                            <span className="kicker-text">Manizales · Colombia · Est. 2015</span>
                            <div className="kicker-dot" />
                        </div>

                        {/* Dashboard Title */}
                        <div className="space-y-4">
                            <h1 className="hero-title">
                                <span className="title-line">Pedagogía</span>
                                <span className="title-line title-accent">de Élite</span>
                                <span className="title-line">con <span className="title-ia">Inteligencia Artificial</span></span>
                            </h1>

                            {/* Dashboard Badge */}
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#004B63]/10 border border-[#4DA8C4]/20 rounded-full backdrop-blur-sm">
                                <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse" />
                                <span className="text-sm font-mono text-[#66CCCC] tracking-wider">IA · Educación · Impacto Nacional</span>
                            </div>
                        </div>

                        {/* Dashboard Description */}
                        <p className="hero-subtitle">
                            Magísteres en Educación que dominan la IA más avanzada. Más de <strong className="text-[#4DA8C4]">6,000 estudiantes certificados</strong> con respaldo global de IBM y Coursera.
                        </p>

                        {/* Dashboard CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={onNavigateToLab}
                                className="px-8 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(77,168,196,0.5)] transition-all duration-300 hover:-translate-y-1 interactive-glow"
                            >
                                <span className="flex items-center gap-2">
                                    Conoce nuestro impacto
                                    <i className="fa-solid fa-arrow-right text-sm" />
                                </span>
                            </button>
                            <button 
                                onClick={onScrollToPilares}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-chart-line" />
                                    Líneas de Impacto
                                </span>
                            </button>
                        </div>

                        {/* Dashboard Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            {[
                                { label: 'Estudiantes', value: '6K+', icon: 'fa-users' },
                                { label: 'Certificados', value: '98%', icon: 'fa-certificate' },
                                { label: 'Impacto', value: 'A+', icon: 'fa-chart-line' }
                            ].map((stat, index) => (
                                <div key={index} className="dashboard-card p-4 text-center">
                                    <div className="text-2xl font-bold text-[#4DA8C4] mb-1">{stat.value}</div>
                                    <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Right Panel - Visualization */}
                    <div className="relative">
                        <div className="ai-panel p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-[#00C2E0] rounded-full animate-pulse" />
                                    <h3 className="text-lg font-bold text-white">Panel de Impacto IA</h3>
                                </div>
                                <div className="text-xs text-white/40 font-mono">LIVE</div>
                            </div>
                            
                            {/* Data Visualization */}
                            <div className="data-visualization mb-6">
                                <div className="flex items-end justify-between h-32">
                                    {[65, 80, 90, 75, 85, 95].map((height, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <div 
                                                className="w-6 bg-gradient-to-t from-[#4DA8C4] to-[#66CCCC] rounded-t-lg transition-all duration-300 hover:opacity-80"
                                                style={{ height: `${height}%` }}
                                            />
                                            <div className="text-xs text-white/40 mt-2">Q{i+1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Eficiencia IA', value: '94%', trend: 'up' },
                                    { label: 'Satisfacción', value: '96%', trend: 'up' },
                                    { label: 'Retención', value: '89%', trend: 'stable' },
                                    { label: 'Crecimiento', value: '42%', trend: 'up' }
                                ].map((metric, i) => (
                                    <div key={i} className="dashboard-card p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-white/70">{metric.label}</div>
                                            <div className={`text-xs px-2 py-1 rounded ${
                                                metric.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                                                metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-white mt-2">{metric.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer animate-bounce">
                <span className="text-xs uppercase tracking-widest text-white/40">Scroll</span>
                <i className="fa-solid fa-chevron-down text-sm text-white/40" />
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
