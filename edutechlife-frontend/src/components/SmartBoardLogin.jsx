import React, { useState } from 'react';
import { GraduationCap, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

const SmartBoardLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === '123' && password === '123') {
      onLogin({ username, password });
    } else {
      setError('Usuario o contraseña incorrectos. Prueba: usuario: 123 / contraseña: 123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#E2E8F0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#004B63] shadow-xl mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#004B63] font-montserrat tracking-tight mb-2">
            SmartBoard
          </h1>
          <p className="text-lg text-[#64748B] font-open-sans">
            Plataforma Educativa Premium v2.286
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[rgba(178,216,229,0.5)] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6">
            <h2 className="text-xl font-bold text-white font-montserrat text-center">
              Iniciar Sesión
            </h2>
            <p className="text-white/80 text-sm font-open-sans text-center mt-1">
              Accede a tu dashboard educativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#004B63] font-open-sans mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] font-open-sans transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#004B63] font-open-sans mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] font-open-sans transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#004B63] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-[#FF6B9D]/10 border border-[#FF6B9D]/20 rounded-xl">
                <p className="text-sm text-[#FF6B9D] font-open-sans text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold font-open-sans hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Ingresar al Dashboard
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="p-4 bg-[#FFD166]/10 border border-[#FFD166]/20 rounded-xl">
              <p className="text-sm text-[#004B63] font-open-sans text-center">
                <span className="font-semibold">Credenciales de prueba:</span><br />
                Usuario: <code className="bg-white/50 px-2 py-0.5 rounded">123</code> <br />
                Contraseña: <code className="bg-white/50 px-2 py-0.5 rounded">123</code>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#64748B] font-open-sans mt-6">
          ¿No tienes acceso? <button className="text-[#4DA8C4] font-semibold hover:underline">Solicita una cuenta</button>
        </p>
      </div>
    </div>
  );
};

export default SmartBoardLogin;
