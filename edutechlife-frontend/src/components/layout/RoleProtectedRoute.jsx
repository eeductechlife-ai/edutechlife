import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { supabase } from "../../lib/supabase";
import { API_BASE_URL as API_BASE } from "../../config/api";

/**
 * Componente RoleProtectedRoute - Patrón simplificado con Supabase Auth
 *
 * 1. Valida que exista una sesión Supabase real (token vigente). Si no,
 *    redirige a /login?returnTo=currentPath.
 * 2. Separa productos por `account_type` (IALab 16+ vs SmartBoard 6–16):
 *    una cuenta de un producto no debe entrar al dashboard del otro.
 *
 * El gate de producto es FAIL-OPEN por diseño — nunca bloquea a un usuario
 * legítimo:
 *   - Perfil aún cargando → deja pasar.
 *   - Cuentas sin `account_type` (usuarios previos a la migración 028, o BD
 *     sin migrar) → dejan pasar.
 *   - Padres (user_role='parent') y admins → dejan pasar.
 *   - Solo redirige cuando el `account_type` es conocido y es el OPUESTO al
 *     producto de la ruta, con redirección suave (Navigate), nunca un error.
 */

// Producto esperado por cada requiredRole y a dónde enviar si no coincide.
const PRODUCT_ROUTES = {
  ialab: { expected: "ialab", redirectTo: "/smartboard" },
  smartboard: { expected: "smartboard", redirectTo: "/ialab" },
};

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verifiedRole, setVerifiedRole] = useState(null);

  const { profile, isAdmin, isLoading } = useStudentProfile();

  useEffect(() => {
    // Valida que el token de sessionStorage corresponda a una sesión Supabase vigente.
    // En desarrollo, confiamos directamente en el token si existe.
    // En producción, validamos con supabase.auth.getSession().
    const validateSession = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoaded(true);
          return;
        }

        // En desarrollo, confiar en el token de sessionStorage directamente
        if (import.meta.env.DEV) {
          setIsAuthenticated(true);
          setIsLoaded(true);
          return;
        }

        // En producción, validar con Supabase
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Session validation timeout")),
            3000,
          ),
        );

        const {
          data: { session },
        } = await Promise.race([supabase.auth.getSession(), timeoutPromise]);

        if (session?.user) {
          setIsAuthenticated(true);
          if (session.access_token && session.access_token !== token) {
            sessionStorage.setItem("auth_token", session.access_token);
          }
        } else {
          const alreadyRetried = sessionStorage.getItem("auth_restore_retried");
          if (!alreadyRetried) {
            sessionStorage.setItem("auth_restore_retried", "1");
            window.location.replace(window.location.pathname);
            return;
          }
          setIsAuthenticated(false);
        }
      } catch {
        // En desarrollo, si algo falla, confiar en el token
        if (import.meta.env.DEV && sessionStorage.getItem("auth_token")) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    validateSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isLoaded) return;
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;
    fetch(`${API_BASE}/api/smartboard/user-role`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.role) setVerifiedRole(data.role);
      })
      .catch(() => {});
  }, [isAuthenticated, isLoaded]);

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

  const config = PRODUCT_ROUTES[requiredRole];
  const accountType = profile?.account_type;
  const isParent = verifiedRole === "parent";

  if (
    config &&
    !isLoading &&
    !isAdmin &&
    !isParent &&
    accountType &&
    accountType !== config.expected
  ) {
    return <Navigate to={config.redirectTo} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
