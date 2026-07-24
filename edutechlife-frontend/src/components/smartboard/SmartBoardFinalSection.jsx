import PropTypes from 'prop-types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import MagneticButton from '../MagneticButton';
import FloatingParticles from '../FloatingParticles';
import { fadeInUp } from './SmartBoardShared';

export default function SmartBoardFinalSection({ t, faqItems, handleCta }) {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section role="region" aria-label="Comienza con SmartBoard" className="relative w-full overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-darker to-petroleum-dark py-14 lg:py-20">
      <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-primary-light/12 rounded-full blur-[100px] animate-orb-1" />
      <div className="absolute bottom-[10%] left-[5%] w-56 h-56 bg-mint/8 rounded-full blur-[100px] animate-orb-2" />
      <FloatingParticles count={20} className="z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm mb-4">
            <Icon name="fa-rocket-launch" className="text-mint text-xs" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{t('smartboard.landing_cta_badge')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            {t('smartboard.landing_cta_final_title_line1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_cta_final_title_line2')}</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl mx-auto mb-8">
            {t('smartboard.landing_cta_final_desc')}
          </p>
          <MagneticButton onClick={handleCta}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-10 sm:px-12 py-3.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-primary-light to-mint text-white shadow-2xl hover:shadow-[0_0_30px_rgba(77,168,196,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
            <span className="relative z-10 font-semibold">{t('smartboard.landing_cta_final_btn')}</span>
            <Icon name="fa-arrow-right" className="text-white/90 relative z-10" />
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-black text-white text-center mb-6 flex items-center justify-center gap-2">
            <Icon name="fa-circle-question" className="text-primary-light text-sm" aria-hidden="true" />
            {t('smartboard.landing_faq_title')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint">{t('smartboard.landing_faq_title_highlight')}</span>
          </h3>
          <div className="space-y-2.5">
            {faqItems.map((item, i) => (
              <div key={item.q} className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-xl overflow-hidden hover:bg-white/80 transition-colors">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left"
                  id={`faq-question-${i}`}
                  aria-expanded={activeFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">{item.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: 'transform' }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeFaq === i ? 'bg-primary-light/20' : 'bg-white/5'
                    }`}
                  >
                    <Icon name="fa-chevron-down" className="text-white/60 text-[10px]" aria-hidden="true" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 border-t border-white/5">
                        <p className="text-xs text-white/70 leading-relaxed">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

SmartBoardFinalSection.propTypes = {
  t: PropTypes.func.isRequired,
  faqItems: PropTypes.array.isRequired,
  handleCta: PropTypes.func.isRequired,
};
