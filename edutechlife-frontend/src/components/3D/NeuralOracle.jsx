import React from 'react';
import { motion } from 'framer-motion';

export default function NeuralOracle() {
    return (
        <div className="w-full h-[500px] md:h-[600px] relative z-10 perspective-1000 pointer-events-none flex items-center justify-center">
            {/* Lottie / WebM Alpha Video Placeholder */}
            <motion.div 
                className="relative w-full h-full max-w-[400px] max-h-[400px]"
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#004B63]/20 to-[#4DA8C4]/20 rounded-full blur-[40px]" />
                <div className="w-full h-full rounded-full border border-[#4DA8C4]/30 bg-white/5 backdrop-blur-md shadow-[inset_0_0_50px_rgba(77,168,196,0.2)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <span className="text-[#004B63] font-bold text-xs tracking-widest uppercase z-10 px-4 py-2 border border-[#4DA8C4]/40 rounded-full bg-white/50 backdrop-blur-xl">
                        [ Pre-rendered 3D Asset ]
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
