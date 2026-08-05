import SupabaseLoginForm from "./SupabaseLoginForm";
import SupabaseSignUpForm from "./SupabaseSignUpForm";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingParticles from "./FloatingParticles";
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle,
  ArrowLeft,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Heart,
  BarChart3,
  Bell,
} from "lucide-react";
import { useTranslation } from "../i18n/I18nProvider";
import { sanitize } from "../utils/sanitize";
import SEO from "./SEO";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://edutechlife-backend.onrender.com";

const SmartBoardSignUpPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/smartboard";
  const [mode, setMode] = useState("signin");
  // "student" | "parent"
  const [userType, setUserType] = useState("student");
  // parent sub-mode: "login" | "register"
  const [parentMode, setParentMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");
  const [parentSuccess, setParentSuccess] = useState("");
  const [parentForm, setParentForm] = useState({
    studentEmail: "",
    parentPassword: "",
    parentName: "",
  });

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentForm((prev) => ({ ...prev, [name]: value }));
    setParentError("");
  };

  const switchUserType = (type) => {
    setUserType(type);
    setParentError("");
    setParentSuccess("");
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    setParentError("");
    setParentLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/parent-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: parentForm.studentEmail,
          parentPassword: parentForm.parentPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_role", "parent");
      localStorage.setItem("student_email", data.user.studentEmail);
      localStorage.setItem(
        "parent_name",
        `${data.user.firstName} ${data.user.lastName}`.trim(),
      );
      navigate("/smartboard");
    } catch (err) {
      setParentError(err.message);
    } finally {
      setParentLoading(false);
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();
    setParentError("");
    setParentLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/parent-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: parentForm.studentEmail,
          parentPassword: parentForm.parentPassword,
          parentName: parentForm.parentName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear cuenta");
      setParentSuccess(
        data.message || "Cuenta creada. Ya puedes iniciar sesión.",
      );
      setParentForm((prev) => ({
        ...prev,
        parentPassword: "",
        parentName: "",
      }));
      setTimeout(() => {
        setParentMode("login");
        setParentSuccess("");
      }, 2500);
    } catch (err) {
      setParentError(err.message);
    } finally {
      setParentLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/conoce-smartboard");
  };

  const isParentMode = userType === "parent";

  return (
    <>
      <SEO
        title={t("seo.signup_smartboard.title")}
        description={t("seo.signup_smartboard.desc")}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />

        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t("smartboard.signup_back")}
          </span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* ── LEFT PANEL ── */}
            <AnimatePresence mode="wait">
              {!isParentMode ? (
                <motion.div
                  key="student-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:w-2/5 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] p-8 lg:p-12 text-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">SmartBoard</h1>
                        <p className="text-white/80 text-sm">
                          {t("smartboard.signup_for_students")}
                        </p>
                      </div>
                    </div>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-4">
                        {t("smartboard.signup_welcome")}
                      </h2>
                      <p
                        className="text-white/90 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: sanitize(
                            mode === "signin"
                              ? t("smartboard.signup_signin_desc")
                              : t("smartboard.signup_signup_desc"),
                          ),
                        }}
                      />
                      <p className="text-white/80 mt-4 text-sm italic">
                        {t("smartboard.signup_quote")}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          Icon: BookOpen,
                          label: t("smartboard.signup_feature_missions"),
                        },
                        {
                          Icon: Users,
                          label: t("smartboard.signup_feature_community"),
                        },
                        {
                          Icon: CheckCircle,
                          label: t("smartboard.signup_feature_tracking"),
                        },
                      ].map(({ Icon, label }, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-white/90">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-white/70 text-sm">
                      {mode === "signin"
                        ? t("smartboard.signup_no_account")
                        : t("smartboard.signup_have_account")}{" "}
                      <button
                        onClick={() =>
                          setMode(mode === "signin" ? "signup" : "signin")
                        }
                        className="text-white hover:underline font-medium"
                      >
                        {mode === "signin"
                          ? t("smartboard.signup_register_here")
                          : t("smartboard.signup_login_here")}
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="parent-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:w-2/5 bg-gradient-to-br from-[#7B2FF7] to-[#9D4EDD] p-8 lg:p-12 text-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">SmartBoard</h1>
                        <p className="text-white/80 text-sm">
                          Portal para Padres y Madres
                        </p>
                      </div>
                    </div>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-4">
                        Acompaña el aprendizaje
                      </h2>
                      <p className="text-white/90 leading-relaxed">
                        Accede al panel de padres para monitorear el progreso
                        académico de tu hijo/a en tiempo real.
                      </p>
                      <p className="text-white/80 mt-4 text-sm italic">
                        "Un padre informado, un hijo más seguro de su camino."
                      </p>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          Icon: BarChart3,
                          label: "Progreso académico en tiempo real",
                        },
                        {
                          Icon: Bell,
                          label: "Alertas de actividad y racha de estudio",
                        },
                        {
                          Icon: Heart,
                          label: "Indicadores de bienestar del estudiante",
                        },
                        {
                          Icon: CheckCircle,
                          label: "Usa el mismo correo de tu hijo/a",
                        },
                      ].map(({ Icon, label }, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-white/90">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-white/70 text-sm">
                      {parentMode === "login"
                        ? "¿Aún no tienes acceso?"
                        : "¿Ya tienes tu cuenta?"}{" "}
                      <button
                        onClick={() =>
                          setParentMode(
                            parentMode === "login" ? "register" : "login",
                          )
                        }
                        className="text-white hover:underline font-medium"
                      >
                        {parentMode === "login"
                          ? "Regístrate aquí"
                          : "Inicia sesión"}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── RIGHT PANEL ── */}
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-start items-center">
              {/* ── USER TYPE SELECTOR (always visible at top) ── */}
              <div className="flex w-full max-w-sm mb-6 bg-gray-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => switchUserType("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    !isParentMode
                      ? "bg-[#004B63] text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Soy Estudiante
                </button>
                <button
                  onClick={() => switchUserType("parent")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isParentMode
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Soy Padre/Madre
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* ── STUDENT FORMS ── */}
                {!isParentMode && (
                  <motion.div
                    key="student-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Student sub-tabs */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-5 w-full max-w-sm">
                      <button
                        onClick={() => setMode("signin")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                          mode === "signin"
                            ? "bg-white text-[#004B63] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <LogIn className="w-4 h-4" />
                        {t("smartboard.signup_login_tab")}
                      </button>
                      <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                          mode === "signup"
                            ? "bg-white text-[#004B63] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        {t("smartboard.signup_register_tab")}
                      </button>
                    </div>

                    <div className="mb-4 text-center w-full">
                      <h3 className="text-xl font-bold text-[#004B63] mb-1">
                        {mode === "signin"
                          ? t("smartboard.signup_login_heading")
                          : t("smartboard.signup_register_heading")}
                      </h3>
                      <p className="text-[#4DA8C4] text-sm">
                        {mode === "signin"
                          ? t("smartboard.signup_login_sub")
                          : t("smartboard.signup_register_sub")}
                      </p>
                    </div>

                    <div className="w-full min-h-[400px] py-2">
                      <AnimatePresence mode="wait">
                        {mode === "signin" ? (
                          <motion.div
                            key="signin"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SupabaseLoginForm
                              returnTo={returnTo || "/smartboard"}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div
                              className="flex items-center justify-center"
                              style={{ minHeight: 400 }}
                            >
                              <SupabaseSignUpForm
                                returnTo={returnTo || "/smartboard/consent"}
                                onBack={() => setMode("signin")}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {mode === "signup" && (
                      <div className="mt-2 pt-4 border-t border-gray-200 w-full max-w-sm">
                        <p
                          className="text-center text-[#4DA8C4] text-xs"
                          dangerouslySetInnerHTML={{
                            __html: sanitize(t("smartboard.signup_terms")),
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── PARENT FORMS ── */}
                {isParentMode && (
                  <motion.div
                    key="parent-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Parent sub-tabs */}
                    <div className="flex bg-purple-50 rounded-xl p-1 mb-5 w-full max-w-sm gap-1">
                      <button
                        onClick={() => {
                          setParentMode("login");
                          setParentError("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          parentMode === "login"
                            ? "bg-white text-purple-700 shadow-sm"
                            : "text-purple-400 hover:text-purple-600"
                        }`}
                      >
                        <LogIn className="w-4 h-4" />
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => {
                          setParentMode("register");
                          setParentError("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          parentMode === "register"
                            ? "bg-white text-purple-700 shadow-sm"
                            : "text-purple-400 hover:text-purple-600"
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        Registrarse
                      </button>
                    </div>

                    <div className="mb-4 text-center w-full">
                      <h3 className="text-xl font-bold text-purple-700 mb-1">
                        {parentMode === "login"
                          ? "Acceso para Padres y Madres"
                          : "Crear cuenta de Padre/Madre"}
                      </h3>
                      <p className="text-purple-400 text-sm">
                        {parentMode === "login"
                          ? "Usa el correo de tu hijo/a con tu propia contraseña"
                          : "Tu cuenta se vincula al correo del estudiante"}
                      </p>
                    </div>

                    {/* Errors / Success */}
                    {parentError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                      >
                        {parentError}
                      </motion.div>
                    )}
                    {parentSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
                      >
                        {parentSuccess}
                      </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                      {/* Parent Login */}
                      {parentMode === "login" && (
                        <motion.form
                          key="parent-login"
                          onSubmit={handleParentLogin}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="w-full max-w-sm space-y-4"
                        >
                          <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-600">
                            Ingresa el correo de tu hijo/a y tu contraseña
                            personal de padre/madre.
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Correo del estudiante (tu hijo/a)
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                name="studentEmail"
                                value={parentForm.studentEmail}
                                onChange={handleParentChange}
                                placeholder="correo-de-tu-hijo@email.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Tu contraseña de padre/madre
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="parentPassword"
                                value={parentForm.parentPassword}
                                onChange={handleParentChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
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
                          <motion.button
                            type="submit"
                            disabled={parentLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {parentLoading && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Entrar como Padre/Madre
                          </motion.button>
                        </motion.form>
                      )}

                      {/* Parent Register */}
                      {parentMode === "register" && (
                        <motion.form
                          key="parent-register"
                          onSubmit={handleParentRegister}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="w-full max-w-sm space-y-4"
                        >
                          <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-600">
                            Crea tu acceso usando el correo de tu hijo/a. Elige
                            una contraseña diferente a la del estudiante.
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Tu nombre completo
                            </label>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                name="parentName"
                                value={parentForm.parentName}
                                onChange={handleParentChange}
                                placeholder="ej: María García"
                                className="w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Correo del estudiante (tu hijo/a)
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                name="studentEmail"
                                value={parentForm.studentEmail}
                                onChange={handleParentChange}
                                placeholder="correo-de-tu-hijo@email.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Tu contraseña de padre/madre
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="parentPassword"
                                value={parentForm.parentPassword}
                                onChange={handleParentChange}
                                placeholder="Diferente a la del estudiante"
                                className="w-full pl-10 pr-10 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
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
                            <p className="text-xs text-gray-400 mt-1">
                              Mínimo 6 caracteres
                            </p>
                          </div>
                          <motion.button
                            type="submit"
                            disabled={parentLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {parentLoading && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Crear mi Cuenta de Padre/Madre
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SmartBoardSignUpPage;
