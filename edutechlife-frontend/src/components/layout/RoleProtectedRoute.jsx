import { useUser, useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

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
  const { t } = useTranslation();
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  const isFullyLoaded = userLoaded && authLoaded;

  if (!isFullyLoaded) {
    return <PageLoader message={t("page_loader.permisos")} />;
  }

  // 2. Si no está autenticado, redirigir a login
  if (!isSignedIn || !user) {
    const currentPath = window.location.pathname;
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(currentPath)}`}
        replace
      />
    );
  }

  // 3. Verificación de rol (con salvoconducto para ialab)
  // Prioridad: publicMetadata.role > unsafeMetadata.user_type (set by Clerk SignUp metadata prop) > default
  const userRole =
    user.publicMetadata?.role || user.unsafeMetadata?.user_type || "ialab";

  // Salvoconducto IA Lab - cualquier usuario autenticado puede acceder
  if (requiredRole === "ialab") {
    return children;
  }

  // Verificación para otros roles (smartboard, admin)
  if (userRole !== requiredRole) {
    const routeMap = {
      ialab: "/ialab",
      smartboard: "/smartboard",
      admin: "/admin",
    };
    return <Navigate to={routeMap[userRole] || "/ialab"} replace />;
  }

  // 4. Acceso permitido
  return children;
};

export default RoleProtectedRoute;
