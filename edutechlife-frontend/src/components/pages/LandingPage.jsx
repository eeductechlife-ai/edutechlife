import { lazy, Suspense } from 'react';
import { PageLoader } from '../LoadingScreen';
import Footer from '../Footer';

// Lazy load components para mejor performance
const Hero = lazy(() => import('../Hero'));
const AIToolsSection = lazy(() => import('../AIToolsSection'));
const Esencia = lazy(() => import('../Esencia'));
const Ecosystem = lazy(() => import('../Ecosystem'));
const Metodo = lazy(() => import('../Metodo'));
const Aliados = lazy(() => import('../Aliados'));

/**
 * Página de inicio (Landing Page)
 * Ruta: /
 * Pública - no requiere autenticación
 */
const LandingPage = () => {
  return (
    <div className="pt-24">
      <Suspense fallback={<PageLoader message="Cargando..." />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-gradient-to-b from-slate-50 to-white animate-pulse rounded-2xl mx-4 my-8" />}>
        <AIToolsSection />
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-gradient-to-b from-white to-slate-50 animate-pulse rounded-2xl mx-4 my-8" />}>
        <Esencia />
      </Suspense>
      <Suspense fallback={<div className="h-40 bg-gradient-to-b from-slate-50 to-white animate-pulse rounded-2xl mx-4 my-8" />}>
        <Ecosystem />
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-gradient-to-b from-white to-slate-50 animate-pulse rounded-2xl mx-4 my-8" />}>
        <Metodo />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-gradient-to-b from-slate-50 to-white animate-pulse rounded-2xl mx-4 my-8" />}>
        <Aliados />
      </Suspense>
      
      {/* Footer se renderiza en Landing Page */}
      <Footer />
    </div>
  );
};

export default LandingPage;