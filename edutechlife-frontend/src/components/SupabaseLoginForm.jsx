import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import FloatingParticles from "./FloatingParticles";
import { claimStorageForCurrentUser } from "../utils/userScopedStorage";

const SupabaseLoginForm = ({ returnTo = "/ialab" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleOAuthLogin = (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const redirectUri = `${window.location.origin}/auth/callback`;
    const isDevelopment = apiUrl.includes("localhost");
    const endpoint = isDevelopment
      ? `/api/auth/oauth-demo/${provider}`
      : `/api/auth/oauth/${provider}`;
    window.location.href = `${apiUrl}${endpoint}?redirect_uri=${encodeURIComponent(redirectUri)}&provider=${provider}`;
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(t("login.error.email_required_for_reset"));
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      // Always show the same message: never reveal whether the email exists.
      setInfo(t("login.reset_email_sent"));
    } catch (err) {
      console.error("Reset request error:", err);
      setError(t("login.error.connection"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "oauth_account") {
          const provider = data.provider === "facebook" ? "Facebook" : "Google";
          setError(t("login.error.oauth_account", { provider }));
          setLoading(false);
          return;
        }
        const key =
          data.error === "email_not_confirmed"
            ? "login.error.email_not_confirmed"
            : "login.error.invalid_credentials";
        setError(t(key) || data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_email", data.email);

      // Claim storage for current user (creates isolated namespace)
      // Token is now in localStorage; useAuthIdentity will read it on next render
      claimStorageForCurrentUser();

      // Use client-side navigation instead of hard reload
      // Preserves browser cache, avoids re-parsing bundles, faster than window.location.replace()
      // Store subscriptions will rehydrate automatically via Zustand persist middleware
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(t("login.error.connection") || "Connection error");
      console.error("Login error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {info && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
          {info}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <button
          onClick={() => handleOAuthLogin("facebook")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-white text-gray-500">O</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("login.email_or_username")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            {/* type="text", not "email": the field also accepts a username. */}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.email_or_username_placeholder")}
              autoComplete="username"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B63] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("login.password") || "Contraseña"}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B63] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            className="text-xs text-[#004B63] hover:text-[#0A3550] hover:underline disabled:opacity-50"
          >
            {t("login.forgot_password")}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#004B63] hover:bg-[#0A3550] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading
            ? t("login.button.signing_in") || "Iniciando sesión..."
            : t("login.button.signin") || "Iniciar Sesión"}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center text-sm text-gray-600">
        {t("login.no_account") || "¿No tienes cuenta?"}{" "}
        <button
          onClick={() => navigate("/sign-up/smartboard")}
          className="text-[#004B63] hover:text-[#0A3550] font-semibold"
        >
          {t("login.signup_link") || "Regístrate aquí"}
        </button>
      </div>
    </div>
  );
};

export default SupabaseLoginForm;
