import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SplitTextReveal({ text, className = '' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const chars = containerRef.current.querySelectorAll('.split-char');
        
        gsap.fromTo(chars, 
            { 
                opacity: 0, 
                z: 150, 
                filter: 'blur(10px)',
                rotationX: -90,
                y: 20
            },
            {
                opacity: 1,
                z: 0,
                filter: 'blur(0px)',
                rotationX: 0,
                y: 0,
                duration: 1.4,
                stagger: 0.04,
                ease: "power4.out",
                delay: 0.1
            }
        );
    }, [text]);

    const words = text.split(' ');

    return (
        <span ref={containerRef} className={`inline-block w-full perspective-1000 ${className}`}>
            {words.map((word, wIdx) => (
                <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                    {word.split('').map((char, cIdx) => (
                        <span 
                            key={cIdx} 
                            className="split-char inline-block"
                            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center bottom' }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
}
