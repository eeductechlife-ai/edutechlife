import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';

const ConsultoriaB2B = lazy(() => import('../ConsultoriaB2B'));

const ConsultoriaB2BPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message={t('page_loader.consulting_b2b')} />}>
      <ConsultoriaB2B onBack={handleBack} />
    </Suspense>
  );
};

export default ConsultoriaB2BPage;