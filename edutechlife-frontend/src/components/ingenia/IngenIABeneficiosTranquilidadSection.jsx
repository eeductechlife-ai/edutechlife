import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import FloatingParticles from "../FloatingParticles";
import { fadeInUp, containerVariants, childVariant } from "./IngenIAShared";

const BENEFIT_GRADIENTS = [
  {
    bg: "from-petroleum/10 to-primary-light/10",
    icon: "from-petroleum to-primary-light",
  },
  {
    bg: "from-primary-light/10 to-corporate/10",
    icon: "from-primary-light to-corporate",
  },
  { bg: "from-corporate/10 to-mint/10", icon: "from-corporate to-mint" },
  { bg: "from-mint/10 to-petroleum/10", icon: "from-mint to-petroleum" },
  {
    bg: "from-petroleum-dark/10 to-petroleum/10",
    icon: "from-petroleum-dark to-petroleum",
  },
  {
    bg: "from-primary-light/10 to-mint/10",
    icon: "from-primary-light to-mint",
  },
];

/**
 * Sección unificada: "Beneficios para tu hijo" (superficie clara) + "Tranquilidad
 * para ti" (panel oscuro interno). Antes eran dos secciones completas; unirlas
 * recorta alto de página sin perder mensaje.
 */
export default function IngenIABeneficiosTranquilidadSection({
  t,
  beneficios,
  tranquilidad,
}) {
  return (
    <section
      id="beneficios"
      role="region"
      aria-label="Beneficios y tranquilidad"
      className="relative w-full overflow-hidden bg-white py-8 lg:py-10 scroll-mt-20"
    >
      <div className="absolute left-[5%] top-[18%] h-56 w-56 rounded-full bg-primary-light/6 blur-[80px] animate-orb-1" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* ── Beneficios para tu hijo ── */}
        <motion.div {...fadeInUp} className="mb-7 text-center">
          <span className="badge-clay mb-3 inline-block rounded-full border border-primary-light/10 bg-gradient-to-r from-primary-light/10 to-mint/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-petroleum">
            {t("ingenia.landing_benefits_badge")}
          </span>
          <h2 className="text-2xl font-black leading-tight text-petroleum md:text-3xl lg:text-4xl">
            {t("ingenia.landing_benefits_title_line1")}
            <br />
            <span className="text-gradient-accent pr-1">
              {t("ingenia.landing_benefits_title_line2")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {beneficios.map((item, i) => (
            <motion.div key={item.title} variants={childVariant}>
              <div className="group h-fit rounded-2xl border border-petroleum/10 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-petroleum/30 hover:shadow-[0_18px_36px_rgba(123,47,247,0.16)]">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${BENEFIT_GRADIENTS[i % BENEFIT_GRADIENTS.length].bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${BENEFIT_GRADIENTS[i % BENEFIT_GRADIENTS.length].icon}`}
                  >
                    <Icon name={item.icon} className="text-[10px] text-white" />
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-bold text-petroleum">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Tranquilidad para ti (panel oscuro interno) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-9 overflow-hidden rounded-3xl bg-gradient-to-br from-petroleum via-petroleum-darker to-petroleum-dark p-6 lg:p-9"
        >
          <div className="absolute right-[8%] top-[10%] h-48 w-48 rounded-full bg-primary-light/15 blur-[90px] animate-orb-1" />
          <div className="absolute bottom-[10%] left-[5%] h-44 w-44 rounded-full bg-mint/10 blur-[80px] animate-orb-2" />
          <FloatingParticles count={14} className="z-0" />

          <div className="relative z-10">
            <motion.div {...fadeInUp} className="mb-6 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                <Icon name="fa-shield" className="text-xs text-mint" />
                {t("ingenia.landing_tranquility_badge")}
              </span>
              <h2 className="mb-2 text-xl font-black leading-tight text-white md:text-2xl lg:text-3xl">
                {t("ingenia.landing_tranquility_title_line1")}{" "}
                <span className="bg-gradient-to-r from-primary-light to-mint bg-clip-text pr-1 text-transparent">
                  {t("ingenia.landing_tranquility_title_line2")}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70">
                {t("ingenia.landing_tranquility_desc")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 items-start gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {tranquilidad.map((item) => (
                <motion.div key={item.title} variants={childVariant}>
                  <div className="group h-fit rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light/30 to-mint/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon name={item.icon} className="text-base text-mint" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/75">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-5 py-3 backdrop-blur-xl">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-mint">
                  <Icon name="fa-quote-left" className="text-xs text-white" />
                </div>
                <p className="max-w-md text-left text-xs italic text-white/80">
                  {t("ingenia.landing_quote")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

IngenIABeneficiosTranquilidadSection.propTypes = {
  t: PropTypes.func.isRequired,
  beneficios: PropTypes.array.isRequired,
  tranquilidad: PropTypes.array.isRequired,
};
