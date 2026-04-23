/**
 * COMPONENTE: QueEsPrompt_OVA_Original
 * 
 * OVA (Objeto Virtual de Aprendizaje) - Infografía Interactiva: Prompt Engineering
 * Código HTML original con iconos de 🧠, ✨, 📋
 * 
 * Características:
 * - Infografía interactiva sobre anatomía de un prompt
 * - Iconos originales: 🧠 (Cerebro), ✨ (Brillo), 📋 (Clipboard)
 * - Diseño visual premium Edutechlife
 * - Elementos interactivos con hover
 * - Navegación intuitiva
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';

/**
 * Componente principal QueEsPrompt_OVA_Original
 */
const QueEsPrompt_OVA_Original = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const [completedSteps, setCompletedSteps] = useState([]);

  // Datos de la infografía interactiva
  const infographicData = {
    intro: {
      title: "🧠 ¿Qué es un Prompt?",
      description: "Instrucción o consulta que damos a un modelo de IA para obtener una respuesta específica.",
      content: `
        <div class="space-y-4">
          <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
            <h3 class="font-bold text-blue-800 text-lg mb-3">Definición Esencial</h3>
            <p class="text-blue-700">Un <strong>prompt</strong> es la forma de comunicarnos con modelos de IA como ChatGPT, Midjourney o DALL-E.</p>
            <p class="text-blue-700 mt-2">Es el 'lenguaje' que usamos para decirle a la IA <strong>qué queremos que haga</strong>.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">✨</span>
                <h4 class="font-bold text-green-800">Ejemplos Simples</h4>
              </div>
              <ul class="space-y-2 text-green-700">
                <li class="flex items-center gap-2">
                  <Icon name="fa-check" class="text-green-500 w-4 h-4" />
                  "Traduce este texto al inglés"
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="fa-check" class="text-green-500 w-4 h-4" />
                  "Genera una imagen de un paisaje montañoso"
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="fa-check" class="text-green-500 w-4 h-4" />
                  "Analiza estos datos y crea un gráfico"
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">📋</span>
                <h4 class="font-bold text-purple-800">Analogía</h4>
              </div>
              <p class="text-purple-700">
                Piensa en un prompt como <strong>dar instrucciones a un asistente muy inteligente pero literal</strong>.
              </p>
              <p class="text-purple-700 mt-2">
                Necesita <strong>claridad y precisión</strong> para entender exactamente lo que quieres.
              </p>
            </div>
          </div>
        </div>
      `
    },
    anatomy: {
      title: "✨ Anatomía de un Prompt Efectivo",
      description: "Los 4 componentes esenciales que todo buen prompt debe tener.",
      content: `
        <div class="space-y-6">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-slate-800 mb-2">Los 4 Pilares del Prompt Perfecto</h3>
            <p class="text-slate-600">Cada componente cumple una función específica para obtener resultados óptimos</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Componente 1: Contexto -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 hover:border-blue-300 transition-colors duration-300">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span class="text-white text-xl">1</span>
                </div>
                <div>
                  <h4 class="font-bold text-blue-800 text-lg">Contexto</h4>
                  <p class="text-blue-600 text-sm">Información de fondo necesaria</p>
                </div>
              </div>
              <p class="text-blue-700 mb-4">
                Proporciona el <strong>escenario, rol o información de fondo</strong> que la IA necesita para entender la tarea.
              </p>
              <div class="bg-white/50 p-4 rounded-xl border border-blue-100">
                <p class="text-sm text-blue-800 font-medium">Ejemplo:</p>
                <p class="text-blue-700 text-sm italic">"Eres un experto en marketing digital con 10 años de experiencia..."</p>
              </div>
            </div>
            
            <!-- Componente 2: Instrucción -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 hover:border-green-300 transition-colors duration-300">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span class="text-white text-xl">2</span>
                </div>
                <div>
                  <h4 class="font-bold text-green-800 text-lg">Instrucción</h4>
                  <p class="text-green-600 text-sm">La acción específica a realizar</p>
                </div>
              </div>
              <p class="text-green-700 mb-4">
                Describe <strong>exactamente qué quieres que haga la IA</strong>, de forma clara y directa.
              </p>
              <div class="bg-white/50 p-4 rounded-xl border border-green-100">
                <p class="text-sm text-green-800 font-medium">Ejemplo:</p>
                <p class="text-green-700 text-sm italic">"Escribe un guión para un video de 60 segundos sobre..."</p>
              </div>
            </div>
            
            <!-- Componente 3: Formato -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 hover:border-purple-300 transition-colors duration-300">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span class="text-white text-xl">3</span>
                </div>
                <div>
                  <h4 class="font-bold text-purple-800 text-lg">Formato</h4>
                  <p class="text-purple-600 text-sm">Cómo estructurar la respuesta</p>
                </div>
              </div>
              <p class="text-purple-700 mb-4">
                Especifica <strong>cómo quieres que se estructure la respuesta</strong> (longitud, estilo, elementos).
              </p>
              <div class="bg-white/50 p-4 rounded-xl border border-purple-100">
                <p class="text-sm text-purple-800 font-medium">Ejemplo:</p>
                <p class="text-purple-700 text-sm italic">"Usa bullet points, incluye un título llamativo, máximo 500 palabras..."</p>
              </div>
            </div>
            
            <!-- Componente 4: Restricciones -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 hover:border-amber-300 transition-colors duration-300">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span class="text-white text-xl">4</span>
                </div>
                <div>
                  <h4 class="font-bold text-amber-800 text-lg">Restricciones</h4>
                  <p class="text-amber-600 text-sm">Límites o condiciones</p>
                </div>
              </div>
              <p class="text-amber-700 mb-4">
                Establece <strong>límites, condiciones o elementos a evitar</strong> en la respuesta.
              </p>
              <div class="bg-white/50 p-4 rounded-xl border border-amber-100">
                <p class="text-sm text-amber-800 font-medium">Ejemplo:</p>
                <p class="text-amber-700 text-sm italic">"No uses tecnicismos, mantén un tono profesional, evita mencionar marcas..."</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 mt-8">
            <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Icon name="fa-lightbulb" class="text-amber-500" />
              Consejo Práctico
            </h4>
            <p class="text-slate-700">
              Un prompt efectivo combina estos 4 componentes de forma equilibrada. 
              <strong>Empieza con Contexto, define la Instrucción, especifica el Formato y establece Restricciones claras.</strong>
            </p>
          </div>
        </div>
      `
    },
    types: {
      title: "📋 Tipos de Prompts",
      description: "Diferentes categorías según el objetivo y complejidad.",
      content: `
        <div class="space-y-8">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-slate-800 mb-2">Clasificación por Objetivo</h3>
            <p class="text-slate-600">Selecciona el tipo de prompt según lo que necesites lograr</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Tipo 1: Instructivos -->
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Icon name="fa-terminal" class="text-white text-xl" />
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Directo</span>
              </div>
              <h4 class="font-bold text-blue-800 text-lg mb-3">Instructivos</h4>
              <p class="text-blue-700 mb-4">
                Dan <strong>órdenes directas y específicas</strong> para tareas concretas.
              </p>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-blue-600">
                  <Icon name="fa-check-circle" class="text-blue-500 w-4 h-4" />
                  <span>Tareas técnicas</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-blue-600">
                  <Icon name="fa-check-circle" class="text-blue-500 w-4 h-4" />
                  <span>Análisis de datos</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-blue-600">
                  <Icon name="fa-check-circle" class="text-blue-500 w-4 h-4" />
                  <span>Traducción</span>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-blue-100">
                <p class="text-sm text-blue-800 font-medium">Ejemplo:</p>
                <p class="text-blue-700 text-sm italic">"Calcula el ROI de esta campaña de marketing"</p>
              </div>
            </div>
            
            <!-- Tipo 2: Creativos -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Icon name="fa-palette" class="text-white text-xl" />
                </div>
                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Original</span>
              </div>
              <h4 class="font-bold text-purple-800 text-lg mb-3">Creativos</h4>
              <p class="text-purple-700 mb-4">
                Buscan <strong>generar contenido original</strong> e ideas innovadoras.
              </p>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-purple-600">
                  <Icon name="fa-check-circle" class="text-purple-500 w-4 h-4" />
                  <span>Escritura creativa</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-purple-600">
                  <Icon name="fa-check-circle" class="text-purple-500 w-4 h-4" />
                  <span>Diseño gráfico</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-purple-600">
                  <Icon name="fa-check-circle" class="text-purple-500 w-4 h-4" />
                  <span>Brainstorming</span>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-purple-100">
                <p class="text-sm text-purple-800 font-medium">Ejemplo:</p>
                <p class="text-purple-700 text-sm italic">"Escribe un poema sobre la inteligencia artificial"</p>
              </div>
            </div>
            
            <!-- Tipo 3: Analíticos -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Icon name="fa-chart-line" class="text-white text-xl" />
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Profundo</span>
              </div>
              <h4 class="font-bold text-green-800 text-lg mb-3">Analíticos</h4>
              <p class="text-green-700 mb-4">
                Piden <strong>análisis, evaluación o interpretación</strong> de información.
              </p>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-green-600">
                  <Icon name="fa-check-circle" class="text-green-500 w-4 h-4" />
                  <span>Análisis de texto</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-green-600">
                  <Icon name="fa-check-circle" class="text-green-500 w-4 h-4" />
                  <span>Evaluación de calidad</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-green-600">
                  <Icon name="fa-check-circle" class="text-green-500 w-4 h-4" />
                  <span>Comparación de opciones</span>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-green-100">
                <p class="text-sm text-green-800 font-medium">Ejemplo:</p>
                <p class="text-green-700 text-sm italic">"Analiza las fortalezas y debilidades de este plan de negocios"</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
            <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Icon name="fa-star" class="text-amber-500" />
              Recomendación
            </h4>
            <p class="text-slate-700">
              <strong>Combina tipos según sea necesario</strong>. Por ejemplo, un prompt puede ser <em>instructivo</em> para definir la tarea 
              y <em>creativo</em> para el estilo de respuesta. La flexibilidad es clave para obtener los mejores resultados.
            </p>
          </div>
        </div>
      `
    }
  };

  // Tabs de navegación
  const tabs = [
    { id: 'intro', label: '🧠 Introducción', icon: 'fa-brain' },
    { id: 'anatomy', label: '✨ Anatomía', icon: 'fa-puzzle-piece' },
    { id: 'types', label: '📋 Tipos', icon: 'fa-layer-group' }
  ];

  // Marcar paso como completado
  const markStepCompleted = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full h-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-[#004B63] to-[#006D8F]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Infografía Interactiva: Prompt Engineering</h2>
              <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                <span>OVA Interactivo</span>
                <span>•</span>
                <span>3 secciones</span>
                <span>•</span>
                <span>15 minutos estimados</span>
              </div>
            </div>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-[#004B63] hover:bg-slate-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium shadow-sm"
            aria-label="Cerrar OVA y volver al dashboard"
          >
            <Icon name="fa-times" className="w-4 h-4" />
            Cerrar OVA
          </button>
        </div>

        {/* Navegación por tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-6 py-4 flex items-center justify-center gap-3 transition-all duration-200",
                "border-b-2 font-medium",
                activeTab === tab.id
                  ? "border-[#00BCD4] text-[#004B63] bg-white"
                  : "border-transparent text-slate-600 hover:text-[#004B63] hover:bg-white/50"
              )}
            >
              <Icon name={tab.icon} className={cn(
                "w-5 h-5",
                activeTab === tab.id ? "text-[#00BCD4]" : "text-slate-500"
              )} />
              <span>{tab.label}</span>
              {completedSteps.includes(tab.id) && (
                <span className="ml-2 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Título de la sección */}
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold text-[#004B63] mb-3">
                {infographicData[activeTab].title}
              </h3>
              <p className="text-slate-600 text-lg">
                {infographicData[activeTab].description}
              </p>
            </div>

            {/* Contenido HTML */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: infographicData[activeTab].content }}
            />

            {/* Botón para marcar como completado */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex justify-center">
              <button
                onClick={() => markStepCompleted(activeTab)}
                className={cn(
                  "px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3",
                  completedSteps.includes(activeTab)
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-[#00BCD4] text-white hover:bg-[#00BCD4]/90 hover:scale-105"
                )}
              >
                {completedSteps.includes(activeTab) ? (
                  <>
                    <Icon name="fa-check-circle" className="w-5 h-5" />
                    Sección Completada
                  </>
                ) : (
                  <>
                    <Icon name="fa-check" className="w-5 h-5" />
                    Marcar esta sección como completada
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer con progreso */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Progreso:</span>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00BCD4] to-[#004B63] rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.length / tabs.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {completedSteps.length} de {tabs.length} secciones
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200",
                  tabs.findIndex(tab => tab.id === activeTab) === 0
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon name="fa-chevron-left" className="w-4 h-4" />
                Anterior
              </button>
              
              <div className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium">
                {tabs.findIndex(tab => tab.id === activeTab) + 1} / {tabs.length}
              </div>
              
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200",
                  tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                Siguiente
                <Icon name="fa-chevron-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QueEsPrompt_OVA_Original;