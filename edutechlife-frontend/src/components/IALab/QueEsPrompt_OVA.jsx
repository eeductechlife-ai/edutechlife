/**
 * COMPONENTE: QueEsPrompt_OVA
 * 
 * OVA (Objeto Virtual de Aprendizaje) - Infografía Interactiva: Prompt Engineering
 * 
 * Características:
 * - Infografía interactiva sobre anatomía de un prompt
 * - Visualización a pantalla completa
 * - Elementos interactivos con hover y clic
 * - Diseño visual premium Edutechlife
 * - Navegación intuitiva
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';

/**
 * Componente principal QueEsPrompt_OVA
 */
const QueEsPrompt_OVA = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);

  // Secciones de la infografía interactiva
  const sections = [
    {
      id: 0,
      title: "¿Qué es un Prompt?",
      description: "Instrucción o consulta que damos a un modelo de IA para obtener una respuesta específica.",
      color: "from-blue-500 to-cyan-400",
      icon: "fa-comment-dots",
      interactive: true,
      content: {
        definition: "Un prompt es la forma de comunicarnos con modelos de IA como ChatGPT, Midjourney o DALL-E. Es el 'lenguaje' que usamos para decirle a la IA qué queremos que haga.",
        examples: [
          "Traduce este texto al inglés",
          "Genera una imagen de un paisaje montañoso al atardecer",
          "Analiza estos datos y crea un gráfico",
          "Escribe un correo profesional para solicitar una reunión"
        ],
        analogy: "Piensa en un prompt como dar instrucciones a un asistente muy inteligente pero literal. Necesita claridad y precisión."
      }
    },
    {
      id: 1,
      title: "Anatomía de un Prompt Efectivo",
      description: "Los 4 componentes esenciales que todo buen prompt debe tener.",
      color: "from-purple-500 to-pink-400",
      icon: "fa-puzzle-piece",
      interactive: true,
      content: {
        components: [
          {
            name: "Contexto",
            description: "Información de fondo necesaria para entender la tarea",
            example: "Eres un experto en marketing digital con 10 años de experiencia..."
          },
          {
            name: "Instrucción",
            description: "La acción específica que quieres que realice la IA",
            example: "Escribe un guión para un video de 60 segundos sobre..."
          },
          {
            name: "Formato",
            description: "Cómo quieres que se estructure la respuesta",
            example: "Usa bullet points, incluye un título llamativo, máximo 500 palabras..."
          },
          {
            name: "Restricciones",
            description: "Límites o condiciones para la respuesta",
            example: "No uses tecnicismos, mantén un tono profesional, evita mencionar marcas específicas..."
          }
        ]
      }
    },
    {
      id: 2,
      title: "Tipos de Prompts",
      description: "Diferentes categorías según el objetivo y complejidad.",
      color: "from-green-500 to-emerald-400",
      icon: "fa-layer-group",
      interactive: true,
      content: {
        types: [
          {
            name: "Instructivos",
            description: "Dan órdenes directas y específicas",
            useCase: "Tareas técnicas, análisis, traducción",
            example: "Calcula el ROI de esta campaña de marketing"
          },
          {
            name: "Creativos",
            description: "Buscan generar contenido original",
            useCase: "Escritura, diseño, brainstorming",
            example: "Escribe un poema sobre la inteligencia artificial"
          },
          {
            name: "Analíticos",
            description: "Piden análisis o evaluación",
            useCase: "Revisión, comparación, diagnóstico",
            example: "Analiza las fortalezas y debilidades de este texto"
          },
          {
            name: "Conversacionales",
            description: "Simulan diálogo o consulta",
            useCase: "Tutoría, consultoría, soporte",
            example: "Explícame como si tuviera 10 años cómo funciona un transformer"
          }
        ]
      }
    },
    {
      id: 3,
      title: "Técnicas Avanzadas",
      description: "Estrategias para obtener mejores resultados.",
      color: "from-amber-500 to-orange-400",
      icon: "fa-magic-wand-sparkles",
      interactive: true,
      content: {
        techniques: [
          {
            name: "Few-Shot Prompting",
            description: "Proveer ejemplos antes de la tarea",
            benefit: "Mejora la precisión y alinea expectativas",
            example: "Ejemplo 1: [input] → [output]\nEjemplo 2: [input] → [output]\nAhora para: [nuevo input]"
          },
          {
            name: "Chain of Thought",
            description: "Pedir que explique su razonamiento paso a paso",
            benefit: "Resultados más lógicos y verificables",
            example: "Primero piensa en los pasos, luego da la respuesta final"
          },
          {
            name: "Role Playing",
            description: "Asignar un rol o perspectiva específica",
            benefit: "Respuestas más contextualizadas y expertas",
            example: "Actúa como un profesor de física de universidad..."
          },
          {
            name: "Iterative Refinement",
            description: "Refinar el prompt basado en respuestas previas",
            benefit: "Mejora progresiva de resultados",
            example: "Basado en tu respuesta anterior, ahora agrega..."
          }
        ]
      }
    },
    {
      id: 4,
      title: "Simulador Interactivo",
      description: "Practica construyendo prompts con diferentes parámetros.",
      color: "from-rose-500 to-red-400",
      icon: "fa-gamepad",
      interactive: true,
      content: {
        simulator: true
      }
    }
  ];

  // Manejar entrada a pantalla completa
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Efecto para detectar cambios en pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Manejar completar sección
  const handleCompleteSection = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  // Renderizar contenido de sección
  const renderSectionContent = (section) => {
    switch (section.id) {
      case 0: // ¿Qué es un Prompt?
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Definición</h3>
              <p className="text-white/90 leading-relaxed">{section.content.definition}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                <h4 className="font-bold text-white mb-3">Ejemplos Comunes</h4>
                <ul className="space-y-2">
                  {section.content.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/80">
                      <Icon name="fa-chevron-right" className="w-3 h-3 mt-1 text-cyan-300" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                <h4 className="font-bold text-white mb-3">Analogía</h4>
                <p className="text-white/80 italic">{section.content.analogy}</p>
                <div className="mt-4 p-3 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                  <p className="text-white text-sm">
                    <Icon name="fa-lightbulb" className="w-4 h-4 inline mr-2 text-amber-300" />
                    Un buen prompt es como un mapa: cuanto más detallado, más fácil llegar al destino.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCompleteSection(0)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="fa-check-circle" className="w-5 h-5" />
              Completar Sección
            </button>
          </div>
        );

      case 1: // Anatomía de un Prompt Efectivo
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.content.components.map((component, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors duration-200 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(component.name)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => handleCompleteSection(1)}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 mb-4 mx-auto">
                    <Icon name={`fa-${['book', 'terminal', 'file-lines', 'ban'][idx]}`} className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white text-center mb-2">{component.name}</h4>
                  <p className="text-white/80 text-sm text-center mb-3">{component.description}</p>
                  <div className="text-xs text-white/60 bg-black/20 p-2 rounded-lg">
                    "{component.example}"
                  </div>
                </motion.div>
              ))}
            </div>

            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 z-50"
              >
                Haz clic en cualquier componente para marcar como comprendido
              </motion.div>
            )}
          </div>
        );

      case 2: // Tipos de Prompts
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.types.map((type, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 hover:border-green-400/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${['from-blue-500/30 to-cyan-500/30', 'from-purple-500/30 to-pink-500/30', 'from-amber-500/30 to-orange-500/30', 'from-emerald-500/30 to-teal-500/30'][idx]} flex items-center justify-center`}>
                      <Icon name={`fa-${['terminal', 'pen-nib', 'chart-line', 'comments'][idx]}`} className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{type.name}</h4>
                      <p className="text-white/70 text-sm">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-white/60">Uso: </span>
                      <span className="text-white/90">{type.useCase}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Ejemplo: </span>
                      <span className="text-white/90 italic">"{type.example}"</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCompleteSection(2)}
                    className="mt-4 w-full py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-sm font-medium"
                  >
                    <Icon name="fa-check" className="w-3 h-3 inline mr-1" />
                    Entendido
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Técnicas Avanzadas
        return (
          <div className="space-y-6">
            {section.content.techniques.map((technique, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 hover:border-amber-400/50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{idx + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-lg">{technique.name}</h4>
                      <span className="text-amber-300 text-sm font-medium bg-amber-500/20 px-3 py-1 rounded-full">
                        {['Básica', 'Intermedia', 'Avanzada', 'Experto'][idx]}
                      </span>
                    </div>
                    
                    <p className="text-white/80 mb-3">{technique.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-amber-300 text-sm font-medium mb-1">Beneficio</div>
                        <div className="text-white/90 text-sm">{technique.benefit}</div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-lg">
                        <div className="text-cyan-300 text-sm font-medium mb-1">Ejemplo</div>
                        <div className="text-white/90 text-sm font-mono whitespace-pre-wrap">{technique.example}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => handleCompleteSection(3)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity duration-200"
            >
              He aprendido estas técnicas
            </button>
          </div>
        );

      case 4: // Simulador Interactivo
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Simulador de Prompt Builder</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Tipo de Prompt</label>
                    <select className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white">
                      <option value="instructivo">Instructivo</option>
                      <option value="creativo">Creativo</option>
                      <option value="analitico">Analítico</option>
                      <option value="conversacional">Conversacional</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Contexto</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white h-32"
                      placeholder="Eres un experto en..."
                      defaultValue="Eres un experto en prompt engineering con 5 años de experiencia..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Instrucción Principal</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white h-32"
                      placeholder="Escribe/Genera/Analiza..."
                      defaultValue="Escribe una guía paso a paso sobre cómo crear prompts efectivos para principiantes..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Formato de Respuesta</label>
                    <div className="flex flex-wrap gap-2">
                      {['Bullet Points', 'Párrafos', 'Tabla', 'Código', 'JSON', 'Markdown'].map((format) => (
                        <button
                          key={format}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors duration-200"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Restricciones</label>
                    <div className="space-y-2">
                      {['Tono profesional', 'Máximo 500 palabras', 'Sin tecnicismos', 'Incluir ejemplos'].map((restriction) => (
                        <div key={restriction} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-white/30" defaultChecked />
                          <span className="text-white/90 text-sm">{restriction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-white/80 text-sm mb-2">Prompt Generado:</div>
                    <div className="bg-black/60 border border-white/20 rounded-lg p-4 font-mono text-sm text-white/90 whitespace-pre-wrap">
                      Contexto: Eres un experto en prompt engineering con 5 años de experiencia...
                      
                      Instrucción: Escribe una guía paso a paso sobre cómo crear prompts efectivos para principiantes...
                      
                      Formato: Usa bullet points claros y ejemplos prácticos
                      
                      Restricciones: Tono profesional, máximo 500 palabras, sin tecnicismos, incluir ejemplos
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => handleCompleteSection(4)}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
                >
                  <Icon name="fa-rocket" className="w-5 h-5" />
                  Probar este Prompt
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto"
    >
      {/* Header del OVA */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-black/80 to-purple-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Icon name="fa-brain" className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  OVA: Infografía Interactiva - Prompt Engineering
                </h1>
                <p className="text-white/70">
                  Aprende la anatomía de un prompt efectivo de forma interactiva
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Indicador de progreso */}
              <div className="hidden md:block">
                <div className="text-white/70 text-sm mb-1">Progreso</div>
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
                  />
                </div>
                <div className="text-white text-xs text-right mt-1">
                  {completedSections.length}/{sections.length} secciones
                </div>
              </div>

              {/* Botón pantalla completa */}
              <button
                onClick={handleFullscreen}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Icon name={isFullscreen ? "fa-compress" : "fa-expand"} className="w-4 h-4" />
                {isFullscreen ? "Salir" : "Pantalla completa"}
              </button>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Icon name="fa-times" className="w-4 h-4" />
                Cerrar OVA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navegación lateral */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <h3 className="text-white font-bold text-lg mb-4">Navegación</h3>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3",
                        activeSection === section.id
                          ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 text-white"
                          : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      )}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon name={section.icon} className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-70">{section.description}</div>
                      </div>
                      {completedSections.includes(section.id) && (
                        <Icon name="fa-check-circle" className="text-green-400 w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <h3 className="text-white font-bold text-lg mb-4">Tu Progreso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-white/80 text-sm mb-1">
                      <span>Secciones Completadas</span>
                      <span>{completedSections.length}/{sections.length}</span>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cyan-500/20 p-3 rounded-lg border border-cyan-400/30">
                      <div className="text-cyan-300 text-sm">Interactividades</div>
                      <div className="text-white text-xl font-bold">5</div>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-400/30">
                      <div className="text-purple-300 text-sm">Tiempo Estimado</div>
                      <div className="text-white text-xl font-bold">15 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de la sección activa */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
            >
              {/* Header de sección */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sections[activeSection].color} flex items-center justify-center`}>
                    <Icon name={sections[activeSection].icon} className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{sections[activeSection].title}</h2>
                    <p className="text-white/70">{sections[activeSection].description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-white/60 text-sm">Sección</span>
                  <span className="text-white font-bold text-xl">{activeSection + 1}</span>
                  <span className="text-white/60">/</span>
                  <span className="text-white/60">{sections.length}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="min-h-[500px]">
                {renderSectionContent(sections[activeSection])}
              </div>

              {/* Navegación inferior */}
              <div className="flex justify-between mt-8 pt-8 border-t border-white/10">
                <button
                  onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
                  disabled={activeSection === 0}
                  className={cn(
                    "px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200",
                    activeSection === 0
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  <Icon name="fa-chevron-left" className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm">
                    {completedSections.includes(activeSection) ? "✓ Completado" : "En progreso"}
                  </span>
                  
                  {!completedSections.includes(activeSection) && sections[activeSection].interactive && (
                    <button
                      onClick={() => handleCompleteSection(activeSection)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity duration-200"
                    >
                      Marcar como Completado
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
                  disabled={activeSection === sections.length - 1}
                  className={cn(
                    "px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200",
                    activeSection === sections.length - 1
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  Siguiente
                  <Icon name="fa-chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Footer informativo */}
            <div className="mt-6 text-center text-white/50 text-sm">
              <p>
                <Icon name="fa-lightbulb" className="w-4 h-4 inline mr-1" />
                Este OVA es parte del módulo "Ingeniería de Prompts" de Edutechlife
              </p>
              <p className="mt-1">
                Todos los contenidos están diseñados para aprendizaje interactivo y aplicación práctica
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default QueEsPrompt_OVA;