import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, Eye, EyeOff, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../i18n/I18nProvider";
import { API_BASE_URL as API_BASE } from "../config/api";

const SmartBoardLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState("login"); // login | signup | parent | parent-register
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [parentLoading, setParentLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const [parentForm, setParentForm] = useState({
    studentEmail: "",
    parentPassword: "",
    parentName: "",
    invitationToken: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    setError("");
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
      if (!res.ok) throw new Error(data.error || t("login.error.login_failed"));

      sessionStorage.setItem("auth_token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_role", "parent");
      localStorage.setItem("student_email", data.user.studentEmail);
      localStorage.setItem("student_id", data.user.studentId || "");
      localStorage.setItem(
        "parent_name",
        `${data.user.firstName} ${data.user.lastName}`.trim(),
      );

      // El vínculo padre→hijo lo crea el backend al registrar (service_role),
      // nunca desde el cliente. Ver services/authService.signUpParent.

      navigate("/smartboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setParentLoading(false);
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();
    setError("");
    setParentLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/parent-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: parentForm.studentEmail,
          parentPassword: parentForm.parentPassword,
          parentName: parentForm.parentName,
          invitationToken: parentForm.invitationToken,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || t("login.error.register_failed"));
      setSuccess(data.message || t("login.success.account_created"));
      setParentForm({
        studentEmail: parentForm.studentEmail,
        parentPassword: "",
        parentName: "",
        invitationToken: "",
      });
      setTimeout(() => setMode("parent"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setParentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        await signIn({ email: formData.email, password: formData.password });
        localStorage.removeItem("user_role");
        navigate("/smartboard");
      } else {
        await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          accountType: "smartboard",
        });
        setSuccess(t("login.success.email_confirmation"));
        setFormData({
          email: "",
          password: "",
          username: "",
          firstName: "",
          lastName: "",
        });
        setTimeout(() => setMode("login"), 2000);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] via-[#00B4D8] to-[#48CAE4] flex items-center justify-center p-4">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-8 text-white text-center">
          <h1 className="text-3xl font-black mb-2">SmartBoard</h1>
          <p className="text-sm text-white/90">{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Tabs — Estudiante / Padre */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                mode === "login" || mode === "signup"
                  ? "bg-[#0077B6] text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("login.tab.student")}
            </button>
            <button
              onClick={() => {
                setMode("parent");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                mode === "parent" || mode === "parent-register"
                  ? "bg-[#004B63] text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              {t("login.tab.parent")}
            </button>
          </div>

          {/* Student sub-tabs */}
          {(mode === "login" || mode === "signup") && (
            <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                  mode === "login"
                    ? "bg-white text-[#0077B6] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {t("login.button.signin")}
              </button>
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-white text-[#0077B6] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {t("login.tab.create_account")}
              </button>
            </div>
          )}

          {/* Parent sub-tabs */}
          {(mode === "parent" || mode === "parent-register") && (
            <div className="flex gap-2 mb-5 bg-[#E8F7FB] p-1 rounded-lg">
              <button
                onClick={() => {
                  setMode("parent");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                  mode === "parent"
                    ? "bg-white text-[#004B63] shadow-sm"
                    : "text-[#4DA8C4]"
                }`}
              >
                {t("login.button.signin")}
              </button>
              <button
                onClick={() => {
                  setMode("parent-register");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                  mode === "parent-register"
                    ? "bg-white text-[#004B63] shadow-sm"
                    : "text-[#4DA8C4]"
                }`}
              >
                {t("login.tab.register")}
              </button>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* ── STUDENT FORM ── */}
          {(mode === "login" || mode === "signup") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("login.label.invitation_code")}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="invitationToken"
                        value={parentForm.invitationToken}
                        onChange={handleParentChange}
                        placeholder={t("login.placeholder.invitation_code")}
                        className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t("login.label.student_email")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder={t("login.placeholder.username")}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t("login.label.first_name")}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t("login.placeholder.first_name")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t("login.label.last_name")}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={t("login.placeholder.last_name")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t("login.password_min_length")}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login"
                  ? t("login.enter_smartboard")
                  : t("login.create_my_account")}
              </motion.button>
            </form>
          )}

          {/* ── PARENT LOGIN FORM ── */}
          {mode === "parent" && (
            <form onSubmit={handleParentLogin} className="space-y-4">
              <div className="bg-[#E8F7FB] rounded-xl p-3 text-xs text-[#004B63] mb-2">
                {t("login.parent_hint")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.student_email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="studentEmail"
                    value={parentForm.studentEmail}
                    onChange={handleParentChange}
                    placeholder="correo-de-tu-hijo@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.parent_password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="parentPassword"
                    value={parentForm.parentPassword}
                    onChange={handleParentChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={parentLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {parentLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("login.enter_as_parent")}
              </motion.button>
              <p className="text-center text-xs text-gray-500">
                {t("login.parent_no_account")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("parent-register");
                    setError("");
                  }}
                  className="text-[#004B63] font-semibold hover:underline"
                >
                  {t("login.signup_link")}
                </button>
              </p>
            </form>
          )}

          {/* ── PARENT REGISTER FORM ── */}
          {mode === "parent-register" && (
            <form onSubmit={handleParentRegister} className="space-y-4">
              <div className="bg-[#E8F7FB] rounded-xl p-3 text-xs text-[#004B63] mb-2">
                {t("login.parent_register_hint")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.parent_full_name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="parentName"
                    value={parentForm.parentName}
                    onChange={handleParentChange}
                    placeholder={t("login.placeholder.parent_full_name")}
                    className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.student_email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="studentEmail"
                    value={parentForm.studentEmail}
                    onChange={handleParentChange}
                    placeholder="correo-de-tu-hijo@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("login.label.parent_password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="parentPassword"
                    value={parentForm.parentPassword}
                    onChange={handleParentChange}
                    placeholder={t("login.placeholder.parent_password")}
                    className="w-full pl-10 pr-10 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("login.password_min_length")}
                </p>
              </div>
              <motion.button
                type="submit"
                disabled={parentLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {parentLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("login.create_parent_account")}
              </motion.button>
            </form>
          )}

          {/* Footer */}
          {(mode === "login" || mode === "signup") && (
            <p className="text-center text-xs text-gray-500 mt-6">
              {mode === "login"
                ? t("login.no_account_footer")
                : t("login.has_account_footer")}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SmartBoardLogin;
