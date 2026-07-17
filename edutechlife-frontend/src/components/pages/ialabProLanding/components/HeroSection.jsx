import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';
import TrustBar from './TrustBar';

const HeroSection = ({ t, navigate: navFromProps, scrollY, prefersReducedMotion, locale }) => {
  const navigate = navFromProps || useNavigate();
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroInView = useInView(heroRef, { once: true });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const localPrefersRM = useReducedMotion();
  const prefersRM = prefersReducedMotion ?? localPrefersRM;

  useEffect(() => {
    let ticking = false;
    const handleMouse = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 7 },
    { size: 3, x: '85%', y: '15%', delay: 1.5, duration: 9 },
    { size: 5, x: '50%', y: '70%', delay: 0.8, duration: 8 },
    { size: 3, x: '25%', y: '80%', delay: 2, duration: 6 },
    { size: 4, x: '70%', y: '60%', delay: 0.5, duration: 10 },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#004B63] via-[#007A94] to-[#004064] min-h-screen flex items-center"
    >
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="absolute top-6 left-4 md:top-8 md:left-8 z-30 flex items-center gap-2.5 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-bold hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
        aria-label={t('ialab.landing.back_aria')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m0 0l11 11" />
        </svg>
        {t('ialab.landing.back_label')}
      </motion.button>

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300334A' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,75,99,0.25) 0%, transparent 70%)',
          x: useTransform(scrollY, [0, 500], [0, -50]),
          y: mousePos.y * -30,
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,51,74,0.2) 0%, transparent 70%)',
          x: useTransform(scrollY, [0, 500], [0, 50]),
          y: mousePos.y * -20,
        }}
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00334A]/25"
          style={{ width: p.size * 2, height: p.size * 2, left: p.x, top: p.y }}
          animate={!prefersRM ? { y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] } : {}}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3 md:gap-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none text-center"
          >
            <span className="text-white">AI Lab </span>
            <motion.span
              className="bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
              animate={{ textShadow: [
                '0 0 20px rgba(77,168,196,0.2)',
                '0 0 40px rgba(77,168,196,0.5)',
                '0 0 20px rgba(77,168,196,0.2)'
              ]}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Academic
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 md:mb-8"
          >
            <Icon name="fa-flask" className="w-4 h-4 text-[#00334A]" />
            <span className="text-sm font-semibold text-white tracking-wide">{t('ialab.landing.hero_badge')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl relative"
          >
            <div
              className="relative w-full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                willChange: 'transform',
                transform: `rotateX(${(mousePos.y - 0.5) * -12}deg) rotateY(${(mousePos.x - 0.5) * 12}deg) scale(${1 + Math.abs(mousePos.x - 0.5) * 0.04})`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <motion.div
                animate={{
                  y: [0, -18, 0, -10, 0],
                  scale: [1, 1.005, 0.998, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="absolute -inset-32 md:-inset-48 rounded-[100px]"
                  style={{ background: 'radial-gradient(circle, rgba(77,168,196,0.35) 0%, rgba(102,204,204,0.12) 30%, rgba(0,188,212,0.04) 60%, transparent 80%)' }}
                  animate={{ scale: [1, 1.2, 0.95, 1], opacity: [0.4, 1, 0.6, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-[#4DA8C4]/10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15], rotate: [0, 360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />

                {[1,2,3,4,5,6,7,8].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-[#00334A]/25"
                    style={{
                      width: i % 2 === 0 ? 3 : 2,
                      height: i % 2 === 0 ? 3 : 2,
                      left: `${5 + i * 11}%`,
                      top: `${i * 12 % 80}%`,
                    }}
                    animate={{ y: [0, -30 - i * 5, 0], opacity: [0.1, 0.5, 0.1] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                  />
                ))}

                <div className="relative group" style={{
                  padding: '14px',
                  borderRadius: '48px',
                  background: 'linear-gradient(165deg, #3E3E46 0%, #2E2E36 15%, #22222A 40%, #18181E 50%, #1E1E26 60%, #282830 75%, #3A3A42 85%, #42424A 100%)',
                  boxShadow: `
                    0 60px 150px rgba(0,0,0,0.7),
                    0 30px 60px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(255,255,255,0.06),
                    inset 0 2px 0 rgba(255,255,255,0.12),
                    inset 0 -2px 0 rgba(0,0,0,0.4),
                    inset 0 5px 30px rgba(0,0,0,0.2)
                  `,
                }}>
                  <div className="absolute inset-[4px] rounded-[44px] pointer-events-none z-50"
                    style={{ boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.08), inset 0 -1.5px 1px rgba(0,0,0,0.2), inset 1.5px 0 0.5px rgba(255,255,255,0.03), inset -1.5px 0 0.5px rgba(0,0,0,0.1)' }}
                  />

                  <div className="absolute top-[4px] left-[18%] right-[18%] h-[1px] rounded-full pointer-events-none z-50"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)' }}
                  />

                  <div className="absolute right-[4px] top-[20%] bottom-[20%] w-[1px] rounded-full pointer-events-none z-50"
                    style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }}
                  />

                  <div className="absolute inset-0 rounded-[48px] z-50 pointer-events-none overflow-hidden">
                    <motion.div
                      className="absolute inset-0 rounded-[48px]"
                      style={{
                        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.06) 44%, transparent 50%)',
                        backgroundSize: '200% 100%',
                      }}
                      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>

                  <div className="relative rounded-[26px] overflow-hidden"
                    style={{
                      background: '#000',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 3px 12px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className="absolute inset-[2px] rounded-[24px] z-15 pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8)' }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-[26px] z-20 pointer-events-none"
                      animate={{ background: [
                        'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                        'linear-gradient(135deg, rgba(102,204,204,0.15) 0%, transparent 40%, rgba(77,168,196,0.18) 60%, transparent 100%)',
                        'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, transparent 40%, rgba(102,204,204,0.15) 60%, transparent 100%)',
                        'linear-gradient(135deg, rgba(77,168,196,0.18) 0%, transparent 40%, rgba(102,204,204,0.12) 60%, transparent 100%)',
                      ]}}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/45 via-transparent to-transparent z-10 pointer-events-none" />
                    <motion.div
                      className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#4DA8C4]/40 to-transparent z-20 pointer-events-none"
                      animate={{ top: ['-10%', '110%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      {[1,2,3,4,5,6,7,8].map((i) => (
                        <motion.div key={i} className="absolute rounded-full bg-[#00334A]/20"
                          style={{
                            width: i % 3 === 0 ? 1.5 : 1,
                            height: i % 3 === 0 ? 1.5 : 1,
                            left: `${8 + i * 10.5}%`,
                            top: `${15 + (i * 11) % 70}%`,
                          }}
                          animate={{ y: [0, -25 - i * 3, 0], opacity: [0, 0.6, 0] }}
                          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }}
                    />
                    <div className="absolute inset-0 rounded-[26px] z-10 pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 50px rgba(77,168,196,0.08), 0 0 30px rgba(77,168,196,0.05)' }}
                    />

                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md border border-white/10">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Demo</span>
                    </div>

                    {!videoLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-[#1a2a3a] z-5 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <motion.div
                            className="w-10 h-10 rounded-full border-2 border-[#4DA8C4]/30 border-t-[#4DA8C4]"
                            animate={!prefersRM ? { rotate: 360 } : {}}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          <motion.div
                            className="h-1.5 w-24 bg-gradient-to-r from-[#4DA8C4]/20 via-[#4DA8C4]/40 to-[#4DA8C4]/20 rounded-full"
                            animate={!prefersRM ? { x: ['-100%', '100%'] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        </div>
                      </div>
                    )}
                    <video
                      autoPlay muted loop playsInline preload="metadata"
                      onLoadedData={() => setVideoLoaded(true)}
                      className="w-full h-auto block"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        imageRendering: 'auto',
                      }}
                    >
                      <source src="/dashboard.mp4" type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 z-25 pointer-events-none"
                      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 20%, transparent 65%, rgba(100,170,240,0.025) 100%)' }}
                    />
                    <div className="absolute inset-0 z-24 pointer-events-none"
                      style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)' }}
                    />
                  </div>

                  <div className="absolute top-[26px] left-1/2 -translate-x-1/2 z-55">
                    <div className="w-[8px] h-[8px] rounded-full relative"
                      style={{
                        background: 'radial-gradient(circle at 38% 35%, #1E1E30 0%, #0A0A12 60%, #000 100%)',
                        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.08), 0 0 3px rgba(0,0,0,0.8), inset 0 0 1px rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="w-[3px] h-[3px] rounded-full mx-auto mt-[1.5px]"
                        style={{ background: '#0E0E1A', boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.05)' }}
                      />
                      <div className="absolute -top-[1px] -left-[1px] w-[3px] h-[2px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 100%)' }}
                      />
                    </div>
                  </div>

                  <div className="absolute -bottom-2 left-[5%] right-[5%] h-4 rounded-full pointer-events-none z-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
                      filter: 'blur(4px)',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <TrustBar t={t} locale={locale} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
