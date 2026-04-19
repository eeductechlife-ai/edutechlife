import { lazy, Suspense } from 'react';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

// Lazy load del componente AdminDashboard
const AdminDashboard = lazy(() => import('../AdminDashboard'));

/**
 * Página Admin Dashboard
 * Ruta: /admin
 * Protegida: Requiere autenticación + rol 'admin'
 */
const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <Suspense fallback={<PageLoader message="Cargando Admin Dashboard..." />}>
      <AdminDashboard onLogout={handleLogout} onBack={handleBack} />
    </Suspense>
  );
};

export default AdminPage;