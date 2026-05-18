import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente SmartBoard Landing Info
const SmartBoardLandingInfo = lazy(() => import('../SmartBoardLandingInfo'));

/**
 * Página informativa de SmartBoard para padres
 * Ruta: /conoce-smartboard
 * Pública - no requiere autenticación
 * Explica qué es SmartBoard, beneficios, precios, testimonios y FAQ
 */
const SmartBoardInfoPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <Suspense fallback={<PageLoader message="Cargando SmartBoard..." />}>
      <SmartBoardLandingInfo onBack={handleBack} onNavigate={handleNavigate} />
    </Suspense>
  );
};

export default SmartBoardInfoPage;
