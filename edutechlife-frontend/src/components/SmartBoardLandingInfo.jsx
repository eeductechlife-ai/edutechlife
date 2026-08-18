import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInView, AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "../i18n/I18nProvider";
import {
  getVakStyles,
  getPricingPlans,
  getTestimonials,
  getBeneficios,
  getTranquilidad,
  getPasos,
  getFaqItems,
  getPaymentMethods,
  getGuarantee,
} from "./SmartBoardLandingData";
import SmartBoardHeroSection from "./smartboard/SmartBoardHeroSection";
import SmartBoardSectionNav from "./smartboard/SmartBoardSectionNav";
import SmartBoardQueEsSection from "./smartboard/SmartBoardQueEsSection";
import SmartBoardVakStylesSection from "./smartboard/SmartBoardVakStylesSection";
import SmartBoardBeneficiosSection from "./smartboard/SmartBoardBeneficiosSection";
import SmartBoardTranquilidadSection from "./smartboard/SmartBoardTranquilidadSection";
import SmartBoardComoFuncionaSection from "./smartboard/SmartBoardComoFuncionaSection";
import SmartBoardPlanesSection from "./smartboard/SmartBoardPlanesSection";
import SmartBoardTestimoniosSection from "./smartboard/SmartBoardTestimoniosSection";
import SmartBoardFinalSection from "./smartboard/SmartBoardFinalSection";

const stepVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.97,
  }),
};

const getStepLabels = (t) => [
  t("smartboard.landing_step_que_es"),
  t("smartboard.landing_step_vak"),
  t("smartboard.landing_step_beneficios"),
  t("smartboard.landing_step_tranquilidad"),
  t("smartboard.landing_step_como_funciona"),
  t("smartboard.landing_step_planes"),
  t("smartboard.landing_step_testimonios"),
  t("smartboard.landing_step_faq"),
];

const DOT_GRADIENTS = [
  "from-petroleum to-primary-light",
  "from-primary-light to-corporate",
  "from-corporate to-mint",
  "from-mint to-petroleum",
  "from-petroleum to-corporate",
  "from-primary-light to-mint",
  "from-corporate to-primary-light",
  "from-mint to-corporate",
];

const useAnimatedCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

