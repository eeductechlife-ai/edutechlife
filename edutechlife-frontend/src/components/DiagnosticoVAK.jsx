import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Mic, MicOff, ChevronRight, User, Sparkles, Download, FileText, Volume2, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const DiagnosticoVAK = ({ onNavigate }) => {
  const [phase, setPhase] = useState('calibration');
  const [studentName, setStudentName] = useState('');
  const [mood, setMood] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pdfTemplateRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "¿Cómo prefieres aprender a cocinar un nuevo platillo?",
      options: [
        { text: "Ver videos tutoriales paso a paso", type: "visual" },
        { text: "Escuchar las instrucciones y una canción mientras cocino", type: "auditivo" },
        { text: "Ir probando ingredientes y sintiendo las texturas", type: "kinestesico" }
      ]
    },
    {
      id: 2,
      text: "¿Qué haces cuando necesitas memorizar una lista de vocabulario?",
      options: [
        { text: "Escribo las palabras y las releo muchas veces", type: "visual" },
        { text: "Grabo las palabras y las escucho repetidamente", type: "auditivo" },
        { text: "Uso tarjetas físicas y las ordeno tocándolas", type: "kinestesico" }
      ]
    },
    {
      id: 3,
      text: "Estás planificando un viaje. ¿Qué actividad te emociona más?",
      options: [
        { text: "Buscar fotos increíbles y crear un tablero visual del destino", type: "visual" },
        { text: "Hablar con amigos que ya visitaron ese lugar", type: "auditivo" },
        { text: "Empacar mi mochila y sentir la emoción de tocar mapas reales", type: "kinestesico" }
      ]
    },
    {
      id: 4,
      text: "¿Cómo resuelves mejor un problema de matemáticas?",
      options: [
        { text: "Dibujo diagramas y gráficos en papel", type: "visual" },
        { text: "Explico el problema en voz alta y razono mientras hablo", type: "auditivo" },
        { text: "Uso mis manos para representar objetos y manipulo materiales", type: "kinestesico" }
      ]
    },
    {
      id: 5,
      text: "Quieres recordar el nombre de una persona que conociste. ¿Qué haces?",
      options: [
        { text: "Asocio su rostro con una imagen memorable", type: "visual" },
        { text: "Repito su nombre varias veces en mi cabeza", type: "auditivo" },
        { text: "Le estrecho la mano y converso para conectar físicamente", type: "kinestesico" }
      ]
    },
    {
      id: 6,
      text: "¿Qué tipo de libro prefieres leer en tu tiempo libre?",
      options: [
        { text: "Novelas con descripciones vívidas y mapas ilustrados", type: "visual" },
        { text: "Audiolibros o podcasts que pueda escuchar caminando", type: "auditivo" },
        { text: "Comics gráficos o libros con actividades prácticas", type: "kinestesico" }
      ]
    },
    {
      id: 7,
      text: "Estás explicando una idea a un amigo. ¿Cómo lo haces?",
      options: [
        { text: "Dibujo diagramas y esquemas en una servilleta", type: "visual" },
        { text: "Les hablo y uso muchas palabras para describir", type: "auditivo" },
        { text: "Uso gestos con las manos y me muevo mientras explico", type: "kinestesico" }
      ]
    },
    {
      id: 8,
      text: "¿Qué actividad te relaja más después de un día largo?",
      options: [
        { text: "Ver películas, series o navegar por redes sociales", type: "visual" },
        { text: "Escuchar música, podcast o llamar a un amigo", type: "auditivo" },
        { text: "Hacer ejercicio, yoga o actividades con el cuerpo", type: "kinestesico" }
      ]
    },
    {
      id: 9,
      text: "Necesitas aprender a usar una nueva aplicación en tu teléfono. ¿Qué haces?",
      options: [
        { text: "Busco tutoriales en video y capturas de pantalla", type: "visual" },
        { text: "Pido a alguien que me explique paso a paso", type: "auditivo" },
        { text: "Empiezo a tocar todo y aprendo probando", type: "kinestesico" }
      ]
    },
    {
      id: 10,
      text: "Imagina que eres docente. ¿Cómo enseñarías una nueva lección?",
      options: [
        { text: "Crearía presentaciones visuales, posters y materiales gráficos", type: "visual" },
        { text: "Prepararía una clase magistral con mucha explicación oral", type: "auditivo" },
        { text: "Organizaría actividades prácticas, experimentos y juegos", type: "kinestesico" }
      ]
    }
  ];

  useEffect(() => {
    const savedState = localStorage.getItem('edutechlife_vak_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setMessages(parsed.messages || []);
      setCurrentQuestion(parsed.currentQuestion || 0);
      setAnswers(parsed.answers || {});
      setPhase(parsed.phase || 'calibration');
      setStudentName(parsed.studentName || '');
      setMood(parsed.mood || '');
    }
  }, []);

  useEffect(() => {
    const state = {
      phase,
      studentName,
      mood,
      messages,
      currentQuestion,
      answers
    };
    localStorage.setItem('edutechlife_vak_state', JSON.stringify(state));
  }, [phase, studentName, mood, messages, currentQuestion, answers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (phase === 'test') {
      setProgress((currentQuestion / questions.length) * 100);
    }
  }, [currentQuestion, phase]);

  useEffect(() => {
    if (phase === 'calibration' && messages.length === 0) {
      setTimeout(() => {
        addMessage('assistant', "¡Hola! Soy el Dr. Valerio, tu asesor psicopedagógico virtual. 🧠 Estoy aquí para ayudarte a descubrir cómo aprendes mejor. Antes de comenzar el diagnóstico VAK, me gustaría conocerte un poco. ¿Cómo te llamas?");
      }, 500);
    }
  }, [phase]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { id: Date.now(), role, content, timestamp: new Date() }]);
  };

  const handleNameSubmit = () => {
    if (!studentName.trim()) return;
    
    addMessage('user', studentName);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage('assistant', `¡Encantado de conocerte, ${studentName}! 😊 Me alegra que estés aquí. Antes de empezar, cuéntame: ¿cómo te sientes hoy? (¿contento/a, nervioso/a, cansado/a, emocionado/a?)`);
    }, 1000);
  };

  const handleMoodSubmit = () => {
    if (!mood.trim()) return;
    
    addMessage('user', mood);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage('assistant', `¡Entiendo! Es completamente normal sentirse ${mood}. Ahora, vamos a comenzar el Diagnóstico Cognitivo VAK. Te haré 10 preguntas sobre situaciones cotidianas para descubrir tu estilo de aprendizaje predominante. ¿Listo/a? 🚀`);
      
      setTimeout(() => {
        addMessage('assistant', questions[0].text);
        setPhase('test');
      }, 1500);
    }, 1000);
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);
    
    addMessage('user', option.text);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        
        setTimeout(() => {
          addMessage('assistant', questions[currentQuestion + 1].text);
        }, 500);
      } else {
        setTimeout(() => {
          analyzeResults(newAnswers);
        }, 500);
      }
    }, 1000);
  };

  const analyzeResults = async (finalAnswers) => {
    setIsTyping(true);
    addMessage('assistant', "Excelente, has completado todas las preguntas. Estoy analizando tus respuestas para generar tu diagnóstico personalizado... 🔍");

    setTimeout(() => {
      const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
      Object.values(finalAnswers).forEach(answer => {
        counts[answer.type]++;
      });

      const maxType = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      const styles = {
        visual: {
          name: "APRENDIZ VISUAL",
          icon: "👁️",
          description: "Aprendes mejor cuando puedes ver la información. Prefieres imágenes, gráficos, mapas mentales y materiales escritos.",
          hacks: [
            "Usa colores y subrayados para destacar información importante",
            "Crea mapas mentales y diagramas para organizar ideas",
            "Visualiza los conceptos como imágenes en tu mente"
          ]
        },
        auditivo: {
          name: "APRENDIZ AUDITIVO",
          icon: "👂",
          description: "Aprendes mejor cuando escuchas y hablas. Te beneficias de explicaciones orales, discusiones y audio.",
          hacks: [
            "Graba tus notas y escúchalas repetidamente",
            "Explica los conceptos en voz alta como si enseñaras a alguien",
            "Usa música de fondo suave mientras estudias"
          ]
        },
        kinestesico: {
          name: "APRENDIZ KINESTÉSICO",
          icon: "🤲",
          description: "Aprendes mejor cuando puedes tocar, moverte y experimentar. Necesitas práctica activa y experiencias.",
          hacks: [
            "Usa tarjetas físicas que puedas manipular y mover",
            "Toma notas a mano mientras estudias",
            "Haz pausas activas: levántate, camina, haz ejercicio entre temas"
          ]
        }
      };

      const result = {
        studentName,
        mood,
        counts,
        predominantStyle: maxType,
        styleDetails: styles[maxType],
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        percentage: Math.round((counts[maxType] / 10) * 100)
      };

      setDiagnosis(result);
      setPhase('result');
      setIsTyping(false);
      
      addMessage('assistant', `¡${studentName}, tu diagnóstico está listo! 🎉`);
    }, 2000);
  };

  const handleExportPDF = async () => {
    if (!diagnosis || !studentName) return;
    
    setPdfLoading(true);
    setShowPdfPreview(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = pdfTemplateRef.current;
    if (!element) {
      setPdfLoading(false);
      setShowPdfPreview(false);
      return;
    }
    
    const fileName = `Diagnostico_VAK_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setPdfLoading(false);
    setShowPdfPreview(false);
  };

  const handleExportWord = () => {
    alert('Funcionalidad de exportación Word en desarrollo...\n\nPróximamente podrás descargar tu informe en documento Word editable.');
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const text = `Diagnóstico VAK de ${studentName}. 
        Fecha: ${diagnosis?.date}. 
        Estilo predominante: ${diagnosis?.styleDetails?.name}. 
        Descripción: ${diagnosis?.styleDetails?.description}. 
        Hacks de estudio recomendados: ${diagnosis?.styleDetails?.hacks.join('. ')}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    } else {
      alert('Tu navegador no soporta síntesis de voz.');
    }
  };

  const handleReset = () => {
    setPhase('calibration');
    setStudentName('');
    setMood('');
    setMessages([]);
    setCurrentQuestion(0);
    setAnswers({});
    setDiagnosis(null);
    setProgress(0);
    localStorage.removeItem('edutechlife_vak_state');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#E2E8F0] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate('smartboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl hover:shadow-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-[#004B63] group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold text-[#004B63]">Volver</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#004B63] font-montserrat tracking-tight">
              Diagnóstico Cognitivo VAK
            </h1>
            <p className="text-sm text-[#64748B] font-open-sans mt-1">
              Descubre cómo aprendes mejor
            </p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* Progress Bar */}
        {phase === 'test' && (
          <div className="mb-8 bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#004B63] font-open-sans">
                Progreso del diagnóstico
              </span>
              <span className="text-sm font-bold text-[#4DA8C4] font-mono">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="h-3 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] transition-all duration-500"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[rgba(178,216,229,0.5)] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-montserrat">
                  Dr. Valerio - Asesor Psicopedagógico
                </h2>
                <p className="text-sm text-white/80 font-open-sans mt-1">
                  Especialista en PNL y estilos de aprendizaje
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto p-6 space-y-4"
          >
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004B63] to-[#4DA8C4] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <div className={`rounded-2xl px-5 py-3 ${
                      message.role === 'assistant' 
                        ? 'bg-[#F1F5F9] text-[#334155]' 
                        : 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white'
                    }`}>
                      <p className="font-open-sans whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-[#64748B] mt-1 block font-open-sans">
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-[#F1F5F9] rounded-2xl px-5 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#004B63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Name */}
          {phase === 'calibration' && messages.length > 0 && !mood && (
            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Escribe tu nombre..."
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] font-open-sans"
                />
                <button
                  onClick={handleNameSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold font-open-sans hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Input Area - Mood */}
          {phase === 'calibration' && messages.length > 2 && mood === '' && (
            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMoodSubmit()}
                  placeholder="¿Cómo te sientes hoy? (ej: contento, nervioso, emocionado...)"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] font-open-sans"
                />
                <button
                  onClick={handleMoodSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold font-open-sans hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Options - Test Phase */}
          {phase === 'test' && questions[currentQuestion] && (
            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left px-5 py-4 bg-white border-2 border-[#E2E8F0] rounded-xl hover:border-[#4DA8C4] hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-open-sans text-[#334155] group-hover:text-[#004B63]">
                        {option.text}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#4DA8C4] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result Card */}
        {phase === 'result' && diagnosis && (
          <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-2xl border border-[rgba(178,216,229,0.5)] shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-8 text-center">
              <div className="text-6xl mb-4">{diagnosis.styleDetails.icon}</div>
              <h2 className="text-3xl font-bold text-white font-montserrat mb-2">
                {diagnosis.styleDetails.name}
              </h2>
              <p className="text-white/80 font-open-sans">
                {diagnosis.percentage}% de coincidencias
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#004B63] font-montserrat mb-3">
                  Perfil de Aprendizaje
                </h3>
                <p className="text-[#64748B] font-open-sans leading-relaxed">
                  {diagnosis.styleDetails.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#4DA8C4]/10 rounded-xl">
                  <div className="text-2xl font-bold text-[#4DA8C4] font-montserrat">
                    {diagnosis.counts.visual}
                  </div>
                  <div className="text-sm text-[#64748B] font-open-sans mt-1">Visual</div>
                </div>
                <div className="text-center p-4 bg-[#66CCCC]/10 rounded-xl">
                  <div className="text-2xl font-bold text-[#66CCCC] font-montserrat">
                    {diagnosis.counts.auditivo}
                  </div>
                  <div className="text-sm text-[#64748B] font-open-sans mt-1">Auditivo</div>
                </div>
                <div className="text-center p-4 bg-[#FFD166]/10 rounded-xl">
                  <div className="text-2xl font-bold text-[#FFD166] font-montserrat">
                    {diagnosis.counts.kinestesico}
                  </div>
                  <div className="text-sm text-[#64748B] font-open-sans mt-1">Kinestésico</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#004B63] font-montserrat mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFD166]" />
                  Hacks de Estudio Personalizados
                </h3>
                <div className="space-y-3">
                  {diagnosis.styleDetails.hacks.map((hack, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-[#F1F5F9] rounded-xl">
                      <CheckCircle className="w-5 h-5 text-[#4DA8C4] flex-shrink-0 mt-0.5" />
                      <p className="text-[#334155] font-open-sans">{hack}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-6">
                <h3 className="text-lg font-bold text-[#004B63] font-montserrat mb-4">
                  Exportar Resultados
                </h3>
                
                <button
                  onClick={handleExportPDF}
                  disabled={pdfLoading}
                  className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-[#FF6B9D] to-[#FF8E53] text-white rounded-xl font-bold font-montserrat hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  {pdfLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Generando Reporte Profesional...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>DESCARGAR REPORTE PROFESIONAL (PDF)</span>
                    </>
                  )}
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleExportWord}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4DA8C4]/10 border border-[#4DA8C4]/20 rounded-xl hover:bg-[#4DA8C4]/20 transition-colors group"
                  >
                    <FileText className="w-5 h-5 text-[#4DA8C4]" />
                    <span className="text-sm font-semibold text-[#004B63] font-open-sans">Documento Word</span>
                  </button>
                  <button
                    onClick={handleTextToSpeech}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#66CCCC]/10 border border-[#66CCCC]/20 rounded-xl hover:bg-[#66CCCC]/20 transition-colors group"
                  >
                    <Volume2 className="w-5 h-5 text-[#66CCCC]" />
                    <span className="text-sm font-semibold text-[#004B63] font-open-sans">Audio TTS</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold font-open-sans hover:shadow-lg transition-all duration-300"
                >
                  Realizar Nuevo Diagnóstico
                </button>
                <button
                  onClick={() => onNavigate('smartboard')}
                  className="flex-1 px-6 py-3 bg-[#F1F5F9] border border-[#E2E8F0] text-[#004B63] rounded-xl font-semibold font-open-sans hover:bg-[#E2E8F0] transition-all duration-300"
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPdfPreview && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl max-w-md text-center">
            <Loader2 className="w-12 h-12 text-[#4DA8C4] animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-2">
              Generando Reporte Profesional
            </h3>
            <p className="text-[#64748B] font-open-sans">
              La IA está preparando tu documento PDF...
            </p>
          </div>
        </div>
      )}

      <div ref={pdfTemplateRef} className="pdf-template" style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: 0,
        width: '210mm',
        background: 'white',
        fontFamily: "'Open Sans', Arial, sans-serif"
      }}>
        <style>{`
          .pdf-header {
            background: linear-gradient(135deg, #004B63 0%, #4DA8C4 100%);
            padding: 25px 30px;
            color: white;
          }
          .pdf-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .pdf-logo {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .pdf-logo-icon {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }
          .pdf-logo-text {
            font-size: 24px;
            font-weight: 800;
            font-family: 'Montserrat', Arial, sans-serif;
          }
          .pdf-title {
            text-align: right;
          }
          .pdf-title h1 {
            font-size: 18px;
            font-weight: 800;
            font-family: 'Montserrat', Arial, sans-serif;
            margin: 0;
          }
          .pdf-title p {
            font-size: 10px;
            opacity: 0.8;
            margin: 5px 0 0 0;
          }
          .pdf-student-info {
            background: #F8FAFC;
            padding: 20px 30px;
            border-bottom: 3px solid #4DA8C4;
          }
          .pdf-student-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .pdf-info-card {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #4DA8C4;
          }
          .pdf-info-label {
            font-size: 10px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .pdf-info-value {
            font-size: 16px;
            font-weight: 700;
            color: #004B63;
            font-family: 'Montserrat', Arial, sans-serif;
          }
          .pdf-section {
            padding: 25px 30px;
          }
          .pdf-section-title {
            font-size: 16px;
            font-weight: 800;
            color: #004B63;
            font-family: 'Montserrat', Arial, sans-serif;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E2E8F0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .pdf-chart {
            display: flex;
            gap: 30px;
            margin: 20px 0;
          }
          .pdf-chart-bar {
            flex: 1;
          }
          .pdf-bar-label {
            font-size: 12px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
            text-align: center;
          }
          .pdf-bar-container {
            height: 40px;
            background: #F1F5F9;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
          }
          .pdf-bar-fill {
            height: 100%;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: 700;
            font-size: 14px;
          }
          .pdf-bar-visual { background: linear-gradient(90deg, #4DA8C4, #66CCCC); }
          .pdf-bar-auditivo { background: linear-gradient(90deg, #66CCCC, #B2D8E5); }
          .pdf-bar-kinestesico { background: linear-gradient(90deg, #004B63, #4DA8C4); }
          .pdf-dominant-badge {
            display: inline-block;
            background: linear-gradient(135deg, #FF6B9D, #FF8E53);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 700;
            font-family: 'Montserrat', Arial, sans-serif;
            margin: 15px 0;
          }
          .pdf-description {
            font-size: 12px;
            line-height: 1.8;
            color: #334155;
            margin: 15px 0;
          }
          .pdf-hacks {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 15px;
          }
          .pdf-hack-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 15px;
            background: #F8FAFC;
            border-radius: 10px;
            border-left: 4px solid #4DA8C4;
          }
          .pdf-hack-icon {
            width: 28px;
            height: 28px;
            background: #4DA8C4;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            flex-shrink: 0;
          }
          .pdf-hack-text {
            font-size: 11px;
            line-height: 1.6;
            color: #334155;
          }
          .pdf-footer {
            background: #004B63;
            padding: 20px 30px;
            color: white;
            margin-top: auto;
          }
          .pdf-footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .pdf-verification {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .pdf-verification-icon {
            width: 35px;
            height: 35px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .pdf-verification-text {
            font-size: 9px;
            opacity: 0.9;
          }
          .pdf-verification-text strong {
            display: block;
            font-size: 10px;
          }
          .pdf-signature {
            text-align: right;
            font-size: 9px;
            opacity: 0.8;
          }
          .pdf-watermark {
            position: fixed;
            bottom: 10px;
            right: 10px;
            opacity: 0.1;
            font-size: 8px;
            color: #004B63;
          }
        `}</style>
        
        <div className="pdf-header">
          <div className="pdf-header-content">
            <div className="pdf-logo">
              <div className="pdf-logo-icon">🎓</div>
              <div className="pdf-logo-text">EDUTECHLIFE</div>
            </div>
            <div className="pdf-title">
              <h1>DIAGNÓSTICO NEURO-EDUCATIVO VAK</h1>
              <p>Fecha: {diagnosis?.date || new Date().toLocaleDateString('es-ES')}</p>
              <p>Documento Oficial Verificado</p>
            </div>
          </div>
        </div>

        <div className="pdf-student-info">
          <div className="pdf-student-grid">
            <div className="pdf-info-card">
              <div className="pdf-info-label">Estudiante</div>
              <div className="pdf-info-value">{diagnosis?.studentName || studentName}</div>
            </div>
            <div className="pdf-info-card">
              <div className="pdf-info-label">Estado Emocional</div>
              <div className="pdf-info-value">{diagnosis?.mood || 'No registrado'}</div>
            </div>
            <div className="pdf-info-card">
              <div className="pdf-info-label">Nivel</div>
              <div className="pdf-info-value">Estudiante</div>
            </div>
          </div>
        </div>

        <div className="pdf-section">
          <div className="pdf-section-title">
            <span>📊</span> Análisis de Estilos de Aprendizaje
          </div>
          
          <div className="pdf-chart">
            <div className="pdf-chart-bar">
              <div className="pdf-bar-label">Visual</div>
              <div className="pdf-bar-container">
                <div className="pdf-bar-fill pdf-bar-visual" style={{ width: `${(diagnosis?.counts?.visual || 0) * 10}%` }}>
                  {diagnosis?.counts?.visual || 0}
                </div>
              </div>
            </div>
            <div className="pdf-chart-bar">
              <div className="pdf-bar-label">Auditivo</div>
              <div className="pdf-bar-container">
                <div className="pdf-bar-fill pdf-bar-auditivo" style={{ width: `${(diagnosis?.counts?.auditivo || 0) * 10}%` }}>
                  {diagnosis?.counts?.auditivo || 0}
                </div>
              </div>
            </div>
            <div className="pdf-chart-bar">
              <div className="pdf-bar-label">Kinestésico</div>
              <div className="pdf-bar-container">
                <div className="pdf-bar-fill pdf-bar-kinestesico" style={{ width: `${(diagnosis?.counts?.kinestesico || 0) * 10}%` }}>
                  {diagnosis?.counts?.kinestesico || 0}
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="pdf-dominant-badge">
              {diagnosis?.styleDetails?.icon} PERFIL DOMINANTE: {diagnosis?.styleDetails?.name} ({diagnosis?.percentage}%)
            </div>
          </div>

          <p className="pdf-description">
            {diagnosis?.styleDetails?.description}
          </p>
        </div>

        <div className="pdf-section">
          <div className="pdf-section-title">
            <span>💡</span> Hacks de Estudio Personalizados
          </div>
          
          <div className="pdf-hacks">
            {(diagnosis?.styleDetails?.hacks || []).map((hack, index) => (
              <div key={index} className="pdf-hack-item">
                <div className="pdf-hack-icon">✓</div>
                <div className="pdf-hack-text">{hack}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-footer">
          <div className="pdf-footer-content">
            <div className="pdf-verification">
              <div className="pdf-verification-icon">✓</div>
              <div className="pdf-verification-text">
                <strong>DOCUMENTO OFICIAL VERIFICADO</strong>
                Edutechlife v2.286 - Plataforma Premium de Neuro-Educación
              </div>
            </div>
            <div className="pdf-signature">
              <strong>Dirección Académica</strong><br/>
              Dr. Valerio - Asesor Psicopedagógico Virtual
            </div>
          </div>
        </div>
        
        <div className="pdf-watermark">EDUTECHLIFE © 2026 - Neuro-Educación Premium</div>
      </div>
    </div>
  );
};

export default DiagnosticoVAK;
