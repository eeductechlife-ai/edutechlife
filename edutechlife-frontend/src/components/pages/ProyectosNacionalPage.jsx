import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import SEO from '../SEO';
import { useTranslation } from '../../i18n/I18nProvider';

const ProyectosNacional = lazy(() => import('../ProyectosNacional'));

const ProyectosNacionalPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <>
      <SEO title={t('seo.proyectos.title')} description={t('seo.proyectos.desc')} />
      <Suspense fallback={<PageLoader message="Cargando Proyectos Nacional..." />}>
        <ProyectosNacional onBack={handleBack} />
      </Suspense>
    </>
  );
};

export default ProyectosNacionalPage;