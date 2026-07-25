import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import DaniAvatar3D from './DaniAvatar3D';
import { useNavigate } from 'react-router-dom';
import { SB_GRADIENTS, SB_COLORS, glow } from './smartboardTheme';

// ==========================================
// Hero Section 2.0 — Dani as Absolute Protagonist
// Premium, vibrant, crafted for students 8–16
// ==========================================
const HeroSection = memo(() => {
  const { totalPoints, vakResult } = useSmartBoardKids();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

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

  const floatAnim = reduce
    ? {}
    : { y: [0, -14, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-[2rem] p-8 md:p-12"
      style={{
        background: SB_GRADIENTS.hero,
        boxShadow: `${glow(SB_COLORS.primary, 0.4)}, 0 24px 60px -20px rgba(0,48,63,0.55)`,
      }}
    >
      {/* Soft floating orbs */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-20 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,209,102,0.35), transparent 70%)' }}
        animate={reduce ? {} : { scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(72,202,228,0.4), transparent 70%)' }}
        animate={reduce ? {} : { scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dotted grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #FFFFFF 1.2px, transparent 1.2px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Floating sparkles */}
      {!reduce &&
        ['✨', '⭐', '🌟'].map((s, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute text-xl md:text-2xl select-none pointer-events-none"
            style={{ top: `${18 + i * 26}%`, right: `${8 + i * 6}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, 12, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            {s}
          </motion.span>
        ))}

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Dani Avatar — glowing halo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="relative flex-shrink-0"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(255,209,102,0.55), transparent 65%)' }}
            animate={reduce ? {} : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="relative" animate={floatAnim}>
            <DaniAvatar3D mood="happy" size="xl" />
          </motion.div>
        </motion.div>

        {/* Welcome Text */}
        <div className="flex-1 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-semibold mb-3"
          >
            {getGreeting()}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight"
          >
            Soy{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: SB_GRADIENTS.gold }}
            >
              Dani
            </span>
            , tu tutor virtual
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white/90 text-lg md:text-xl font-medium mb-6"
          >
            {getVAKMessage()}
          </motion.p>

          {/* Quick Stats — glass chips with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <div
              className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25"
              style={{ boxShadow: glow(SB_COLORS.gold, 0.35) }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-white/20">
                💎
              </span>
              <span className="leading-tight text-left">
                <span className="block text-white font-black text-lg">
                  {totalPoints.toLocaleString()}
                </span>
                <span className="block text-white/70 text-[11px] font-semibold -mt-0.5">
                  puntos
                </span>
              </span>
            </div>

            {vakResult && (
              <div
                className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25"
                style={{ boxShadow: glow(SB_COLORS.cyan, 0.35) }}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-white/20">
                  🧠
                </span>
                <span className="leading-tight text-left">
                  <span className="block text-white font-black text-base">
                    {vakResult.predominantStyle.toUpperCase()}
                  </span>
                  <span className="block text-white/70 text-[11px] font-semibold -mt-0.5">
                    tu estilo
                  </span>
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* CTA Button — premium gold */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="flex-shrink-0"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/smartboard?tab=dani')}
            className="group px-7 py-4 rounded-2xl font-bold text-[#00303F] flex items-center gap-3 transition-shadow"
            style={{ background: SB_GRADIENTS.gold, boxShadow: glow(SB_COLORS.amber, 0.5) }}
          >
            <motion.span
              className="text-2xl"
              animate={reduce ? {} : { rotate: [0, -12, 12, -12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
            >
              🤖
            </motion.span>
            <span className="text-left">
              <span className="block font-black">Hablar conmigo</span>
              <span className="block text-xs opacity-70 -mt-0.5">
                Estoy aquí para ayudarte
              </span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
