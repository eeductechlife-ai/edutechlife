import React from 'react';
import { motion } from 'framer-motion';
import { useIALabProgressContext } from '../../context/IALabContext';

const IALabModuleHeader = ({ onAction }) => {
  const { activeMod, modules, courseProgress } = useIALabProgressContext();
  const curr = modules.find(m => m.id === activeMod) || modules[0];
  
  return (
    <motion.div
      whileHover={{ boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.05)] border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 hover:border-petroleum/20 dark:hover:border-petroleum/30"
    >
      <div className="bg-gradient-to-r from-petroleum to-corporate p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/15 rounded-full flex flex-col items-center justify-center shadow-inner flex-shrink-0">
            <div className="text-2xl font-bold text-white leading-none">{activeMod}</div>
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wide leading-none mt-1">Módulo</div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{curr?.title}</h1>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IALabModuleHeader;