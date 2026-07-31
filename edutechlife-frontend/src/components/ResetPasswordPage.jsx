import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import FloatingParticles from "./FloatingParticles";

/**
 * ResetPasswordPage — landing for the Supabase password-recovery email.
 *
 * Supabase appends the recovery tokens to the URL fragment
 * (#access_token=...&type=recovery), so they never reach the server.
 * We read them client-side and call Supabase's user-update endpoint directly
 * with the recovery access token as the bearer credential.
 */
const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Read the recovery token synchronously on first render. Doing this in an
  // effect breaks under StrictMode: the first pass clears the hash, and the
  // second pass then finds no token and wrongly reports an invalid link.
  const [accessToken] = useState(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    return new URLSearchParams(hash).get("access_token");
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    accessToken ? "" : t("reset.error.link_invalid"),
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Strip the tokens from the address bar once we have captured them.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("signup.error.password_min_length"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("reset.error.passwords_mismatch"));
      return;
    }
    if (!accessToken) {
      setError(t("reset.error.link_invalid"));
      return;
    }

    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) {
        setError(t("reset.error.failed"));
        setLoading(false);
        return;
      }

      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.msg || data.message || t("reset.error.failed"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(t("login.error.connection"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#1a5f7a] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#004B63] mb-2">
                {t("reset.success_title")}
              </h1>
              <p className="text-gray-600 text-sm">
                {t("reset.success_message")}
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#004B63] mb-2 text-center">
                {t("reset.title")}
              </h1>
              <p className="text-gray-600 text-sm mb-6 text-center">
                {t("reset.subtitle")}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reset.new_password")}
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
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={t("reset.toggle_password")}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reset.confirm_password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B63] focus:border-transparent"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !accessToken}
                  className="w-full bg-[#004B63] hover:bg-[#0A3550] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? t("reset.saving") : t("reset.submit")}
                </button>
              </form>

              <div className="text-center mt-5">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-[#004B63] hover:text-[#0A3550] font-semibold hover:underline"
                >
                  {t("reset.back_to_login")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
