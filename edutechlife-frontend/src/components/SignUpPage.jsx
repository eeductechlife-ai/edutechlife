import { SignUp } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import { Brain, CheckCircle, ArrowLeft } from 'lucide-react';

const SignUpPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Brand & Info */}
          <div className="lg:w-2/5 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] p-8 lg:p-12 text-white flex flex-col justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Edutechlife</h1>
                  <p className="text-white/80 text-sm">Crea tu cuenta</p>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Únete a nuestra comunidad educativa</h2>
                <p className="text-white/90 leading-relaxed">
                  Accede a <strong>IA Generativa</strong>, <strong>Prompts</strong>, <strong>APIs</strong>, <strong>DeepResearch</strong>, <strong>Canvas</strong> y <strong>NotebookLM</strong> en un ecosistema educativo diseñado para potenciar tu aprendizaje.
                </p>
                <p className="text-white/80 mt-4 text-sm italic">
                  "La ética en la IA no es un complemento, es el fundamento de una educación transformadora."
                </p>
              </div>

               {/* Features */}
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                     <CheckCircle className="w-5 h-5" />
                   </div>
                   <span className="text-white/90">Tu puerta al futuro de la IA</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                     <CheckCircle className="w-5 h-5" />
                   </div>
                   <span className="text-white/90">Herramientas IA avanzadas</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                     <CheckCircle className="w-5 h-5" />
                   </div>
                   <span className="text-white/90">Seguimiento académico completo</span>
                 </div>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                ¿Ya tienes cuenta? <button onClick={onBack} className="text-white hover:underline font-medium">Inicia sesión aquí</button>
              </p>
            </div>
          </div>

          {/* Right Side - Clerk SignUp Component */}
          <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center items-center">
            {/* Header */}
            <div className="mb-6 text-center w-full">
              <h3 className="text-2xl font-bold text-[#004B63] mb-2">
                Crea tu cuenta
              </h3>
              <p className="text-[#4DA8C4]">
                Completa el formulario para comenzar
              </p>
            </div>

               {/* Clerk SignUp Component - Clean */}
               <div className="w-full flex justify-center items-center min-h-[500px] py-8">
                 <SignUp 
                   signInUrl="/"
                   appearance={{
                     variables: {
                       colorPrimary: '#004B63',
                       colorPrimaryHover: '#0A3550',
                     }
                   }}
                 />
               </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 w-full max-w-sm">
              <p className="text-center text-[#4DA8C4] text-sm">
                Al registrarte, aceptas nuestros <a href="#" className="text-[#004B63] hover:underline">Términos de servicio</a> y <a href="#" className="text-[#004B63] hover:underline">Política de privacidad</a>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;