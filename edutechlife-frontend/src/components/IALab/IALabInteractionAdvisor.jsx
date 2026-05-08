import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const toolRules = [
  { keywords: ['imagen', 'dibujo', 'ilustración', 'diseño', 'logo', 'arte', 'visual', 'infografía', 'poster', 'gráfico'], tool: { id: 'dalle', title: 'DALL-E 3', icon: 'fa-image', color: 'purple' }, reason: 'DALL-E 3 es ideal para generar imágenes y contenido visual original a partir de descripciones textuales.', model: 'GPT-4o (multimodal)', mode: 'Fast', prompt: 'Crea una imagen de [descripción detallada] con estilo [realista/ilustración/arte] en formato [horizontal/vertical/cuadrado]. Incluye [elementos específicos].', tips: ['Sé específico con el estilo visual (realista, ilustración, acuarela)', 'Describe la composición: colores, iluminación, perspectiva', 'Para texto largo en imágenes, usa Canvas como complemento'], alternatives: ['Canvas: edición y refinamiento de documentos visuales'] },
  { keywords: ['analizar', 'datos', 'excel', 'csv', 'estadísticas', 'reporte', 'gráfico', 'ventas', 'presupuesto', 'numérico', 'cálculo', 'matemáticas'], tool: { id: 'code', title: 'Intérprete de Código', icon: 'fa-code', color: 'emerald' }, reason: 'El Intérprete de Código ejecuta Python real para analizar datos, crear visualizaciones y realizar cálculos complejos.', model: 'GPT-4o', mode: 'Thinking', prompt: 'Tengo este archivo de datos [describe los datos]. Necesito que: 1. Limpies los datos 2. Calcules [métrica específica] 3. Generes una visualización de [tipo de gráfico]. Los resultados deben mostrarse como tabla y gráfico.', tips: ['Sube el archivo directamente al chat para mejor análisis', 'Especifica qué columnas son relevantes', 'Pide visualizaciones específicas (barras, dispersión, líneas)'], alternatives: ['Búsqueda Web: para datos actualizados en tiempo real'] },
  { keywords: ['código', 'programar', 'desarrollar', 'api', 'script', 'depurar', 'función', 'algoritmo', 'software', 'app'], tool: { id: 'code', title: 'Intérprete de Código', icon: 'fa-code', color: 'emerald' }, reason: 'El Intérprete de Código puede escribir, ejecutar y depurar código Python en tiempo real dentro del chat.', model: 'GPT-5', mode: 'Thinking', prompt: 'Necesito desarrollar [descripción del código]. Requisitos: [lista de requisitos]. El lenguaje debe ser [lenguaje]. Incluye: 1. Código completo 2. Comentarios explicativos 3. Ejemplo de uso 4. Manejo de errores.', tips: ['Sé específico sobre el lenguaje y versión', 'Incluye ejemplos de entrada/salida esperada', 'Pide pruebas unitarias para validar el código'], alternatives: ['Canvas: para edición colaborativa de código largo'] },
  { keywords: ['escribir', 'ensayo', 'documento', 'corregir', 'editar', 'redactar', 'texto', 'artículo', 'informe', 'carta', 'email'], tool: { id: 'canvas', title: 'Canvas', icon: 'fa-file-lines', color: 'orange' }, reason: 'Canvas permite editar documentos largos de forma colaborativa, ajustando secciones específicas sin regenerar todo el texto.', model: 'GPT-4o', mode: 'Fast', prompt: 'Ayúdame a [escribir/mejorar/editar] un [tipo de documento] sobre [tema]. El tono debe ser [formal/informal/técnico]. La extensión aproximada es [número] páginas. Enfócate en: [puntos clave].', tips: ['Usa Canvas para editar secciones específicas sin regenerar todo', 'Pide sugerencias de mejora párrafo por párrafo', 'Aprovecha el editor lateral para comparar versiones'], alternatives: ['Intérprete de Código: para documentos con datos y gráficos'] },
  { keywords: ['investigar', 'buscar', 'noticias', 'actualidad', 'verificar', 'información reciente', 'hechos', 'fuentes'], tool: { id: 'browse', title: 'Búsqueda Web', icon: 'fa-globe', color: 'blue' }, reason: 'La Búsqueda Web permite a ChatGPT acceder a internet en tiempo real para obtener información actualizada.', model: 'GPT-5', mode: 'Fast', prompt: 'Busca información actualizada sobre [tema]. Necesito: 1. Datos recientes (últimos [período]) 2. Fuentes confiables 3. Estadísticas clave 4. Tendencias principales. Verifica la información con múltiples fuentes.', tips: ['Siempre verifica las fuentes que proporciona la IA', 'Pide comparar información de múltiples fuentes', 'Úsalo para datos que cambian rápido: precios, noticias, clima'], alternatives: ['Intérprete de Código: para analizar datos descargados de la web'] },
  { keywords: ['aprender', 'estudiar', 'resumir', 'explicar', 'conceptos', 'tutorial', 'guía', 'educación', 'clase'], tool: { id: 'multi', title: 'Browse + Canvas', icon: 'fa-graduation-cap', color: 'indigo' }, reason: 'Combinar Búsqueda Web con Canvas te permite investigar y luego organizar la información en un documento estructurado.', model: 'GPT-5', mode: 'Thinking', prompt: 'Necesito aprender sobre [tema]. Crea una guía de estudio que incluya: 1. Resumen ejecutivo 2. Conceptos clave con explicaciones simples 3. Ejemplos prácticos 4. Preguntas de autoevaluación. El nivel de profundidad debe ser [básico/intermedio/avanzado].', tips: ['Primero investiga con Browse, luego organiza con Canvas', 'Pide ejemplos prácticos relacionados con tu campo', 'Usa el Modo Thinking para explicaciones más profundas'], alternatives: ['DALL-E 3: para crear material visual de apoyo'] },
  { keywords: ['automatizar', 'flujo', 'workflow', 'tarea repetitiva', 'proceso', 'integrar', 'conectar', 'zapier', 'make'], tool: { id: 'gpts', title: 'GPTs + Acciones', icon: 'fa-robot', color: 'cyan' }, reason: 'Los GPTs personalizados con Acciones pueden automatizar flujos completos conectándose con APIs externas como Slack, Gmail o Sheets.', model: 'GPT-5.5', mode: 'Thinking', prompt: 'Quiero automatizar [descripción del proceso]. El flujo actual es: [pasos actuales]. El resultado deseado es: [objetivo]. Las herramientas disponibles son: [herramientas]. Diseña una automatización que incluya: 1. Trigger (evento que inicia) 2. Acción de IA 3. Destino del resultado.', tips: ['Define claramente el evento que inicia la automatización', 'Empieza con flujos simples y ve agregando complejidad', 'Usa GPTs personalizados para tareas específicas recurrentes'], alternatives: ['Intérprete de Código: para automatizaciones vía API directa'] },
  { keywords: ['recordar', 'guardar', 'proyecto', 'preferencias', 'perfil', 'memoria', 'contexto', 'persistente', 'historial'], tool: { id: 'memory', title: 'Memoria y Proyectos', icon: 'fa-database', color: 'indigo' }, reason: 'La Memoria permite a ChatGPT recordar tus preferencias, y los Proyectos organizan conversaciones y archivos bajo un mismo contexto.', model: 'GPT-5', mode: 'Fast', prompt: 'Configura un Proyecto para [tema/proyecto] con las siguientes instrucciones: [instrucciones específicas]. Los archivos base son: [archivos]. El tono de comunicación debe ser: [tono]. Las preferencias a recordar son: [preferencias].', tips: ['Configura un Proyecto con instrucciones fijas y archivos base', 'La Memoria mejora con el uso constante', 'Usa proyectos separados para temas distintos'], alternatives: ['GPTs Personalizados: para tareas especializadas con instrucciones fijas'] }
];

