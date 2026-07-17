import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 }
  }
};

const IAFeaturesSection = ({ benefits, t }) => (
  <section className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 bg-gradient-to-b from-white to-[#F0F7FA] relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #004B63 1px, transparent 1px), radial-gradient(circle at 75% 75%, #00BCD4 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}
    />
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#004B63] mb-3">
          {t('ialab.landing.why_title')}
        </h2>
        <p className="font-body text-base text-[#475569] max-w-2xl mx-auto">
          {t('ialab.landing.why_subtitle')}
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 bg-white border border-[#004B63]/5 rounded-xl hover:border-[#4DA8C4]/30 hover:shadow-[0_0_30px_rgba(0,75,99,0.08)] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute top-0 left-0 w-1 h-[25%] bg-gradient-to-b from-[#004B63] to-[#00BCD4] group-hover:h-full transition-all duration-500"
            />
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center mb-4"
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Icon name={benefit.icon} className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="font-display text-lg font-bold text-[#004B63] mb-2">{benefit.title}</h3>
            <p className="text-sm text-[#475569] leading-relaxed">{benefit.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default IAFeaturesSection;
