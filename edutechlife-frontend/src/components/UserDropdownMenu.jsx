import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../utils/iconMapping.jsx';

const UserDropdownMenu = ({ isOpen, onClose, anchorRef, onNavigate }) => {
    const { user, profile, signOut } = useAuth();
    const dropdownRef = useRef(null);
    
    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                anchorRef.current && 
                !anchorRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    // Obtener iniciales del usuario
    const getUserInitials = () => {
        if (profile?.full_name) {
            const names = profile.full_name.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    // Obtener nombre para mostrar
    const getDisplayName = () => {
        if (profile?.full_name) {
            return profile.full_name;
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'Usuario';
    };

    // Obtener email para mostrar
    const getDisplayEmail = () => {
        if (user?.email) {
            return user.email;
        }
        return 'usuario@edutechlife.com';
    };

    // Manejar navegación a perfil
    const handleProfileInfo = () => {
        console.log('Navegando a perfil');
        if (onNavigate) {
            onNavigate('perfil');
        } else {
            alert('Página de perfil en desarrollo');
        }
        onClose();
    };

    // Manejar configuración
    const handleSettings = () => {
        console.log('Navegando a configuración');
        if (onNavigate) {
            onNavigate('configuracion');
        } else {
            alert('Página de configuración en desarrollo');
        }
        onClose();
    };

    // Manejar certificados
    const handleMyCertificates = () => {
        console.log('Navegando a certificados');
        if (onNavigate) {
            onNavigate('certificados');
        } else {
            alert('Página de certificados en desarrollo');
        }
        onClose();
    };

    // Manejar cambio de contraseña (modal)
    const handleChangePassword = () => {
        console.log('Abriendo modal de cambio de contraseña');
        // Por ahora solo mostramos un mensaje, se puede implementar un modal después
        alert('Funcionalidad de cambio de contraseña en desarrollo. Se abrirá un modal seguro para esta acción.');
        onClose();
    };

    // Manejar logout
    const handleLogout = async () => {
        try {
            await signOut();
            console.log('Sesión cerrada exitosamente');
            // Redirigir a landing (login) después de logout
            if (onNavigate) {
                onNavigate('landing');
            }
            onClose();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 shadow-lg rounded-xl z-[100] transition-all duration-300 animate-fade-in"
            style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.03)'
            }}
        >
            {/* Header con información del usuario */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00374A] to-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                            {getUserInitials()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#00374A] truncate">
                            {getDisplayName()}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {getDisplayEmail()}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Opciones del menú en orden jerárquico */}
            <div className="p-2">
                {/* 1. Información General */}
                <button 
                    onClick={handleProfileInfo}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                    aria-label="Ver información general del perfil"
                >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon 
                            name="fa-user" 
                            className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" 
                        />
                    </div>
                    <span className="text-sm text-[#00374A] font-normal text-left flex-1">
                        Información General
                    </span>
                </button>
                
                {/* 2. Configuración */}
                <button 
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                    aria-label="Abrir configuración de la cuenta"
                >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon 
                            name="fa-cog" 
                            className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" 
                        />
                    </div>
                    <span className="text-sm text-[#00374A] font-normal text-left flex-1">
                        Configuración
                    </span>
                </button>
                
                {/* 3. Mis Certificados */}
                <button 
                    onClick={handleMyCertificates}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                    aria-label="Ver mis certificados obtenidos"
                >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon 
                            name="fa-medal" 
                            className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" 
                        />
                    </div>
                    <span className="text-sm text-[#00374A] font-normal text-left flex-1">
                        Mis Certificados
                    </span>
                </button>
                
                {/* 4. Cambiar Contraseña */}
                <button 
                    onClick={handleChangePassword}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-1"
                    aria-label="Cambiar contraseña de la cuenta"
                >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon 
                            name="fa-key" 
                            className="text-[#00374A] text-sm group-hover:text-[#00BCD4] transition-colors" 
                        />
                    </div>
                    <span className="text-sm text-[#00374A] font-normal text-left flex-1">
                        Cambiar Contraseña
                    </span>
                </button>
                
                {/* Separador */}
                <div className="border-t border-slate-100 my-2"></div>
                
                {/* 5. Cerrar Sesión (color rojo #EF4444) */}
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    aria-label="Cerrar sesión de la plataforma"
                >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Icon 
                            name="fa-sign-out" 
                            className="text-[#EF4444] text-sm" 
                        />
                    </div>
                    <span className="text-sm text-[#EF4444] font-normal text-left flex-1">
                        Cerrar Sesión
                    </span>
                </button>
            </div>
        </div>
    );
};

export default UserDropdownMenu;