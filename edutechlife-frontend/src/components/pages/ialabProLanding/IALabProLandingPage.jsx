import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useAuthIdentity } from "../../../hooks/useAuthIdentity";
import { useTranslation } from "../../../i18n/I18nProvider";
import SEO from "../../SEO";
import {
  getCategories,
  getCourses,
  getBenefits,
  getStats,
  getStatusConfig,
} from "../../IALab/data/landingPageData";
import NicoModern from "../../Nico/NicoModern";
import Footer from "../../Footer";
import HeroSection from "./components/HeroSection";
import IAFeaturesSection from "./components/IAFeaturesSection";
import IACourseGrid from "./components/IACourseGrid";
import MobileCTA from "./components/MobileCTA";

const IALabProLandingPage = () => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuthIdentity();
  const [activeCategory, setActiveCategory] = useState("all");
  const { scrollYProgress, scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const [showFAB, setShowFAB] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => {
      setShowFAB(latest > 600);
      setShowMobileCTA(latest > 400);
    });
    return () => unsub();
  }, [scrollY]);

  const categories = getCategories(locale);
  const courses = getCourses(locale);
  const benefits = getBenefits(locale);
  getStats(locale);
  const statusConfig = getStatusConfig(locale);

  return (
    <>
      <SEO
        title={t("seo.ialab_academic.title")}
        description={t("seo.ialab_academic.desc")}
      />
      <div className="min-h-screen bg-white">
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#66CCCC] origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />

        <HeroSection
          t={t}
          navigate={navigate}
          scrollY={scrollY}
          prefersReducedMotion={prefersReducedMotion}
          locale={locale}
        />

        <div className="relative h-16 md:h-20 bg-gradient-to-b from-[#004064] to-white overflow-hidden">
          <motion.div
            className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#4DA8C4]/40 to-transparent"
            animate={
              !prefersReducedMotion
                ? { opacity: [0.2, 0.6, 0.2], scaleX: [1, 1.2, 1] }
                : {}
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg
            className="absolute bottom-0 w-full h-8 md:h-12"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            fill="#F0F7FA"
          >
            <motion.path
              d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z"
              animate={
                !prefersReducedMotion
                  ? {
                      d: [
                        "M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z",
                        "M0,24 C360,0 1080,48 1440,24 L1440,48 L0,48 Z",
                        "M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <IAFeaturesSection benefits={benefits} t={t} />

        <IACourseGrid
          t={t}
          locale={locale}
          navigate={navigate}
          isSignedIn={isSignedIn}
          categories={categories}
          courses={courses}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          statusConfig={statusConfig}
        />

        <AnimatePresence>
          {showFAB && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#004B63] rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(0,75,99,0.3)] flex items-center justify-center text-white transition-all duration-300 hover:bg-[#00BCD4]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m0 0v11"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <MobileCTA t={t} showMobileCTA={showMobileCTA} />

        <Footer />
        <NicoModern />
      </div>
    </>
  );
};

export default IALabProLandingPage;
