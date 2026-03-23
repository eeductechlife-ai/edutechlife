import React, { useEffect, useState, useRef } from 'react';
import { Eye, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useInView } from 'framer-motion';

const QUESTIONS = [
  { id: 1, text: '¿Cómo prefieres aprender a usar una nueva app en tu celular?', options: [
    { text: 'Tutoriales en video', type: 'visual' },
    { text: 'Explicación paso a paso', type: 'auditivo' },
    { text: 'Prueba y error', type: 'kinestesico' },
    { text: 'Opiniones de otros usuarios', type: 'visual' }
  ]},
  { id: 2, text: 'En clase, ¿cómo retienes mejor la información?', options: [
    { text: 'Notas con colores', type: 'visual' },
    { text: 'Grabo la clase', type: 'auditivo' },
    { text: 'Hago experimentos', type: 'kinestesico' },
    { text: 'Resúmenes orales', type: 'auditivo' }
  ]},
  { id: 3, text: '¿Qué haces para memorizar fechas?', options: [
    { text: 'Tarjetas visuales', type: 'visual' },
    { text: 'Listas orales', type: 'auditivo' },
    { text: 'Recitar moviéndote', type: 'kinestesico' },
    { text: 'Escribir repetidamente', type: 'kinestesico' }
  ]},
  { id: 4, text: 'Un nuevo control en un juego. ¿Qué haces?', options: [
    { text: 'Leer instrucciones', type: 'visual' },
    { text: 'Escuchar indicaciones', type: 'auditivo' },
    { text: 'Practicar moviéndote', type: 'kinestesico' },
    { text: 'Ver un tutorial', type: 'visual' }
  ]},
  { id: 5, text: 'Como explicas una idea a un amigo que no entiende un tema?', options: [
    { text: 'Dibujo o esquema', type: 'visual' },
    { text: 'Explicación verbal', type: 'auditivo' },
    { text: 'Demostración física', type: 'kinestesico' },
    { text: 'Audio explicando', type: 'auditivo' }
  ]},
  { id: 6, text: 'Tipo de contenido en redes', options: [
    { text: 'Imágenes y textos', type: 'visual' },
    { text: 'Podcasts', type: 'auditivo' },
    { text: 'Manuales prácticos', type: 'kinestesico' },
    { text: 'Infografías', type: 'visual' }
  ]},
  { id: 7, text: 'Investigar para un trabajo. ¿Cómo lo haces?', options: [
    { text: 'Imágenes y videos', type: 'visual' },
    { text: 'Documentales', type: 'auditivo' },
    { text: 'Experimentos', type: 'kinestesico' },
    { text: 'Páginas organizadas', type: 'visual' }
  ]},
  { id: 8, text: 'Qué te relaja después de un día de clases?', options: [
    { text: 'Ver vídeos', type: 'visual' },
    { text: 'Música/podcasts', type: 'auditivo' },
    { text: 'Deporte o movimiento', type: 'kinestesico' },
    { text: 'Videojuegos/manualidades', type: 'kinestesico' }
  ]},
  { id: 9, text: 'Un tema nuevo. ¿Cómo aprendes mejor?', options: [
    { text: 'Con gráficos', type: 'visual' },
    { text: 'Con explicaciones orales', type: 'auditivo' },
    { text: 'Con ejercicios prácticos', type: 'kinestesico' },
    { text: 'Notas con colores', type: 'visual' }
  ]},
  { id: 10, text: '¿Cómo te preparas para una presentación?', options: [
    { text: 'Diapositivas y tarjetas', type: 'visual' },
    { text: 'Ensayo en voz alta', type: 'auditivo' },
    { text: 'Práctica frente a un espejo', type: 'kinestesico' },
    { text: 'Grabo mi voz y escucho', type: 'auditivo' }
  ]}
];

const STYLE_MAP = {
  visual: { name: 'APRENDIZ VISUAL', color: '#4DA8C4', description: 'Tu cerebro procesa mejor la información cuando la ves.', strategies: ['Usa colores y subrayados', 'Crea mapas mentales', 'Usa videos educativos'] },
  auditivo: { name: 'APRENDIZ AUDITIVO', color: '#66CCCC', description: 'Aprendes mejor escuchando y hablando.', strategies: ['Graba tus notas', 'Explica en voz alta', 'Escucha podcasts'] },
  kinestesico: { name: 'APRENDIZ KINESTÉSICO', color: '#FF6B9D', description: 'Necesitas moverte y practicar para aprender.', strategies: ['Toma notas a mano', 'Haz pausas activas', 'Practica con ejercicios'] }
};

