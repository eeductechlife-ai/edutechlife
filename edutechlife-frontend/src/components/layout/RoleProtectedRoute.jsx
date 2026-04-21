import { useUser, useAuth } from '@clerk/react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

/**
 * Componente RoleProtectedRoute - Patrón simplificado y robusto
 * 
 * PATRONES IMPLEMENTADOS:
 * 1. Verificación de doble factor: useUser() + useAuth() para sesión robusta
 * 2. Guardia isLoaded: Bloquea redirecciones durante carga
 * 3. Salvoconducto IA Lab: Acceso prioritario sin verificación de metadatos
 * 4. Flujo binario: loading → autenticado → no autenticado
 * 
 * REGLAS DE NEGOCIO:
 * - IA Lab: Cualquier usuario autenticado tiene acceso inmediato (salvoconducto)
 * - SmartBoard/Admin: Requieren rol explícito en publicMetadata.role
 */
const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  
  // Estado de carga
  const isFullyLoaded = userLoaded && authLoaded;
  
  // 1. Mientras carga, mostrar loading
  if (!isFullyLoaded) {
    return <PageLoader message="Verificando permisos..." />;
  }
  
  // 2. Si no está autenticado, redirigir a login
  if (!isSignedIn || !user) {
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(currentPath)}`} replace />;
  }
  
  // 3. Verificación de rol (con salvoconducto para ialab)
  const userRole = user.publicMetadata?.role || 'ialab';
  
  // Salvoconducto IA Lab - cualquier usuario autenticado puede acceder
  if (requiredRole === 'ialab') {
    return children;
  }
  
  // Verificación para otros roles (smartboard, admin)
  if (userRole !== requiredRole) {
    const routeMap = {
      'ialab': '/ialab',
      'smartboard': '/smartboard',
      'admin': '/admin'
    };
    return <Navigate to={routeMap[userRole] || '/ialab'} replace />;
  }
  
  // 4. Acceso permitido
  return children;
};

export default RoleProtectedRoute;