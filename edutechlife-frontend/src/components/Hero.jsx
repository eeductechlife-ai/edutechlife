import { useEffect, useRef, memo } from 'react';
import SectionWrapper from './SectionWrapper';

const Hero = memo(() => {
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
                className="w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative overflow-hidden"
            >
            {/* Fondo Premium con Gradientes Suaves */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradiente de fondo premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]" />
                
                {/* Patrón geométrico sutil */}
                <div className="absolute inset-0 opacity-[0.02]"
                     style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, #1B9EBA 1px, transparent 1px)`,
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

            {/* Main Content Premium */}
            <div className="container-premium relative z-10">
                <div className="max-w-3xl">
                    {/* Kicker Premium */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full shadow-sm mb-6">
                        <div className="w-2 h-2 bg-[#1B9EBA] rounded-full animate-pulse-slow" />
                        <span className="text-sm font-mono font-semibold text-[#0A3044] tracking-wider">
                            Manizales · Colombia · Est. 2015
                        </span>
                        <div className="w-2 h-2 bg-[#1B9EBA] rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                    </div>

                    {/* Título Premium */}
                    <div className="space-y-6">
                        <h1 className="display-1">
                            <span className="block text-[#0A3044]">Pedagogía</span>
                            <span className="block text-[#1B9EBA]">de Élite</span>
                            <span className="block text-[#334155] text-3xl font-light mt-4">
                                con <span className="font-semibold text-[#1B9EBA]">Inteligencia Artificial</span>
                            </span>
                        </h1>
                        
                        {/* Descripción Premium */}
                        <p className="body-lg text-[#334155] max-w-2xl leading-relaxed">
                            Magísteres en Educación que dominan la <strong className="text-[#1B9EBA] font-semibold">IA más avanzada</strong>. 
                            Más de <strong className="text-[#1B9EBA] font-semibold">6,000 estudiantes certificados</strong> con respaldo 
                            global de <span className="font-semibold text-[#0A3044]">IBM y Coursera</span>.
                        </p>
                    </div>
                </div>
            </div>
            </section>
        </SectionWrapper>
    );
});

Hero.displayName = 'Hero';

export default Hero;
