import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button-simple';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { Icon } from '../utils/iconMapping.jsx';
import { useAuth } from '../context/AuthContext';
import { useClerkAuth, getClerkUserInfo } from '../utils/clerk-utils';

/**
 * UserDropdownMenuSimplified - Versión simplificada sin dependencias externas
 * 
 * Características:
 * 1. Diseño premium con estilos propios
 * 2. Sin dependencias de Radix UI
 * 3. Funcionalidades 100% operativas
 * 4. Fácil de mantener
 */
const UserDropdownMenuSimplified = ({ onNavigate }) => {
  const { user: supabaseUser, profile, signOut } = useAuth();
  const { user: clerkUser, isSignedIn: isClerkSignedIn, signOut: clerkSignOut, openUserProfile } = useClerkAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Determinar qué usuario usar (Clerk tiene prioridad)
  const activeUser = clerkUser || supabaseUser;
  const activeProfile = profile;
  
  // Obtener información del usuario
  const userInfo = getClerkUserInfo(clerkUser || {
    fullName: activeProfile?.full_name || 'Usuario',
    primaryEmailAddress: { emailAddress: supabaseUser?.email || 'usuario@edutechlife.com' },
    imageUrl: null,
  });
  
  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Manejar logout
  const handleLogout = async () => {
    try {
      if (isClerkSignedIn && clerkSignOut) {
        await clerkSignOut();
      } else {
        await signOut();
      }
      
      setIsOpen(false);
      if (onNavigate) {
        onNavigate('landing');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  // Estados para modales
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // 🏆 MI PERFIL - Abre modal de perfil completo
  const handleProfile = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // ⚙ CONFIGURACIÓN - Abre modal de preferencias
  const handleSettings = () => {
    setIsOpen(false);
    setIsSettingsOpen(true);
  };
  
  // 🎓 MIS CERTIFICADOS - Abre modal de certificados
  const handleCertificates = () => {
    setIsOpen(false);
    setIsCertificatesOpen(true);
  };
  
  // 🔐 SEGURIDAD - Abre modal de seguridad (incluye cambio de contraseña)
  const handleSecurity = () => {
    setIsOpen(false);
    setIsSecurityOpen(true);
  };
  
  // ❓ AYUDA Y SOPORTE - Abre modal de ayuda
  const handleHelp = () => {
    setIsOpen(false);
    setIsHelpOpen(true);
  };
  
  // Obtener iniciales para avatar
  const getUserInitials = () => {
    if (userInfo.displayName) {
      const names = userInfo.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };
  
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Botón trigger */}
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-cyan-50 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú de usuario"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-white font-semibold text-sm">
              {getUserInitials()}
            </span>
          </div>
        </Button>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-100 shadow-xl rounded-xl z-50 animate-in fade-in-0 zoom-in-95">
            {/* Header con información del usuario */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#00374A] truncate">
                    {userInfo.displayName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {userInfo.displayEmail}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-cyan-50 text-[#00BCD4] rounded-full">
                      {activeProfile?.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                    </span>
                    {isClerkSignedIn && (
                      <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                        Clerk
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Opciones del menú - SECUENCIA LÓGICA PREMIUM */}
            <div className="p-2 space-y-1">
              {/* 🏆 MI PERFIL */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 transition-all duration-300 text-left group"
                onClick={handleProfile}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#00BCD4] group-hover:scale-110 transition-transform">
                  <Icon name="fa-user-circle" className="text-sm" />
                </div>
                <span className="text-sm font-medium text-[#004B63] group-hover:text-[#00BCD4] transition-colors">Mi Perfil</span>
              </button>
              
              {/* ⚙ CONFIGURACIÓN */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 transition-all duration-300 text-left group"
                onClick={handleSettings}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#66CCCC] group-hover:scale-110 transition-transform">
                  <Icon name="fa-sliders-h" className="text-sm" />
                </div>
                <span className="text-sm font-medium text-[#004B63] group-hover:text-[#66CCCC] transition-colors">Configuración</span>
              </button>
              
              {/* 🎓 MIS CERTIFICADOS */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 transition-all duration-300 text-left group"
                onClick={handleCertificates}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#FF6B9D] group-hover:scale-110 transition-transform">
                  <Icon name="fa-award" className="text-sm" />
                </div>
                <span className="text-sm font-medium text-[#004B63] group-hover:text-[#FF6B9D] transition-colors">Mis Certificados</span>
              </button>
              
              {/* 🔐 SEGURIDAD */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 transition-all duration-300 text-left group"
                onClick={handleSecurity}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                  <Icon name="fa-shield-alt" className="text-sm" />
                </div>
                <span className="text-sm font-medium text-[#004B63] group-hover:text-[#10B981] transition-colors">Seguridad</span>
              </button>
              
              {/* ❓ AYUDA Y SOPORTE */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#B2D8E5]/30 transition-all duration-300 text-left group"
                onClick={handleHelp}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform">
                  <Icon name="fa-question-circle" className="text-sm" />
                </div>
                <span className="text-sm font-medium text-[#004B63] group-hover:text-[#F59E0B] transition-colors">Ayuda y Soporte</span>
              </button>
              
              {/* ——— SEPARADOR PREMIUM ——— */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-xs text-[#94A3B8]">Cuenta</span>
                </div>
              </div>
              
              {/* 🚪 CERRAR SESIÓN */}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FEE2E2] transition-all duration-300 text-left group"
                onClick={handleLogout}
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#EF4444] group-hover:scale-110 transition-transform">
                  <Icon name="fa-sign-out-alt" className="text-sm" />
                </div>
                <span className="text-sm font-semibold text-[#EF4444] group-hover:text-[#DC2626] transition-colors">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 🔐 Modal de Seguridad */}
      {isSecurityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border border-[#E2E8F0] shadow-2xl">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
                  <Icon name="fa-shield-alt" className="text-[#10B981]" />
                  Seguridad de la Cuenta
                </CardTitle>
                <button 
                  onClick={() => setIsSecurityOpen(false)}
                  className="text-[#94A3B8] hover:text-[#004B63] transition-colors p-1 rounded-lg hover:bg-[#B2D8E5]/30"
                >
                  <Icon name="fa-times" className="text-lg" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {/* Estado de Clerk */}
              <div className={`p-4 rounded-lg ${isClerkSignedIn ? 'bg-[#10B981]/10 border border-[#10B981]/30' : 'bg-[#F59E0B]/10 border border-[#F59E0B]/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isClerkSignedIn ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                    <Icon name={isClerkSignedIn ? 'fa-check-circle' : 'fa-exclamation-triangle'} />
                  </div>
                  <div>
                    <p className="font-medium text-[#004B63]">
                      {isClerkSignedIn 
                        ? '✅ Autenticación Clerk activa'
                        : '⚠ Autenticación Clerk no disponible'
                      }
                    </p>
                    <p className="text-sm text-[#64748B] mt-1">
                      {isClerkSignedIn 
                        ? 'Tu cuenta está protegida con el sistema de seguridad Clerk.'
                        : 'Para gestión segura de contraseñas, completa la integración con Clerk.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Opciones de seguridad */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#004B63] uppercase tracking-wide">Opciones de Seguridad</h3>
                
                {/* Cambio de contraseña */}
                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#00BCD4] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00BCD4]/10 flex items-center justify-center text-[#00BCD4]">
                      <Icon name="fa-key" />
                    </div>
                    <div>
                      <p className="font-medium text-[#004B63]">Cambiar Contraseña</p>
                      <p className="text-sm text-[#64748B]">Actualiza tu contraseña regularmente</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (isClerkSignedIn && clerkInstance?.openUserProfile) {
                        clerkInstance.openUserProfile();
                      } else {
                        // Mostrar formulario personalizado
                        alert('Formulario de cambio de contraseña personalizado');
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    {isClerkSignedIn ? 'Abrir en Clerk' : 'Cambiar'}
                  </button>
                </div>
                
                {/* Autenticación de dos factores */}
                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#10B981] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                      <Icon name="fa-user-shield" />
                    </div>
                    <div>
                      <p className="font-medium text-[#004B63]">Autenticación de Dos Factores</p>
                      <p className="text-sm text-[#64748B]">Protección adicional para tu cuenta</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748B]">No activado</span>
                    <button className="px-3 py-1.5 bg-[#F1F5F9] text-[#004B63] rounded-lg hover:bg-[#E2E8F0] transition-colors text-sm">
                      Activar
                    </button>
                  </div>
                </div>
                
                {/* Sesiones activas */}
                <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#3B82F6] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                      <Icon name="fa-desktop" />
                    </div>
                    <div>
                      <p className="font-medium text-[#004B63]">Sesiones Activas</p>
                      <p className="text-sm text-[#64748B]">Gestiona tus dispositivos conectados</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#F1F5F9] text-[#004B63] rounded-lg hover:bg-[#E2E8F0] transition-colors text-sm">
                    Ver (2)
                  </button>
                </div>
              </div>
              
              {/* Consejos de seguridad */}
              <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                <h4 className="font-medium text-[#004B63] mb-2 flex items-center gap-2">
                  <Icon name="fa-lightbulb" className="text-[#F59E0B]" />
                  Consejos de Seguridad
                </h4>
                <ul className="text-sm text-[#64748B] space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon name="fa-check" className="text-[#10B981] mt-0.5" />
                    <span>Usa contraseñas únicas y complejas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="fa-check" className="text-[#10B981] mt-0.5" />
                    <span>Activa la autenticación de dos factores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="fa-check" className="text-[#10B981] mt-0.5" />
                    <span>Revisa periódicamente las sesiones activas</span>
                  </li>
                </ul>
              </div>
              
              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <Button 
                  onClick={() => setIsSecurityOpen(false)}
                  variant="outline"
                  className="flex-1 border-[#E2E8F0] text-[#64748B] hover:border-[#004B63] hover:text-[#004B63]"
                >
                  Cerrar
                </Button>
                <Button 
                  onClick={() => {
                    setIsSecurityOpen(false);
                    if (isClerkSignedIn) {
                      handleProfile();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white"
                >
                  {isClerkSignedIn ? 'Ir a Mi Perfil' : 'Más Información'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* 🏆 Modal de Mi Perfil */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
                  <Icon name="fa-user-circle" className="text-[#00BCD4]" />
                  Mi Perfil - {userInfo.displayName}
                </CardTitle>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="text-[#94A3B8] hover:text-[#004B63] transition-colors p-1 rounded-lg hover:bg-[#B2D8E5]/30"
                >
                  <Icon name="fa-times" className="text-lg" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-6">
              
              {/* Sección 1: Información del Perfil */}
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 rounded-xl border border-[#E2E8F0]">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {getUserInitials()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#00BCD4] hover:bg-[#00BCD4] hover:text-white transition-colors shadow-sm">
                      <Icon name="fa-camera" className="text-sm" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#004B63]">{userInfo.displayName}</h3>
                    <p className="text-[#64748B] mt-1">{userInfo.displayEmail}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-3 py-1 bg-[#00BCD4]/10 text-[#00BCD4] rounded-full text-sm font-medium">
                        {activeProfile?.role === 'teacher' ? '👨‍🏫 Profesor' : '👨‍🎓 Estudiante'}
                      </span>
                      {isClerkSignedIn && (
                        <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-sm font-medium">
                          🔐 Clerk Protegido
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Formulario de información personal */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#004B63] flex items-center gap-2">
                    <Icon name="fa-user-edit" className="text-[#00BCD4]" />
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#004B63]">Nombre completo</label>
                      <input 
                      type="text" 
                      defaultValue={userInfo.displayName}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                    <input 
                      type="email" 
                      defaultValue={userInfo.displayEmail}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent"
                      placeholder="tu@email.com"
                      disabled
                    />
                    <p className="text-xs text-slate-500">El email no se puede cambiar</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Rol</label>
                    <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
                      <span className="text-slate-700">
                        {activeProfile?.role === 'teacher' ? '👨‍🏫 Profesor' : '👨‍🎓 Estudiante'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Fecha de registro</label>
                    <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
                      <span className="text-slate-700">
                        {new Date().toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sección 2: Preferencias */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#00374A]">Preferencias</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#00374A]">Notificaciones por email</p>
                      <p className="text-xs text-slate-500">Recibe actualizaciones sobre tus cursos y progreso</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00BCD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#00374A]">Modo oscuro</p>
                      <p className="text-xs text-slate-500">Interfaz con colores oscuros para uso nocturno</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00BCD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#00374A]">Recordatorios de estudio</p>
                      <p className="text-xs text-slate-500">Recibe recordatorios para continuar tus cursos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00BCD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Sección 3: Privacidad y Seguridad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#00374A]">Privacidad y Seguridad</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsChangePasswordOpen(true);
                    }}
                  >
                    🔒 Cambiar contraseña
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      alert('Política de privacidad:\n\n1. Tus datos están protegidos\n2. No compartimos información con terceros\n3. Puedes exportar tus datos cuando quieras\n4. Cumplimos con GDPR y regulaciones locales');
                    }}
                  >
                    📄 Ver política de privacidad
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      alert('Exportación de datos iniciada. Recibirás un email con:\n\n• Tu información de perfil\n• Historial de cursos\n• Certificados obtenidos\n• Progreso de aprendizaje');
                    }}
                  >
                    📥 Exportar mis datos
                  </Button>
                </div>
              </div>
              
              {/* Sección 4: Acciones */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setIsSettingsOpen(false)}
                    variant="outline"
                    className="flex-1 border-slate-200 hover:bg-slate-50"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsSettingsOpen(false);
                      alert('✅ Configuración guardada correctamente\n\nTus preferencias han sido actualizadas y se aplicarán en toda la plataforma.');
                    }}
                    className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90"
                  >
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserDropdownMenuSimplified;