import { useEffect, useRef, memo } from 'react';
import SectionWrapper from './SectionWrapper';

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
        <SectionWrapper spacing="first">
            <section 
                className="w-full min-h-screen flex flex-col justify-center py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden"
            >
            {/* Fondo Premium con Gradientes Suaves */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradiente de fondo premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
                
                {/* Patrón geométrico sutil */}
                <div className="absolute inset-0 opacity-[0.03]"
                     style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, #4DA8C4 1px, transparent 1px)`,
                         backgroundSize: '60px 60px'
                     }}
                />
                
                {/* Acentos de color suaves */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4DA8C4] opacity-[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#66CCCC] opacity-[0.03] rounded-full blur-3xl" />
            </div>

            {/* Grid 3D Animation Mejorado */}
            <div className="grid-3d" />

            {/* Organic Blobs Premium */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#4DA8C4]/[0.03] to-[#66CCCC]/[0.02] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#004B63]/[0.03] to-[#0A1628]/[0.02] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Subtle Particles Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{ zIndex: 1 }}
            />

            {/* Main Content Grid Premium */}
            <div className="container-premium relative z-10">
                <div className="grid-cols-2-premium grid-premium items-center">
                    {/* Columna Izquierda - Texto Editorial Premium */}
                    <div className="space-y-8">
                         {/* Kicker Premium */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse-slow" />
                            <span className="text-sm font-mono font-semibold text-white tracking-wider">
                                Manizales · Colombia · Est. 2015
                            </span>
                            <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                        </div>

                         {/* Título Premium */}
                        <div className="space-y-6">
                            <h1 className="display-1">
                                <span className="block text-white">Pedagogía</span>
                                <span className="block text-gradient-primary accent-line-solid">de Élite</span>
                                <span className="block text-slate-300 text-3xl font-light mt-4">
                                    con <span className="font-semibold text-[#4DA8C4]">Inteligencia Artificial</span>
                                </span>
                            </h1>

                             {/* Badge Premium */}
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 glass-accent rounded-full hover-lift">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    <div className="w-2 h-2 bg-[#004B63] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                                </div>
                                <span className="text-sm font-mono font-semibold text-white tracking-wider">
                                    IA · Educación · Impacto Nacional
                                </span>
                            </div>
                        </div>

                         {/* Descripción Premium */}
                        <p className="body-lg text-slate-300 max-w-xl leading-relaxed">
                            Magísteres en Educación que dominan la <strong className="text-[#4DA8C4] font-semibold">IA más avanzada</strong>. 
                            Más de <strong className="text-[#66CCCC] font-semibold">6,000 estudiantes certificados</strong> con respaldo 
                            global de <span className="text-gradient-primary font-semibold">IBM y Coursera</span>.
                        </p>

                        {/* CTAs Premium */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button 
                                onClick={onNavigateToLab}
                                className="btn-primary hover-glow"
                            >
                                <span className="flex items-center gap-2">
                                    Conoce nuestro impacto
                                    <i className="fa-solid fa-arrow-right text-sm transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={onScrollToPilares}
                            >
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-chart-line" />
                                    Líneas de Impacto
                                </span>
                            </button>
                        </div>

                         {/* Trust Strip Premium */}
                        <div className="pt-8">
                            <div className="inline-flex items-center gap-3 text-sm text-slate-400 mb-3">
                                <div className="w-4 h-px bg-gradient-to-r from-transparent via-[#4DA8C4] to-transparent" />
                                <span className="font-mono text-xs uppercase tracking-widest">Operadores Certificados</span>
                                <div className="w-4 h-px bg-gradient-to-r from-transparent via-[#66CCCC] to-transparent" />
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                {['SenaTIC', 'IBM', 'Coursera', 'MinTIC'].map((brand, index) => (
                                    <div 
                                        key={brand}
                                        className="group relative"
                                    >
                                        <div className="text-lg font-display font-bold text-slate-300 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                            {brand}
                                        </div>
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] group-hover:w-full transition-all duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Elemento Visual Premium */}
                    <div className="relative">
                        <div className="relative">
                            {/* Tarjeta Glass Premium */}
                            <div className="glass-card p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full animate-pulse" />
                                         <h3 className="text-lg font-display font-bold text-white">Impacto Educativo</h3>
                                    </div>
                                    <div className="text-xs font-mono font-semibold text-[#66CCCC] bg-[#66CCCC]/10 px-3 py-1 rounded-full">
                                        LIVE
                                    </div>
                                </div>
                                
                                {/* Visualización de Datos */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        {[
                                            { label: 'Estudiantes', value: '6K+', color: '#4DA8C4' },
                                            { label: 'Certificados', value: '98%', color: '#66CCCC' },
                                            { label: 'Satisfacción', value: '4.8/5', color: '#004B63' }
                                        ].map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className="text-2xl font-display font-bold mb-1" style={{ color: stat.color }}>
                                                    {stat.value}
                                                </div>
                                                 <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Barra de progreso sutil */}
                                    <div className="pt-4 border-t border-white/10">
                                         <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                                            <span>Progreso IA 2024</span>
                                            <span className="font-semibold text-[#4DA8C4]">84%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] transition-all duration-1000"
                                                style={{ width: '84%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Elementos flotantes decorativos */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 glass-accent rounded-xl flex items-center justify-center animate-float">
                                <i className="fa-solid fa-brain text-[#4DA8C4] text-xl" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-12 h-12 glass-accent rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                                <i className="fa-solid fa-robot text-[#66CCCC] text-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator Premium */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group animate-bounce">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-[#4DA8C4] transition-colors">
                    Scroll
                </span>
                <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex items-start justify-center p-1 group-hover:border-[#4DA8C4] transition-colors">
                    <div className="w-1.5 h-1.5 bg-[#4DA8C4] rounded-full animate-bounce" />
                </div>
            </div>
            </section>
        </SectionWrapper>
    );
});

Hero.displayName = 'Hero';

export default Hero;
