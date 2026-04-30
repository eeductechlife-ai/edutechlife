import React, { useState, useRef, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import UserProfileSmartCard from './UserProfileSmartCard';
import { useClerkAuth, getClerkUserInfo } from '../utils/clerk-utils';
import { Icon } from '../utils/iconMapping.jsx';

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
  const { user: clerkUser, isSignedIn: isClerkSignedIn, signOut: clerkSignOut, openUserProfile } = useClerkAuth();
  const { user: clerkUserOfficial } = useUser();
  const { signOut: clerkSignOutOfficial } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Clerk es el ÚNICO proveedor de identidad
  const activeUser = clerkUser || clerkUserOfficial;
  
  // Obtener información del usuario exclusivamente de Clerk
  const userInfo = getClerkUserInfo(activeUser);
  
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
  
  // Manejar logout exclusivamente con Clerk
  const handleLogout = async () => {
    try {
      // Usar Clerk oficial si está disponible, si no usar nuestro wrapper
      if (clerkSignOutOfficial) {
        await clerkSignOutOfficial();
      } else if (clerkSignOut) {
        await clerkSignOut();
      } else {
        console.error('No hay método de logout disponible');
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
  
  // 🏆 MI PERFIL - Abre modal de perfil completo
  const handleProfile = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // ⚙ CONFIGURACIÓN - Abre tarjeta de perfil
  const handleSettings = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // 🎓 MIS CERTIFICADOS - Abre tarjeta de perfil
  const handleCertificates = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // 🔐 SEGURIDAD - Abre tarjeta de perfil
  const handleSecurity = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // ❓ AYUDA Y SOPORTE - Abre tarjeta de perfil
  const handleHelp = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
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
      <div className="relative z-50" ref={dropdownRef}>
        {/* Smart-Pill: Botón profesional para Navbar */}
        <button
          className="flex items-center gap-3 h-12 min-w-[200px] pl-2 pr-4 rounded-full bg-white border border-slate-200/60 shadow-sm hover:bg-slate-50 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú de usuario"
        >
          {/* Avatar circular */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-white font-semibold text-sm">
              {getUserInitials()}
            </span>
          </div>
          
          {/* Texto: Nombre completo arriba, rol abajo */}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-petroleum truncate">
              {userInfo.displayName || 'John Edison'}
            </div>
             <div className="text-xs text-slate-500 truncate">
               {userInfo.role === 'teacher' ? 'Profesor' : 'Estudiante'}
             </div>
          </div>
          
          {/* Icono ChevronDown */}
          <svg 
            className="w-4 h-4 text-slate-400 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown menu - Estilo IALab Premium Compacto */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-60 border border-slate-200/60 shadow-lg rounded-xl bg-white z-[999] animate-in fade-in-0 zoom-in-95 overflow-hidden">
            {/* Header con información del usuario - Gradiente corporativo */}
            <div className="p-3 bg-gradient-to-r from-[#004B63] to-[#0A3550]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <span className="text-white font-semibold text-xs">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {userInfo.displayName}
                  </p>
                   <p className="text-[10px] text-white/70 truncate">
                     {userInfo.displayEmail}
                   </p>
                </div>
              </div>
            </div>
            
            {/* Opciones del menú - Estilo tarjetas tipo temas compacto */}
            <div className="p-2 space-y-1">
              {/* 🏆 MI PERFIL */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleProfile}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                  <Icon name="fa-user-circle" className="text-sm text-[#004B63]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Mi Perfil</span>
              </button>
              
              {/* ⚙ CONFIGURACIÓN */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleSettings}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                  <Icon name="fa-cog" className="text-sm text-[#004B63]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Configuración</span>
              </button>
              
              {/* 🎓 MIS CERTIFICADOS */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleCertificates}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                  <Icon name="fa-certificate" className="text-sm text-[#004B63]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Mis Certificados</span>
              </button>
              
              {/* 🔐 SEGURIDAD */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleSecurity}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                  <Icon name="fa-shield-halved" className="text-sm text-[#004B63]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Seguridad</span>
              </button>
              
              {/* ❓ AYUDA Y SOPORTE */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleHelp}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                  <Icon name="fa-question-circle" className="text-sm text-[#004B63]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Ayuda y Soporte</span>
              </button>
              
              {/* ——— SEPARADOR ——— */}
              <div className="border-t border-slate-200/60 my-1"></div>
              
              {/* 🚪 CERRAR SESIÓN */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-rose-400 rounded-lg shadow-sm hover:shadow hover:border-l-rose-500 hover:bg-rose-50/50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleLogout}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400/10 to-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-rose-400/20 group-hover:to-rose-500/20 transition-all duration-300">
                  <Icon name="fa-sign-out-alt" className="text-sm text-rose-500" />
                </div>
                <span className="text-xs font-semibold text-rose-600 group-hover:text-rose-700 transition-colors duration-300">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
      

      
      {/* 🏆 Modal de Mi Perfil - SMART CARD */}
      <UserProfileSmartCard 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenChangePassword={() => {
          setIsProfileOpen(false);
          // Clerk maneja la gestión de cuenta, incluyendo cambio de contraseña
          alert('Para gestionar tu cuenta (cambiar contraseña, email, etc.), usa la interfaz de Clerk.');
        }}
      />


    </>
  );
};

export default UserDropdownMenuSimplified;