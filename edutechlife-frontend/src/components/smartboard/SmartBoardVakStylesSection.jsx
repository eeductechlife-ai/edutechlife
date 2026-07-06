import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { fadeInUp, containerVariants, cardVariants } from './SmartBoardShared';

export default function SmartBoardVakStylesSection({ t, vakStyles }) {
  return (
    <section id="estilos-vak" className="relative w-full overflow-hidden bg-gradient-to-b from-petroleum/3 to-white py-12 lg:py-16 scroll-mt-20">
      <div className="absolute top-[10%] right-[15%] w-40 h-40 bg-primary-light/10 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-8">
          <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-primary-light/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3">
            {t('smartboard.landing_vak_badge')}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight mb-3">
            {t('smartboard.landing_vak_title')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint pr-1">{t('smartboard.landing_vak_title_highlight')}</span>
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {t('smartboard.landing_vak_desc')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-start"
        >
          {vakStyles.map((style, idx) => (
            <motion.div
              key={style.key}
              variants={cardVariants}
              animate={{
                y: [0, -5, 0],
                transition: { duration: 3.5 + idx * 0.3, delay: idx * 0.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ willChange: 'transform' }} className="group relative card-clay-white bg-white rounded-2xl border border-white/40 shadow-sm hover:shadow-premium-lg transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(135deg, ${style.color}, ${style.color}88)` }} />
              <div className="p-5 lg:p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${style.color}15, ${style.color}08)` }}>
                  <Icon name={style.icon} className="text-xl" style={{ color: style.color }} />
                </div>
                <h3 className="text-base font-bold text-petroleum mb-2">{style.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{style.description}</p>
                <div className="space-y-1.5">
                  {style.traits.map((trait) => (
                    <div key={trait} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
