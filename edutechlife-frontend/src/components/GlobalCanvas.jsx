import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalCanvas() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
            <motion.div 
                className="absolute inset-0 opacity-[0.03]"
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{
                    backgroundImage: 'radial-gradient(circle at center, #66CCCC 0%, transparent 40%), radial-gradient(circle at 80% 20%, #004B63 0%, transparent 40%)',
                    backgroundSize: '200% 200%'
                }}
            />
            <div className="absolute inset-0 bg-[#F8FAFC]/90" style={{ backdropFilter: 'blur(100px)' }} />
        </div>
    );
}
