import { lazy, Suspense, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { track } from "../lib/analytics";
import AppLayout from "../components/layout/AppLayout";
import AuthRouter from "./auth-router";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleProtectedRoute from "../components/layout/RoleProtectedRoute";
import { PageLoader, SkeletonLoader } from "../components/LoadingScreen";
import { useTranslation } from "../i18n/I18nProvider";

// Lazy load para componentes pesados
const LandingPage = lazy(() => import("../components/pages/LandingPage"));
const WelcomeScreen = lazy(() => import("../components/WelcomeScreen"));
const OAuthCallbackHandler = lazy(
  () => import("../components/OAuthCallbackHandler"),
);
const ResetPasswordPage = lazy(() => import("../components/ResetPasswordPage"));
const IALabSignUpPage = lazy(() => import("../components/IALabSignUpPage"));
const SmartBoardSignUpPage = lazy(
  () => import("../components/SmartBoardSignUpPage"),
);
const AILabPage = lazy(() => import("../components/pages/AILabPage"));
const SmartBoardPage = lazy(() => import("../components/pages/SmartBoardPage"));
const SmartBoardLandingPage = lazy(
  () => import("../components/pages/SmartBoardLandingPage"),
);
const SmartBoardKidsDashboard = lazy(
  () => import("../components/kids-dashboard/SmartBoardKidsDashboard"),
);
const NotFoundPage = lazy(() => import("../components/pages/NotFoundPage"));
const AdminPage = lazy(() => import("../components/pages/AdminPage"));
const NeuroEntornoPage = lazy(
  () => import("../components/pages/NeuroEntornoPage"),
);
const ProyectosNacionalPage = lazy(
  () => import("../components/pages/ProyectosNacionalPage"),
);
const ConsultoriaPage = lazy(
  () => import("../components/pages/ConsultoriaPage"),
);
const ConsultoriaB2BPage = lazy(
  () => import("../components/pages/ConsultoriaB2BPage"),
);
const AutomationArchitectPage = lazy(
  () => import("../components/pages/AutomationArchitectPage"),
);
const VAKDiagnosisPage = lazy(
  () => import("../components/pages/VAKDiagnosisPage"),
);
const IALabProLandingPage = lazy(
  () => import("../components/pages/IALabProLandingPage"),
);
const SmartBoardInfoPage = lazy(
  () => import("../components/pages/SmartBoardInfoPage"),
);
const SmartBoardParentDashboard = lazy(
  () => import("../components/pages/smartBoardParentDashboard"),
);
const SmartBoardStatsPage = lazy(
  () => import("../components/pages/SmartBoardStatsPage"),
);
const SmartBoardConsentGate = lazy(
  () => import("../components/kids-dashboard/SmartBoardConsentGate"),
);
const SmartBoardLogin = lazy(() => import("../pages/SmartBoardLogin"));
const IALabDashboard = lazy(() => import("../components/IALab/IALabDashboard"));
const PublicProfilePage = lazy(
  () => import("../components/userProfilePublic/PublicProfilePage"),
);
import SectionErrorBoundary from "../components/IALab/SectionErrorBoundary";
import IALabSkeleton from "../components/skeletons/IALabSkeleton";
import SmartBoardSkeleton from "../components/skeletons/SmartBoardSkeleton";
import VAKSkeleton from "../components/skeletons/VAKSkeleton";

// Componente wrapper para IALabSignUpPage que maneja navegación
const IALabSignUpPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/ialab";

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
    const returnTo = searchParams.get("returnTo") || "/ialab";

    let targetSignUp = "/sign-up/ialab";

    if (returnTo === "/smartboard" || returnTo.startsWith("/smartboard/")) {
      targetSignUp = "/sign-up/smartboard";
    }

    navigate(`${targetSignUp}?returnTo=${encodeURIComponent(returnTo)}`, {
      replace: true,
    });
  }, [navigate, location]);

  return <PageLoader message={t("page_loader.redirect")} />;
};
/**
 * Configuración de rutas principales de la aplicación
 *
 * Estructura:
 * - Rutas públicas: /, /neuroentorno, /proyectos, etc.
 * - Rutas protegidas: /ialab, /smartboard, /admin (requieren autenticación + rol)
 * - Rutas de autenticación: /auth-router (redirección inteligente)
 */
const PlanesPage = lazy(() => import("../components/pages/PlanesPage"));

