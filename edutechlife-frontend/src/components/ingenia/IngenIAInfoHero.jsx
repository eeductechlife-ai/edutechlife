import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";
import MagneticButton from "../MagneticButton";
import FloatingParticles from "../FloatingParticles";
import { containerVariants, childVariant } from "./IngenIAShared";

const useAnimatedCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, target, duration]);

  return count;
};

const ORBIT_ICONS = [
  { icon: "fa-users", style: { top: "1%", left: "62%" } },
  { icon: "fa-search", style: { top: "42%", left: "-4%" } },
  { icon: "fa-chart-line", style: { bottom: "3%", right: "0%" } },
];

const STATS = [
  {
    target: 2500,
    duration: 1800,
    prefix: "+",
    labelKey: "smartboard.landing_stat_students",
    color: "text-petroleum",
  },
  {
    target: 94,
    duration: 2000,
    labelKey: "smartboard.landing_stat_improvement",
    color: "text-primary-light",
    suffix: "%",
  },
  {
    target: 12000,
    duration: 2200,
    prefix: "+",
    labelKey: "smartboard.landing_stat_hours",
    color: "text-mint",
  },
];

export default function IngenIAInfoHero({ handleCta, onNavigate }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const countStudents = useAnimatedCounter(2500, 1800, statsVisible);
  const countImprovement = useAnimatedCounter(94, 2000, statsVisible);
  const countHours = useAnimatedCounter(12000, 2200, statsVisible);
  const counts = [countStudents, countImprovement, countHours];

  const handlePrimaryCta = () => {
    if (handleCta) return handleCta();
    if (onNavigate) return onNavigate("/sign-up/ingenia");
    navigate("/sign-up/ingenia");
  };

  return (
    <section
      role="region"
      aria-label="IngenIA Hero"
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#F0F9FF] to-white pb-12 pt-6 lg:pb-16 lg:pt-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-[10%] h-64 w-64 rounded-full bg-primary-light/10 blur-[100px] animate-orb-1" />
        <div className="absolute bottom-[8%] right-[6%] h-72 w-72 rounded-full bg-mint/10 blur-[100px] animate-orb-2" />
        <FloatingParticles count={18} className="z-0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 rounded-full border border-petroleum/15 bg-white/70 px-4 py-2 text-sm font-semibold text-petroleum shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-petroleum hover:text-white active:scale-[0.97]"
          >
            <Icon
              name="fa-arrow-left"
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            />
            {t("smartboard.back")}
          </button>
          <Link
            to="/"
            aria-label={t("nav.home_aria")}
            className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src="/images/logo-edutechlife.webp"
              alt="Edutechlife"
              className="w-20 object-contain sm:w-24 md:w-28"
              style={{
                height: "40px",
                transform: "scale(1.3)",
                transformOrigin: "right center",
              }}
            />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <motion.div
            variants={containerVariants}
            initial={reduce ? false : "hidden"}
            animate="visible"
            className="text-center lg:col-span-6 lg:text-left"
          >
            <motion.span
              variants={childVariant}
              className="badge-clay mb-5 inline-block rounded-full bg-mint/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-petroleum"
            >
              {t("smartboard.landing_hero_eyebrow")}
            </motion.span>

            <motion.h1
              variants={childVariant}
              className="text-2xl font-black leading-tight text-petroleum sm:text-3xl md:text-4xl lg:text-[2.6rem]"
            >
              {t("smartboard.landing_hero_line1")}
              <br />
              <span className="animate-shimmer bg-gradient-to-r from-primary-light via-corporate to-petroleum bg-[length:200%_auto] bg-clip-text pr-1 text-transparent">
                {t("smartboard.landing_hero_line2")}
              </span>
              <br />
              {t("smartboard.landing_hero_line3")}
            </motion.h1>

            <motion.p
              variants={childVariant}
              className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base lg:mx-0"
            >
              {t("smartboard.landing_hero_desc")}
            </motion.p>

            <motion.div
              variants={childVariant}
              className="mt-10 hidden flex-col items-center gap-2 lg:mt-12 lg:flex lg:items-start"
            >
              <MagneticButton
                onClick={handlePrimaryCta}
                className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-petroleum to-primary-light px-9 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(77,168,196,0.35)] active:scale-[0.98] sm:w-auto sm:px-11 sm:text-base"
              >
                <span className="absolute inset-0 h-full w-[200%] -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-sweep" />
                <span className="relative z-10 font-semibold text-white">
                  {t("smartboard.landing_cta_try")}
                </span>
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <Icon
                    name="fa-arrow-right"
                    className="h-3.5 w-3.5 text-white"
                  />
                </span>
              </MagneticButton>
              <p className="text-xs text-slate-500">
                {t("smartboard.landing_trial_terms")}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative mx-auto flex w-full max-w-md items-center justify-center lg:col-span-6 lg:max-w-none"
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[14%] rounded-full bg-gradient-to-br from-primary-light/25 via-corporate/15 to-mint/20 blur-3xl"
              animate={
                reduce
                  ? false
                  : { opacity: [0.35, 0.65, 0.35], scale: [1, 1.06, 1] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 500 500"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="250"
                cy="250"
                r="220"
                stroke="rgba(77,168,196,0.4)"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="250"
                cy="250"
                r="196"
                stroke="rgba(102,204,204,0.5)"
                strokeWidth="1"
                strokeDasharray="4 10"
                animate={reduce ? false : { rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
              <motion.g
                animate={reduce ? false : { rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              >
                <circle cx="250" cy="30" r="4" fill="#4DA8C4" />
                <circle cx="470" cy="250" r="4" fill="#66CCCC" />
                <circle cx="250" cy="470" r="4" fill="#4DA8C4" />
                <circle cx="30" cy="250" r="4" fill="#66CCCC" />
              </motion.g>
            </svg>

            <motion.img
              src="/images/ingenia-hero-kid.webp"
              alt="Estudiante de Edutechlife aprendiendo con IngenIA"
              loading="lazy"
              className="relative z-10 h-[240px] w-auto object-contain sm:h-[320px] lg:h-[400px]"
              animate={reduce ? false : { y: [0, -10, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {ORBIT_ICONS.map((badge, i) => (
              <motion.span
                key={badge.icon}
                className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border border-primary-light/30 bg-white shadow-[0_10px_30px_-8px_rgba(0,75,99,0.35)] sm:h-14 sm:w-14"
                style={badge.style}
                animate={reduce ? false : { y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
              >
                <Icon
                  name={badge.icon}
                  className="h-5 w-5 text-primary-light sm:h-6 sm:w-6"
                />
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Mobile-only CTA — shown below the image */}
        <motion.div
          variants={childVariant}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="mt-6 flex flex-col items-center gap-2 lg:hidden"
        >
          <MagneticButton
            onClick={handlePrimaryCta}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-petroleum to-primary-light px-9 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(77,168,196,0.35)] active:scale-[0.98]"
          >
            <span className="absolute inset-0 h-full w-[200%] -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-sweep" />
            <span className="relative z-10 font-semibold text-white">
              {t("smartboard.landing_cta_try")}
            </span>
            <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <Icon name="fa-arrow-right" className="h-3.5 w-3.5 text-white" />
            </span>
          </MagneticButton>
          <p className="text-xs text-slate-500">
            {t("smartboard.landing_trial_terms")}
          </p>
        </motion.div>

        <motion.div
          ref={statsRef}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mt-12 rounded-[1.75rem] border border-petroleum/10 bg-white/70 px-6 py-6 shadow-[0_25px_60px_-40px_rgba(0,75,99,0.55)] backdrop-blur-xl sm:px-8"
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex items-center justify-center gap-3 lg:col-span-4 lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-petroleum to-primary-light text-xs font-bold text-white shadow-sm"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-petroleum sm:text-sm">
                  {t("smartboard.landing_trust_badge")}
                </p>
                <p className="text-xs text-slate-500">
                  {t("smartboard.landing_trust_subtitle")}
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-3 divide-x divide-petroleum/10 lg:col-span-8">
              {STATS.map((stat, i) => (
                <li
                  key={stat.labelKey}
                  className="flex flex-col items-center justify-center px-2 text-center sm:px-4"
                >
                  <span
                    className={`text-3xl font-black tracking-tight sm:text-4xl ${stat.color}`}
                  >
                    {stat.prefix || ""}
                    {counts[i].toLocaleString()}
                    {stat.suffix || ""}
                  </span>
                  <span className="mt-1 text-[10px] font-normal uppercase tracking-widest text-slate-500 sm:text-xs">
                    {t(stat.labelKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

IngenIAInfoHero.propTypes = {
  handleCta: PropTypes.func,
  onNavigate: PropTypes.func,
};
