import React from 'react';
import { motion } from 'framer-motion';

export default function SplitTextReveal({ text, className = '' }) {
    const words = text.split(' ');

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.1
            }
        }
    };

    const charVariants = {
        hidden: { 
            opacity: 0, 
            z: 150, 
            filter: 'blur(10px)',
            rotateX: -90,
            y: 20
        },
        visible: {
            opacity: 1,
            z: 0,
            filter: 'blur(0px)',
            rotateX: 0,
            y: 0,
            transition: {
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1] // power4.out equivalent
            }
        }
    };

    return (
        <span className={`inline-block w-full perspective-1000 ${className}`}>
            <motion.span
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="inline-block"
            >
                {words.map((word, wIdx) => (
                    <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                        {word.split('').map((char, cIdx) => (
                            <motion.span 
                                key={cIdx} 
                                variants={charVariants}
                                className="inline-block"
                                style={{ transformStyle: 'preserve-3d', transformOrigin: 'center bottom' }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </motion.span>
        </span>
    );
}
