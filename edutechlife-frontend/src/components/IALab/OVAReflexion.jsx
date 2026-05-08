import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Bot, BrainCircuit, BookOpen, Target, Zap, Award,
  CheckCircle, Volume2, Square, ChevronRight, Play, Star,
  Settings, ArrowRight, Check, Lightbulb, Shield, Users, Eye
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00BCD4] to-[#004B63] flex items-center justify-center shadow-sm text-white">
      <GraduationCap size={22} strokeWidth={2.5} />
    </div>
    <span className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
      <span className="text-[#00BCD4]">Edu</span><span className="text-[#004B63]">techlife</span>
    </span>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon = null, disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5",
    secondary: "bg-white text-[#004B63] border-2 border-[#E0F7FA] hover:border-[#00BCD4] hover:bg-[#F0FDFF]",
    outline: "bg-transparent text-[#00BCD4] border-2 border-[#00BCD4] hover:bg-[#00BCD4] hover:text-white",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#E0F7FA] text-[#004B63] hover:bg-[#B2EBF2]'}`} title="Escuchar con voz de Valerio">
      {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 md:p-8 ${className}`}>{children}</div>
);

const WelcomeScreen = ({ onNext }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in px-4">
    <div className="mb-8 transform hover:scale-105 transition-transform duration-500"><Logo /></div>
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#004B63] font-semibold text-sm mb-6">
      <Bot size={16} className="text-[#00BCD4]" /><span>Laboratorio Guiado por Valerio</span>
    </div>
    <h1 className="text-4xl md:text-6xl font-extrabold text-[#004B63] mb-6 leading-tight">
      Más Allá de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCD4] to-[#0097A7]">Usar la IA</span>
    </h1>
    <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
      Hola, soy Valerio, tu coach de IA. En este laboratorio reflexionaremos sobre la historia, la tecnología actual, la ética y el impacto social de la inteligencia artificial. ¡Comencemos!
    </p>
    <VoiceReader text="Hola, soy Valerio, tu coach de IA de Edutechlife. En este laboratorio exploraremos juntos el fascinante mundo de la IA: desde sus orígenes históricos hasta los desafíos éticos que enfrentamos hoy. Vamos a reflexionar y aprender." />
    <div className="mt-6"><Button onClick={onNext} icon={Play} className="text-lg px-8 py-4">Comenzar Laboratorio</Button></div>
  </div>
);

const HistoryScreen = ({ onNext, addXp }) => {
  useEffect(() => { addXp(50); }, []);
  const text = "La inteligencia artificial tiene una historia fascinante. Desde el término acuñado por John McCarthy en 1956, pasando por los inviernos de la IA, hasta el resurgimiento con deep learning en los años 2010.";
  const cards = [
    { title: 'Orígenes (1950s)', desc: 'El término "Inteligencia Artificial" fue acuñado por John McCarthy en 1956 durante la Conferencia de Dartmouth.', color: 'from-indigo-100 to-white' },
    { title: 'Inviernos de la IA', desc: 'Períodos de reducción de financiamiento y expectativas debido a limitaciones tecnológicas de la época.', color: 'from-blue-100 to-white' },
    { title: 'Resurgimiento (2010s)', desc: 'Avances en deep learning y disponibilidad de grandes conjuntos de datos revitalizaron el campo.', color: 'from-cyan-100 to-white' },
    { title: 'IA Actual', desc: 'Integración en la vida cotidiana: asistentes virtuales, recomendaciones, diagnóstico médico y más.', color: 'from-indigo-600 to-blue-500 text-white' }
  ];
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold text-[#004B63] mb-4">Historia de la Inteligencia Artificial</h2>
        <VoiceReader text={text} />
        <p className="text-gray-700 text-lg leading-relaxed mt-4 mb-6">{text}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {cards.map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.color} p-5 rounded-2xl shadow-md ${c.title === 'IA Actual' ? 'text-white' : ''}`}>
              <h4 className={`font-semibold text-lg mb-2 ${c.title === 'IA Actual' ? 'text-white' : 'text-indigo-700'}`}>{c.title}</h4>
              <p className={c.title === 'IA Actual' ? 'text-white/80' : 'text-gray-700'}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end"><Button onClick={onNext} icon={ChevronRight}>Siguiente</Button></div>
      </Card>
    </div>
  );
};

