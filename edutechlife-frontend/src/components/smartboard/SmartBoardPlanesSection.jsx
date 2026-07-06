import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import MagneticButton from '../MagneticButton';
import { fadeInUp, containerVariants, childVariant } from './SmartBoardShared';

export default function SmartBoardPlanesSection({ t, pricingPlans, paymentMethods, guarantee, handleCta }) {
  return (
    <section id="planes" className="relative w-full overflow-hidden bg-gradient-to-b from-bg-light to-white py-12 lg:py-16 scroll-mt-20">
      <div className="absolute top-[15%] right-[15%] w-56 h-56 bg-mint/8 rounded-full blur-[80px] animate-orb-2" />
      <div className="absolute bottom-[10%] left-[10%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px] animate-orb-1" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-corporate/10 text-petroleum text-xs font-bold uppercase tracking-widest mb-3 border border-corporate/10">
            <span className="text-corporate text-sm">✦</span>
            {t('smartboard.landing_pricing_badge')}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight mb-3">
            {t('smartboard.landing_pricing_title_line1')}<br />
            <span className="text-gradient-accent pr-1">{t('smartboard.landing_pricing_title_line2')}</span>
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            {t('smartboard.landing_pricing_desc')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={childVariant}
              style={{ willChange: 'transform' }}
              className={`relative rounded-2xl border-2 p-8 lg:p-10 flex flex-col ${
                plan.popular
                  ? 'border-petroleum shadow-2xl shadow-petroleum/15 lg:scale-[1.02] bg-gradient-to-b from-petroleum to-petroleum-darker'
                  : 'bg-white border-white/40 shadow-sm hover:border-primary-light/40'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-petroleum to-primary-light text-white text-xs font-bold uppercase tracking-wider shadow-premium-lg whitespace-nowrap flex items-center gap-1.5">
                  <Icon name="fa-star" className="text-[10px]" />
                  {t('smartboard.landing_pricing_popular')}
                </div>
              )}
              <div className="mb-2 text-center">
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  plan.popular ? 'bg-primary-light/20 text-primary-light' : 'bg-mint/20 text-petroleum'
                }`}>
                  <Icon name="fa-gift" className="text-[9px]" />
                  {plan.trial}
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className={`text-xl lg:text-2xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-petroleum'}`}>{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl lg:text-5xl font-black ${plan.popular ? 'text-white' : 'text-petroleum'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <span className={`text-[11px] ${plan.popular ? 'text-white/50' : 'text-slate-400'} block mt-1`}>≈ {plan.priceUSD} USD</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-white/15' : 'bg-success/10'}`}>
                      <Icon name="fa-check" className={`text-[10px] ${plan.popular ? 'text-white' : 'text-success'}`} />
                    </div>
                    <span className={`text-sm leading-snug ${plan.popular ? 'text-white/80' : 'text-slate-600'}`}>{feat}</span>
                  </li>
                ))}
              </ul>
              <MagneticButton onClick={handleCta}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-petroleum shadow-premium-lg hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-primary-light text-white hover:bg-petroleum hover:-translate-y-0.5'
                }`}
              >
                <span>{t('smartboard.landing_pricing_choose', { name: plan.name })}</span>
                <Icon name="fa-arrow-right" className="text-xs" />
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm">
            {paymentMethods.map((method, i) => (
              <div key={method.name} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium" title={method.name}>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-primary-light/10 flex items-center justify-center`}>
                  <Icon name={method.icon} className="text-petroleum text-sm" />
                </div>
                <span className="hidden sm:inline">{method.name}</span>
                {i < paymentMethods.length - 1 && <span className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.5 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-success/10 border border-success/20 hover:bg-success/15 transition-colors">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <Icon name={guarantee.icon} className="text-success text-sm" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-petroleum block">{guarantee.title}</span>
              <span className="text-[10px] text-slate-500 block">{guarantee.desc}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
