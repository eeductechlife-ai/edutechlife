import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Phone, User, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, X, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { signUp, signIn, generatePassword } = useAuth();
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
        setError(result.error || 'Error al iniciar sesión. Verifica tu email y contraseña.');
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
      // Generar contraseña automáticamente usando la función del AuthContext
      const { generatePassword } = useAuth();
      const passwordResult = await generatePassword();
      const generatedPassword = passwordResult.password;
      
      console.log('📝 Registrando usuario con metadata:', {
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        role: 'student'
      });

      // Llamar a signUp con la nueva firma que incluye password y metadata
      const result = await signUp(
        formData.email, 
        generatedPassword, 
        {
          full_name: formData.full_name,
          phone: formData.phone,
          role: 'student',
          user_count: passwordResult.userCount
        }
      );

      console.log('📊 Resultado del registro:', result);

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          // Caso: Email de confirmación requerido
          setSuccess({
            password: generatedPassword,
            message: '✅ ¡Registro exitoso! 📧 Revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, podrás acceder al IALab (Laboratorio de Inteligencia Artificial) con la contraseña generada.',
            requiresConfirmation: true
          });
        } else {
          // Caso: Registro inmediato (sin confirmación de email)
          setSuccess({
            password: generatedPassword,
            message: '✅ ¡Registro exitoso! Ya puedes acceder al IALab (Laboratorio de Inteligencia Artificial) con la contraseña generada.',
            requiresConfirmation: false
          });
          
          // Intentar login automático después de 2 segundos
          setTimeout(async () => {
            try {
              const loginResult = await signIn(formData.email, generatedPassword);
               if (loginResult.success) {
                 console.log('✅ Login automático exitoso después del registro');
                 // Redirigir al IALab
                 window.location.href = '/ialab';
               } else {
                console.warn('⚠️ Login automático falló, usuario debe iniciar sesión manualmente');
              }
            } catch (loginErr) {
              console.error('❌ Error en login automático:', loginErr);
            }
          }, 2000);
        }
      } else {
        setError(result.error || 'Error al registrar usuario. Por favor verifica tus datos e intenta nuevamente.');
      }
    } catch (err) {
      console.error('❌ Error en registro:', err);
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
                    {success.requiresConfirmation ? '✅ Registro Completado' : '🎉 ¡Acceso al IALab Confirmado!'}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    {success.requiresConfirmation 
                      ? 'Tu cuenta está casi lista. Confirma tu email para desbloquear el IALab.' 
                      : '¡Bienvenido al Laboratorio de Inteligencia Artificial de EdutechLife!'}
                  </p>
                 
                 <div className="space-y-4">
                   {/* Mensaje principal */}
                   <div className={`p-4 rounded-2xl ${success.requiresConfirmation ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                     <p className={`text-sm ${success.requiresConfirmation ? 'text-blue-700' : 'text-green-700'}`}>
                       {success.message}
                     </p>
                   </div>
                   
                   {/* Contraseña generada */}
                   <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Tu contraseña para acceder al IALab es:
                      </p>
                     <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl py-3 px-4">
                       <p className="text-white font-mono text-xl font-bold tracking-wider text-center">
                         {success.password}
                       </p>
                     </div>
                     <p className="text-gray-500 text-xs mt-2 text-center">
                       ¡Guárdala bien! La necesitas para acceder al IALab.
                     </p>
                   </div>
                   
                   {/* Estado */}
                   {success.requiresConfirmation ? (
                     <div className="flex items-center justify-center gap-2 text-blue-600">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                       <span className="text-sm font-medium">Revisa tu correo electrónico</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center gap-2 text-green-600">
                       <Loader2 className="w-4 h-4 animate-spin" />
                       <span className="text-sm font-medium">Redirigiendo al IALab...</span>
                     </div>
                   )}
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
                   <label htmlFor="auth-email" className="block text-white/80 text-sm mb-2 font-medium">
                     Email
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                     <input
                       type="email"
                       id="auth-email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="tu@email.com"
                       className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="email"
                     />
                   </div>
                 </div>

                 <div>
                   <label htmlFor="auth-password" className="block text-white/80 text-sm mb-2 font-medium">
                     Contraseña
                   </label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                     <input
                       type={showPassword ? 'text' : 'password'}
                       id="auth-password"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       placeholder="••••••••"
                       className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="current-password"
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
                   className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-[#4DA8C4]/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
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
                   <label htmlFor="auth-full_name" className="block text-white/80 text-sm mb-2 font-medium">
                     Nombre Completo *
                   </label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                     <input
                       type="text"
                       id="auth-full_name"
                       name="full_name"
                       value={formData.full_name}
                       onChange={handleChange}
                       placeholder="Tu nombre completo"
                       className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="name"
                     />
                   </div>
                 </div>

                 <div>
                   <label htmlFor="auth-email-register" className="block text-white/80 text-sm mb-2 font-medium">
                     Email *
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                     <input
                       type="email"
                       id="auth-email-register"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="tu@email.com"
                       className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="email"
                     />
                   </div>
                 </div>

                 <div>
                   <label htmlFor="auth-phone" className="block text-white/80 text-sm mb-2 font-medium">
                     Teléfono (WhatsApp)
                   </label>
                   <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                     <input
                       type="tel"
                       id="auth-phone"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       placeholder="+57 300 123 4567"
                       className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent transition-all"
                       autoComplete="tel"
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
                   className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-[#4DA8C4]/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
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