const SmartBoardLandingInfo = ({ onBack, onNavigate }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const vakStyles = getVakStyles(locale);
  const pricingPlans = getPricingPlans(locale);
  const testimonials = getTestimonials(locale);
  const beneficios = getBeneficios(locale);
  const tranquilidad = getTranquilidad(locale);
  const pasos = getPasos(locale);
  const faqItems = getFaqItems(locale);
  const paymentMethods = getPaymentMethods(locale);
  const guarantee = getGuarantee(locale);

  const goToStep = useCallback(
    (index) => {
      if (index === currentStep) return;
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
      if (navRef.current) {
        const top =
          navRef.current.getBoundingClientRect().top + window.scrollY - 10;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [currentStep],
  );

  const stepLabels = getStepLabels(t);

  const goNext = useCallback(() => {
    if (currentStep < stepLabels.length - 1) goToStep(currentStep + 1);
  }, [currentStep, goToStep, stepLabels.length]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const handleCta = useCallback(() => {
    if (onNavigate) onNavigate("/sign-up/smartboard");
    else navigate("/sign-up/smartboard");
  }, [onNavigate, navigate]);

  const statStart = heroInView;
  const countStudents = useAnimatedCounter(2500, 1800, statStart);
  const countImprovement = useAnimatedCounter(94, 2000, statStart);
  const countHours = useAnimatedCounter(12000, 2200, statStart);

  const sections = [
    <SmartBoardQueEsSection key="que-es" t={t} />,
    <SmartBoardVakStylesSection key="vak-styles" t={t} vakStyles={vakStyles} />,
    <SmartBoardBeneficiosSection
      key="beneficios"
      t={t}
      beneficios={beneficios}
    />,
    <SmartBoardTranquilidadSection
      key="tranquilidad"
      t={t}
      tranquilidad={tranquilidad}
    />,
    <SmartBoardComoFuncionaSection
      key="como-funciona"
      t={t}
      pasos={pasos}
      handleCta={handleCta}
    />,
    <SmartBoardPlanesSection
      key="planes"
      t={t}
      pricingPlans={pricingPlans}
      paymentMethods={paymentMethods}
      guarantee={guarantee}
      handleCta={handleCta}
    />,
    <SmartBoardTestimoniosSection
      key="testimonios"
      t={t}
      testimonials={testimonials}
    />,
    <SmartBoardFinalSection
      key="final"
      t={t}
      faqItems={faqItems}
      handleCta={handleCta}
    />,
  ];

  const totalSteps = sections.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const seoTitles = [
    t("smartboard.landing_step_que_es"),
    t("smartboard.landing_step_vak"),
    t("smartboard.landing_step_beneficios"),
    t("smartboard.landing_step_tranquilidad"),
    t("smartboard.landing_step_como_funciona"),
    t("smartboard.landing_step_planes"),
    t("smartboard.landing_step_testimonios"),
    t("smartboard.landing_step_faq"),
  ];

  const seoDescriptions = [
    "Descubre cómo SmartBoard combina IA, diagnóstico VAK y coaches humanos para crear una experiencia única de aprendizaje.",
    "Aprende cómo tu hijo aprende mejor: Visual, Auditivo o Kinestésico. Planes personalizados según su estilo.",
    "Mejora académica del 94%, confianza recuperada, y reportes semanales para padres. Beneficios reales comprobados.",
    "Tranquilidad garantizada: coaches humanos certificados + soporte 24/7. Tu hijo está en buenas manos.",
    "Sistema adaptativo que ajusta el ritmo de aprendizaje. Paso a paso, sin presión, con éxito garantizado.",
    "2 planes simples: Starter y Premium. Elige el que mejor se adapte a tus necesidades y presupuesto.",
    "Historias reales de padres: mejoras de calificaciones, confianza y amor por aprender. Testimonios verificados.",
    "Respuestas a tus preguntas: prueba gratuita de 7 días, cancela cuando quieras, no se requiere tarjeta.",
  ];

  return (
    <div className="w-full bg-white overflow-hidden">
      <Helmet>
        <title>{seoTitles[currentStep]} | SmartBoard - Edutechlife</title>
        <meta name="description" content={seoDescriptions[currentStep]} />
      </Helmet>
      <div ref={heroRef}>
        <SmartBoardHeroSection
          t={t}
          onBack={onBack}
          inView={heroInView}
          countStudents={countStudents}
          countImprovement={countImprovement}
          countHours={countHours}
          handleCta={handleCta}
        />
      </div>

      <div ref={navRef}>
        <SmartBoardSectionNav
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          onGoToStep={goToStep}
        />
      </div>

      <motion.div
        className="h-0.5 bg-petroleum/5"
        style={{ transformOrigin: "left" }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary-light via-corporate to-mint"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <div className="relative min-h-0 pt-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 26,
              mass: 1,
            }}
          >
            {sections[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12 pt-6 flex items-center justify-between gap-3 sm:gap-0">
        {currentStep > 0 ? (
          <button
            onClick={goPrev}
            className="group px-5 py-2.5 rounded-full border-2 border-petroleum/20 text-petroleum hover:bg-petroleum hover:text-white hover:border-petroleum transition-all duration-300 text-sm font-semibold flex items-center gap-1.5"
          >
            <motion.span
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ←
            </motion.span>
            {t("smartboard.landing_prev")}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className="group relative"
            >
              <motion.div
                className={`rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-7 h-2.5" : "w-2 h-2"
                }`}
                animate={
                  i === currentStep
                    ? {
                        background: `linear-gradient(135deg, #4DA8C4, #66CCCC)`,
                      }
                    : {
                        backgroundColor: "rgba(0, 75, 99, 0.15)",
                      }
                }
                whileHover={{ scale: 1.3 }}
              />
            </button>
          ))}
        </div>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={goNext}
            className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-petroleum to-primary-light text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold flex items-center gap-1.5 shadow-premium"
          >
            {t("smartboard.landing_next")}
            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </button>
        ) : (
          <button
            onClick={handleCta}
            className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-petroleum to-primary-light text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold flex items-center gap-1.5 shadow-premium"
          >
            {t("smartboard.landing_start_now")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SmartBoardLandingInfo;
