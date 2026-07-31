import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  Lock,
  Mail,
  User,
  Phone,
} from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import FloatingParticles from "./FloatingParticles";
import { sanitize } from "../utils/sanitize";
import SEO from "./SEO";

const SupabaseSignUpForm = ({ onBack, returnTo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const defaultReturnTo = returnTo || "/ialab";
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Password strength indicator
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: "", color: "bg-gray-300" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*]/.test(pwd)) score++;

    const levels = [
      { score: 0, label: "", color: "bg-gray-300" },
      {
        score: 1,
        label: t("signup.password_weak") || "Débil",
        color: "bg-red-500",
      },
      {
        score: 2,
        label: t("signup.password_fair") || "Regular",
        color: "bg-orange-500",
      },
      {
        score: 3,
        label: t("signup.password_good") || "Buena",
        color: "bg-yellow-500",
      },
      {
        score: 4,
        label: t("signup.password_strong") || "Fuerte",
        color: "bg-green-500",
      },
      {
        score: 5,
        label: t("signup.password_very_strong") || "Muy fuerte",
        color: "bg-emerald-500",
      },
    ];

    return levels[Math.min(score, 5)];
  }, [formData.password, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName =
          t("signup.error.first_name_required") || "Required";
      if (!formData.lastName.trim())
        newErrors.lastName = t("signup.error.last_name_required") || "Required";
      if (!formData.email.trim())
        newErrors.email = t("signup.error.email_required") || "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = t("signup.error.invalid_email") || "Invalid email";
    } else if (step === 2) {
      if (!formData.username.trim())
        newErrors.username = t("signup.error.username_required") || "Required";
      if (!formData.password)
        newErrors.password = t("signup.error.password_required") || "Required";
      else if (formData.password.length < 8)
        newErrors.password =
          t("signup.error.password_min_length") || "At least 8 characters";
      if (formData.phone.trim() && !/^[\d\s+()/-]{7,}$/.test(formData.phone))
        newErrors.phone = t("signup.error.phone_invalid") || "Invalid phone";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleOAuthSignUp = (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const redirectUri = `${window.location.origin}/auth/callback`;
    const isDevelopment = apiUrl.includes("localhost");
    const endpoint = isDevelopment
      ? `/api/auth/oauth-demo/${provider}`
      : `/api/auth/oauth/${provider}`;
    window.location.href = `${apiUrl}${endpoint}?redirect_uri=${encodeURIComponent(redirectUri)}&provider=${provider}`;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    setLoading(true);
    setError("");

    try {
      const registerResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            phone_number: formData.phone || null,
            user_type: "adult",
            platform: "ialab",
            age_range: "18+",
            registration_source: "ialab_signup",
          }),
        },
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        // Handle duplicate email with translated message
        if (
          registerResponse.status === 409 ||
          errorData.error === "email_already_registered"
        ) {
          throw new Error(t("signup.error.email_already_registered"));
        }
        throw new Error(
          errorData.message ||
            errorData.error ||
            t("signup.error.registration_failed"),
        );
      }

      const result = await registerResponse.json();
      setSuccess(true);

      setTimeout(() => {
        if (result.access_token) {
          localStorage.setItem("auth_token", result.access_token);
        }
        navigate(defaultReturnTo);
      }, 2000);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(
        err.message ||
          t("signup.error.registration_failed") ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid =
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <>
      <SEO
        title={t("seo.signup_ialab.title")}
        description={t("seo.signup_ialab.desc")}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#1a5f7a] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t("ialab.signup_back_to_login")}
          </span>
        </button>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {!success ? (
              <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-auto">
                {/* Left Side - Brand & Benefits */}
                {/* pt is oversized on purpose: the "back to login" button is
                    absolutely positioned at top-6/left-6 and would otherwise
                    sit on top of the logo. */}
                <div className="lg:w-2/5 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] px-8 pt-24 pb-8 lg:px-12 lg:pt-28 lg:pb-12 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div
                      style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%)`,
                        backgroundSize: "50px 50px",
                      }}
                      className="absolute inset-0"
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Brain className="w-7 h-7" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">Edutechlife</h1>
                        <p className="text-white/80 text-sm">
                          {t("ialab.signup_subtitle")}
                        </p>
                      </div>
                    </div>

                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-6">
                        {t("ialab.signup_welcome_title")}
                      </h2>
                      <p
                        className="text-white/90 leading-relaxed mb-4 text-lg"
                        dangerouslySetInnerHTML={{
                          __html: sanitize(t("ialab.signup_welcome_desc")),
                        }}
                      />
                      <p className="text-white/70 italic">
                        {t("ialab.signup_welcome_quote")}
                      </p>
                    </div>

                    {/* Features with Icons */}
                    <div className="space-y-4">
                      {[
                        { icon: Zap, text: t("ialab.signup_feature_1") },
                        {
                          icon: CheckCircle2,
                          text: t("ialab.signup_feature_2"),
                        },
                        { icon: Brain, text: t("ialab.signup_feature_3") },
                      ].map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <feature.icon className="w-5 h-5" />
                          </div>
                          <span className="text-white/90">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
                    <p className="text-white/70 text-sm">
                      {t("ialab.signup_have_account")}{" "}
                      <button
                        onClick={onBack}
                        className="text-white hover:underline font-semibold"
                      >
                        {t("ialab.signup_login_here")}
                      </button>
                    </p>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-medium text-[#004B63]">
                        {currentStep === 1
                          ? t("signup.step_1_info") || "Información personal"
                          : t("signup.step_2_security") || "Seguridad"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Paso {currentStep}/2
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 2) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-gap-3 animate-in fade-in">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Step 0: Welcome - Quick OAuth */}
                  {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in">
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-[#004B63] mb-2">
                          Bienvenido
                        </h3>
                        <p className="text-gray-600">
                          Ingresa rápidamente a tu cuenta con las opciones
                          disponibles
                        </p>
                      </div>

                      {/* OAuth Buttons - Primary */}
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => handleOAuthSignUp("google")}
                          className="w-full px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#004B63] transition-all duration-300 font-semibold text-gray-800 flex items-center justify-center gap-3 group"
                        >
                          <svg
                            className="w-6 h-6 group-hover:scale-110 transition-transform"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Continuar con Google
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOAuthSignUp("facebook")}
                          className="w-full px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#004B63] transition-all duration-300 font-semibold text-gray-800 flex items-center justify-center gap-3 group"
                        >
                          <svg
                            className="w-6 h-6 group-hover:scale-110 transition-transform"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Continuar con Facebook
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            O regístrate con email
                          </span>
                        </div>
                      </div>

                      {/* Email Button */}
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Mail className="w-5 h-5" />
                        Crear cuenta con email
                      </button>

                      {/* Footer */}
                      <p className="text-center text-xs text-gray-500">
                        Al continuar, aceptas nuestros Términos de servicio y
                        Política de privacidad
                      </p>
                    </div>
                  )}

                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-5 animate-in fade-in">
                      <h3 className="text-2xl font-bold text-[#004B63] mb-6">
                        {t("signup.step_1_info") || "Información personal"}
                      </h3>

                      {/* Name Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#00374A] mb-2">
                            {t("signup.field.first_name")}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder={t("signup.placeholder.first_name")}
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                fieldErrors.firstName
                                  ? "border-red-300 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-[#004B63]"
                              }`}
                            />
                          </div>
                          {fieldErrors.firstName && (
                            <p className="text-red-600 text-xs mt-1">
                              {fieldErrors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#00374A] mb-2">
                            {t("signup.field.last_name")}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder={t("signup.placeholder.last_name")}
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                fieldErrors.lastName
                                  ? "border-red-300 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-[#004B63]"
                              }`}
                            />
                          </div>
                          {fieldErrors.lastName && (
                            <p className="text-red-600 text-xs mt-1">
                              {fieldErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-[#00374A] mb-2">
                          {t("signup.field.email")}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholder.email")}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.email
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-[#004B63]"
                            }`}
                          />
                        </div>
                        {fieldErrors.email && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      {/* OAuth Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500 font-medium">
                            O continúa con
                          </span>
                        </div>
                      </div>

                      {/* OAuth Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleOAuthSignUp("google")}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-gray-700"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Google
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOAuthSignUp("facebook")}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-gray-700"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={handleNext}
                        disabled={isStep1Valid}
                        className="w-full mt-8 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Continuar
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Security */}
                  {currentStep === 2 && (
                    <form
                      onSubmit={handleSignUp}
                      className="space-y-5 animate-in fade-in"
                    >
                      <h3 className="text-2xl font-bold text-[#004B63] mb-6">
                        {t("signup.step_2_security") || "Seguridad y acceso"}
                      </h3>

                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-[#00374A] mb-2">
                          {t("signup.field.username")}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholder.username")}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.username
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-[#004B63]"
                            }`}
                          />
                        </div>
                        {fieldErrors.username && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.username}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-[#00374A] mb-2">
                          {t("signup.field.password")}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholder.password")}
                            className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.password
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-[#004B63]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#004B63]"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Password Strength */}
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${passwordStrength.color} transition-all`}
                                  style={{
                                    width: `${(Math.min(formData.password.length, 20) / 20) * 100}%`,
                                  }}
                                />
                              </div>
                              {passwordStrength.label && (
                                <span
                                  className={`text-xs font-medium ${
                                    passwordStrength.color.includes("red")
                                      ? "text-red-600"
                                      : passwordStrength.color.includes(
                                            "orange",
                                          )
                                        ? "text-orange-600"
                                        : passwordStrength.color.includes(
                                              "yellow",
                                            )
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                  }`}
                                >
                                  {passwordStrength.label}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {t("signup.info.password_min_length") ||
                                "Mínimo 8 caracteres. Usa mayúsculas, números y símbolos."}
                            </p>
                          </div>
                        )}

                        {fieldErrors.password && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.password}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-[#00374A] mb-2">
                          {t("signup.field.phone")} (Opcional)
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholder.phone")}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.phone
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-[#004B63]"
                            }`}
                          />
                        </div>
                        {fieldErrors.phone && (
                          <p className="text-red-600 text-xs mt-1">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>

                      {/* Terms */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p
                          className="text-xs text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: sanitize(t("ialab.signup_terms")),
                          }}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          {loading
                            ? "Creando cuenta..."
                            : t("signup.button.register") || "Crear cuenta"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="min-h-screen lg:min-h-auto flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#004B63] mb-2">
                    ¡Bienvenido!
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {t("signup.success.registration_complete") ||
                      "Tu cuenta ha sido creada exitosamente."}
                  </p>
                  <p className="text-sm text-gray-500">
                    Te estamos redirigiendo a la plataforma...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center text-white/80 text-sm">
            <p>🔒 Tus datos están protegidos con encriptación SSL</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupabaseSignUpForm;
