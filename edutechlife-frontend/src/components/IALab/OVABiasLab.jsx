import React, { useState, useEffect } from 'react';
import VoiceReader from './VoiceReader';
import { CheckCircle, XCircle, Award, Brain, Shield, AlertTriangle, Scale, Eye, Lock, Users, Zap, BookOpen, Gamepad2 } from 'lucide-react';

const BrainIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
  </svg>
);

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

const contentData = {
  intro: { title: "Introducción a la Ética en IA", text: "La inteligencia artificial ha llegado para transformar áreas como la medicina, la educación y la justicia. Pero su poder no la hace neutral. Los sistemas de IA toman decisiones que afectan a millones, y pueden ser incorrectas o injustas. Comprender esto es una competencia ciudadana urgente.", extended: "Este módulo ofrece herramientas para usar la IA con responsabilidad, reconocer riesgos y mitigar sesgos algorítmicos." },
  cap1: {
    title: "1. Fundamentos Éticos", text: "La ética de la IA estudia los valores y normas que deben guiar su diseño y uso, buscando siempre el bienestar de todas las personas.",
    principles: [
      { icon: <Scale className="w-5 h-5"/>, name: "Equidad y justicia", desc: "No debe discriminar ni favorecer a grupos específicos." },
      { icon: <Eye className="w-5 h-5"/>, name: "Transparencia", desc: "Los usuarios deben entender cómo y por qué la IA toma decisiones." },
      { icon: <Lock className="w-5 h-5"/>, name: "Privacidad", desc: "Protección de datos personales y uso con consentimiento." },
      { icon: <Shield className="w-5 h-5"/>, name: "Responsabilidad", desc: "Siempre debe haber un humano o institución responsable." },
      { icon: <Users className="w-5 h-5"/>, name: "Beneficio social", desc: "Debe mejorar el bienestar de toda la sociedad." }
    ]
  },
  cap2: {
    title: "2. Uso Adecuado de la IA", text: "El uso adecuado es un uso consciente que no reemplaza el pensamiento crítico ni la autoría intelectual.",
    dos: ["Usar IA para generar borradores y enriquecerlos con criterio propio.", "Citar explícitamente el uso de IA en trabajos académicos.", "Verificar datos en fuentes primarias para evitar alucinaciones.", "Usar la IA como tutor para ampliar el aprendizaje."],
    toolTitle: "Herramienta Destacada: NotebookLM", toolDesc: "NotebookLM es un ejemplo de cómo usar la IA de forma responsable para la investigación, permitiendo centralizar fuentes y verificar información con citas directas."
  },
  cap3: {
    title: "3. Riesgos y Desventajas", text: "Reconocer los riesgos permite usar la tecnología con mayor inteligencia y precaución.",
    risks: [
      { name: "Alucinaciones", desc: "Generación de información falsa con apariencia de verdad (ej. citas legales inexistentes)." },
      { name: "Impacto Laboral", desc: "Automatización de empleos rutinarios y necesidad de reconversión." },
      { name: "Privacidad y Vigilancia", desc: "Riesgos por reconocimiento facial y análisis de datos masivos." },
      { name: "Concentración de Poder", desc: "Decisiones globales tomadas por pocas empresas tecnológicas." }
    ],
    critical: "Dependencia Cognitiva: Delegar el pensamiento a la IA reduce la capacidad de argumentar y memorizar aprendizajes profundos."
  },
  cap4: {
    title: "4. Sesgos en la IA", text: "Los sesgos son errores sistemáticos que reflejan desigualdades históricas presentes en los datos de entrenamiento.",
    biases: [
      { name: "Sesgo de datos históricos", desc: "Refleja discriminaciones pasadas (ej. preferencia de género en empleos)." },
      { name: "Sesgo de representación", desc: "Subrepresentación de minorías (ej. errores en reconocimiento facial de piel oscura)." },
      { name: "Sesgo de automatización", desc: "Confianza excesiva en la IA sobre el criterio experto humano." },
      { name: "Sesgo cultural", desc: "Marcos culturales ajenos que ignoran perspectivas locales." }
    ]
  }
};

