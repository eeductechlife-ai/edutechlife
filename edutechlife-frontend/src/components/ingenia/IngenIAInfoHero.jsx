import { Fragment } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";
import MagneticButton from "../MagneticButton";
import FloatingParticles from "../FloatingParticles";
import IngenIAHeroPromo from "./IngenIAHeroPromo";
import IngenIALeadForm from "./IngenIALeadForm";
import { HERO_SLIDES } from "../hero/heroSlides";
import "../hero/hero-stage.css";

// Paleta propia de IngenIA (la misma del slide morado del carrusel del inicio).
const INGENIA = {
  purple: "#7B2FF7",
  violet: "#A66BFF",
  blue: "#4361EE",
  cyan: "#00C2E0",
  ink: "#170B33",
  inkSoft: "#4C4566",
};

// Mismo lenguaje tipográfico que el carrusel del inicio, para que este hero
// se sienta parte de la misma familia visual (y no una versión "plana").
const TITLE_CLASS =
  "font-display font-black leading-[0.98] tracking-[-0.04em] text-[#170B33] [text-wrap:balance] text-[clamp(2.05rem,4.6vw,3.35rem)]";
const SUBTITLE_CLASS =
  "mx-auto mt-5 max-w-[46ch] text-base leading-relaxed font-medium text-[#4C4566] sm:text-lg lg:mx-0";

const EASE = [0.22, 1, 0.36, 1];

const wordVariants = {
  inactive: { y: "110%", transition: { duration: 0.3 } },
  active: (i) => ({
    y: "0%",
    transition: { duration: 0.8, ease: EASE, delay: 0.1 + i * 0.06 },
  }),
};

const STATS = [
  {
    valueKey: "ingenia.landing_stat_trial_value",
    labelKey: "ingenia.landing_stat_trial_label",
    color: "text-[#7B2FF7]",
  },
  {
    valueKey: "ingenia.landing_stat_guarantee_value",
    labelKey: "ingenia.landing_stat_guarantee_label",
    color: "text-[#A66BFF]",
  },
  {
    valueKey: "ingenia.landing_stat_vak_value",
    labelKey: "ingenia.landing_stat_vak_label",
    color: "text-[#00C2E0]",
  },
];

const INGENIA_SLIDE = HERO_SLIDES.find((s) => s.id === "ingenia");

/** Titular con revelado por máscara, palabra por palabra (igual que el Hero). */
const RevealText = ({ text, offset = 0, gradient = null }) => {
  const words = text.split(" ");
  return words.map((word, i) => {
    const isLast = i === words.length - 1;
    const style =
      isLast && gradient
        ? {
            backgroundImage: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }
        : undefined;
    return (
      <Fragment key={`${word}-${i}`}>
        <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom [font-family:inherit]">
          <motion.span
            className="inline-block [font-family:inherit]"
            custom={i + offset}
            variants={wordVariants}
            style={style}
          >
            {word}
          </motion.span>
        </span>{" "}
      </Fragment>
    );
  });
};

const TitleRule = () => (
  <span
    aria-hidden="true"
    className="mx-auto mt-4 block h-[3px] w-9 rounded-full lg:mx-0"
    style={{ background: "linear-gradient(90deg, #7B2FF7, #A66BFF)" }}
  />
);

