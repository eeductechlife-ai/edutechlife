import { lazy, Suspense } from 'react';
import { PageLoader } from '../LoadingScreen';
import ErrorBoundary from '../common/ErrorBoundary';
import SEO from '../SEO';

const Hero = lazy(() => import('../Hero'));
const AIToolsSection = lazy(() => import('../AIToolsSection'));
const Esencia = lazy(() => import('../Esencia'));
const Ecosystem = lazy(() => import('../Ecosystem'));
const Metodo = lazy(() => import('../Metodo'));
const Aliados = lazy(() => import('../Aliados'));
const Footer = lazy(() => import('../Footer'));

const sectionFallback = (h) => (
  <div className={`h-${h} bg-gradient-to-b from-slate-50 to-white animate-pulse rounded-2xl mx-4 my-8`} />
);

const LandingPage = () => {
  return (
    <>
      <SEO title="Inicio" description="Liderando la Educación del Futuro con Pedagogía e Inteligencia Artificial. Cursos, diagnósticos y herramientas educativas impulsadas por IA." />
      <div className="pt-24">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader message="Cargando..." />}>
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
        <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl mx-4 my-4" />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
    </>
  );
};

export default LandingPage;
