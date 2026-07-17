import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import SEO from '../SEO';

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
    <>
      <SEO title="Proyectos Nacionales" description="Conoce nuestros proyectos educativos nacionales. Edutechlife lidera la transformación educativa en Colombia con pedagogía e IA." />
      <Suspense fallback={<PageLoader message="Cargando Proyectos Nacional..." />}>
        <ProyectosNacional onBack={handleBack} />
      </Suspense>
    </>
  );
};

export default ProyectosNacionalPage;