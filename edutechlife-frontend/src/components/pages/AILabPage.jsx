import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente IALab
const IALab = lazy(() => import('../IALab'));

/**
 * Página AILab (Artificial Intelligence Lab)
 * Ruta: /ialab
 * Protegida: Requiere autenticación + rol 'ialab'
 */
const AILabPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando AILab..." />}>
      <IALab onBack={handleBack} />
    </Suspense>
  );
};

export default AILabPage;