import { lazy, Suspense } from 'react';
import { SmartBoardKidsProvider } from '../../context/SmartBoardKidsContext';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';
import SEO from '../SEO';

const SmartBoardKidsDashboard = lazy(() => import('../kids-dashboard/SmartBoardKidsDashboard'));
const SmartBoardParentDashboard = lazy(() => import('./smartBoardParentDashboard/SmartBoardParentDashboard'));

const SmartBoardLandingPage = () => {
  const { t } = useTranslation();
  const isParent = localStorage.getItem('user_role') === 'parent';

  if (isParent) {
    return (
      <Suspense fallback={<PageLoader message="Cargando panel de padres..." />}>
        <SmartBoardParentDashboard />
      </Suspense>
    );
  }

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
