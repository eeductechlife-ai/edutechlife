import { useAuth } from '@clerk/react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

/**
 * Componente ProtectedRoute (Legacy - Mantenido para compatibilidad)
 * NOTA: El sistema principal usa RoleProtectedRoute.jsx con salvoconducto IA Lab
 * Este componente se mantiene solo para compatibilidad con código existente
 * 
 * FLUJO ACTUALIZADO: Redirige a /login en lugar de / para evitar "Efecto Rebote"
 */
const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  
  // Mostrar loader mientras Clerk se carga
  if (!isLoaded) {
    return <PageLoader message="Verificando autenticación..." />;
  }
  
  // Si no está autenticado, redirigir a login (NO a /)
  if (!isSignedIn) {
    const currentPath = window.location.pathname;
    const redirectUrl = `/login?returnTo=${encodeURIComponent(currentPath)}`;
    return <Navigate to={redirectUrl} replace />;
  }
  
  // Usuario autenticado, renderizar children
  return children;
};

export default ProtectedRoute;