export default function IngenIAInfoHero({
  formAbierto = false,
  onAbrirFormulario,
  children,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // El botón principal abre el formulario corto (fuente ingenia_hero) en vez de
  // navegar al registro: el registro sigue disponible desde las demás secciones.
  const handlePrimaryCta = () => onAbrirFormulario?.();

  const aura = INGENIA_SLIDE?.glow || "none";
  const aurora = INGENIA_SLIDE?.aurora || ["transparent", "transparent"];
  const titleGradient =
    INGENIA_SLIDE?.titleGradient ||
    "linear-gradient(135deg, #7B2FF7 0%, #A66BFF 100%)";

  const heroLine1 = t("ingenia.landing_hero_line1");
  const heroLine2 = t("ingenia.landing_hero_line2");
  const heroLine3 = t("ingenia.landing_hero_line3");
  const heroOffset2 = heroLine1.split(" ").length;
  const heroOffset3 = heroOffset2 + heroLine2.split(" ").length;

  return (
    <MotionConfig reducedMotion="user">
      <section
        role="region"
        aria-label="IngenIA Hero"
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#F7F5FF] to-white pb-10 pt-4 sm:pt-6 lg:pb-14 lg:pt-8"
      >
        {/* Aura premium: radial glow + 2 auroras animadas (mismo sistema del Hero) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: aura }} />
          <div
            className="hero-motion absolute right-[-8%] top-[-12%] h-[70%] w-[55%] rounded-full blur-[90px]"
            style={{
              background: aurora[0],
              animation: "hero-aurora-a 18s ease-in-out infinite",
            }}
          />
          <div
            className="hero-motion absolute bottom-[-12%] left-[-6%] h-[55%] w-[45%] rounded-full blur-[100px]"
            style={{
              background: aurora[1],
              animation: "hero-aurora-b 22s ease-in-out infinite",
            }}
          />
          <FloatingParticles count={16} className="z-0" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 rounded-full border border-[#7B2FF7]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#7B2FF7] shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-[#7B2FF7] hover:text-white active:scale-[0.97]"
            >
              <Icon
                name="fa-arrow-left"
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              />
              {t("ingenia.back")}
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

          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-10">
            {/* Móvil: título arriba (order-1), celular (order-2) y texto+CTA debajo (order-3).
                Escritorio: título + texto agrupados en la columna izquierda (lg:block). */}
            <div className="contents text-center lg:order-none lg:block lg:col-span-5 lg:text-left">
              <div className="order-1 lg:order-none">
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: "#7B2FF7",
                    background: "rgba(123,47,247,0.08)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "#7B2FF7" }}
                  />
                  {t("ingenia.landing_hero_eyebrow")}
                </motion.span>

                <motion.h1
                  className={TITLE_CLASS}
                  initial={reduce ? false : "inactive"}
                  animate="active"
                >
                  <RevealText text={heroLine1} />
                  <br className="hidden lg:inline" />
                  <RevealText
                    text={heroLine2}
                    offset={heroOffset2}
                    gradient={titleGradient}
                  />
                  {heroLine3 ? (
                    <>
                      <br className="hidden lg:inline" />
                      <RevealText text={heroLine3} offset={heroOffset3} />
                    </>
                  ) : null}
                </motion.h1>
                <TitleRule />
              </div>

              <div className="order-3 lg:order-none">
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                  className={SUBTITLE_CLASS}
                >
                  {t("ingenia.landing_hero_desc")}
                </motion.p>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                  className="mt-9 flex flex-col items-center gap-2 lg:items-start"
                >
                  {formAbierto ? (
                    <IngenIALeadForm fuente="ingenia_hero" idPrefix="hero" />
                  ) : (
                    <>
                      <MagneticButton
                        onClick={handlePrimaryCta}
                        className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#7B2FF7] to-[#4361EE] px-9 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(123,47,247,0.4)] active:scale-[0.98] sm:w-auto sm:px-11 sm:text-base"
                      >
                        <span className="absolute inset-0 h-full w-[200%] -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-sweep" />
                        <span className="relative z-10 font-semibold text-white">
                          {t("ingenia.landing_cta_try")}
                        </span>
                        <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <Icon
                            name="fa-arrow-right"
                            className="h-3.5 w-3.5 text-white"
                          />
                        </span>
                      </MagneticButton>
                      <p className="text-xs text-slate-500">
                        {t("ingenia.landing_trial_terms")}
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Reel de promoción en mockup de celular (el reel es vertical 9:16) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="order-2 relative mx-auto w-full max-w-2xl lg:col-span-7 lg:max-w-none"
            >
              <IngenIAHeroPromo />
            </motion.div>
          </div>

          {/* Prueba social: icono + texto y 3 cifras limpias con tabular-nums */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mt-8 flex flex-col gap-6 border-t border-petroleum/10 pt-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#7B2FF7]/10 text-[#7B2FF7]">
                <Icon name="fa-shield-halved" className="text-sm" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-[#170B33]">
                  {t("ingenia.landing_trust_badge")}
                </p>
                <p className="text-xs text-slate-500">
                  {t("ingenia.landing_trust_subtitle")}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-4 sm:gap-10">
              {STATS.map((stat, i) => (
                <div
                  key={stat.labelKey}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  <dd
                    className={`font-display text-2xl font-black tracking-[-0.03em] [font-variant-numeric:tabular-nums] sm:text-3xl ${stat.color}`}
                  >
                    {t(stat.valueKey)}
                  </dd>
                  <dt className="mt-0.5 text-[10px] font-medium uppercase leading-tight tracking-wider text-slate-500 sm:text-xs">
                    {t(stat.labelKey)}
                  </dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        {/* Pestañas de sección: viven al pie del hero (ya no son una barra sticky aparte) */}
        {children ? <div className="mt-6">{children}</div> : null}
      </section>
    </MotionConfig>
  );
}
