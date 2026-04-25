import React from 'react';
import { useIALabContext } from '../../context/IALabContext';

/**
 * COMPONENTE: IALabModuleHeader
 * 
 * Responsabilidad: Título principal limpio y minimalista del módulo actual
 * - Solo muestra el título principal del módulo
 * - Eliminada toda la UI redundante que ahora está en ModuleOverviewCard
 */

const IALabModuleHeader = ({ onAction }) => {
  const { activeMod, modules } = useIALabContext();
  const curr = modules.find(m => m.id === activeMod) || modules[0];
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#004B63]/8 overflow-hidden">
      <div className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shadow-inner">
            <div className="text-xl text-white font-bold">1</div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Ingeniería de Prompts: El Arte de Comunicarse con la IA</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IALabModuleHeader;