import React, { useState, useRef, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import UserProfileSmartCard from './UserProfileSmartCard';
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
      <div className="relative" ref={dropdownRef}>
        {/* Smart-Pill: Botón profesional para Navbar */}
        <button
          className="flex items-center gap-3 h-12 min-w-[200px] pl-2 pr-4 rounded-full bg-white/80 backdrop-blur-md border border-corporate/20 shadow-sm hover:bg-corporate/5 transition-all duration-200"
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
        
        {/* Dropdown menu - Estilo Corporativo Premium */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-xl border border-corporate/10 shadow-lg rounded-3xl z-50 animate-in fade-in-0 zoom-in-95">
            {/* Header con información del usuario */}
            <div className="p-5 border-b border-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {userInfo.displayName}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {userInfo.displayEmail}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                     <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                       {userInfo.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                     </span>
                    {isClerkSignedIn && (
                      <span className="text-xs px-2.5 py-1 bg-corporate/10 text-corporate rounded-full border border-corporate/20">
                        Clerk
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Opciones del menú - Estilo Píldora Corporativo */}
            <div className="p-3 space-y-1.5">
              {/* 🏆 MI PERFIL */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-cyan-50 transition-all duration-200 text-left"
                onClick={handleProfile}
              >
                <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Mi Perfil</span>
              </button>
              
              {/* ⚙ CONFIGURACIÓN */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-cyan-50 transition-all duration-200 text-left"
                onClick={handleSettings}
              >
                <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Configuración</span>
              </button>
              
              {/* 🎓 MIS CERTIFICADOS */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-cyan-50 transition-all duration-200 text-left"
                onClick={handleCertificates}
              >
                <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Mis Certificados</span>
              </button>
              
              {/* 🔐 SEGURIDAD */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-cyan-50 transition-all duration-200 text-left"
                onClick={handleSecurity}
              >
                <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Seguridad</span>
              </button>
              
              {/* ❓ AYUDA Y SOPORTE */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-cyan-50 transition-all duration-200 text-left"
                onClick={handleHelp}
              >
                <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">Ayuda y Soporte</span>
              </button>
              
              {/* ——— SEPARADOR CORPORATIVO ——— */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white/90 text-xs text-slate-500 font-medium">Cuenta</span>
                </div>
              </div>
              
              {/* 🚪 CERRAR SESIÓN */}
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-slate-100 hover:bg-red-50 transition-all duration-200 text-left"
                onClick={handleLogout}
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium text-red-600">Cerrar Sesión</span>
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