const buildResultsURL = (diag) => {
  if (!diag) return '';
  try {
    const base = 'https://edutechlife.co';
    const payload = encodeURIComponent(JSON.stringify({ 
      studentName: diag.studentName, 
      date: diag.date, 
      predominantStyle: diag.predominantStyle, 
      percentage: diag.percentage 
    }));
    const dataURL = `${base}/diagnosis/vak/results?payload=${payload}`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataURL)}`;
    return qrURL;
  } catch (e) {
    return '';
  }
};

const DiagnosticoVAK = ({ onNavigate }) => {
  const [phase, setPhase] = useState('intro');
  const [studentName, setStudentName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [date, setDate] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempMood, setTempMood] = useState('');
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfTemplateRef = useRef(null);
  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef);

  useEffect(() => {
    if (phase === 'intro') {
      setDate(new Date().toLocaleDateString());
    }
  }, [phase]);

  const startTest = () => {
    setPhase('calibration');
  };

  const submitCalibration = () => {
    if (tempName.trim()) {
      setStudentName(tempName.trim());
      setPhase('test');
      setCurrentQuestion(0);
    }
  };

  const handleAnswer = (option) => {
    try {
      const idx = currentQuestion;
      const entry = { index: idx, text: option.text, type: option.type };
      const nextAnswers = [...answers, entry];
      setAnswers(nextAnswers);
      
      if (idx < QUESTIONS.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
        const c = { visual: 0, auditivo: 0, kinestesico: 0 };
        nextAnswers.forEach(a => {
          if (a.type === 'visual') c.visual++;
          else if (a.type === 'auditivo') c.auditivo++;
          else if (a.type === 'kinestesico') c.kinestesico++;
        });
        
        let predominant = 'visual';
        let max = c.visual;
        if (c.auditivo > max) { predominant = 'auditivo'; max = c.auditivo; }
        if (c.kinestesico > max) { predominant = 'kinestesico'; max = c.kinestesico; }
        
        const style = STYLE_MAP[predominant];
        const res = {
          studentName: studentName || 'Estudiante',
          date: date,
          counts: c,
          predominantStyle: predominant,
          styleDetails: style,
          percentage: Math.round((max / 10) * 100),
          answers: nextAnswers
        };
        
        setDiagnosis(res);
        setPhase('result');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const exportPDF = async () => {
    if (!diagnosis) return;
    
    const el = pdfTemplateRef.current;
    if (!el) return;
    
    setPdfLoading(true);
    
    const fileName = `Diagnostico_VAK_${(diagnosis.studentName || 'estudiante').replace(/\s+/g, '_')}_${diagnosis.date || date}`;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().set(opt).from(el).save();
    } catch (e) {
      console.error('PDF error:', e);
      setError('Error al generar PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const renderIntro = () => (
    <div className="text-center p-12">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#4DA8C4]/20 to-[#66CCCC]/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/50">
        <Eye className="w-10 h-10 text-[#004B63]" />
      </div>
      <h2 className="text-4xl font-black text-[#004B63] font-montserrat tracking-tight">Diagnóstico VAK</h2>
      <p className="text-[#64748B] mt-4 font-open-sans text-lg max-w-md mx-auto">
        Una evaluación neuro-cognitiva rápida para identificar tu estilo de aprendizaje predominante.
      </p>
      <button 
        className="mt-8 px-10 py-4 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(77,168,196,0.4)] transition-all duration-300 hover:scale-105"
        onClick={startTest}
      >
        Iniciar Evaluación
      </button>
    </div>
  );

  const renderCalibration = () => (
    <div className="p-10 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold text-[#004B63] mb-6 font-montserrat">Calibración Inicial</h3>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-bold text-[#64748B] uppercase tracking-wider">Nombre del estudiante</label>
        <input 
          className="w-full p-4 rounded-xl bg-white/50 border border-white/60 focus:bg-white focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all outline-none text-[#004B63] font-medium placeholder-[#64748B]/50" 
          placeholder="Escribe tu nombre completo" 
          value={tempName} 
          onChange={(e) => setTempName(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && submitCalibration()}
        />
      </div>
      <div className="mb-8">
        <label className="block mb-2 text-sm font-bold text-[#64748B] uppercase tracking-wider">¿Cómo te sientes hoy?</label>
        <input 
          className="w-full p-4 rounded-xl bg-white/50 border border-white/60 focus:bg-white focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 transition-all outline-none text-[#004B63] font-medium placeholder-[#64748B]/50" 
          placeholder="Describe tu ánimo en una palabra" 
          value={tempMood} 
          onChange={(e) => setTempMood(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && submitCalibration()}
        />
      </div>
      <button 
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(77,168,196,0.4)] transition-all duration-300 disabled:opacity-50"
        onClick={submitCalibration}
        disabled={!tempName.trim()}
      >
        Continuar a la Prueba
      </button>
    </div>
  );

  const renderTest = () => {
    const question = QUESTIONS[currentQuestion];
    if (!question) return null;
    
    return (
      <div className="p-10">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-bold text-[#4DA8C4] uppercase tracking-widest bg-[#4DA8C4]/10 px-4 py-1.5 rounded-full inline-block">
            Pregunta {currentQuestion + 1} de {QUESTIONS.length}
          </div>
          <div className="w-1/3 bg-gray-200 rounded-full h-1.5">
             <div className="bg-[#4DA8C4] h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`}}></div>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#004B63] mb-8 font-montserrat leading-tight">{question.text}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              className="p-6 rounded-2xl bg-white/60 border border-white/80 hover:border-[#4DA8C4]/50 hover:bg-white hover:shadow-[0_8px_30px_rgba(77,168,196,0.15)] transition-all text-left group flex items-start gap-4"
              onClick={() => handleAnswer(opt)}
            >
              <span className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] font-bold group-hover:bg-[#4DA8C4] group-hover:text-white group-hover:border-[#4DA8C4] transition-colors shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-lg font-medium text-[#334155] group-hover:text-[#004B63] transition-colors mt-0.5">
                {opt.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!diagnosis || !diagnosis.styleDetails) {
      return (
        <div className="p-10 text-center text-[#64748B]">
          No hay resultados disponibles.
        </div>
      );
    }
    
    const qrUrl = buildResultsURL(diagnosis);
    
    const radarData = [
      { subject: 'Visual', A: diagnosis.counts?.visual || 0, fullMark: 10 },
      { subject: 'Auditivo', A: diagnosis.counts?.auditivo || 0, fullMark: 10 },
      { subject: 'Kinestésico', A: diagnosis.counts?.kinestesico || 0, fullMark: 10 },
    ];
    
    return (
      <div className="p-10 space-y-8">
        <div className="text-center rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0A3550] text-white p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,75,99,0.2)] border border-white/10">
          {/* Subtle glow effect behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4DA8C4] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20 backdrop-blur-md">
                 <Eye className="w-8 h-8" style={{ color: diagnosis.styleDetails.color }} />
             </div>
             <div className="text-sm uppercase tracking-widest text-[#4DA8C4] font-bold mb-2">Perfil Dominante</div>
             <h3 className="text-3xl font-black font-montserrat mb-2" style={{ color: diagnosis.styleDetails.color }}>
                 {diagnosis.styleDetails.name}
             </h3>
             <div className="text-5xl font-mono font-bold tracking-tighter shadow-sm">{diagnosis.percentage}%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div ref={chartRef} className="h-64 h-[250px] w-full bg-white/40 rounded-3xl border border-white/60 p-4 shadow-sm">
                {isChartInView && (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#E2E8F0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#004B63', fontSize: 13, fontWeight: 700, fontFamily: 'Montserrat' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                            <Radar name="Estilo" dataKey="A" stroke={diagnosis.styleDetails.color} strokeWidth={3} fill={diagnosis.styleDetails.color} fillOpacity={0.3} />
                        </RadarChart>
                    </ResponsiveContainer>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-transparent to-[#4DA8C4]/10 border-r-4 border-[#4DA8C4]">
                    <div className="font-bold text-[#004B63] flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#4DA8C4]"></div>Visual
                    </div>
                    <div className="text-2xl font-mono font-bold text-[#4DA8C4]">{diagnosis.counts?.visual || 0}/10</div>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-transparent to-[#66CCCC]/10 border-r-4 border-[#66CCCC]">
                    <div className="font-bold text-[#004B63] flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#66CCCC]"></div>Auditivo
                    </div>
                    <div className="text-2xl font-mono font-bold text-[#66CCCC]">{diagnosis.counts?.auditivo || 0}/10</div>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-transparent to-[#FF6B9D]/10 border-r-4 border-[#FF6B9D]">
                    <div className="font-bold text-[#004B63] flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF6B9D]"></div>Kinestésico
                    </div>
                    <div className="text-2xl font-mono font-bold text-[#FF6B9D]">{diagnosis.counts?.kinestesico || 0}/10</div>
                </div>
            </div>
        </div>
        
        <div className="bg-white/60 border border-white/80 p-6 rounded-2xl shadow-sm">
          <div className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: diagnosis.styleDetails.color }}>Descripción del Perfil</div>
          <div className="text-[#334155] text-lg leading-relaxed font-open-sans">{diagnosis.styleDetails.description}</div>
        </div>
        
        <div>
            <div className="text-sm font-bold text-[#004B63] uppercase tracking-widest mb-4">Estrategias Recomendadas</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(diagnosis.styleDetails.strategies || []).map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-full opacity-10" style={{ backgroundColor: diagnosis.styleDetails.color }}></div>
                    <div className="text-3xl font-black text-gray-100 absolute -top-2 -right-2 font-mono select-none">0{idx+1}</div>
                    <div className="relative z-10 text-[#004B63] font-medium">{s}</div>
                </div>
            ))}
            </div>
        </div>
        
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-6">
            <button 
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(77,168,196,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                onClick={exportPDF}
                disabled={pdfLoading}
            >
                <Download className="w-5 h-5" />
                {pdfLoading ? 'Procesando...' : 'Descargar PDF Oficial'}
            </button>
            
            {qrUrl && (
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-[#E2E8F0] pr-6">
                <img src={qrUrl} alt="QR" className="w-16 h-16 rounded shadow-sm" />
                <div>
                    <div className="text-xs font-bold text-[#004B63] uppercase tracking-widest">Verificar</div>
                    <div className="text-xs text-[#64748B] font-mono mt-1">edutechlife.co</div>
                </div>
            </div>
            )}
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className="p-6 text-center">
      <div className="text-red-500 mb-4">Ocurrió un error al cargar el Diagnóstico VAK.</div>
      <button 
        className="px-4 py-2 rounded bg-[#4DA8C4] text-white"
        onClick={() => { setError(null); setPhase('intro'); }}
      >
        Volver a iniciar
      </button>
    </div>
  );

  return (
    <div className="diagnostico-vak min-h-screen bg-[#F8FAFC] py-12 px-4 relative overflow-hidden font-open-sans">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#66CCCC]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4DA8C4]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="justify-start mb-6 max-w-4xl mx-auto flex">
        <button 
          onClick={onNavigate ? () => onNavigate('ecosystem') : undefined}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white border border-white/80 rounded-xl transition-all shadow-sm text-[#004B63] hover:text-[#4DA8C4] font-semibold text-sm backdrop-blur-md"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver al Ecosistema
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden relative z-10">
        
        {/* Hidden PDF template */}
        <div ref={pdfTemplateRef} style={{ display: 'none' }}>
          {diagnosis && (
            <div style={{ padding: '40px', fontFamily: 'Montserrat, sans-serif' }}>
              <div style={{ paddingBottom: '20px', borderBottom: '2px solid #E2E8F0', marginBottom: '30px' }}>
                <h1 style={{ color: '#004B63', margin: '0 0 10px 0', fontSize: '28px' }}>Dictamen Oficial VAK</h1>
                <p style={{ margin: 0, color: '#64748B' }}>Edutechlife v3.0 // Inteligencia Cognitiva</p>
              </div>
              <p><strong>Estudiante:</strong> <span style={{fontSize: '18px'}}>{diagnosis.studentName}</span></p>
              <p><strong>Fecha:</strong> {diagnosis.date}</p>
              
              <div style={{ margin: '30px 0', padding: '20px', background: '#F8FAFC', borderRadius: '10px', borderLeft: `5px solid ${diagnosis.styleDetails?.color}` }}>
                <p style={{ margin: '0 0 10px 0', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Perfil Dominante</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: diagnosis.styleDetails?.color }}>{diagnosis.styleDetails?.name} ({diagnosis.percentage}%)</p>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Visual</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4DA8C4' }}>{diagnosis.counts?.visual || 0}</div>
                </div>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Auditivo</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#66CCCC' }}>{diagnosis.counts?.auditivo || 0}</div>
                </div>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Kinestésico</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B9D' }}>{diagnosis.counts?.kinestesico || 0}</div>
                </div>
              </div>

              <h4 style={{ color: '#004B63', marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Estrategias de Aprendizaje</h4>
              <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: '1.6' }}>
                {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>{s}</li>
                ))}
              </ul>

              <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px dashed #ccc', textAlign: 'center', fontSize: '12px', color: '#999' }}>
                <p>Generado automáticamente por el Ecosistema Edutechlife</p>
                <p>ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Main content */}
        {error ? renderError() : (
          <>
            {phase === 'intro' && renderIntro()}
            {phase === 'calibration' && renderCalibration()}
            {phase === 'test' && renderTest()}
            {phase === 'result' && renderResults()}
          </>
        )}
      </div>
    </div>
  );
};

export default DiagnosticoVAK;
