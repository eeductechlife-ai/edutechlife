import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

/**
 * COMPONENTE: LessonCardDetailed
 * 
 * Tarjeta premium detallada para lecciones del módulo 'Ingeniería de Prompts'
 * Diseño inspirado en OVA Interactivo con estructura SaaS Premium
 * 
 * @param {Object} props
 * @param {Object} props.lesson - Datos de la lección
 * @param {number} props.lessonId - ID de la lección (1-6)
 * @param {boolean} props.isOpen - Estado de acordeón abierto/cerrado
 * @param {Function} props.onToggle - Función para toggle acordeón
 * @param {Function} props.renderContent - Función para renderizar contenido específico
 * @param {boolean} props.isTouchDevice - Si es dispositivo táctil
 * @returns {JSX.Element}
 */
const LessonCardDetailed = ({ 
  lesson, 
  lessonId, 
  isOpen, 
  onToggle, 
  renderContent,
  isTouchDevice 
}) => {
  // Colores de tema según ID de lección
  const themeColors = {
    1: { // Zero-Shot Prompting
      primary: '#FFD166', // Amarillo
      gradient: 'from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      badge: 'bg-yellow-100 text-yellow-800',
      button: 'bg-yellow-500 hover:bg-yellow-600'
    },
    2: { // Chain-of-Thought
      primary: '#4F46E5', // Índigo
      gradient: 'from-indigo-50 to-violet-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      badge: 'bg-indigo-100 text-indigo-800',
      button: 'bg-indigo-500 hover:bg-indigo-600'
    },
    3: { // Tono y Estilo
      primary: '#10B981', // Verde
      gradient: 'from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800',
      button: 'bg-emerald-500 hover:bg-emerald-600'
    },
    4: { // Integridad Académica
      primary: '#EF4444', // Rojo
      gradient: 'from-red-50 to-rose-50',
      border: 'border-red-200',
      text: 'text-red-800',
      badge: 'bg-red-100 text-red-800',
      button: 'bg-red-500 hover:bg-red-600'
    },
    5: { // Framework Edutechlife
      primary: '#8B5CF6', // Púrpura
      gradient: 'from-purple-50 to-violet-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-800',
      button: 'bg-purple-500 hover:bg-purple-600'
    },
    6: { // Proyecto Final
      primary: '#06B6D4', // Cian
      gradient: 'from-cyan-50 to-blue-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      badge: 'bg-cyan-100 text-cyan-800',
      button: 'bg-cyan-500 hover:bg-cyan-600'
    }
  };

  const colors = themeColors[lessonId] || themeColors[1];

  // Píldoras informativas por tema
  const infoPills = {
    1: ['Guía Práctica - 3 Ejemplos', 'Análisis de Casos', 'Recursos Adicionales'],
    2: ['Ejercicio Paso a Paso', 'Diagrama de Razonamiento', 'Plantilla Descargable'],
    3: ['Guía de Estilos', 'Ejemplos de Tono', 'Plantilla de Voz'],
    4: ['Checklist de Integridad', 'Herramientas de Detección', 'Casos de Estudio'],
    5: ['Framework RTF', 'Plantilla Estructurada', 'Ejemplos Avanzados'],
    6: ['Plantilla de Proyecto', 'Rúbrica de Evaluación', 'Ejemplos de Éxito']
  };

  // Textos de botón por tema
  const buttonTexts = {
    1: 'Iniciar Lección',
    2: 'Ejecutar Ejercicio',
    3: 'Explorar Estilos',
    4: 'Ver Checklist',
    5: 'Aplicar Framework',
    6: 'Abrir OVA Interactivo'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white
        border ${colors.border}
        shadow-[0px_4px_16px_rgba(17,17,26,0.05)]
        rounded-2xl overflow-hidden
        ${isOpen ? 'ring-2 ring-[#004B63]/15' : ''}
      `}
      style={{
        animationDelay: `${(lessonId - 1) * 0.1}s`,
        animationFillMode: 'both'
      }}
    >
      {/* HEADER DE LA TARJETA - DISEÑO PREMIUM */}
      <button
        onClick={() => onToggle(lessonId)}
        className="w-full flex items-start justify-between p-5 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-[#004B63]/30 focus:ring-offset-2 rounded-2xl"
        aria-expanded={isOpen}
        aria-controls={`lesson-content-${lessonId}`}
      >
        {/* CONTENIDO IZQUIERDA: Icono, número y título */}
        <div className="flex items-start gap-4 md:gap-6 flex-1">
          {/* ICONO DE TEMA CON DEGRADADO */}
          <div className={`
            w-16 h-16 md:w-20 md:h-20 
            rounded-2xl md:rounded-3xl 
            flex items-center justify-center 
            flex-shrink-0
            bg-gradient-to-br ${colors.gradient}
            border-2 ${colors.border}
            shadow-lg
            transition-all duration-300
            ${isOpen ? 'scale-105 rotate-3' : ''}
          `}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center shadow-inner">
              <Icon 
                name={lesson.icon} 
                className={`text-2xl md:text-3xl ${colors.text}`}
              />
            </div>
          </div>
          
          {/* TÍTULO Y DESCRIPCIÓN DETALLADA */}
          <div className="flex-1 min-w-0">
            {/* NÚMERO DE TEMA Y BADGE */}
            <div className="flex items-center gap-3 mb-2">
              <div className={`
                px-3 py-1 rounded-full 
                ${colors.badge}
                text-sm font-bold
                shadow-sm
              `}>
                TEMA {lessonId}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${lesson.badgeColor}`}>
                {lesson.format}
              </span>
            </div>
            
            {/* TÍTULO PRINCIPAL */}
            <h3 className="text-xl md:text-2xl font-bold text-[#00374A] mb-2 md:mb-3 leading-tight">
              {lesson.title}
            </h3>
            
            {/* DESCRIPCIÓN DETALLADA */}
             <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3">
               {lesson.detailedDescription || lesson.description}
             </p>
            
            {/* METADATOS Y PÍLDORAS INFORMATIVAS */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* DURACIÓN */}
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Icon name="fa-clock" className="text-sm" />
                <span className="font-medium">{lesson.duration}</span>
              </div>
              
              {/* PÍLDORAS INFORMATIVAS */}
              {infoPills[lessonId]?.map((pill, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#004B63]/5 text-[#004B63] border border-[#004B63]/10"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* CONTENIDO DERECHA: Botón y chevron */}
        <div className="flex flex-col items-end gap-4 ml-4">
          {/* BOTÓN DE ACCIÓN */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Aquí iría la lógica específica para cada acción
              console.log(`Acción para tema ${lessonId}: ${buttonTexts[lessonId]}`);
            }}
            className={`
              px-4 py-2 md:px-6 md:py-3 
              rounded-xl md:rounded-2xl
              text-white font-semibold text-sm md:text-base
              ${colors.button}
              shadow-md hover:shadow-lg
              transition-all duration-300
              transform hover:scale-105
              whitespace-nowrap
            `}
          >
            {buttonTexts[lessonId]}
          </button>
          
          {/* ICONO CHEVRON ANIMADO */}
          <Icon 
            name={isOpen ? 'fa-chevron-down' : 'fa-chevron-right'} 
               className={`
                 text-lg transition-all duration-300 
                 ${isOpen ? 'text-[#004B63] rotate-0' : 'text-slate-400'}
                 hover:text-[#004B63]
                 md:text-xl
               `}
          />
        </div>
      </button>
      
      {/* CONTENIDO EXPANDIDO CON ANIMACIÓN FRAMER-MOTION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: isTouchDevice ? 0.2 : 0.3,
              ease: 'easeInOut'
            }}
            className="overflow-hidden"
            id={`lesson-content-${lessonId}`}
          >
            {/* BLOQUE DE CONTENIDO INTERACTIVO CON FONDO GRIS CLARO */}
            <div className={`
              mt-4 mx-6 mb-6 md:mx-8 md:mb-8
              bg-gradient-to-br from-slate-50 to-slate-100/80
              border border-slate-200
              rounded-2xl
              overflow-hidden
            `}>
              {/* CONTENIDO ESPECÍFICO DE LA LECCIÓN */}
              <div className="p-6 md:p-8">
                {renderContent && renderContent(lessonId)}
              </div>
              
              {/* PIE DE TARJETA CON ACCIONES ADICIONALES */}
              <div className="px-6 md:px-8 py-4 bg-white/50 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon name="fa-lightbulb" className="text-amber-500" />
                    <span>Contenido premium de Edutechlife</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Acción secundaria (ej: marcar como completado)
                      console.log(`Marcar tema ${lessonId} como completado`);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Marcar como completado
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LessonCardDetailed;