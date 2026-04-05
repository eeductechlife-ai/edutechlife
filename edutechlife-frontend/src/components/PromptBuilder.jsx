import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PromptBuilder = () => {
  const [promptBlocks, setPromptBlocks] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([
    { id: 1, type: 'role', title: 'Rol del Asistente', content: 'Eres un experto en [especialidad]', color: '#4DA8C4' },
    { id: 2, type: 'context', title: 'Contexto', content: 'El usuario necesita [descripción del problema]', color: '#66CCCC' },
    { id: 3, type: 'task', title: 'Tarea Principal', content: 'Tu tarea es [acción específica]', color: '#2D7A94' },
    { id: 4, type: 'format', title: 'Formato de Respuesta', content: 'Responde en formato [formato específico]', color: '#B2D8E5' },
    { id: 5, type: 'constraints', title: 'Restricciones', content: 'Evita [comportamiento no deseado]', color: '#FF8E53' },
    { id: 6, type: 'examples', title: 'Ejemplos', content: 'Ejemplo 1: [ejemplo concreto]', color: '#FFD166' },
    { id: 7, type: 'tone', title: 'Tono', content: 'Usa un tono [profesional/amigable/formal]', color: '#FF6B9D' },
    { id: 8, type: 'length', title: 'Longitud', content: 'La respuesta debe tener [número] palabras', color: '#9D4EDD' }
  ]);
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const draggedBlock = availableBlocks[draggedIndex];
    
    if (draggedBlock) {
      const newBlock = {
        ...draggedBlock,
        id: Date.now() + Math.random()
      };
      
      setPromptBlocks([...promptBlocks, newBlock]);
      updateGeneratedPrompt([...promptBlocks, newBlock]);
    }
  };

  const handleDragOverBuilder = (e, position) => {
    dragOverItem.current = position;
    e.preventDefault();
  };

  const handleDropInBuilder = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (draggedIndex >= 0 && draggedIndex < availableBlocks.length) {
      const draggedBlock = availableBlocks[draggedIndex];
      const newBlock = {
        ...draggedBlock,
        id: Date.now() + Math.random()
      };
      
      const newPromptBlocks = [...promptBlocks];
      const dropPosition = dragOverItem.current;
      
      if (dropPosition >= 0 && dropPosition <= newPromptBlocks.length) {
        newPromptBlocks.splice(dropPosition, 0, newBlock);
      } else {
        newPromptBlocks.push(newBlock);
      }
      
      setPromptBlocks(newPromptBlocks);
      updateGeneratedPrompt(newPromptBlocks);
    }
  };

  const handleDragStartInBuilder = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.setData('text/plain', 'builder_' + index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropReorder = (e) => {
    e.preventDefault();
    const dragIndex = dragItem.current;
    const dropIndex = dragOverItem.current;
    
    if (dragIndex === dropIndex || dragIndex === undefined || dropIndex === undefined) return;
    
    const newPromptBlocks = [...promptBlocks];
    const draggedItem = newPromptBlocks[dragIndex];
    
    newPromptBlocks.splice(dragIndex, 1);
    newPromptBlocks.splice(dropIndex, 0, draggedItem);
    
    setPromptBlocks(newPromptBlocks);
    updateGeneratedPrompt(newPromptBlocks);
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const updateGeneratedPrompt = (blocks) => {
    const promptText = blocks.map(block => block.content).join('\n\n');
    setGeneratedPrompt(promptText);
  };

  const handleBlockEdit = (id, newContent) => {
    const updatedBlocks = promptBlocks.map(block => 
      block.id === id ? { ...block, content: newContent } : block
    );
    setPromptBlocks(updatedBlocks);
    updateGeneratedPrompt(updatedBlocks);
  };

  const handleBlockDelete = (id) => {
    const updatedBlocks = promptBlocks.filter(block => block.id !== id);
    setPromptBlocks(updatedBlocks);
    updateGeneratedPrompt(updatedBlocks);
  };

  const handleClearAll = () => {
    setPromptBlocks([]);
    setGeneratedPrompt('');
  };

  const handleSaveTemplate = () => {
    const template = {
      name: `Prompt Template ${new Date().toLocaleDateString()}`,
      blocks: promptBlocks,
      fullPrompt: generatedPrompt,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-template-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat mb-3">
            Prompt Builder
          </h1>
          <p className="text-lg text-slate-600">
            Arrastra y suelta bloques para construir prompts profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Available Blocks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 h-full">
              <h2 className="text-2xl font-bold text-[#004B63] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4DA8C4] flex items-center justify-center">
                  <span className="text-white font-bold">+</span>
                </div>
                Bloques Disponibles
              </h2>
              
              <div className="space-y-4">
                {availableBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    className="p-4 rounded-xl border-2 border-dashed border-[#E2E8F0] cursor-move hover:border-[#4DA8C4] hover:shadow-md transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: block.color }}
                      />
                      <div>
                        <h3 className="font-bold text-[#004B63]">{block.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{block.content}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <span>Arrastra al área de construcción</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <h3 className="font-bold text-[#004B63] mb-2">💡 Consejos</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Arrastra bloques para construir tu prompt</li>
                  <li>• Edita el contenido de cada bloque</li>
                  <li>• Reorganiza el orden arrastrando</li>
                  <li>• Guarda tus templates para reusar</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Column: Builder Area */}
          <div className="lg:col-span-2">
            <div 
              ref={dropZoneRef}
              className={`bg-white rounded-2xl shadow-xl border-2 ${isDragging ? 'border-[#4DA8C4] border-dashed bg-[#F0F9FF]' : 'border-[#E2E8F0]'} p-6 min-h-[500px] transition-all`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#004B63] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                    <span className="text-white font-bold">⚡</span>
                  </div>
                  Área de Construcción
                </h2>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                  >
                    Limpiar Todo
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Guardar Template
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {promptBlocks.length === 0 ? (
                  <motion.div 
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] flex items-center justify-center">
                      <span className="text-4xl text-[#4DA8C4]">↓</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#004B63] mb-2">
                      Arrastra bloques aquí
                    </h3>
                    <p className="text-slate-500">
                      Comienza arrastrando bloques desde el panel izquierdo
                    </p>
                  </motion.div>
                ) : (
                  <div 
                    className="space-y-4"
                    onDragOver={(e) => handleDragOverBuilder(e, promptBlocks.length)}
                    onDrop={handleDropInBuilder}
                  >
                    {promptBlocks.map((block, index) => (
                      <motion.div
                        key={block.id}
                        className="group relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                      >
                        <div
                          className="p-4 rounded-xl border-2 border-[#E2E8F0] bg-white hover:border-[#4DA8C4] transition-all cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStartInBuilder(e, index)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            dragOverItem.current = index;
                          }}
                          onDrop={handleDropReorder}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div 
                                className="w-6 h-6 rounded-lg flex-shrink-0 mt-1"
                                style={{ backgroundColor: block.color }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-[#004B63]">{block.title}</h3>
                                  <span className="text-xs px-2 py-1 rounded-full bg-[#F0F9FF] text-[#4DA8C4]">
                                    {block.type}
                                  </span>
                                </div>
                                
                                <textarea
                                  value={block.content}
                                  onChange={(e) => handleBlockEdit(block.id, e.target.value)}
                                  className="w-full p-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none"
                                  rows="3"
                                  placeholder="Edita el contenido del bloque..."
                                />
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleBlockDelete(block.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <span>Arrastra para reordenar</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {block.content.length} caracteres
                            </div>
                          </div>
                        </div>
                        
                        {/* Drop indicator */}
                        <div 
                          className="h-1 bg-transparent hover:bg-[#4DA8C4] transition-colors"
                          onDragOver={(e) => handleDragOverBuilder(e, index)}
                          onDrop={handleDropInBuilder}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Empty drop zone at the end */}
                    <div 
                      className="h-20 border-2 border-dashed border-[#E2E8F0] rounded-xl flex items-center justify-center text-slate-400 hover:border-[#4DA8C4] hover:text-[#4DA8C4] transition-colors"
                      onDragOver={(e) => handleDragOverBuilder(e, promptBlocks.length)}
                      onDrop={handleDropInBuilder}
                    >
                      <span>Suelta bloques aquí para agregar al final</span>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Generated Prompt Preview */}
            {generatedPrompt && (
              <motion.div 
                className="mt-8 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#004B63] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFD166] to-[#FF8E53] flex items-center justify-center">
                      <span className="text-white font-bold">📋</span>
                    </div>
                    Prompt Generado
                  </h2>
                  
                  <button
                    onClick={handleCopyPrompt}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-lg hover:shadow-md transition-all font-bold"
                  >
                    Copiar Prompt
                  </button>
                </div>
                
                <div className="relative">
                  <pre className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] text-slate-700 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                    {generatedPrompt}
                  </pre>
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                    {generatedPrompt.length} caracteres
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="text-sm text-slate-500">
                    <span className="font-bold text-[#004B63]">{promptBlocks.length}</span> bloques utilizados
                  </div>
                  <div className="text-sm text-slate-500">
                    • <span className="font-bold text-[#4DA8C4]">{promptBlocks.filter(b => b.type === 'role').length}</span> roles
                  </div>
                  <div className="text-sm text-slate-500">
                    • <span className="font-bold text-[#66CCCC]">{promptBlocks.filter(b => b.type === 'task').length}</span> tareas
                  </div>
                  <div className="text-sm text-slate-500">
                    • <span className="font-bold text-[#2D7A94]">{promptBlocks.filter(b => b.type === 'constraints').length}</span> restricciones
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Templates Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#004B63] to-[#2D7A94] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              Templates Rápidos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Análisis de Mercado',
                  blocks: ['role', 'context', 'task', 'format', 'examples'],
                  color: '#4DA8C4'
                },
                {
                  title: 'Generación de Contenido',
                  blocks: ['role', 'tone', 'task', 'length', 'constraints'],
                  color: '#66CCCC'
                },
                {
                  title: 'Asistente Técnico',
                  blocks: ['role', 'context', 'task', 'format', 'examples', 'constraints'],
                  color: '#FF8E53'
                }
              ].map((template, index) => (
                <button
                  key={index}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 text-left transition-all group"
                  onClick={() => {
                    const templateBlocks = template.blocks.map(blockType => {
                      const baseBlock = availableBlocks.find(b => b.type === blockType);
                      return {
                        ...baseBlock,
                        id: Date.now() + Math.random(),
                        content: baseBlock.content
                      };
                    });
                    setPromptBlocks(templateBlocks);
                    updateGeneratedPrompt(templateBlocks);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{template.title}</h3>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                         style={{ backgroundColor: template.color }}>
                      <span className="text-white">+</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mb-4">
                    Template predefinido para {template.title.toLowerCase()}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.blocks.map((blockType, i) => {
                      const block = availableBlocks.find(b => b.type === blockType);
                      return (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-white/20"
                          style={{ color: block?.color || '#FFFFFF' }}
                        >
                          {blockType}
                        </span>
                      );
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;