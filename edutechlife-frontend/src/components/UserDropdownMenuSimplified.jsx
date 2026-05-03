import React, { useState, useRef, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import UserProfileSmartCard from './UserProfileSmartCard';
import HelpModal from './modals/HelpModal';
import CertificatesModal from './modals/CertificatesModal';
import ChangeAvatarModal from './modals/ChangeAvatarModal';
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
  const dropdownRef = useRef(null);
  
  const [profileName, setProfileName] = useState(null);

  const activeUser = clerkUser || clerkUserOfficial;
  const displayName = profileName || activeUser?.fullName || activeUser?.firstName || userInfo.displayName || 'John Edison';

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.full_name) {
        setProfileName(event.detail.full_name);
      }
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);
  
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  
  // 🏆 MI PERFIL - Abre modal de perfil completo
  const handleProfile = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };
  
  // 🎓 MIS CERTIFICADOS - Abre modal de certificados
  const handleCertificates = () => {
    setIsOpen(false);
    setIsCertificatesOpen(true);
  };
  
  // ❓ AYUDA Y SOPORTE - Abre modal de ayuda
  const handleHelp = () => {
    setIsOpen(false);
    setIsHelpOpen(true);
  };

  // 📷 CAMBIAR FOTO - Abre modal de cambio de avatar
  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsAvatarOpen(true);
  };
  
  // Obtener iniciales para avatar
  const getUserInitials = () => {
    if (displayName) {
      const names = displayName.split(' ');
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
        <div className="flex items-center h-12 min-w-[200px] rounded-full bg-white border border-slate-200/60 shadow-sm">
          {/* Avatar clickeable para cambiar foto */}
          <button
            onClick={handleAvatarClick}
            className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-[#00BCD4]/50 hover:ring-offset-2 transition-all duration-200 cursor-pointer"
            aria-label="Cambiar foto de perfil"
            title="Cambiar foto de perfil"
          >
            {userInfo.avatarUrl ? (
              <img src={userInfo.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
              </div>
            )}
          </button>

          {/* Área clickeable para dropdown */}
          <button
            className="flex-1 flex items-center gap-2 pl-2 pr-3 min-w-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú de usuario"
          >
            {/* Texto: Nombre completo arriba, rol abajo */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-semibold text-petroleum truncate">
                {displayName}
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
        </div>
        
        {/* Dropdown menu - Estilo IALab Premium Compacto */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-60 border border-slate-200/60 shadow-lg rounded-xl bg-white z-[999] animate-in fade-in-0 zoom-in-95 overflow-hidden">
            {/* Header con información del usuario - Gradiente corporativo */}
            <div className="p-3 bg-gradient-to-r from-[#004B63] to-[#0A3550]">
              <div className="flex items-center gap-2.5">
                {/* Avatar clickeable en el dropdown */}
                <button
                  onClick={handleAvatarClick}
                  className="h-8 w-8 rounded-full overflow-hidden border border-white/30 hover:ring-2 hover:ring-white/50 transition-all duration-200 flex-shrink-0 cursor-pointer"
                  aria-label="Cambiar foto de perfil"
                  title="Cambiar foto de perfil"
                >
                  {userInfo.avatarUrl ? (
                    <img src={userInfo.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">{getUserInitials()}</span>
                    </div>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {displayName}
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
                <Icon name="fa-user-circle" className="text-sm text-[#004B63] flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Mi Perfil</span>
              </button>
              
              {/* 🎓 MIS CERTIFICADOS */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleCertificates}
              >
                <Icon name="fa-certificate" className="text-sm text-[#004B63] flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Mis Certificados</span>
              </button>
              
              {/* ❓ AYUDA Y SOPORTE */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleHelp}
              >
                <Icon name="fa-question-circle" className="text-sm text-[#004B63] flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300">Ayuda y Soporte</span>
              </button>
              
              {/* ——— SEPARADOR ——— */}
              <div className="border-t border-slate-200/60 my-1"></div>
              
              {/* 🚪 CERRAR SESIÓN */}
              <button
                className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-rose-400 rounded-lg shadow-sm hover:shadow hover:border-l-rose-500 hover:bg-rose-50/50 transition-all duration-300 cursor-pointer text-left"
                onClick={handleLogout}
              >
                <Icon name="fa-sign-out-alt" className="text-sm text-rose-500 flex-shrink-0" />
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
        onOpenChangeAvatar={() => setIsAvatarOpen(true)}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <CertificatesModal isOpen={isCertificatesOpen} onClose={() => setIsCertificatesOpen(false)} />

      <ChangeAvatarModal isOpen={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} />


    </>
  );
};

export default UserDropdownMenuSimplified;