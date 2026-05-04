import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// Dani Avatar 3D - Main Protagonist
// ==========================================
const moodConfig = {
  happy: {
    emoji: '😊',
    scale: 1,
    rotate: 0,
    glow: '#4DA8C4',
    bgGradient: 'from-[#4DA8C4] to-[#66CCCC]',
    shadow: '0 0 30px rgba(77, 168, 196, 0.5)',
  },
  thinking: {
    emoji: '🤔',
    scale: 1.05,
    rotate: [0, 5, -5, 0],
    glow: '#FFD166',
    bgGradient: 'from-[#FFD166] to-[#FF8E53]',
    shadow: '0 0 30px rgba(255, 209, 102, 0.5)',
  },
  explaining: {
    emoji: '📚',
    scale: 1.1,
    rotate: 0,
    glow: '#66CCCC',
    bgGradient: 'from-[#66CCCC] to-[#004B63]',
    shadow: '0 0 30px rgba(102, 204, 204, 0.5)',
  },
  empathetic: {
    emoji: '💙',
    scale: 1.05,
    rotate: 0,
    glow: '#FF6B9D',
    bgGradient: 'from-[#FF6B9D] to-[#FF8E53]',
    shadow: '0 0 30px rgba(255, 107, 157, 0.5)',
  },
  celebrating: {
    emoji: '🎉',
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    glow: '#FFD166',
    bgGradient: 'from-[#FFD166] to-[#FF6B9D]',
    shadow: '0 0 40px rgba(255, 209, 102, 0.7)',
  },
};

const DaniAvatar3D = memo(({ mood = 'happy', isTyping = false, size = 'lg' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = moodConfig[mood] || moodConfig.happy;

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-32 h-32 text-6xl',
    xl: 'w-48 h-48 text-8xl',
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size] || sizeClasses.lg} rounded-full flex items-center justify-center cursor-pointer`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsHovered(true)}
      onTapCancel={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.1 : config.scale,
        boxShadow: config.shadow,
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.bgGradient}`}
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
          scale: isHovered ? 1.2 : 1,
        }}
        style={{
          filter: 'blur(20px)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Main Avatar Circle */}
      <motion.div
        className={`relative z-10 w-full h-full rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center shadow-2xl`}
        animate={{
          rotate: config.rotate,
          scale: config.scale,
        }}
        transition={{
          rotate: config.rotate.length ? {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          } : { duration: 0.5 },
          scale: { type: 'spring', damping: 25 },
        }}
      >
        <motion.span
          animate={{
            scale: isTyping ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: isTyping ? Infinity : 0,
          }}
        >
          {config.emoji}
        </motion.span>
      </motion.div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFD166] rounded-full flex items-center justify-center shadow-lg z-20"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles around Avatar */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#4DA8C4] z-0"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos((i * 60) * Math.PI / 180) * 60,
                y: Math.sin((i * 60) * Math.PI / 180) * 60,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
});

DaniAvatar3D.displayName = 'DaniAvatar3D';

export default DaniAvatar3D;
