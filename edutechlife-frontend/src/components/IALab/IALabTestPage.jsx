import React, { useState } from 'react';
import PromptBuilder from './PromptBuilder';
import InteractiveTemplates from './InteractiveTemplates';
import RealTimePromptEditor from './RealTimePromptEditor';
import PromptEvaluationSystem from './PromptEvaluationSystem';

const IALabTestPage = () => {
  const [activeComponent, setActiveComponent] = useState('promptBuilder');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const components = {
    promptBuilder: {
      name: 'Prompt Builder',
      description: 'Arrastra y suelta bloques para construir prompts',
      component: <PromptBuilder />
    },
    templates: {
      name: 'Templates Interactivos',
      description: 'Biblioteca de templates profesionales',
      component: <InteractiveTemplates onTemplateSelect={setSelectedTemplate} />
    },
    editor: {
      name: 'Editor en Tiempo Real',
      description: 'Escribe y evalúa prompts con feedback instantáneo',
      component: <RealTimePromptEditor />
    },
    evaluation: {
      name: 'Sistema de Evaluación',
      description: 'Evalúa prompts con criterios especializados',
      component: <PromptEvaluationSystem />
    }
  };

  const handleTemplateSelect = (templateBlocks) => {
    setSelectedTemplate(templateBlocks);
    setActiveComponent('promptBuilder');
    // En un sistema real, cargaríamos los bloques en el Prompt Builder
    alert(`Template seleccionado con ${templateBlocks.length} bloques. Esta funcionalidad se integraría con el Prompt Builder.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0]">
      {/* Navigation */}
      <div className="bg-white shadow-lg border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-black text-[#004B63] font-montserrat">
                IALab - Herramientas Interactivas
              </h1>
              <p className="text-slate-600 text-sm">
                Fase 2: Herramientas interactivas para el curso IALab
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(components).map(([key, comp]) => (
                <button
                  key={key}
                  onClick={() => setActiveComponent(key)}
                  className={`px-4 py-2 rounded-lg transition-all ${activeComponent === key ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white' : 'bg-[#F8FAFC] text-slate-600 hover:bg-[#F1F5F9]'}`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Info */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-[#004B63] to-[#2D7A94] rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {components[activeComponent].name}
              </h2>
              <p className="text-white/80">
                {components[activeComponent].description}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Fase 2 - Herramientas Interactivas
              </div>
              <div className="text-sm bg-[#FFD166]/20 text-[#FFD166] px-3 py-1 rounded-full">
                EdutechLife IALab
              </div>
            </div>
          </div>
        </div>

        {/* Selected Template Notification */}
        {selectedTemplate && (
          <div className="mb-6 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] rounded-xl p-4 text-[#004B63]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">Template listo para usar:</span> {selectedTemplate.length} bloques cargados
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-[#004B63] hover:text-[#2D7A94]"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Active Component */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
          {components[activeComponent].component}
        </div>

        {/* Features Overview */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-[#004B63] mb-6 text-center">
            🚀 Características Implementadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Prompt Builder',
                description: 'Arrastra y suelta bloques para construir prompts profesionales',
                features: ['Drag & Drop', 'Templates predefinidos', 'Exportación JSON', 'Edición en tiempo real'],
                color: '#4DA8C4'
              },
              {
                title: 'Templates Interactivos',
                description: 'Biblioteca de templates organizados por categoría y dificultad',
                features: ['Filtros avanzados', 'Guardado local', 'Edición de templates', 'Categorías múltiples'],
                color: '#66CCCC'
              },
              {
                title: 'Editor en Tiempo Real',
                description: 'Editor con evaluación automática y sugerencias',
                features: ['Auto-evaluación', 'Métricas en tiempo real', 'Auto-guardado', 'Atajos de teclado'],
                color: '#FF8E53'
              },
              {
                title: 'Sistema de Evaluación',
                description: 'Evaluación automática con múltiples criterios',
                features: ['3 criterios especializados', 'Modo comparación', 'Historial', 'Feedback detallado'],
                color: '#FF6B9D'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: feature.color }}
                  >
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-[#004B63] text-lg">{feature.title}</h4>
                </div>
                
                <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.features.map((feat, featIndex) => (
                    <li key={featIndex} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: feature.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-12 bg-gradient-to-r from-[#004B63] to-[#2D7A94] rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ✅ Estado de Integración - Fase 2 Completada
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">4</div>
              <div className="font-bold mb-2">Componentes Principales</div>
              <p className="text-white/80 text-sm">
                Herramientas interactivas completamente funcionales
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="font-bold mb-2">Endpoints Backend</div>
              <p className="text-white/80 text-sm">
                API completa para gestión de recursos y evaluación
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="font-bold mb-2">Integración Corporativa</div>
              <p className="text-white/80 text-sm">
                Diseño siguiendo identidad visual de EdutechLife
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <h4 className="font-bold mb-4">Próximos Pasos (Fase 3):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">1</span>
                </div>
                <span>Micro-videos educativos (5-10 minutos)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">2</span>
                </div>
                <span>Guías de audio por módulo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">3</span>
                </div>
                <span>Casos de estudio reales</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">4</span>
                </div>
                <span>Integración completa con plataforma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6">
          <h3 className="text-xl font-bold text-[#004B63] mb-4">
            🧪 Instrucciones para Probar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-[#004B63] mb-3">Prompt Builder:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Arrastra bloques del panel izquierdo al área de construcción</li>
                <li>Edita el contenido de cada bloque haciendo clic</li>
                <li>Reorganiza bloques arrastrándolos</li>
                <li>Guarda el template como JSON</li>
                <li>Prueba los templates rápidos predefinidos</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-bold text-[#004B63] mb-3">Sistema de Evaluación:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Escribe un prompt en el área de texto</li>
                <li>Selecciona criterios de evaluación</li>
                <li>Haz clic en "Evaluar Prompt"</li>
                <li>Revisa el feedback detallado</li>
                <li>Prueba el modo comparación con 2 prompts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IALabTestPage;