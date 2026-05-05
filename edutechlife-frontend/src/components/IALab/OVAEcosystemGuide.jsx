import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  TrendingUp, 
  Cpu, 
  Brain, 
  Wrench, 
  Search, 
  Layout, 
  Database, 
  Share2, 
  Zap, 
  Settings, 
  MessageSquare, 
  Target, 
  AlertTriangle,
  PlaySquare,
  StopCircle,
  ChevronDown,
  Lightbulb
} from 'lucide-react';

const infographicData = {
  header: {
    title: "Dominando el Ecosistema ChatGPT",
    subtitle: "De la Teoría a la Acción Profesional",
  },
  sections: [
    {
      id: "evolution",
      title: "Evolución del Motor de IA (Modelos GPT)",
      icon: TrendingUp,
      color: "border-blue-500",
      content: "ChatGPT se convirtió en la aplicación de más rápido crecimiento en la historia tras su lanzamiento en noviembre de 2022, alcanzando 100 Millones de Usuarios en 2 meses.",
      details: [
        { 
          title: "GPT-4o", 
          date: "Mayo 2024", 
          text: "Multimodal omni (texto, imagen, audio).",
          extendedText: "Este modelo rompió las barreras de latencia. Permite interacciones de voz en tiempo real sin los retrasos típicos, puede 'ver' a través de la cámara de un smartphone y analizar el entorno instantáneamente, y procesa audio de forma nativa en lugar de convertirlo previamente a texto." 
        },
        { 
          title: "GPT-5", 
          date: "Agosto 2025", 
          text: "Sistema optimizado, drástica reducción de alucinaciones.",
          extendedText: "Un salto cualitativo hacia la fiabilidad empresarial. Se enfoca en flujos de trabajo orientados a agentes (Agentic Workflows), donde la IA puede interactuar de manera más segura con bases de datos externas y cometer significativamente menos errores lógicos o inventar datos." 
        },
        { 
          title: "GPT-5.5", 
          date: "Abril 2026", 
          text: "Razonamiento autónomo y planificación paso a paso.",
          extendedText: "Representa el modelo más inteligente de la década. Puede recibir un objetivo complejo (ej. 'Crea una campaña de marketing completa'), desglosarlo en tareas pequeñas, ejecutar el código necesario, corregir sus propios errores y usar múltiples herramientas web sin intervención humana constante." 
        }
      ]
    },
    {
      id: "modes",
      title: "Modos de Operación",
      icon: Cpu,
      color: "border-teal-500",
      content: "La IA adapta su capacidad de procesamiento y tiempo de respuesta según la complejidad de la tarea.",
      details: [
        { 
          title: "Modo Fast (Rápido)", 
          text: "Respuestas instantáneas a tareas simples y directas.",
          extendedText: "Ideal para la productividad diaria: resumir cadenas de correos largos, generar ideas rápidas de contenido (brainstorming), redactar respuestas a clientes o corregir la gramática de un texto en segundos. Prioriza la velocidad sobre el análisis profundo." 
        },
        { 
          title: "Modo Thinking (Profundo)", 
          text: "Análisis detallados y decisiones estratégicas. Requiere tiempo de procesamiento.",
          extendedText: "La IA invierte tiempo en 'pensar' antes de escribir. Es esencial para resolver bugs de código complejos, diseñar arquitecturas de software, escribir ensayos académicos analíticos, o modelar escenarios financieros donde un error superficial sería costoso." 
        }
      ]
    },
    {
      id: "tools",
      title: "La Caja de Herramientas Integrada",
      icon: Wrench,
      color: "border-orange-500",
      content: "ChatGPT evolucionó de ser un simple chatbot a convertirse en un entorno de trabajo digital (Workspace) completo.",
      details: [
        { 
          title: "Búsqueda Web e Intérprete de Código", 
          text: "Acceso a datos en vivo y ejecución de scripts en Python.", 
          icon: Search,
          extendedText: "Puedes subir un archivo Excel crudo y pedirle que limpie los datos, haga análisis estadísticos (como regresiones) y genere gráficos interactivos. La IA escribe el código Python en segundo plano, lo ejecuta y te entrega el resultado visual."
        },
        { 
          title: "Canvas: Edición Colaborativa", 
          text: "Un entorno de trabajo conjunto en una ventana lateral.", 
          icon: Layout,
          extendedText: "En lugar de regenerar todo un texto en el chat, Canvas te abre un documento lateral. Puedes seleccionar un solo párrafo y pedir 'haz este párrafo más profesional', o editar el código directamente mientras la IA revisa tus cambios. Ideal para proyectos largos."
        },
        { 
          title: "Memoria y Proyectos", 
          text: "Recuerda preferencias y organiza contextos complejos bajo 'Proyectos'.", 
          icon: Database,
          extendedText: "Si configuras un 'Proyecto' para Edutechlife, puedes subir el manual de marca y directrices. A partir de ahí, cualquier chat dentro de ese proyecto recordará usar tus colores, tono de voz institucional y formatos preferidos sin tener que repetirlo."
        }
      ]
    },
    {
      id: "automation",
      title: "Conectividad y Automatización",
      icon: Share2,
      color: "border-purple-500",
      content: "El verdadero poder llega al conectar tu IA con el mundo exterior y tus aplicaciones del día a día.",
      details: [
        { 
          title: "Zapier", 
          text: "Automatizaciones Simples e intuitivas.", 
          icon: Zap,
          extendedText: "Excelente para principiantes. Ejemplo: 'Cada vez que reciba un correo etiquetado como Factura en Gmail, usa la IA para extraer el monto y añádelo automáticamente a una fila en Google Sheets'."
        },
        { 
          title: "Make (Integromat)", 
          text: "Flujos Complejos y potentes (1,000 operaciones/mes gratis).", 
          icon: Settings,
          extendedText: "Permite bifurcaciones lógicas avanzadas. Ejemplo: 'Si entra un lead por Facebook, analiza su mensaje con IA. Si está enojado, notifica en Slack urgente. Si es una duda común, envía un email automático usando el manual de la empresa'."
        },
        { 
          title: "Integración Nativa: Workspace y Slack", 
          text: "Capacidad de actuar directamente sobre tus plataformas corporativas.", 
          icon: MessageSquare,
          extendedText: "La IA ya no vive solo en su app. Puedes usar @ChatGPT en Slack para que te resuma un hilo de 50 mensajes de tus compañeros mientras estabas en una reunión, ahorrando minutos vitales de lectura."
        }
      ]
    },
    {
      id: "prompt",
      title: "El Arte del Prompt Estratégico",
      icon: Target,
      color: "border-rose-500",
      content: "La calidad de la respuesta de la IA depende directamente de la ingeniería de la instrucción (Prompt Engineering).",
      details: [
        { 
          title: "Los 6 Elementos del Prompt Perfecto", 
          text: "Rol, Contexto, Tarea, Formato, Restricciones y Ejemplos.",
          extendedText: "1. Rol: 'Actúa como un experto en e-learning'. 2. Contexto: 'Doy clases a universitarios'. 3. Tarea: 'Crea un temario'. 4. Formato: 'En tabla Markdown'. 5. Restricciones: 'Máximo 4 módulos'. 6. Ejemplos (Few-shot): 'Aquí tienes un ejemplo de cómo me gusta el estilo...'."
        },
        { 
          title: "Chain of Thought (Cadena de Pensamiento)", 
          text: "Forzar a la IA a desglosar su razonamiento mejora su precisión.", 
          icon: Brain,
          extendedText: "Si añades la frase 'Piensa paso a paso y explica tu lógica antes de dar la respuesta final', el rendimiento de la IA en matemáticas o toma de decisiones sube drásticamente, ya que el modelo se da espacio para procesar antes de predecir la última palabra."
        },
        { 
          title: "Gestión de Alucinaciones", 
          text: "La advertencia crítica: La IA puede generar datos falsos con gran elocuencia.", 
          icon: AlertTriangle,
          extendedText: "Los modelos lingüísticos buscan predecir la siguiente palabra de forma probable, no buscar la 'verdad'. Es imperativo usar la herramienta de 'Búsqueda Web' si necesitas hechos recientes, y siempre verificar fechas, cifras y citas bibliográficas en fuentes primarias."
        }
      ]
    }
  ]
};

