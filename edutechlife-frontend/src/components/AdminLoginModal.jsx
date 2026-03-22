import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, User, Eye, EyeOff, X, AlertCircle, Sparkles } from 'lucide-react';

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const modalRef = useRef(null);

  const ADMIN_CREDENTIALS = {
    username: 'admin_master',
    password: 'Edutechlife2024!'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCredentials({ username: '', password: '' });
      setError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      setIsLoading(false);
      onLogin();
    } else {
      setIsLoading(false);
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(11, 15, 25, 0.95)', backdropFilter: 'blur(20px)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #004B63, transparent)', filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4DA8C4, transparent)', filter: 'blur(60px)' }}></div>
      </div>

      {/* Modal */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md ${shake ? 'animate-shake' : ''}`}
        style={{ animation: shake ? 'shake 0.5s ease-in-out' : 'none' }}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-3xl opacity-50" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4, #66CCCC)', filter: 'blur(20px)' }}></div>
        
        <div className="relative rounded-3xl p-8 border border-[#004B63]/50" style={{ background: 'linear-gradient(135deg, rgba(11, 15, 25, 0.98) 0%, rgba(0, 75, 99, 0.4) 100%)' }}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#B2D8E5] hover:text-white hover:bg-[#004B63]/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4)' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-montserrat mb-2">Command Center</h2>
            <p className="text-sm text-[#B2D8E5]">Acceso Restringido - ADMIN_MASTER</p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-xl bg-[#66CCCC]/10 border border-[#66CCCC]/20">
            <Lock className="w-4 h-4 text-[#66CCCC]" />
            <span className="text-xs text-[#66CCCC] font-semibold">Conexión Encriptada SSL 256-bit</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#B2D8E5] mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#B2D8E5] mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2D8E5]/50 hover:text-[#B2D8E5] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FF6B9D]/20 border border-[#FF6B9D]/30">
                <AlertCircle className="w-5 h-5 text-[#FF6B9D] flex-shrink-0" />
                <p className="text-sm text-[#FF6B9D]">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ 
                background: isLoading ? '#004B63' : 'linear-gradient(135deg, #004B63, #4DA8C4)',
                boxShadow: '0 4px 20px rgba(0, 75, 99, 0.4)'
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Acceder al Command Center</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#004B63]/30">
            <p className="text-center text-xs text-[#B2D8E5]/70">
              Este panel es solo para administradores autorizados del proyecto Edutechlife Manizales.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span className="text-xs text-[#FFD166]">Edutechlife v2.286 - Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginModal;
