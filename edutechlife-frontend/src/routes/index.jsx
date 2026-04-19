import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthRouter from './auth-router';
import LandingPage from '../components/pages/LandingPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute';
import { PageLoader } from '../components/LoadingScreen';

// Lazy load para componentes pesados
const WelcomeScreen = lazy(() => import('../components/WelcomeScreen'));
const IALabSignUpPage = lazy(() => import('../components/IALabSignUpPage'));
const SmartBoardSignUpPage = lazy(() => import('../components/SmartBoardSignUpPage'));
const AILabPage = lazy(() => import('../components/pages/AILabPage'));
const SmartBoardPage = lazy(() => import('../components/pages/SmartBoardPage'));
const AdminPage = lazy(() => import('../components/pages/AdminPage'));
const NeuroEntornoPage = lazy(() => import('../components/pages/NeuroEntornoPage'));
const ProyectosNacionalPage = lazy(() => import('../components/pages/ProyectosNacionalPage'));
const ConsultoriaPage = lazy(() => import('../components/pages/ConsultoriaPage'));
const ConsultoriaB2BPage = lazy(() => import('../components/pages/ConsultoriaB2BPage'));
const AutomationArchitectPage = lazy(() => import('../components/pages/AutomationArchitectPage'));
const VAKDiagnosisPage = lazy(() => import('../components/pages/VAKDiagnosisPage'));
const IALabDashboardPage = lazy(() => import('../components/pages/IALabDashboardPage'));
const SmartBoardStatsPage = lazy(() => import('../components/pages/SmartBoardStatsPage'));

// Componente wrapper para IALabSignUpPage que maneja navegación
const IALabSignUpPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/ialab';
  
  const handleBack = (customReturnTo) => {
    const targetReturnTo = customReturnTo || returnTo;
    navigate(`/?returnTo=${encodeURIComponent(targetReturnTo)}`);
  };
  
  return <IALabSignUpPage onBack={handleBack} />;
};

// Componente wrapper para SmartBoardSignUpPage que maneja navegación
const SmartBoardSignUpPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/smartboard';
  
  const handleBack = (customReturnTo) => {
    const targetReturnTo = customReturnTo || returnTo;
    navigate(`/?returnTo=${encodeURIComponent(targetReturnTo)}`);
  };
  
  return <SmartBoardSignUpPage onBack={handleBack} />;
};

