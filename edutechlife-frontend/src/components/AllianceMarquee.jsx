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
        const speed = 0.5;
        const itemWidth = 180;

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
        <section className="alliance-section">
            <div className="alliance-label">
                <span>Alianzas Estrategicas</span>
            </div>
            
            <div className="marquee-container">
                <div className="marquee-fade-left"></div>
                <div className="marquee-fade-right"></div>
                
                <div className="marquee-track" ref={marqueeRef}>
                    {allLogos.map((logo, index) => (
                        <div key={index} className="marquee-item">
                            <div className="marquee-logo">
                                <i className={`fa-solid ${logo.icon}`}></i>
                            </div>
                            <span className="marquee-name">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllianceMarquee;
