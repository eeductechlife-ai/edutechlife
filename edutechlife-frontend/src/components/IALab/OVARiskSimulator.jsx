import React, { useState, useEffect } from 'react';
import { Brain, Volume2, VolumeX, Award, Star } from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 shadow-sm' : 'bg-[#E0F7FA] text-[#004B63] hover:bg-[#B2EBF2] hover:shadow-md'
      }`} title="Escuchar con voz de Valerio">
      {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

const EdutechLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A5F] to-[#2FA8C6] rounded-xl rotate-3 shadow-md"></div>
      <Brain className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
      <span className="text-[#1E3A5F]">edu</span><span className="text-[#2FA8C6]">techlife</span>
    </div>
  </div>
);

const gameData = [
  {
    q: "Un sistema de IA genera una lista de 'Personajes Históricos Importantes' y todos son hombres europeos. ¿Qué sesgo identificas?",
    opts: ["Sesgo de datos históricos y representación.", "Sesgo de automatización.", "Error de red de internet."],
    correct: 0,
    feedback: "¡Correcto! Refleja la falta de diversidad y el sesgo cultural en los datos de entrenamiento."
  },
  {
    q: "Estás usando IA para un diagnóstico y arroja un resultado que contradice tu criterio profesional. ¿Cómo actúas?",
    opts: ["Acepto la IA porque es más inteligente que yo.", "Cuestiono el sesgo de automatización y verifico con expertos.", "Dejo que la IA decida la medicación."],
    correct: 1,
    feedback: "¡Excelente! No debes delegar la responsabilidad moral a un sistema que no puede asumirla."
  },
  {
    q: "Quieres que la IA escriba un cuento sobre liderazgo. Para evitar estereotipos de género, ¿qué haces?",
    opts: ["Borro la aplicación.", "Genero el cuento y confío en que la IA será justa.", "Reformulo el prompt pidiendo explícitamente inclusión y equidad de género."],
    correct: 2,
    feedback: "¡Muy bien! Instruir explícitamente a la IA es una gran estrategia de mitigación."
  }
];

const accordionData = [
  { id: 'acc1', title: 'Sesgo Geográfico y Cultural', icon: '🌍', content: 'Los modelos entrenados principalmente con datos del Norte Global generan respuestas con marcos culturales ajenos. Ejemplo: Ejemplos sobre historia, política o cultura que ignoran perspectivas latinoamericanas o africanas.' },
  { id: 'acc2', title: 'Sesgo de Representación y Género (Experimento Stanford)', icon: '👥', content: 'En 2023, investigadores pidieron a modelos de lenguaje: "Escribe la historia de un CEO exitoso". En el 78% de los casos, generó un hombre. Al pedir historias de "enfermeras", el 91% fueron mujeres. Esto muestra cómo los sesgos históricos se replican automáticamente.' },
  { id: 'acc3', title: 'Sesgo de Automatización', icon: '🤖', content: 'Las personas tienden a confiar más en las respuestas de una IA que en las de un humano. Ejemplo: Aceptar sin cuestionar un diagnóstico o recomendación de IA aunque contradiga el criterio experto.' }
];

const mitigations = [
  { title: 'Pensamiento Crítico', icon: '💡', desc: 'No aceptes ninguna respuesta de IA sin evaluar su coherencia, verificar datos clave y comparar con otras fuentes. Pregúntate: ¿De dónde viene esta afirmación?' },
  { title: 'Diversificar Fuentes', icon: '📚', desc: 'Complementa las respuestas de la IA con fuentes académicas, perspectivas de autores latinoamericanos y datos locales. La IA tiene un sesgo hacia el mundo anglosajón.' },
  { title: 'Asumir Responsabilidad', icon: '🛡️', desc: 'Cualquier contenido que publiques o entregues generado con IA es tu responsabilidad. Si contiene sesgos o errores, eres tú quien los respalda.' }
];

export default function OVARiskSimulator() {
  const [activeTab, setActiveTab] = useState('content');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [starIndex, setStarIndex] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [solvedStars, setSolvedStars] = useState([]);

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === gameData[starIndex].correct) setSolvedStars(prev => [...new Set([...prev, starIndex])]);
  };

  const resetGame = () => { setStarIndex(null); setSelectedAnswer(null); setShowFeedback(false); };

  const styles = `
    .tech-grid-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background-image: linear-gradient(to right, #EAEAEA 1px, transparent 1px), linear-gradient(to bottom, #EAEAEA 1px, transparent 1px); background-size: 50px 50px; opacity: 0.6; }
    .hologram-glow-1 { position: fixed; top: -15%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(47,168,198,0.15) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
    .hologram-glow-2 { position: fixed; bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(30,58,95,0.08) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
    .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(47, 168, 198, 0.15); box-shadow: 0 8px 32px rgba(31,38,135,0.1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(47, 168, 198, 0.3); border-radius: 4px; }
  `;

  const renderAccordion = () => (
    <div className="space-y-4">{[...Array(3)].map((_, i) => {
      const id = i + 1;
      const data = accordionData[i];
      const isOpen = openAccordion === id;
      return (
        <div key={id} className="glass-panel rounded-xl overflow-hidden shadow-sm">
          <button onClick={() => setOpenAccordion(isOpen ? null : id)}
            className="w-full text-left p-4 bg-white hover:bg-gray-50 flex justify-between items-center font-bold text-[#1E3A5F] text-base">
            <span><span className="mr-2">{data.icon}</span> {data.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {isOpen && <div className="p-5 bg-gray-50 border-t border-gray-100 text-gray-700 text-sm leading-relaxed">{data.content}</div>}
        </div>
      );
    })}</div>
  );

  const renderModal = () => {
    if (!openModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setOpenModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1E3A5F]">{openModal.title}</h3>
            <button onClick={() => setOpenModal(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">{openModal.desc}</p>
          <button onClick={() => setOpenModal(null)} className="w-full bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white font-bold py-3 px-4 rounded-xl transition hover:shadow-lg">Entendido</button>
        </div>
      </div>
    );
  };

  const renderStarGame = () => {
    if (starIndex === null) {
      return (
        <div className="text-center py-8">
          <h3 className="text-2xl font-black text-white mb-2 font-montserrat">🎮 Alcanza la Estrella Ética</h3>
          <p className="text-gray-300 mb-8">Resuelve los casos prácticos seleccionando las estrellas</p>
          <div className="flex justify-center gap-6">
            {gameData.map((_, i) => (
              <button key={i} onClick={() => setStarIndex(i)}
                className={`text-5xl transition-all duration-300 hover:scale-110 ${solvedStars.includes(i) ? 'text-yellow-400 opacity-70 pointer-events-none' : 'text-gray-400 hover:text-yellow-400'}`}
                disabled={solvedStars.includes(i)}>
                <Star size={48} fill={solvedStars.includes(i) ? '#FBBF24' : 'none'} />
              </button>
            ))}
          </div>
          {solvedStars.length === gameData.length && (
            <div className="mt-10 p-8 bg-emerald-50 rounded-3xl border-4 border-emerald-200">
              <Award size={64} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-black text-emerald-900 font-montserrat">¡Ética Activada!</h3>
              <p className="text-emerald-700 mt-2">Has completado el simulador de evaluación de riesgos.</p>
            </div>
          )}
        </div>
      );
    }

    const data = gameData[starIndex];
    return (
      <div className="text-center py-4">
        <Star size={40} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-6">{data.q}</h3>
        <div className="space-y-3 max-w-xl mx-auto">
          {data.opts.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${showFeedback ? (i === data.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : i === selectedAnswer ? 'border-red-500 bg-red-50 text-red-800' : 'border-gray-200 opacity-50') : 'border-gray-200 bg-white hover:border-[#2FA8C6] hover:bg-[#E0F7FA]'}`}>
              {String.fromCharCode(65 + i)} {opt}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl font-medium max-w-xl mx-auto ${selectedAnswer === data.correct ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
            {selectedAnswer === data.correct ? data.feedback : 'Incorrecto. Recuerda aplicar el pensamiento crítico.'}
          </div>
        )}
        {showFeedback && (
          <button onClick={resetGame} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
            Volver a estrellas
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full relative min-h-[500px]">
      <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <EdutechLogo />
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs font-semibold text-gray-500">Módulo 5: Ética de la IA</span>
            <VoiceReader text="Bienvenido al simulador de evaluación de riesgos de IA. Explora los contenidos educativos y completa el desafío de las estrellas éticas." />
          </div>
        </div>
        <div className="flex border-b border-gray-100">
          {[{ id: 'content', label: 'Contenido' }, { id: 'game', label: 'Desafío Estrellas' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === tab.id ? 'text-[#2FA8C6] border-b-2 border-[#2FA8C6] bg-[#E0F7FA]/30' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'content' && (
          <div className="space-y-10 animate-fade-in">
            <section className="glass-panel rounded-2xl p-8 text-center border-t-4 border-[#2FA8C6]">
              <h1 className="text-3xl md:text-4xl font-black text-[#1E3A5F] mb-4 font-montserrat">Ética de la Inteligencia Artificial</h1>
              <p className="text-lg text-gray-600 mb-6">Uso Responsable, Riesgos, Sesgos y Cómo Mitigarlos</p>
              <div className="flex justify-center gap-6 text-2xl">
                <span className="text-[#2FA8C6]" title="Justicia">⚖️</span>
                <span className="text-[#2FA8C6]" title="Privacidad">🛡️</span>
                <span className="text-[#2FA8C6]" title="Transparencia">🔍</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2 font-montserrat"><Brain size={24} className="text-[#2FA8C6]" /> Sesgos en la IA</h2>
              {renderAccordion()}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2 font-montserrat">🔧 Cómo Mitigar los Riesgos</h2>
              <p className="mb-4 text-gray-600 text-sm">Haz clic en cada tarjeta para descubrir cómo actuar:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mitigations.map((m, i) => (
                  <button key={i} onClick={() => setOpenModal(m)}
                    className="glass-panel p-6 rounded-xl flex flex-col items-center hover:bg-[#2FA8C6] hover:text-white transition-all group">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{m.icon}</span>
                    <span className="font-bold text-base text-center">{m.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="glass-panel p-8 rounded-2xl border-l-8 border-[#2FA8C6]">
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 font-montserrat">Decálogo del usuario ético de la IA</h2>
              <ul className="space-y-3 text-gray-700">
                {['Verifico siempre la información antes de usarla o compartirla.', 'Declaro cuándo uso IA en mis trabajos académicos y profesionales.', 'Uso la IA para aprender más y mejor, no para evitar el esfuerzo de aprender.', 'Recuerdo que detrás de cada sistema de IA hay decisiones humanas, y esas decisiones son cuestionables.'].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#2FA8C6] font-bold">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'game' && (
          <section className="bg-gradient-to-br from-[#1E3A5F] to-[#0D1B2A] p-8 rounded-2xl shadow-2xl animate-fade-in">
            {renderStarGame()}
          </section>
        )}
      </main>

      <footer className="text-center text-slate-400 text-xs py-4 border-t border-gray-100">
        Simulador guiado por <strong className="text-[#2FA8C6]">Valerio</strong> &mdash; Coach de IA de Edutechlife.
      </footer>

      {renderModal()}
      <style>{styles}</style>
    </div>
  );
}
