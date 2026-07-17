import { lazy, Suspense } from 'react';
import { SmartBoardKidsProvider } from '../../context/SmartBoardKidsContext';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';
import SEO from '../SEO';

const SmartBoardKidsDashboard = lazy(() => import('../kids-dashboard/SmartBoardKidsDashboard'));

const SmartBoardLandingPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO title="SmartBoard Kids" description="Dashboard infantil de SmartBoard. Aprendizaje interactivo y divertido para niños con la plataforma educativa Edutechlife." />
      <SmartBoardKidsProvider>
      <Suspense fallback={<PageLoader message={t('smartboard.loading')} />}>
        <SmartBoardKidsDashboard />
      </Suspense>
    </SmartBoardKidsProvider>
    </>
  );
};

export default SmartBoardLandingPage;
