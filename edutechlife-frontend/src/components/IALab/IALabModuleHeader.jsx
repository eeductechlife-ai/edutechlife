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
    <div className="bg-gradient-to-br from-white via-white/95 to-[#F8FAFC] border border-[#E2E8F0]/50 shadow-[0_8px_40px_rgba(0,75,99,0.08)] rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <div className="text-2xl text-white font-bold">IA</div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Ingeniería de Prompts: El Arte de Comunicarse con la IA</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IALabModuleHeader;