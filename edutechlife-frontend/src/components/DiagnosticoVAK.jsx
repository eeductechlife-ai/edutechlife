import React, { useEffect, useState, useRef } from 'react';
import { Eye, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold" style={{ color: '#004B63' }}>Diagnóstico VAK</h2>
      <p className="text-gray-500 mt-2">Una evaluación rápida para identificar tu estilo de aprendizaje.</p>
      <button 
        className="mt-4 px-6 py-2 rounded bg-[#4DA8C4] text-white hover:bg-[#3d8fae] transition-colors"
        onClick={startTest}
      >
        Iniciar
      </button>
    </div>
  );

  const renderCalibration = () => (
    <div className="p-4">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Nombre del estudiante</label>
        <input 
          className="p-2 rounded w-full border border-gray-300" 
          placeholder="Escribe tu nombre" 
          value={tempName} 
          onChange={(e) => setTempName(e.target.value)} 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">¿Cómo te sientes hoy?</label>
        <input 
          className="p-2 rounded w-full border border-gray-300" 
          placeholder="Describe tu ánimo" 
          value={tempMood} 
          onChange={(e) => setTempMood(e.target.value)} 
        />
      </div>
      <button 
        className="mt-3 px-4 py-2 rounded bg-[#4DA8C4] text-white hover:bg-[#3d8fae] transition-colors"
        onClick={submitCalibration}
      >
        Continuar
      </button>
    </div>
  );

  const renderTest = () => {
    const question = QUESTIONS[currentQuestion];
    if (!question) return null;
    
    return (
      <div className="p-4">
        <div className="mb-2 text-sm text-gray-500">
          Pregunta {currentQuestion + 1} de {QUESTIONS.length}
        </div>
        <div className="text-xl font-semibold text-gray-800 mb-4">{question.text}</div>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              className="p-3 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-left"
              onClick={() => handleAnswer(opt)}
            >
              {String.fromCharCode(65 + i)}. {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!diagnosis || !diagnosis.styleDetails) {
      return (
        <div className="p-4 text-gray-600">
          No hay resultados disponibles.
        </div>
      );
    }
    
    const qrUrl = buildResultsURL(diagnosis);
    
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" style={{ color: diagnosis.styleDetails.color }} />
          <span className="text-gray-800 font-semibold">Perfil: {diagnosis.styleDetails.name}</span>
          <span className="text-gray-500">({diagnosis.percentage}%)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded bg-gray-100">
            <div className="text-xs text-gray-500">Visual</div>
            <div className="text-2xl font-bold" style={{ color: '#4DA8C4' }}>{diagnosis.counts?.visual || 0}</div>
          </div>
          <div className="p-3 rounded bg-gray-100">
            <div className="text-xs text-gray-500">Auditivo</div>
            <div className="text-2xl font-bold" style={{ color: '#66CCCC' }}>{diagnosis.counts?.auditivo || 0}</div>
          </div>
          <div className="p-3 rounded bg-gray-100">
            <div className="text-xs text-gray-500">Kinestésico</div>
            <div className="text-2xl font-bold" style={{ color: '#FF6B9D' }}>{diagnosis.counts?.kinestesico || 0}</div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-sm font-semibold" style={{ color: diagnosis.styleDetails.color }}>Descripción</div>
          <div className="mt-1 text-gray-600">{diagnosis.styleDetails.description}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(diagnosis.styleDetails.strategies || []).map((s, idx) => (
            <div key={idx} className="p-3 rounded bg-gray-100">
              <div className="text-xs text-gray-500">Estrategia {idx + 1}</div>
              <div className="mt-1 text-gray-700">{s}</div>
            </div>
          ))}
        </div>
        
        <button 
          className="px-4 py-2 rounded bg-[#4DA8C4] text-white hover:bg-[#3d8fae] transition-colors flex items-center gap-2 disabled:opacity-50"
          onClick={exportPDF}
          disabled={pdfLoading}
        >
          <Download className="w-4 h-4" />
          {pdfLoading ? 'Generando...' : 'Descargar PDF'}
        </button>
        
        {qrUrl && (
          <div className="text-center mt-4">
            <img src={qrUrl} alt="QR" style={{ width: 100, height: 100, margin: '0 auto' }} />
            <div className="text-xs text-gray-500 mt-1">https://edutechlife.co/</div>
          </div>
        )}
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
    <div className="diagnostico-vak" style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Hidden PDF template */}
      <div ref={pdfTemplateRef} style={{ display: 'none' }}>
        {diagnosis && (
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#004B63', marginBottom: '10px' }}>Diagnóstico VAK</h1>
            <p><strong>Nombre:</strong> {diagnosis.studentName}</p>
            <p><strong>Fecha:</strong> {diagnosis.date}</p>
            <p><strong>Perfil:</strong> {diagnosis.styleDetails?.name}</p>
            <p><strong>Porcentaje:</strong> {diagnosis.percentage}%</p>
            <p><strong>Conteos:</strong></p>
            <ul>
              <li>Visual: {diagnosis.counts?.visual || 0}</li>
              <li>Auditivo: {diagnosis.counts?.auditivo || 0}</li>
              <li>Kinestésico: {diagnosis.counts?.kinestesico || 0}</li>
            </ul>
            <p><strong>Estrategias:</strong></p>
            <ol>
              {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
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
  );
};

export default DiagnosticoVAK;
