import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthRouter from './auth-router';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute';
import { PageLoader } from '../components/LoadingScreen';
import { useTranslation } from '../i18n/I18nProvider';

// Lazy load para componentes pesados
const LandingPage = lazy(() => import('../components/pages/LandingPage'));
const WelcomeScreen = lazy(() => import('../components/WelcomeScreen'));
const IALabSignUpPage = lazy(() => import('../components/IALabSignUpPage'));
const SmartBoardSignUpPage = lazy(() => import('../components/SmartBoardSignUpPage'));
const AILabPage = lazy(() => import('../components/pages/AILabPage'));
const SmartBoardPage = lazy(() => import('../components/pages/SmartBoardPage'));
const SmartBoardLandingPage = lazy(() => import('../components/pages/SmartBoardLandingPage'));
const SmartBoardKidsDashboard = lazy(() => import('../components/kids-dashboard/SmartBoardKidsDashboard'));
const NotFoundPage = lazy(() => import('../components/pages/NotFoundPage'));
const AdminPage = lazy(() => import('../components/pages/AdminPage'));
const NeuroEntornoPage = lazy(() => import('../components/pages/NeuroEntornoPage'));
const ProyectosNacionalPage = lazy(() => import('../components/pages/ProyectosNacionalPage'));
const ConsultoriaPage = lazy(() => import('../components/pages/ConsultoriaPage'));
const ConsultoriaB2BPage = lazy(() => import('../components/pages/ConsultoriaB2BPage'));
const AutomationArchitectPage = lazy(() => import('../components/pages/AutomationArchitectPage'));
const VAKDiagnosisPage = lazy(() => import('../components/pages/VAKDiagnosisPage'));
const IALabProLandingPage = lazy(() => import('../components/pages/IALabProLandingPage'));
const SmartBoardInfoPage = lazy(() => import('../components/pages/SmartBoardInfoPage'));
const SmartBoardParentDashboard = lazy(() => import('../components/pages/SmartBoardParentDashboard'));
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

const SmartBoardSignUpPageWrapper = () => <SmartBoardSignUpPage />;

// Componente para redirección inteligente de registro
const GenericSignUpRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo') || '/ialab';
    
    let targetSignUp = '/sign-up/ialab';
    
    if (returnTo === '/smartboard' || returnTo.startsWith('/smartboard/')) {
      targetSignUp = '/sign-up/smartboard';
    }
    
    navigate(`${targetSignUp}?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
  }, [navigate, location]);
  
  return <PageLoader message={t('page_loader.redirect')} />;
};
/**
 * Configuración de rutas principales de la aplicación
 * 
 * Estructura:
 * - Rutas públicas: /, /neuroentorno, /proyectos, etc.
 * - Rutas protegidas: /ialab, /smartboard, /admin (requieren autenticación + rol)
 * - Rutas de autenticación: /auth-router (redirección inteligente)
 */
const AppRoutes = () => {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <LandingPage />
          </Suspense>
        } />
        
        <Route path="auth-router" element={<AuthRouter />} />
        
        <Route path="neuroentorno" element={
          <Suspense fallback={<PageLoader message={t('page_loader.neuro')} />}>
            <NeuroEntornoPage />
          </Suspense>
        } />
        
        <Route path="proyectos" element={
          <Suspense fallback={<PageLoader message={t('page_loader.projects')} />}>
            <ProyectosNacionalPage />
          </Suspense>
        } />
        
        <Route path="consultoria" element={
          <Suspense fallback={<PageLoader message={t('page_loader.consulting')} />}>
            <ConsultoriaPage />
          </Suspense>
        } />
        
        <Route path="consultoria-b2b" element={
          <Suspense fallback={<PageLoader message={t('page_loader.consulting')} />}>
            <ConsultoriaB2BPage />
          </Suspense>
        } />
        
        <Route path="automation" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <AutomationArchitectPage />
          </Suspense>
        } />
        
        <Route path="vak" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <VAKDiagnosisPage variant="premium" />
          </Suspense>
        } />
        
        <Route path="vak-simple" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <VAKDiagnosisPage variant="simple" />
          </Suspense>
        } />
        
        <Route path="vak-premium" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <VAKDiagnosisPage variant="premium" />
          </Suspense>
        } />
        
        <Route path="ialab-academic" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <IALabProLandingPage />
          </Suspense>
        } />
        <Route path="ialab-pro" element={<Navigate to="/ialab-academic" replace />} />
        
        <Route path="conoce-smartboard" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <SmartBoardInfoPage />
          </Suspense>
        } />

        <Route path="smartboard" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <SmartBoardLandingPage />
          </Suspense>
        } />
        
        <Route path="smartboard/padres" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <SmartBoardParentDashboard />
          </Suspense>
        } />
        
        <Route path="ialab/:moduleId?" element={
          <RoleProtectedRoute requiredRole="ialab">
            <Suspense fallback={<PageLoader message={t('page_loader.ailab')} />}>
              <AILabPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="smartboard/app" element={
          <RoleProtectedRoute requiredRole="smartboard">
            <Suspense fallback={<PageLoader message={t('common.loading')} />}>
              <SmartBoardPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="admin" element={
          <RoleProtectedRoute requiredRole="admin">
            <Suspense fallback={<PageLoader message={t('common.loading')} />}>
              <AdminPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="smartboard/estadisticas" element={
          <RoleProtectedRoute requiredRole="smartboard">
            <Suspense fallback={<PageLoader message={t('common.loading')} />}>
              <SmartBoardStatsPage />
            </Suspense>
          </RoleProtectedRoute>
        } />
        
        <Route path="sign-up/ialab" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <IALabSignUpPageWrapper />
          </Suspense>
        } />
        
        <Route path="sign-up/smartboard" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <SmartBoardSignUpPageWrapper />
          </Suspense>
        } />
        
        <Route path="sign-up" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <GenericSignUpRedirect />
          </Suspense>
        } />
        
        <Route path="login" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <WelcomeScreen />
          </Suspense>
        } />
        
        <Route path="*" element={
          <Suspense fallback={<PageLoader message={t('common.loading')} />}>
            <NotFoundPage />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;