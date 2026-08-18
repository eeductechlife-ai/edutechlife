import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import FloatingParticles from "../FloatingParticles";
import MagneticButton from "../MagneticButton";
import { Icon } from "../../utils/iconMapping.jsx";
import SmartBoardTilt3D from "./SmartBoardTilt3D";
import SmartBoardVakBadge from "./SmartBoardVakBadge";

SmartBoardHeroSection.propTypes = {
  t: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  inView: PropTypes.bool,
  countStudents: PropTypes.number,
  countImprovement: PropTypes.number,
  countHours: PropTypes.number,
  handleCta: PropTypes.func.isRequired,
};

const springUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 100, damping: 18, delay },
});

export default function SmartBoardHeroSection({
  t,
  onBack,
  inView,
  countStudents,
  countImprovement,
  countHours,
  handleCta,
}) {
  const prefersReducedMotion = useReducedMotion();

  const STATS = [
    {
      value: `+${countStudents.toLocaleString()}`,
      label: t("smartboard.landing_stat_students"),
      icon: "fa-graduation-cap",
      color: "text-petroleum",
    },
    {
      value: `${countImprovement}%`,
      label: t("smartboard.landing_stat_improvement"),
      icon: "fa-chart-line",
      color: "text-primary-light",
    },
    {
      value: `+${countHours.toLocaleString()}`,
      label: t("smartboard.landing_stat_hours"),
      icon: "fa-clock",
      color: "text-mint",
    },
  ];

  const PAIN_POINTS = [
    {
      text: t("smartboard.landing_pain_point1"),
      icon: "fa-exclamation-triangle",
      color: "bg-petroleum/5 border-petroleum/10 text-petroleum",
    },
    {
      text: t("smartboard.landing_pain_point2"),
      icon: "fa-gamepad",
      color: "bg-primary-light/5 border-primary-light/10 text-primary-light",
    },
    {
      text: t("smartboard.landing_pain_point3"),
      icon: "fa-eye-slash",
      color: "bg-mint/5 border-mint/10 text-mint",
    },
    {
      text: t("smartboard.landing_pain_point4"),
      icon: "fa-circle-exclamation",
      color: "bg-corporate/5 border-corporate/10 text-corporate",
    },
  ];

  const PAIN_COLORS = [
    { accent: "#004B63", bg: "rgba(0,75,99,0.06)" },
    { accent: "#4DA8C4", bg: "rgba(77,168,196,0.06)" },
    { accent: "#66CCCC", bg: "rgba(102,204,204,0.06)" },
    { accent: "#00BCD4", bg: "rgba(0,188,212,0.06)" },
  ];

  const PAIN_SOLUTIONS = [
    t("smartboard.landing_solution1"),
    t("smartboard.landing_solution2"),
    t("smartboard.landing_solution3"),
    t("smartboard.landing_solution4"),
  ];

  const vakBadges = [
    {
      icon: "fa-eye",
      label: "Visual",
      gradient: "from-primary-light to-corporate",
      shadowColor: "shadow-primary-light/30",
      style: {
        top: "-8%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
      },
      delay: 0.5,
    },
    {
      icon: "fa-ear-listen",
      label: "Auditivo",
      gradient: "from-corporate to-mint",
      shadowColor: "shadow-corporate/30",
      style: { bottom: "8%", left: "-3%", zIndex: 20 },
      delay: 0.7,
    },
    {
      icon: "fa-hand",
      label: "Kinestésico",
      gradient: "from-mint to-petroleum",
      shadowColor: "shadow-mint/30",
      style: { bottom: "8%", right: "-3%", zIndex: 20 },
      delay: 0.9,
    },
  ];

  const brainDots = [
    { className: "top-3 left-5 w-2 h-2", delay: 0.5, color: "bg-white/30" },
    {
      className: "bottom-4 right-4 w-1.5 h-1.5",
      delay: 1,
      color: "bg-white/25",
    },
    { className: "top-6 right-7 w-1 h-1", delay: 1.5, color: "bg-white/20" },
    {
      className: "bottom-6 left-4 w-1.5 h-1.5",
      delay: 2,
      color: "bg-white/20",
    },
    { className: "top-1/2 -right-2 w-1 h-1", delay: 0.8, color: "bg-white/30" },
    { className: "top-1/3 -left-1 w-1 h-1", delay: 1.2, color: "bg-white/25" },
  ];

  return (
    <section
      role="region"
      aria-label="SmartBoard Hero"
      className="relative w-full py-12 lg:py-14 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F0F9FF] to-white"
    >
      {onBack && (
        <button
          onClick={() => onBack()}
          aria-label={t("smartboard.back")}
          className="fixed top-6 left-6 z-50 w-9 h-9 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm flex items-center justify-center text-petroleum hover:bg-petroleum hover:text-white transition-all duration-300"
        >
          <Icon name="fa-arrow-left" className="text-xs" />
        </button>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-3d opacity-[0.15]" />
        <div className="absolute top-[5%] left-[5%] w-80 h-80 bg-primary-light/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[15%] right-[5%] w-96 h-96 bg-mint/10 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[45%] left-[45%] w-72 h-72 bg-corporate/8 rounded-full blur-[100px] animate-orb-3" />
        <FloatingParticles count={35} className="z-0" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3">
            <motion.div
              {...(!prefersReducedMotion ? springUp(0) : {})}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-petroleum tracking-tight leading-[1.05] mb-4 max-w-4xl">
                {t("smartboard.landing_hero_line1")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-corporate to-petroleum bg-[length:200%_auto] animate-shimmer">
                  {t("smartboard.landing_hero_line2")}
                </span>
                <br />
                {t("smartboard.landing_hero_line3")}
              </h1>

              <motion.p
                {...(!prefersReducedMotion ? springUp(0.12) : {})}
                className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mb-8"
              >
                {t("smartboard.landing_hero_desc")}
              </motion.p>

              <motion.div
                {...(!prefersReducedMotion ? springUp(0.18) : {})}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-8"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-petroleum to-primary-light flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-petroleum">
                    Trusted by 2,500+ families
                  </p>
                  <p className="text-xs text-slate-500">
                    Learning together, growing faster
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={
                prefersReducedMotion
                  ? false
                  : inView
                    ? { opacity: 1, y: 0 }
                    : {}
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      type: "spring",
                      stiffness: 100,
                      damping: 18,
                      delay: 0.3,
                    }
              }
              className="mb-6"
            >
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2.5 text-center lg:text-left">
                {t("smartboard.landing_concern_label")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAIN_POINTS.map((tag, i) => (
                  <motion.div
                    key={i}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, x: -20 }
                    }
                    animate={
                      prefersReducedMotion
                        ? false
                        : inView
                          ? { opacity: 1, x: 0 }
                          : {}
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            type: "spring",
                            stiffness: 120,
                            damping: 14,
                            delay: 0.35 + i * 0.08,
                          }
                    }
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-[0_12px_24px_rgba(0,75,99,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] opacity-60"
                      style={{ backgroundColor: PAIN_COLORS[i].accent }}
                    />
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: PAIN_COLORS[i].bg }}
                    >
                      <Icon
                        name={tag.icon}
                        className="text-sm"
                        style={{ color: PAIN_COLORS[i].accent }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-xs font-bold leading-tight mb-0.5"
                        style={{ color: PAIN_COLORS[i].accent }}
                      >
                        {tag.text}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {PAIN_SOLUTIONS[i]}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={
                prefersReducedMotion
                  ? false
                  : inView
                    ? { opacity: 1, y: 0 }
                    : {}
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      type: "spring",
                      stiffness: 80,
                      damping: 14,
                      delay: 0.5,
                    }
              }
              className="flex flex-col items-center gap-3"
            >
              <MagneticButton
                onClick={handleCta}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold bg-gradient-to-r from-petroleum to-primary-light text-white shadow-xl hover:shadow-[0_20px_50px_rgba(77,168,196,0.35)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <span className="absolute inset-0 w-[200%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-sweep skew-x-[-20deg]" />
                <span className="text-white relative z-10 font-semibold">
                  {t("smartboard.landing_cta_try")}
                </span>
                <Icon
                  name="fa-arrow-right"
                  className="text-white/90 relative z-10 group-hover:translate-x-1.5 transition-transform"
                />
              </MagneticButton>
              <p className="text-xs text-slate-500 text-center">
                7 days free • No credit card required • Cancel anytime
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center gap-6">
            <SmartBoardTilt3D
              intensity={8}
              className="relative w-[320px] h-[320px] xl:w-[360px] xl:h-[360px] shrink-0"
            >
              <motion.div
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }
                }
                animate={
                  prefersReducedMotion
                    ? false
                    : inView
                      ? { opacity: 1, scale: 1 }
                      : {}
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }
                style={{ transform: "translateZ(-40px)" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/20 via-corporate/10 to-mint/15 blur-[80px]"
              />

              <div
                style={{
                  transform: "translateZ(0)",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0"
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 300 300"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="hero-ring-grad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4DA8C4" />
                      <stop offset="100%" stopColor="#66CCCC" />
                    </linearGradient>
                  </defs>
                  {[...Array(3)].map((_, i) => (
                    <g key={i} style={{ transformOrigin: "150px 150px" }}>
                      <motion.circle
                        cx="150"
                        cy="150"
                        r={70 + i * 30}
                        stroke="url(#hero-ring-grad)"
                        strokeWidth="0.5"
                        strokeDasharray={`${4 + i * 2} ${6 + i * 2}`}
                        initial={{ rotate: 0, opacity: 0.15 }}
                        animate={
                          prefersReducedMotion
                            ? { rotate: 0, opacity: 0.15 }
                            : { rotate: 360, opacity: [0.08, 0.18, 0.08] }
                        }
                        style={{
                          willChange: prefersReducedMotion
                            ? "auto"
                            : "transform",
                          transformOrigin: "150px 150px",
                        }}
                        transition={
                          prefersReducedMotion
                            ? undefined
                            : {
                                rotate: {
                                  duration: 25 + i * 12,
                                  repeat: Infinity,
                                  ease: "linear",
                                },
                                opacity: {
                                  duration: 4 + i,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 1.5,
                                },
                              }
                        }
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <motion.div
                initial={
                  prefersReducedMotion ? false : { scale: 0, rotate: -30 }
                }
                animate={
                  prefersReducedMotion
                    ? false
                    : inView
                      ? { scale: 1, rotate: 0 }
                      : {}
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        type: "spring",
                        stiffness: 70,
                        damping: 10,
                        delay: 0.3,
                      }
                }
                style={{
                  transform: "translateZ(30px)",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-[8%] rounded-full bg-gradient-to-br from-petroleum via-primary-light to-corporate shadow-2xl shadow-primary-light/20 flex items-center justify-center z-10"
              >
                <div className="absolute inset-2 rounded-full bg-white/[0.06] ring-2 ring-white/20" />
                <motion.div
                  animate={
                    prefersReducedMotion ? false : { scale: [1, 1.05, 1] }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  style={{
                    willChange: prefersReducedMotion ? "auto" : "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    style={{ transform: "translateZ(10px)" }}
                    className="flex flex-col items-center gap-1"
                  >
                    <Icon
                      name="fa-brain"
                      className="text-[10rem] xl:text-[14rem] text-white/95"
                      aria-hidden="true"
                    />
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-[0.2em]">
                      {t("smartboard.landing_hero_brain_label")}
                    </span>
                  </motion.div>
                </motion.div>

                {brainDots.map((dot, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${dot.color} ${dot.className}`}
                    animate={
                      prefersReducedMotion
                        ? false
                        : { opacity: [0.1, 0.5, 0.1] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: dot.delay,
                          }
                    }
                  />
                ))}
              </motion.div>

              <div style={{ transform: "translateZ(50px)" }}>
                {vakBadges.map((badge, i) => (
                  <SmartBoardVakBadge key={i} {...badge} />
                ))}
              </div>

              <motion.div
                className="absolute -top-3 right-2 z-20"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={
                  prefersReducedMotion
                    ? false
                    : inView
                      ? { opacity: 1, y: 0 }
                      : {}
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        type: "spring",
                        stiffness: 100,
                        damping: 14,
                        delay: 1.1,
                      }
                }
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? false
                      : {
                          rotate: [0, 15, 0, -15, 0],
                          scale: [1, 1.2, 1, 1.2, 1],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  style={{
                    willChange: prefersReducedMotion ? "auto" : "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Icon
                    name="fa-star"
                    className="text-xl text-corporate drop-shadow-lg"
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 left-6 z-20"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={
                  prefersReducedMotion
                    ? false
                    : inView
                      ? { opacity: 1, y: 0 }
                      : {}
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        type: "spring",
                        stiffness: 100,
                        damping: 14,
                        delay: 1.3,
                      }
                }
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? false
                      : { rotate: [0, -15, 0, 15, 0], y: [0, -5, 0, -5, 0] }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  style={{
                    willChange: prefersReducedMotion ? "auto" : "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Icon
                    name="fa-rocket-launch"
                    className="text-xl text-mint drop-shadow-lg"
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.div>
            </SmartBoardTilt3D>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={
                prefersReducedMotion
                  ? false
                  : inView
                    ? { opacity: 1, y: 0 }
                    : {}
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      type: "spring",
                      stiffness: 90,
                      damping: 16,
                      delay: 0.5,
                    }
              }
              className="flex items-center justify-center gap-3"
            >
              {STATS.map((stat, i) => (
                <SmartBoardTilt3D key={i} intensity={12}>
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-[0_10px_30px_rgba(0,75,99,0.15)] hover:-translate-y-1 transition-all duration-300 min-w-[100px]"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/80 border border-white/40 flex items-center justify-center shrink-0">
                      <Icon
                        name={stat.icon}
                        className={`text-xs ${stat.color}`}
                      />
                    </div>
                    <div>
                      <div className={`text-sm font-black ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                </SmartBoardTilt3D>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
