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
    // Lista de "Lo que aprenderás" - 4 más impactantes
    const learningPoints = [
        "Dar instrucciones claras a la IA.",
        "Mejorar cualquier pregunta para obtener mejores respuestas.",
        "Entender por qué la IA falla y cómo corregirlo.",
        "Aplicar la IA en estudio, trabajo y vida diaria."
    ];

    return (
        <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative z-10 bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] p-5 md:p-8 overflow-hidden",
                "space-y-6",
                className
            )}
            {...rest}
        >
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none"></div>

            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

            {/* Objetivo General */}
            <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-[#004B63]">
                    Objetivo General
                </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        Desarrollar la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales.
                    </p>
            </div>

            {/* Lo que aprenderás - Knowledge Grid */}
            <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-[#004B63]">
                    Lo que aprenderás
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {learningPoints.map((point, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            className={cn(
                                "flex items-start gap-3 px-4 py-3 rounded-lg",
                                "bg-slate-50 border border-slate-100",
                                "hover:bg-white hover:border-[#004B63]/25 hover:shadow-sm hover:scale-[1.02]",
                                "transition-all duration-300 group"
                            )}
                        >
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#004B63]/10 flex items-center justify-center group-hover:bg-[#004B63]/15 transition-colors mt-0.5">
                                <Icon 
                                    name="fa-check" 
                                    className="text-[#004B63] w-2.5 h-2.5" 
                                />
                            </div>
                            <p className="text-sm text-slate-700 leading-snug font-medium">
                                {point}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Desafío del Módulo */}
            <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-[#004B63]">
                    Desafío del Módulo
                </h3>
                <motion.div 
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className={cn(
                        "relative overflow-hidden",
                        "flex items-center gap-3",
                        "hover:scale-[1.01]",
                        "transition-all duration-300 cursor-pointer",
                        "group"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-[#004B63]/10 flex items-center justify-center">
                        <Icon 
                            name="fa-bolt" 
                            className="text-[#004B63] w-3 h-3" 
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 font-medium truncate">
                            Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ModuleInfoSection;
