import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveTemplates = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Análisis de Mercado IA',
      description: 'Template para análisis competitivo y tendencias de mercado',
      category: 'business',
      difficulty: 'intermediate',
      blocks: [
        { type: 'role', content: 'Eres un analista de mercado especializado en tecnologías emergentes' },
        { type: 'context', content: 'El usuario necesita analizar el mercado de soluciones de IA para educación' },
        { type: 'task', content: 'Proporciona un análisis detallado de las tendencias actuales, competidores clave y oportunidades de crecimiento' },
        { type: 'format', content: 'Responde en formato de reporte ejecutivo con secciones claras' },
        { type: 'examples', content: 'Ejemplo de competidor: EdutechLife - plataforma educativa con IA personalizada' }
      ],
      usageCount: 42,
      rating: 4.8,
      color: '#4DA8C4'
    },
    {
      id: 2,
      name: 'Generador de Contenido',
      description: 'Crea contenido educativo de alta calidad con IA',
      category: 'content',
      difficulty: 'beginner',
      blocks: [
        { type: 'role', content: 'Eres un creador de contenido educativo experto' },
        { type: 'tone', content: 'Usa un tono claro, profesional y accesible' },
        { type: 'task', content: 'Genera contenido educativo sobre [tema específico] para [audiencia objetivo]' },
        { type: 'length', content: 'El contenido debe tener aproximadamente 1000 palabras' },
        { type: 'constraints', content: 'Evita jerga técnica excesiva, incluye ejemplos prácticos' }
      ],
      usageCount: 78,
      rating: 4.6,
      color: '#66CCCC'
    },
    {
      id: 3,
      name: 'Asistente Técnico Avanzado',
      description: 'Template para asistencia técnica especializada',
      category: 'technical',
      difficulty: 'advanced',
      blocks: [
        { type: 'role', content: 'Eres un ingeniero de software senior con 10+ años de experiencia' },
        { type: 'context', content: 'El usuario enfrenta un problema técnico complejo que requiere solución experta' },
        { type: 'task', content: 'Proporciona una solución paso a paso con explicaciones técnicas detalladas' },
        { type: 'format', content: 'Responde con código de ejemplo, diagramas conceptuales y mejores prácticas' },
        { type: 'examples', content: 'Ejemplo de problema: optimización de consultas en base de datos grande' },
        { type: 'constraints', content: 'Incluye consideraciones de seguridad y escalabilidad' }
      ],
      usageCount: 23,
      rating: 4.9,
      color: '#2D7A94'
    },
    {
      id: 4,
      name: 'Planificador de Proyectos',
      description: 'Template para planificación y gestión de proyectos',
      category: 'productivity',
      difficulty: 'intermediate',
      blocks: [
        { type: 'role', content: 'Eres un project manager certificado con experiencia en metodologías ágiles' },
        { type: 'context', content: 'El usuario necesita planificar un proyecto complejo con múltiples stakeholders' },
        { type: 'task', content: 'Crea un plan de proyecto detallado con cronograma, recursos y riesgos' },
        { type: 'format', content: 'Responde en formato de plan de proyecto ejecutable' },
        { type: 'examples', content: 'Ejemplo de proyecto: desarrollo de nueva funcionalidad para plataforma SaaS' }
      ],
      usageCount: 35,
      rating: 4.7,
      color: '#FF8E53'
    },
    {
      id: 5,
      name: 'Analista de Datos',
      description: 'Template para análisis y visualización de datos',
      category: 'data',
      difficulty: 'advanced',
      blocks: [
        { type: 'role', content: 'Eres un científico de datos con experiencia en machine learning y estadística' },
        { type: 'context', content: 'El usuario tiene un conjunto de datos que necesita analizar e interpretar' },
        { type: 'task', content: 'Realiza un análisis estadístico completo y sugiere visualizaciones apropiadas' },
        { type: 'format', content: 'Responde con análisis cuantitativo, insights y recomendaciones accionables' },
        { type: 'examples', content: 'Ejemplo de dataset: métricas de engagement de usuarios en plataforma educativa' }
      ],
      usageCount: 29,
      rating: 4.8,
      color: '#FFD166'
    },
    {
      id: 6,
      name: 'Copywriter Publicitario',
      description: 'Template para creación de copy persuasivo',
      category: 'marketing',
      difficulty: 'intermediate',
      blocks: [
        { type: 'role', content: 'Eres un copywriter publicitario premiado con experiencia en múltiples industrias' },
        { type: 'tone', content: 'Usa un tono persuasivo, emocional y orientado a resultados' },
        { type: 'task', content: 'Crea copy publicitario efectivo para [producto/servicio] dirigido a [audiencia]' },
        { type: 'format', content: 'Responde con headlines, body copy y call-to-action convincentes' },
        { type: 'examples', content: 'Ejemplo: campaña de lanzamiento para nueva funcionalidad de IA' }
      ],
      usageCount: 56,
      rating: 4.5,
      color: '#FF6B9D'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userTemplates, setUserTemplates] = useState([]);

  const categories = [
    { id: 'all', name: 'Todos', color: '#4DA8C4' },
    { id: 'business', name: 'Negocios', color: '#2D7A94' },
    { id: 'content', name: 'Contenido', color: '#66CCCC' },
    { id: 'technical', name: 'Técnico', color: '#FF8E53' },
    { id: 'productivity', name: 'Productividad', color: '#FFD166' },
    { id: 'data', name: 'Datos', color: '#9D4EDD' },
    { id: 'marketing', name: 'Marketing', color: '#FF6B9D' }
  ];

  const difficulties = [
    { id: 'all', name: 'Todos', color: '#4DA8C4' },
    { id: 'beginner', name: 'Principiante', color: '#66CCCC' },
    { id: 'intermediate', name: 'Intermedio', color: '#FF8E53' },
    { id: 'advanced', name: 'Avanzado', color: '#2D7A94' }
  ];

  useEffect(() => {
    const savedTemplates = localStorage.getItem('userPromptTemplates');
    if (savedTemplates) {
      try {
        setUserTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Error loading user templates:', error);
      }
    }
  }, []);

  const saveUserTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      isUserTemplate: true,
      createdAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...userTemplates, newTemplate];
    setUserTemplates(updatedTemplates);
    localStorage.setItem('userPromptTemplates', JSON.stringify(updatedTemplates));
  };

  const deleteUserTemplate = (templateId) => {
    const updatedTemplates = userTemplates.filter(t => t.id !== templateId);
    setUserTemplates(updatedTemplates);
    localStorage.setItem('userPromptTemplates', JSON.stringify(updatedTemplates));
  };

  const filteredTemplates = [...templates, ...userTemplates].filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleTemplateSelect = (template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template.blocks);
    }
  };

  const handleTemplatePreview = (template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateCustomTemplate = () => {
    const customTemplate = {
      id: Date.now(),
      name: 'Mi Template Personalizado',
      description: 'Template creado por el usuario',
      category: 'custom',
      difficulty: 'intermediate',
      blocks: [
        { type: 'role', content: 'Personaliza este bloque...' },
        { type: 'task', content: 'Personaliza este bloque...' }
      ],
      isUserTemplate: true,
      createdAt: new Date().toISOString(),
      color: '#4DA8C4'
    };
    
    setSelectedTemplate(customTemplate);
    setShowTemplateModal(true);
  };

  const handleSaveTemplateChanges = (updatedTemplate) => {
    if (updatedTemplate.isUserTemplate) {
      const updatedTemplates = userTemplates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      );
      setUserTemplates(updatedTemplates);
      localStorage.setItem('userPromptTemplates', JSON.stringify(updatedTemplates));
    } else {
      saveUserTemplate(updatedTemplate);
    }
    setShowTemplateModal(false);
  };

  const getBlockTypeColor = (type) => {
    const colors = {
      role: '#4DA8C4',
      context: '#66CCCC',
      task: '#2D7A94',
      format: '#B2D8E5',
      constraints: '#FF8E53',
      examples: '#FFD166',
      tone: '#FF6B9D',
      length: '#9D4EDD'
    };
    return colors[type] || '#4DA8C4';
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      beginner: { text: 'Principiante', color: 'bg-[#66CCCC] text-white' },
      intermediate: { text: 'Intermedio', color: 'bg-[#FF8E53] text-white' },
      advanced: { text: 'Avanzado', color: 'bg-[#2D7A94] text-white' }
    };
    return badges[difficulty] || { text: difficulty, color: 'bg-gray-200 text-gray-700' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat mb-3">
            Templates Interactivos
          </h1>
          <p className="text-lg text-slate-600">
            Biblioteca de templates profesionales para construir prompts efectivos
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-[#004B63] mb-2">
                  🔍 Buscar Templates
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o descripción..."
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-[#004B63] mb-2">
                  📁 Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-[#004B63] mb-2">
                  🎯 Dificultad
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>
                      {diff.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#004B63]">{filteredTemplates.length}</div>
                  <div className="text-sm text-slate-500">Templates disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4DA8C4]">{userTemplates.length}</div>
                  <div className="text-sm text-slate-500">Templates personales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#66CCCC]">
                    {filteredTemplates.reduce((sum, t) => sum + (t.usageCount || 0), 0)}
                  </div>
                  <div className="text-sm text-slate-500">Usos totales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Template Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateCustomTemplate}
            className="w-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-2">+ Crear Nuevo Template</h2>
                <p className="text-white/80">Diseña tu propio template personalizado desde cero</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <motion.div
              key={template.id}
              className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden hover:shadow-xl transition-all"
              whileHover={{ y: -5 }}
            >
              {/* Template Header */}
              <div 
                className="h-3"
                style={{ backgroundColor: template.color || '#4DA8C4' }}
              />
              
              <div className="p-6">
                {/* Template Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#004B63] mb-2">
                      {template.name}
                      {template.isUserTemplate && (
                        <span className="ml-2 text-xs px-2 py-1 bg-[#FFD166] text-[#004B63] rounded-full">
                          Personal
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">{template.description}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBadge(template.difficulty).color}`}>
                      {getDifficultyBadge(template.difficulty).text}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {template.category}
                    </div>
                  </div>
                </div>

                {/* Blocks Preview */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-[#004B63] mb-2">
                    Bloques incluidos ({template.blocks.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.blocks.slice(0, 4).map((block, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full border"
                        style={{ 
                          borderColor: getBlockTypeColor(block.type),
                          color: getBlockTypeColor(block.type),
                          backgroundColor: `${getBlockTypeColor(block.type)}10`
                        }}
                      >
                        {block.type}
                      </span>
                    ))}
                    {template.blocks.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        +{template.blocks.length - 4} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[#FFD166]">★</span>
                      <span className="text-sm font-bold">{template.rating || 4.5}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {template.usageCount || 0} usos
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTemplatePreview(template)}
                      className="px-3 py-2 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="px-3 py-2 text-sm bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Usar
                    </button>
                    {template.isUserTemplate && (
                      <button
                        onClick={() => deleteUserTemplate(template.id)}
                        className="px-3 py-2 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] flex items-center justify-center">
              <span className="text-4xl text-[#4DA8C4]">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-[#004B63] mb-2">
              No se encontraron templates
            </h3>
            <p className="text-slate-500 mb-6">
              Intenta con otros filtros o crea un nuevo template
            </p>
            <button
              onClick={handleCreateCustomTemplate}
              className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all"
            >
              Crear Primer Template
            </button>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Modal Header */}
              <div 
                className="p-6 text-white"
                style={{ backgroundColor: selectedTemplate.color || '#4DA8C4' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h2>
                    <p className="text-white/90">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-80">Categoría:</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {selectedTemplate.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-80">Dificultad:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyBadge(selectedTemplate.difficulty).color}`}>
                      {getDifficultyBadge(selectedTemplate.difficulty).text}
                    </span>
                  </div>
                  {selectedTemplate.usageCount && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-80">Usos:</span>
                      <span className="text-sm font-bold">{selectedTemplate.usageCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <h3 className="text-lg font-bold text-[#004B63] mb-4">
                  Bloques del Template ({selectedTemplate.blocks.length})
                </h3>
                
                <div className="space-y-4">
                  {selectedTemplate.blocks.map((block, index) => (
                    <div key={index} className="border border-[#E2E8F0] rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-6 h-6 rounded-lg"
                          style={{ backgroundColor: getBlockTypeColor(block.type) }}
                        />
                        <span className="font-bold text-[#004B63] capitalize">{block.type}</span>
                      </div>
                      <textarea
                        value={block.content}
                        onChange={(e) => {
                          const updatedBlocks = [...selectedTemplate.blocks];
                          updatedBlocks[index].content = e.target.value;
                          setSelectedTemplate({
                            ...selectedTemplate,
                            blocks: updatedBlocks
                          });
                        }}
                        className="w-full p-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none"
                        rows="3"
                      />
                    </div>
                  ))}
                </div>

                {/* Add New Block */}
                <button
                  onClick={() => {
                    const newBlock = { type: 'role', content: 'Nuevo bloque...' };
                    setSelectedTemplate({
                      ...selectedTemplate,
                      blocks: [...selectedTemplate.blocks, newBlock]
                    });
                  }}
                  className="w-full mt-6 p-4 border-2 border-dashed border-[#E2E8F0] rounded-xl text-[#4DA8C4] hover:border-[#4DA8C4] hover:bg-[#F0F9FF] transition-colors"
                >
                  + Agregar Nuevo Bloque
                </button>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex justify-between items-center">
                  <div>
                    <button
                      onClick={() => handleTemplateSelect(selectedTemplate)}
                      className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all font-bold"
                    >
                      Usar este Template
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTemplateModal(false)}
                      className="px-6 py-3 bg-[#F1F5F9] text-slate-600 rounded-lg hover:bg-[#E2E8F0] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveTemplateChanges(selectedTemplate)}
                      className="px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-lg hover:shadow-md transition-all font-bold"
                    >
                      {selectedTemplate.isUserTemplate ? 'Guardar Cambios' : 'Guardar Copia'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveTemplates;