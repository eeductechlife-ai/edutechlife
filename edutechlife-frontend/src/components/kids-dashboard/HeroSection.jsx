import { memo } from 'react';
import { motion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import DaniAvatar3D from './DaniAvatar3D';
import { useNavigate } from 'react-router-dom';

// ==========================================
// Hero Section - Dani as Absolute Protagonist
// ==========================================
const HeroSection = memo(() => {
  const { totalPoints, vakResult } = useSmartBoardKids();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días! ☀️';
    if (hour < 18) return '¡Buenas tardes! 🌤';
    return '¡Buenas noches! 🌙';
  };

  const getVAKMessage = () => {
    if (!vakResult) return 'Descubre tu estilo de aprendizaje';
    const style = vakResult.predominantStyle;
    if (style === 'visual') return 'Tu superpoder es la VISIÓN 👁️';
    if (style === 'auditivo') return 'Tu superpoder es el OÍDO 👂';
    if (style === 'kinestésico') return 'Tu superpoder es el MOVIMIENTO 🏃';
    return 'Tienes un estilo único 🎯';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#004B63] to-[#4DA8C4] rounded-3xl p-8 md:p-12 shadow-2xl"
    >
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4DA8C4 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Dani Avatar - Main Protagonist */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
            delay: 0.3,
          }}
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0"
        >
          <DaniAvatar3D mood="happy" size="xl" />
        </motion.div>

        {/* Welcome Text */}
        <div className="flex-1 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm md:text-base mb-2"
          >
            {getGreeting()}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight"
          >
            Soy <span className="text-[#FFD166]">Dani</span>, tu tutor virtual
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white/90 text-lg md:text-xl mb-6"
          >
            {getVAKMessage()}
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-[#FFD166] font-bold text-xl">💎 {totalPoints.toLocaleString()}</span>
              <span className="text-white/80 text-sm ml-2">puntos</span>
            </div>

            {vakResult && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white font-bold text-xl">🧠 {vakResult.predominantStyle.toUpperCase()}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="flex-shrink-0"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 209, 102, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/smartboard?tab=dani')}
            className="px-8 py-4 bg-[#FFD166] text-[#004B63] rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <p className="font-bold">Hablar conmigo</p>
              <p className="text-xs opacity-80">Estoy aquí para ayudarte</p>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Animated Wave Bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-[#4DA8C4]/30"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
