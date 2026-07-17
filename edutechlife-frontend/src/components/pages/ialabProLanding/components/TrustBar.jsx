import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';

const AnimatedCounter = ({ from = 0, to, suffix = '', prefix = '', duration = 2, formatter }) => {
  const [value, setValue] = useState(from);
  const cRef = useRef(null);
  const inView = useInView(cRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    let rafId;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * easeOut);
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, from, to, duration]);

  const display = formatter ? formatter(value) : Math.round(value);
  return <span ref={cRef}>{prefix}{display}{suffix}</span>;
};

const TrustBar = ({ t, locale }) => (
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
            <div key={i} className="w-7 h-7 rounded-full bg-[#00334A] border-2 border-[#00334A]/50 flex items-center justify-center text-[9px] font-bold text-white">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span><strong className="text-white"><AnimatedCounter from={0} to={4200} suffix="+" formatter={(v) => Math.floor(v).toLocaleString(locale === 'en' ? 'en-US' : 'es-ES')} /></strong> <span className="text-white font-semibold">{t('ialab.landing.students_label')}</span></span>
      </div>
      <div className="h-7 w-px bg-white/10" />
      <div className="flex items-center gap-1 text-amber-400">
        {[1,2,3,4,5].map((s) => (
          <Icon key={s} name="fa-star" className="w-4 h-4" />
        ))}
        <span className="text-white ml-1.5"><strong className="text-white"><AnimatedCounter from={0} to={4.8} formatter={(v) => v.toFixed(1)} /></strong></span>
      </div>
      <div className="h-7 w-px bg-white/10" />
      <div className="flex items-center gap-1.5 text-emerald-400">
        <Icon name="fa-shield-check" className="w-4 h-4" />
        <span className="text-white">{t('ialab.landing.certified_label')}</span>
      </div>
    </div>
  </motion.div>
);

export default TrustBar;