const TechScreen = ({ onNext, addXp }) => {
  useEffect(() => { addXp(50); }, []);
  const text = "Las tecnologías actuales de IA incluyen procesamiento del lenguaje natural, visión por computadora y sistemas de recomendación que transforman industrias enteras.";
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold text-[#004B63] mb-4">Tecnologías Actuales de IA</h2>
        <VoiceReader text={text} />
        <p className="text-gray-700 text-lg leading-relaxed mt-4 mb-6">{text}</p>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-md border border-slate-100">
            <Zap className="text-blue-500" size={32} />
            <div><h4 className="font-semibold text-indigo-700">Procesamiento del Lenguaje Natural</h4><p className="text-gray-600">Chatbots, traducción automática, análisis de sentimientos</p></div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-md border border-slate-100">
            <Eye className="text-cyan-500" size={32} />
            <div><h4 className="font-semibold text-indigo-700">Visión por Computadora</h4><p className="text-gray-600">Reconocimiento facial, detección de objetos, diagnóstico médico</p></div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-md border border-slate-100">
            <Target className="text-indigo-600" size={32} />
            <div><h4 className="font-semibold text-indigo-700">Sistemas de Recomendación</h4><p className="text-gray-600">Personalización de contenido, comercio electrónico, streaming</p></div>
          </div>
        </div>
        <div className="flex justify-end"><Button onClick={onNext} icon={ChevronRight}>Siguiente</Button></div>
      </Card>
    </div>
  );
};

const EthicsScreen = ({ onNext, addXp }) => {
  useEffect(() => { addXp(50); }, []);
  const [selected, setSelected] = useState(null);
  const text = "La ética en IA es fundamental. Debemos considerar el sesgo algorítmico, la privacidad de datos, la transparencia y el impacto laboral de estas tecnologías.";
  const areas = [
    { id: 'bias', title: 'Sesgo Algorítmico', icon: Users, desc: 'Sistemas de IA que perpetúan discriminación por datos históricos sesgados.', detail: 'Ejemplo: Un algoritmo de contratación que penaliza ciertos perfiles porque los datos históricos reflejan sesgos del pasado.' },
    { id: 'privacy', title: 'Privacidad de Datos', icon: Shield, desc: 'Protección de información personal en sistemas de IA.', detail: 'Ejemplo: Una app educativa que pide acceso a fotos y contactos sin justificación. Siempre revisa los permisos.' },
    { id: 'labor', title: 'Impacto Laboral', icon: Bot, desc: 'Automatización de tareas y transformación del mercado laboral.', detail: 'Ejemplo: La IA automatiza tareas repetitivas pero crea nuevas oportunidades en áreas como supervisión de sistemas y ética.' }
  ];
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold text-[#004B63] mb-4">Ética y Sociedad</h2>
        <VoiceReader text={text} />
        <p className="text-gray-700 text-lg leading-relaxed mt-4 mb-6">{text}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {areas.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)} className={`p-5 rounded-xl text-left transition-all ${selected === a.id ? 'bg-[#004B63] text-white shadow-lg scale-105' : 'bg-[#F0FDFF] border border-[#E0F7FA] hover:border-[#00BCD4]'}`}>
              <a.icon size={28} className={selected === a.id ? 'text-[#00BCD4]' : 'text-[#00BCD4]'} />
              <h3 className={`font-bold mt-2 ${selected === a.id ? 'text-white' : 'text-[#004B63]'}`}>{a.title}</h3>
              <p className={`text-sm mt-1 ${selected === a.id ? 'text-white/80' : 'text-gray-600'}`}>{a.desc}</p>
              {selected === a.id && <p className="text-sm mt-2 text-white/70 italic">{a.detail}</p>}
            </button>
          ))}
        </div>
        <div className="flex justify-end"><Button onClick={onNext} icon={ChevronRight}>Siguiente</Button></div>
      </Card>
    </div>
  );
};

