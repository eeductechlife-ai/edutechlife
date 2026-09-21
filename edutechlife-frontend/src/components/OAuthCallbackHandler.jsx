import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { claimStorageForCurrentUser } from "../utils/userScopedStorage";
import { decodeJwtPayload } from "../hooks/useAuthIdentity";
import { seedClientSession } from "./SupabaseLoginForm";
import { supabaseStorageKey } from "../lib/supabase";

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // El backend entrega la sesión en el FRAGMENTO (#access_token=...),
        // que el navegador no envía al servidor (no queda en logs ni Referer).
        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, ""),
        );
        const hashToken = hashParams.get("access_token");
        const hashRefresh = hashParams.get("refresh_token");

        const error = searchParams.get("error") || hashParams.get("error");
        const email = searchParams.get("email") || hashParams.get("email");

        console.log("OAuth Callback - Received", {
          email,
          error: error || "none",
          hasHashToken: !!hashToken,
        });

        if (error) {
          console.error("OAuth error:", error);
          navigate(`/login?error=oauth_failed`);
          return;
        }

        if (!email) {
          console.error("Missing email from OAuth callback");
          navigate("/login?error=invalid_callback");
          return;
        }

        localStorage.setItem("user_email", email);

        if (hashToken) {
          // Guardar el token que usa el resto de la app y sembrar la sesión
          // de supabase-js (RoleProtectedRoute valida con getSession()).
          sessionStorage.setItem("auth_token", hashToken);
          if (hashRefresh) localStorage.setItem("refresh_token", hashRefresh);
          await seedClientSession(hashToken, hashRefresh || "");
          // Evita dejar los tokens visibles en la barra de direcciones.
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }

        // Fetch current session from the backend (uses cookies automatically)
        // This ensures the Supabase session is initialized before navigation
        try {
          const sessionRes = await fetch("/api/auth/session", {
            credentials: "include", // Send cookies
          });
          if (sessionRes.ok) {
            const session = await sessionRes.json();
            console.log("OAuth session established:", {
              user_id: session.user?.id,
              email: session.user?.email,
            });
          }
        } catch (fetchErr) {
          console.warn("Session fetch error (non-blocking):", fetchErr);
          // Continue anyway — cookies are set, they'll be used in subsequent requests
        }

        // Progress is stored per account. Claim the namespace for this user and
        // reload rather than client-side navigating, so the stores rehydrate
        // from this account's data instead of keeping the previous user's
        // in-memory state (which showed everyone the same progress).
        claimStorageForCurrentUser();
        const returnTo =
          sessionStorage.getItem("auth_return_to") === "/smartboard" ||
          (sessionStorage.getItem("auth_return_to") || "").startsWith(
            "/smartboard",
          )
            ? sessionStorage.getItem("auth_return_to")
            : "/ialab";
        sessionStorage.removeItem("auth_return_to");
        window.location.replace(returnTo);
      } catch (err) {
        console.error("Callback processing error:", err);
        navigate("/login?error=callback_failed");
      }
    };

    // Only run if we have search params
    // El flujo por fragmento llega sin query params, así que también hay que
    // ejecutar el handler cuando solo hay hash.
    if (searchParams.toString() || window.location.hash.length > 1) {
      handleCallback();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackHandler;