const suggestions = [
  { icon: 'fa-chart-simple', label: 'Analizar datos', text: 'Quiero analizar datos de ventas del último trimestre y generar un reporte con gráficos' },
  { icon: 'fa-image', label: 'Crear imagen', text: 'Necesito crear una infografía educativa sobre el ciclo del agua para niños' },
  { icon: 'fa-code', label: 'Escribir código', text: 'Quiero desarrollar una función en Python que procese archivos CSV y limpie datos' },
  { icon: 'fa-file-lines', label: 'Redactar texto', text: 'Necesito escribir un ensayo académico sobre el impacto de la IA en la educación' },
  { icon: 'fa-graduation-cap', label: 'Aprender tema', text: 'Quiero aprender los fundamentos del machine learning con ejemplos prácticos' },
  { icon: 'fa-robot', label: 'Automatizar', text: 'Necesito automatizar el envío de correos de bienvenida cuando un usuario se registra' }
];

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#E0F7FA] text-[#004B63] hover:bg-[#B2EBF2]'}`} title="Escuchar con voz de Valerio">
      <Icon name={isPlaying ? 'fa-stop' : 'fa-volume-up'} className="w-3 h-3" />
      {isPlaying ? 'Detener' : 'Escuchar'}
    </button>
  );
};

const findRecommendation = (text) => {
  if (!text || text.length < 3) return null;
  const lower = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  toolRules.forEach(rule => {
    let score = 0;
    rule.keywords.forEach(kw => { if (lower.includes(kw.toLowerCase())) score++; });
    if (score > bestScore) { bestScore = score; bestMatch = rule; }
  });
  return bestMatch;
};

const getToolColor = (color) => {
  const colors = { purple: 'purple', emerald: 'emerald', orange: 'orange', blue: 'blue', indigo: 'indigo', cyan: 'cyan' };
  return colors[color] || 'slate';
};

