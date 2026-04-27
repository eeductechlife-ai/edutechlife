import React from 'react';
import { Bell } from 'lucide-react';
import { Icon } from '../../utils/iconMapping.jsx';
import UserDropdownMenuSimplified from '../UserDropdownMenuSimplified';
import { useIALabContext } from '../../context/IALabContext';

const IALabHeader = () => {
  const {
    completedModules,
    user,
    onBack
  } = useIALabContext();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 w-full">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-xl flex items-center justify-center shadow-sm shadow-[#004B63]/15">
          <Icon name="fa-flask-vial" className="text-white text-sm" />
        </div>
        <h1 className="text-lg font-bold text-[#004B63] tracking-tight">Introducción a la I.A Generativa</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-[#004B63]/8 border border-[#004B63]/15 text-[#004B63] rounded-lg font-semibold text-xs">
          {completedModules.length}/5 Módulos
        </div>
        <button
          className="relative flex items-center justify-center p-2 bg-transparent hover:opacity-80 transition-opacity"
          aria-label="Notificaciones"
        >
          <Bell className="w-6 h-6 text-[#06B6D4]" />
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
            3
          </span>
        </button>
        <UserDropdownMenuSimplified
          onNavigate={(view) => {
            if (view === 'landing') {
              onBack && onBack();
            } else if (view === 'certificados') {
              alert('Sistema de certificados:\n\n• Certificado VAK Básico\n• Certificado VAK Avanzado\n• Certificado EdutechLife Pro\n\nLos certificados se generan automáticamente al completar cursos.');
            }
          }}
        />
      </div>
    </header>
  );
};

export default IALabHeader;
