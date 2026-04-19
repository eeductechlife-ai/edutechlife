import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente AutomationArchitect
const AutomationArchitect = lazy(() => import('../AutomationArchitect'));

/**
 * Página Automation Architect
 * Ruta: /automation
 * Pública - no requiere autenticación
 */
const AutomationArchitectPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Automation Architect..." />}>
      <AutomationArchitect onBack={handleBack} />
    </Suspense>
  );
};

export default AutomationArchitectPage;