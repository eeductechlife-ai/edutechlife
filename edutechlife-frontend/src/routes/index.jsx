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
import { AdminRoute } from "../components/AdminRoute";
import { PageLoader, SkeletonLoader } from "../components/LoadingScreen";
import { useTranslation } from "../i18n/I18nProvider";
import IngenIALoginRedirect from "../components/IngenIALoginRedirect";

// Lazy load para componentes pesados
const LandingPage = lazy(() => import("../components/pages/LandingPage"));
const WelcomeScreen = lazy(() => import("../components/WelcomeScreen"));
const OAuthCallbackHandler = lazy(
  () => import("../components/OAuthCallbackHandler"),
);
const ResetPasswordPage = lazy(() => import("../components/ResetPasswordPage"));
const IngenIASignUpPage = lazy(() => import("../components/IngenIASignUpPage"));
const AILabPage = lazy(() => import("../components/pages/AILabPage"));
const DevIngenIAPreview = import.meta.env.DEV
  ? lazy(() => import("../dev/DevIngenIAPreview"))
  : null;
const DevIngenIAParentPreview = import.meta.env.DEV
  ? lazy(() => import("../dev/DevIngenIAParentPreview"))
  : null;
const IngenIALandingPage = lazy(
  () => import("../components/pages/IngenIALandingPage"),
);
const IngenIAKidsDashboard = lazy(
  () => import("../components/kids-dashboard/IngenIAKidsDashboard"),
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
const IngenIAInfoPage = lazy(
  () => import("../components/pages/IngenIAInfoPage"),
);
const IngenIAParentDashboard = lazy(
  () => import("../components/pages/ingenIAParentDashboard"),
);
const IngenIAStatsPage = lazy(
  () => import("../components/pages/IngenIAStatsPage"),
);
const IngenIAConsentGate = lazy(
  () => import("../components/kids-dashboard/IngenIAConsentGate"),
);
const IngenIALogin = lazy(() => import("../pages/IngenIALogin"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const CourseHome = lazy(() => import("../components/IALab/CourseHome"));
const PublicProfilePage = lazy(
  () => import("../components/userProfilePublic/PublicProfilePage"),
);
const CertificateVerificationPage = lazy(
  () => import("../components/pages/CertificateVerificationPage"),
);
import SectionErrorBoundary from "../components/IALab/SectionErrorBoundary";
import IALabSkeleton from "../components/skeletons/IALabSkeleton";
import { IALabProvider } from "../context/IALabContext";
import IngenIASkeleton from "../components/skeletons/IngenIASkeleton";
import VAKSkeleton from "../components/skeletons/VAKSkeleton";

// /sign-up/ialab e /login apuntaban a dos pantallas de login distintas
// (una desde el Header, otra desde ProtectedRoute/catálogo de cursos), lo que
// mostraba un diseño diferente según por dónde entrara el usuario. Se unifica
// todo en WelcomeScreen (montado en /login) y esta ruta redirige preservando
// returnTo, para no romper enlaces o bookmarks existentes a /sign-up/ialab.
const IALabSignUpRedirect = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/ialab";
  return (
    <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />
  );
};

const IngenIASignUpPageWrapper = () => <IngenIASignUpPage />;

// SmartBoard was renamed to IngenIA; old links and bookmarks still point here.
const LegacySmartboardRedirect = () => {
  const { pathname, search } = useLocation();
  const target = pathname.replace(/smartboard/, "ingenia");
  return <Navigate to={`${target}${search}`} replace />;
};

// Componente para redirección inteligente de registro
const GenericSignUpRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get("returnTo") || "/ialab";

    let targetSignUp = "/sign-up/ialab";

    if (returnTo === "/ingenia" || returnTo.startsWith("/ingenia/")) {
      targetSignUp = "/sign-up/ingenia";
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
 * - Rutas protegidas: /ialab, /ingenia, /admin (requieren autenticación + rol)
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
      track("subscription_started", {});
    } else if (params.get("checkout") === "cancelled") {
      track("checkout_cancelled", {});
      track("subscription_cancelled", {});
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
          path="conoce-ingenia"
          element={
            <SectionErrorBoundary name="IngenIAInfo">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <IngenIAInfoPage />
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
          path="ingenia"
          element={
            <SectionErrorBoundary name="IngenIALanding">
              <Suspense fallback={<IngenIASkeleton />}>
                <IngenIALandingPage />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route
          path="ingenia/consent"
          element={
            <SectionErrorBoundary name="IngenIAConsentGate">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <IngenIAConsentGate />
              </Suspense>
            </SectionErrorBoundary>
          }
        />

        <Route path="ingenia/login" element={<IngenIALoginRedirect />} />

        <Route path="smartboard/*" element={<LegacySmartboardRedirect />} />
        <Route
          path="sign-up/smartboard"
          element={<LegacySmartboardRedirect />}
        />
        <Route
          path="conoce-smartboard"
          element={<LegacySmartboardRedirect />}
        />

        {DevIngenIAPreview && (
          <Route
            path="dev/ingenia"
            element={
              <Suspense fallback={<IngenIASkeleton />}>
                <DevIngenIAPreview />
              </Suspense>
            }
          />
        )}

        {DevIngenIAParentPreview && (
          <Route
            path="dev/ingenia/padres"
            element={
              <Suspense fallback={<IngenIASkeleton />}>
                <DevIngenIAParentPreview />
              </Suspense>
            }
          />
        )}

        <Route
          path="ingenia/padres"
          element={
            <RoleProtectedRoute requiredRole="smartboard">
              <SectionErrorBoundary name="IngenIAParentDashboard">
                <Suspense fallback={<IngenIASkeleton />}>
                  <IngenIAParentDashboard />
                </Suspense>
              </SectionErrorBoundary>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="ialab"
          element={
            <RoleProtectedRoute requiredRole="ialab">
              <Suspense fallback={<IALabSkeleton />}>
                <IALabProvider>
                  <CourseHome />
                </IALabProvider>
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
          path="admin/login"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          path="admin/dashboard"
          element={
            <AdminRoute>
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <AdminDashboard />
              </Suspense>
            </AdminRoute>
          }
        />

        <Route
          path="ingenia/estadisticas"
          element={
            <RoleProtectedRoute requiredRole="smartboard">
              <SectionErrorBoundary name="IngenIAStats">
                <Suspense fallback={<IngenIASkeleton />}>
                  <IngenIAStatsPage />
                </Suspense>
              </SectionErrorBoundary>
            </RoleProtectedRoute>
          }
        />

        <Route path="sign-up/ialab" element={<IALabSignUpRedirect />} />

        <Route
          path="sign-up/ingenia"
          element={
            <SectionErrorBoundary name="IngenIASignUp">
              <Suspense fallback={<PageLoader message={t("common.loading")} />}>
                <IngenIASignUpPageWrapper />
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
          path="verificar/:certNumber"
          element={
            <Suspense fallback={<PageLoader message={t("common.loading")} />}>
              <CertificateVerificationPage />
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
