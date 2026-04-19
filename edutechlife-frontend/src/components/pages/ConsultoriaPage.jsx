import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente Consultoria
const Consultoria = lazy(() => import('../Consultoria'));

/**
 * Página Consultoría
 * Ruta: /consultoria
 * Pública - no requiere autenticación
 */
const ConsultoriaPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleNavigate = (route) => {
    navigate(route);
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Consultoría..." />}>
      <Consultoria onBack={handleBack} onNavigate={handleNavigate} />
    </Suspense>
  );
};

export default ConsultoriaPage;