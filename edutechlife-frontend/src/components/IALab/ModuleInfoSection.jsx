import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { motion } from 'framer-motion';

/**
 * Sección Informativa del Módulo - Ingeniería de Prompts
 * Contiene: Objetivo General, Lo que aprenderás, Desafío del Módulo
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 */
const ModuleInfoSection = ({ className = '', ...rest }) => {
    const learningPoints = [
        { text: "Instrucciones claras a la IA", icon: "fa-bullseye" },
        { text: "Mejorar preguntas y respuestas", icon: "fa-wand-magic-sparkles" },
        { text: "Detectar y corregir errores", icon: "fa-exclamation-triangle" },
        { text: "Aplicar IA en estudio y trabajo", icon: "fa-rocket" }
    ];

    return (
        <motion.div 
            whileHover={{ scale: 1.01, y: -2, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative z-10 bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] overflow-hidden",
                className
            )}
            {...rest}
        >
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#004B63]/5 to-[#00BCD4]/3 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-[#004B63]/3 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none"></div>

            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

            {/* Contenido principal */}
            <div className="p-4 md:p-6">
                {/* Header con objetivo */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] shadow-md shadow-[#004B63]/15 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-bullseye" className="text-base text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-[#004B63] uppercase tracking-wider">
                            Objetivo del Módulo
                        </h3>
                        <p className="text-sm text-slate-600 leading-snug mt-1">
                            Desarrolla habilidades de <span className="font-semibold text-[#004B63]">prompt engineering</span> para obtener resultados precisos de la IA en contextos reales.
                        </p>
                    </div>
                </div>

                {/* Divider sutil */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#004B63]/10 to-transparent mb-4"></div>

                {/* Lo que aprenderás */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Lo que aprenderás
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {learningPoints.map((point, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50/80 border border-slate-100"
                            >
                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                                    <Icon 
                                        name={point.icon} 
                                        className="text-[#004B63] text-xs" 
                                    />
                                </div>
                                <p className="text-sm text-slate-700 font-medium leading-tight">
                                    {point.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ModuleInfoSection;
