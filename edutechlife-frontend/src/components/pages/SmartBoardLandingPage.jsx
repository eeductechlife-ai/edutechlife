import { lazy, Suspense } from 'react';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente SmartBoard original (GUI con analizador de documentos, líneas de investigación, VAK)
const SmartBoard = lazy(() => import('../SmartBoard'));

/**
 * Página pública de aterrizaje de SmartBoard
 * Ruta: /smartboard
 * Contiene el entorno gráfico original con todas las funcionalidades visuales
 * No requiere autenticación - página pública
 */
const SmartBoardLandingPage = () => {
  return (
    <Suspense fallback={<PageLoader message="Cargando SmartBoard..." />}>
      <SmartBoard />
    </Suspense>
  );
};

export default SmartBoardLandingPage;
