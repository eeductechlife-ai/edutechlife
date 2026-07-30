import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Componente RoleProtectedRoute - Patrón simplificado con Supabase Auth
 *
 * Verifica si el usuario tiene un token de autenticación en localStorage.
 * Si no, redirige a /login?returnTo=currentPath
 */
const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for auth token in localStorage
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <PageLoader message={t("page_loader.permisos")} />;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(currentPath)}`}
        replace
      />
    );
  }

  // Salvoconducto IA Lab - cualquier usuario autenticado puede acceder
  if (requiredRole === "ialab") {
    return children;
  }

  // Para otros roles, permitir acceso (en el futuro se puede agregar verificación de rol)
  return children;
};

export default RoleProtectedRoute;
