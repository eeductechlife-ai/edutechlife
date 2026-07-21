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
      <SEO title={t('seo.smartboard_kids.title')} description={t('seo.smartboard_kids.desc')} />
      <SmartBoardKidsProvider>
      <Suspense fallback={<PageLoader message={t('smartboard.loading')} />}>
        <SmartBoardKidsDashboard />
      </Suspense>
    </SmartBoardKidsProvider>
    </>
  );
};

export default SmartBoardLandingPage;
