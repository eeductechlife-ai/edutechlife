import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Phone, User, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, X, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { signUp, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signUp(formData.email, {
        full_name: formData.full_name,
        phone: formData.phone,
        role: 'student'
      });

      if (result.success) {
        setSuccess({
          password: result.generatedPassword,
          message: result.message
        });
        
        setTimeout(async () => {
          await signIn(formData.email, result.generatedPassword);
        }, 3000);
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#004B63] flex items-center justify-center p-4">
      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <button 
                onClick={closeSuccess}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-black text-[#004B63] font-montserrat mb-4">
                  ¡Registro Exitoso!
                </h2>
                
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Tu contraseña de acceso es:
                  </p>
                  <div className="bg-[#004B63] rounded-xl py-3 px-4">
                    <p className="text-[#FFD166] font-mono text-xl font-bold tracking-wider">
                      {success.password}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  ¡Guárdala bien! La necesitas para acceder al IALab.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Iniciando sesión...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-2xl mb-4 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white font-montserrat">
            Edutechlife
          </h1>
          <p className="text-white/60 text-lg">
            Portal de Aprendizaje IA
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-8 bg-white/10 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'login' 
                  ? 'bg-[#004B63] text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Ya tengo cuenta
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'register' 
                  ? 'bg-[#004B63] text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Soy nuevo
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2 font-medium">
                    Teléfono (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-3">
                  <p className="text-yellow-200 text-sm text-center">
                    🎉 Se generará una contraseña automáticamente para ti
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      Obtener Acceso al IALab
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="text-white/60 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio principal
            </button>
          </div>
        </div>

        <p className="text-white/30 text-xs text-center mt-8">
          © 2024 Edutechlife - Manizales, Colombia
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