const IALabInteractionAdvisor = ({ className = '', ...rest }) => {
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = useCallback((e) => { setInput(e.target.value); if (recommendation) setShowResult(false); }, [recommendation]);

  const handleRecommend = () => {
    if (input.trim().length < 3) return;
    const result = findRecommendation(input);
    setRecommendation(result);
    setShowResult(true);
  };

  const handleSuggestion = (text) => {
    setInput(text);
    const result = findRecommendation(text);
    setRecommendation(result);
    setShowResult(true);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRecommend(); } };

  return (
    <motion.div whileHover={{ scale: 1.01, y: -2, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }} transition={{ duration: 0.2 }}
      className={cn("relative z-10 bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-slate-200/60 overflow-hidden space-y-6", className)} {...rest}>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between cursor-pointer group">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-[#004B63] group-hover:text-[#00BCD4] transition-colors duration-300">Asesor de Interacción ChatGPT</h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-1">Describe tu tarea y descubre qué herramienta de ChatGPT usar</p>
          {!isOpen && (
            <div className="mt-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl shadow-sm hover:from-[#0A3550] hover:to-[#0097A7] hover:shadow group-hover:scale-105 transition-all duration-300 cursor-pointer">
                <Icon name="fa-wand-magic-sparkles" className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white tracking-wide">Abrir Asesor de Herramientas</span>
                <Icon name="fa-chevron-right" className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          )}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'bg-[#004B63]/10 rotate-180' : 'bg-[#00BCD4]/15 group-hover:scale-110'}`}>
          <Icon name="fa-chevron-down" className={`w-4 h-4 ${isOpen ? 'text-[#004B63]' : 'text-[#00BCD4]'} transition-colors`} />
        </div>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-5">
          <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F7FA] p-5 rounded-xl border border-[#00BCD4]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="fa-wand-magic-sparkles" className="w-5 h-5 text-[#00BCD4]" />
                <h3 className="font-bold text-[#004B63] text-sm">¿Qué necesitas hacer con ChatGPT?</h3>
              </div>
              {input.length >= 3 && <VoiceReader text={`Describe tu tarea y te recomendaré la mejor herramienta de ChatGPT. Escribe: ${input || 'tu tarea'}`} />}
            </div>
            <div className="relative">
              <textarea value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Ej: Quiero crear una infografía educativa sobre el ciclo del agua para niños de 10 años..." className="w-full min-h-[80px] p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/30 focus:border-[#00BCD4] resize-none transition-all" maxLength={500} />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium">{input.length}/500</div>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={handleRecommend} disabled={input.trim().length < 3} className="px-6 py-2.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white text-sm font-bold rounded-xl hover:from-[#0A3550] hover:to-[#0097A7] transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="fa-wand-magic-sparkles" className="w-4 h-4" /> Recomendar Herramienta
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Categorías rápidas</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSuggestion(s.text)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-[#E0F7FA] border border-slate-200 hover:border-[#00BCD4]/30 rounded-lg text-xs font-medium text-slate-600 hover:text-[#004B63] transition-all">
                  <Icon name={s.icon} className="w-3.5 h-3.5 text-[#00BCD4]" /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {showResult && recommendation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#004B63] text-sm flex items-center gap-2"><Icon name="fa-circle-check" className="w-4 h-4 text-emerald-500" /> Herramienta Recomendada</h3>
                <VoiceReader text={`Te recomiendo usar ${recommendation.tool.title}. ${recommendation.reason}. El modelo recomendado es ${recommendation.model} en modo ${recommendation.mode}.`} />
              </div>

              <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] p-5 rounded-xl text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Icon name={recommendation.tool.icon} className="w-5 h-5 text-[#00BCD4]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{recommendation.tool.title}</h4>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-${getToolColor(recommendation.tool.color)}-500/20 text-${getToolColor(recommendation.tool.color)}-300`}>{recommendation.model} · {recommendation.mode}</span>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-3">{recommendation.reason}</p>
              </div>

              <div className="bg-[#F0FDFF] p-4 rounded-xl border border-[#00BCD4]/10">
                <h4 className="font-bold text-[#004B63] text-xs mb-2 flex items-center gap-1.5"><Icon name="fa-lightbulb" className="w-3.5 h-3.5" /> Prompt sugerido</h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <code className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">{recommendation.prompt}</code>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">Personaliza el prompt según tus necesidades específicas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 text-xs mb-2 flex items-center gap-1.5"><Icon name="fa-circle-check" className="w-3.5 h-3.5" /> Tips</h4>
                  <ul className="space-y-1">
                    {recommendation.tips.map((tip, i) => <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {tip}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-amber-800 text-xs mb-2 flex items-center gap-1.5"><Icon name="fa-arrows-rotate" className="w-3.5 h-3.5" /> Alternativas</h4>
                  <ul className="space-y-1">
                    {recommendation.alternatives.map((alt, i) => <li key={i} className="text-xs text-slate-700">{alt}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {showResult && !recommendation && input.trim().length >= 3 && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
              <Icon name="fa-circle-info" className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-amber-800 text-sm">No se encontró una recomendación específica</p>
                <p className="text-xs text-amber-700 mt-1">Prueba describiendo tu tarea con más detalle, o selecciona una categoría rápida arriba.</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default IALabInteractionAdvisor;
