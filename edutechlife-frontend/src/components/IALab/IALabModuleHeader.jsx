import React from 'react';
import { motion } from 'framer-motion';
import { useIALabContext } from '../../context/IALabContext';

const IALabModuleHeader = ({ onAction }) => {
  const { activeMod, modules } = useIALabContext();
  const curr = modules.find(m => m.id === activeMod) || modules[0];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.05)] border border-slate-100 overflow-hidden"
    >
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
    </motion.div>
  );
};

export default IALabModuleHeader;