// Componente para redirección inteligente de registro
const GenericSignUpRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo') || '/ialab';
    
    // Determinar formulario basado en returnTo
    let targetSignUp = '/sign-up/ialab';
    
    if (returnTo === '/smartboard' || returnTo.startsWith('/smartboard/')) {
      targetSignUp = '/sign-up/smartboard';
    }
    
    // Redirigir al formulario específico manteniendo returnTo
    navigate(`${targetSignUp}?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
  }, [navigate, location]);
  
  return <PageLoader message="Redirigiendo al formulario de registro..." />;
};
// Test components - comment out for production
// const JWTIntegrationTestPage = lazy(() => import('../components/test/JWTIntegrationTestPage'));
// const RouteProtectionTest = lazy(() => import('../components/test/RouteProtectionTest'));
// const JWTIntegrationTest = lazy(() => import('../components/test/JWTIntegrationTest'));
// const AuthMigrationDashboard = lazy(() => import('../components/test/AuthMigrationDashboard'));

/**
 * Configuración de rutas principales de la aplicación
 * 
 * Estructura:
 * - Rutas públicas: /, /neuroentorno, /proyectos, etc.
 * - Rutas protegidas: /ialab, /smartboard, /admin (requieren autenticación + rol)
 * - Rutas de autenticación: /auth-router (redirección inteligente)
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout principal con header, footer y modales globales */}
      <Route path="/" element={<AppLayout />}>
        {/* Ruta principal (pública) */}
        <Route index element={<LandingPage />} />
        
        {/* Rutas de autenticación */}
        <Route path="auth-router" element={<AuthRouter />} />
        
        {/* Rutas públicas (no requieren autenticación) */}
        <Route path="neuroentorno" element={
          <Suspense fallback={<PageLoader message="Cargando Neuro Entorno..." />}>
            <NeuroEntornoPage />
          </Suspense>
        } />
        
        <Route path="proyectos" element={
          <Suspense fallback={<PageLoader message="Cargando Proyectos..." />}>
            <ProyectosNacionalPage />
          </Suspense>
        } />
        
        <Route path="consultoria" element={
          <Suspense fallback={<PageLoader message="Cargando Consultoría..." />}>
            <ConsultoriaPage />
          </Suspense>
        } />
        
        <Route path="consultoria-b2b" element={
          <Suspense fallback={<PageLoader message="Cargando Consultoría B2B..." />}>
            <ConsultoriaB2BPage />
          </Suspense>
        } />
        
        <Route path="automation" element={
          <Suspense fallback={<PageLoader message="Cargando Automation Architect..." />}>
            <AutomationArchitectPage />
          </Suspense>
        } />
        
        {/* VAK Diagnosis - múltiples variantes */}
        <Route path="vak" element={
          <Suspense fallback={<PageLoader message="Cargando Diagnóstico VAK..." />}>
            <VAKDiagnosisPage variant="premium" />
          </Suspense>
        } />
        
        <Route path="vak-simple" element={
          <Suspense fallback={<PageLoader message="Cargando Diagnóstico VAK Simple..." />}>
            <VAKDiagnosisPage variant="simple" />
          </Suspense>
        } />
        
        <Route path="vak-premium" element={
          <Suspense fallback={<PageLoader message="Cargando Diagnóstico VAK Premium..." />}>
            <VAKDiagnosisPage variant="premium" />
          </Suspense>
        } />
        
        {/* Rutas protegidas por autenticación */}
        <Route path="ialab" element={
          <RoleProtectedRoute requiredRole="ialab">
            <Suspense fallback={<PageLoader message="Preparando AILab..." />}>
              <AILabPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="smartboard" element={
          <RoleProtectedRoute requiredRole="smartboard">
            <Suspense fallback={<PageLoader message="Preparando SmartBoard..." />}>
              <SmartBoardPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="admin" element={
          <RoleProtectedRoute requiredRole="admin">
            <Suspense fallback={<PageLoader message="Preparando Admin Dashboard..." />}>
              <AdminPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        {/* Rutas adicionales para datos y estadísticas */}
        <Route path="ialab/dashboard" element={
          <RoleProtectedRoute requiredRole="ialab">
            <Suspense fallback={<PageLoader message="Cargando Dashboard IA Lab..." />}>
              <IALabDashboardPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="smartboard/estadisticas" element={
          <RoleProtectedRoute requiredRole="smartboard">
            <Suspense fallback={<PageLoader message="Cargando Estadísticas SmartBoard..." />}>
              <SmartBoardStatsPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        {/* Rutas de desarrollo/testing - comentadas para producción */}
        {/* <Route path="jwt-test" element={
          <Suspense fallback={<PageLoader message="Cargando JWT Test..." />}>
            <JWTIntegrationTestPage />
          </Suspense>
        } />
        
        <Route path="route-test" element={
          <Suspense fallback={<PageLoader message="Cargando Route Test..." />}>
            <RouteProtectionTest />
          </Suspense>
        } />
        
        <Route path="jwt-integration-test" element={
          <Suspense fallback={<PageLoader message="Cargando JWT Integration Test..." />}>
            <JWTIntegrationTest />
          </Suspense>
        } /> */}
        
        {/* <Route path="auth-migration-dashboard" element={
          <Suspense fallback={<PageLoader message="Cargando Auth Migration Dashboard..." />}>
            <AuthMigrationDashboard />
          </Suspense>
        } /> */}
        
        {/* Ruta de registro para IALAB (adultos 18+ años) */}
        <Route path="sign-up/ialab" element={
          <Suspense fallback={<PageLoader message="Cargando registro IALAB..." />}>
            <IALabSignUpPageWrapper />
          </Suspense>
        } />
        
        {/* Ruta de registro para SmartBoard (estudiantes 8-16 años) */}
        <Route path="sign-up/smartboard" element={
          <Suspense fallback={<PageLoader message="Cargando registro SmartBoard..." />}>
            <SmartBoardSignUpPageWrapper />
          </Suspense>
        } />
        
        {/* Ruta de registro genérica - redirige según returnTo o a IALAB por defecto */}
        <Route path="sign-up" element={
          <Suspense fallback={<PageLoader message="Cargando registro..." />}>
            <GenericSignUpRedirect />
          </Suspense>
        } />
        
        {/* Ruta de login (WelcomeScreen) - se muestra cuando no hay usuario autenticado */}
        <Route path="login" element={
          <Suspense fallback={<PageLoader message="Cargando login..." />}>
            <WelcomeScreen />
          </Suspense>
        } />
        
        {/* Ruta 404 - Not Found */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#004B63] mb-4">404</h1>
              <p className="text-lg text-[#4DA8C4]">Página no encontrada</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-6 py-3 bg-[#004B63] text-white rounded-full hover:bg-[#4DA8C4] transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;