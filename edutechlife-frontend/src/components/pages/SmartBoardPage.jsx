import { lazy, Suspense } from 'react';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente SmartBoardDashboard
const SmartBoardDashboard = lazy(() => import('../SmartBoardDashboard'));

/**
 * Página SmartBoard Dashboard
 * Ruta: /smartboard
 * Protegida: Requiere autenticación + rol 'smartboard'
 */
const SmartBoardPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando SmartBoard..." />}>
      <SmartBoardDashboard onNavigate={navigate} onLogout={handleLogout} />
    </Suspense>
  );
};

export default SmartBoardPage;