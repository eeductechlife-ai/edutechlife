import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import HeroContent from './HeroContent';
import HeroIpad from './HeroIpad';
import HeroTrustBar from './HeroTrustBar';
import { particles } from '../data/landingPageData';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroInView = useInView(heroRef, { once: true });

  const { scrollYProgress, scrollY } = useScroll();

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

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-corporate to-mint origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-petroleum via-[#007A94] to-[#004064] min-h-screen flex items-center"
      >
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.97 }}
          className="absolute top-6 left-4 md:top-8 md:left-8 z-30 flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-petroleum/90 to-petroleum/70 backdrop-blur-md border border-corporate/40 rounded-full text-white text-sm font-bold hover:from-petroleum hover:to-corporate hover:border-corporate/70 transition-all duration-300 shadow-lg shadow-petroleum/30"
          aria-label="Volver a la página principal"
        >
          <svg className="w-4 h-4 text-corporate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m0 0l11 11" />
          </svg>
          <span className="hidden sm:inline">Volver</span>
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
            className="absolute rounded-full bg-primary-dark/25"
            style={{ width: p.size * 2, height: p.size * 2, left: p.x, top: p.y }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
            <HeroContent heroInView={heroInView} />
            <HeroIpad mousePos={mousePos} />
            <HeroTrustBar />
          </div>
        </div>
      </section>

      <div className="h-6 bg-gradient-to-b from-[#004064] to-white" />
    </>
  );
};

export default HeroSection;
