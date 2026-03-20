import { useEffect, useRef } from 'react';

const logos = [
    { icon: 'fa-graduation-cap', name: 'SenaTIC', sub: 'Certificación Oficial' },
    { icon: 'fa-microchip', name: 'IBM', sub: 'Watson Education' },
    { icon: 'fa-book-open', name: 'Coursera', sub: 'Global Learning' },
    { icon: 'fa-landmark', name: 'MinTIC', sub: 'Colombia Digital' },
    { icon: 'fa-award', name: 'ICFES', sub: 'Evaluación Nacional' },
    { icon: 'fa-brain', name: 'Stanford', sub: 'AI Research' },
    { icon: 'fa-globe', name: 'UNESCO', sub: 'Educación Global' },
    { icon: 'fa-rocket', name: 'NASA', sub: 'STEM Programs' },
];

const AllianceMarquee = () => {
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animationId;
        let position = 0;
        const speed = 0.4;

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
        <section className="alliance-section">
            <div className="alliance-label">
                <span>Ecosistema de Nivel Mundial</span>
            </div>
            
            <div className="marquee-container">
                <div className="marquee-fade-left" />
                <div className="marquee-fade-right" />
                
                <div className="marquee-track" ref={trackRef}>
                    {allLogos.map((logo, i) => (
                        <div key={i} className="marquee-item">
                            <div className="marquee-logo">
                                <i className={`fa-solid ${logo.icon}`} />
                            </div>
                            <span className="marquee-name">{logo.name}</span>
                            <span className="marquee-sub">{logo.sub}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllianceMarquee;
