import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import FloatingParticles from './FloatingParticles';
import { Brain, Mail, Phone, User, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const WelcomeScreen = () => {
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
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Intentando login con:', formData.email);
      
      const result = await signIn(formData.email, formData.password);
      console.log('Resultado del login:', result);
      
      if (!result.success) {
        setError(result.error || 'Email o contraseña incorrectos. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('handleRegister llamado');
    
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos obligatorios');
      alert('Faltan campos obligatorios');
      return;
    }

    console.log('Datos del formulario:', formData);
    setLoading(true);
    setError('');

    try {
      console.log('Iniciando registro para:', formData.email);
      
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        phone: formData.phone,
        role: 'student'
      });

      console.log('Resultado del registro:', result);

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setSuccess('¡Registro exitoso! 📧 Revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, podrás ingresar con tus credenciales.');
          console.log('=== REGISTRO EXITOSO - EMAIL DE CONFIRMACIÓN ENVIADO ===');
        } else {
          setSuccess('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
          console.log('=== REGISTRO EXITOSO ===');
        }
        
        // Limpiar formulario después de registro exitoso
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          password: ''
        });
      } else {
        console.error('Error en registro:', result.error);
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Errorcatch en registro:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = async () => {
    // No longer needed - kept for compatibility
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Floating Orbs */}
      <FloatingParticles count={30} className="z-0" />
      
      <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-[#004B63]/10 rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[60%] right-[10%] w-24 h-24 bg-[#4DA8C4]/15 rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[20%] left-[15%] w-16 h-16 bg-[#66CCCC]/10 rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[30%] right-[25%] w-12 h-12 bg-[#004B63]/8 rounded-full animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Volver al inicio - Fixed position */}
      <button 
        onClick={() => window.location.href = '/'}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#004B63] hover:text-[#4DA8C4] transition-colors duration-300 cursor-pointer bg-transparent border-none p-0"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Volver al inicio</span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo y Header */}
        <div className="text-center mb-10">
          <img 
            src="/images/logo-edutechlife.webp" 
            alt="Edutechlife" 
            className="w-96 mx-auto mb-6 object-contain"
            style={{ height: '140px' }}
            onError={(e) => { 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center justify-center w-20 h-20 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-2xl mb-4 shadow-lg mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat">
            IALab Pro
          </h1>
          <p className="text-[#4DA8C4] text-xl font-medium mt-2">
            Domina la Inteligencia Artificial
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-lg border-2 border-[#4DA8C4]/30 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'login' 
                  ? 'bg-[#004B63] text-white shadow-lg' 
                  : 'border-2 border-[#4DA8C4] text-[#004B63] hover:bg-[#4DA8C4]/10'
              }`}
            >
              Ya tengo cuenta
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'register' 
                  ? 'bg-[#004B63] text-white shadow-lg' 
                  : 'border-2 border-[#4DA8C4] text-[#004B63] hover:bg-[#4DA8C4]/10'
              }`}
            >
              Inscribirme ahora
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
                 {/* Email */}
                 <div>
                   <label htmlFor="welcome-email" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Email
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type="email"
                       id="welcome-email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="tu@email.com"
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       required
                       autoComplete="email"
                     />
                   </div>
                 </div>

                 {/* Password */}
                 <div>
                   <label htmlFor="welcome-password" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Contraseña
                   </label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type={showPassword ? 'text' : 'password'}
                       id="welcome-password"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       placeholder="••••••••"
                       className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       required
                       autoComplete="current-password"
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4DA8C4] hover:text-[#004B63]"
                     >
                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                   </div>
                 </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-400 rounded-xl">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Botón Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#004B63] text-white font-bold text-lg rounded-xl hover:bg-[#4DA8C4] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Entrar al Laboratorio
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
                 {/* Nombre Completo */}
                 <div>
                   <label htmlFor="welcome-full_name" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Nombre Completo *
                   </label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type="text"
                       id="welcome-full_name"
                       name="full_name"
                       value={formData.full_name}
                       onChange={handleChange}
                       placeholder="Tu nombre completo"
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       required
                       autoComplete="name"
                     />
                   </div>
                 </div>

                 {/* Email */}
                 <div>
                   <label htmlFor="welcome-email-register" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Email *
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type="email"
                       id="welcome-email-register"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="tu@email.com"
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       required
                       autoComplete="email"
                     />
                   </div>
                 </div>

                 {/* Teléfono */}
                 <div>
                   <label htmlFor="welcome-phone" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Teléfono (WhatsApp)
                   </label>
                   <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type="tel"
                       id="welcome-phone"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       placeholder="+57 300 123 4567"
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="tel"
                     />
                   </div>
                 </div>

                 {/* Contraseña */}
                 <div>
                   <label htmlFor="welcome-password-register" className="block text-[#004B63]/80 text-sm mb-2 font-medium">
                     Crea tu contraseña *
                   </label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4DA8C4]" />
                     <input
                       type={showPassword ? 'text' : 'password'}
                       id="welcome-password-register"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       placeholder="••••••••"
                       className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-[#4DA8C4]/30 rounded-xl text-[#004B63] placeholder-[#4DA8C4]/50 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       required
                       autoComplete="new-password"
                     />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4DA8C4] hover:text-[#004B63]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-400 rounded-xl">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-4 bg-green-50 border-2 border-green-400 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 text-sm text-center font-medium">{success}</p>
                  </div>
                )}

                {/* Botón Register */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear mi acceso
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-[#4DA8C4]/50 text-xs text-center mt-8">
          © 2024 Edutechlife - Manizales, Colombia
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
