import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button-simple';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { Icon } from '../utils/iconMapping.jsx';
import { useAuthWithClerk } from '../hooks/useAuthWithClerk';
import { useCourseProgress } from '../hooks/useCourseProgress';
import ChangePasswordModal from './modals/ChangePasswordModal';

const UserDropdownMenuSimplifiedTest = ({ onNavigate }) => {
  const auth = useAuthWithClerk();
  const courseProgress = useCourseProgress();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E2E8F0] shadow-2xl rounded-xl z-50">
            <div className="p-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#004B63]">Usuario</p>
                  <p className="text-xs text-[#64748B]">usuario@ejemplo.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 text-left"
                onClick={() => setIsProfileOpen(true)}
              >
                <Icon name="fa-user-circle" className="text-sm text-[#00BCD4]" />
                <span className="text-sm font-medium text-[#004B63]">Mi Perfil</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Smart-Card de Perfil - Versión simplificada */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-[85px]">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)} />
          
          <div className="relative z-10 w-full max-w-[380px] h-[70vh]">
            <div className="bg-white/90 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
              <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-cyan-500/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Icon name="fa-user-circle" className="text-white text-lg" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Mi Perfil</h2>
                      <p className="text-xs text-cyan-600 font-medium">Información actualizada</p>
                    </div>
                  </div>
                  <button onClick={() => setIsProfileOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <Icon name="fa-times" className="text-gray-500 text-sm" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-white font-bold text-xl">U</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{auth.fullName || 'Usuario'}</h3>
                      <p className="text-sm text-cyan-600 font-medium truncate">{auth.email || 'usuario@ejemplo.com'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-2">Información Personal</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                              <Icon name="fa-user" className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">NOMBRE COMPLETO</p>
                              <p className="font-bold text-gray-800 text-base mt-0.5">{auth.fullName || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isChangePasswordOpen && (
        <ChangePasswordModal 
          onClose={() => setIsChangePasswordOpen(false)}
          onSuccess={() => {
            setIsChangePasswordOpen(false);
            alert('✅ Contraseña cambiada exitosamente.');
          }}
        />
      )}
    </>
  );
};

export default UserDropdownMenuSimplifiedTest;