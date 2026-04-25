import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import { useIALabContext } from '../../context/IALabContext';

/**
 * COMPONENTE: IALabHeader
 * 
 * Responsabilidad: Header principal de la aplicación
 * - Logo IA Lab Pro + título
 * - Badge de progreso "X/5 Módulos"
 * - Dropdown de usuario (UserDropdownMenu)
 * - Estructura idéntica al original
 */

const IALabHeader = () => {
  const {
    completedModules,
    user,
    onBack
  } = useIALabContext();
  
  return (
    <>
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Encabezado Global - NO fixed, parte del flujo flexbox */}
        <header className="relative z-50 w-full h-18 shrink-0 bg-gradient-to-r from-white via-white/99 to-[#F8FAFC]/98 backdrop-blur-xl border-b border-[#004B63]/8 px-6 md:px-10 flex items-center justify-between shadow-[0_4px_24px_rgba(0,75,99,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-xl flex items-center justify-center shadow-md shadow-[#004B63]/20">
              <Icon name="fa-flask-vial" className="text-white text-sm" />
            </div>
            <div>
              <h1 className="font-bold text-xl md:text-2xl text-[#00374A] tracking-tight font-sans">IA Lab Pro</h1>
              <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">Hyper-Intelligence Certification</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#004B63]/8 backdrop-blur-md border border-[#004B63]/15 text-[#004B63] rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#004B63]/12 hover:shadow-sm">
            <span>{completedModules.length}/5 Módulos</span>
          </div>
          
          {/* Botón de Perfil de Usuario - Componente Premium 100% Funcional */}
          <UserDropdownMenuSimplified 
            onNavigate={(view) => {
              console.log('Navegando a:', view);
              if (view === 'landing') {
                onBack && onBack();
              } else if (view === 'certificados') {
                // Para certificados, mostrar información
                alert('Sistema de certificados:\n\n• Certificado VAK Básico\n• Certificado VAK Avanzado\n• Certificado EdutechLife Pro\n\nLos certificados se generan automáticamente al completar cursos.');
              }
              // Para otras vistas, el componente maneja sus propios modales
            }}
          />
        </div>
      </header>
    </>
  );
};

export default IALabHeader;