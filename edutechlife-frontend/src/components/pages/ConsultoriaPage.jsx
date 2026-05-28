import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';

const Consultoria = lazy(() => import('../Consultoria'));

const ConsultoriaPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleNavigate = (route) => {
    navigate(route);
  };
  
  return (
    <Suspense fallback={<PageLoader message={t('page_loader.consulting')} />}>
      <Consultoria onBack={handleBack} onNavigate={handleNavigate} />
    </Suspense>
  );
};

export default ConsultoriaPage;