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
    <>
      <Suspense fallback={<PageLoader message="Cargando contenido..." />}>
        <Hero />
        <AIToolsSection />
        <Esencia />
        <Ecosystem />
        <Metodo />
        <Aliados />
      </Suspense>
      
      {/* Footer se renderiza en Landing Page */}
      <Footer />
    </>
  );
};

export default LandingPage;