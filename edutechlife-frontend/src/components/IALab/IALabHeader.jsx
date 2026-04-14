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

      {/* Encabezado Global */}
      <header className="w-full fixed top-0 left-0 z-[60] h-20 bg-gradient-to-r from-white via-white/98 to-white/95 backdrop-blur-xl border-b border-slate-100/80 px-10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,55,74,0.08)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00374A] via-[#00BCD4] to-[#4DA8C4] rounded-xl flex items-center justify-center shadow-sm">
              <Icon name="fa-flask-vial" className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-[#00374A] tracking-tight">IA Lab Pro</h1>
              <p className="text-sm text-slate-600 font-normal leading-relaxed">Hyper-Intelligence Certification</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-cyan-50/40 backdrop-blur-md border border-cyan-100/50 text-cyan-700 rounded-full hover:bg-cyan-50/60 hover:scale-[1.02] hover:shadow-sm transition-all duration-500 ease-out">
            <span className="text-sm font-semibold">{completedModules.length}/5 Módulos</span>
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