const MatchingGame = ({ onNext, addXp }) => {
  useEffect(() => { addXp(100); }, []);
  const [matched, setMatched] = useState([]);
  const [selected, setSelected] = useState(null);
  const pairs = [
    { id: 1, term: 'Algoritmo', def: 'Conjunto de instrucciones paso a paso', matchId: 6 },
    { id: 2, term: 'Machine Learning', def: 'Rama de la IA que aprende de datos', matchId: 7 },
    { id: 3, term: 'Deep Learning', def: 'Redes neuronales profundas', matchId: 8 },
    { id: 6, term: 'Instrucciones paso a paso', def: 'Algoritmo', matchId: 1 },
    { id: 7, term: 'Aprende de datos', def: 'Machine Learning', matchId: 2 },
    { id: 8, term: 'Redes neuronales', def: 'Deep Learning', matchId: 3 }
  ];
  const handleClick = (id) => {
    if (matched.includes(id)) return;
    if (!selected) { setSelected(id); return; }
    const first = pairs.find(p => p.id === selected);
    const second = pairs.find(p => p.id === id);
    if (first.matchId === id || second.matchId === selected) setMatched([...matched, selected, id]);
    setSelected(null);
  };
  const allMatched = matched.length === pairs.length;
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <h2 className="text-3xl font-bold text-[#004B63] mb-4">Juego de Conceptos</h2>
        <p className="text-gray-600 mb-6">Empareja cada término con su definición correcta.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {pairs.map(p => (
            <button key={p.id} onClick={() => handleClick(p.id)} className={`p-4 rounded-xl transition-all ${matched.includes(p.id) ? 'bg-emerald-500 text-white' : selected === p.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-[#F0FDFF] border border-[#E0F7FA] hover:border-[#00BCD4]'}`}>
              <span className="font-medium text-sm">{p.term}</span>
            </button>
          ))}
        </div>
        {allMatched ? (
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-emerald-700">¡Todos los conceptos emparejados!</p>
            <Button onClick={onNext} icon={ChevronRight} className="mt-4 mx-auto">Siguiente</Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">{matched.length / 2} de {pairs.length / 2} pares</p>
        )}
      </Card>
    </div>
  );
};

const QuizScreen = ({ onNext, addXp }) => {
  const questions = [
    { q: "¿Quién acuñó el término 'Inteligencia Artificial'?", opts: ["Alan Turing", "John McCarthy", "Elon Musk", "Bill Gates"], correct: 1 },
    { q: "¿Qué tecnología permite a las máquinas aprender de datos?", opts: ["Blockchain", "Machine Learning", "Realidad Virtual", "Computación Cuántica"], correct: 1 },
    { q: "¿Cuál es un desafío ético importante en IA?", opts: ["Velocidad de procesamiento", "Sesgo algorítmico", "Costo de implementación", "Compatibilidad"], correct: 1 },
    { q: "¿Qué período se conoce como 'Invierno de la IA'?", opts: ["Gran crecimiento", "Reducción de financiamiento", "Invención de Internet", "Creación de ChatGPT"], correct: 1 }
  ];
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const handleAnswer = (index) => {
    setSelected(index);
    if (index === questions[currentQ].correct) { setScore(s => s + 1); addXp(125); }
    setTimeout(() => {
      if (currentQ < questions.length - 1) { setCurrentQ(c => c + 1); setSelected(null); }
      else setShowResult(true);
    }, 1500);
  };
  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      <h2 className="text-3xl font-bold text-[#004B63] mb-6 flex items-center gap-3"><CheckCircle className="text-[#00BCD4]" size={32}/> Evaluación Final</h2>
      {!showResult ? (
        <Card>
          <div className="flex justify-between items-center mb-6"><span className="text-sm font-semibold text-gray-500">Pregunta {currentQ + 1} de {questions.length}</span></div>
          <h3 className="text-xl font-medium text-gray-800 mb-6">{questions[currentQ].q}</h3>
          <div className="space-y-3">
            {questions[currentQ].opts.map((opt, i) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
              if (selected === null) btnClass += "border-gray-200 hover:border-[#00BCD4] hover:bg-[#F0FDFF]";
              else if (i === questions[currentQ].correct) btnClass += "bg-green-100 border-green-500 text-green-800 font-medium";
              else if (i === selected) btnClass += "bg-red-100 border-red-500 text-red-800";
              else btnClass += "opacity-50 border-gray-200";
              return <button key={i} onClick={() => selected === null && handleAnswer(i)} className={btnClass} disabled={selected !== null}><span className="font-bold text-[#004B63]">{String.fromCharCode(65 + i)}.</span> {opt}</button>;
            })}
          </div>
        </Card>
      ) : (
        <Card className="text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[#00BCD4] to-[#004B63] rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-cyan-200"><Award size={48} /></div>
          <h3 className="text-3xl font-bold text-[#004B63] mb-2">¡Evaluación Completada!</h3>
          <p className="text-xl text-gray-600 mb-6">Obtuviste <span className="font-bold text-[#00BCD4]">{score}</span> de <span className="font-bold">{questions.length}</span> aciertos.</p>
          {score === questions.length ? <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-8 border border-green-200"><p className="font-medium flex items-center justify-center gap-2"><Star className="text-yellow-500 fill-current" size={20}/> ¡Puntuación perfecta! Valerio está orgulloso de ti.</p></div>
            : score >= 2 ? <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 border border-blue-200"><p className="font-medium">¡Buen trabajo! Repasa los conceptos que te hayan quedado dudosos.</p></div>
            : <div className="bg-orange-50 text-orange-800 p-4 rounded-xl mb-8 border border-orange-200"><p className="font-medium">No te preocupes, repasa el laboratorio y vuelve a intentarlo. Valerio confía en ti.</p></div>}
          <Button onClick={onNext} icon={Award} className="w-full sm:w-auto text-lg py-3 px-8 mx-auto">Recibir Certificado</Button>
        </Card>
      )}
    </div>
  );
};

