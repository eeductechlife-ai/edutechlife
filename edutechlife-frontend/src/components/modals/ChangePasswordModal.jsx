/**
 * Modal de Cambio de Contraseña Funcional
 * NOTA: Con Clerk, el cambio de contraseña se maneja a través del User Profile de Clerk
 * Este modal es informativo y redirige al dashboard de Clerk
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';
import { useUser } from '@clerk/react';

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const handleOpenClerkProfile = () => {
    setLoading(true);
    try {
      // Clerk maneja el cambio de contraseña a través de su dashboard
      // Redirigir al usuario al User Profile de Clerk
      window.location.href = '/user-profile';
      // Nota: La ruta /user-profile debe estar configurada en Clerk para manejar el cambio de contraseña
    } catch (err) {
      console.error('Error al redirigir a Clerk:', err);
      setError('No se pudo acceder a la configuración de cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
      <Card className="w-full max-w-md mx-auto border border-[#E2E8F0] shadow-2xl max-h-[80vh] overflow-hidden relative">
        {/* Botón de cerrar flotante */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white/50 hover:bg-slate-100 hover:text-slate-800 rounded-full backdrop-blur-sm transition-all duration-200"
          aria-label="Cerrar modal"
          disabled={loading}
        >
          <Icon name="fa-times" className="text-lg" />
        </button>
        
        <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 sticky top-0 z-10 pt-12">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
              <Icon name="fa-key" className="text-[#00BCD4]" />
              Cambiar Contraseña
            </CardTitle>
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

          {/* Información Clerk */}
          <div className="p-4 bg-[#EFF6FF] border border-[#3B82F6]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="fa-info-circle" className="text-[#3B82F6] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#1E40AF]">Gestión de Contraseña con Clerk</p>
                <p className="text-sm text-[#1E40AF] mt-1">
                  Edutechlife utiliza Clerk para la autenticación. Para cambiar tu contraseña, 
                  debes acceder a tu perfil de usuario en Clerk.
                </p>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#004B63] mb-2">Pasos para cambiar tu contraseña:</h3>
              <ol className="text-sm text-[#64748B] space-y-2 pl-5 list-decimal">
                <li>Haz clic en "Abrir Configuración de Cuenta"</li>
                <li>Serás redirigido al dashboard de Clerk</li>
                <li>En la sección "Seguridad", busca "Cambiar Contraseña"</li>
                <li>Sigue las instrucciones de Clerk para actualizar tu contraseña</li>
                <li>Una vez completado, regresa a Edutechlife</li>
              </ol>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <p className="text-sm font-medium text-[#004B63] mb-2">Requisitos de seguridad de Clerk:</p>
              <ul className="text-xs text-[#64748B] space-y-1">
                <li className="flex items-center gap-2">
                  <Icon name="fa-check-circle" className="text-[#10B981] text-xs" />
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="fa-check-circle" className="text-[#10B981] text-xs" />
                  Combinación de mayúsculas y minúsculas
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="fa-check-circle" className="text-[#10B981] text-xs" />
                  Al menos un número
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="fa-check-circle" className="text-[#10B981] text-xs" />
                  No usar contraseñas comunes
                </li>
              </ul>
            </div>
          </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button 
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-[#E2E8F0] text-[#64748B] hover:border-[#004B63] hover:text-[#004B63]"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                onClick={handleOpenClerkProfile}
                className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon name="fa-spinner" className="animate-spin mr-2" />
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    <Icon name="fa-external-link-alt" className="mr-2" />
                    Abrir Configuración de Cuenta
                  </>
                )}
              </Button>
            </div>

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