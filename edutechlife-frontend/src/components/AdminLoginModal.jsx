import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, X, AlertCircle, Sparkles } from 'lucide-react';

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setUsername('');
      setPassword('');
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

    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === '123' && password === '123') {
      setIsLoading(false);
      onLogin();
    } else {
      setIsLoading(false);
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(11, 15, 25, 0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #004B63, transparent)', filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4DA8C4, transparent)', filter: 'blur(60px)' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl opacity-50" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4, #66CCCC)', filter: 'blur(20px)' }}></div>
        
        <div className="relative rounded-3xl p-8 border border-[#004B63]/50" style={{ background: 'linear-gradient(135deg, rgba(11, 15, 25, 0.98) 0%, rgba(0, 75, 99, 0.4) 100%)' }}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#B2D8E5] hover:text-white hover:bg-[#004B63]/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #004B63, #4DA8C4)' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-montserrat mb-2">Command Center</h2>
            <p className="text-sm text-[#B2D8E5]">Acceso Restringido - ADMIN_MASTER</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-xl bg-[#66CCCC]/10 border border-[#66CCCC]/20">
            <Lock className="w-4 h-4 text-[#66CCCC]" />
            <span className="text-xs text-[#66CCCC] font-semibold">Conexión Encriptada SSL 256-bit</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#B2D8E5] mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#B2D8E5] mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all"
                  placeholder="123"
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

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FF6B9D]/20 border border-[#FF6B9D]/30">
                <AlertCircle className="w-5 h-5 text-[#FF6B9D] flex-shrink-0" />
                <p className="text-sm text-[#FF6B9D]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ 
                background: isLoading ? '#004B63' : 'linear-gradient(135deg, #004B63, #4DA8C4)',
                boxShadow: '0 4px 20px rgba(0, 75, 99, 0.4)'
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Acceder</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#004B63]/30">
            <p className="text-center text-xs text-[#B2D8E5]/70">
              Centro de Administración Edutechlife Manizales
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span className="text-xs text-[#FFD166]">Edutechlife v2.286</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
