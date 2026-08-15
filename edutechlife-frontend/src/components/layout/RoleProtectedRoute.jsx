import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "../LoadingScreen";
import { useTranslation } from "../../i18n/I18nProvider";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { supabase } from "../../lib/supabase";

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

  // Perfil (incluye account_type). Ya está cacheado y usado en otras partes,
  // así que no añade peticiones nuevas.
  const { profile, isAdmin, isLoading } = useStudentProfile();

  useEffect(() => {
    // Valida que el token de localStorage corresponda a una sesión Supabase
    // vigente. Evita el gate fail-open que dejaba pasar tokens inexistentes,
    // inválidos o expirados solo por existir la clave.
    const validateSession = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoaded(true);
          return;
        }
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && session.access_token) {
          // El token de localStorage debe coincidir con la sesión vigente.
          setIsAuthenticated(session.access_token === token);
        } else {
          // Sin sesión en storage pese a tener tokens: recargar una vez. La
          // carga fresca re-inicializa gotrue y encuentra la sesión que el
          // login pre-sembró (sb-...-auth-token). NO se usa
          // supabase.auth.setSession() aquí: en algunos navegadores la cadena
          // setSession → notify de onAuthStateChange no resuelve y retiene el
          // lock interno de gotrue para siempre, dejando el getSession() de
          // este gate encolado sin timeout (página eterna en
          // "Verificando permisos..."). El reload único evita el bucle.
          const alreadyRetried = sessionStorage.getItem("auth_restore_retried");
          if (!alreadyRetried) {
            sessionStorage.setItem("auth_restore_retried", "1");
            window.location.replace(window.location.pathname);
            return;
          }
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoaded(true);
      }
    };

    validateSession();
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

  // --- Gate de producto por account_type (fail-open) -----------------------
  const config = PRODUCT_ROUTES[requiredRole];
  const accountType = profile?.account_type;
  const isParent =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("user_role") === "parent";

  // Solo redirige con evidencia positiva de cruce de producto. Cualquier
  // ambigüedad (cargando, sin tipo, padre, admin) deja pasar.
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
