import { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "../i18n/I18nProvider";
import { useABExperiment, trackConversion } from "../hooks/useABExperiment";
import { useAuthIdentity } from "../hooks/useAuthIdentity";
import { startCheckout } from "../services/stripeClient";
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
} from "./IngenIALandingData";
import IngenIAInfoHero from "./ingenia/IngenIAInfoHero";
import IngenIASectionNav from "./ingenia/IngenIASectionNav";
import IngenIAQueEsSection from "./ingenia/IngenIAQueEsSection";
import IngenIABeneficiosTranquilidadSection from "./ingenia/IngenIABeneficiosTranquilidadSection";
import IngenIAComoFuncionaSection from "./ingenia/IngenIAComoFuncionaSection";
import IngenIAPlanesSection from "./ingenia/IngenIAPlanesSection";
import IngenIATestimoniosSection from "./ingenia/IngenIATestimoniosSection";
import IngenIAFinalSection from "./ingenia/IngenIAFinalSection";
import IngenIAWhatsappCta from "./ingenia/IngenIAWhatsappCta";
import IngenIAMobileBar from "./ingenia/IngenIAMobileBar";
import IngenIAValoracion from "./ingenia/IngenIAValoracion";
import {
  elegirPlanIngenIA,
  resolveLandingPlanId,
  INGENIA_SIGNUP_FOR_PLAN,
} from "./ingenia/ingeniaPlanCheckout";
import "./ingenia/ingenia-theme.css";

// Anclas de cada sección. El wrapper usa un id con prefijo para NO chocar con
// los ids que ya traen las <section> internas (que-es, planes, ...).
const SECTION_ANCHORS = [
  "que-es",
  "beneficios",
  "como-funciona",
  "planes",
  "testimonios",
  "faq",
];

const anchorId = (anchor) => `ingenia-sec-${anchor}`;

// Bloque de valoración gratis (antes de «Planes»): destino de los planes personalizados.
const VALORACION_ANCHOR = "valoracion";
const scrollToValoracion = () =>
  document
    .getElementById(VALORACION_ANCHOR)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

const getStepLabels = (t) => [
  t("ingenia.landing_step_que_es"),
  t("ingenia.landing_step_beneficios"),
  t("ingenia.landing_step_como_funciona"),
  t("ingenia.landing_step_planes"),
  t("ingenia.landing_step_testimonios"),
  t("ingenia.landing_step_faq"),
];

