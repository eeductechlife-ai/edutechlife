import { useUser, useAuth } from '@clerk/react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

/**
 * Componente RoleProtectedRoute - Patrón profesional con salvoconducto IA Lab
 * 
 * PATRONES IMPLEMENTADOS (skill clerk-react-patterns):
 * 1. Verificación de doble factor: useUser() + useAuth() para sesión robusta
 * 2. Guardia isLoaded: Bloquea redirecciones durante carga
 * 3. Salvoconducto IA Lab: Acceso prioritario sin verificación de metadatos
 * 4. Logs de auditoría: Trazabilidad completa del flujo de autenticación
 * 
 * REGLAS DE NEGOCIO:
 * - IA Lab: Cualquier usuario autenticado tiene acceso inmediato (salvoconducto)
 * - SmartBoard/Admin: Requieren rol explícito en publicMetadata.role
 * - Sin "Efecto Rebote": No redirige a / si hay sesión activa
 */
const RoleProtectedRoute = ({ children, requiredRole }) => {
  // VERIFICACIÓN DE DOBLE FACTOR: Sesión + Usuario
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  
  // GUARDIA CRÍTICA: Esperar a que Clerk se inicialice completamente
  const isFullyLoaded = userLoaded && authLoaded;
  
  if (!isFullyLoaded) {
    console.log('[CLERK-AUTH] Estado de carga: Clerk inicializando...');
    return <PageLoader message="Verificando permisos..." />;
  }
  
  console.log('[CLERK-AUTH] Clerk completamente cargado');
  console.log('[CLERK-AUTH] Estado de sesión:', { isSignedIn, userId: user?.id });
  
  // VERIFICACIÓN DE SESIÓN ACTIVA
  if (!isSignedIn || !user) {
    console.log('[CLERK-AUTH] DENEGADO: Usuario no autenticado');
    console.log('[CLERK-AUTH] Redirigiendo a /login (sin rebote a /)');
    
    // Redirigir a login manteniendo la ruta destino para retorno
    const currentPath = window.location.pathname;
    const redirectUrl = `/login?returnTo=${encodeURIComponent(currentPath)}`;
    
    return <Navigate to={redirectUrl} replace />;
  }
  
  console.log('[CLERK-AUTH] PERMITIDO: Usuario autenticado confirmado');
  console.log('[CLERK-AUTH] Rol requerido:', requiredRole);
  
  // ============================================
  // SALVOCONDUCTO IA LAB - ACCESO PRIORITARIO
  // ============================================
  if (requiredRole === 'ialab') {
    console.log('[CLERK-AUTH] SALVOCONDUCTO ACTIVADO: Acceso garantizado a IA Lab');
    console.log('[CLERK-AUTH] Usuario:', {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      hasMetadata: !!user.publicMetadata
    });
    
    // ACCESO INMEDIATO: Cualquier usuario autenticado puede entrar al IA Lab
    return children;
  }
  
  // ============================================
  // VERIFICACIÓN DE ROL PARA SMARTBOARD/ADMIN
  // ============================================
  console.log('[CLERK-AUTH] Verificando metadatos de rol...');
  
  const userRole = user.publicMetadata?.role || 'ialab';
  console.log('[CLERK-AUTH] Rol detectado:', userRole);
  
  // Warning en desarrollo si usuario no tiene rol explícito
  if (process.env.NODE_ENV === 'development' && !user.publicMetadata?.role) {
    console.warn('[CLERK-AUTH] Usuario sin rol explícito, usando default: ialab', {
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress
    });
  }
  
  // VERIFICACIÓN DE ROL REQUERIDO
  if (userRole !== requiredRole) {
    console.log('[CLERK-AUTH] DENEGADO: Rol incorrecto');
    console.log('[CLERK-AUTH] Rol usuario:', userRole, '≠ Rol requerido:', requiredRole);
    
    // Redirigir a la ruta correspondiente al rol del usuario
    const routeMap = {
      'ialab': '/ialab',
      'smartboard': '/smartboard',
      'admin': '/admin'
    };
    
    const targetRoute = routeMap[userRole] || '/ialab';
    console.log('[CLERK-AUTH] Redirigiendo a ruta correspondiente:', targetRoute);
    
    return <Navigate to={targetRoute} replace />;
  }
  
  // ============================================
  // ACCESO PERMITIDO
  // ============================================
  console.log('[CLERK-AUTH] PERMITIDO: Rol correcto confirmado');
  console.log('[CLERK-AUTH] Usuario autorizado para:', requiredRole);
  
  return children;
};

export default RoleProtectedRoute;