const CertificateScreen = ({ xp }) => (
  <div className="max-w-4xl mx-auto animate-fade-in text-center">
    <h2 className="text-4xl font-extrabold text-[#004B63] mb-4">¡Felicidades, Pensador Crítico!</h2>
    <p className="text-lg text-gray-600 mb-8">Has completado el laboratorio guiado por Valerio. Ahora comprendes la historia, tecnología y ética de la inteligencia artificial.</p>
    <div className="bg-gradient-to-br from-[#004B63] to-[#002635] p-1 rounded-3xl shadow-2xl mb-10 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500">
      <div className="bg-white rounded-[22px] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-100 rounded-tr-full opacity-50"></div>
        <div className="flex justify-center mb-6"><Logo /></div>
        <div className="text-sm font-bold tracking-widest text-[#00BCD4] uppercase mb-2">Certificado de Finalización</div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Laboratorio: Más Allá de Usar la IA</h3>
        <div className="flex justify-center gap-8 text-slate-600 border-t border-b border-slate-100 py-4 mb-6">
          <div><div className="text-xs uppercase tracking-wider">Puntaje XP</div><div className="text-xl font-bold text-[#004B63]">{xp} / 500</div></div>
          <div><div className="text-xs uppercase tracking-wider">Coach</div><div className="text-xl font-bold text-[#004B63]">Valerio</div></div>
          <div><div className="text-xs uppercase tracking-wider">Fecha</div><div className="text-xl font-bold text-[#004B63]">{new Date().toLocaleDateString()}</div></div>
        </div>
        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white shadow-lg border-4 border-white"><Award size={40} /></div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button onClick={() => window.location.reload()} variant="outline" icon={Settings}>Reiniciar Laboratorio</Button>
      <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y Valerio!')} icon={GraduationCap}>Explorar más cursos</Button>
    </div>
  </div>
);

export default function OVAReflexion() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [xp, setXp] = useState(0);
  const totalXp = 500;
  const addXp = (amount) => setXp(prev => Math.min(prev + amount, totalXp));
  const nextScreen = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentScreen(prev => prev + 1); };
  const screens = [
    <WelcomeScreen onNext={nextScreen} />,
    <HistoryScreen onNext={nextScreen} addXp={addXp} />,
    <TechScreen onNext={nextScreen} addXp={addXp} />,
    <EthicsScreen onNext={nextScreen} addXp={addXp} />,
    <MatchingGame onNext={nextScreen} addXp={addXp} />,
    <QuizScreen onNext={nextScreen} addXp={addXp} />,
    <CertificateScreen xp={xp} />
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFF] to-[#E0F7FA] font-sans selection:bg-[#00BCD4] selection:text-white">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="transform scale-75 origin-left sm:scale-100 transition-transform"><Logo /></div>
          {currentScreen > 0 && currentScreen < screens.length - 1 && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-semibold text-slate-500">Paso {currentScreen} de {screens.length - 2}</div>
              <div className="flex items-center gap-2 bg-[#F0FDFF] px-4 py-1.5 rounded-full border border-[#00BCD4]/20">
                <Star className="text-yellow-500 fill-current" size={16} />
                <span className="font-bold text-[#004B63]">{xp} XP</span>
              </div>
            </div>
          )}
        </div>
        {currentScreen > 0 && (
          <div className="h-1.5 w-full bg-slate-100">
            <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7] transition-all duration-1000 ease-out" style={{ width: `${(xp / totalXp) * 100}%` }} />
          </div>
        )}
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">{screens[currentScreen]}</main>
      {currentScreen > 0 && (
        <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-500 text-sm">
          <p>Laboratorio guiado por <strong className="text-[#00BCD4]">Valerio</strong> — Coach de IA de Edutechlife.</p>
        </footer>
      )}
    </div>
  );
}