const gameData = [
  { id: 1, case: "Un abogado usa IA para un juicio y presenta leyes que no existen.", concept: "Alucinación del Modelo" },
  { id: 2, case: "Un sistema de becas rechaza a candidatos solo por su código postal.", concept: "Sesgo de Datos Históricos" },
  { id: 3, case: "Un estudiante deja de leer libros porque la IA le hace todos los resúmenes.", concept: "Dependencia Cognitiva" },
  { id: 4, case: "Un banco no puede explicar por qué su algoritmo negó un préstamo.", concept: "Falta de Transparencia" },
  { id: 5, case: "Un usuario asume que la IA tiene la razón aunque contradiga su manual técnico.", concept: "Sesgo de Automatización" }
];

export default function OVABiasLab() {
  const [activeSection, setActiveSection] = useState('intro');
  const [shuffledCases, setShuffledCases] = useState([]);
  const [shuffledConcepts, setShuffledConcepts] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setShuffledCases([...gameData].sort(() => Math.random() - 0.5));
    setShuffledConcepts([...gameData].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (selectedCase && selectedConcept) {
      if (selectedCase.id === selectedConcept.id) { setMatchedPairs([...matchedPairs, selectedCase.id]); setSelectedCase(null); setSelectedConcept(null); }
      else { setIsError(true); setTimeout(() => { setIsError(false); setSelectedCase(null); setSelectedConcept(null); }, 800); }
    }
  }, [selectedCase, selectedConcept]);

  const navItems = [
    { id: 'intro', icon: <BookOpen size={18}/>, label: 'Inicio' },
    { id: 'cap1', icon: <Scale size={18}/>, label: 'Fundamentos' },
    { id: 'cap2', icon: <Shield size={18}/>, label: 'Uso Adecuado' },
    { id: 'cap3', icon: <AlertTriangle size={18}/>, label: 'Riesgos' },
    { id: 'cap4', icon: <Brain size={18}/>, label: 'Sesgos' },
    { id: 'game', icon: <Gamepad2 size={18}/>, label: 'Reto' },
  ];



  return (
    <div className="w-full bg-blue-50 dark:bg-slate-900 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative min-h-[500px]">
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
      <aside className="w-full md:w-64 bg-white/90 dark:bg-slate-800/90 flex flex-col shadow-xl z-10 md:min-h-screen border-r border-blue-100">
        <div className="p-6 text-center border-b border-blue-50">
          <EdutechLogo />
          <p className="text-[10px] uppercase mt-2 text-slate-600 dark:text-slate-300 font-bold tracking-[0.2em]">Ética e Inteligencia Artificial</p>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-max md:min-w-0 ${activeSection === item.id ? 'bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white font-semibold shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-[#E0F7FA] hover:text-[#004B63]'}`}>
              {item.icon}<span className="text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-50">
          <VoiceReader text={activeSection === 'intro' ? contentData.intro.text + ' ' + contentData.intro.extended : contentData[activeSection]?.text || 'Bienvenido al laboratorio de ética en IA'} />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative" style={{ maxHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto bg-white/85 dark:bg-slate-800/85 backdrop-blur-[20px] border border-[#2FA8C6]/15 shadow-[0_10px_40px_rgba(30,58,95,0.08)] rounded-3xl p-6 md:p-10 min-h-[80vh] flex flex-col relative z-10 border-t-4 border-t-[#2FA8C6]">
          {activeSection === 'intro' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl md:text-4xl font-black text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData.intro.title}</h2>
              <div className="w-full h-64 md:h-80 rounded-2xl mb-8 overflow-hidden shadow-xl border border-[#EAEAEA]">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000" alt="Ética IA" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{contentData.intro.text}</p>
              <div className="mt-6 p-6 bg-[#E0F7FA] border-l-8 border-[#2FA8C6] rounded-r-2xl italic text-[#1E3A5F] dark:text-slate-100 font-medium">"{contentData.intro.extended}"</div>
            </div>
          )}

          {activeSection === 'cap2' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData.cap2.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="space-y-4">
                  <p className="text-base text-slate-600 dark:text-slate-300">{contentData.cap2.text}</p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><CheckCircle size={18}/> Prácticas Responsables</h3>
                    <ul className="space-y-3">{contentData.cap2.dos.map((item, i) => (<li key={i} className="flex gap-3 text-emerald-900 dark:text-emerald-100 text-sm bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-emerald-50"><Zap size={14} className="mt-1 flex-shrink-0 text-emerald-500"/> {item}</li>))}</ul>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#0D1B2A] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center border-b-8 border-[#2FA8C6]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#2FA8C6] rounded-xl"><Zap size={24}/></div>
                    <h3 className="text-xl font-bold">{contentData.cap2.toolTitle}</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-6">{contentData.cap2.toolDesc}</p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs uppercase tracking-widest text-[#2FA8C6] font-bold mb-2">Caso de Estudio</p>
                    <p className="text-sm italic">"Domina NotebookLM como tu asistente definitivo para evitar alucinaciones."</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'cap1' || activeSection === 'cap3' || activeSection === 'cap4') && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 font-montserrat">{contentData[activeSection].title}</h2>
              <p className="text-base text-slate-600 dark:text-slate-300 mb-8">{contentData[activeSection].text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(contentData[activeSection].principles || contentData[activeSection].risks || contentData[activeSection].biases).map((item, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6] transition-all group">
                    <h4 className="font-bold text-[#1E3A5F] dark:text-slate-100 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2FA8C6] group-hover:scale-150 transition-transform"></div>
                      {item.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              {activeSection === 'cap3' && (
                <div className="mt-6 p-6 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 rounded-2xl">
                  <h4 className="text-rose-700 dark:text-rose-300 font-black uppercase text-xs mb-2">⚠️ Atención</h4>
                  <p className="text-rose-900 dark:text-rose-100 font-medium">{contentData.cap3.critical}</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'game' && (
            <div className="flex flex-col h-full items-center justify-center text-center animate-[fadeIn_0.6s_ease-out_forwards]">
              {matchedPairs.length < gameData.length ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-[#1E3A5F] dark:text-slate-100 mb-2 font-montserrat">Desafío de Casos Reales</h2>
                    <p className="text-slate-500 dark:text-slate-400">Relaciona cada caso con el concepto ético correcto</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-3">{shuffledCases.map(item => (
                      <button key={item.id} disabled={matchedPairs.includes(item.id)} onClick={() => setSelectedCase(item)}
                        className={`w-full p-4 text-left text-sm rounded-2xl border-2 transition-all ${matchedPairs.includes(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300 opacity-50' : selectedCase?.id === item.id ? 'border-[#2FA8C6] bg-[#E0F7FA] shadow-md scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6]'} ${isError && selectedCase?.id === item.id ? 'animate-[shake_0.4s_ease-in-out] border-rose-400 bg-rose-50 dark:bg-rose-900/20' : ''}`}>
                        {item.case}
                      </button>
                    ))}</div>
                    <div className="space-y-3">{shuffledConcepts.map(item => (
                      <button key={item.id} disabled={matchedPairs.includes(item.id)} onClick={() => setSelectedConcept(item)}
                        className={`w-full p-4 text-center font-bold rounded-2xl border-2 transition-all ${matchedPairs.includes(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300 opacity-50' : selectedConcept?.id === item.id ? 'border-[#2FA8C6] bg-[#E0F7FA] shadow-md scale-105' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#2FA8C6]'} ${isError && selectedConcept?.id === item.id ? 'animate-[shake_0.4s_ease-in-out] border-rose-400 bg-rose-50 dark:bg-rose-900/20' : ''}`}>
                        {item.concept}
                      </button>
                    ))}</div>
                  </div>
                </>
              ) : (
                <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border-4 border-emerald-200 flex flex-col items-center">
                  <Award className="w-24 h-24 text-emerald-500 mb-4 animate-bounce" />
                  <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 font-montserrat">¡Pensamiento Crítico Activado!</h2>
                  <p className="text-emerald-700 dark:text-emerald-300 mt-2">Has superado el laboratorio de Ética en IA.</p>
                  <button onClick={() => { setActiveSection('intro'); setMatchedPairs([]); }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                    Volver al inicio
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="mt-4 text-center text-slate-600 dark:text-slate-300 text-xs py-4">
          Laboratorio guiado por <strong className="text-[#2FA8C6]">Valerio</strong> &mdash; Coach de IA de Edutechlife.
        </footer>
      </main>
      
    </div>
  );
}
