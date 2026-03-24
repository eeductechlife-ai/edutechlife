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
  const [showUserForm, setShowUserForm] = useState(false);
  const [userData, setUserData] = useState({ nombre: '', email: '', telefono: '' });
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

  const generatePDFHTML = (result, dominantStyle, userName, userData = {}) => {
    const colors = {
      primary: '#004B63',
      accent: '#4DA8C4',
      secondary: '#66CCCC',
      kinestesico: '#FF6B9D',
      text: '#333333',
      textLight: '#666666',
      white: '#FFFFFF',
      bg: '#F5F5F5'
    };

    const displayName = userData.nombre || userName || 'Estudiante';
    const displayEmail = userData.email || 'No proporcionado';
    const displayPhone = userData.telefono || 'No proporcionado';
    const dominantColor = result.dominant === 'visual' ? colors.accent : 
                         result.dominant === 'auditivo' ? colors.secondary : colors.kinestesico;

    const charList = (dominantStyle.characteristics || []).slice(0, 3).map(c => `<li>${c}</li>`).join('');
    const stratList = (dominantStyle.strategies || []).slice(0, 3).map((s, i) => `<li>${i+1}. ${s.substring(0, 35)}</li>`).join('');
    const tipList = (dominantStyle.tips || []).slice(0, 3).map(t => `<li>${t.substring(0, 35)}</li>`).join('');
    const careerList = (dominantStyle.careers || []).slice(0, 4).map(c => `<span style="background:${colors.accent};color:white;padding:4px 8px;margin:2px;font-size:10px;">${c}</span>`).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #333; }
    .header { background: ${colors.primary}; color: white; padding: 15px 20px; }
    .header h1 { font-size: 20px; }
    .header p { font-size: 10px; }
    .badge { background: ${colors.accent}; color: white; padding: 4px 10px; font-size: 9px; }
    .info { background: ${colors.bg}; padding: 10px 20px; font-size: 11px; border-bottom: 1px solid #ddd; }
    .hero { background: ${dominantColor}; color: white; padding: 20px; text-align: center; }
    .hero h2 { font-size: 24px; }
    .hero .percent { font-size: 36px; font-weight: bold; }
    .section { padding: 15px 20px; background: white; }
    .section h3 { font-size: 12px; color: ${colors.primary}; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; }
    td { border: 1px solid #ddd; padding: 10px; text-align: center; }
    .color-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .progress { background: #eee; height: 6px; margin-top: 3px; }
    .progress-bar { height: 100%; }
    .cards { display: table; width: 100%; }
    .card { display: table-cell; width: 25%; padding: 10px; border: 1px solid #ddd; }
    .card h4 { font-size: 11px; color: ${colors.primary}; margin-bottom: 8px; }
    .card ul { padding-left: 15px; font-size: 10px; }
    .card li { margin-bottom: 4px; }
    .footer { background: ${colors.primary}; color: white; padding: 12px; text-align: center; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <table width="100%"><tr>
      <td><h1>EDUTECHLIFE</h1><p>Education Technology</p></td>
      <td align="right"><span class="badge">DIAGNOSTICO VAK</span></td>
    </tr></table>
  </div>
  <div class="info">
    <strong>Nombre:</strong> ${displayName} | <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}<br>
    <strong>Email:</strong> ${displayEmail} | <strong>Telefono:</strong> ${displayPhone}
  </div>
  <div class="hero">
    <p>Tu estilo de aprendizaje dominante</p>
    <h2>${dominantStyle.name}</h2>
    <div class="percent">${result.percentage}%</div>
    <p>dominante</p>
  </div>
  <div class="section">
    <h3>Distribucion de Estilos</h3>
    <table>
      <tr>
        <td><span class="color-dot" style="background:${colors.accent}"></span><br><strong>Visual</strong><br>${result.percentages.visual}%</td>
        <td><span class="color-dot" style="background:${colors.secondary}"></span><br><strong>Auditivo</strong><br>${result.percentages.auditivo}%</td>
        <td><span class="color-dot" style="background:${colors.kinestesico}"></span><br><strong>Kinestesico</strong><br>${result.percentages.kinestesico}%</td>
      </tr>
    </table>
    <div style="margin-top:10px;">
      <div>Visual: ${result.percentages.visual}%<div class="progress"><div class="progress-bar" style="width:${result.percentages.visual}%;background:${colors.accent}"></div></div></div>
      <div style="margin-top:5px;">Auditivo: ${result.percentages.auditivo}%<div class="progress"><div class="progress-bar" style="width:${result.percentages.auditivo}%;background:${colors.secondary}"></div></div></div>
      <div style="margin-top:5px;">Kinestesico: ${result.percentages.kinestesico}%<div class="progress"><div class="progress-bar" style="width:${result.percentages.kinestesico}%;background:${colors.kinestesico}"></div></div></div>
    </div>
  </div>
  <div class="section">
    <table class="cards">
      <tr>
        <td class="card"><h4>Caracteristicas</h4><ul>${charList}</ul></td>
        <td class="card"><h4>Estrategias</h4><ul>${stratList}</ul></td>
        <td class="card"><h4>Tips</h4><ul>${tipList}</ul></td>
        <td class="card"><h4>Carreras</h4>${careerList}</td>
      </tr>
    </table>
  </div>
  <div class="footer">
    <p>Edutechlife - Transformando la educacion con tecnologia</p>
    <p>www.edutechlife.co</p>
  </div>
</body>
</html>`;
  };

  const handleDownloadPDF = async () => {
    if (!result) {
      alert('Error: No hay resultado disponible');
      return;
    }

    setPdfLoading(true);
    
    const dominantStyle = VAK_STYLES[result.dominant];
    const htmlContent = generatePDFHTML(result, dominantStyle, userName, userData);
    
    // Método 1: Nueva ventana de impresión (más confiable)
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Diagnostico VAK - ${userData.nombre || userName || 'Estudiante'}</title>
            <style>
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none; }
              }
              @media screen {
                body { padding: 20px; }
                .print-btn {
                  position: fixed; top: 10px; right: 10px;
                  padding: 10px 20px; background: #004B63; color: white;
                  border: none; cursor: pointer; font-size: 14px;
                  border-radius: 5px;
                }
                .print-btn:hover { background: #006080; }
              }
            </style>
          </head>
          <body>
            <button class="print-btn no-print" onclick="window.print()">Imprimir / Guardar PDF</button>
            ${htmlContent.replace('<!DOCTYPE html><html><head><meta charset="UTF-8"><style>', '<style>').replace('</style></head><body>', '</head><body>').replace('</body></html>', '')}
          </body>
          </html>
        `);
        printWindow.document.close();
        setPdfLoading(false);
        return;
      }
    } catch (e) {
      console.error('Error con print window:', e);
    }
    
    // Método 2: html2pdf como fallback
    try {
      const container = document.createElement('div');
      container.innerHTML = htmlContent.replace(/<!DOCTYPE html>|<html>|<head>|<\/head>|<body>|<\/body>|<\/html>/g, '');
      container.style.position = 'absolute';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.background = 'white';
      container.style.zIndex = '-1000';
      document.body.appendChild(container);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const opt = {
        margin: 5,
        filename: `Diagnostico-VAK-${userName || 'Estudiante'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error html2pdf:', error);
      alert('Error al generar PDF. Usa Ctrl+P para imprimir la página.');
    } finally {
      setPdfLoading(false);
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
                  {showUserForm && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#004B63] mb-4">Datos para el Reporte</h3>
                        <p className="text-sm text-slate-600 mb-4">Ingresa tus datos para personalizar tu reporte</p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                            <input
                              type="text"
                              value={userData.nombre}
                              onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                            <input
                              type="email"
                              value={userData.email}
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                              placeholder="tu@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (opcional)</label>
                            <input
                              type="tel"
                              value={userData.telefono}
                              onChange={(e) => setUserData({...userData, telefono: e.target.value})}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4DA8C4] focus:border-transparent"
                              placeholder="Tu número de teléfono"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setShowUserForm(false)}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              if (!userData.nombre.trim()) {
                                alert('Por favor ingresa tu nombre');
                                return;
                              }
                              setShowUserForm(false);
                              handleDownloadPDF();
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:opacity-90 transition"
                          >
                            Generar PDF
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={() => setShowUserForm(true)}
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