const AppRoutes = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    track("page_view", { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    const match = location.pathname.match(/^\/ialab\/(\d+)$/);
    if (match) {
      track("course_start", { moduleId: parseInt(match[1], 10) });
    }
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("checkout") === "success") {
      track("checkout_completed", {});
    } else if (params.get("checkout") === "cancelled") {
      track("checkout_cancelled", {});
    }
  }, [location.search]);

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<SkeletonLoader type="hero" />}>
              <LandingPage />
            </Suspense>
          }
        />

        <Route path="auth-router" element={<AuthRouter />} />

        <Route
          path="neuroentorno"
          element={
            <Suspense
              fallback={<PageLoader message={t("page_loader.neuro")} />}
            >
              <NeuroEntornoPage />
            </Suspense>
          }
        />

        <Route
          path="proyectos"
          element={
            <Suspense
              fallback={<PageLoader message={t("page_loader.projects")} />}
            >
              <ProyectosNacionalPage />
            </Suspense>
          }
        />

        <Route
          path="consultoria"
          element={
            <Suspense
              fallback={<PageLoader message={t("page_loader.consulting")} />}
            >
              <ConsultoriaPage />
            </Suspense>
          }
        />

        <Route
          path="consultoria-b2b"
          element={
            <Suspense
              fallback={<PageLoader message={t("page_loader.consulting")} />}
            >
              <ConsultoriaB2BPage />
            </Suspense>
          }
        />

        <Route
          path="automation"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <AutomationArchitectPage />
            </Suspense>
          }
        />

        <Route
          path="vak"
          element={
            <Suspense fallback={<VAKSkeleton />}>
              <VAKDiagnosisPage variant="premium" />
            </Suspense>
          }
        />

        <Route
          path="vak-simple"
          element={
            <Suspense fallback={<VAKSkeleton />}>
              <VAKDiagnosisPage variant="simple" />
            </Suspense>
          }
        />

        <Route
          path="vak-premium"
          element={
            <Suspense fallback={<VAKSkeleton />}>
              <VAKDiagnosisPage variant="premium" />
            </Suspense>
          }
        />

        <Route
          path="ialab-academic"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <IALabProLandingPage />
            </Suspense>
          }
        />
        <Route
          path="ialab-pro"
          element={<Navigate to="/ialab-academic" replace />}
        />

        <Route
          path="conoce-smartboard"
          element={
            <SectionErrorBoundary name="SmartBoardInfo">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <SmartBoardInfoPage />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="planes"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <PlanesPage />
            </Suspense>
          }
        />

        <Route
          path="smartboard"
          element={
            <SectionErrorBoundary name="SmartBoardLanding">
              <Suspense fallback={<SmartBoardSkeleton />}>
                <SmartBoardLandingPage />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="smartboard/consent"
          element={
            <SectionErrorBoundary name="SmartBoardConsentGate">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <SmartBoardConsentGate />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="smartboard/login"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <SmartBoardLogin />
            </Suspense>
          }
        />

        <Route
          path="smartboard/padres"
          element={
            <SectionErrorBoundary name="SmartBoardParentDashboard">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <SmartBoardParentDashboard />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="ialab"
          element={
            <RoleProtectedRoute requiredRole="ialab">
              <Suspense fallback={<IALabSkeleton />}>
                <IALabDashboard />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="ialab/:moduleId"
          element={
            <RoleProtectedRoute requiredRole="ialab">
              <Suspense fallback={<IALabSkeleton />}>
                <AILabPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="smartboard/app"
          element={
            <RoleProtectedRoute requiredRole="smartboard">
              <SectionErrorBoundary name="SmartBoardApp">
                <Suspense fallback={<SmartBoardSkeleton />}>
                  <SmartBoardPage />
                </Suspense>
              </SectionErrorBoundary>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<SkeletonLoader type="card" />}>
                <AdminPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="smartboard/estadisticas"
          element={
            <RoleProtectedRoute requiredRole="smartboard">
              <SectionErrorBoundary name="SmartBoardStats">
                <Suspense fallback={<SmartBoardSkeleton />}>
                  <SmartBoardStatsPage />
                </Suspense>
              </SectionErrorBoundary>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="sign-up/ialab"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <IALabSignUpPageWrapper />
            </Suspense>
          }
        />

        <Route
          path="sign-up/smartboard"
          element={
            <SectionErrorBoundary name="SmartBoardSignUp">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <SmartBoardSignUpPageWrapper />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="sign-up"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <GenericSignUpRedirect />
            </Suspense>
          }
        />

        <Route
          path="login"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <WelcomeScreen />
            </Suspense>
          }
        />

        <Route
          path="auth/callback"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <OAuthCallbackHandler />
            </Suspense>
          }
        />

        <Route
          path="auth/reset-password"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />

        <Route
          path="profile/:userId"
          element={
            <Suspense fallback={<IALabSkeleton />}>
              <PublicProfilePage />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
