import { Fragment, memo, useEffect, useId, useRef, useState } from "react";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import { HERO_SLIDES } from "./hero/heroSlides";
import { useHeroCarousel } from "./hero/useHeroCarousel";
import { HeroBrainStage } from "./hero/HeroBrainStage";
import { HeroVideoStage } from "./hero/HeroVideoStage";
import { HeroTabs } from "./hero/HeroTabs";
import { HeroConstellation } from "./hero/HeroConstellation";
import { useHeroVoice } from "./hero/useHeroVoice";
import "./hero/hero-stage.css";

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

const EASE = [0.22, 1, 0.36, 1];

const slideVariants = {
  active: { opacity: 1, visibility: "visible", transition: { duration: 0.5 } },
  inactive: {
    opacity: 0,
    transition: { duration: 0.5 },
    transitionEnd: { visibility: "hidden" },
  },
};

const copyVariants = {
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.1 },
  },
  inactive: { opacity: 0, y: 10, transition: { duration: 0.3 } },
};

const visualVariants = {
  active: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    z: 0,
    transition: { duration: 0.95, ease: EASE },
  },
  inactive: {
    opacity: 0,
    rotateY: 24,
    scale: 0.9,
    z: -140,
    transition: { duration: 0.45 },
  },
};

const wordVariants = {
  active: (i) => ({
    y: "0%",
    transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 },
  }),
  inactive: { y: "110%", transition: { duration: 0.3 } },
};

/** Titular con revelado por máscara, palabra por palabra. */
const RevealText = ({ text, offset = 0, colorAt }) => {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom [font-family:inherit]">
        <motion.span
          className="inline-block [font-family:inherit]"
          custom={i + offset}
          variants={wordVariants}
          style={colorAt ? { color: colorAt(i, words.length) } : undefined}
        >
          {word}
        </motion.span>
      </span>{" "}
    </Fragment>
  ));
};

// Acento de marca (como en los videos de MAX): petróleo → turquesa → azul claro,
// interpolado palabra a palabra para que el degradado sea continuo.
const BRAND_STOPS = [
  [0, 75, 99],
  [0, 151, 167],
  [77, 168, 196],
];
const brandColorAt = (i, n) => {
  const t = n <= 1 ? 0 : i / (n - 1);
  const seg = t < 0.5 ? 0 : 1;
  const k = seg === 0 ? t / 0.5 : (t - 0.5) / 0.5;
  const [a, b] = [BRAND_STOPS[seg], BRAND_STOPS[seg + 1]];
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(",")})`;
};

const TITLE_CLASS =
  "font-display text-[2.1rem] font-black leading-[1.02] tracking-[-0.045em] text-petroleum [text-wrap:balance] sm:text-5xl lg:text-[3.35rem]";
const PRODUCT_TITLE_CLASS = TITLE_CLASS.replace(
  "lg:text-[3.35rem]",
  "lg:text-[2.7rem]",
);
const SUBTITLE_CLASS =
  "mt-5 max-w-[46ch] text-base leading-relaxed font-medium text-slate-500 sm:text-lg lg:mx-0 mx-auto";
const CTA_BASE =
  "inline-flex min-h-[52px] items-center justify-center gap-3 whitespace-nowrap rounded-full text-base font-bold transition-[background-color,border-color,color,transform,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petroleum";

const MainCopy = ({ t, locale, isActive, stats, statsRef }) => {
  const tab = isActive ? 0 : -1;
  return (
    <div className="text-center lg:text-left">
      <h1 className={TITLE_CLASS}>
        <RevealText text={t("hero.title_line1")} />
        <br className="hidden lg:inline" />
        <RevealText
          text={t("hero.title_line2")}
          offset={t("hero.title_line1").split(" ").length}
          colorAt={brandColorAt}
        />
      </h1>
      <p className={SUBTITLE_CLASS}>{t("hero.subtitle_before")}</p>
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
        <Link
          to="/ialab-academic"
          tabIndex={tab}
          className={`${CTA_BASE} group w-full px-7 bg-petroleum text-white shadow-[0_18px_40px_-16px_rgba(0,75,99,0.7)] hover:-translate-y-0.5 hover:bg-petroleum-dark sm:w-auto`}
        >
          {t("hero.cta_conoce_ingenia")}
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
        <Link
          to="/conoce-ingenia"
          tabIndex={tab}
          className={`${CTA_BASE} group w-full border-2 border-[rgba(0,75,99,0.4)] bg-white/80 px-7 text-petroleum shadow-[0_12px_28px_-18px_rgba(0,75,99,0.45)] backdrop-blur-md hover:-translate-y-0.5 hover:border-[#004B63] hover:bg-[#004B63] hover:text-white sm:w-auto`}
        >
          {t("hero.cta_ingenia")}
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
      {/* Prueba social junto a la acción: cifras sobrias con separador fino */}
      <dl
        ref={statsRef}
        className="mx-auto mt-9 flex max-w-md items-center justify-center gap-6 border-t border-petroleum/10 pt-6 lg:mx-0 lg:justify-start"
      >
        <div className="flex flex-col-reverse">
          <dt className="text-xs font-medium text-slate-500 sm:text-sm">
            {t("hero.stat_estudiantes")}
          </dt>
          <dd className="font-display text-2xl font-black tracking-[-0.03em] text-petroleum sm:text-[1.75rem]">
            {stats.students.toLocaleString(locale)}+
          </dd>
        </div>
        <div className="flex flex-col-reverse border-l border-petroleum/15 pl-6">
          <dt className="text-xs font-medium text-slate-500 sm:text-sm">
            {t("hero.stat_anios_experiencia")}
          </dt>
          <dd className="font-display text-2xl font-black tracking-[-0.03em] text-petroleum sm:text-[1.75rem]">
            {stats.years}+
          </dd>
        </div>
      </dl>
    </div>
  );
};

