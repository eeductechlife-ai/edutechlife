import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { fadeInUp, containerVariants, childVariant } from './SmartBoardShared';

const AVATAR_GRADIENTS = [
  'from-petroleum to-primary-light',
  'from-primary-light to-corporate',
  'from-corporate to-mint',
  'from-mint to-petroleum',
  'from-petroleum-dark to-petroleum',
  'from-corporate to-petroleum',
];

export default function SmartBoardTestimoniosSection({ t, testimonials }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="testimonios" role="region" aria-label="Testimonios" className="relative w-full overflow-hidden bg-gradient-to-b from-white to-petroleum/3 py-12 lg:py-16 scroll-mt-20">
      <div className="absolute top-[20%] left-[5%] w-48 h-48 bg-primary-light/6 rounded-full blur-[80px] animate-orb-1" />
      <div className="absolute bottom-[20%] right-[10%] w-44 h-44 bg-mint/6 rounded-full blur-[80px] animate-orb-2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...(!prefersReducedMotion ? fadeInUp : {})} className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-primary-light/10 to-mint/10 text-petroleum text-xs font-bold uppercase tracking-widest mb-3 border border-primary-light/10">
            <Icon name="fa-star" className="text-corporate text-xs" />
            {t('smartboard.landing_testimonials_badge')}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
            {t('smartboard.landing_testimonials_title_line1')}<br />
            <span className="text-gradient-accent pr-1">{t('smartboard.landing_testimonials_title_line2')}</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

          <div className="overflow-hidden py-4 group">
            <motion.div variants={childVariant} className="flex gap-5">
              <div className="flex gap-5 animate-marquee group-hover:[animation-play-state:paused]" style={{ willChange: 'transform' }}>
                {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
                  <div
                    key={`${testimonial.name}-${idx}`}
                    className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-premium-lg p-6 flex-shrink-0 flex flex-col hover:-translate-y-1 transition-all duration-300 w-[85vw] sm:w-[380px]"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                        <Icon key={j} name="fa-star" className="text-corporate text-[11px]" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/40">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-petroleum truncate">{testimonial.name}</p>
                        <p className="text-xs text-slate-500 truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

SmartBoardTestimoniosSection.propTypes = {
  t: PropTypes.func.isRequired,
  testimonials: PropTypes.array.isRequired,
};
