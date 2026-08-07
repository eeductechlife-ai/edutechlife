import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, Eye, EyeOff, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://edutechlife-backend.onrender.com";

const SmartBoardLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
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
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      localStorage.setItem("auth_token", data.token);
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
      if (!res.ok) throw new Error(data.error || "Error al crear cuenta");
      setSuccess(data.message || "Cuenta creada. Ahora puedes iniciar sesión.");
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
        });
        setSuccess("Cuenta creada. Revisa tu email para confirmar.");
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
          <p className="text-sm text-white/90">
            Plataforma de aprendizaje personalizado
          </p>
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
              Soy Estudiante
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
              Soy Padre/Madre
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
                Iniciar Sesión
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
                Crear Cuenta
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
                Iniciar Sesión
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
                Registrarse
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
                      Código de invitación
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="invitationToken"
                        value={parentForm.invitationToken}
                        onChange={handleParentChange}
                        placeholder="Código enviado al email del acudiente"
                        className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Correo del estudiante (tu hijo/a)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="ej: juanperez"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pérez"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Correo Electrónico
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
                  Contraseña
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
                    Mínimo 6 caracteres
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
                {mode === "login" ? "Entrar a SmartBoard" : "Crear mi Cuenta"}
              </motion.button>
            </form>
          )}

          {/* ── PARENT LOGIN FORM ── */}
          {mode === "parent" && (
            <form onSubmit={handleParentLogin} className="space-y-4">
              <div className="bg-[#E8F7FB] rounded-xl p-3 text-xs text-[#004B63] mb-2">
                Ingresa el correo de tu hijo/a y tu contraseña de padre/madre.
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Correo del estudiante (tu hijo/a)
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
                  Tu contraseña de padre/madre
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
                Entrar como Padre/Madre
              </motion.button>
              <p className="text-center text-xs text-gray-500">
                ¿Aún no tienes cuenta de padre?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("parent-register");
                    setError("");
                  }}
                  className="text-[#004B63] font-semibold hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </form>
          )}

          {/* ── PARENT REGISTER FORM ── */}
          {mode === "parent-register" && (
            <form onSubmit={handleParentRegister} className="space-y-4">
              <div className="bg-[#E8F7FB] rounded-xl p-3 text-xs text-[#004B63] mb-2">
                Crea tu acceso de padre/madre usando el correo de tu hijo/a.
                Elige una contraseña diferente a la del estudiante. Necesitas el
                código de invitación que genera el estudiante desde su cuenta
                (se envía por email al verificar el consentimiento parental).
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tu nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="parentName"
                    value={parentForm.parentName}
                    onChange={handleParentChange}
                    placeholder="ej: María García"
                    className="w-full pl-10 pr-4 py-2 border border-[#4DA8C4]/30 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Correo del estudiante (tu hijo/a)
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
                  Tu contraseña de padre/madre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="parentPassword"
                    value={parentForm.parentPassword}
                    onChange={handleParentChange}
                    placeholder="Diferente a la del estudiante"
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
                  Mínimo 6 caracteres
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
                Crear mi Cuenta de Padre/Madre
              </motion.button>
            </form>
          )}

          {/* Footer */}
          {(mode === "login" || mode === "signup") && (
            <p className="text-center text-xs text-gray-500 mt-6">
              {mode === "login"
                ? "¿No tienes cuenta? Crea una arriba"
                : "¿Ya tienes cuenta? Inicia sesión arriba"}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SmartBoardLogin;
