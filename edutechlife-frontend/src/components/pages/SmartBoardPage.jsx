import { lazy, Suspense } from 'react';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';
import { useTranslation } from '../../i18n/I18nProvider';

const SmartBoardDashboard = lazy(() => import('../SmartBoardDashboard'));

const SmartBoardPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message={t('smartboard.loading')} />}>
      <SmartBoardDashboard onNavigate={navigate} onLogout={handleLogout} />
    </Suspense>
  );
};

export default SmartBoardPage;