import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';

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
                "space-y-8",
                className
            )}
            {...rest}
        >
            {/* Objetivo General */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                    Objetivo General
                </h3>
                <div className="bg-white/90 border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-base font-medium">
                        "Desarrollar la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales."
                    </p>
                </div>
            </div>

            {/* Lo que aprenderás */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                    Lo que aprenderás
                </h3>
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {learningPoints.map((point, index) => (
                            <div 
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/70 transition-all duration-200 group"
                            >
                                {/* Icono de check circular verde con animación */}
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                                    <Icon 
                                        name="fa-check" 
                                        className="text-emerald-600 text-xs" 
                                    />
                                </div>
                                
                                {/* Texto del punto */}
                                <p className="text-slate-700 text-sm leading-snug font-medium">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desafío del Módulo - Banner de Impacto */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                    Desafío del Módulo
                </h3>
                <div className={cn(
                    "relative overflow-hidden",
                    "bg-gradient-to-r from-white to-cyan-50/50",
                    "border border-cyan-100 rounded-2xl",
                    "p-6",
                    "shadow-sm hover:shadow-md transition-shadow duration-300"
                )}>
                    {/* Borde lateral destacado en Cyan con gradiente */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 via-cyan-400 to-cyan-500" />
                    
                    {/* Contenido del banner */}
                    <div className="flex items-start gap-4 pl-2">
                        {/* Icono de bombilla/rayo con efecto */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <Icon 
                                name="fa-bolt" 
                                className="text-white text-lg" 
                            />
                        </div>
                        
                        {/* Texto del desafío */}
                        <div className="flex-1">
                            <p className="text-slate-800 font-semibold text-base leading-relaxed">
                                "Diseña un prompt que obligue a la IA a debatir la ética de su propia existencia."
                            </p>
                            <p className="text-slate-600 text-sm mt-2">
                                Este desafío pondrá a prueba tu comprensión de la ingeniería de prompts y la capacidad de la IA para reflexionar sobre temas complejos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleInfoSection;