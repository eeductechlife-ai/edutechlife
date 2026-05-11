import React from 'react';
import { motion } from 'framer-motion';
import { useIALabContext } from '../../context/IALabContext';

const IALabModuleHeader = ({ onAction }) => {
  const { activeMod, modules, courseProgress } = useIALabContext();
  const curr = modules.find(m => m.id === activeMod) || modules[0];
  
  return (
    <motion.div
      whileHover={{ boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.05)] border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 hover:border-petroleum/20 dark:hover:border-petroleum/30"
    >
      <div className="bg-gradient-to-r from-petroleum to-corporate p-5 md:p-6">
        <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
          <span>IA Lab</span>
          <svg className="w-2.5 h-2.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span>Módulo {activeMod}</span>
          <svg className="w-2.5 h-2.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span className="text-white/80 font-medium">{curr?.title}</span>
          <span className="ml-auto text-white/40 text-[10px]">{Math.round(courseProgress)}% del curso</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shadow-inner">
            <div className="text-xl text-white font-bold">{activeMod}</div>
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