const ProductCopy = ({ slide, t, isActive }) => (
  <div className="text-center lg:text-left">
    {/* Para quién es: orienta antes del titular */}
    <p
      className="mb-4 inline-flex items-center gap-2 text-sm font-semibold sm:text-[0.95rem]"
      style={{ color: slide.accent }}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ background: slide.accent }}
      />
      {t(slide.audienceKey)}
    </p>
    <h2 className={PRODUCT_TITLE_CLASS}>
      <RevealText text={t(slide.titleKey)} />
    </h2>
    <p className={SUBTITLE_CLASS}>{t(slide.subtitleKey)}</p>
    <div className="mt-8 flex justify-center lg:justify-start">
      <Link
        to={slide.route}
        tabIndex={isActive ? 0 : -1}
        className={`${CTA_BASE} w-full px-7 text-white shadow-[0_18px_40px_-16px_rgba(0,40,60,0.6)] sm:w-auto ${slide.ctaClass}`}
      >
        {t(slide.ctaKey)}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  </div>
);

const Hero = memo(() => {
  const { t, locale } = useTranslation();
  const rootRef = useRef(null);
  const statsRef = useRef(null);
  const touchX = useRef(null);
  const idPrefix = useId();
  const [statsVisible, setStatsVisible] = useState(false);
  const { muted, waitingForGesture, toggleVoice, onAudioBlocked } =
    useHeroVoice(rootRef);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const stage = { mx, my, scroll: scrollYProgress };
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -48]);
  const copyFade = useTransform(scrollYProgress, [0.1, 0.55], [1, 0.3]);

  const {
    active,
    goTo,
    next,
    prev,
    playing,
    running,
    togglePlaying,
    setHeld,
    progress,
    reportProgress,
    onVideoEnded,
    reducedMotion,
  } = useHeroCarousel({ slides: HERO_SLIDES, rootRef });

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

  const stats = {
    students: useAnimatedCounter(6000, 1800, statsVisible),
    years: useAnimatedCounter(10, 2200, statsVisible),
  };

  const handlePointerMove = (e) => {
    if (reducedMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  const tabsProps = {
    slides: HERO_SLIDES,
    active,
    onSelect: goTo,
    progress,
    playing,
    onTogglePlay: togglePlaying,
    controlsPrefix: idPrefix,
    t,
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={rootRef}
        data-typo="intended"
        data-hide-floating-chat
        aria-roledescription={t("hero.carousel_roledescription")}
        aria-label={t("hero.carousel_label")}
        onFocus={() => setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full overflow-hidden pb-6 pt-2 sm:pt-4 lg:flex lg:h-[calc(100dvh-6rem)] lg:max-h-[980px] lg:min-h-[600px] lg:flex-col"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_80%,transparent)]"
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <div
                className="absolute inset-0"
                style={{ background: slide.glow }}
              />
              <div
                className="hero-motion absolute right-[-8%] top-[-12%] h-[70%] w-[55%] rounded-full blur-[90px]"
                style={{
                  background: slide.aurora[0],
                  animation: "hero-aurora-a 18s ease-in-out infinite",
                }}
              />
              <div
                className="hero-motion absolute bottom-[-10%] right-[18%] h-[55%] w-[45%] rounded-full blur-[100px]"
                style={{
                  background: slide.aurora[1],
                  animation: "hero-aurora-b 22s ease-in-out infinite",
                }}
              />
            </div>
          ))}
          {/* El slide del cerebro va sin fondo: solo el cerebro y sus conexiones */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: HERO_SLIDES[active].kind === "photo" ? 0 : 1 }}
          >
            <HeroConstellation
              running={running}
              reducedMotion={reducedMotion}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:min-h-0 lg:flex-1 lg:px-8">
          <div
            className="grid lg:min-h-0 lg:flex-1 lg:content-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {HERO_SLIDES.map((slide, i) => {
              const isActive = i === active;
              const isNear =
                isActive || i === (active + 1) % HERO_SLIDES.length;
              return (
                <motion.div
                  key={slide.id}
                  id={`${idPrefix}-panel-${i}`}
                  role="tabpanel"
                  aria-roledescription={t("hero.slide_roledescription")}
                  aria-labelledby={`${idPrefix}-tab-${i}`}
                  aria-hidden={!isActive}
                  inert={isActive ? undefined : ""}
                  initial={false}
                  animate={isActive ? "active" : "inactive"}
                  variants={slideVariants}
                  style={{ zIndex: isActive ? 2 : 1 }}
                  className="grid items-center gap-6 [grid-area:1/1] [perspective:2000px] sm:gap-8 lg:grid-cols-12 lg:gap-10"
                >
                  <motion.div
                    variants={copyVariants}
                    className="order-3 lg:order-none lg:col-span-5"
                  >
                    <motion.div style={{ y: copyY, opacity: copyFade }}>
                      {slide.kind === "photo" ? (
                        <MainCopy
                          t={t}
                          locale={locale}
                          isActive={isActive}
                          stats={stats}
                          statsRef={statsRef}
                        />
                      ) : (
                        <ProductCopy slide={slide} t={t} isActive={isActive} />
                      )}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    variants={visualVariants}
                    className="order-1 lg:order-none lg:col-span-7"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {slide.kind === "photo" ? (
                      <HeroBrainStage
                        isActive={isActive}
                        running={running}
                        reducedMotion={reducedMotion}
                        stage={stage}
                      />
                    ) : (
                      <HeroVideoStage
                        slide={slide}
                        isActive={isActive}
                        isNear={isNear}
                        running={running}
                        muted={muted}
                        onToggleMute={toggleVoice}
                        waitingForGesture={waitingForGesture}
                        onForceMute={onAudioBlocked}
                        onProgress={reportProgress}
                        onEnded={onVideoEnded}
                        stage={stage}
                        t={t}
                      />
                    )}
                  </motion.div>
                  {/* Móvil y tablet: el selector va al final, debajo del botón de acción */}
                  <div className="order-4 lg:hidden">
                    <HeroTabs {...tabsProps} idPrefix={`${idPrefix}-m${i}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="hidden lg:mt-3 lg:block">
            <HeroTabs {...tabsProps} idPrefix={idPrefix} />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
});

Hero.displayName = "Hero";

export default Hero;
