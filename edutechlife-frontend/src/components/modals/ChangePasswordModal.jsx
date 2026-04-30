import React from 'react';
import { UserProfile } from '@clerk/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: '#004B63',
    colorText: '#00374A',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#00374A',
    borderRadius: '0.5rem',
  },
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none border-none bg-transparent',
    navbar: 'hidden',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    page: 'p-0',
    profilePage: 'p-0',
    section: 'p-0 mb-4',
    sectionHeader: 'hidden',
    formButtonPrimary: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white hover:opacity-90 text-sm font-semibold',
    formButtonReset: 'text-slate-500 hover:text-slate-700 text-sm',
    formFieldInput: 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-sm',
    formFieldLabel: 'text-xs font-semibold text-slate-700 mb-1',
    formFieldErrorText: 'text-xs text-rose-500 mt-1',
    footer: 'hidden',
    dividerLine: 'bg-slate-200',
    dividerText: 'text-xs text-slate-500',
  },
};

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <Card className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <CardHeader className="border-b border-slate-200/60 bg-white sticky top-0 z-10 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-shield-halved" className="text-[#004B63]" />
            </div>
            <CardTitle className="text-slate-800 font-bold text-sm">
              Seguridad - Cambiar Contraseña
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="fa-shield-halved" className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Verificación de Seguridad</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Por seguridad, Clerk requiere verificar tu identidad antes de cambiar la contraseña. Usa su panel nativo que maneja toda la verificación automáticamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/60 p-2">
              <UserProfile
                appearance={CLERK_APPEARANCE}
                routing="hash"
                path="/security"
              />
            </div>

            <button
              onClick={() => {
                try {
                  if (window.Clerk && typeof window.Clerk.openUserProfile === 'function') {
                    window.Clerk.openUserProfile();
                    onClose();
                    return;
                  }
                } catch (err) {
                  console.warn('Clerk.openUserProfile failed:', err);
                }
                window.open('https://accounts.clerk.com', '_blank');
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800"
            >
              <Icon name="fa-external-link-alt" />
              Abrir Configuración Completa
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordModal;
