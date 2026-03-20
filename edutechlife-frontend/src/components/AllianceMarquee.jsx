import { useEffect, useRef } from 'react';

const logos = [
    { icon: 'fa-graduation-cap', name: 'SenaTIC', sub: 'Ministerio TIC' },
    { icon: 'fa-microchip', name: 'IBM', sub: 'Watson Education' },
    { icon: 'fa-book-open', name: 'Coursera', sub: 'Global Learning' },
    { icon: 'fa-landmark', name: 'MinTIC', sub: 'Colombia Digital' },
    { icon: 'fa-award', name: 'SenaTIC', sub: 'Certificación Oficial' },
    { icon: 'fa-brain', name: 'IBM', sub: 'AI for Education' },
    { icon: 'fa-globe', name: 'Coursera', sub: '+200 Países' },
    { icon: 'fa-flag', name: 'MinTIC', sub: 'Alianza Nacional' },
];

const AllianceMarquee = () => {
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animationId;
        let position = 0;
        const speed = 0.5;

        const animate = () => {
            position -= speed;
            const totalWidth = track.scrollWidth / 2;

            if (Math.abs(position) >= totalWidth) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    const allLogos = [...logos, ...logos];

    return (
        <div className="relative py-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
            {/* Header label */}
            <div className="max-w-7xl mx-auto px-5% mb-8">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#B2D8E5]" />
                    <span className="font-mono text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.3em] whitespace-nowrap">
                        Ecosistema de Nivel Mundial
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#B2D8E5]" />
                </div>
            </div>

            {/* Marquee Container */}
            <div className="marquee-wrap">
                {/* Fade gradients */}
                <div className="marquee-fade-left" />
                <div className="marquee-fade-right" />

                {/* Track */}
                <div className="marquee-track" ref={trackRef}>
                    {allLogos.map((logo, i) => (
                        <div key={i} className="marquee-logo">
                            <div className="marquee-icon-wrap">
                                <i className={`fa-solid ${logo.icon}`} />
                            </div>
                            <div>
                                <span className="brand-name">{logo.name}</span>
                                <span className="brand-sub">{logo.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllianceMarquee;
