import { lazy, Suspense } from "react";
import { PageLoader } from "../LoadingScreen";
import ErrorBoundary from "../common/ErrorBoundary";
import SEO from "../SEO";
import { useTranslation } from "../../i18n/I18nProvider";
import { useLightModeOnly } from "../../context/ThemeContext";

const Hero = lazy(() => import("../Hero"));
const AIToolsSection = lazy(() => import("../AIToolsSection"));
const Esencia = lazy(() => import("../Esencia"));
const Ecosystem = lazy(() => import("../Ecosystem"));
const Metodo = lazy(() => import("../Metodo"));
const Aliados = lazy(() => import("../Aliados"));
const Footer = lazy(() => import("../Footer"));

const sectionFallback = (h) => {
  const heights = { 32: "h-32", 40: "h-40", 48: "h-48" };
  return (
    <div
      className={`${heights[h] || "h-40"} bg-gradient-to-b from-slate-50 to-white animate-pulse rounded-2xl mx-4 my-8`}
    />
  );
};

const LandingPage = () => {
  const { t } = useTranslation();

  // Forces light mode via effect post-paint; does not block initial render
  useLightModeOnly();
  return (
    <>
      <SEO title={t("seo.home.title")} description={t("seo.home.desc")} />
      <div className="pt-24">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader message={t("common.loading")} />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={sectionFallback(32)}>
            <AIToolsSection />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={sectionFallback(48)}>
            <Esencia />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={sectionFallback(40)}>
            <Ecosystem />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={sectionFallback(48)}>
            <Metodo />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={sectionFallback(32)}>
            <Aliados />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="h-24 animate-pulse rounded-2xl mx-4 my-4" />
            }
          >
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default LandingPage;
