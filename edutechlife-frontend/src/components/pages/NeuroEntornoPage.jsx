import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente NeuroEntorno
const NeuroEntorno = lazy(() => import('../NeuroEntorno'));

/**
 * Página Neuro Entorno
 * Ruta: /neuroentorno
 * Pública - no requiere autenticación
 */
const NeuroEntornoPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleNavigate = (route) => {
    navigate(route);
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Neuro Entorno..." />}>
      <NeuroEntorno onBack={handleBack} onNavigate={handleNavigate} />
    </Suspense>
  );
};

export default NeuroEntornoPage;