import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import Footer from '../Footer';
import { useTranslation } from '../../i18n/I18nProvider';
import SEO from '../SEO';

const SmartBoardLandingInfo = lazy(() => import('../SmartBoardLandingInfo'));

const SmartBoardInfoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate('/');
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      <SEO title="SmartBoard" description="Pizarra inteligente interactiva para niños. SmartBoard de Edutechlife combina educación y tecnología para potenciar el aprendizaje infantil." />
      <Suspense fallback={<PageLoader message={t('smartboard.loading')} />}>
        <SmartBoardLandingInfo onBack={handleBack} onNavigate={handleNavigate} />
      </Suspense>
      <Footer />
    </>
  );
};

export default SmartBoardInfoPage;
