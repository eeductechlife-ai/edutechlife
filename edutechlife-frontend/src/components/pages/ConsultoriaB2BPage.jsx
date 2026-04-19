import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente ConsultoriaB2B
const ConsultoriaB2B = lazy(() => import('../ConsultoriaB2B'));

/**
 * Página Consultoría B2B
 * Ruta: /consultoria-b2b
 * Pública - no requiere autenticación
 */
const ConsultoriaB2BPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Consultoría B2B..." />}>
      <ConsultoriaB2B onBack={handleBack} />
    </Suspense>
  );
};

export default ConsultoriaB2BPage;