const IngenIALandingInfo = ({ onNavigate }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  // Formulario corto del hero: lo abre el botón del hero o la barra móvil.
  const [heroFormAbierto, setHeroFormAbierto] = useState(false);
  const abrirFormularioHero = useCallback(() => setHeroFormAbierto(true), []);
  const irAlHeroYProbar = useCallback(() => {
    setHeroFormAbierto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const vakStyles = getVakStyles(locale);
  const pricingPlans = getPricingPlans(locale);
  const testimonials = getTestimonials(locale);
  const beneficios = getBeneficios(locale);
  const tranquilidad = getTranquilidad(locale);
  const pasos = getPasos(locale);
  const faqItems = getFaqItems(locale);
  const paymentMethods = getPaymentMethods(locale);
  const guarantee = getGuarantee(locale);

  const stepLabels = getStepLabels(t);

  // Desplaza la vista a la sección indicada. scrollIntoView respeta el
  // scroll-margin-top del wrapper, que compensa la barra sticky.
  const goToStep = useCallback((index) => {
    const el = document.getElementById(anchorId(SECTION_ANCHORS[index]));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goNext = useCallback(() => {
    setActiveStep((prev) => {
      const next = Math.min(prev + 1, SECTION_ANCHORS.length - 1);
      goToStep(next);
      return next;
    });
  }, [goToStep]);

  const goPrev = useCallback(() => {
    setActiveStep((prev) => {
      const next = Math.max(prev - 1, 0);
      goToStep(next);
      return next;
    });
  }, [goToStep]);

  // Marca la sección visible como "activa" mientras el usuario hace scroll.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveStep(idx);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    SECTION_ANCHORS.forEach((anchor, i) => {
      const el = document.getElementById(anchorId(anchor));
      if (!el) return;
      el.dataset.index = String(i);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const { variant } = useABExperiment();

  const handleCta = useCallback(() => {
    trackConversion("cta_click", {
      section: stepLabels[activeStep],
      experiment_variant: variant,
    });
    if (onNavigate) onNavigate("/sign-up/ingenia");
    else navigate("/sign-up/ingenia");
  }, [onNavigate, navigate, variant, activeStep, stepLabels]);

  // Botón "Elegir" de un plan: Base y Fundador van a Wompi; Personalizado, a la
  // valoración gratis (sin cobro); el resto, al registro de siempre.
  const { isSignedIn } = useAuthIdentity();
  const [planError, setPlanError] = useState("");
  const handlePlanSelect = useCallback(
    (plan) => {
      setPlanError("");
      return elegirPlanIngenIA({
        planId: resolveLandingPlanId(plan.id),
        isSignedIn,
        startCheckout,
        onSignIn: () =>
          onNavigate
            ? onNavigate(INGENIA_SIGNUP_FOR_PLAN)
            : navigate(INGENIA_SIGNUP_FOR_PLAN),
        onRegister: handleCta,
        onValoracion: () => scrollToValoracion(),
        redirect: (url) => {
          window.location.href = url;
        },
        onError: () => setPlanError(t("planes.checkout_error")),
      });
    },
    [isSignedIn, onNavigate, navigate, handleCta, t],
  );

  // Si llegan con #valoracion (desde /planes), lleva al formulario al montar.
  useEffect(() => {
    if (window.location.hash === `#${VALORACION_ANCHOR}`) scrollToValoracion();
  }, []);

  const sections = [
    <IngenIAQueEsSection key="que-es" t={t} vakStyles={vakStyles} />,
    <IngenIABeneficiosTranquilidadSection
      key="beneficios"
      t={t}
      beneficios={beneficios}
      tranquilidad={tranquilidad}
    />,
    <IngenIAComoFuncionaSection
      key="como-funciona"
      t={t}
      pasos={pasos}
      handleCta={handleCta}
    />,
    <IngenIAPlanesSection
      key="planes"
      t={t}
      pricingPlans={pricingPlans}
      paymentMethods={paymentMethods}
      guarantee={guarantee}
      onSelectPlan={handlePlanSelect}
      planError={planError}
    />,
    <IngenIATestimoniosSection
      key="testimonios"
      t={t}
      testimonials={testimonials}
    />,
    <IngenIAFinalSection
      key="final"
      t={t}
      faqItems={faqItems}
      handleCta={handleCta}
    />,
  ];

  const totalSteps = sections.length;
  const progress = ((activeStep + 1) / totalSteps) * 100;

  const seoTitles = [
    t("ingenia.landing_step_que_es"),
    t("ingenia.landing_step_beneficios"),
    t("ingenia.landing_step_como_funciona"),
    t("ingenia.landing_step_planes"),
    t("ingenia.landing_step_testimonios"),
    t("ingenia.landing_step_faq"),
  ];

  const seoDescriptions = [
    "Descubre cómo IngenIA combina IA, ADN de Aprendizaje y coaches humanos para crear una experiencia única de aprendizaje.",
    "Confianza, motivación y reportes semanales para padres. Beneficios pensados para cada niño.",
    "Sistema adaptativo que ajusta el ritmo de aprendizaje. Paso a paso, sin presión.",
    "2 planes simples: Starter y Premium. Elige el que mejor se adapte a tus necesidades y presupuesto.",
    "Historias reales de padres: mejoras de calificaciones, confianza y amor por aprender. Testimonios verificados.",
    "Respuestas a tus preguntas: prueba gratuita de 7 días, cancela cuando quieras, no se requiere tarjeta.",
  ];

  return (
    <div className="ingenia-theme w-full bg-white">
      <Helmet>
        <title>{seoTitles[activeStep]} | IngenIA - Edutechlife</title>
        <meta name="description" content={seoDescriptions[activeStep]} />
      </Helmet>

      <IngenIAInfoHero
        formAbierto={heroFormAbierto}
        onAbrirFormulario={abrirFormularioHero}
      >
        <IngenIASectionNav
          currentStep={activeStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          onGoToStep={goToStep}
        />
      </IngenIAInfoHero>

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

      {/* Todas las secciones se renderizan en el DOM (scroll vertical).
          Antes vivían ocultas tras un carrusel, lo que dañaba UX y SEO. */}
      <div className="relative">
        {sections.map((section, i) => (
          <Fragment key={SECTION_ANCHORS[i]}>
            {/* Antes de «Planes»: valoración gratis de 20 minutos para el plan personalizado. */}
            {i === 3 && <IngenIAValoracion />}
            <div id={anchorId(SECTION_ANCHORS[i])} className="scroll-mt-16">
              {section}
            </div>
            {/* Tras «Cómo funciona»: contacto directo por WhatsApp, sin formulario. */}
            {i === 2 && <IngenIAWhatsappCta />}
          </Fragment>
        ))}
      </div>

      {/* pb extra en móvil para que la barra fija inferior no tape el final */}
      <div className="max-w-3xl mx-auto px-4 pb-24 pt-6 md:pb-12 flex items-center justify-between gap-3">
        {activeStep > 0 ? (
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
            {t("ingenia.landing_prev")}
          </button>
        ) : (
          <div />
        )}

        {activeStep < totalSteps - 1 ? (
          <button
            onClick={goNext}
            className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-petroleum to-primary-light text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold flex items-center gap-1.5 shadow-premium"
          >
            {t("ingenia.landing_next")}
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
            {t("ingenia.landing_start_now")}
          </button>
        )}
      </div>

      <IngenIAMobileBar onProbar={irAlHeroYProbar} />
    </div>
  );
};

export default IngenIALandingInfo;
