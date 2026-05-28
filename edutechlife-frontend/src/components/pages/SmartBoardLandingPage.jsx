import { lazy, Suspense } from 'react';
import { SmartBoardKidsProvider } from '../../context/SmartBoardKidsContext';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';

const SmartBoardKidsDashboard = lazy(() => import('../kids-dashboard/SmartBoardKidsDashboard'));

const SmartBoardLandingPage = () => {
  const { t } = useTranslation();
  return (
    <SmartBoardKidsProvider>
      <Suspense fallback={<PageLoader message={t('smartboard.loading')} />}>
        <SmartBoardKidsDashboard />
      </Suspense>
    </SmartBoardKidsProvider>
  );
};

export default SmartBoardLandingPage;
