import { SignIn, SignUp } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import { Brain, CheckCircle } from 'lucide-react';

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background Pattern - Optimizado para performance */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Main Card - Mobile First Design */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Brand & Info (Mobile: hidden, Tablet+: visible) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:block lg:w-2/5 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between"
          >
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Edutechlife</h1>
                  <p className="text-white/80 text-xs sm:text-sm">Laboratorio IA</p>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Bienvenido al futuro del aprendizaje</h2>
                <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                  Accede a <strong>IA Generativa</strong>, <strong>Prompts</strong>, <strong>APIs</strong>, <strong>DeepResearch</strong>, <strong>Canvas</strong> y <strong>NotebookLM</strong> en un ecosistema educativo diseñado para potenciar tu aprendizaje.
                </p>
                <p className="text-white/80 mt-3 sm:mt-4 text-xs sm:text-sm italic">
                  "La ética en la IA no es un complemento, es el fundamento de una educación transformadora."
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 sm:space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-white/90 text-sm sm:text-base">Tu puerta al futuro de la IA</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-white/90 text-sm sm:text-base">Herramientas IA avanzadas</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-white/90 text-sm sm:text-base">Seguimiento académico</span>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
              <p className="text-white/70 text-xs sm:text-sm">
                ¿Necesitas ayuda? <a href="mailto:info@edutechlife.co" className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded">info@edutechlife.co</a>
              </p>
            </div>
          </motion.div>

          {/* Mobile Header (solo visible en móvil) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:hidden bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6 text-white"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold">Edutechlife</h1>
                <p className="text-white/80 text-sm">Laboratorio IA</p>
              </div>
            </div>
            <p className="text-white/90 text-center text-sm">
              Tu puerta al futuro de la IA educativa
            </p>
          </motion.div>

          {/* Right Side - Authentication Zone (Full width en móvil) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-3/5 p-5 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-b from-white to-blue-50/20"
          >
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#00374A] mb-2">
                Accede a tu Laboratorio
              </h3>
              <p className="text-[#4DA8C4] text-sm sm:text-base">
                Inicia tu viaje educativo transformador
              </p>
            </div>

            {/* Zona Superior: Formulario de Credenciales */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full min-h-[350px] sm:min-h-[400px]">
                <SignIn 
                  fallbackRedirectUrl="/ialab"
                  signUpUrl="/sign-up"
                  appearance={{
                    variables: {
                      colorPrimary: '#004B63',
                      colorPrimaryHover: '#0A3550',
                      colorText: '#00374A',
                      colorBackground: '#FFFFFF',
                      colorInputBackground: '#F8FAFC',
                      colorInputText: '#00374A',
                      colorInputPlaceholder: '#64748B',
                      colorDanger: '#DC2626',
                      colorSuccess: '#059669',
                      borderRadius: '0.75rem',
                      fontSize: { base: '14px', sm: '15px', md: '16px' },
                      fontFamily: "'Montserrat', sans-serif",
                      fontSmoothing: 'antialiased',
                      fontWeight: {
                        normal: '400',
                        medium: '500',
                        bold: '600',
                      },
                      spacingUnit: { base: '0.2rem', sm: '0.25rem', md: '0.3rem' },
                      animation: {
                        slow: '400ms',
                        default: '250ms',
                        fast: '150ms',
                      },
                      shadow: {
                        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      },
                    }
                  }}
                />
              </div>
            </div>

            {/* Zona Inferior: Call To Action Principal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100"
            >
              <div className="text-center">
                <p className="text-[#4DA8C4] text-sm sm:text-base mb-4">
                  ¿Eres nuevo en Edutechlife?
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate && onNavigate('sign-up')}
                  className="w-full max-w-md mx-auto py-3 sm:py-4 min-h-[44px] sm:min-h-[48px] bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#4DA8C4] hover:from-[#4DA8C4] hover:to-[#004B63] text-white font-semibold sm:font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004B63]/30 focus:ring-offset-2"
                  aria-label="Regístrate gratis en Edutechlife"
                >
                  ¡Regístrate Gratis!
                </motion.button>
                <p className="text-center text-[#4DA8C4]/80 text-xs sm:text-sm mt-3 sm:mt-4">
                  Tu información está protegida con los más altos estándares de seguridad.
                  <br className="hidden sm:block" />
                  Comienza tu viaje educativo hoy mismo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
