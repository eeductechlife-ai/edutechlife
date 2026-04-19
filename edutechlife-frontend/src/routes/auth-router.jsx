import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/react';

const AuthRouter = () => {
  // VERIFICACIÓN DE DOBLE FACTOR: Sesión + Usuario (misma lógica que RoleProtectedRoute)
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  
  // GUARDIA CRÍTICA: Esperar a que Clerk se inicialice completamente
  const isFullyLoaded = userLoaded && authLoaded;
  
  // Mientras Clerk carga, mostrar loader optimizado con branding Edutechlife
  if (!isFullyLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550]">
        <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl text-center">
          <h2 className="text-3xl font-black text-[#004B63] mb-4">Edutechlife</h2>
          <div className="w-full h-2 bg-[#4DA8C4]/20 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-[#004B63] to-[#4DA8C4] w-1/2 animate-pulse" />
          </div>
          <p className="text-[#004B63] font-semibold animate-pulse">
            Verificando credenciales...
          </p>
        </div>
      </div>
    );
  }
  
  // Clerk completamente cargado pero usuario no autenticado → redirigir a login
  if (isFullyLoaded && !isSignedIn) {
    console.log('[CLERK-AUTH] AuthRouter: Usuario no autenticado, redirigiendo a login');
    console.log('[CLERK-AUTH] AuthRouter: Flujo directo a IA Lab activado');
    
    // REDIRECCIÓN INTELIGENTE: /login?returnTo=/ialab (FLUJO DIRECTO)
    // Usuario va directamente a login y luego a IA Lab, sin pasar por Home
    const redirectUrl = '/login?returnTo=/ialab';
    console.log(`[CLERK-AUTH] AuthRouter: Redirigiendo a: ${redirectUrl}`);
    
    return <Navigate to={redirectUrl} replace />;
  }
  
  // Clerk cargado Y usuario autenticado → redirigir según rol
  if (isFullyLoaded && isSignedIn && user) {
    // Obtener rol del usuario (default: 'ialab' - REGLA DE NEGOCIO)
    const role = user.publicMetadata?.role || 'ialab';
    
    // DISTINCIÓN CLARA ENTRE SERVICIOS
    const serviceNames = {
      'ialab': 'IA Lab Dashboard (Estudiantes/Cursos)',
      'smartboard': 'SmartBoard (Niños 6-16 años)',
      'admin': 'Admin Dashboard'
    };
    
    // Mapeo de roles a rutas
    const routeMap = {
      'ialab': '/ialab',
      'smartboard': '/smartboard',
      'admin': '/admin'
    };
    
    // Obtener ruta destino (default: '/ialab' - REGLA DE NEGOCIO)
    const targetRoute = routeMap[role] || '/ialab';
    const serviceName = serviceNames[role] || 'IA Lab Dashboard';
    
    console.log(`[CLERK-AUTH] AuthRouter: Rol detectado: "${role}"`);
    console.log(`[CLERK-AUTH] AuthRouter: Servicio: ${serviceName}`);
    console.log(`[CLERK-AUTH] AuthRouter: Redirigiendo a: ${targetRoute}`);
    
    // REDIRECCIÓN DIRECTA - Sin Ghost Routing
    return <Navigate to={targetRoute} replace />;
  }
  
  // Caso de fallback (no debería llegar aquí)
  console.error('[CLERK-AUTH] ❌ AuthRouter: Estado inesperado, redirigiendo a /login');
  return <Navigate to="/login" replace />;
};

export default AuthRouter;