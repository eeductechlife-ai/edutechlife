import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/I18nProvider";
import SupabaseLoginForm from "./SupabaseLoginForm";
import SupabaseSignUpForm from "./SupabaseSignUpForm";
import SEO from "./SEO";

/**
 * Página de acceso/registro del IA Lab.
 * Por defecto muestra INICIAR SESIÓN. "Registrarse" está siempre visible como
 * un control superior y como enlace central, para no depender de un enlace
 * discreto inferior. El registro conserva su pantalla completa original.
 */
const IALabSignUpPage = ({ onBack }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/ialab";

  // Registro = pantalla completa original (no cambia su funcionamiento).
  if (mode === "register") {
    return (
      <SupabaseSignUpForm
        onBack={() => setMode("signin")}
        returnTo={returnTo}
      />
    );
  }

  return (
    <>
      <SEO
        title={t("seo.login.title")}
        description={t("seo.login.desc")}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#1a5f7a] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center mb-6">
                <img
                  src="/images/logo-edutechlife.webp"
                  alt="Edutechlife"
                  className="h-10 w-auto object-contain mb-4"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#004B63] text-center">
                  {t("welcome.signin_title")}
                </h1>
              </div>

              {/* Toggle visible Iniciar sesión / Registrarse */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-slate-100 mb-6">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    mode === "signin"
                      ? "bg-white text-[#004B63] shadow-sm"
                      : "text-slate-500 hover:text-[#004B63]"
                  }`}
                >
                  {t("welcome.signin_title")}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    mode === "register"
                      ? "bg-white text-[#004B63] shadow-sm"
                      : "text-slate-500 hover:text-[#004B63]"
                  }`}
                >
                  {t("welcome.signup_title")}
                </button>
              </div>

              <SupabaseLoginForm
                returnTo={returnTo}
                onShowSignUp={() => setMode("register")}
              />
            </div>
          </div>

          {onBack && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-white/70 hover:text-white text-sm font-medium"
              >
                ← {t("welcome.back_btn") || "Volver"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default IALabSignUpPage;
