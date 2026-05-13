import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';

const HeroTrustBar = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    className="mt-4 md:mt-5"
  >
    <div className="flex flex-wrap justify-center items-center gap-5 md:gap-6 text-white text-sm md:text-base">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex -space-x-1.5">
          {[1,2,3,4].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-primary-dark border-2 border-primary-dark/50 flex items-center justify-center text-[9px] font-bold text-white">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span><strong className="text-white">4.200+</strong> <span className="text-white font-semibold">estudiantes</span></span>
      </div>
      <div className="h-7 w-px bg-white/10" />
      <div className="flex items-center gap-1 text-amber-400">
        {[1,2,3,4,5].map((s) => (
          <Icon key={s} name="fa-star" className="w-4 h-4" />
        ))}
        <span className="text-white ml-1.5"><strong className="text-white">4.8</strong></span>
      </div>
      <div className="h-7 w-px bg-white/10" />
      <div className="flex items-center gap-1.5 text-emerald-400">
        <Icon name="fa-shield-check" className="w-4 h-4" />
        <span className="text-white">Certificado profesional</span>
      </div>
    </div>
  </motion.div>
);

export default HeroTrustBar;
