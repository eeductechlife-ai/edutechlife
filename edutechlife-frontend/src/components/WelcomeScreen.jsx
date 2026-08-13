import { motion } from "framer-motion";
import { Brain, CheckCircle, ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "../i18n/I18nProvider";
import SEO from "./SEO";
import SupabaseSignUpForm from "./SupabaseSignUpForm";
import SupabaseLoginForm from "./SupabaseLoginForm";

const WelcomeScreen = ({ onNavigate }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const urlReturnTo = searchParams.get("returnTo");
  const storageReturnTo = sessionStorage.getItem("clerk_return_to");
  const returnTo =
    urlReturnTo || (storageReturnTo ? `/${storageReturnTo}` : "/ialab");
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "signup") {
      setIsSignUpMode(true);
    }
  }, [searchParams]);

  if (storageReturnTo) {
    sessionStorage.removeItem("clerk_return_to");
  }

  return (
    <>
      <SEO title={t("seo.login.title")} description={t("seo.login.desc")} />
      <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Brand & Info */}
            <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#004B63] via-[#00334A] to-[#4DA8C4] p-8 lg:p-12 text-white flex-col justify-between">
              <div>
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                  <img
                    src="/images/logo-edutechlife.webp"
                    alt="Edutechlife"
                    className="h-8 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Welcome Message */}
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                    <span className="text-[#66CCCC] text-xs font-semibold uppercase tracking-wider">
                      {t("welcome.badge")}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-white">
                    {t("welcome.heading")}
                  </h2>
                  <p className="text-white text-base leading-relaxed mb-4">
                    {t("welcome.description")}
                  </p>
                  <p className="text-white/80 text-sm">
                    <span className="text-[#66CCCC] font-semibold">
                      10 {t("welcome.hours")}
                    </span>{" "}
                    ·
                    <span className="text-[#66CCCC] font-semibold">
                      {" "}
                      5 {t("welcome.modules")}
                    </span>{" "}
                    ·{t("welcome.certification")}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white font-medium">
                      {t("welcome.benefit_cert")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white font-medium">
                      {t("welcome.benefit_support")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white font-medium">
                      {t("welcome.benefit_personalized")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  {t("welcome.help")}{" "}
                  <a
                    href="mailto:info@edutechlife.co"
                    className="text-white hover:underline"
                  >
                    info@edutechlife.co
                  </a>
                </p>
              </div>
            </div>

            {/* Right Side - Authentication */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-12 bg-white">
              {/* Form Header */}
              <div className="mb-8 text-center">
                <div className="md:hidden mb-4 flex justify-center">
                  <img
                    src="/images/logo-edutechlife.webp"
                    alt="Edutechlife"
                    className="h-9 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#004B63] mb-2">
                  {isSignUpMode
                    ? t("welcome.signup_title")
                    : t("welcome.signin_title")}
                </h3>
                <p className="text-[#4DA8C4] text-base max-w-md mx-auto">
                  {isSignUpMode
                    ? t("welcome.signup_subtitle")
                    : t("welcome.signin_subtitle")}
                </p>
              </div>

              {/* Auth Form */}
              <div className="w-full">
                {isSignUpMode ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsSignUpMode(false)}
                      className="inline-flex items-center gap-2 text-[#004B63] hover:text-[#0A3550] font-medium mb-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("welcome.back_to_signin")}
                    </button>
                    <SupabaseSignUpForm
                      onBack={() => setIsSignUpMode(false)}
                      returnTo={returnTo}
                    />
                  </div>
                ) : (
                  <SupabaseLoginForm returnTo={returnTo} />
                )}
              </div>

              {/* Back to IA Lab Academic Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  onClick={() => navigate("/ialab-academic")}
                  whileHover={{ scale: 1.03, x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#004B63]/25 text-[#004B63] font-semibold text-sm rounded-xl hover:bg-[#004B63]/5 hover:border-[#004B63]/40 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m0 0l11 11"
                    />
                  </svg>
                  {t("welcome.back_btn")}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomeScreen;
