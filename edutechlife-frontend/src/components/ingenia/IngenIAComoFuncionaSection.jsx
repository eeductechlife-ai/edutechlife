import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import MagneticButton from "../MagneticButton";
import { fadeInUp, containerVariants, cardVariants } from "./IngenIAShared";

const STEP_GRADIENTS = [
  { circle: "from-petroleum to-primary-light", badge: "bg-petroleum" },
  { circle: "from-primary-light to-corporate", badge: "bg-primary-light" },
  { circle: "from-corporate to-mint", badge: "bg-corporate" },
  { circle: "from-mint to-petroleum", badge: "bg-mint" },
];

export default function IngenIAComoFuncionaSection({ t, pasos, handleCta }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section
      id="como-funciona"
      role="region"
      aria-label="Cómo funciona IngenIA"
      className="relative w-full overflow-hidden bg-white py-7 lg:py-10 scroll-mt-20"
    >
      <div className="absolute top-[30%] left-[10%] w-44 h-44 bg-primary-light/6 rounded-full blur-[80px] animate-orb-3" />
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-mint/6 rounded-full blur-[80px] animate-orb-2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          {...(!prefersReducedMotion ? fadeInUp : {})}
          className="text-center mb-7"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-mint/10 to-primary-light/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3 border border-mint/10">
            <Icon name="fa-rocket-launch" className="text-mint text-xs" />
            {t("ingenia.landing_how_badge")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
            {t("ingenia.landing_how_title_line1")}
            <br />
            <span className="text-gradient-accent pr-1">
              {t("ingenia.landing_how_title_line2")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {pasos.map((item, index) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-2.5">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${STEP_GRADIENTS[index % STEP_GRADIENTS.length].circle} flex items-center justify-center shadow-lg shadow-petroleum/10 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  style={{ willChange: "transform" }}
                >
                  <div
                    className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full ${STEP_GRADIENTS[index % STEP_GRADIENTS.length].badge} border-2 border-white flex items-center justify-center shadow-md`}
                  >
                    <span className="text-[9px] font-black text-white">
                      {item.step}
                    </span>
                  </div>
                  <Icon name={item.icon} className="text-white text-lg" />
                </div>
              </div>
              <h3 className="text-xs font-bold text-petroleum sm:text-sm">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            prefersReducedMotion
              ? undefined
              : { type: "spring", stiffness: 100, damping: 16, delay: 0.4 }
          }
          className="text-center mt-8"
        >
          <MagneticButton
            onClick={handleCta}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-petroleum to-primary-light text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
            <span className="relative z-10 font-semibold">
              {t("ingenia.landing_cta_start")}
            </span>
            <Icon
              name="fa-arrow-right"
              className="text-white/90 relative z-10"
            />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

IngenIAComoFuncionaSection.propTypes = {
  t: PropTypes.func.isRequired,
  pasos: PropTypes.array.isRequired,
  handleCta: PropTypes.func.isRequired,
};
