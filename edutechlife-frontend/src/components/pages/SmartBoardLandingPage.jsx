import { lazy, Suspense } from 'react';
import { SmartBoardKidsProvider } from '../../context/SmartBoardKidsContext';
import { PageLoader } from '../LoadingScreen';

// Lazy load del nuevo SmartBoard Kids Dashboard (8-16 años)
const SmartBoardKidsDashboard = lazy(() => import('../kids-dashboard/SmartBoardKidsDashboard'));

/**
 * Página de entrada a SmartBoard para niños 8-16 años
 * Ruta: /smartboard
 * Contiene el dashboard completo con Dani tutor, VAK, puntos, calendario y noticias
 * Requiere autenticación para acceder al dashboard completo
 */
const SmartBoardLandingPage = () => {
  return (
    <SmartBoardKidsProvider>
      <Suspense fallback={<PageLoader message="Cargando SmartBoard Kids..." />}>
        <SmartBoardKidsDashboard />
      </Suspense>
    </SmartBoardKidsProvider>
  );
};

export default SmartBoardLandingPage;
