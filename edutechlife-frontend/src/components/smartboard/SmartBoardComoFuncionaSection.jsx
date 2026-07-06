import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import MagneticButton from '../MagneticButton';
import { fadeInUp, containerVariants, cardVariants } from './SmartBoardShared';

const STEP_GRADIENTS = [
  { circle: 'from-petroleum to-primary-light', badge: 'bg-petroleum' },
  { circle: 'from-primary-light to-corporate', badge: 'bg-primary-light' },
  { circle: 'from-corporate to-mint', badge: 'bg-corporate' },
  { circle: 'from-mint to-petroleum', badge: 'bg-mint' },
];

export default function SmartBoardComoFuncionaSection({ t, pasos, handleCta }) {
  return (
    <section id="como-funciona" className="relative w-full overflow-hidden bg-white py-12 lg:py-16 scroll-mt-20">
      <div className="absolute top-[30%] left-[10%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px] animate-orb-3" />
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-mint/6 rounded-full blur-[80px] animate-orb-2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-mint/10 to-primary-light/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3 border border-mint/10">
            <Icon name="fa-rocket-launch" className="text-mint text-xs" />
            {t('smartboard.landing_how_badge')}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
            {t('smartboard.landing_how_title_line1')}<br />
            <span className="text-gradient-accent pr-1">{t('smartboard.landing_how_title_line2')}</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary-light via-corporate to-mint lg:opacity-20 opacity-25" style={{ transform: 'translateX(-50%)' }} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
          >
            {pasos.map((item, index) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative mb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${STEP_GRADIENTS[index % STEP_GRADIENTS.length].circle} flex items-center justify-center shadow-lg shadow-petroleum/10 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10`} style={{ willChange: 'transform' }}>
                    <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full ${STEP_GRADIENTS[index % STEP_GRADIENTS.length].badge} border-2 border-white flex items-center justify-center shadow-md`}>
                      <span className="text-[10px] font-black text-white">{item.step}</span>
                    </div>
                    <Icon name={item.icon} className="text-white text-xl" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-petroleum mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.4 }}
          className="text-center mt-10"
        >
          <MagneticButton onClick={handleCta}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-petroleum to-primary-light text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
            <span className="relative z-10 font-semibold">{t('smartboard.landing_cta_start')}</span>
            <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
