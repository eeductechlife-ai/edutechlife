import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { claimStorageForCurrentUser } from "../utils/userScopedStorage";
import { seedClientSession, decodeJwtPayload } from "../hooks/useAuthIdentity";
import { supabaseStorageKey } from "../lib/supabase";

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get all search params for debugging
        const allParams = Object.fromEntries(searchParams);
        console.log("OAuth Callback - All params:", allParams);

        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const email = searchParams.get("email");
        const error = searchParams.get("error");

        console.log("OAuth Callback - Token:", token ? "present" : "missing");
        console.log(
          "OAuth Callback - RefreshToken:",
          refreshToken ? "present" : "missing",
        );
        console.log("OAuth Callback - Email:", email);
        console.log("OAuth Callback - Error:", error);

        if (error) {
          console.error("OAuth error:", error);
          navigate(`/login?error=oauth_failed`);
          return;
        }

        if (!token || !email) {
          console.error("Missing token or email", { token: !!token, email });
          navigate("/login?error=invalid_callback");
          return;
        }

        if (!refreshToken) {
          console.warn("Missing refreshToken from OAuth callback");
        }

        // Save authentication tokens
        sessionStorage.setItem("auth_token", token);
        localStorage.setItem("user_email", email);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Pre-seed the Supabase session so the role gate's getSession() finds it
        // when /ialab mounts. This is critical for OAuth flow to work correctly.
        await seedClientSession(token, refreshToken || "");

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
    if (searchParams.toString()) {
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
