/**
 * Modal de Cambio de Contraseña Funcional
 * Integración con Supabase Auth
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';
import { supabase } from '../../lib/supabase';

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validaciones de contraseña
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Al menos un carácter especial');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setError(`La nueva contraseña debe tener: ${validationErrors.join(', ')}`);
      return;
    }
    
    if (newPassword === currentPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Verificar contraseña actual re-autenticando
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.getUser().then(res => res.data.user?.email) || '',
        password: currentPassword,
      });
      
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('La contraseña actual es incorrecta');
        }
        throw authError;
      }
      
      // 2. Actualizar contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) throw updateError;
      
      // 3. Éxito
      setSuccess('¡Contraseña cambiada exitosamente!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Notificar éxito al padre
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular fortaleza de contraseña
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const getStrengthColor = () => {
    if (passwordStrength < 40) return '#EF4444';
    if (passwordStrength < 70) return '#F59E0B';
    return '#10B981';
  };
  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Débil';
    if (passwordStrength < 70) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-20">
      <Card className="w-full max-w-md mx-auto border border-[#E2E8F0] shadow-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
              <Icon name="fa-key" className="text-[#00BCD4]" />
              Cambiar Contraseña
            </CardTitle>
            <button 
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#004B63] transition-colors p-1 rounded-lg hover:bg-[#B2D8E5]/30"
              disabled={loading}
            >
              <Icon name="fa-times" className="text-lg" />
            </button>
          </div>
        </CardHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <CardContent className="space-y-6 py-6 px-4">
          {/* Mensajes de estado */}
          {error && (
            <div className="p-4 bg-[#FEE2E2] border border-[#EF4444]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="fa-exclamation-circle" className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#DC2626]">Error</p>
                  <p className="text-sm text-[#991B1B] mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-[#D1FAE5] border border-[#10B981]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="fa-check-circle" className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#065F46]">¡Éxito!</p>
                  <p className="text-sm text-[#065F46] mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Contraseña Actual */}
             <div>
               <label htmlFor="password-current" className="block text-sm font-medium text-[#004B63] mb-1">
                 Contraseña Actual
               </label>
               <div className="relative">
                  <input
                   type={showCurrentPassword ? 'text' : 'password'}
                   id="password-current"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent pr-10 text-sm"
                   placeholder="Ingresa tu contraseña actual"
                   disabled={loading}
                   required
                   autoComplete="current-password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#004B63]"
                   disabled={loading}
                 >
                   <Icon name={showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'} />
                 </button>
               </div>
             </div>

              {/* Nueva Contraseña */}
              <div>
                <label htmlFor="password-new" className="block text-sm font-medium text-[#004B63] mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                   <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="password-new"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent pr-10 text-sm"
                    placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y especial"
                    disabled={loading}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#004B63]"
                    disabled={loading}
                  >
                    <Icon name={showNewPassword ? 'fa-eye-slash' : 'fa-eye'} />
                  </button>
                </div>
               
               {/* Indicador de fortaleza */}
               {newPassword && (
                 <div className="mt-2">
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-[#64748B]">Fortaleza:</span>
                     <span className="font-medium" style={{ color: getStrengthColor() }}>
                       {getStrengthText()}
                     </span>
                   </div>
                   <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                     <div 
                       className="h-2 rounded-full transition-all duration-300"
                       style={{ 
                         width: `${passwordStrength}%`,
                         backgroundColor: getStrengthColor()
                       }}
                     ></div>
                   </div>
                 </div>
               )}
              </div>

             {/* Confirmar Nueva Contraseña */}
             <div>
               <label htmlFor="password-confirm" className="block text-sm font-medium text-[#004B63] mb-1">
                 Confirmar Nueva Contraseña
               </label>
               <div className="relative">
                  <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   id="password-confirm"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent pr-10 text-sm"
                   placeholder="Repite la nueva contraseña"
                   disabled={loading}
                   required
                   autoComplete="new-password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#004B63]"
                   disabled={loading}
                 >
                   <Icon name={showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} />
                 </button>
               </div>
             </div>
              
               {/* Validación de coincidencia */}
               {confirmPassword && newPassword !== confirmPassword && (
                 <p className="text-xs text-[#EF4444] mt-1">
                   <Icon name="fa-exclamation-circle" className="mr-1" />
                   Las contraseñas no coinciden
                 </p>
               )}
               {confirmPassword && newPassword === confirmPassword && (
                 <p className="text-xs text-[#10B981] mt-1">
                   <Icon name="fa-check-circle" className="mr-1" />
                   Las contraseñas coinciden
                 </p>
               )}

             {/* Requisitos de contraseña */}
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <p className="text-sm font-medium text-[#004B63] mb-2">Requisitos de seguridad:</p>
              <ul className="text-xs text-[#64748B] space-y-1">
                <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-[#10B981]' : ''}`}>
                  <Icon name={newPassword.length >= 8 ? 'fa-check-circle' : 'fa-circle'} className="text-xs" />
                  Mínimo 8 caracteres
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-[#10B981]' : ''}`}>
                  <Icon name={/[A-Z]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} className="text-xs" />
                  Al menos una mayúscula (A-Z)
                </li>
                <li className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) ? 'text-[#10B981]' : ''}`}>
                  <Icon name={/[a-z]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} className="text-xs" />
                  Al menos una minúscula (a-z)
                </li>
                <li className={`flex items-center gap-2 ${/\d/.test(newPassword) ? 'text-[#10B981]' : ''}`}>
                  <Icon name={/\d/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} className="text-xs" />
                  Al menos un número (0-9)
                </li>
                <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-[#10B981]' : ''}`}>
                  <Icon name={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} className="text-xs" />
                  Al menos un carácter especial (!@#$% etc.)
                </li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-[#E2E8F0] text-[#64748B] hover:border-[#004B63] hover:text-[#004B63]"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Icon name="fa-spinner" className="animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="text-xs text-[#64748B] text-center">
            <p>
              <Icon name="fa-lightbulb" className="mr-1" />
              Recomendación: Usa un gestor de contraseñas como LastPass o 1Password
            </p>
          </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ChangePasswordModal;