import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Brain, Send, Eye, Headphones, Hand, Download, ArrowLeft, CheckCircle, Ledger } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ValeriaHologram from './ValeriaHologram';

// Helper: build a result URL and QR for the PDF
const buildResultsURL = (diag) => {
  if (!diag) return '';
  try {
    const base = (typeof window !== 'undefined' && window.location.origin) || '';
    const payload = encodeURIComponent(JSON.stringify({ studentName: diag.studentName, date: diag.date, predominantStyle: diag.predominantStyle, percentage: diag.percentage }));
    const dataURL = `${base}/diagnosis/vak/results?payload=${payload}`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataURL)}`;
    return qrURL;
  } catch (_) {
    return '';
  }
};

// 10 fixed questions for the test
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

// Utility: generate a sample diagnosis for QA/testing
const generateSampleDiagnosis = () => {
  // Create 10 sample answers with a distribution of styles
  const sampleAnswers = Array.from({ length: 10 }).map((_, i) => {
    const type = i < 6 ? 'visual' : (i < 8 ? 'auditivo' : 'kinestesico');
    const opt = QUESTIONS[0].options.find(o => o.type === type) || QUESTIONS[0].options[0];
    return { index: i, text: opt.text, type };
  });

  const counts = { visual: 6, auditivo: 2, kinestesico: 2 };
  const styleMap = {
    visual: { name: 'APRENDIZ VISUAL', color: '#4DA8C4', description: 'Tu cerebro procesa mejor la información cuando la ves.', strategies: ['Usa colores y subrayados', 'Crea mapas mentales', 'Usa videos educativos'] },
    auditivo: { name: 'APRENDIZ AUDITIVO', color: '#66CCCC', description: 'Aprendes mejor escuchando y hablando.', strategies: ['Graba tus notas', 'Explica en voz alta', 'Escucha podcasts'] },
    kinestesico: { name: 'APRENDIZ KINESTÉSICO', color: '#FF6B9D', description: 'Necesitas moverte y practicar para aprender.', strategies: ['Toma notas a mano', 'Haz pausas activas', 'Practica con ejercicios'] }
  };
  const predominant = 'visual';
  const diag = {
    studentName: 'QA Usuario',
    date: new Date().toLocaleDateString(),
    counts,
    predominantStyle: predominant,
    styleDetails: styleMap[predominant],
    percentage: Math.round((6/10)*100),
    answers: sampleAnswers
  };
  return diag;
};

const DiagnosticoVAK = ({ onNavigate }) => {
  const [phase, setPhase] = useState('intro'); // intro | calibration | test | result
  const [studentName, setStudentName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [date, setDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [counts, setCounts] = useState({ visual:0, auditivo:0, kinestesico:0 });
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const pdfTemplateRef = useRef(null);

  useEffect(() => { if (phase === 'intro') setDate(new Date().toLocaleDateString()) }, [phase]);

  // QA Demo: auto-fill with sample data when URL contains qa_demo=1 or qa_demo=true
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const qa = url.searchParams.get('qa_demo');
      if (qa === '1' || qa === 'true' || qa === 'yes') {
        const sample = generateSampleDiagnosis();
        // populate UI with sample diagnosis
        setDiagnosis(sample);
        setPhase('result');
        setShowResults(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Start test and calibration
  const startTest = () => { setPhase('calibration'); };

  // Calibración - nombre y ánimo (simplificado)
  const [tempName, setTempName] = useState('');
  const [tempMood, setTempMood] = useState('');
  const submitCalibration = () => {
    if (tempName.trim()) {
      setStudentName(tempName.trim());
      setPhase('test');
      setCurrentQuestion(0);
    }
  };

  // Answer logic
  const handleAnswer = (option) => {
    const idx = currentQuestion;
    const entry = { index: idx, text: option.text, type: option.type };
    const nextAnswers = [...answers, entry];
    setAnswers(nextAnswers);
    if (idx < QUESTIONS.length - 1) {
      setCurrentQuestion(idx + 1);
    } else {
      // compute results
      const c = { visual:0, auditivo:0, kinestesico:0 };
      nextAnswers.forEach(a => { if (a.type==='visual') c.visual++; else if (a.type==='auditivo') c.auditivo++; else if (a.type==='kinestesico') c.kinestesico++; });
      let predominant = 'visual', max=c.visual; if (c.auditivo>max){ predominant='auditivo'; max=c.auditivo;} if (c.kinestesico>max){ predominant='kinestesico'; max=c.kinestesico; }
      const styleMap = {
        visual: { name:'APRENDIZ VISUAL', color:'#4DA8C4', description:'Tu cerebro procesa mejor la información cuando la ves.', strategies:['Usa colores y subrayados', 'Crea mapas mentales', 'Usa videos educativos'] },
        auditivo: { name:'APRENDIZ AUDITIVO', color:'#66CCCC', description:'Aprendes mejor escuchando y hablando.', strategies:['Graba tus notas', 'Explica en voz alta', 'Escucha podcasts'] },
        kinestesico: { name:'APRENDIZ KINESTÉSICO', color:'#FF6B9D', description:'Necesitas moverte y practicar para aprender.', strategies:['Toma notas a mano', 'Haz pausas activas', 'Practica con ejercicios'] }
      };
      const style = styleMap[predominant];
      const res = {
        studentName: studentName || 'Estudiante',
        date: date,
        counts: c,
        predominantStyle: predominant,
        styleDetails: style,
        percentage: Math.round((Math.max(...Object.values(c)) / 10) * 100),
        answers: nextAnswers
      };
      // store
      setDiagnosis(res);
      setPhase('result');
      setShowResults(true);
    }
  };

  const exportPDF = async () => {
    if (!diagnosis) return;
    const el = pdfTemplateRef.current;
    if (!el) return;
    const fileName = `Diagnostico_VAK_${(diagnosis.studentName || 'estudiante').replace(/\s+/g, '_')}_${diagnosis.date || date}`;
    const opt = {
      margin: [15,15,15,15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try { await html2pdf().set(opt).from(el).save(); } catch(e) { console.error('PDF error', e); }
  };

  // QA: generate PDFs programmatically for testing (optional in prod)
  const exportSamplePDFsForQA = async () => {
    const diag1 = generateSampleDiagnosis();
    await exportPDFForDiag(diag1);
    // Generate a second sample with a different style distribution
    const diag2 = { ...diag1, studentName: 'QA Usuario 2', counts: { visual: 2, auditivo: 7, kinestesico: 1 }, predominantStyle: 'auditivo', date: new Date().toLocaleDateString() };
    diag2.styleDetails = { name: 'APRENDIZ AUDITIVO', color: '#66CCCC', description: 'Aprendes mejor escuchando y hablando.', strategies: ['Graba tus notas', 'Explica en voz alta', 'Escucha podcasts'] };
    await exportPDFForDiag(diag2);
  };

  // Internal helper: render a small HTML block for a given diagnosis and export as PDF
  const exportPDFForDiag = async (diag) => {
    if (!diag) return;
    const opts = {
      margin: [15,15,15,15],
      filename: `Diagnostico_VAK_${(diag.studentName || 'estudiante').replace(/\s+/g, '_')}_${diag.date || new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // Build a simple HTML block for this diag
    const block = document.createElement('div');
    block.style.padding = '20px';
    block.innerHTML = `Diagnóstico VAK<br/>Nombre: ${diag.studentName}<br/>Fecha: ${diag.date}<br/>Perfil: ${diag.styleDetails.name}<br/>Porcentaje: ${diag.percentage}%`;
    const temp = document.createElement('div');
    temp.style.display = 'none';
    temp.appendChild(block);
    document.body.appendChild(temp);
    try {
      await html2pdf().set(opts).from(temp).save();
    } catch (e) {
      console.error('PDF QA error', e);
    }
    document.body.removeChild(temp);
  };

  // PDF Template (hidden)
  const PdfTemplate = () => (
    <div ref={pdfTemplateRef} style={{ display:'none' }}>
      {diagnosis && (
        <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>Diagnóstico VAK</div>
          {/* QR moved to the bottom of the PDF to reduce header clutter */}
        </div>
          <div>Nombre: {diagnosis.studentName}</div>
          <div>Fecha: {diagnosis.date}</div>
          <div>Perfil: {diagnosis.styleDetails.name}</div>
          <div>Porcentaje: {diagnosis.percentage}%</div>
          <div>Conteos: Visual {diagnosis.counts.visual}, Auditivo {diagnosis.counts.auditivo}, Kinestesico {diagnosis.counts.kinestesico}</div>
          {/* Resumen de respuestas omitido por indicación del usuario */}
          <div>Estrategias:</div>
          <ol>
            {diagnosis.styleDetails.strategies.map((s,i)=> <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}
      {diagnosis && (
        <div style={{ textAlign:'center', marginTop:'12px' }}>
          {buildResultsURL(diagnosis) && (
            <img src={buildResultsURL(diagnosis)} alt="QR" style={{ width: 100, height: 100 }} />
          )}
          <div style={{ fontSize: '10px', color: '#374151' }}>https://edutechlife.co/</div>
        </div>
      )}
      { /* Footer QR for PDF */ }
      {typeof PdfFooterQR === 'function' && PdfFooterQR()}
    </div>
  );
  
  // QR footer for PDF (bottom section) - render only when diagnosis exists
  const PdfFooterQR = () => (
    diagnosis ? (
      <div style={{ textAlign:'center', marginTop:'12px' }}>
        {buildResultsURL(diagnosis) && (
          <img src={buildResultsURL(diagnosis)} alt="QR" style={{ width: 100, height: 100 }} />
        )}
        <div style={{ fontSize: '10px', color: '#374151' }}>https://edutechlife.co/</div>
      </div>
    ) : null
  );

  // QR footer for PDF (location at bottom)
  // This will be rendered inside the PdfTemplate block as part of the hidden PDF content
  // The following block will be injected inline in the render where PdfTemplate is defined

  // Render
  return (
    <div className="diagnostico-vak" style={{ display:'flex', gap: 20 }}>
      <PdfTemplate />
      <div style={{ flex: 1 }}>
        {phase === 'intro' && (
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold" style={{ color:'#004B63' }}>Diagnóstico VAK</h2>
            <p className="text-[#64748B] mt-2">Una evaluación rápida para identificar tu estilo de aprendizaje.</p>
            <button className="mt-4 px-6 py-2 rounded bg-[#4DA8C4] text-white" onClick={startTest}>Iniciar</button>
          </div>
        )}
        {phase === 'calibration' && (
          <div className="p-4">
            <div className="mb-2">Nombre del estudiante</div>
            <input className="p-2 rounded w-full" placeholder="Escribe tu nombre" value={tempName} onChange={(e)=>setTempName(e.target.value)} />
            <div className="mt-2">¿Cómo te sientes hoy?</div>
            <input className="p-2 rounded w-full" placeholder="Describe tu ánimo" value={tempMood} onChange={(e)=>setTempMood(e.target.value)} />
            <button className="mt-3 px-4 py-2 rounded bg-[#4DA8C4] text-white" onClick={submitCalibration}>Continuar</button>
          </div>
        )}
        {phase === 'test' && (
          <div className="p-4">
            <div className="mb-2 text-sm text-[#64748B]">Pregunta {currentQuestion+1} de {QUESTIONS.length}</div>
            <div className="text-xl font-semibold text-white mb-2">{QUESTIONS[currentQuestion].text}</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {QUESTIONS[currentQuestion].options.map((opt, i) => (
                <button key={i} className="p-3 rounded bg-white/10 text-white" onClick={()=>handleAnswer(opt)}>
                  {String.fromCharCode(65+i)}. {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'result' && diagnosis && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" style={{ color: diagnosis.styleDetails.color }} />
              <span className="text-white">Perfil: {diagnosis.styleDetails.name}</span>
              <span className="text-white/60">({diagnosis.percentage}%)</span>
            </div>
            <div className="grid grid-cols-3 gap-4">            
              <div className="p-3 rounded bg-white/10" style={{ border:'1px solid '+diagnosis.styleDetails.color+'40' }}>
                <div className="text-xs text-[#64748B]">Visual</div>
                <div className="text-2xl font-bold" style={{ color:'#4DA8C4' }}>{diagnosis.counts.visual}</div>
              </div>
              <div className="p-3 rounded bg-white/10" style={{ border:'1px solid '+diagnosis.styleDetails.color+'40' }}>
                <div className="text-xs text-[#64748B]">Auditivo</div>
                <div className="text-2xl font-bold" style={{ color:'#66CCCC' }}>{diagnosis.counts.auditivo}</div>
              </div>
              <div className="p-3 rounded bg-white/10" style={{ border:'1px solid '+diagnosis.styleDetails.color+'40' }}>
                <div className="text-xs text-[#64748B]">Kinestésico</div>
                <div className="text-2xl font-bold" style={{ color:'#FF6B9D' }}>{diagnosis.counts.kinestesico}</div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded">
              <div className="text-sm font-semibold" style={{ color: diagnosis.styleDetails.color }}>Descripción</div>
              <div className="mt-1" style={{ color:'#374151' }}>{diagnosis.styleDetails.description}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {diagnosis.styleDetails.strategies.map((s, idx)=> (
                <div key={idx} className="p-3 rounded bg-white/10">
                  <div className="text-xs" style={{ color:'#64748B' }}>Estrategia {idx+1}</div>
                  <div className="mt-1">{s}</div>
                </div>
              ))}
            </div>
            <button className="px-4 py-2 rounded bg-[#4DA8C4] text-white" onClick={exportPDF}>Descargar PDF</button>
            {process.env.NODE_ENV === 'development' && (
              <button className="ml-2 px-3 py-2 rounded bg-gray-300 text-black" onClick={exportSamplePDFsForQA} title="QA: generar PDFs de prueba">
                QA PDFs
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden PDF template for html2pdf */}
      <div style={{ display:'none' }}>
        <div id="pdf-root">
          {diagnosis && (
            <div>
              <h1>Diagnóstico VAK</h1>
              <p>Nombre: {diagnosis.studentName}</p>
              <p>Fecha: {diagnosis.date}</p>
              <p>Perfil: {diagnosis.styleDetails.name}</p>
              <p>Porcentaje: {diagnosis.percentage}%</p>
              <p>Conteos: Visual {diagnosis.counts.visual}, Auditivo {diagnosis.counts.auditivo}, Kinestesico {diagnosis.counts.kinestesico}</p>
              <p>Respuestas:</p>
              <ul>
                {diagnosis.answers.map((a,i)=> <li key={i}>{i+1}. {a.text} - {a.type}</li>)}
              </ul>
              <p>Estrategias:</p>
              <ol>
                {diagnosis.styleDetails.strategies.map((s,i)=> <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticoVAK;
