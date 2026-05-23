import React, { useState, useEffect } from 'react';
import VoiceReader from './VoiceReader';
import { Brain, Award, Star } from 'lucide-react';

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

  const renderAccordion = () => (
    <div className="space-y-4">{[...Array(3)].map((_, i) => {
      const id = i + 1;
      const data = accordionData[i];
      const isOpen = openAccordion === id;
      return (
        <div key={id} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] rounded-xl overflow-hidden">
          <button onClick={() => setOpenAccordion(isOpen ? null : id)}
            className="w-full text-left p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex justify-between items-center font-bold text-[#1E3A5F] dark:text-slate-100 text-base">
            <span><span className="mr-2">{data.icon}</span> {data.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {isOpen && <div className="p-5 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{data.content}</div>}
        </div>
      );
    })}</div>
  );

  const renderModal = () => {
    if (!openModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setOpenModal(null)}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-slate-100">{openModal.title}</h3>
            <button onClick={() => setOpenModal(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
          </div>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6">{openModal.desc}</p>
          <button onClick={() => setOpenModal(null)} className="w-full bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white font-bold py-3 px-4 rounded-xl transition hover:shadow-lg">Entendido</button>
        </div>
      </div>
    );
  };

  const renderStarGame = () => {
    if (starIndex === null) {
      return (
        <div className="text-center py-8">
          <h3 className="text-2xl font-black text-white mb-2">🎮 Alcanza la Estrella Ética</h3>
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
            <div className="mt-10 p-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl border-4 border-emerald-200 dark:border-emerald-700">
              <Award size={64} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-100">¡Ética Activada!</h3>
              <p className="text-emerald-700 dark:text-emerald-300 mt-2">Has completado el simulador de evaluación de riesgos.</p>
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
              className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${showFeedback ? (i === data.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : i === selectedAnswer ? 'border-red-500 bg-red-50 text-red-800' : 'border-gray-200 opacity-50') : 'border-gray-200 bg-white dark:bg-slate-800 hover:border-[#2FA8C6] hover:bg-[#E0F7FA] dark:hover:bg-slate-700'}`}>
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
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" />
      <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <EdutechLogo />
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs font-semibold text-gray-500 dark:text-slate-400">Módulo 5: Ética de la IA</span>
            <VoiceReader text="Bienvenido al simulador de evaluación de riesgos de IA. Explora los contenidos educativos y completa el desafío de las estrellas éticas." />
          </div>
        </div>
        <div className="flex border-b border-gray-100 dark:border-slate-700">
          {[{ id: 'content', label: 'Contenido' }, { id: 'game', label: 'Desafío Estrellas' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === tab.id ? 'text-[#2FA8C6] border-b-2 border-[#2FA8C6] bg-[#E0F7FA]/30' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'content' && (
          <div className="space-y-10 animate-[fadeIn_0.6s_ease-out_forwards]">
            <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] rounded-2xl p-8 text-center border-t-4 border-[#2FA8C6]">
              <h1 className="text-3xl md:text-4xl font-black text-[#1E3A5F] dark:text-slate-100 mb-4">Ética de la Inteligencia Artificial</h1>
              <p className="text-lg text-gray-600 dark:text-slate-300 mb-6">Uso Responsable, Riesgos, Sesgos y Cómo Mitigarlos</p>
              <div className="flex justify-center gap-6 text-2xl">
                <span className="text-[#2FA8C6]" title="Justicia">⚖️</span>
                <span className="text-[#2FA8C6]" title="Privacidad">🛡️</span>
                <span className="text-[#2FA8C6]" title="Transparencia">🔍</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 flex items-center gap-2"><Brain size={24} className="text-[#2FA8C6]" /> Sesgos en la IA</h2>
              {renderAccordion()}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 flex items-center gap-2">🔧 Cómo Mitigar los Riesgos</h2>
              <p className="mb-4 text-gray-600 dark:text-slate-300 text-sm">Haz clic en cada tarjeta para descubrir cómo actuar:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mitigations.map((m, i) => (
                  <button key={i} onClick={() => setOpenModal(m)}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 rounded-xl flex flex-col items-center hover:bg-[#2FA8C6] hover:text-white transition-all group">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{m.icon}</span>
                    <span className="font-bold text-base text-center">{m.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-8 rounded-2xl border-l-8 border-[#2FA8C6]">
              <h2 className="text-2xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-4">Decálogo del usuario ético de la IA</h2>
              <ul className="space-y-3 text-gray-700 dark:text-slate-300">
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
          <section className="bg-gradient-to-br from-[#1E3A5F] to-[#0D1B2A] p-8 rounded-2xl shadow-2xl animate-[fadeIn_0.6s_ease-out_forwards]">
            {renderStarGame()}
          </section>
        )}
      </main>

      <footer className="text-center text-slate-600 dark:text-slate-400 text-xs py-4 border-t border-gray-100 dark:border-slate-700">
        Simulador guiado por <strong className="text-[#2FA8C6]">Valerio</strong> &mdash; Coach de IA de Edutechlife.
      </footer>

      {renderModal()}
      
    </div>
  );
}
