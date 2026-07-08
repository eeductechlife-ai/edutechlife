import { memo } from 'react';
import { motion } from 'framer-motion';

const WaveTransition = memo(({ className = '' }) => {
    return (
        <div className={`relative w-full h-24 sm:h-32 overflow-hidden pointer-events-none ${className}`}>
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#004B63" stopOpacity="0.08" />
                        <stop offset="50%" stopColor="#4DA8C4" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#66CCCC" stopOpacity="0.08" />
                    </linearGradient>
                </defs>

                {/* Main wave */}
                <motion.path
                    d="M0,40 Q300,10 600,40 T1200,40 L1200,120 L0,120 Z"
                    fill="url(#waveGrad)"
                    initial={{ d: "M0,40 Q300,10 600,40 T1200,40 L1200,120 L0,120 Z" }}
                    animate={{
                        d: [
                            "M0,40 Q300,10 600,40 T1200,40 L1200,120 L0,120 Z",
                            "M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z",
                            "M0,40 Q300,10 600,40 T1200,40 L1200,120 L0,120 Z"
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Secondary wave */}
                <motion.path
                    d="M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z"
                    fill="url(#waveGrad)"
                    opacity="0.6"
                    initial={{ d: "M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z" }}
                    animate={{
                        d: [
                            "M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z",
                            "M0,30 Q300,0 600,30 T1200,30 L1200,120 L0,120 Z",
                            "M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z"
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
            </svg>
        </div>
    );
});

WaveTransition.displayName = 'WaveTransition';

export default WaveTransition;
