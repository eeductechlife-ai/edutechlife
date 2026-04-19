import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente ProyectosNacional
const ProyectosNacional = lazy(() => import('../ProyectosNacional'));

/**
 * Página Proyectos Nacional
 * Ruta: /proyectos
 * Pública - no requiere autenticación
 */
const ProyectosNacionalPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Proyectos Nacional..." />}>
      <ProyectosNacional onBack={handleBack} />
    </Suspense>
  );
};

export default ProyectosNacionalPage;