import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { fadeInUp, containerVariants, childVariant } from "./SmartBoardShared";

const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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

export default function SmartBoardBeneficiosSection({ t, beneficios }) {
  return (
    <section
      id="beneficios"
      className="relative w-full overflow-hidden bg-white py-12 lg:py-16 scroll-mt-20"
    >
      <div className="absolute top-[20%] left-[5%] w-56 h-56 bg-primary-light/6 rounded-full blur-[80px] animate-orb-1" />
      <div className="absolute bottom-[10%] right-[10%] w-48 h-48 bg-mint/6 rounded-full blur-[80px] animate-orb-2" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <span className="badge-clay inline-block px-3.5 py-1 rounded-full bg-gradient-to-r from-primary-light/10 to-mint/10 text-petroleum text-[11px] font-bold uppercase tracking-widest mb-3 border border-primary-light/10">
            {t("smartboard.landing_benefits_badge")}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-petroleum leading-tight">
            {t("smartboard.landing_benefits_title_line1")}
            <br />
            <span className="text-gradient-accent pr-1">
              {t("smartboard.landing_benefits_title_line2")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
        >
          {beneficios.map((item, i) => (
            <motion.div key={item.title} variants={childVariant}>
              <TiltCard className="group relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-[0_15px_35px_rgba(0,75,99,0.12)] hover:-translate-y-1 transition-all duration-300 p-6 h-fit">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${BENEFIT_GRADIENTS[i % BENEFIT_GRADIENTS.length].bg} flex items-center justify-center mb-3 group-hover:scale-125 transition-transform duration-300`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${BENEFIT_GRADIENTS[i % BENEFIT_GRADIENTS.length].icon} flex items-center justify-center`}
                  >
                    <Icon name={item.icon} className="text-xs text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-petroleum mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
