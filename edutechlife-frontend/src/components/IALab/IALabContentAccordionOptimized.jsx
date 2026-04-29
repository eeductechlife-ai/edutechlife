import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../forum/forumDesignSystem';
import { 
  GlassPanel, 
  CompactTypography,
  MicroSpacing,
  ShadowSystem,
  cyanGradientBg,
  EvolvedButtons,
  WhiteCard,
  WhiteCardPanel
} from './GlassDesignSystem';
import { 
  ChevronDown, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Target,
  Zap,
  Sparkles,
  Brain,
  BarChart3
} from 'lucide-react';

/**
 * IALabContentAccordionOptimized - Versión compacta premium de lecciones
 * 
 * Características:
 * - 40% más compacto que versión original
 * - Glassmorphism evolutivo aplicado
 * - Iconos Lucide + FontAwesome combinados
 * - Estados visuales con LED indicators
 * - Animaciones framer-motion optimizadas
 * - Navegación entre lecciones compacta
 */

const IALabContentAccordionOptimized = () => {
  // Datos de lecciones optimizadas
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Introducción a la Inteligencia Artificial Generativa",
      duration: "12 min",
      status: "completed", // completed, in-progress, locked
      icon: <Brain className="w-4 h-4" />,
      content: "Comprende los fundamentos de la IA generativa y su aplicación en educación. Aprende cómo los modelos como GPT-4 transforman la creación de contenido educativo.",
      objectives: [
        "Definir IA generativa vs IA tradicional",
        "Identificar casos de uso educativo",
        "Comprender limitaciones éticas"
      ],
      type: "teoría"
    },
    {
      id: 2,
      title: "¿Qué es un Prompt?",
      duration: "15 min",
      status: "in-progress",
      icon: <Zap className="w-4 h-4" />,
      content: "Domina el arte de comunicarte con IA. Un prompt efectivo es la diferencia entre resultados genéricos y soluciones personalizadas.",
      objectives: [
        "Definir prompt en contexto IA",
        "Identificar componentes clave",
        "Ejemplos prácticos inmediatos"
      ],
      type: "práctica"
    },
    {
      id: 3,
      title: "Estructura Básica de un Prompt Efectivo",
      duration: "18 min",
      status: "locked",
      icon: <Target className="w-4 h-4" />,
      content: "Aprende la fórmula mágica: Contexto + Instrucción + Formato = Resultado preciso. Desglose paso a paso con ejemplos reales.",
      objectives: [
        "Aplicar fórmula 3-componentes",
        "Crear prompts estructurados",
        "Evaluar calidad de resultados"
      ],
      type: "teoría"
    },
    {
      id: 4,
      title: "Técnicas de Refinamiento",
      duration: "22 min",
      status: "locked",
      icon: <Sparkles className="w-4 h-4" />,
      content: "Itera y mejora tus prompts. Aprende técnicas como chain-of-thought, few-shot learning y role-playing para resultados premium.",
      objectives: [
        "Aplicar técnicas de refinamiento",
        "Iterar basado en feedback",
        "Optimizar para precisión"
      ],
      type: "práctica"
    },
    {
      id: 5,
      title: "Práctica Asistida 1: Modificando Variables",
      duration: "25 min",
      status: "locked",
      icon: <BarChart3 className="w-4 h-4" />,
      content: "Laboratorio práctico donde ajustarás variables clave en prompts reales. Feedback inmediato del sistema de evaluación.",
      objectives: [
        "Manipular 5 variables clave",
        "Analizar impacto en resultados",
        "Documentar aprendizajes"
      ],
      type: "laboratorio"
    },
    {
      id: 6,
      title: "Actividad 1: Crea tu primer Prompt",
      duration: "30 min",
      status: "locked",
      icon: <BookOpen className="w-4 h-4" />,
      content: "Proyecto final del módulo. Desarrolla un prompt completo para un caso educativo real y recibe evaluación detallada.",
      objectives: [
        "Diseñar prompt completo",
        "Aplicar todas las técnicas",
        "Presentar para evaluación"
      ],
      type: "proyecto"
    }
  ]);

  const [openAccordion, setOpenAccordion] = useState(2); // Lección 2 en progreso por defecto
  const [currentLessonIndex, setCurrentLessonIndex] = useState(1);

  // Toggle acordeón
  const toggleAccordion = (lessonId) => {
    setOpenAccordion(openAccordion === lessonId ? null : lessonId);
  };

  // Navegación entre lecciones
  const navigateLesson = (direction) => {
    if (direction === 'prev' && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (direction === 'next' && currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  // Renderizar badge de estado
  const renderStatusBadge = (status, type) => {
  const config = {
    completed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      icon: <CheckCircle className="w-3 h-3" />,
      label: "Completado"
    },
    'in-progress': {
      bg: "bg-[#00BCD4]/10",
      text: "text-[#00BCD4]",
      icon: <PlayCircle className="w-3 h-3" />,
      label: "En progreso"
    },
    locked: {
      bg: "bg-slate-100",
      text: "text-slate-500",
      icon: <Clock className="w-3 h-3" />,
      label: "Bloqueado"
    }
  };

    const typeConfig = {
      teoría: { color: "text-blue-600", bg: "bg-blue-500/10" },
      práctica: { color: "text-amber-600", bg: "bg-amber-500/10" },
      laboratorio: { color: "text-purple-600", bg: "bg-purple-500/10" },
      proyecto: { color: "text-rose-600", bg: "bg-rose-500/10" }
    };

    const statusConfig = config[status];
    const typeInfo = typeConfig[type] || { color: "text-slate-600", bg: "bg-slate-100" };

    return (
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
          statusConfig.bg,
          statusConfig.text
        )}>
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded-md text-xs font-medium",
          typeInfo.bg,
          typeInfo.color
        )}>
          {type}
        </div>
      </div>
    );
  };

  // Renderizar lección individual
  const renderLesson = (lesson) => {
    const isOpen = openAccordion === lesson.id;
    const isLocked = lesson.status === 'locked';

    return (
      <div 
        key={lesson.id}
        className={cn(
          WhiteCard.COMPACT,
          "overflow-hidden",
          "transition-all duration-200",
          isOpen && "shadow"
        )}
      >
        {/* Header del acordeón */}
        <button
          onClick={() => !isLocked && toggleAccordion(lesson.id)}
          disabled={isLocked}
          className={cn(
            "w-full flex items-center justify-between",
            "px-4 py-3",
            "transition-all duration-150",
            isLocked 
              ? "cursor-not-allowed opacity-70" 
              : "hover:bg-white/30 cursor-pointer"
          )}
        >
           <div className="flex items-center gap-3">
            {/* Número de lección */}
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              "text-sm font-bold",
              lesson.status === 'completed' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
              lesson.status === 'in-progress' ? "bg-[#00BCD4]/10 text-[#00BCD4] border border-[#00BCD4]/20" :
              "bg-slate-100 text-slate-500 border border-slate-200"
            )}>
              {lesson.id}
            </div>

            {/* Icono y título */}
            <div className="flex items-center gap-2.5">
               <div className={cn(
                "p-2 rounded-lg",
                lesson.status === 'completed' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                lesson.status === 'in-progress' ? "bg-[#00BCD4]/10 text-[#00BCD4] border border-[#00BCD4]/20" :
                "bg-slate-100 text-slate-500 border border-slate-200"
              )}>
                {lesson.icon}
              </div>
              <div className="text-left">
                 <h4 className={cn(
                  CompactTypography.SUBHEADING,
                  "text-[#004B63] font-semibold",
                  isLocked && "text-slate-500"
                )}>
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    CompactTypography.MICRO,
                    "text-slate-500",
                    "flex items-center gap-1"
                  )}>
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                  {renderStatusBadge(lesson.status, lesson.type)}
                </div>
              </div>
            </div>
          </div>

          {/* Chevron indicator */}
          {!isLocked && (
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} />
          )}
        </button>

        {/* Contenido del acordeón */}
        <AnimatePresence>
          {isOpen && !isLocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={cn(
                "px-4 pb-4 pt-2",
                "border-t border-white/20"
              )}>
                {/* Descripción */}
                <p className={cn(
                  CompactTypography.BODY,
                  "text-slate-700 mb-3"
                )}>
                  {lesson.content}
                </p>

                {/* Objetivos de aprendizaje */}
                <div className="mb-4">
                  <h5 className={cn(
                    CompactTypography.SUBHEADING,
                    "text-[#004B63] font-semibold mb-2",
                    "flex items-center gap-1.5"
                  )}>
                    <Target className="w-3.5 h-3.5 text-[#00BCD4]" />
                    Objetivos de aprendizaje
                  </h5>
                  <ul className="space-y-1.5">
                    {lesson.objectives.map((objective, idx) => (
                      <li key={idx} className={cn(
                        CompactTypography.BODY,
                        "text-slate-700",
                        "flex items-start gap-2"
                      )}>
                         <div className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mt-1.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-3 border-t border-white/20">
                   <button className={cn(
                    "px-4 py-2 rounded-xl",
                    "bg-white border border-slate-200",
                    "text-slate-700 font-medium",
                    "hover:bg-slate-50 hover:border-slate-300",
                    "transition-all duration-150",
                    "flex items-center text-sm"
                  )}>
                    <PlayCircle className="w-3.5 h-3.5 mr-1.5 text-[#00BCD4]" />
                    Ver lección
                  </button>
                  
                  <div className="flex items-center gap-2">
                     <button className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium",
                      "text-slate-600 hover:text-slate-800",
                      "bg-white border border-slate-200",
                      "hover:bg-slate-50 hover:border-slate-300",
                      "transition-all duration-150"
                    )}>
                      Materiales
                    </button>
                    <button className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium",
                      "text-[#00BCD4] hover:text-[#00BCD4]/80",
                      "bg-[#00BCD4]/10 border border-[#00BCD4]/20",
                      "hover:bg-[#00BCD4]/15 hover:border-[#00BCD4]/30",
                      "transition-all duration-150"
                    )}>
                      Ejercicios
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={WhiteCardPanel.STANDARD}>
      {/* Header premium */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={cn(
            CompactTypography.HEADING,
            "text-[#004B63] font-bold"
          )}>
            Lecciones del Módulo
          </h3>
          <p className={cn(
            CompactTypography.TINY,
            "text-slate-500 mt-0.5"
          )}>
            6 lecciones • 2h 2min total
          </p>
        </div>

        {/* Navegación premium */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateLesson('prev')}
            disabled={currentLessonIndex === 0}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-white",
              "border border-slate-200",
              "text-slate-600",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "hover:bg-slate-50 hover:border-slate-300",
              "transition-all duration-150",
              "shadow-sm"
            )}
          >
            <ChevronDown className="w-4 h-4 transform rotate-90" />
          </button>
          
          <div className={cn(
            "px-4 py-2 rounded-xl",
            "bg-[#00BCD4]/10",
            "text-[#00BCD4] text-sm font-medium",
            "border border-[#00BCD4]/20"
          )}>
            {currentLessonIndex + 1} / {lessons.length}
          </div>
          
          <button
            onClick={() => navigateLesson('next')}
            disabled={currentLessonIndex === lessons.length - 1}
            className={cn(
              "p-2.5 rounded-xl",
              "bg-white",
              "border border-slate-200",
              "text-slate-600",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "hover:bg-slate-50 hover:border-slate-300",
              "transition-all duration-150",
              "shadow-sm"
            )}
          >
            <ChevronDown className="w-4 h-4 transform -rotate-90" />
          </button>
        </div>
      </div>

      {/* Barra de progreso premium */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(CompactTypography.TINY, "text-slate-600 font-medium")}>
            Progreso del módulo
          </span>
          <span className={cn(CompactTypography.TINY, "text-[#00BCD4] font-bold")}>
            33% completado
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00BCD4] to-[#66CCCC] rounded-full"
            style={{ width: '33%' }}
          />
        </div>
      </div>

      {/* Lista de lecciones */}
      <div className="space-y-3">
        {lessons.map(lesson => renderLesson(lesson))}
      </div>

      {/* Footer premium con estadísticas */}
      <div className={cn(
        WhiteCard.COMPACT,
        "flex items-center justify-between",
        "px-6 py-4",
        "mt-6"
      )}>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={cn(CompactTypography.HEADING, "text-[#004B63] font-bold")}>
              2/6
            </div>
            <div className={cn(CompactTypography.MICRO, "text-slate-500")}>
              Completadas
            </div>
          </div>
          
          <div className="text-center">
            <div className={cn(CompactTypography.HEADING, "text-[#004B63] font-bold")}>
              1h 2min
            </div>
            <div className={cn(CompactTypography.MICRO, "text-slate-500")}>
              Restante
            </div>
          </div>
        </div>

        <button className={cn(
          "px-5 py-2.5 rounded-xl",
          "bg-gradient-to-r from-[#00BCD4] to-[#66CCCC]",
          "text-white font-medium",
          "hover:shadow-lg hover:shadow-[#00BCD4]/20",
          "transition-all duration-200",
          "flex items-center"
        )}>
          <PlayCircle className="w-4 h-4 mr-2" />
          Continuar lección
        </button>
      </div>
    </div>
  );
};

export default IALabContentAccordionOptimized;