const EdutechLogo = () => (
  <div className="flex items-center text-3xl md:text-4xl font-bold tracking-tight select-none">
    <span style={{ color: '#2596be' }}>Edu</span>
    <span style={{ color: '#133c55' }}>techlife</span>
  </div>
);

const AudioButton = ({ text, isPlaying, onPlay, onStop }) => {
  return (
    <button 
      onClick={isPlaying ? onStop : () => onPlay(text)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm shrink-0
        ${isPlaying 
          ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300' 
          : 'bg-[#2596be] text-white hover:bg-[#1f7e9f] shadow-md'}`}
      title={isPlaying ? "Detener lectura" : "Escuchar contenido"}
    >
      {isPlaying ? <StopCircle size={18} /> : <Volume2 size={18} />}
      <span className="text-sm md:text-base font-bold uppercase tracking-wide">{isPlaying ? "Detener" : "Escuchar"}</span>
    </button>
  );
};

const DetailCard = ({ detail }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const DetailIcon = detail.icon || PlaySquare;

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border overflow-hidden group
      ${isExpanded ? 'border-[#2596be]' : 'border-slate-200'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-4 md:p-5 text-left relative focus:outline-none"
      >
        <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isExpanded ? 'bg-[#2596be]' : 'bg-slate-200 group-hover:bg-[#2596be]'}`}></div>
        
        <div className={`mt-1 transition-colors duration-300 ${isExpanded ? 'text-[#133c55]' : 'text-[#2596be]'}`}>
          <DetailIcon size={22} />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
            <h5 className="font-bold text-slate-800 text-base md:text-lg leading-tight">{detail.title}</h5>
            {detail.date && (
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 bg-slate-100 text-[#2596be] rounded-md self-start md:self-auto">
                {detail.date}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pr-2 md:pr-6">
            {detail.text}
          </p>
        </div>
        
        <div className={`text-slate-400 mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#2596be]' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {detail.extendedText && (
            <div className="p-4 md:p-5 pt-0 bg-slate-50 border-t border-slate-100">
              <div className="bg-blue-50/70 p-4 rounded-lg text-sm text-slate-700 leading-relaxed flex gap-3 border border-blue-100 italic">
                <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block mb-1 text-[#133c55] font-bold uppercase text-[11px] tracking-widest">Profundización:</strong>
                  {detail.extendedText}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OVAEcosystemGuide = () => {
  const [activeSectionId, setActiveSectionId] = useState('evolution');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSynthesisAvailable(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = () => {
    if (speechSynthesisAvailable) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const playAudio = (text) => {
    if (!speechSynthesisAvailable) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const generateSectionTextToSpeech = (section) => {
    let textToRead = `${section.title}. ${section.content} `;
    if (section.details && section.details.length > 0) {
      textToRead += "Conceptos clave: ";
      section.details.forEach(detail => {
        textToRead += `${detail.title}. ${detail.text} `;
        if (detail.extendedText) {
          textToRead += `Profundización: ${detail.extendedText} `;
        }
      });
    }
    return textToRead;
  };

  const handleSectionClick = (sectionId) => {
    stopAudio();
    setActiveSectionId(prev => prev === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50" style={{ borderColor: '#2596be' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <EdutechLogo />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:block">
            Módulo de Entrenamiento Interactivo
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#133c55]">
            {infographicData.header.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-light">
            {infographicData.header.subtitle}
          </p>
          <div className="h-1 w-20 bg-[#2596be] mx-auto mt-6 rounded-full opacity-50"></div>
        </div>

        <div className="space-y-4">
          {infographicData.sections.map((section) => {
            const isActive = activeSectionId === section.id;
            const Icon = section.icon;

            return (
              <div 
                key={section.id} 
                className={`bg-white rounded-3xl shadow-sm border transition-all duration-500 overflow-hidden
                  ${isActive ? 'border-[#2596be] ring-1 ring-[#2596be]/10' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none bg-white transition-colors"
                >
                  <div className="flex items-center gap-5 md:gap-6">
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-[#2596be] text-white shadow-lg rotate-3' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon size={32} />
                    </div>
                    <div>
                      <h2 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-300 ${isActive ? 'text-[#133c55]' : 'text-slate-700'}`}>
                        {section.title}
                      </h2>
                      <div className={`h-0.5 bg-[#2596be] transition-all duration-500 ${isActive ? 'w-full opacity-50' : 'w-0 opacity-0'}`}></div>
                    </div>
                  </div>
                  <div className={`p-2 transition-all duration-500 ${isActive ? 'text-[#2596be] rotate-180' : 'text-slate-300'}`}>
                    <ChevronDown size={28} />
                  </div>
                </button>

                <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 md:p-8 pt-0 bg-slate-50/30">
                      
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-grow">
                          <p className="text-slate-700 leading-relaxed text-lg md:text-xl border-l-4 pl-6" style={{ borderColor: '#2596be' }}>
                            {section.content}
                          </p>
                        </div>
                        <AudioButton 
                          text={generateSectionTextToSpeech(section)}
                          isPlaying={isSpeaking}
                          onPlay={playAudio}
                          onStop={stopAudio}
                        />
                      </div>

                      <div className="flex items-center gap-2 mb-6 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2596be]"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Desglose Técnico y Práctico
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {section.details.map((detail, idx) => (
                          <DetailCard key={idx} detail={detail} />
                        ))}
                      </div>
                      
                      {section.id === 'prompt' && (
                        <div className="mt-8 p-8 bg-[#133c55] text-white rounded-[2rem] text-center shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Target size={120} />
                          </div>
                          <h5 className="font-black mb-6 text-[#2596be] text-sm uppercase tracking-widest">La Fórmula Maestra</h5>
                          <div className="flex flex-wrap justify-center gap-3 relative z-10">
                            {['Rol', 'Contexto', 'Tarea', 'Formato', 'Restricciones', 'Ejemplos'].map((elem, i) => (
                              <span key={i} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm font-bold transition-colors">
                                {elem}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      <footer className="text-center pb-16 pt-8 border-t border-slate-100 mt-12 px-6">
        <EdutechLogo />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
          Transformando la Educación con IA
        </p>
        <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-widest leading-relaxed">
          Diseñado para una experiencia de usuario fluida
          © 2026 Edutechlife
        </p>
      </footer>
    </div>
  );
};

export default OVAEcosystemGuide;
