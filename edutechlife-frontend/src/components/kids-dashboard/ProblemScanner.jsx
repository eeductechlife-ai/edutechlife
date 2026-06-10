import { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const sbj = [
  { v: 'matematicas', l: 'Matemáticas', i: '🔢' },
  { v: 'lenguaje', l: 'Lenguaje', i: '📖' },
  { v: 'ciencias', l: 'Ciencias', i: '🔬' },
  { v: 'historia', l: 'Historia', i: '🏛️' },
  { v: 'ingles', l: 'Inglés', i: '🌎' },
  { v: 'arte', l: 'Arte', i: '🎨' },
];
const gd = 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]';
const gd2 = 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4]';
const dc = (dm, light, dark) => dm ? dark : light;

const ProblemScanner = memo(() => {
  const { setDocumentForDani, darkMode: dm } = useSmartBoardKids();
  const [mode, setMode] = useState('scan');
  const [img, setImg] = useState(null);
  const [subj, setSubj] = useState('');
  const [desc, setDesc] = useState('');
  const ref = useRef(null);
  const sl = sbj.find((s) => s.v === subj)?.l || subj;

  const hf = (f) => {
    if (!f?.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = (e) => setImg(e.target.result);
    r.readAsDataURL(f);
  };

  const hc = useCallback(() => { setMode('processing'); setTimeout(() => setMode('result'), 1200); }, []);
  const ha = useCallback(() => {
    setDocumentForDani({
      type: 'problem_scanner', subject: sl,
      summary: `Necesito ayuda con un problema de ${sl}${desc ? `: ${desc}` : ''}. El estudiante tomó una foto del problema.`,
      description: desc, hasImage: !!img,
    });
    document.getElementById('openDaniChat')?.click();
  }, [sl, desc, img, setDocumentForDani]);
  const hr = useCallback(() => { setMode('scan'); setImg(null); setSubj(''); setDesc(''); }, []);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-lg shadow-md">📸</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Escáner de Problemas</h3>
          <p className={`text-xs ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>Toma una foto y Dani te ayudará paso a paso</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); hf(e.dataTransfer.files[0]); }}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer backdrop-blur-xl ${
                img
                  ? 'border-[#66CCCC] bg-[#66CCCC]/10'
                  : dc(dm, 'border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50', 'bg-[#1E293B]/70 border-[#334155] hover:border-[#4DA8C4]/30')
              }`}
            >
              {img ? (
                <div className="relative">
                  <img src={img} alt="Vista previa" className="w-full max-h-64 object-contain rounded-xl shadow-md" />
                  <motion.button onClick={() => setImg(null)} whileHover={{ scale: 1.1 }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-400 text-white rounded-full text-sm font-bold shadow-lg">×</motion.button>
                </div>
              ) : (
                <>
                  <motion.div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-3xl">📷</span>
                  </motion.div>
                  <p className={`text-lg font-semibold mb-2 ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Toma o sube la foto de tu problema</p>
                  <p className={`text-sm mb-4 ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>Arrastra una imagen o usa los botones</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button onClick={() => ref.current?.click()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`flex-1 py-4 ${gd} text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2`}>
                <span className="text-2xl">📸</span> Tomar foto
              </motion.button>
              <motion.button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = (e) => { const f = e.target.files[0]; if (f) hf(f); }; i.click(); }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex-1 py-4 bg-white border-2 border-[#4DA8C4] text-[#004B63] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-md">
                <span className="text-2xl">🖼️</span> Subir imagen
              </motion.button>
            </div>

            <input ref={ref} type="file" accept="image/*" capture="environment" onChange={(e) => { const f = e.target.files[0]; if (f) hf(f); }} className="hidden" />

            <div>
              <label className={`text-sm font-semibold mb-2 block ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Materia:</label>
              <div className="grid grid-cols-3 gap-2">
                {sbj.map((s) => (
                  <motion.button key={s.v} onClick={() => setSubj(s.v)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      subj === s.v
                        ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold'
                        : dc(dm, 'border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30', 'bg-[#1E293B] border-[#334155] text-[#94A3B8]')
                    }`}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <span className="mr-1">{s.i}</span>{s.l}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-sm font-semibold mb-2 block ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Describe el problema (opcional):</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="Ej: Ecuación de segundo grado, problema de fracciones..." rows={2}
                className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:border-[#4DA8C4] placeholder-[#94A3B8] ${
                  dm ? 'bg-[#1E293B] border-[#334155] text-[#E2F0FF]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63]'
                }`} />
            </div>

            <motion.button onClick={hc} disabled={!img || !subj}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`w-full py-4 ${gd2} text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
              🤖 Preguntar a Dani
            </motion.button>
          </motion.div>
        )}

        {mode === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12">
            <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-6 shadow-xl"
              animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <span className="text-4xl">🔍</span>
            </motion.div>
            <h4 className={`text-xl font-bold mb-2 ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Dani está analizando tu problema...</h4>
            <p className={`text-sm ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>Preparando la explicación paso a paso</p>
            <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div className={`h-full ${gd}`} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
            </div>
          </motion.div>
        )}

        {mode === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            <div className={`rounded-2xl border overflow-hidden shadow-md ${dm ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className={`${gd2} p-4 text-white`}>
                <h4 className="font-bold text-lg">✅ Problema listo para Dani</h4>
                <p className="text-white/70 text-sm mt-1">{sl}</p>
              </div>
              <div className="p-5 space-y-4">
                {img && <img src={img} alt="Problema" className="w-full max-h-72 object-contain rounded-xl border border-[#E2E8F0] shadow-sm" />}
                {desc && <p className={`text-sm leading-relaxed ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}><span className="font-semibold text-[#004B63]">Descripción:</span> {desc}</p>}
                <div className={`p-4 rounded-xl border ${dm ? 'bg-[#0F172A] border-[#334155]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
                  <p className={`text-xs ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>
                    🤖 Dani recibirá la información de tu problema y te guiará con una explicación paso a paso adaptada a tu estilo de aprendizaje.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button onClick={ha} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 ${gd} text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2`}>
                🤖 Hablar con Dani
              </motion.button>
              <motion.button onClick={hr} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-4 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-2xl font-bold shadow-sm hover:border-[#4DA8C4]/30">
                ↻ Nuevo
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProblemScanner.displayName = 'ProblemScanner';
export { ProblemScanner };
export default ProblemScanner;
