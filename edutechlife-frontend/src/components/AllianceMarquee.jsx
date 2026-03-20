import { useEffect, useRef } from 'react';

const logos = [
    { name: 'SENA', icon: 'fa-microchip' },
    { name: 'IBM', icon: 'fa-server' },
    { name: 'Coursera', icon: 'fa-graduation-cap' },
    { name: 'UNESCO', icon: 'fa-globe' },
    { name: 'MIT', icon: 'fa-atom' },
    { name: 'Stanford', icon: 'fa-flask' },
    { name: 'Google', icon: 'fa-search' },
    { name: 'Microsoft', icon: 'fa-cloud' },
];

const AllianceMarquee = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (!marquee) return;

        let animationId;
        let position = 0;
        const speed = 0.4;
        const itemWidth = 200;

        const animate = () => {
            position -= speed;
            const totalWidth = itemWidth * logos.length;

            if (Math.abs(position) >= totalWidth) {
                position = 0;
            }

            marquee.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    const allLogos = [...logos, ...logos];

    return (
        <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#0A1628] to-[#070B14]">
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-3 px-5 py-2 text-[0.65rem] font-mono font-semibold tracking-[0.25em] uppercase text-[#B2D8E5] bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
                    Alianzas Estratégicas
                </span>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0A1628] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0A1628] to-transparent pointer-events-none" />

                <div className="flex overflow-hidden">
                    <div
                        ref={marqueeRef}
                        className="flex gap-4 whitespace-nowrap"
                        style={{ willChange: 'transform' }}
                    >
                        {allLogos.map((logo, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center gap-3 min-w-[180px] px-8 py-6 
                                    bg-white/5 border border-white/10 rounded-2xl
                                    transition-all duration-500 ease-out
                                    grayscale opacity-60
                                    hover:grayscale-0 hover:opacity-100
                                    hover:bg-white/10 hover:border-[#4DA8C4]/40
                                    hover:shadow-[0_0_30px_rgba(77,168,196,0.3)]
                                    hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#4DA8C4]/20 to-[#66CCCC]/10 border border-[#4DA8C4]/30 text-[#4DA8C4] text-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#4DA8C4] group-hover:to-[#66CCCC] group-hover:text-white group-hover:scale-110">
                                    <i className={`fa-solid ${logo.icon}`} />
                                </div>
                                <span className="font-montserrat font-bold text-sm tracking-wider text-white/70 transition-colors duration-300 group-hover:text-white">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllianceMarquee;
