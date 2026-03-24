import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import html2pdf from 'html2pdf.js';
import FloatingParticles from './FloatingParticles';
import { Icon } from '../utils/iconMapping.jsx';
import { VAK_QUESTIONS, VAK_STYLES, calculateVAKResult, getVAKChartData } from '../constants/vakData';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -15, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      type: 'spring',
      stiffness: 100,
      damping: 20
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    rotateX: 15, 
    y: -20,
    transition: { duration: 0.4 }
  }
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

const pulseVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: [0.8, 1.2, 1],
    opacity: [0, 0.5, 1],
    transition: { duration: 0.5 }
  }
};

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const VAKDiagnostic = memo(({ onNavigate, userName: initialName = '', initialMood = '' }) => {
  const [phase, setPhase] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userName, setUserName] = useState(initialName);
  const [tempMood, setTempMood] = useState(initialMood);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const sectionRef = useRef(null);

  const question = VAK_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / VAK_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === VAK_QUESTIONS.length - 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('intro');
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleStart = () => {
    setPhase('calibration');
  };

  const handleCalibrationSubmit = () => {
    setPhase('test');
  };

  const handleAnswerSelect = (option, index) => {
    if (isAnimating) return;
    setSelectedAnswer(index);
    setIsAnimating(true);

    setTimeout(() => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setIsAnimating(false);

      if (isLastQuestion) {
        const calculatedResult = calculateVAKResult(newAnswers);
        setResult(calculatedResult);
        setShowConfetti(true);
        setPhase('result');
        setTimeout(() => setShowConfetti(false), 3000);
        
        localStorage.setItem('vak_result', JSON.stringify({
          ...calculatedResult,
          userName,
          date: new Date().toISOString()
        }));
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 600);
  };

  const generatePDFHTML = (result, dominantStyle, userName) => {
    const colors = {
      primary: '#004B63',
      accent: '#4DA8C4',
      secondary: '#66CCCC',
      kinestesico: '#FF6B9D',
      text: '#475569',
      textLight: '#64748B',
      white: '#FFFFFF',
      bg: '#F8FAFC'
    };

    const dominantColor = result.dominant === 'visual' ? colors.accent : 
                         result.dominant === 'auditivo' ? colors.secondary : colors.kinestesico;

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: ${colors.bg}; color: ${colors.text};">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${colors.primary} 0%, #006080 100%); color: white; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">EDUTECHLIFE</h1>
            <p style="margin: 5px 0 0; font-size: 11px; opacity: 0.8;">Education Technology</p>
          </div>
          <div style="background: ${colors.accent}; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 600;">
            DIAGNÓSTICO VAK
          </div>
        </div>

        <!-- User Info -->
        <div style="background: ${colors.bg}; padding: 15px 30px; border-bottom: 1px solid #E2E8F0;">
          <p style="margin: 0; font-size: 12px; color: ${colors.textLight};">
            <strong style="color: ${colors.text};">Estudiante:</strong> ${userName || 'Estudiante'} &nbsp;|&nbsp; 
            <strong style="color: ${colors.text};">Fecha:</strong> ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <!-- Hero Result -->
        <div style="background: linear-gradient(135deg, ${dominantColor} 0%, ${dominantColor}dd 100%); padding: 30px; text-align: center; color: white;">
          <p style="margin: 0 0 10px; font-size: 12px; opacity: 0.9;">Tu estilo de aprendizaje dominante</p>
          <h2 style="margin: 0; font-size: 32px; font-weight: bold;">${dominantStyle.name}</h2>
          <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${result.percentage}%</div>
          <p style="margin: 0; font-size: 11px; opacity: 0.8;">dominante</p>
        </div>

        <!-- Chart Section -->
        <div style="padding: 25px 30px; background: white;">
          <h3 style="margin: 0 0 20px; font-size: 14px; color: ${colors.primary}; font-weight: 600;">Distribución de Estilos</h3>
          
          <!-- Style Cards -->
          <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 20px;">
            <div style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 15px 20px; text-align: center; min-width: 100px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 12px; height: 12px; background: ${colors.accent}; border-radius: 50%; margin: 0 auto 8px;"></div>
              <p style="margin: 0 0 5px; font-size: 11px; color: ${colors.textLight};">Visual</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${colors.text};">${result.percentages.visual}%</p>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 15px 20px; text-align: center; min-width: 100px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 12px; height: 12px; background: ${colors.secondary}; border-radius: 50%; margin: 0 auto 8px;"></div>
              <p style="margin: 0 0 5px; font-size: 11px; color: ${colors.textLight};">Auditivo</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${colors.text};">${result.percentages.auditivo}%</p>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 15px 20px; text-align: center; min-width: 100px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 12px; height: 12px; background: ${colors.kinestesico}; border-radius: 50%; margin: 0 auto 8px;"></div>
              <p style="margin: 0 0 5px; font-size: 11px; color: ${colors.textLight};">Kinestésico</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${colors.text};">${result.percentages.kinestesico}%</p>
            </div>
          </div>

          <!-- Progress Bars -->
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 11px; color: ${colors.text};">Visual</span>
                <span style="font-size: 11px; color: ${colors.textLight};">${result.percentages.visual}%</span>
              </div>
              <div style="background: #E2E8F0; border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: ${colors.accent}; width: ${result.percentages.visual}%; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 11px; color: ${colors.text};">Auditivo</span>
                <span style="font-size: 11px; color: ${colors.textLight};">${result.percentages.auditivo}%</span>
              </div>
              <div style="background: #E2E8F0; border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: ${colors.secondary}; width: ${result.percentages.auditivo}%; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 11px; color: ${colors.text};">Kinestésico</span>
                <span style="font-size: 11px; color: ${colors.textLight};">${result.percentages.kinestesico}%</span>
              </div>
              <div style="background: #E2E8F0; border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: ${colors.kinestesico}; width: ${result.percentages.kinestesico}%; height: 100%; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div style="padding: 25px 30px; background: ${colors.bg};">
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <!-- Características -->
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 15px; font-size: 13px; color: ${colors.primary}; font-weight: 600;">Características Principales</h4>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${(dominantStyle.characteristics || []).slice(0, 3).map(char => `
                  <li style="margin-bottom: 8px; font-size: 11px; color: ${colors.text}; display: flex; align-items: flex-start;">
                    <span style="color: ${colors.accent}; margin-right: 8px;">•</span>${char}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Estrategias -->
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 15px; font-size: 13px; color: ${colors.primary}; font-weight: 600;">Estrategias Recomendadas</h4>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${(dominantStyle.strategies || []).slice(0, 3).map((strat, i) => `
                  <li style="margin-bottom: 8px; font-size: 11px; color: ${colors.text}; display: flex; align-items: flex-start;">
                    <span style="color: ${colors.secondary}; margin-right: 8px; font-weight: bold;">${i + 1}.</span>${strat.substring(0, 40)}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Tips -->
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 15px; font-size: 13px; color: ${colors.primary}; font-weight: 600;">Tips para Mejorar</h4>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${(dominantStyle.tips || []).slice(0, 3).map(tip => `
                  <li style="margin-bottom: 8px; font-size: 11px; color: ${colors.text}; display: flex; align-items: flex-start;">
                    <span style="color: #FFD166; margin-right: 8px;">★</span>${tip.substring(0, 40)}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Carreras -->
            <div style="flex: 1; min-width: 200px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 15px; font-size: 13px; color: ${colors.primary}; font-weight: 600;">Carreras Afines</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${(dominantStyle.careers || []).slice(0, 4).map(career => `
                  <span style="background: ${colors.accent}; color: white; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 500;">${career}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: ${colors.primary}; color: white; padding: 20px 30px; text-align: center;">
          <p style="margin: 0 0 5px; font-size: 11px; opacity: 0.8;">© 2024 Edutechlife - Transformando la educación con tecnología</p>
          <p style="margin: 0; font-size: 12px; font-weight: 600;">www.edutechlife.co</p>
        </div>
      </div>
    `;
  };

  const handleDownloadPDF = async () => {
    console.log('[PDF] ===== INICIANDO GENERACIÓN DE PDF =====');
    console.log('[PDF] Resultado disponible:', !!result);
    console.log('[PDF] Usuario:', userName);
    console.log('[PDF] html2pdf disponible:', typeof html2pdf);
    
    if (!result) {
      console.error('[PDF] Error: No hay resultado disponible');
      alert('Error: No hay resultado disponible');
      return;
    }

    setPdfLoading(true);
    
    const dominantStyle = VAK_STYLES[result.dominant];
    const htmlContent = generatePDFHTML(result, dominantStyle, userName);
    const filename = `Diagnostico-VAK-${userName || 'Estudiante'}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    try {
      console.log('[PDF] Generando plantilla HTML...');
      console.log('[PDF] HTML generado, longitud:', htmlContent.length);
      
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.width = '595px';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      
      console.log('[PDF] Contenedor creado, intentando html2pdf...');
      
      const opt = {
        margin: 0,
        filename: filename,
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

      await html2pdf()
        .set(opt)
        .from(container)
        .save();
      
      console.log('[PDF] PDF guardado exitosamente');
      document.body.removeChild(container);
      
    } catch (error) {
      console.error('[PDF] Error con html2pdf:', error);
      console.error('[PDF] Stack trace:', error.stack);
      
      // Fallback: abrir en nueva ventana para imprimir
      try {
        console.log('[PDF] Intentando método alternativo...');
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${filename}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                @media print { body { padding: 0; } }
              </style>
            </head>
            <body>${htmlContent}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        } else {
          throw new Error('No se pudo abrir ventana de impresión');
        }
      } catch (fallbackError) {
        console.error('[PDF] Error en fallback:', fallbackError);
        alert('Error al generar PDF. Por favor intenta de nuevo o contacta soporte.');
      }
    } finally {
      setPdfLoading(false);
      console.log('[PDF] ===== FIN GENERACIÓN PDF =====');
    }
  };

  const chartData = result ? getVAKChartData(result.percentages) : [];
  const dominantStyle = result ? VAK_STYLES[result.dominant] : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
    visible: { opacity: 1, scale: 1, rotateX: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 0.9, rotateX: 10, transition: { duration: 0.4 } }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <FloatingParticles count={20} className="z-0" colors={['#4DA8C4', '#66CCCC', '#FF6B9D']} />
      
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#4DA8C4]/10 blur-[120px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-[#66CCCC]/10 blur-[120px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-20"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#4DA8C4]">Diagnóstico</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                </div>
              </motion.div>

              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#004B63] tracking-tight mb-6">
                Descubre Tu Estilo
                <span className="block mt-2 gradient-text-animated">de Aprendizaje</span>
              </motion.h2>

              <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                El test VAK identifica cómo procesas y retienes información. 
                Conoce si eres <strong className="text-[#4DA8C4]">visual</strong>, <strong className="text-[#66CCCC]">auditivo</strong> o <strong className="text-[#FF6B9D]">kinestésico</strong> para optimizar tu estudio.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden px-10 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="absolute inset-0 w-[150%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] skew-x-[-20deg]" />
                  <span className="relative z-10">Comenzar Diagnóstico</span>
                  <Icon name="fa-rocket" className="inline-block ml-2" />
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { icon: 'fa-brain', label: '10 Preguntas', color: '#4DA8C4' },
                  { icon: 'fa-clock', label: '5 Minutos', color: '#66CCCC' },
                  { icon: 'fa-chart-pie', label: 'Resultados Instantáneos', color: '#FF6B9D' }
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                    <Icon name={item.icon} className="text-2xl mb-2" style={{ color: item.color }} />
                    <p className="text-sm text-slate-600">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {phase === 'calibration' && (
            <motion.div
              key="calibration"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-16"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h3 className="text-2xl font-bold text-[#004B63] mb-4">Antes de comenzar</h3>
                <p className="text-slate-600">Cuéntanos un poco sobre ti</p>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">¿Cómo te llamas?</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all text-[#004B63] placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">¿Cómo te sientes hoy?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['😊 Bien', '😐 Regular', '😔 Mal'].map((mood, i) => (
                      <button
                        key={i}
                        onClick={() => setTempMood(mood)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          tempMood === mood 
                            ? 'border-[#4DA8C4] bg-[#4DA8C4]/10' 
                            : 'border-gray-200 bg-white/50 hover:border-[#4DA8C4]/50'
                        }`}
                      >
                        <span className="text-2xl">{mood.split(' ')[0]}</span>
                        <p className="text-xs text-slate-600 mt-1">{mood.split(' ')[1]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleCalibrationSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Continuar al Test
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {phase === 'test' && (
            <motion.div
              key="test"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-10"
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-500">Pregunta</span>
                  <motion.span 
                    key={currentQuestion}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-4 py-1 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full text-white font-bold shadow-lg"
                  >
                    {currentQuestion + 1} / {VAK_QUESTIONS.length}
                  </motion.span>
                </div>
                
                <div className="w-full max-w-md mx-auto h-3 bg-gray-200/50 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%]"
                    initial={{ width: 0, backgroundPosition: '100% 0' }}
                    animate={{ width: `${progress}%`, backgroundPosition: '0% 0' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 2s linear infinite' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[sweep_2s_ease-in-out_infinite]" />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-white/60 relative overflow-hidden">
                    {/* Decorative gradient orbs */}
                    <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-30%] left-[-10%] w-48 h-48 bg-gradient-to-tr from-[#FF6B9D]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    
                    <motion.h3 
                      key={`q-${currentQuestion}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl md:text-2xl font-semibold text-[#004B63] text-center mb-8 relative z-10"
                    >
                      {question.text}
                    </motion.h3>

                    <div className="space-y-4 relative z-10">
                      {question.options.map((option, index) => (
                        <motion.button
                          key={index}
                          custom={index}
                          variants={optionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onClick={() => handleAnswerSelect(option, index)}
                          disabled={isAnimating}
                          whileHover={{ scale: 1.02, x: 8, boxShadow: '0 10px 30px rgba(77, 168, 196, 0.2)' }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 group ${
                            selectedAnswer === index
                              ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 shadow-lg'
                              : 'border-gray-200 hover:border-[#4DA8C4]/50 bg-white/50 hover:bg-white'
                          } ${isAnimating ? 'pointer-events-none opacity-50' : ''}`}
                          style={{
                            borderColor: selectedAnswer === index ? VAK_STYLES[option.type]?.color : undefined,
                            backgroundColor: selectedAnswer === index ? `${VAK_STYLES[option.type]?.color}15` : undefined
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                option.type === 'visual' ? 'bg-[#4DA8C4]/10 text-[#4DA8C4]' :
                                option.type === 'auditivo' ? 'bg-[#66CCCC]/10 text-[#66CCCC]' :
                                'bg-[#FF6B9D]/10 text-[#FF6B9D]'
                              }`}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              <Icon name={option.icon || 'fa-circle'} className="text-xl" />
                            </motion.div>
                            <span className="text-slate-700 font-medium group-hover:text-[#004B63] transition-colors">{option.text}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'result' && result && (
            <motion.div
              key="result"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-10"
            >
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: window.innerWidth / 2, 
                        y: window.innerHeight,
                        scale: 0,
                        rotate: 0
                      }}
                      animate={{ 
                        x: Math.random() * window.innerWidth,
                        y: -100,
                        scale: 1,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5
                      }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: ['#4DA8C4', '#66CCCC', '#FF6B9D', '#FFD166'][Math.floor(Math.random() * 4)]
                      }}
                    />
                  ))}
                </div>
              )}

              <motion.div variants={itemVariants} className="text-center mb-10">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#4DA8C4]" />
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#4DA8C4]">Resultados</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#4DA8C4]" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#004B63] mb-2">
                  Tu Estilo de Aprendizaje
                </h2>
                {userName && (
                  <p className="text-slate-600">Hola, <span className="font-semibold text-[#4DA8C4]">{userName}</span></p>
                )}
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <motion.div 
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${dominantStyle.gradient} rounded-3xl p-8 border ${dominantStyle.borderColor} backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${dominantStyle.color}20` }}
                    >
                      <Icon name={dominantStyle.icon} className="text-3xl" style={{ color: dominantStyle.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: dominantStyle.color }}>
                        {dominantStyle.name}
                      </h3>
                      <p className="text-sm text-slate-600">{result.percentage}% dominante</p>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-6 leading-relaxed">
                    {dominantStyle.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#004B63]">Estrategias Recomendadas:</h4>
                    {dominantStyle.strategies.map((strategy, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Icon name="fa-check-circle" className="text-sm mt-1" style={{ color: dominantStyle.color }} />
                        <span className="text-slate-600 text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-lg">
                  <h4 className="text-lg font-semibold text-[#004B63] mb-6 text-center">
                    Distribución VAK
                  </h4>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fill: '#64748B', fontSize: 10 }}
                          axisLine={false}
                        />
                        <Radar
                          name="VAK"
                          dataKey="value"
                          stroke={dominantStyle.color}
                          fill={dominantStyle.color}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-center gap-6 mt-4">
                    {Object.entries(result.percentages).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="w-3 h-3 rounded-full mx-auto mb-1"
                          style={{ backgroundColor: VAK_STYLES[key].color }}
                        />
                        <span className="text-xs text-slate-600">{key}</span>
                        <p className="font-semibold text-[#004B63]">{value}%</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                    whileHover={pdfLoading ? {} : { scale: 1.05 }}
                    whileTap={pdfLoading ? {} : { scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all ${pdfLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {pdfLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <Icon name="fa-download" />
                        Descargar Resultados PDF
                      </>
                    )}
                  </motion.button>

                  {onNavigate && (
                    <motion.button
                      onClick={() => onNavigate('ialab')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#004B63] border-2 border-[#004B63] rounded-full font-semibold hover:bg-[#004B63] hover:text-white transition-all"
                    >
                      <Icon name="fa-rocket" />
                      Ir a IA Lab
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

VAKDiagnostic.displayName = 'VAKDiagnostic';

export default VAKDiagnostic;
