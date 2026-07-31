import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { Navigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Componente ProtectedRoute (Legacy - Mantenido para compatibilidad)
 * NOTA: El sistema principal usa RoleProtectedRoute.jsx con salvoconducto IA Lab
 * Este componente se mantiene solo para compatibilidad con código existente
 *
 * FLUJO ACTUALIZADO: Redirige a /login en lugar de / para evitar "Efecto Rebote"
 */
const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();
  // Sesion de Supabase. Con Clerk esto era siempre false y habria
  // redirigido a /login a cualquier usuario autenticado.
  const { isLoaded, isSignedIn } = useAuthIdentity();

  if (!isLoaded) {
    return <PageLoader message={t("page_loader.auth")} />;
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
