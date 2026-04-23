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
    // Lista de "Lo que aprenderás"
    const learningPoints = [
        "Dar instrucciones claras a la IA.",
        "Mejorar cualquier pregunta para obtener mejores respuestas.",
        "Entender por qué la IA falla y cómo corregirlo.",
        "Obtener resultados útiles en menos tiempo.",
        "Aplicar la IA en estudio, trabajo y vida diaria.",
        "Pedir exactamente lo que necesita, sin rodeos."
    ];

    return (
        <div 
            className={cn(
                "bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,75,99,0.06)] border border-slate-100/50",
                "p-4",
                "space-y-2",
                className
            )}
            {...rest}
        >
            {/* Objetivo General - Ultra Compacto */}
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">
                    Objetivo General
                </h3>
                <div className="bg-white border border-slate-100 rounded-lg p-2">
                    <p className="text-slate-700 leading-tight text-[12px] font-medium">
                        "Desarrollar la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales."
                    </p>
                </div>
            </div>

            {/* Lo que aprenderás - The Knowledge Grid Micro-Compacto */}
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">
                    Lo que aprenderás
                </h3>
                <div className="bg-white border border-slate-100 rounded-lg p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                        {learningPoints.map((point, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={cn(
                                    "flex items-start gap-2 p-2",
                                    "bg-slate-50/50 border border-slate-100/50 rounded",
                                    "hover:bg-white hover:border-slate-200",
                                    "transition-all duration-150 group"
                                )}
                            >
                                {/* Icono de check circular verde micro */}
                                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors duration-150">
                                    <Icon 
                                        name="fa-check" 
                                        className="text-emerald-600 w-3 h-3" 
                                    />
                                </div>
                                
                                {/* Texto del punto - Tipografía micro */}
                                <p className="text-slate-700 text-[12px] leading-tight font-medium">
                                    {point}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desafío del Módulo - Banner Inline */}
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">
                    Desafío del Módulo
                </h3>
                <motion.div 
                    whileHover={{ scale: 1.002 }}
                    className={cn(
                        "relative overflow-hidden",
                        "flex items-center gap-2 py-1 px-3 h-10",
                        "bg-cyan-50/30 border-l-3 border-[#00BCD4]",
                        "rounded hover:bg-gradient-to-r hover:from-cyan-50/30 hover:via-white hover:to-cyan-50/30",
                        "transition-all duration-200 cursor-pointer",
                        "group"
                    )}
                >
                    {/* Efecto Shimmer ultra sutil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
                    
                    {/* Icono de bombilla micro */}
                    <div className="flex-shrink-0 w-6 h-6 p-1 rounded bg-[#00BCD4]/10 text-[#00BCD4] flex items-center justify-center">
                        <Icon 
                            name="fa-bolt" 
                            className="w-3 h-3" 
                        />
                    </div>
                    
                    {/* Texto del desafío - Impactante y ultra compacto */}
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-[12px] font-medium truncate">
                            "Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia."
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ModuleInfoSection;