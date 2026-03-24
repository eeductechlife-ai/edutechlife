import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
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

  const handleDownloadPDF = async () => {
    const dominantStyle = VAK_STYLES[result.dominant];
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20;

    // Colores
    const primaryColor = [0, 75, 99];
    const accentColor = [77, 168, 196];
    const secondaryColor = [102, 204, 204];
    const pinkColor = [255, 107, 157];
    const goldColor = [255, 209, 102];
    const textColor = [51, 65, 85];
    const lightBg = [248, 250, 252];

    // Función para dibujar gráfico de dona
    const drawDonutChart = (cx, cy, radius, values, colors) => {
      const total = values.reduce((a, b) => a + b, 0);
      let startAngle = -Math.PI / 2;
      
      values.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        
        // Dibujar arco
        doc.setFillColor(...colors[i]);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        
        // Crear camino del arco
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);
        
        doc.circle(cx, cy, radius, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(cx, cy, radius * 0.5, 'F');
        
        startAngle = endAngle;
      });
    };

    // Función para dibujar barra de progreso
    const drawProgressBar = (x, barY, width, value, color, label) => {
      const barHeight = 12;
      
      // Fondo de la barra
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(x, barY, width, barHeight, 2, 2, 'F');
      
      // Barra de progreso
      const fillWidth = (value / 100) * width;
      doc.setFillColor(...color);
      doc.roundedRect(x, barY, fillWidth, barHeight, 2, 2, 'F');
      
      // Porcentaje
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text(`${value}%`, x + width + 5, barY + 8);
      
      // Etiqueta
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(label, x, barY - 3);
    };

    // ==================== HEADER ====================
    // Fondo gradient del header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Logo como texto estilizado
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('EDUTECHLIFE', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('Transformando la educación con tecnología', pageWidth / 2, 28, { align: 'center' });
    
    // Badge diagnóstico
    doc.setFillColor(...accentColor);
    doc.roundedRect(pageWidth / 2 - 35, 33, 70, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DIAGNÓSTICO VAK', pageWidth / 2, 39, { align: 'center' });
    
    y = 55;

    // ==================== INFO ESTUDIANTE ====================
    // Card de información
    doc.setFillColor(...lightBg);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.text(`👤 ${userName || 'Estudiante'}`, margin + 5, y + 8);
    doc.text(`📅 ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin + 80, y + 8);
    
    y += 30;

    // ==================== RESULTADO PRINCIPAL ====================
    // Card grande de resultado
    const dominantColor = dominantStyle.color === '#4DA8C4' ? accentColor : 
                        dominantStyle.color === '#66CCCC' ? secondaryColor : pinkColor;
    
    doc.setFillColor(...dominantColor);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 50, 5, 5, 'F');
    
    // Icono grande
    const iconEmoji = dominantStyle.color === '#4DA8C4' ? '🧠' : 
                      dominantStyle.color === '#66CCCC' ? '👂' : '✋';
    doc.setFontSize(30);
    doc.setTextColor(255, 255, 255);
    doc.text(iconEmoji, margin + 15, y + 25);
    
    // Nombre del estilo
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(dominantStyle.name, margin + 40, y + 18);
    
    // Porcentaje gigante
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text(`${result.percentage}%`, pageWidth - margin - 30, y + 30);
    
    // Descripción
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    const shortDesc = dominantStyle.description ? dominantStyle.description.substring(0, 80) + '...' : '';
    doc.text(shortDesc, margin + 40, y + 38);
    
    y += 60;

    // ==================== GRÁFICO DE DISTRIBUCIÓN ====================
    // Título de sección
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('📊 Distribución de Estilos', margin, y);
    y += 10;
    
    // Dibujar gráfico de dona manual
    const chartCenterX = pageWidth / 2;
    const chartCenterY = y + 25;
    const chartRadius = 22;
    
    // Fondo del gráfico
    doc.setFillColor(248, 250, 252);
    doc.circle(chartCenterX, chartCenterY, chartRadius + 5, 'F');
    
    // Dibujar secciones del gráfico
    const values = [result.percentages.visual, result.percentages.auditivo, result.percentages.kinestesico];
    const colors = [accentColor, secondaryColor, pinkColor];
    let startAngle = -Math.PI / 2;
    
    values.forEach((value, i) => {
      const sliceAngle = (value / 100) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Arco
      doc.setFillColor(...colors[i]);
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      
      // Dibujar sector circular
      const steps = 20;
      for (let s = 0; s <= steps; s++) {
        const angle = startAngle + (sliceAngle * s / steps);
        const r = chartRadius;
        const px = chartCenterX + r * Math.cos(angle);
        const py = chartCenterY + r * Math.sin(angle);
        if (s === 0) doc.moveTo(chartCenterX, chartCenterY);
        doc.line(px, py);
      }
      doc.line(chartCenterX, chartCenterY);
      doc.circle(chartCenterX, chartCenterY, chartRadius, 'FD');
      
      startAngle = endAngle;
    });
    
    // Centro blanco (efecto dona)
    doc.setFillColor(255, 255, 255);
    doc.circle(chartCenterX, chartCenterY, chartRadius * 0.45, 'F');
    
    // Leyenda a la derecha
    const legendX = pageWidth - margin - 55;
    let legendY = y + 5;
    
    const legendItems = [
      { label: 'Visual', value: result.percentages.visual, color: accentColor, icon: '🧠' },
      { label: 'Auditivo', value: result.percentages.auditivo, color: secondaryColor, icon: '👂' },
      { label: 'Kinestésico', value: result.percentages.kinestesico, color: pinkColor, icon: '✋' }
    ];
    
    legendItems.forEach(item => {
      doc.setFillColor(...item.color);
      doc.roundedRect(legendX, legendY, 5, 5, 1, 1, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.text(`${item.icon} ${item.label}: ${item.value}%`, legendX + 8, legendY + 4);
      legendY += 8;
    });
    
    y += 55;

    // ==================== BARRAS DE PROGRESO ====================
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('📈 Nivel de Cada Estilo', margin, y);
    y += 8;
    
    drawProgressBar(margin, y + 3, 120, result.percentages.visual, accentColor, '🧠 Visual');
    y += 18;
    drawProgressBar(margin, y + 3, 120, result.percentages.auditivo, secondaryColor, '👂 Auditivo');
    y += 18;
    drawProgressBar(margin, y + 3, 120, result.percentages.kinestesico, pinkColor, '✋ Kinestésico');
    y += 30;

    // ==================== CARACTERÍSTICAS ====================
    if (dominantStyle.characteristics && dominantStyle.characteristics.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('✨ Características', margin, y);
      y += 8;
      
      const charIcons = ['👁️', '📝', '🧩', '🎨', '📖'];
      dominantStyle.characteristics.forEach((char, i) => {
        doc.setFillColor(240, 253, 250);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), 10, 2, 2, 'F');
        
        doc.setFontSize(8);
        doc.text(charIcons[i] || '•', margin + 3, y + 7);
        
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        doc.text(char, margin + 15, y + 7);
        
        y += 12;
      });
      y += 5;
    }

    // ==================== ESTRATEGIAS ====================
    if (dominantStyle.strategies && dominantStyle.strategies.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('📋 Estrategias Recomendadas', margin, y);
      y += 8;
      
      dominantStyle.strategies.forEach((strat, i) => {
        doc.setFillColor(...accentColor);
        doc.circle(margin + 3, y + 2, 2, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        doc.text(`${i + 1}. ${strat}`, margin + 10, y + 5);
        
        y += 8;
      });
      y += 5;
    }

    // ==================== TIPS ====================
    if (dominantStyle.tips && dominantStyle.tips.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('💡 Tips para Mejorar', margin, y);
      y += 8;
      
      // Box de tips con fondo colored
      doc.setFillColor(255, 209, 102, 30);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), dominantStyle.tips.length * 8 + 6, 3, 3, 'F');
      
      dominantStyle.tips.forEach((tip, i) => {
        doc.setFontSize(9);
        doc.setTextColor(...textColor);
        doc.text(`🌟 ${tip}`, margin + 5, y + 10 + (i * 8));
      });
      y += dominantStyle.tips.length * 8 + 15;
    }

    // ==================== CARRERAS ====================
    if (dominantStyle.careers && dominantStyle.careers.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('🎯 Carreras Afines', margin, y);
      y += 8;
      
      let careersX = margin;
      dominantStyle.careers.forEach((career, i) => {
        doc.setFillColor(...accentColor);
        doc.roundedRect(careersX, y, 25, 7, 2, 2, 'F');
        
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        const shortCareer = career.length > 10 ? career.substring(0, 10) : career;
        doc.text(shortCareer, careersX + 12.5, y + 5, { align: 'center' });
        
        careersX += 28;
      });
      y += 20;
    }

    // ==================== RECURSOS ====================
    if (dominantStyle.resources && dominantStyle.resources.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('📚 Recursos Recomendados', margin, y);
      y += 10;
      
      const resIcons = ['🎨', '📒', '📋'];
      dominantStyle.resources.forEach((res, i) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin + (i * 60), y, 55, 18, 3, 3, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(...accentColor);
        doc.text(resIcons[i] || '📖', margin + (i * 60) + 5, y + 7);
        
        doc.setFontSize(8);
        doc.setTextColor(...textColor);
        doc.text(res.name, margin + (i * 60) + 5, y + 14);
      });
      y += 25;
    }

    // ==================== FOOTER ====================
    const yFooter = pageHeight - 30;
    
    // Línea decorativa
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yFooter - 5, pageWidth - (margin * 2), 0.5, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('© 2024 Edutechlife - Transformando la educación con tecnología', pageWidth / 2, yFooter + 5, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text('🌐 www.edutechlife.co', pageWidth / 2, yFooter + 12, { align: 'center' });

    // Guardar PDF
    doc.save(`Diagnostico-VAK-${userName || 'Estudiante'}-${new Date().toISOString().split('T')[0]}.pdf`);
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Icon name="fa-download" />
                    Descargar Resultados PDF
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
