import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import FloatingParticles from '../FloatingParticles';
import { fadeInUp, containerVariants, childVariant } from './SmartBoardShared';

const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-6deg', '6deg']);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800, willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

export default function SmartBoardTranquilidadSection({ t, tranquilidad }) {
  return (
    <section id="tranquilidad" className="relative w-full overflow-hidden bg-gradient-to-b from-petroleum to-petroleum-dark py-12 lg:py-16 scroll-mt-20">
      <div className="absolute top-[10%] right-[10%] w-56 h-56 bg-primary-light/15 rounded-full blur-[100px] animate-orb-1" />
      <div className="absolute bottom-[10%] left-[5%] w-48 h-48 bg-mint/10 rounded-full blur-[80px] animate-orb-2" />
      <FloatingParticles count={15} className="z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold uppercase tracking-widest mb-3 border border-white/10 backdrop-blur-sm">
            <Icon name="fa-shield" className="text-mint text-xs" />
            {t('smartboard.landing_tranquility_badge')}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
            {t('smartboard.landing_tranquility_title_line1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_tranquility_title_line2')}</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl mx-auto">
            {t('smartboard.landing_tranquility_desc')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
        >
          {tranquilidad.map((item) => (
            <motion.div key={item.title} variants={childVariant}>
              <TiltCard>
                <div className="group relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-5 hover:bg-white/80 transition-all duration-300 h-fit">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-light/30 to-mint/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300" style={{ willChange: 'transform' }}>
                    <Icon name={item.icon} className="text-lg text-mint" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl px-6 py-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-mint flex items-center justify-center flex-shrink-0">
              <Icon name="fa-quote-left" className="text-white text-sm" />
            </div>
            <p className="text-white/80 text-xs italic max-w-md text-left">{t('smartboard.landing_quote')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
